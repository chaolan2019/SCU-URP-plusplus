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

(()=>{function nr(o){let n=String(o).replace("#","").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return n?{r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16)}:{r:30,g:58,b:95}}function Pr(o,n,c){return"#"+[o,n,c].map(d=>Math.max(0,Math.min(255,Math.round(d))).toString(16).padStart(2,"0")).join("")}function Yt(o){let n=String(o||"").trim();return n?(n[0]!=="#"&&(n="#"+n),/^#[0-9a-fA-F]{6}$/.test(n)?n.toUpperCase():""):""}function ko(o,n){let{r:c,g:d,b:u}=nr(o),k=1-n;return Pr(c*k,d*k,u*k)}function _e(o,n){let{r:c,g:d,b:u}=nr(o);return`rgba(${c},${d},${u},${n})`}function Ft(o,n,c){let d=nr(Yt(o)||"#FFFFFF"),u=nr(Yt(n)||"#FFFFFF"),k=Math.max(0,Math.min(1,Number(c)||0));return Pr(d.r+(u.r-d.r)*k,d.g+(u.g-d.g)*k,d.b+(u.b-d.b)*k)}function Ao(o,n){if(typeof o!="function")throw new TypeError(`${n} must be a function`)}function da(o){if(!o||typeof o!="object")throw new TypeError("feature definition must be an object");let n=String(o.id||"").trim();if(!n)throw new TypeError("feature id is required");return Ao(o.matches,`${n}.matches`),Ao(o.mount,`${n}.mount`),Ao(o.unmount,`${n}.unmount`),Object.freeze({id:n,matches:o.matches,mount:o.mount,unmount:o.unmount})}function Ip(o){if(!Array.isArray(o))throw new TypeError("features must be an array");let n=o.map(da),c=new Set;n.forEach(S=>{if(c.has(S.id))throw new Error(`duplicate feature id: ${S.id}`);c.add(S.id)});let d=null,u=null;function k(){if(!d)return;let S=d,y=u;d=null,u=null,S.unmount(y)}function P(S={}){let y=n.find(g=>g.matches(S));if(y&&d===y&&S.lifecycleKey!==void 0&&u?.lifecycleKey===S.lifecycleKey)try{return y.mount(S),u=S,y.id}catch(g){throw k(),g}if(k(),!y)return null;try{return y.mount(S),d=y,u=S,y.id}catch(g){try{y.unmount(S)}catch{}throw g}}return Object.freeze({refresh:P,unmount:k,getActiveFeatureId:()=>d?.id||null,listFeatureIds:()=>n.map(S=>S.id)})}function X(o){return String(o||"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function So(o){let n=String(o||"").match(/@version\s+([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)/i);return n?n[1]:""}function $p(o){return String(o||"0").replace(/^v/i,"").split(/[.+\-]/).filter(Boolean).map(n=>/^\d+$/.test(n)?parseInt(n,10):n)}function zr(o,n){let c=$p(o),d=$p(n),u=Math.max(c.length,d.length);for(let k=0;k<u;k+=1){let P=c[k]==null?0:c[k],S=d[k]==null?0:d[k];if(typeof P=="number"&&typeof S=="number"){if(P>S)return 1;if(P<S)return-1;continue}let g=String(P),v=String(S);if(g>v)return 1;if(g<v)return-1}return 0}var Bc=typeof TextEncoder<"u"?new TextEncoder:{encode:o=>Uint8Array.from(Buffer.from(o,"utf8"))};function Lr(o){return typeof o=="string"?Bc.encode(o):o instanceof Uint8Array?o:ArrayBuffer.isView(o)?new Uint8Array(o.buffer,o.byteOffset,o.byteLength):new Uint8Array(o)}var Fc=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function ie(o,n){return o>>>n|o<<32-n}function Po(o){let n=Lr(o),c=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),d=n.length,u=Math.floor(d/536870912),k=d<<3>>>0,P=(d+8>>6<<6)+64,S=new Uint8Array(P);S.set(n),S[d]=128;let y=new DataView(S.buffer);y.setUint32(P-8,u),y.setUint32(P-4,k);let _=new Uint32Array(64);for(let v=0;v<P;v+=64){for(let M=0;M<16;M+=1)_[M]=y.getUint32(v+M*4);for(let M=16;M<64;M+=1){let q=ie(_[M-15],7)^ie(_[M-15],18)^_[M-15]>>>3,D=ie(_[M-2],17)^ie(_[M-2],19)^_[M-2]>>>10;_[M]=_[M-16]+q+_[M-7]+D>>>0}let L=c[0],C=c[1],f=c[2],h=c[3],w=c[4],x=c[5],E=c[6],z=c[7];for(let M=0;M<64;M+=1){let q=ie(w,6)^ie(w,11)^ie(w,25),D=w&x^~w&E,$=z+q+D+Fc[M]+_[M]>>>0,j=ie(L,2)^ie(L,13)^ie(L,22),G=L&C^L&f^C&f,U=j+G>>>0;z=E,E=x,x=w,w=h+$>>>0,h=f,f=C,C=L,L=$+U>>>0}c[0]=c[0]+L>>>0,c[1]=c[1]+C>>>0,c[2]=c[2]+f>>>0,c[3]=c[3]+h>>>0,c[4]=c[4]+w>>>0,c[5]=c[5]+x>>>0,c[6]=c[6]+E>>>0,c[7]=c[7]+z>>>0}let g=new Uint8Array(32);for(let v=0;v<8;v+=1)g[v*4]=c[v]>>>24,g[v*4+1]=c[v]>>>16,g[v*4+2]=c[v]>>>8,g[v*4+3]=c[v];return g}var Dc=[0x428a2f98d728ae22n,0x7137449123ef65cdn,0xb5c0fbcfec4d3b2fn,0xe9b5dba58189dbbcn,0x3956c25bf348b538n,0x59f111f1b605d019n,0x923f82a4af194f9bn,0xab1c5ed5da6d8118n,0xd807aa98a3030242n,0x12835b0145706fben,0x243185be4ee4b28cn,0x550c7dc3d5ffb4e2n,0x72be5d74f27b896fn,0x80deb1fe3b1696b1n,0x9bdc06a725c71235n,0xc19bf174cf692694n,0xe49b69c19ef14ad2n,0xefbe4786384f25e3n,0x0fc19dc68b8cd5b5n,0x240ca1cc77ac9c65n,0x2de92c6f592b0275n,0x4a7484aa6ea6e483n,0x5cb0a9dcbd41fbd4n,0x76f988da831153b5n,0x983e5152ee66dfabn,0xa831c66d2db43210n,0xb00327c898fb213fn,0xbf597fc7beef0ee4n,0xc6e00bf33da88fc2n,0xd5a79147930aa725n,0x06ca6351e003826fn,0x142929670a0e6e70n,0x27b70a8546d22ffcn,0x2e1b21385c26c926n,0x4d2c6dfc5ac42aedn,0x53380d139d95b3dfn,0x650a73548baf63den,0x766a0abb3c77b2a8n,0x81c2c92e47edaee6n,0x92722c851482353bn,0xa2bfe8a14cf10364n,0xa81a664bbc423001n,0xc24b8b70d0f89791n,0xc76c51a30654be30n,0xd192e819d6ef5218n,0xd69906245565a910n,0xf40e35855771202an,0x106aa07032bbd1b8n,0x19a4c116b8d2d0c8n,0x1e376c085141ab53n,0x2748774cdf8eeb99n,0x34b0bcb5e19b48a8n,0x391c0cb3c5c95a63n,0x4ed8aa4ae3418acbn,0x5b9cca4f7763e373n,0x682e6ff3d6b2b8a3n,0x748f82ee5defb2fcn,0x78a5636f43172f60n,0x84c87814a1f0ab72n,0x8cc702081a6439ecn,0x90befffa23631e28n,0xa4506cebde82bde9n,0xbef9a3f7b2c67915n,0xc67178f2e372532bn,0xca273eceea26619cn,0xd186b8c721c0c207n,0xeada7dd6cde0eb1en,0xf57d4f7fee6ed178n,0x06f067aa72176fban,0x0a637dc5a2c898a6n,0x113f9804bef90daen,0x1b710b35131c471bn,0x28db77f523047d84n,0x32caab7b40c72493n,0x3c9ebe0a15c9bebcn,0x431d67c49c100d4cn,0x4cc5d4becb3e42b6n,0x597f299cfc657e2an,0x5fcb6fab3ad6faecn,0x6c44198c4a475817n].map(o=>BigInt(o));function se(o,n){return(o>>BigInt(n)|o<<BigInt(64-n))&0xffffffffffffffffn}function jc(o){let n=Lr(o),c=[0x6a09e667f3bcc908n,0xbb67ae8584caa73bn,0x3c6ef372fe94f82bn,0xa54ff53a5f1d36f1n,0x510e527fade682d1n,0x9b05688c2b3e6c1fn,0x1f83d9abfb41bd6bn,0x5be0cd19137e2179n],d=n.length,u=BigInt(d)*8n,k=d+8+15>>4<<4,P=new Uint8Array(k+16);P.set(n),P[d]=128;let S=new DataView(P.buffer);S.setBigUint64(P.length-8,u);let y=new Array(80);for(let g=0;g<P.length;g+=128){for(let z=0;z<16;z+=1)y[z]=S.getBigUint64(g+z*8);for(let z=16;z<80;z+=1){let M=se(y[z-15],1)^se(y[z-15],8)^y[z-15]>>7n,q=se(y[z-2],19)^se(y[z-2],61)^y[z-2]>>6n;y[z]=y[z-16]+M+y[z-7]+q&0xffffffffffffffffn}let v=c[0],L=c[1],C=c[2],f=c[3],h=c[4],w=c[5],x=c[6],E=c[7];for(let z=0;z<80;z+=1){let M=se(h,14)^se(h,18)^se(h,41),q=h&w^~h&x,D=E+M+q+Dc[z]+y[z]&0xffffffffffffffffn,$=se(v,28)^se(v,34)^se(v,39),j=v&L^v&C^L&C,G=$+j&0xffffffffffffffffn;E=x,x=w,w=h,h=f+D&0xffffffffffffffffn,f=C,C=L,L=v,v=D+G&0xffffffffffffffffn}c[0]=c[0]+v&0xffffffffffffffffn,c[1]=c[1]+L&0xffffffffffffffffn,c[2]=c[2]+C&0xffffffffffffffffn,c[3]=c[3]+f&0xffffffffffffffffn,c[4]=c[4]+h&0xffffffffffffffffn,c[5]=c[5]+w&0xffffffffffffffffn,c[6]=c[6]+x&0xffffffffffffffffn,c[7]=c[7]+E&0xffffffffffffffffn}let _=new Uint8Array(64);for(let g=0;g<8;g+=1){let v=c[g]&0xffffffffffffffffn;for(let L=0;L<8;L+=1)_[g*8+L]=Number(v>>BigInt(56-L*8)&0xffn)}return _}var mt=2n**255n-19n,Np=2n**252n+27742317777372353535851937790883648493n;function pr(o,n,c){let d=1n;for(o%=c;n;n>>=1n)n&1n&&(d=d*o%c),o=o*o%c;return d}var Fp=(mt-121665n)*pr(121666n,mt-2n,mt)%mt,Oc=pr(2n,(mt-1n)/4n,mt);function _o(o){let n=0n;for(let c=0;c<o.length;c+=1)n|=BigInt(o[c])<<BigInt(8*c);return n}function Rc(o,n){let c=new Uint8Array(n);for(let d=0;d<n;d+=1)c[d]=Number(o&255n),o>>=8n;return c}function Eo(o){if(o.length!==32)return null;let n=(o[31]&128)!==0,c=_o(o)&(1n<<255n)-1n;if(c>=mt)return null;let d=c*c%mt,u=(d-1n+mt)%mt,k=(Fp*d+1n)%mt,P=u*pr(k,mt-2n,mt)%mt,S=pr(P,(mt+3n)/8n,mt);return S*S%mt!==P&&(S=S*Oc%mt),S*S%mt!==P?null:(!!(S&1n)!==n&&(S=mt-S),{X:S,Y:c})}function Co(o,n){let c=o.X%mt,d=o.Y%mt,u=n.X%mt,k=n.Y%mt,P=Fp*c%mt*u%mt*d%mt*k%mt,S=(c*k+u*d)%mt*pr((1n+P+mt)%mt,mt-2n,mt)%mt,y=(d*k%mt+c*u%mt)%mt*pr((1n-P+mt)%mt,mt-2n,mt)%mt;return{X:S,Y:y}}function Bp(o,n){let c=null,d={X:o.X%mt,Y:o.Y%mt};for(;n>0n;n>>=1n)n&1n&&(c=c?Co(c,d):d),d=Co(d,d);return c}var Hc=Eo(Rc(46316835694926478169428394003475163141307993866256225615783033603165251855960n,32));function Dp(o,n,c){if(!o||!n||!c)return!1;let d=Lr(o),u=Lr(n),k=Lr(c);if(d.length!==64||u.length!==32)return!1;let P=Eo(u);if(!P)return!1;let S=Eo(d.slice(0,32));if(!S)return!1;let y=_o(d.slice(32));if(y>=Np)return!1;let _=_o(jc(Uc(d.slice(0,32),u,k)))%Np,g=Bp(Hc,y),v=Bp(P,_),L=v?{X:(mt-v.X%mt)%mt,Y:v.Y%mt}:null,C=g&&L?Co(g,L):g||L;return!C||!S?!1:C.X%mt===S.X%mt&&C.Y%mt===S.Y%mt}function Uc(...o){let n=0;for(let u of o)n+=u.length;let c=new Uint8Array(n),d=0;for(let u of o)c.set(u,d),d+=u.length;return c}var Tr={base:{},coursesPath:"courses",schedulePath:"schedule",courseFields:{name:"name",teacher:"teacher",position:"position",day:"day",sections:"sections",weeks:"weeks"},scheduleFields:{morningNum:"morningNum",afternoonNum:"afternoonNum",nightNum:"nightNum",sections:"sections"}},Wc=["name","teacher","position","day","sections","weeks","code","sequence","englishName","attribute","category","credit","status","campus","building","classroom","startSection","endSection","weekList"],Gc=["morningNum","afternoonNum","nightNum","sections","sectionList"];function Lo(o){return JSON.parse(JSON.stringify(o))}function Hp(o,n){return o===n||o.startsWith(`${n}.`)||n.startsWith(`${o}.`)}function ua(o,n){let c=String(o??"").trim();if(!c){if(n)return"";throw new Error("课程数组输出路径不能为空")}if(c.length>120)throw new Error("JSON 输出路径不能超过 120 个字符");let d=c.split("."),u=new Set(["__proto__","prototype","constructor"]);if(d.some(P=>!P||/^\d+$/.test(P)||/[\[\]\x00-\x1f]/.test(P)||u.has(P)))throw new Error(`JSON 输出路径包含无效片段：${c}`);return d.join(".")}function Jc(o,n){for(let c=0;c<o.length;c+=1)for(let d=c+1;d<o.length;d+=1)if(Hp(o[c],o[d]))throw new Error(`${n}目标路径不能重叠：${o[c]} / ${o[d]}`)}function jp(o,n,c){let d=n.split("."),u=o;for(let k=0;k<d.length;k+=1){let P=d[k];if(!Object.prototype.hasOwnProperty.call(u,P))return;if(k===d.length-1)throw new Error(`${c}输出路径与 base 字段重叠：${n}`);if(u=u[P],!u||typeof u!="object"||Array.isArray(u)){let S=d.slice(0,k+1).join(".");throw new Error(`${c}输出路径无法穿过 base 中的非对象字段：${S}`)}}}function Op(o,n,c){if(!o||typeof o!="object"||Array.isArray(o))throw new Error(`${c}字段映射必须是对象`);let d={};return Object.entries(o).forEach(([u,k])=>{if(!n.includes(u))throw new Error(`${c}不支持源字段：${u}`);let P=ua(k,!0);P&&(d[u]=P)}),Jc(Object.values(d),`${c}字段`),d}function Fe(o){if(!o||typeof o!="object"||Array.isArray(o))throw new Error("自定义 JSON 映射必须是对象");let n=o.base==null?{}:o.base;if(!n||typeof n!="object"||Array.isArray(n))throw new Error("base 必须是 JSON 对象");let c={base:Lo(n),coursesPath:ua(o.coursesPath,!1),schedulePath:ua(o.schedulePath,!0),courseFields:Op(o.courseFields,Wc,"课程"),scheduleFields:Op(o.scheduleFields||{},Gc,"时间表")};if(!Object.keys(c.courseFields).length)throw new Error("至少保留一个课程字段映射");if(c.schedulePath&&Hp(c.schedulePath,c.coursesPath))throw new Error("课程与时间表输出路径不能重叠");return jp(c.base,c.coursesPath,"课程"),c.schedulePath&&jp(c.base,c.schedulePath,"时间表"),c}function qr(o){let n=String(o||"").replace(/\D/g,"").padStart(4,"0").slice(-4),c=`${n.slice(0,2)}:${n.slice(2)}`;return/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(c)?c:""}function zo(o,n,c){let d=ua(n,!1).split("."),u=o;d.forEach((k,P)=>{if(P===d.length-1){u[k]=c;return}(!u[k]||typeof u[k]!="object"||Array.isArray(u[k]))&&(u[k]={}),u=u[k]})}function Rp(o,n){let c={};return Object.entries(n||{}).forEach(([d,u])=>{!Object.prototype.hasOwnProperty.call(o,d)||o[d]===void 0||zo(c,u,Lo(o[d]))}),c}function Vc(o){return[o.campus,o.building,o.classroom].map(n=>String(n||"").trim()).filter(Boolean).join(" ")}function Yc(o){let n=Number(o.startSection)||0,c=Number(o.endSection)||n;return n<1||c<n?"":Array.from({length:c-n+1},(d,u)=>n+u).join(",")}function Qc(o,n){let c=Number(n.day)||0,d=Yc(n),u=Array.from(new Set((n.weeks||[]).map(Number).filter(k=>Number.isInteger(k)&&k>=1&&k<=60))).sort((k,P)=>k-P);return c<1||c>7||!d?{error:"invalid"}:u.length?{value:{name:o.name,teacher:o.teacher,position:Vc(n),day:c,sections:d,weeks:u.join(","),code:o.code,sequence:o.sequence,englishName:o.englishName,attribute:o.attribute,category:o.category,credit:o.credit,status:o.status,campus:n.campus,building:n.building,classroom:n.classroom,startSection:n.startSection,endSection:n.endSection,weekList:u}}:{error:"weeks"}}function Kc(o,n){let c=[];return o.courses.forEach(d=>{if(!d.arrangements.length){n.unscheduledCourses+=1;return}d.arrangements.forEach(u=>{let k=Qc(d,u);k.error==="weeks"?n.missingWeeks+=1:k.error?n.invalidArrangements+=1:c.push(k.value)})}),c}function Zc(o){let n=new Map;return(o||[]).forEach(c=>{let d=Number(c.section),u=qr(c.start),k=qr(c.end);!Number.isInteger(d)||d<1||d>20||!u||!k||n.set(d,{i:d,s:u,e:k})}),Array.from(n.values()).sort((c,d)=>c.i-d.i)}function Xc(o){let n=Zc(o);if(!n.length)return{};let c={sections:JSON.stringify(n),sectionList:n};if(!n.every((u,k)=>u.i===k+1))return c;let d={morningNum:0,afternoonNum:0,nightNum:0};return n.forEach(u=>{let[k,P]=u.s.split(":").map(Number),S=k*60+P;S<720?d.morningNum+=1:S>=1080?d.nightNum+=1:d.afternoonNum+=1}),d.morningNum&&d.afternoonNum&&d.nightNum?Object.assign(c,d):c}function ma(o){let n={unscheduledCourses:0,missingWeeks:0,invalidArrangements:0},c=Kc(o,n);if(!c.length)throw new Error("没有符合导入格式的已排课课程");return{courses:c,schedule:Xc(o.sections),stats:n}}function ba(o){let n={courses:o.courses.map(d=>({name:d.name,teacher:d.teacher,position:d.position,day:d.day,sections:d.sections,weeks:d.weeks}))},c={};return["morningNum","afternoonNum","nightNum","sections"].forEach(d=>{Object.prototype.hasOwnProperty.call(o.schedule,d)&&(c[d]=o.schedule[d])}),Object.keys(c).length&&(n.schedule=c),n}function ha(o,n){let c=Lo(n.base||{}),d=o.courses.map(u=>Rp(u,n.courseFields));if(zo(c,n.coursesPath,d),n.schedulePath&&Object.keys(o.schedule).length){let u=Rp(o.schedule,n.scheduleFields);Object.keys(u).length&&zo(c,n.schedulePath,u)}return c}function Mr(o){return o.getFullYear()+"-"+String(o.getMonth()+1).padStart(2,"0")+"-"+String(o.getDate()).padStart(2,"0")}function ir(o){let n=String(o||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!n)return null;let c=new Date(Number(n[1]),Number(n[2])-1,Number(n[3]));return Number.isNaN(c.getTime())||Mr(c)!==String(o)?null:c}function qo(o){let n=new Date(o.getFullYear(),o.getMonth(),o.getDate()),c=n.getDay();return n.setDate(n.getDate()-(c===0?6:c-1)),n}function Wp(o){let n=String(o||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!n)return Mr(qo(new Date));let c=n[3]==="1"?Number(n[1]):Number(n[2]),d=n[3]==="1"?8:2,u=new Date(c,d,1);for(;u.getDay()!==1;)u.setDate(u.getDate()+1);return Mr(u)}function Up(o){return o.getFullYear()+String(o.getMonth()+1).padStart(2,"0")+String(o.getDate()).padStart(2,"0")+"T"+String(o.getHours()).padStart(2,"0")+String(o.getMinutes()).padStart(2,"0")+"00"}function fa(o){return String(o||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}function td(o){if(typeof TextEncoder!="function")return o;let n=new TextEncoder,c=[],d="",u=73;for(let k of String(o))n.encode(d+k).length>u&&d?(c.push(d),d=" "+k,u=74):d+=k;return d&&c.push(d),c.join(`\r
`)}function ed(o){let n=2166136261,c=String(o||"");for(let d=0;d<c.length;d+=1)n=Math.imul(n^c.charCodeAt(d),16777619);return(n>>>0).toString(16)+"@scu-urppp"}function Gp(o){let n=new Map;return o.sections.forEach(c=>n.set(c.section,c)),n}function rd(o){return o.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}function Jp(o,n,c={}){let d=ir(n);if(!d)throw new Error("第一教学周日期无效");let u=Gp(o);if(!u.size)throw new Error("教务接口没有返回节次时间，无法生成 ICS");let k=rd(c.now instanceof Date?c.now:new Date),P=0,S=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SCU URP++//Schedule Export//CN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:"+fa(o.semester.label+"课表"),"X-WR-TIMEZONE:Asia/Shanghai","BEGIN:VTIMEZONE","TZID:Asia/Shanghai","X-LIC-LOCATION:Asia/Shanghai","BEGIN:STANDARD","TZOFFSETFROM:+0800","TZOFFSETTO:+0800","TZNAME:CST","DTSTART:19700101T000000","END:STANDARD","END:VTIMEZONE"];if(o.courses.forEach(y=>y.arrangements.forEach(_=>{let g=u.get(_.startSection),v=u.get(_.endSection);!g||!v||_.weeks.forEach(L=>{let C=new Date(d);C.setDate(d.getDate()+(L-1)*7+_.day-1);let f=new Date(C),h=new Date(C),w=g.start.split(":").map(Number),x=v.end.split(":").map(Number);f.setHours(w[0],w[1],0,0),h.setHours(x[0],x[1],0,0);let E=[_.campus,_.building,_.classroom].filter(Boolean).join(" "),z=["教师："+y.teacher,"周次："+_.weekDescription,"课程号："+y.code+(y.sequence?"_"+y.sequence:""),"学分："+y.credit,"课程属性："+y.attribute].filter(q=>!/[：:]$/.test(q)).join(`
`),M=[o.semester.planCode,y.code,y.sequence,_.day,_.startSection,_.endSection,L,_.campus,_.building,_.classroom].join("|");P+=1,S.push("BEGIN:VEVENT","UID:"+ed(M),"DTSTAMP:"+k,"SUMMARY:"+fa(y.name),"LOCATION:"+fa(E),"DESCRIPTION:"+fa(z),"DTSTART;TZID=Asia/Shanghai:"+Up(f),"DTEND;TZID=Asia/Shanghai:"+Up(h),"END:VEVENT")})})),!P)throw new Error("课表中没有已安排时间的课程，无法生成 ICS");return S.push("END:VCALENDAR"),S.map(td).join(`\r
`)+`\r
`}function Vp(o){let n=Gp(o),c=0,d=0;return o.courses.forEach(u=>u.arrangements.forEach(k=>{k.weeks.length||(c+=1),(!n.has(k.startSection)||!n.has(k.endSection))&&(d+=1)})),{missingWeeks:c,missingTimes:d}}function ad(o){let n=String(o||"").replace(/[—–]/g,"-"),c=/单周|单数周|[（(]单[）)]/.test(n)?1:/双周|双数周|[（(]双[）)]/.test(n)?0:-1,d=new Set,u=k=>{let P=Number(k);P>=1&&P<=30&&(c<0||P%2===c)&&d.add(P)};return n.replace(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/g,(k,P,S)=>{let y=Math.min(Number(P),Number(S)),_=Math.max(Number(P),Number(S));for(let g=y;g<=_;g+=1)u(g);return k}),(n.match(/\d{1,2}/g)||[]).forEach(u),Array.from(d).sort((k,P)=>k-P)}function Yp(o,n){let c=String(o||"").trim();if(/^[01]+$/.test(c)){let d=[];for(let u=0;u<c.length;u+=1)c.charAt(u)==="1"&&d.push(u+1);return d}return ad(n||c)}function od(o){let n=o&&Array.isArray(o.xkxx)?o.xkxx:[];for(let c of n){let d=Object.values(c||{});if(d.length)return d[0]}return null}function sr(o){let n=od(o);if(!n)return"";let c=Array.isArray(n.timeAndPlaceList)?n.timeAndPlaceList[0]:null;return String(n.zxjxjhh||n.executiveEducationPlanNumber||n.id&&(n.id.zxjxjhh||n.id.executiveEducationPlanNumber)||c&&(c.zxjxjhh||c.executiveEducationPlanNumber)||"").trim()}function nd(o){let n=String(o||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!n)return"学生课表";let c=n[3]==="1"?"秋季学期":n[3]==="2"?"春季学期":"学期";return n[1]+"-"+n[2]+"学年"+c}function Qp(o,n,c,d={}){let u=n||sr(o),k=(Array.isArray(o&&o.jcsjbs)?o.jcsjbs:[]).map(y=>({section:Number(y.jc)||0,start:qr(y.kssj),end:qr(y.jssj)})).filter(y=>y.section>=1&&y.section<=20&&y.start&&y.end).sort((y,_)=>y.section-_.section),P=[];(Array.isArray(o&&o.xkxx)?o.xkxx:[]).forEach(y=>{Object.keys(y||{}).forEach(_=>{let g=y[_];if(!g)return;let v=g.id||{},L=(g.timeAndPlaceList||[]).map(C=>({day:Number(C.classDay)||0,startSection:Number(C.classSessions)||1,endSection:Math.min(12,(Number(C.classSessions)||1)+Math.max(1,Number(C.continuingSession)||1)-1),weeks:Yp(C.classWeek,C.weekDescription||g.skzcs),weekDescription:String(C.weekDescription||g.skzcs||"").trim(),campus:String(C.campusName||"").trim(),building:String(C.teachingBuildingName||"").trim(),classroom:String(C.classroomName||"").trim()})).filter(C=>C.day>=1&&C.day<=7&&C.startSection>=1&&C.startSection<=12);P.push({code:String(v.coureNumber||g.zkch||"").trim(),sequence:String(v.coureSequenceNumber||g.zkxh||"").trim(),name:String(g.courseName||g.englishCourseName||_).trim(),englishName:String(g.englishCourseName||"").trim(),teacher:String(g.attendClassTeacher||"").trim(),attribute:String(g.coursePropertiesName||"").trim(),category:String(g.courseCategoryName||"").trim(),credit:Number(g.unit)||0,status:String(g.selectCourseStatusName||"").trim(),arrangements:L})})});let S=String(d.firstMonday||"").trim();return{schemaVersion:1,exportedAt:(d.now instanceof Date?d.now:new Date).toISOString(),source:c||"SCU URP++",semester:{planCode:u,label:nd(u),firstMonday:ir(S)?S:""},sections:k,courses:P}}function Kp(o,n,c,d=0){let u=Math.max(0,Number(o)||0),k=Math.max(1,Math.floor(Number(n)||1)),P=Math.max(0,Math.min(k-1,Math.floor(Number(c)||0))),S=-Math.max(0,Number(d)||0),y=S+u*P/k,_=S+u*(P+1)/k;return{left:y,width:Math.max(0,_-y)}}function ga(o,n,c){let d=[],u=String(o||""),k=Math.max(4,Number(n)||4);for(;u;)d.push({text:u.slice(0,k),kind:c}),u=u.slice(k);return d}function xa(o,n){let c=o.slice(0,Math.max(0,n)).map(d=>({...d}));if(c.length&&c.length<o.length){let d=c[c.length-1];d.text=d.text.length>1?d.text.slice(0,-1)+"…":"…"}return c}var Zp=["#2563EB","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#DB2777","#4D7C0F","#EA580C","#4F46E5"];function ti(o){let n=0,c=String(o||"");for(let d=0;d<c.length;d+=1)n=n*31+c.charCodeAt(d)>>>0;return Zp[n%Zp.length]}function Xp(o){let n=[];o.forEach(c=>{let d=n.findIndex(u=>u<c.startSection);d<0&&(d=n.length,n.push(0)),n[d]=c.endSection,c.lane=d}),o.forEach(c=>{c.laneCount=Math.max(1,n.length)})}function ei(o){let n=o.slice().sort((u,k)=>u.startSection-k.startSection||u.endSection-k.endSection||u.course.name.localeCompare(k.course.name)),c=[],d=0;return n.forEach(u=>{c.length&&u.startSection>d&&(Xp(c),c=[],d=0),c.push(u),d=Math.max(d,u.endSection)}),c.length&&Xp(c),n}function ri(o){let n=[];return o.courses.forEach(c=>c.arrangements.forEach(d=>{n.push({course:c,arrangement:d,startSection:d.startSection,endSection:d.endSection,day:d.day})})),n}function ai(o,n){let c=[],d=String(o||"");for(;d;)c.push(d.slice(0,n)),d=d.slice(n);return c}function oi(o,n,c){let d=o.startSection===o.endSection?o.startSection+"节":o.startSection+"-"+o.endSection+"节",u=ga(o.name,Math.max(5,n),"title"),k=ga(o.teacher,Math.max(6,n+2),"teacher"),P=ga([o.weekDescription,d].filter(Boolean).join(" · "),Math.max(6,n+2),"schedule"),S=ga([o.campus,o.building,o.classroom].filter(Boolean).join(" "),Math.max(6,n+2),"location"),y=Math.max(1,Number(c)||1),_=S.length&&y>=2?Math.min(2,S.length):0,g=P.length&&y>=3?1:0,v=k.length&&y>=4?1:0,L=Math.max(1,y-_-g-v),C=xa(u,L),f=y-C.length,h=Math.min(k.length,Math.max(0,f-g-_));C.push(...xa(k,h)),f=y-C.length;let w=Math.min(P.length,Math.max(0,f-_));return C.push(...xa(P,w)),f=y-C.length,C.push(...xa(S,f)),C.slice(0,y)}function pd(o,n){let c=ti(n),d=o.colors,u=o.skin;return u==="brutal"?{fill:Ft(d.surface,c,.48),stroke:"#000000",text:"#111111",secondary:"#242424",stripe:c}:u==="flat"?{fill:Ft(d.surface,c,o.dark?.24:.16),stroke:d.text,text:d.text,secondary:d.secondary,stripe:c}:u==="editorial"?{fill:Ft(d.surface,c,o.dark?.16:.08),stroke:d.border,text:d.text,secondary:d.secondary,stripe:c}:{fill:Ft(d.surface,c,o.dark?.28:u==="organic"?.2:.14),stroke:Ft(d.border,c,o.dark?.52:.42),text:d.text,secondary:d.secondary,stripe:c}}function ni(o,n,c={}){if(!n||!n.colors||!n.shape)throw new Error("课表图片主题未解析");let d=n.colors,u=n.shape,k=c.now instanceof Date?c.now:new Date,P=1960,S=40,y=136,_=P-S*2,g=S+24,v=64,L=8,C=g+v+12,f=S+_-24,h=(f-C-L*6)/7,w=y+88,x=108,E=102,M=w+x*12-y+24,q=o.courses.filter(ot=>!ot.arrangements.length).map(ot=>ot.name),D=ai(q.join("、"),92),$=D.length?74+D.length*27:44,j=y+M+$,G=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],U=u.serif?"Georgia,Noto Serif SC,Songti SC,STSong,SimSun,serif":"Microsoft YaHei,Segoe UI,sans-serif",rt="Microsoft YaHei,Segoe UI,sans-serif",it=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-frame-shadow)"':"",bt=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-card-shadow)"':"",J=[`<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${j}" viewBox="0 0 ${P} ${j}">`,"<defs>",`<filter id="schedule-frame-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${n.dark?10:7}" stdDeviation="${n.dark?16:11}" flood-color="${n.dark?"#000000":d.text}" flood-opacity="${n.dark?.48:.1}"/></filter>`,`<filter id="schedule-card-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${n.dark?"#000000":d.text}" flood-opacity="${n.dark?.34:.1}"/></filter>`,"</defs>",`<rect width="100%" height="100%" fill="${d.bg}"/>`,`<rect x="${S}" y="32" width="142" height="36" rx="${u.headerRadius}" fill="${d.primary}"/>`,`<text x="${S+71}" y="56" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="700" font-family="${rt}">SCU URP++</text>`,`<text x="${S}" y="106" fill="${d.text}" font-size="36" font-weight="700" font-family="${U}">${X(o.semester.label)}课表</text>`,`<text x="${P-S}" y="54" text-anchor="end" fill="${d.secondary}" font-size="16" font-family="${rt}">${X(n.label)}</text>`,`<text x="${P-S}" y="83" text-anchor="end" fill="${d.muted}" font-size="14" font-family="${rt}">${X(k.toLocaleString("zh-CN",{hour12:!1}))}</text>`];u.shadow==="hard"&&J.push(`<rect x="${S+8}" y="${y+8}" width="${_}" height="${M}" fill="#000000"/>`),J.push(`<rect x="${S}" y="${y}" width="${_}" height="${M}" rx="${u.frameRadius}" fill="${d.surface}" stroke="${u.shadow==="hard"?"#000000":d.border}" stroke-width="${u.frameStroke}"${it}/>`),G.forEach((ot,K)=>{let ct=C+K*(h+L);J.push(`<rect x="${ct}" y="${y+22}" width="${h}" height="48" rx="${u.headerRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${ct+h/2}" y="${y+53}" text-anchor="middle" fill="${d.secondary}" font-size="17" font-weight="600" font-family="${rt}">${ot}</text>`)});for(let ot=1;ot<=12;ot+=1){let K=w+(ot-1)*x;J.push(`<rect x="${g}" y="${K}" width="${v}" height="${E}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${g+v/2}" y="${K+E/2+6}" text-anchor="middle" fill="${d.muted}" font-size="16" font-weight="600" font-family="${rt}">${ot}</text>`),G.forEach((ct,at)=>{let st=C+at*(h+L);J.push(`<rect x="${st}" y="${K}" width="${h}" height="${E}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`)})}[4,9].forEach(ot=>{let K=w+ot*x-3;J.push(`<line x1="${C}" y1="${K}" x2="${f}" y2="${K}" stroke="${d.primary}" stroke-opacity=".42" stroke-width="2" stroke-dasharray="10 9"/>`)});for(let ot=1;ot<=7;ot+=1)ei(ri(o).filter(ct=>ct.day===ot)).forEach((ct,at)=>{let st=h/ct.laneCount,xt=C+(ot-1)*(h+L)+ct.lane*st,tt=w+(ct.startSection-1)*x,dt=st,At=Math.max(E,(ct.endSection-ct.startSection)*x+E),kt=pd(n,ct.course.name),Pt="course-clip-"+ot+"-"+at,B=Math.max(1,Math.floor((At-18)/23)),V=oi({name:ct.course.name,teacher:ct.course.teacher,weekDescription:ct.arrangement.weekDescription,startSection:ct.startSection,endSection:ct.endSection,campus:ct.arrangement.campus,building:ct.arrangement.building,classroom:ct.arrangement.classroom},Math.floor((dt-22)/16),B);J.push(`<clipPath id="${Pt}"><rect x="${xt+11}" y="${tt+8}" width="${Math.max(10,dt-22)}" height="${Math.max(18,At-16)}" rx="${Math.max(0,u.cardRadius-5)}"/></clipPath>`,`<rect data-course-card="1" data-day="${ot}" data-start="${ct.startSection}" data-end="${ct.endSection}" x="${xt}" y="${tt}" width="${dt}" height="${At}" rx="${u.cardRadius}" fill="${kt.fill}" stroke="${kt.stroke}" stroke-width="${u.cardStroke}"${bt}/>`),n.skin==="brutal"&&J.push(`<path d="M ${xt+dt-4} ${tt+4} V ${tt+At-4} H ${xt+4}" fill="none" stroke="#000000" stroke-opacity=".28" stroke-width="5"/>`),n.skin==="editorial"&&J.push(`<rect x="${xt}" y="${tt}" width="6" height="${At}" fill="${kt.stripe}"/>`),n.skin==="neu"&&J.push(`<path d="M ${xt+u.cardRadius} ${tt+1} H ${xt+dt-u.cardRadius}" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2"/>`),J.push('<g clip-path="url(#'+Pt+')">'),V.forEach((et,ft)=>{let ht=et.kind==="title";J.push(`<text data-kind="${et.kind}" x="${xt+14}" y="${tt+28+ft*23}" fill="${ht?kt.text:kt.secondary}" font-size="${ht?16:13}" font-weight="${ht?700:500}" font-family="${ht&&u.serif?U:rt}">${X(et.text)}</text>`)}),J.push("</g>")});let Y=y+M+30;return D.length?(J.push(`<text x="${S}" y="${Y}" fill="${d.secondary}" font-size="15" font-weight="700" font-family="${rt}">未排定时间的课程</text>`),D.forEach((ot,K)=>J.push(`<text x="${S}" y="${Y+29+K*27}" fill="${d.muted}" font-size="14" font-family="${rt}">${X(ot)}</text>`))):J.push(`<text x="${S}" y="${Y}" fill="${d.muted}" font-size="14" font-family="${rt}">由 SCU URP++ 基于结构化课表数据生成</text>`),J.push("</svg>"),{svg:J.join(""),width:P,height:j,background:d.bg,theme:n}}function id(o,n,c={}){let d=[],u=c.json||null,k=c.ics||null,P=o==="ics"?n.courses.filter(S=>!S.arrangements.length).length:0;return P&&d.push(P+" 门未排定时间的课程未写入日历"),u&&u.unscheduledCourses&&d.push(u.unscheduledCourses+" 门未排定时间的课程未写入 JSON"),u&&u.missingWeeks&&d.push(u.missingWeeks+" 个上课安排缺少周次"),u&&u.invalidArrangements&&d.push(u.invalidArrangements+" 个上课安排缺少日期或节次"),k&&k.missingWeeks&&d.push(k.missingWeeks+" 个上课安排缺少周次"),k&&k.missingTimes&&d.push(k.missingTimes+" 个上课安排缺少节次时间"),d}function ya(o,n,c,d,u){return`<button type="button" class="urppp-export-option" role="menuitem" data-export-type="${o}"${u?" disabled":""}><i class="fa ${n}" aria-hidden="true"></i><span><strong>${c}</strong><small>${d}</small></span></button>`}function pi(o){let{document:n,window:c,ensureStyles:d,loadData:u,exportJson:k,exportIcs:P,exportPng:S,showToast:y,nativePageUrl:_,navigate:g,logger:v=console}=o;function L(x){x&&(x.classList.remove("open"),x.querySelector(".urppp-export-trigger")?.setAttribute("aria-expanded","false"))}function C(){c.__urpppExportDismissBound||(c.__urpppExportDismissBound=!0,n.addEventListener("click",x=>{n.querySelectorAll(".urppp-export-wrap.open").forEach(E=>{E.contains(x.target)||L(E)})},!0),n.addEventListener("keydown",x=>{x.key==="Escape"&&n.querySelectorAll(".urppp-export-wrap.open").forEach(L)}))}async function f(x,E,z,M){if(M&&M.disabled)return;let q=M&&M.innerHTML;try{if(M&&(M.disabled=!0,M.innerHTML='<i class="fa fa-spinner fa-spin"></i> 准备中'),x==="pdf"){if(typeof z!="function")throw new Error("当前页面不提供原生 PDF 导出");await z();return}let D=await u(E),$={};if(x==="json")$.json=await k(D);else if(x==="ics")$.ics=await P(D);else if(x==="png")await S(D);else throw new Error("未知导出格式");let j=id(x,D,$);y("课表已导出："+x.toUpperCase()+(j.length?"；"+j.join("，"):""))}catch(D){if(D&&D.message==="已取消导出")return;v.warn("[URP++] schedule export",D),y(D&&D.message||String(D),!0)}finally{M&&(M.disabled=!1,M.innerHTML=q)}}function h(x={}){d();let E=x.source||"native",z=x.pdfHandler,M=typeof z=="function",q=n.createElement("span"),D=E==="native"?"导出课表":"导出";q.className="urppp-export-wrap",q.innerHTML=`<button type="button" class="urppp-export-trigger" aria-haspopup="menu" aria-expanded="false" title="导出课表"><i class="fa fa-cloud-download" aria-hidden="true"></i><span>${D}</span><i class="fa fa-angle-down" aria-hidden="true"></i></button><div class="urppp-export-menu" role="menu">${ya("ics","fa-calendar","ICS 日历","导入系统日历或日历应用",!1)}${ya("json","fa-code","JSON 数据","兼容小爱课程导入，可自定义格式",!1)}${ya("png","fa-image","PNG 图片","完整学期课表高清图片",!1)}${ya("pdf","fa-file-pdf-o","PDF",M?"使用教务系统原生导出":"仅原教务课表页面可用",!M)}${M?"":'<div class="urppp-export-guide">PDF 依赖原教务课表页面。<button type="button" data-export-native="1">前往本学期课表</button></div>'}</div>`;let $=q.querySelector(".urppp-export-trigger");$.addEventListener("click",G=>{G.preventDefault(),G.stopPropagation();let U=!q.classList.contains("open");n.querySelectorAll(".urppp-export-wrap.open").forEach(L),q.classList.toggle("open",U),$.setAttribute("aria-expanded",U?"true":"false")}),q.querySelectorAll("[data-export-type]:not(:disabled)").forEach(G=>{G.addEventListener("click",()=>{L(q),f(G.getAttribute("data-export-type"),E,z,$)})});let j=q.querySelector("[data-export-native]");return j&&j.addEventListener("click",()=>g(_)),C(),q}function w(x){(x&&x.querySelectorAll?x:n).querySelectorAll("[data-schedule-export-host]").forEach(z=>{z.querySelector(".urppp-export-wrap")||z.appendChild(h({source:z.getAttribute("data-schedule-export-host")||"clean"}))})}return{bindHosts:w,closeMenu:L,createMenu:h,run:f}}function ii(o){let n=c=>{o.querySelectorAll(".urppp-set-tab").forEach(d=>{let u=d.dataset.tab===c;d.classList.toggle("ac",u),d.setAttribute("aria-selected",u?"true":"false")}),o.querySelectorAll(".urppp-set-pane").forEach(d=>{d.classList.toggle("ac",d.dataset.pane===c)});try{let d=o.querySelector(".urppp-set-body");d&&(d.scrollTop=0)}catch{}};return o.querySelectorAll(".urppp-set-tab").forEach(c=>{c.addEventListener("click",()=>n(c.dataset.tab))}),o.__urpppSwitchTab=n,n}function si(o){let{document:n,ensurePanel:c,syncPanel:d,refreshUpdateStatus:u,defaultTab:k="theme"}=o;function P(){c();let y=n.getElementById("urppp-settings-panel"),_=n.getElementById("urppp-settings-mask");if(!y||!_)return!1;d();try{u()}catch{}try{y.__urpppSwitchTab&&y.__urpppSwitchTab(k)}catch{}_.classList.remove("open"),y.classList.remove("open"),y.offsetWidth,_.classList.add("open"),y.classList.add("open");try{let g=y.querySelector(".urppp-set-body");g&&(g.scrollTop=0)}catch{}return!0}function S(){let y=n.getElementById("urppp-settings-panel"),_=n.getElementById("urppp-settings-mask");y&&y.classList.remove("open"),_&&_.classList.remove("open")}return{close:S,open:P}}function li(o){let{logoData:n,repositoryUrl:c,version:d}=o;return['<div class="urppp-set-head">','  <div class="urppp-set-title">设置</div>','  <button type="button" class="urppp-set-close" id="urppp-set-close" aria-label="关闭">×</button>',"</div>",'<div class="urppp-set-tabs" role="tablist">','  <button type="button" class="urppp-set-tab ac" data-tab="theme" role="tab" aria-selected="true">主题设置</button>','  <button type="button" class="urppp-set-tab" data-tab="skin" role="tab" aria-selected="false">主题选择</button>','  <button type="button" class="urppp-set-tab" data-tab="system" role="tab" aria-selected="false">系统设置</button>','  <button type="button" class="urppp-set-tab" data-tab="about" role="tab" aria-selected="false">关于</button>',"</div>",'<div class="urppp-set-body">','  <div class="urppp-set-pane ac" data-pane="theme">','    <section class="urppp-set-sec">',"      <h3>主题模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-modes">','        <button type="button" class="urppp-set-mode" data-theme="default">简约白</button>','        <button type="button" class="urppp-set-mode" data-theme="dark">深邃暗</button>','        <button type="button" class="urppp-set-mode" data-theme="scu-red">动态配色</button>',"      </div>",'      <div class="urppp-set-follow-row">','        <button type="button" class="urppp-set-follow" id="urppp-set-follow" aria-pressed="false">跟随系统：关</button>','        <button type="button" class="urppp-set-follow" id="urppp-set-follow-dynamic" aria-pressed="false">浅色用动态配色：关</button>',"      </div>",'      <button type="button" class="urppp-set-follow" id="urppp-set-clean-default" aria-pressed="false" style="margin-top:12px;width:100%">默认进入清爽模式：关</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-clean-analysis" aria-pressed="false" style="margin-top:12px;width:100%">清爽成绩分析展示：选项卡</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-apple-edge" aria-pressed="true" style="margin-top:12px;width:100%">类Apple边缘线条：开</button>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-dynamic">',"      <h3>种子色</h3>",'      <p class="urppp-set-tip">选一个颜色，自动生成背景、卡片、强调色等多套方案</p>','      <div class="urppp-set-presets" id="urppp-set-presets"></div>','      <div class="urppp-set-custom">','        <input type="color" id="urppp-set-color" value="#B53434" />','        <input type="text" id="urppp-set-hex" maxlength="7" value="#B53434" spellcheck="false" />','        <button type="button" class="urppp-set-btn" id="urppp-set-gen">生成方案</button>','        <button type="button" class="urppp-set-btn ghost" id="urppp-set-save">存为预设</button>',"      </div>",'      <h3 style="margin-top:16px">配色方案</h3>','      <div class="urppp-set-schemes" id="urppp-set-schemes"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-brutal" style="display:none">',"      <h3>高对比配色</h3>",'      <p class="urppp-set-tip">默认圆点使用高能粉；选择一种备用配色后，可由左上第三个圆点快速切换。</p>','      <div class="urppp-set-schemes" id="urppp-set-brutal-palettes"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="skin">','    <section class="urppp-set-sec">',"      <h3>界面风格</h3>",'      <p class="urppp-set-tip">在同一布局上切换视觉气质。因适配规模较大，仅保证清爽模式的完整适配，如有影响请使用默认类Apple风格并选择性开启边缘线条。</p>','      <div class="urppp-theme-store-bar"><button type="button" class="urppp-set-btn ghost" id="urppp-theme-store">主题商店</button></div>','      <div id="urppp-theme-store-inline" class="urppp-store-inline" style="display:none"></div>','      <div class="urppp-skin-list" id="urppp-skin-list"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="system">','    <section class="urppp-set-sec" id="urppp-set-privacy">',"      <h3>隐私模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-privacy-modes">','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="off">关闭</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="one">一键隐私</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="custom">自定义</button>',"      </div>",'      <div class="urppp-privacy-groups" id="urppp-set-privacy-custom">','        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">身份信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-identity" type="checkbox" data-privacy-field="identity" aria-label="隐藏学号和证件"><label for="urppp-privacy-identity">学号/证件</label><input class="urppp-feature-input" data-privacy-value="identity" maxlength="40" aria-label="学号和证件替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-organization" type="checkbox" data-privacy-field="organization" aria-label="隐藏学院和专业"><label for="urppp-privacy-organization">学院/专业</label><input class="urppp-feature-input" data-privacy-value="organization" maxlength="40" aria-label="学院和专业替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-contact" type="checkbox" data-privacy-field="contact" aria-label="隐藏联系和个人信息"><label for="urppp-privacy-contact">联系/个人信息</label><input class="urppp-feature-input" data-privacy-value="contact" maxlength="40" aria-label="联系和个人信息替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">学业信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-grade" type="checkbox" data-privacy-field="grade" aria-label="隐藏成绩"><label for="urppp-privacy-grade">成绩</label><input class="urppp-feature-input" data-privacy-value="grade" maxlength="40" aria-label="成绩替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-gpa" type="checkbox" data-privacy-field="gpa" aria-label="隐藏绩点"><label for="urppp-privacy-gpa">绩点</label><input class="urppp-feature-input" data-privacy-value="gpa" maxlength="40" aria-label="绩点替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-credit" type="checkbox" data-privacy-field="credit" aria-label="隐藏学分"><label for="urppp-privacy-credit">学分</label><input class="urppp-feature-input" data-privacy-value="credit" maxlength="40" aria-label="学分替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">页面内容</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-other" type="checkbox" data-privacy-field="other" aria-label="隐藏其他数据"><label for="urppp-privacy-other">其他数据</label><input class="urppp-feature-input" data-privacy-value="other" maxlength="40" aria-label="其他数据替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-schedule" type="checkbox" data-privacy-field="schedule" aria-label="隐藏课表"><label for="urppp-privacy-schedule">课表</label><input class="urppp-feature-input" data-privacy-value="schedule" maxlength="40" aria-label="课表替换内容"></div>','            <div class="urppp-privacy-field urppp-privacy-field-static"><input id="urppp-privacy-avatar" type="checkbox" data-privacy-field="avatar" aria-label="隐藏头像"><label for="urppp-privacy-avatar">头像</label><span class="urppp-privacy-note">使用统一遮罩</span></div>',"          </div>","        </div>","      </div>",'      <div class="urppp-direct-edit-control">',"        <div><strong>自由修改显示数据</strong><span>开启后，直接点击首页或清爽模式中带标记的数据进行修改</span></div>",'        <button type="button" class="urppp-set-follow" id="urppp-set-direct-edit-toggle" aria-pressed="false">页面内修改：关</button>',"      </div>","    </section>",'    <section class="urppp-set-sec" id="urppp-set-identity">',"      <h3>自定义姓名与头像</h3>",'      <div class="urppp-identity-editor">','        <div class="urppp-identity-fields">','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-name-enabled"> 自定义姓名</label><input class="urppp-feature-input" id="urppp-set-custom-name" maxlength="40" placeholder="输入显示姓名"></div>','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-avatar-enabled"> 自定义头像</label><input class="urppp-feature-input" id="urppp-set-custom-avatar-url" placeholder="https://... 图片地址"></div>','          <div class="urppp-feature-row"><label for="urppp-set-custom-avatar-file">本地图片</label><input class="urppp-feature-input" type="file" id="urppp-set-custom-avatar-file" accept="image/png,image/jpeg,image/webp,image/gif"></div>',"        </div>",'        <div class="urppp-identity-preview">','          <span class="urppp-identity-preview-label">头像预览</span>','          <div class="urppp-avatar-preview-shell"><span>未设置</span><img class="urppp-avatar-preview" id="urppp-set-avatar-preview" alt="自定义头像预览"></div>',"        </div>","      </div>",'      <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-privacy-save">保存隐私与显示设置</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-avatar-clear">清除自定义头像</button></div>','      <div class="urppp-set-tip" id="urppp-set-privacy-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-json-export">',"      <h3>JSON 导出格式</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-json-custom" aria-pressed="false" style="width:100%">自定义 JSON：关</button>','      <div class="urppp-json-mapping-editor" id="urppp-set-json-editor">','        <label for="urppp-set-json-mapping">字段映射</label>','        <textarea id="urppp-set-json-mapping" spellcheck="false" aria-label="自定义 JSON 字段映射"></textarea>','        <p class="urppp-set-tip">源字段包括 name、teacher、position、day、sections、weeks、code、credit、campus、building、classroom、weekList 等；目标值支持 data.courses 形式的嵌套路径。</p>','        <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-json-save">保存映射</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-json-reset">恢复默认映射</button></div>',"      </div>",'      <div class="urppp-set-tip" id="urppp-set-json-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-update">',"      <h3>更新</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-auto-update" aria-pressed="false" style="width:100%">自动检测更新：关</button>','      <button type="button" class="urppp-set-btn" id="urppp-set-check-update" style="margin-top:12px;width:100%">检查更新</button>','      <div id="urppp-set-update-status" class="urppp-set-tip" style="margin-top:8px"></div>',"    </section>",'    <div id="urppp-set-assist-slot"></div>',"  </div>",'  <div class="urppp-set-pane" data-pane="about">','    <div class="urppp-about">','      <img class="urppp-about-logo" id="urppp-about-logo" src="'+n+'" alt="SCU URP++" referrerpolicy="no-referrer" />','      <a class="urppp-about-ver" id="urppp-about-ver" href="'+c+'" target="_blank" rel="noopener noreferrer">SCU URP++ v'+d+"</a>",'      <p class="urppp-about-author">作者：Chao_Lan · Hanako</p>','      <p class="urppp-about-contact">QQ：2718748334</p>',`      <p class="urppp-about-msg">有任何问题欢迎及时反馈！

<a class="urppp-about-poem-link" href="https://music.163.com/#/song?id=1338064727" target="_blank" rel="noopener noreferrer">《在星星峡遇暴风雨》</a>
刘年
在星星峡，穿过大漠，九死一生的玄奘
遇到了第一个活人
这位高僧，忍不住抱着对方，痛哭流涕
也是在星星峡，风，抱着我不放
沙子在咕咕地喝水
喝饱水的沙子，黄豆一样膨胀
焉支山上，那弯彩虹的出现与消失，意义重大
我认为，它是人生的真相</p>`,"    </div>","  </div>","</div>"].join("")}var ae="urppp_plugin_",sd="1.0.0";function To({GM:o,doc:n,hostInfo:c,uiDeps:d}){let{getValue:u=()=>null,setValue:k=()=>{},xmlHttp:P,addStyle:S}=o||{},y=(typeof d=="function"?d:d&&d.openSubpanel)||null,_=new Map,g=new Map,v=new Map,L=[],C=null;function f(B,V){let et=v.get(B);et&&et.forEach(ft=>{try{ft(V)}catch{}})}function h(B,V){return v.has(B)||v.set(B,new Set),v.get(B).add(V),()=>v.get(B).delete(V)}function w(B,V){return u(`${ae}${B}_${V}`)}function x(B,V,et){k(`${ae}${B}_${V}`,et)}function E(){return B=>({get:V=>w(B,V),set:(V,et)=>x(B,V,et),remove:V=>k(`${ae}${B}_${V}`,void 0)})}function z(B,V={}){return new Promise((et,ft)=>{if(typeof P!="function"){ft(new Error("GM_xmlhttpRequest 不可用（未授权跨域？）"));return}P({method:V.method||"GET",url:B,headers:V.headers||{},data:V.data,timeout:V.timeout||8e3,onload:ht=>ht.status>=200&&ht.status<300?et(ht.responseText):ft(new Error(`HTTP ${ht.status}`)),onerror:()=>ft(new Error("网络错误")),ontimeout:()=>ft(new Error("超时(8s)"))})})}async function M(B,V){let et=Array.isArray(B)?B:[B],ft=[];for(let ht=0;ht<et.length;ht+=1){let Lt=et[ht];V&&V({stage:"downloading",index:ht+1,total:et.length,url:Lt});try{let vt=await z(Lt);return V&&V({stage:"downloaded",url:Lt,size:vt.length}),vt}catch(vt){ft.push(`源${ht+1}(${q(Lt)})失败: ${vt&&vt.message?vt.message:vt}`),V&&V({stage:"source_failed",index:ht+1,total:et.length,error:vt&&vt.message?vt.message:vt})}}throw new Error("所有下载源失败 → "+ft.join(" ｜ "))}function q(B){try{return new URL(B).host}catch{return B}}function D(B){let V=String(B||"").match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);return V?B.replace(V[0],""):B}function $(B,V){try{let et=D(B),ft=["GM_getValue","GM_setValue","GM_xmlhttpRequest","GM_registerMenuCommand","GM_addStyle","unsafeWindow"],ht=[typeof GM_getValue=="function"?GM_getValue:void 0,typeof GM_setValue=="function"?GM_setValue:void 0,typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:void 0,typeof GM_registerMenuCommand=="function"?GM_registerMenuCommand:void 0,typeof GM_addStyle=="function"?GM_addStyle:void 0,typeof unsafeWindow<"u"?unsafeWindow:null];return new Function(...ft,et)(...ht),!0}catch(et){return console.warn("[URP++ plugin] 注入失败",V,et),!1}}function j(B,V){let et=g.get(B);return et?(et.enabled=!!V,k(`${ae}${B}_enabled`,et.enabled),f(V?"enabled":"disabled",B),!0):!1}function G(B){let V=g.get(B);return!!V&&V.enabled}function U(B){if(!B||!B.id)return!1;if(_.has(B.id)&&_.get(B.id).__urpppRegistered)return!0;let V=Object.assign({type:"plugin"},B);V.__urpppRegistered=!0,_.set(B.id,V);let et=g.get(B.id)||{loaded:!1,enabled:!1,version:B.version||""};return et.version=V.version||et.version,g.set(B.id,et),f("registered",V.id),!0}function rt(B){return _.get(B)||null}function it(B){let V=[];for(let et of _.values())(!B||et.type===B)&&V.push(et);return V}function bt(B){let V=g.get(B);return!!V&&V.loaded}async function J(B,V,et){et&&et({stage:"start",id:B});let ft=Array.isArray(V)?V:V?[V]:at(B),ht=await M(ft,et);k(`${ae}${B}_code`,ht),et&&et({stage:"injecting",id:B});let Lt=$(ht,B),vt=g.get(B)||{loaded:!1,enabled:!1,version:""};return vt.loaded=Lt,vt.enabled=Lt,vt.code=ht,vt.version=vt.version||Y(ht),g.set(B,vt),k(`${ae}${B}_enabled`,Lt),f("loaded",B),Lt}function Y(B){let V=String(B||"").match(/@version\s+(\S+)/);return V?V[1]:""}async function ot(B,V,et){let ft=Array.isArray(V)?V:V?[V]:at(B),ht=await M(ft,et);k(`${ae}${B}_code`,ht);let Lt=Y(ht),vt=g.get(B)||{loaded:!1,enabled:!1,version:""};return vt.version=Lt||vt.version,vt.code=ht,g.set(B,vt),f("updated",B),{ok:!0,version:Lt||vt.version}}function K(B){let V=u(`${ae}${B}_code`);if(!V)return!1;let et=g.get(B);if(et&&et.loaded)return!0;let ft=$(V,B),ht=g.get(B)||{loaded:!1,enabled:!1,version:Y(V)};return ht.loaded=ft,ht.enabled=ft&&u(`${ae}${B}_enabled`)!==!1,ht.code=V,g.set(B,ht),f("loaded",B),ft}function ct(B){let V=_.get(B);return _.delete(B),g.delete(B),k(`${ae}${B}_enabled`,!1),f("unregistered",B),!!V}function at(B){return B==="assist"?["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/plugins/urpppp.plugin.js","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js"]:[]}let st={protocolVersion:sd,register:U,unregister:ct,get:rt,list:it,loaded:bt,isEnabled:G,enable:(B,V=!0)=>j(B,V),disable:B=>j(B,!1),install:J,update:ot,bootFromCache:K,storage:()=>u&&{get:B=>u(B),set:(B,V)=>k(B,V)},pluginStorage:B=>E()(B),request:z,addStyle:B=>{try{S&&S(B)}catch{}},log:(...B)=>{console.log("[URP++ plugin]",...B)},on:h,emit:f,hostInfo:Object.assign({name:"SCU URP++"},c||{}),getSubpanel:()=>y};try{window.__urpppPlugin=st}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppPlugin=st)}catch{}function xt(B){if(!B||!n||B.querySelector(".urppp-plugin-sec, .urpppp-entry-sec"))return;let V=n.createElement("section");V.className="urppp-set-sec urppp-plugin-sec",V.id="urppp-plugin-sec",V.innerHTML=`
      <h3>辅助插件</h3>
      <div class="urppp-plugin-status" id="urppp-plugin-status">检查中…</div>
      <div class="urppp-plugin-actions">
        <button type="button" class="urppp-set-btn" id="urppp-plugin-install">装载辅助插件</button>
        <button type="button" class="urppp-set-btn ghost" id="urppp-plugin-store">插件商店</button>
      </div>
      <div id="urppp-plugin-panels" style="margin-top:10px"></div>
      <div id="urppp-store-inline" class="urppp-store-inline" style="display:none"></div>
      <p class="urppp-set-tip" id="urppp-plugin-tip" style="margin-top:8px"></p>
    `,B.appendChild(V);let et=V.querySelector("#urppp-plugin-status"),ft=V.querySelector("#urppp-plugin-install"),ht=V.querySelector("#urppp-plugin-store"),Lt=V.querySelector("#urppp-plugin-panels"),vt=V.querySelector("#urppp-plugin-tip");function Dt(){let zt=g.get("assist"),Nt=_.has("assist");zt&&zt.loaded||Nt?(et.textContent=`辅助插件 v${zt&&zt.version?zt.version:rt("assist")&&rt("assist").version||""} 已装载`,et.className="urppp-plugin-status ok",ft.textContent="重新装载",ft.dataset.state="loaded",vt.textContent="已装载。下方为扩展入口。"):(et.textContent=C||"未装载",et.className=C?"urppp-plugin-status err":"urppp-plugin-status",ft.textContent="装载辅助插件",ft.dataset.state="notloaded",vt.textContent=C?"装载失败，可就近重试或放回本地安装。下方为装载/商店入口。":"点击装载后，主插件会下载并注入辅助插件（登录助手/评教/会话保持/2FA），无需再单独安装。"),Lt.innerHTML="";let ee=Pt();if(ee&&Object.keys(ee).length){let De=n.createElement("div");De.className="urppp-plugin-sub",Object.keys(ee).forEach(ge=>{let Xt=n.createElement("button");Xt.type="button",Xt.className="urppp-set-btn ghost",Xt.textContent=ee[ge].label||ge,Xt.addEventListener("click",()=>{try{ee[ge]&&typeof ee[ge].open=="function"?ee[ge].open():y&&y(ge)}catch{}}),De.appendChild(Xt)}),Lt.appendChild(De)}}ft.addEventListener("click",async()=>{ft.disabled=!0,ft.textContent="装载中…",et.className="urppp-plugin-status",et.textContent="正在开始装载…";try{if(await J("assist",null,Nt=>{try{Nt.stage==="downloading"?et.textContent=`下载中… 源${Nt.index}/${Nt.total}（${q(Nt.url)}）`:Nt.stage==="downloaded"?et.textContent=`已下载（${Nt.size} 字节），注入中…`:Nt.stage==="source_failed"?et.textContent=`源${Nt.index}失败（${Nt.error||""}），切换下一源…`:Nt.stage==="injecting"?et.textContent="注入中…":Nt.stage==="start"&&(et.textContent="正在开始装载…"),console.log("[URP++ plugin] assist 装载进度",Nt)}catch{}}))C=null,et.textContent="辅助插件已装载 v"+(rt("assist")&&rt("assist").version||""),console.log("[URP++ plugin] assist 装载成功");else throw new Error("注入失败")}catch(zt){C="装载失败："+(zt&&zt.message?zt.message:zt),et.textContent=C,et.className="urppp-plugin-status err",console.warn("[URP++ plugin] assist 装载失败",zt)}finally{ft.disabled=!1,Dt()}}),ht.addEventListener("click",()=>{y&&y("plugin-store")}),h("loaded",zt=>{zt==="assist"&&Dt()}),h("registered",zt=>{zt==="assist"&&Dt()}),h("unregistered",zt=>{zt==="assist"&&Dt()}),Dt()}function tt(B){return String(B??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function dt(B){if(B){if(At(),B.dataset.rendered==="1"){B.style.display=B.style.display==="none"?"":"none";return}B.dataset.rendered="1",B.innerHTML=`
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
      </div>`,B.querySelectorAll(".urppp-store-tab").forEach(V=>{V.addEventListener("click",()=>{B.querySelectorAll(".urppp-store-tab").forEach(ft=>ft.className="urppp-store-tab"),V.className="urppp-store-tab ac",B.querySelectorAll(".urppp-store-pane").forEach(ft=>ft.style.display="none");let et=B.querySelector('.urppp-store-pane[data-pane="'+V.dataset.tab+'"]');et&&(et.style.display="")})}),kt(B.querySelector("#urppp-store-manage-list")),B.style.display=""}}function At(){if(n.getElementById("urppp-store-style"))return;let B=n.createElement("style");B.id="urppp-store-style",B.textContent=`
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
    `,(n.head||n.documentElement).appendChild(B)}function kt(B){if(!B)return;B.innerHTML="";let V=Array.from(_.values());if(!V.length){B.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}V.forEach(et=>{let ft=g.get(et.id)||{},ht=n.createElement("div");ht.className="urppp-store-item";let Lt=n.createElement("div");Lt.className="urppp-store-info",Lt.innerHTML="<strong>"+tt(et.name||et.id)+'</strong><span class="urppp-store-ver">'+(et.version?"v"+tt(et.version):"")+'</span><span class="urppp-store-state'+(ft.loaded?" ok":"")+'">'+(ft.loaded?"已装载":"未装载")+"</span>";let vt=n.createElement("div");vt.className="urppp-store-ops";let Dt=n.createElement("button");Dt.type="button",Dt.textContent="重新装载",Dt.addEventListener("click",async()=>{Dt.disabled=!0,Dt.textContent="装载中…";try{let Nt=await J(et.id,null);Dt.textContent=Nt?"已装载":"装载失败",f("loaded",et.id)}catch{Dt.textContent="装载失败"}setTimeout(()=>{Dt.disabled=!1,Dt.textContent="重新装载"},1400)});let zt=n.createElement("button");zt.type="button",zt.className="danger",zt.textContent="卸载",zt.addEventListener("click",()=>{ct(et.id),k(`${ae}${et.id}_code`,""),k(`${ae}${et.id}_enabled`,!1),f("unregistered",et.id),kt(B)}),vt.appendChild(Dt),vt.appendChild(zt),ht.appendChild(Lt),ht.appendChild(vt),B.appendChild(ht)})}function Pt(){let B={};return _.forEach(V=>{if(V.subpanels&&typeof V.subpanels=="function"){let et=V.subpanels();Object.keys(et||{}).forEach(ft=>{B[ft]=et[ft]})}else V.subpanels&&typeof V.subpanels=="object"&&Object.keys(V.subpanels).forEach(et=>{B[et]=V.subpanels[et]})}),B}return{api:st,install:J,update:ot,renderAssistUi:xt,openPluginStore:dt,bootFromCache:K,register:U}}function ci(o){let{document:n,getSettings:c,setSettings:d,validateMapping:u,defaultMapping:k,getRecoveryMessage:P=()=>""}=o;function S(g,v,L){let C=g&&g.querySelector("#urppp-set-json-status");C&&(C.textContent=v||"",C.classList.toggle("urppp-status-error",!!L),C.style.color=L?"var(--danger,#b91c1c)":"var(--text-muted)")}function y(g,v){if(!g)return;let L=c(),C=g.querySelector("#urppp-set-json-custom"),f=g.querySelector("#urppp-set-json-editor"),h=g.querySelector("#urppp-set-json-mapping");C&&(C.classList.toggle("ac",L.enabled),C.setAttribute("aria-pressed",L.enabled?"true":"false"),C.textContent="自定义 JSON："+(L.enabled?"开":"关")),f&&(f.style.display=L.enabled?"grid":"none"),h&&(v||!g.__urpppJsonMappingDirty&&n.activeElement!==h)&&(h.value=JSON.stringify(L.mapping,null,2),g.__urpppJsonMappingDirty=!1);let w=P();w&&S(g,w,!0)}function _(g){if(!g||g.__urpppJsonSettingsBound)return;g.__urpppJsonSettingsBound=!0;let v=g.querySelector("#urppp-set-json-custom"),L=g.querySelector("#urppp-set-json-mapping"),C=g.querySelector("#urppp-set-json-save"),f=g.querySelector("#urppp-set-json-reset");L&&L.addEventListener("input",()=>{g.__urpppJsonMappingDirty=!0}),v&&v.addEventListener("click",()=>{let h=c();h.enabled=!h.enabled;let w=!!g.__urpppJsonMappingDirty;d(h),y(g,!1);let x=h.enabled?"已启用自定义 JSON 格式":"已恢复小爱课程兼容格式";S(g,w?x+"；未保存草稿已保留":x)}),C&&C.addEventListener("click",()=>{try{let h=JSON.parse(String(L&&L.value||"").trim()),w=c();w.mapping=u(h),d(w),g.__urpppJsonMappingDirty=!1,y(g,!0),S(g,"自定义 JSON 映射已保存")}catch(h){S(g,h&&h.message||String(h),!0)}}),f&&f.addEventListener("click",()=>{let h=c();h.mapping=u(k),d(h),g.__urpppJsonMappingDirty=!1,y(g,!0),S(g,"已恢复默认字段映射")})}return{bind:_,setStatus:S,sync:y}}var Ir="••••";var di={name:{enabled:!1,replacement:"同学"},identity:{enabled:!0,replacement:"已隐藏"},organization:{enabled:!0,replacement:"已隐藏"},contact:{enabled:!0,replacement:"已隐藏"},grade:{enabled:!0,replacement:"已隐藏"},gpa:{enabled:!0,replacement:"••••"},credit:{enabled:!0,replacement:"••••"},other:{enabled:!0,replacement:"已隐藏"},avatar:{enabled:!0,replacement:""},schedule:{enabled:!1,replacement:"课表已隐藏"}},ld=["completedCourses","failedCourses","majorGpa","majorPlan","remainingCourses","passingTotalCredit","passingAvgScore","passingAvgGpa","passingRequiredCredit","passingRequiredAvg","passingRequiredGpa","schemeTotalCredit","schemeAvgScore","schemeAvgGpa","schemeRequiredCredit","schemeRequiredAvg","schemeRequiredGpa"];function Mo(o){let n=o&&typeof o=="object"?o:{},c=["off","one","custom"].includes(n.mode)?n.mode:"off",d={},u=n.fields&&typeof n.fields=="object"?n.fields:{},k=u.score&&typeof u.score=="object"?u.score:null;Object.keys(di).forEach(g=>{let v=di[g],L=["grade","gpa","credit"].includes(g)?k:null,C=g==="other"&&u.grade&&typeof u.grade=="object"?u.grade:null,f=u[g]&&typeof u[g]=="object"?u[g]:L||C||{};d[g]={enabled:g==="name"?!1:f.enabled==null?v.enabled:!!f.enabled,replacement:String(f.replacement==null?v.replacement:f.replacement).slice(0,80)}});let P=n.homepage&&typeof n.homepage=="object"?n.homepage:{},S=n.directEdit&&typeof n.directEdit=="object"?n.directEdit:P,y=S.values&&typeof S.values=="object"?S.values:{},_={};return ld.forEach(g=>{_[g]=String(y[g]==null?"":y[g]).trim().slice(0,80)}),{mode:c,mask:Ir,fields:d,directEdit:{enabled:!!S.enabled,values:_}}}function $r(o){let n=o&&typeof o=="object"?o:{},c=String(n.avatar||"").trim();return{nameEnabled:!!n.nameEnabled,name:String(n.name||"").trim().slice(0,40),avatarEnabled:!!n.avatarEnabled,avatar:c.length<=3145728?c:"",avatarName:String(n.avatarName||"").trim().slice(0,120)}}function lr(o){let n=String(o||"").trim();return n.length>3145728?"":/^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(n)?n:""}function cd(o,n=globalThis.FileReader){return new Promise((c,d)=>{if(!o||!/^image\/(png|jpeg|webp|gif)$/i.test(o.type||"")){d(new Error("请选择 PNG、JPG、WebP 或 GIF 图片"));return}if(o.size>2*1024*1024){d(new Error("本地头像不能超过 2MB"));return}let u=new n;u.onload=()=>c(String(u.result||"")),u.onerror=()=>d(new Error("读取头像失败")),u.readAsDataURL(o)})}function ui(o){let{getPrivacySettings:n,setPrivacySettings:c,getCustomIdentity:d,setCustomIdentity:u,applyDisplay:k,refreshCleanDisplay:P,finishActiveDirectEdit:S,readAvatar:y=cd}=o;function _(f,h){let w=h.mode==="custom",x=f.querySelector(".urppp-direct-edit-control"),E=f.querySelector("#urppp-set-direct-edit-toggle");x&&(x.style.display=w?"flex":"none"),E&&(E.dataset.enabled=h.directEdit.enabled?"1":"0",E.classList.toggle("ac",h.directEdit.enabled),E.setAttribute("aria-pressed",h.directEdit.enabled?"true":"false"),E.textContent="页面内修改："+(h.directEdit.enabled?"开":"关"))}function g(f){if(!f)return;let h=n();f.querySelectorAll("[data-privacy-mode]").forEach($=>{let j=$.getAttribute("data-privacy-mode")===h.mode;$.classList.toggle("ac",j),$.setAttribute("aria-pressed",j?"true":"false")});let w=f.querySelector("#urppp-set-privacy-custom");w&&(w.style.display=h.mode==="custom"?"grid":"none"),Object.keys(h.fields).forEach($=>{let j=h.fields[$],G=f.querySelector('[data-privacy-field="'+$+'"]'),U=f.querySelector('[data-privacy-value="'+$+'"]');G&&(G.checked=!!j.enabled),U&&(U.value=j.replacement||"",U.disabled=!j.enabled)}),_(f,h);let x=d(),E=f.querySelector("#urppp-set-name-enabled"),z=f.querySelector("#urppp-set-custom-name"),M=f.querySelector("#urppp-set-avatar-enabled"),q=f.querySelector("#urppp-set-custom-avatar-url"),D=f.querySelector("#urppp-set-avatar-preview");if(E&&(E.checked=x.nameEnabled),z&&(z.value=x.name,z.disabled=!x.nameEnabled),M&&(M.checked=x.avatarEnabled),q&&(q.value=/^data:image\//i.test(x.avatar)?"":x.avatar,q.disabled=!x.avatarEnabled),f.__urpppAvatarSource=x.avatar,D){let $=lr(x.avatar);D.style.display=$?"block":"none",$?D.src=$:D.removeAttribute("src")}}function v(f){let h=n();Object.keys(h.fields).forEach(x=>{let E=f.querySelector('[data-privacy-field="'+x+'"]'),z=f.querySelector('[data-privacy-value="'+x+'"]');E&&(h.fields[x].enabled=!!E.checked),z&&(h.fields[x].replacement=String(z.value||"").trim().slice(0,80))});let w=f.querySelector("#urppp-set-direct-edit-toggle");return h.directEdit.enabled=!!(w&&w.dataset.enabled==="1"),h}function L(f,h,w){let x=f&&f.querySelector("#urppp-set-privacy-status");x&&(x.textContent=h||"",x.style.color=w?"#b91c1c":"var(--text-muted)")}function C(f){if(!f||f.__urpppPrivacyBound)return;f.__urpppPrivacyBound=!0,f.querySelectorAll("[data-privacy-mode]").forEach(q=>{q.addEventListener("click",()=>{let D=n();D.mode=q.getAttribute("data-privacy-mode")||"off",c(D),g(f),k()})}),f.querySelectorAll("[data-privacy-field]").forEach(q=>{q.addEventListener("change",()=>{let D=q.getAttribute("data-privacy-field"),$=f.querySelector('[data-privacy-value="'+D+'"]');$&&($.disabled=!q.checked)})});let h=f.querySelector("#urppp-set-direct-edit-toggle");h&&h.addEventListener("click",()=>{let q=h.dataset.enabled!=="1";h.dataset.enabled=q?"1":"0",h.classList.toggle("ac",q),h.setAttribute("aria-pressed",q?"true":"false"),h.textContent="页面内修改："+(q?"开":"关")});let w=f.querySelector("#urppp-set-name-enabled"),x=f.querySelector("#urppp-set-avatar-enabled");w&&w.addEventListener("change",()=>{let q=f.querySelector("#urppp-set-custom-name");q&&(q.disabled=!w.checked)}),x&&x.addEventListener("change",()=>{let q=f.querySelector("#urppp-set-custom-avatar-url");q&&(q.disabled=!x.checked)});let E=f.querySelector("#urppp-set-custom-avatar-file");E&&E.addEventListener("change",async()=>{try{let q=await y(E.files&&E.files[0]);f.__urpppAvatarSource=q;let D=f.querySelector("#urppp-set-avatar-preview");D&&(D.src=q,D.style.display="block"),x&&(x.checked=!0),L(f,"本地头像已读取，点击保存后生效")}catch(q){L(f,q&&q.message||String(q),!0)}});let z=f.querySelector("#urppp-set-avatar-clear");z&&z.addEventListener("click",()=>{try{let q=d();q.avatarEnabled=!1,q.avatar="",q.avatarName="",u(q),f.__urpppAvatarSource="",g(f),k(),P(),L(f,"已清除自定义头像")}catch(q){L(f,q&&q.message||"清除自定义头像失败",!0)}});let M=f.querySelector("#urppp-set-privacy-save");M&&M.addEventListener("click",()=>{let q=n(),D=d();try{let $=v(f),j=f.querySelector("#urppp-set-custom-avatar-url"),U=String(j&&j.value||"").trim()||f.__urpppAvatarSource||"",rt=$r({nameEnabled:!!(w&&w.checked),name:String(f.querySelector("#urppp-set-custom-name")?.value||"").trim(),avatarEnabled:!!(x&&x.checked),avatar:U,avatarName:D.avatarName});if(rt.avatarEnabled&&!lr(rt.avatar))throw new Error("头像地址必须是 http(s) 图片或已选择的本地图片");q.directEdit.enabled&&!$.directEdit.enabled&&S(!0);try{u(rt),c($)}catch(it){try{u(D),c(q)}catch{}throw it}k(),P(),g(f),L(f,"隐私与显示设置已保存")}catch($){L(f,$&&$.message||String($),!0)}})}return{bind:C,collect:v,setStatus:L,sync:g}}function mi(o){let{document:n,theme:c,preferences:d,accent:u,syncPanel:k}=o;function P(){c.getFollowSystem()?c.apply(c.resolveFollowTheme(),{system:!0}):c.apply("scu-red",{manual:!0})}function S(_,g){let v=_.querySelector("#urppp-set-schemes");if(!v)return;let L=u.getScheme();v.innerHTML="",u.listSchemePreviews(g).forEach(C=>{let f=n.createElement("button");f.type="button",f.className="urppp-set-scheme"+(C.id===L?" ac":""),f.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+C.bg+'"></span>','  <span style="background:'+C.surface+";border-color:"+C.border+'"></span>','  <span style="background:'+C.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+C.name+"</strong>","  <em>"+C.desc+"</em>","</div>"].join(""),f.addEventListener("click",()=>{u.setAccent(g),u.setScheme(C.id),P(),k()}),v.appendChild(f)})}function y(_){_.querySelectorAll(".urppp-set-mode").forEach(q=>{q.addEventListener("click",()=>{c.isModeAvailable(q.dataset.theme)&&(c.apply(q.dataset.theme,{manual:!0}),k())})});let g=_.querySelector("#urppp-set-follow");g&&g.addEventListener("click",()=>{if(!c.supportsDark())return;let q=!c.getFollowSystem();c.setFollowSystem(q),q?c.apply(c.resolveFollowTheme(),{system:!0}):c.apply(c.getCurrent(),{manual:!0}),k(),c.syncNavbar()});let v=_.querySelector("#urppp-set-follow-dynamic");v&&v.addEventListener("click",()=>{c.supportsDynamic()&&(c.getFollowSystem()?c.setFollowDynamic(!c.getFollowDynamic()):(c.setFollowSystem(!0),c.setFollowDynamic(!0)),c.apply(c.resolveFollowTheme(),{system:!0}),k(),c.syncNavbar())});let L=_.querySelector("#urppp-set-clean-default");L&&L.addEventListener("click",()=>{d.setCleanDefault(!d.getCleanDefault()),k()});let C=_.querySelector("#urppp-set-clean-analysis");C&&C.addEventListener("click",()=>{let q=d.getCleanAnalysis()==="direct";d.setCleanAnalysis(q?"tab":"direct"),k()});let f=_.querySelector("#urppp-set-apple-edge");f&&f.addEventListener("click",()=>{d.setAppleEdge(!d.getAppleEdge());try{d.applySkin()}catch{}k()});let h=_.querySelector("#urppp-set-auto-update");h&&h.addEventListener("click",()=>{d.setAutoUpdate(!d.getAutoUpdate()),k()});let w=_.querySelector("#urppp-set-check-update");w&&!w.__urpppBound&&(w.__urpppBound=!0,w.addEventListener("click",()=>{d.checkUpdates()}));let x=_.querySelector("#urppp-set-color"),E=_.querySelector("#urppp-set-hex");if(!x||!E)return;x.addEventListener("input",()=>{E.value=x.value.toUpperCase()}),E.addEventListener("change",()=>{let q=u.normalize(E.value);q&&(E.value=q,x.value=q)});let z=_.querySelector("#urppp-set-gen");z&&z.addEventListener("click",()=>{let q=u.normalize(E.value)||x.value;q&&(u.setAccent(u.normalize(q)),P(),k())});let M=_.querySelector("#urppp-set-save");M&&M.addEventListener("click",()=>{let q=u.normalize(E.value)||x.value;q&&(u.savePreset(q),u.setAccent(u.normalize(q)),P(),k())}),x.addEventListener("change",()=>{let q=u.normalize(x.value);q&&(E.value=q,S(_,q))})}return{bind:y,renderSchemeChoices:S}}function bi(o,n){let{seed:c,currentTheme:d,followSystem:u,skinId:k,darkSupported:P,dynamicSupported:S,fixedPalettes:y,followUseDynamic:_,cleanDefault:g,cleanAnalysis:v,appleEdge:L,autoUpdate:C,modeAvailability:f}=n,h=o.querySelector("#urppp-set-color"),w=o.querySelector("#urppp-set-hex");h&&(h.value=c),w&&(w.value=c),o.querySelectorAll(".urppp-set-mode").forEach(U=>{let rt=U.dataset.theme,it=f[rt]!==!1,bt=!u&&rt===d&&it;U.disabled=!it,U.classList.toggle("ac",bt),U.classList.toggle("urppp-dyn-disabled",!it),U.setAttribute("aria-disabled",it?"false":"true"),it?U.removeAttribute("title"):U.title=rt==="dark"?"当前界面风格不支持暗色模式":"当前界面风格不支持动态配色"});let x=o.querySelector("#urppp-set-follow");x&&(x.disabled=!P,x.classList.toggle("ac",u&&P),x.classList.toggle("urppp-dyn-disabled",!P),x.setAttribute("aria-pressed",u&&P?"true":"false"),x.textContent=u&&P?"跟随系统：开":"跟随系统：关",x.title=P?"":"当前界面风格不支持暗色模式");let E=o.querySelector("#urppp-set-follow-dynamic");E&&(E.classList.toggle("ac",_&&S),E.setAttribute("aria-pressed",_&&S?"true":"false"),E.textContent=_?"浅色用动态配色：开":"浅色用动态配色：关",E.disabled=!u||!S,E.classList.toggle("urppp-dyn-disabled",!S),E.style.opacity=S&&u?"1":"0.5",E.title=S?"":"当前界面风格不支持动态配色");let z=o.querySelector("#urppp-set-dynamic");z&&(z.style.display=S?"":"none",z.style.opacity="1",z.classList.toggle("urppp-dyn-disabled",!1),z.querySelectorAll("button, input, .urppp-set-scheme, .urppp-set-swatch").forEach(U=>{U.disabled=!1,U.classList.toggle("urppp-dyn-disabled",!1)}),z.querySelectorAll("h3, .urppp-set-tip, label").forEach(U=>{U.classList.toggle("urppp-dyn-disabled",!1)}));let M=o.querySelector("#urppp-set-brutal");M&&(M.style.display=y?"":"none");let q=o.querySelector("#urppp-set-clean-default");q&&(q.classList.toggle("ac",g),q.setAttribute("aria-pressed",g?"true":"false"),q.textContent=g?"默认进入清爽模式：开":"默认进入清爽模式：关");let D=o.querySelector("#urppp-set-clean-analysis");if(D){let U=v==="direct";D.classList.toggle("ac",U),D.setAttribute("aria-pressed",U?"true":"false"),D.textContent=U?"清爽成绩分析展示：直接显示":"清爽成绩分析展示：选项卡"}let $=o.querySelector("#urppp-set-apple-edge"),j=o.querySelector("#urppp-set-apple-edge-tip");if($){let U=k==="apple";$.style.display=U?"":"none",j&&(j.style.display=U?"":"none"),U&&($.classList.toggle("ac",L),$.setAttribute("aria-pressed",L?"true":"false"),$.textContent=L?"类Apple边缘线条：开":"类Apple边缘线条：关")}let G=o.querySelector("#urppp-set-auto-update");G&&(G.classList.toggle("ac",C),G.setAttribute("aria-pressed",C?"true":"false"),G.textContent=C?"自动检测更新：开":"自动检测更新：关")}function Io(o){let n=String(o||"").replace(/\s+/g,"");return/^[•·●○▪◆★\-–]$/.test(n)||/^\d{1,4}$/.test(n)}function dd(o){return/\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(o||""))}function hi({pathname:o="",href:n="",title:c="",headingText:d=""}={}){return/courseSelectNotice|evaluationNotice|notice\/index/i.test(`${o} ${n}`)?!0:/评估公告|通知公告|选课公告|公告|通知/.test(`${c} ${d}`)}function $o(o,{noticePage:n=!1}={}){if(!o)return!1;let d=(o.querySelector("thead")?.textContent||"").replace(/\s+/g,"");if(/标题/.test(d)&&/发布时间|发布日期|日期|时间/.test(d)||n&&/标题|公告|通知/.test(d)&&!/教室|教学楼|课程号|成绩|学号|座位数/.test(d))return!0;let u=o.querySelectorAll("tbody tr, tr"),k=0;if(u.forEach(S=>{let y=S.querySelectorAll("td");y.length<2||y.length>4||Io(y[0].textContent)&&S.querySelector("a")&&dd(S.textContent)&&(k+=1)}),k<1)return!1;if(n||k===u.length)return!0;let P=o.getAttribute("style")||"";return/dashed/i.test(P)||o.classList.contains("no-border-top")||!!o.getAttribute("width")}function fi(o,{noticePage:n=!1}={}){if(!o)return!0;if(o.classList?.contains("urppp-notice-table")||$o(o,{noticePage:n}))return!1;let c=`${o.id||""} ${o.getAttribute("class")||""}`;if(/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(c)||o.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]'))return!0;let d=o.querySelector("tbody tr, tr");if(d&&d.querySelectorAll("td,th").length>=5)return!0;let k=(o.querySelector("thead")?.textContent||"").replace(/\s+/g,"");return!!(k&&(/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(k)||/序号/.test(k)&&!/标题|公告|通知|发布时间/.test(k))||o.querySelector("a")&&/课表|教室信息|查看/.test(o.textContent||"")&&!n&&/座位数|教学楼|教室号|校区名/.test(o.textContent||""))}function gi({isNativePdfIsolationActive:o,isBusinessDataTable:n,documentRef:c=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,getComputedStyleRef:k=getComputedStyle}){function P(){o()||c.querySelectorAll("table.table, table.table-bordered, table.dataTable").forEach(y=>{if(!y||y.closest(".urppp-table-wrap")||y.id==="courseTable"||y.closest(".modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal")||y.classList.contains("urppp-wrs-table")||y.classList.contains("urppp-notice-table"))return;n(y);let _=y.parentElement;if(!_)return;let g=_.style?.overflow||k(_).overflow;if(_.id?.endsWith("_scroll")||g==="auto"||g==="scroll"){_.classList.add("urppp-scroll-table-host");return}let L=c.createElement("div");L.className="urppp-table-wrap",_.insertBefore(L,y),L.appendChild(y)})}function S(){let y=c.getElementById("page-content-template")||c.querySelector(".page-content")||c.body;if(!y)return;let _=d.__urpppTableObsRoot;if(d.__urpppTableObs&&_===y&&y.isConnected)return;d.__urpppTableObs&&d.__urpppTableObs.disconnect();let g=0,v=new u(()=>{clearTimeout(g),g=setTimeout(P,80)});v.observe(y,{childList:!0,subtree:!0}),d.__urpppTableObs=v,d.__urpppTableObsRoot=y}return{bindTableWrapObserver:S,wrapTables:P}}function xi(o){let n=String(o||"").trim().toLowerCase();if(!n||n==="transparent"||n==="inherit"||n==="initial")return!1;if(/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(n))return!0;let c=n.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);if(!c)return!1;let d=Number(c[1]),u=Number(c[2]),k=Number(c[3]);return(d+u+k)/3>=200}function ud(o){if(!o?.style)return;let n=o.getAttribute("style")||"";if(!n||!/background/i.test(n))return;let c=o.style.backgroundColor||o.style.background||"";(xi(c)||/background(-color|-image)?\s*:/i.test(n))&&(o.style.removeProperty("background"),o.style.removeProperty("background-color"),o.style.removeProperty("background-image")),["borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"].forEach(d=>{let u=o.style[d];!u||!xi(u)||o.style.removeProperty(d.replace(/[A-Z]/g,k=>`-${k.toLowerCase()}`))}),/border(-color)?\s*:/i.test(n)&&/#e6e6e6|#eee|#ddd|#ccc/i.test(n)&&(o.style.removeProperty("border-color"),o.style.removeProperty("border-top-color"),o.style.removeProperty("border-right-color"),o.style.removeProperty("border-bottom-color"),o.style.removeProperty("border-left-color"))}function yi({isNativePdfIsolationActive:o,documentRef:n=document,windowRef:c=window,MutationObserverRef:d=MutationObserver}){function u(){if(!o())try{let P=n.documentElement.classList.contains("urppp-theme-dark"),S=n.body?.classList.contains("urppp-dark");if(!P&&!S)return;n.querySelectorAll("table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th").forEach(ud)}catch{}}function k(){[0,200,800,1600].forEach(P=>setTimeout(()=>{try{u()}catch{}},P));try{let P=n.querySelector(".page-content, #page-content-template, .main-content")||n.body;if(!P)return;let S=c.__urpppTableScrubObs;if(S&&S.root===P&&P.isConnected)return;S?.observer&&S.observer.disconnect();let y=new d(()=>{clearTimeout(c.__urpppTableScrubTimer),c.__urpppTableScrubTimer=setTimeout(()=>{try{u()}catch{}},120)});y.observe(P,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),c.__urpppTableScrubObs={root:P,observer:y}}catch{}}return{scheduleScrubTableInlineBg:k,scrubTableHeaderInlineBg:u}}function vi({beautifyPagebar:o,documentRef:n=document,windowRef:c=window,MutationObserverRef:d=MutationObserver,setTimeoutRef:u=setTimeout,clearTimeoutRef:k=clearTimeout}){function P(){o(),n.querySelectorAll("#urppagebar").forEach(y=>{if(y.__urpppPagebarObs)return;y.__urpppPagebarObs=!0,new d(()=>{k(c.__urpppPagebarTimer),c.__urpppPagebarTimer=u(()=>o(y.parentElement||n),150)}).observe(y,{childList:!0,subtree:!0})})}function S(){if(c.__urpppPagebarBound){u(P,0);return}c.__urpppPagebarBound=!0,[0,300,1e3,2500].forEach(y=>u(P,y))}return{scheduleBeautifyPagebar:S}}function wi({destroyPagebarChosen:o,documentRef:n=document,logger:c=console}){function d(u){try{(u?.querySelectorAll?u.querySelectorAll("#urppagebar"):n.querySelectorAll("#urppagebar")).forEach(P=>{if(!P)return;P.classList.add("urppp-pagebar"),P.style.setProperty("display","block","important"),P.style.setProperty("width","100%","important"),P.style.setProperty("line-height","1.5","important");let S=P.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]')||P,y=Array.from(P.querySelectorAll('[id^="span_page_txt_"]')).map(f=>String(f.textContent||"").trim()).join(""),_=P.querySelector('select[id^="pagination_pageSize_"]'),g=_?String(_.value||""):"",v=P.querySelector('[id^="turnpageto_"]'),L=!!(v&&(v.readOnly||v.hasAttribute("readonly")));if(!(y.includes("转到")&&!L&&!g.includes("_"))){P.classList.add("urppp-pagebar-scroll"),P.classList.remove("urppp-pagebar-jump"),P.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach(f=>{f.style.setProperty("display","none","important")}),P.querySelectorAll("select").forEach(f=>{o(f),f.style.setProperty("width","128px","important"),f.style.setProperty("min-width","128px","important"),f.style.setProperty("max-width","128px","important")}),P.querySelectorAll(".chosen-container").forEach(f=>{try{f.style.setProperty("display","none","important")}catch{}});return}P.classList.add("urppp-pagebar-jump"),P.classList.remove("urppp-pagebar-scroll"),S.style.setProperty("display","flex","important"),S.style.setProperty("align-items","center","important"),S.style.setProperty("flex-wrap","wrap","important"),S.style.setProperty("gap","8px","important"),S.style.setProperty("position","relative","important"),S.style.setProperty("line-height","1.5","important"),P.querySelectorAll("ul.pagination").forEach(f=>{f.classList.add("urppp-pagination"),f.style.cssText=["display:inline-flex !important","align-items:center !important","flex-wrap:wrap !important","gap:4px !important","margin:0 !important","padding:0 !important","list-style:none !important","float:none !important","position:static !important"].join(";")}),P.querySelectorAll("ul.pagination > li").forEach(f=>{let h=f.classList.contains("active"),w=f.classList.contains("disabled"),x=f.classList.contains("previous")||/previous/i.test(f.getAttribute("name")||""),E=f.classList.contains("next")||/next/i.test(f.getAttribute("name")||"");f.classList.add("urppp-page-li"),h&&f.classList.add("urppp-page-li-active"),w&&f.classList.add("urppp-page-li-disabled"),x&&f.classList.add("urppp-page-li-prev"),E&&f.classList.add("urppp-page-li-next"),f.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","float:none !important","position:static !important","margin:0 !important","padding:0 !important","list-style:none !important","border:none !important","background:transparent !important","height:auto !important","min-height:0 !important"].join(";");let z=f.querySelector(":scope > span, :scope > a")||f.firstElementChild;if(!z)return;z.classList.add("urppp-page-chip"),h&&z.classList.add("urppp-page-chip-active"),w&&z.classList.add("urppp-page-chip-disabled"),(x||E)&&z.classList.add("urppp-page-chip-nav");let M=x||E?"72px":"40px",q=h?"var(--pagination-active-bg, var(--primary))":"var(--surface)",D=h?"var(--pagination-active-border, var(--primary))":"var(--border)",$=h?"var(--pagination-active-foreground, var(--primary-foreground, #fff))":w?"var(--text-muted)":"var(--text)";z.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","box-sizing:border-box !important","float:none !important","position:static !important","width:auto !important",`min-width:${M} !important`,"height:36px !important","min-height:36px !important","max-height:36px !important","padding:0 12px !important","margin:0 !important","line-height:36px !important","font-size:14px !important","font-weight:600 !important","border-radius:8px !important",`border:1px solid ${D} !important`,`background:${q} !important`,`color:${$} !important`,"box-shadow:none !important","text-decoration:none !important",`cursor:${w?"default":"pointer"} !important`,"white-space:nowrap !important","overflow:hidden !important"].join(";")}),P.querySelectorAll('[id^="btn_turnpageto_"]').forEach(f=>{f.classList.add("urppp-page-confirm"),f.style.setProperty("position","static","important"),f.style.setProperty("left","auto","important"),f.style.setProperty("top","auto","important"),f.style.setProperty("float","none","important"),f.style.setProperty("height","32px","important"),f.style.setProperty("min-width","52px","important"),f.style.setProperty("padding","0 12px","important"),f.style.setProperty("margin","0 4px","important"),f.style.setProperty("font-size","13px","important"),f.style.setProperty("line-height","1","important"),f.style.setProperty("vertical-align","middle","important")}),P.querySelectorAll('[id^="turnpageto_"]').forEach(f=>{f.classList.add("urppp-page-goto"),f.style.setProperty("position","static","important"),f.style.setProperty("display","inline-block","important"),f.style.setProperty("height","32px","important"),f.style.setProperty("width","48px","important"),f.style.setProperty("margin","0 4px","important"),f.style.setProperty("padding","4px 8px","important"),f.style.setProperty("font-size","14px","important"),f.style.setProperty("line-height","1.2","important"),f.style.setProperty("box-sizing","border-box","important"),f.style.setProperty("vertical-align","middle","important");let h=f.parentElement;h?.tagName==="SPAN"&&(h.style.setProperty("position","static","important"),h.style.setProperty("display","inline-flex","important"),h.style.setProperty("align-items","center","important"),h.style.setProperty("width","auto","important"),h.style.setProperty("height","auto","important"),h.style.setProperty("min-height","0","important"),h.style.setProperty("vertical-align","middle","important"))}),P.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach(f=>{f.style.setProperty("display","inline","important"),f.style.setProperty("border","none","important"),f.style.setProperty("background","transparent","important"),f.style.setProperty("padding","0","important"),f.style.setProperty("margin","0","important"),f.style.setProperty("height","auto","important"),f.style.setProperty("line-height","1.5","important"),f.style.setProperty("font-size","13px","important"),f.style.setProperty("color","var(--text-secondary, var(--text-muted))","important")})})}catch(k){c.warn("[URP++] pagebar beautify failed",k)}}return{beautifyPagebar:d}}function ki({beautifyNoticeTables:o,pinNoticeRowSurface:n,documentRef:c=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,requestAnimationFrameRef:k=requestAnimationFrame,setTimeoutRef:P=setTimeout,clearTimeoutRef:S=clearTimeout}){function y(){d.__urpppNoticeHoverScrub||(d.__urpppNoticeHoverScrub=!0,c.addEventListener("mouseout",g=>{let v=g.target?.closest?g.target.closest("table.urppp-notice-table tr.urppp-notice-row"):null;v&&k(()=>n(v))},!0))}function _(){[0,400,1500].forEach(g=>P(()=>{try{o()}catch{}},g));try{let g=c.getElementById("page-content-template")||c.querySelector(".page-content, .main-content")||c.body;if(!g)return;let v=d.__urpppNoticeObs;if(v&&v.root===g&&g.isConnected)return;v?.observer&&v.observer.disconnect();let L=new u(()=>{S(d.__urpppNoticeTimer),d.__urpppNoticeTimer=P(()=>{try{o()}catch{}},180)});L.observe(g,{childList:!0,subtree:!0}),d.__urpppNoticeObs={root:g,observer:L}}catch{}}return{bindNoticeHoverScrub:y,scheduleBeautifyNoticeTables:_}}function Ai({getCurrentTheme:o,documentRef:n=document,getComputedStyleRef:c=getComputedStyle}){function d(){try{return c(n.documentElement).getPropertyValue("--surface").trim()||(o()==="dark"?"#151A24":"#FFFFFF")}catch{return o()==="dark"?"#151A24":"#FFFFFF"}}function u(y){if(!y?.classList?.contains("urppp-notice-row"))return;let _=d();y.classList.remove("hover"),y.style.setProperty("background",_,"important"),y.style.setProperty("background-color",_,"important"),y.querySelectorAll("td, th").forEach(g=>{g.classList.remove("hover"),g.style.setProperty("background","transparent","important"),g.style.setProperty("background-color","transparent","important")})}function k(y){try{let _=y||n;if(_.matches?.("tr.urppp-notice-row")){u(_);return}_.querySelectorAll("table.urppp-notice-table tr.urppp-notice-row").forEach(u)}catch{}}function P(y){y&&(y.classList.remove("table-hover","table-striped"),y.classList.add("urppp-notice-nohover"),y.querySelectorAll("tr.urppp-notice-row").forEach(_=>{_.classList.remove("hover"),u(_)}))}function S(y){if(!y)return;y.classList.remove("urppp-notice-table"),delete y.dataset.urpppNoticeScan,y.style.removeProperty("border"),y.style.removeProperty("border-left"),y.style.removeProperty("background");let _=y.closest(".urppp-table-wrap.urppp-notice-wrap");_&&(_.classList.remove("urppp-notice-wrap"),_.style.removeProperty("border"),_.style.removeProperty("background"),_.style.removeProperty("box-shadow"),_.style.removeProperty("overflow"),_.style.removeProperty("border-radius")),y.querySelectorAll("tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card").forEach(g=>{g.classList.remove("urppp-notice-row","urppp-notice-title-cell","urppp-notice-date-cell","urppp-notice-bullet-cell","urppp-notice-link","urppp-notice-time","urppp-notice-card","urppp-notice-card-row","urppp-notice-main","urppp-notice-meta","urppp-notice-title","urppp-notice-body"),(g.tagName==="TR"||g.tagName==="TD")&&["display","border","background","padding","margin","width","box-shadow","border-radius","float","position"].forEach(v=>{g.style.getPropertyPriority(v)==="important"&&g.style.removeProperty(v)}),delete g.dataset.urpppNoticeDone})}return{disarmNoticeTableHover:P,pinNoticeRowSurface:u,scrubNoticeInlineBg:k,stripMistakenNoticeTable:S}}function Si({isNativePdfIsolationActive:o,bindNoticeHoverScrub:n,scrubNoticeInlineBg:c,stripMistakenNoticeTable:d,disarmNoticeTableHover:u,pinNoticeRowSurface:k,isBusinessDataTable:P,isNoticeListTable:S,isNoticePageContext:y,isNoticeBulletText:_,documentRef:g=document,windowRef:v=window,logger:L=console}){function C(){if(!o())try{n(),c(),g.querySelectorAll("table.urppp-notice-table, table.table").forEach(h=>{P(h)&&(h.classList.contains("urppp-notice-table")||h.querySelector(".urppp-notice-row, .urppp-notice-title-cell"))&&d(h)});let f=new Set(g.querySelectorAll('.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'));y()?g.querySelectorAll("table").forEach(h=>f.add(h)):g.querySelectorAll("table").forEach(h=>{S(h)&&f.add(h)}),Array.from(f).forEach(h=>{if(!h||P(h))return;if(h.querySelector("thead th")&&h.querySelectorAll("thead th").length>=3){let q=h.querySelector("thead")?.textContent||"";if(!S(h)&&/序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(q)&&!/标题|公告|通知/.test(q))return}let w=Array.from(h.querySelectorAll("tbody > tr, tr")).filter(q=>q.querySelector("td"));if(!w.length)return;let x=0;w.slice(0,12).forEach(q=>{let D=Array.from(q.children).filter(rt=>rt.tagName==="TD"||rt.tagName==="TH");if(D.length>=5)return;let $=(q.textContent||"").replace(/\s+/g," ").trim(),j=!!q.querySelector("a[href], a[onclick], a"),G=/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test($),U=D.some(rt=>_(rt.textContent));(j&&G||U&&j||U&&G)&&(x+=1)});let E=h.classList.contains("no-border-top")||/dashed|border-left-style/.test(h.getAttribute("style")||""),z=y();if(x<1){if(z){if(w.slice(0,8).filter(D=>{let $=Array.from(D.children).filter(G=>G.tagName==="TD"||G.tagName==="TH");if($.length<1||$.length>4)return!1;let j=(D.textContent||"").replace(/\s+/g," ").trim();return!!D.querySelector("a")||/\d{4}/.test(j)}).length<1&&!E)return}else if(!(E&&/公告|通知/.test(g.title||"")))return}if(P(h))return;h.classList.add("urppp-notice-table"),h.dataset.urpppNoticeScan="1",u(h),h.style.setProperty("border","none","important"),h.style.setProperty("border-left","none","important"),h.style.setProperty("background","transparent","important"),h.style.setProperty("width","100%","important");let M=h.closest(".urppp-table-wrap");M&&(M.classList.add("urppp-notice-wrap"),M.style.setProperty("border","none","important"),M.style.setProperty("background","transparent","important"),M.style.setProperty("box-shadow","none","important"),M.style.setProperty("overflow","visible","important"),M.style.setProperty("border-radius","0","important")),w.forEach(q=>{if(q.dataset.urpppNoticeDone==="1")return;let D=Array.from(q.children).filter(J=>J.tagName==="TD"||J.tagName==="TH");if(!D.length)return;let $=J=>(J||"").replace(/\u00AD/g,"").replace(/\u200B/g,"").replace(/\s+/g," ").trim();if(D.length>=2){let J=null,Y=null,ot=null;if(D.forEach((K,ct)=>{let at=$(K.textContent),st=!!K.querySelector("a");if(!J&&_(at)&&(ct===0||D.length>=2)){J=K;return}if(!ot&&(/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(at)||/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(at)||/text-align\s*:\s*right/i.test(K.getAttribute("style")||"")||ct===D.length-1&&at.length<=28&&/\d{4}/.test(at))&&/\d{4}/.test(at)&&at.length<=32){ot=K;return}!Y&&(st||at.length>4)&&(Y=K)}),Y||(Y=D.find(K=>K!==J&&K!==ot)||D[0]),!ot&&D.length>=2){let K=D[D.length-1];K!==Y&&K!==J&&(ot=K)}if(q.classList.add("urppp-notice-row"),k(q),q.removeAttribute("width"),q.style.setProperty("flex-wrap","nowrap","important"),D.forEach(K=>{K.removeAttribute("width"),K.removeAttribute("height"),K.removeAttribute("align"),K.style.setProperty("border","none","important"),K.style.setProperty("background","transparent","important"),K.style.setProperty("vertical-align","middle","important"),K.style.removeProperty("width"),K.style.setProperty("width","auto","important")}),J&&(J.classList.add("urppp-notice-bullet-cell"),J.style.setProperty("display","none","important"),J.style.setProperty("width","0","important"),J.style.setProperty("padding","0","important")),Y){Y.classList.add("urppp-notice-title-cell"),Y.removeAttribute("width"),Y.style.setProperty("width","auto","important"),Y.style.setProperty("max-width","100%","important"),Y.style.setProperty("min-width","0","important"),Y.style.setProperty("flex","1 1 0%","important"),Y.style.setProperty("overflow","hidden","important"),Y.style.setProperty("padding","0","important"),Y.style.setProperty("pointer-events","auto","important"),Y.style.setProperty("white-space","nowrap","important");let K=Y.querySelector("a[href], a[onclick], a");if(K||(K=q.querySelector("a[href], a[onclick], a")),K){Y.contains(K)||(Y.innerHTML="",Y.appendChild(K)),K.classList.add("urppp-notice-link");let ct=K.getAttribute("href"),at=K.getAttribute("onclick"),st=K.getAttribute("target"),xt=$(K.textContent);K.textContent=xt,ct!=null&&K.setAttribute("href",ct),at!=null&&K.setAttribute("onclick",at),st!=null&&K.setAttribute("target",st),K.style.setProperty("color","var(--text)","important"),K.style.setProperty("text-decoration","none","important"),K.style.setProperty("font-size","14px","important"),K.style.setProperty("font-weight","500","important"),K.style.setProperty("line-height","1.5","important"),K.style.setProperty("pointer-events","auto","important"),K.style.setProperty("cursor","pointer","important"),K.style.setProperty("position","relative","important"),K.style.setProperty("z-index","2","important"),K.style.setProperty("display","block","important"),K.style.setProperty("white-space","nowrap","important"),K.style.setProperty("overflow","hidden","important"),K.style.setProperty("text-overflow","ellipsis","important"),q.dataset.urpppNoticeClickBound!=="1"&&(q.dataset.urpppNoticeClickBound="1",q.style.setProperty("cursor","pointer","important"),q.addEventListener("click",tt=>{if(tt.target&&tt.target.closest&&tt.target.closest("a,button,input,select,textarea,label"))return;if(K.getAttribute("onclick")){K.click();return}let dt=K.getAttribute("href");if(!dt||dt==="#"||dt.indexOf("javascript:")===0){K.click();return}K.target==="_blank"?v.open(dt,"_blank"):v.location.href=dt}))}else{let ct=$(Y.textContent);ct&&!Y.querySelector("button, input, select")&&(!Y.querySelector("*")||Y.children.length===0)&&(Y.textContent=ct)}}if(ot){ot.classList.add("urppp-notice-date-cell"),ot.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-end !important","flex:0 0 auto !important","width:auto !important","max-width:none !important","white-space:nowrap !important","text-align:right !important","padding:0 !important","margin:0 0 0 auto !important","border:none !important","background:transparent !important","float:none !important","position:static !important","right:auto !important","left:auto !important","top:auto !important"].join(";");let K=$(ot.textContent);ot.innerHTML="";let ct=g.createElement("span");ct.className="urppp-notice-time",ct.textContent=K,ot.appendChild(ct)}Y&&(Y.style.setProperty("flex","1 1 auto","important"),Y.style.setProperty("min-width","0","important"),Y.style.setProperty("margin","0","important"),Y.style.setProperty("float","none","important"),Y.style.setProperty("position","static","important")),q.style.setProperty("display","flex","important"),q.style.setProperty("align-items","center","important"),q.style.setProperty("justify-content","space-between","important"),q.style.setProperty("gap","16px","important"),q.style.setProperty("max-width","100%","important"),q.style.setProperty("box-sizing","border-box","important"),q.style.setProperty("overflow","hidden","important"),q.dataset.urpppNoticeDone="1";return}let j=D[0],G=Array.from(j.querySelectorAll(":scope > span"));if(G.length<2){let J=j.querySelector("a"),Y=$(j.textContent),ot=Y.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);if(J||ot){q.classList.add("urppp-notice-row");let K=g.createElement("div");K.className="urppp-notice-card urppp-notice-card-row";let ct=g.createElement("div");if(ct.className="urppp-notice-main",J){J.classList.add("urppp-notice-link");let at=J.getAttribute("href"),st=J.getAttribute("onclick"),xt=$(J.textContent);J.textContent=xt,at!=null&&J.setAttribute("href",at),st!=null&&J.setAttribute("onclick",st),J.style.setProperty("pointer-events","auto","important"),J.style.setProperty("cursor","pointer","important"),ct.appendChild(J),q.dataset.urpppNoticeClickBound!=="1"&&(q.dataset.urpppNoticeClickBound="1",q.style.setProperty("cursor","pointer","important"),q.addEventListener("click",tt=>{if(!(tt.target&&tt.target.closest&&tt.target.closest("a,button,input,select"))){if(J.getAttribute("onclick")||!J.getAttribute("href")||J.getAttribute("href")==="#"){J.click();return}v.location.href=J.getAttribute("href")}}))}else{let at=g.createElement("div");at.className="urppp-notice-title",at.textContent=ot?Y.replace(ot[0],"").trim():Y,ct.appendChild(at)}if(K.appendChild(ct),ot){let at=g.createElement("div");at.className="urppp-notice-meta";let st=g.createElement("span");st.className="urppp-notice-time",st.textContent=ot[1],at.appendChild(st),K.appendChild(at)}j.innerHTML="",j.appendChild(K),j.dataset.urpppNoticeDone="1",q.dataset.urpppNoticeDone="1"}return}let U=null,rt=null,it=[];if(G.forEach(J=>{let Y=(J.getAttribute("style")||"")+" "+(J.style.cssText||""),ot=$(J.textContent);if(ot){if(/font-size\s*:\s*18/i.test(Y)||!U&&/font-size\s*:\s*1[6-9]/i.test(Y)){U=J;return}if(/font-size\s*:\s*12/i.test(Y)||/float\s*:\s*right/i.test(Y)||/^\d{4}-\d{2}-\d{2}/.test(ot)){rt=J;return}it.push(J)}}),U||(U=G[0]),!rt){let J=G[G.length-1];J!==U&&(rt=J)}let bt=g.createElement("div");if(bt.className="urppp-notice-card",U){let J=g.createElement("div");J.className="urppp-notice-title",J.textContent=$(U.textContent),bt.appendChild(J)}if((it.length?it:G.filter(J=>J!==U&&J!==rt)).forEach(J=>{let Y=g.createElement("div");Y.className="urppp-notice-body",Y.textContent=$(J.textContent),Y.textContent&&bt.appendChild(Y)}),rt){let J=g.createElement("div");J.className="urppp-notice-meta";let Y=g.createElement("span");Y.className="urppp-notice-time",Y.textContent=$(rt.textContent),J.appendChild(Y),bt.appendChild(J)}j.innerHTML="",j.appendChild(bt),j.dataset.urpppNoticeDone="1",q.dataset.urpppNoticeDone="1",q.classList.add("urppp-notice-row")})})}catch(f){L.warn("[URP++] notice table beautify failed",f)}}return{beautifyNoticeTables:C}}var _i={"page-content-template":"urppp-pdf-page",mycoursetable:"urppp-pdf-mycoursetable",courseTable:"urppp-pdf-courseTable",courseTableBody:"urppp-pdf-courseTableBody",h4_id1:"urppp-pdf-h4-1",h4_id2:"urppp-pdf-h4-2",infoTable:"urppp-pdf-info-table","rwskxxbg-course":"urppp-pdf-rwskxxbg","other-course":"urppp-pdf-other-course",temp_title:"urppp-pdf-temp-title",temp_subtitle:"urppp-pdf-temp-subtitle"};function md(o){return o.querySelectorAll('script, iframe, object, embed, [id^="urppp-"], [data-urppp]').forEach(n=>n.remove()),[o,...o.querySelectorAll("*")].forEach(n=>{Array.from(n.classList||[]).forEach(c=>{/^urppp(?:-|$)/.test(c)&&n.classList.remove(c)}),Array.from(n.attributes||[]).forEach(c=>{/^data-urppp(?:-|$)/.test(c.name)&&n.removeAttribute(c.name)}),n.style&&Array.from(n.style).forEach(c=>{n.style.getPropertyPriority(c)==="important"&&n.style.removeProperty(c)})}),o}function bd(o){return[o,...o.querySelectorAll("*")].forEach(n=>{n.id&&_i[n.id]&&(n.id=_i[n.id]),n.classList.contains("class_div")&&(n.classList.remove("class_div"),n.classList.remove("box_font"),n.classList.add("urppp-pdf-card")),n.classList.contains("course")&&(n.classList.remove("course"),n.classList.add("urppp-pdf-course"))}),o}function hd(){let o=[];document.querySelectorAll('style[id^="urppp-"]').forEach(d=>{d.sheet&&!d.sheet.disabled&&(o.push(d),d.sheet.disabled=!0)});let n=0,c=document.getElementById("mycoursetable");return c&&(n=c.getBoundingClientRect().width),o.forEach(d=>{d.sheet.disabled=!1}),n}var fd=`
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
`;function gd(o){o.querySelectorAll("td, th").forEach(n=>{n.style.removeProperty("background"),n.style.removeProperty("background-color")}),o.querySelectorAll("th[rowspan]").forEach(n=>{n.style.removeProperty("width"),n.style.setProperty("white-space","nowrap"),n.style.setProperty("text-align","center")}),o.querySelectorAll("table").forEach(n=>{n.style.setProperty("background","#ffffff","important"),n.style.setProperty("background-color","#ffffff","important"),n.style.setProperty("border","none","important"),n.style.setProperty("color","#000000","important")}),o.querySelectorAll("th").forEach(n=>{if(n.style.setProperty("color","#000000","important"),n.style.setProperty("border","1px solid #dddddd","important"),n.style.setProperty("font-weight","normal","important"),n.childNodes.length===1&&n.firstChild&&n.firstChild.nodeType===3){let c=document.createElement("span");c.textContent=n.textContent,n.textContent="",n.appendChild(c)}}),o.querySelectorAll("thead th").forEach(n=>{n.style.setProperty("background","#dddddd","important"),n.style.setProperty("background-color","#dddddd","important")}),o.querySelectorAll("tbody th").forEach(n=>{n.style.setProperty("background","transparent","important"),n.style.setProperty("background-color","transparent","important")}),o.querySelectorAll("td").forEach(n=>{n.style.setProperty("background","transparent","important"),n.style.setProperty("background-color","transparent","important"),n.style.setProperty("color","#000000","important"),n.style.setProperty("border","1px solid #dddddd","important")})}function Ei(o){let n=hd(),c=document.createElement("div");c.id="urppp-pdf-stage",c.style.cssText="position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;width:"+(n||window.innerWidth||1440)+"px;";let d=document.createElement("div");d.id="urppp-pdf-page",d.style.cssText="position:relative;width:100%;box-sizing:border-box;";let u=o.cloneNode(!0);md(u),bd(u),d.appendChild(u),c.appendChild(d),gd(u);let k=document.createElement("style");k.id="urppp-pdf-reset-style",k.textContent=fd,document.head.appendChild(k),document.body.appendChild(c);let P=c.querySelector("#urppp-pdf-mycoursetable"),S=c.querySelector("#urppp-pdf-page")||c;if(!P)throw c.remove(),new Error("无法建立原生课表捕获节点");return{stage:c,target:P,page:S,sourceHost:o}}var va=0;function fe(){return va>0}function xd(o){return!o||o.tagName!=="STYLE"?!1:/^urppp(?:-|$)/.test(o.id||"")||o.hasAttribute("data-urppp-style")?!0:(o.textContent||"").includes("urppp-")}function Ci(){try{if(typeof unsafeWindow<"u"&&unsafeWindow)return unsafeWindow}catch{}return typeof window<"u"?window:null}function Pi(o,n){let c=o&&typeof o.requestAnimationFrame=="function"?o.requestAnimationFrame.bind(o):typeof requestAnimationFrame=="function"?requestAnimationFrame:null;return c?c(n):setTimeout(n,0)}function yd(o={}){let n=o.document||(typeof document<"u"?document:null),c=o.page||Ci();if(!n)throw new Error("原生 PDF 隔离缺少 document");let d=n.getElementById("mycoursetable");if(!d)throw new Error("当前页面没有课表节点");va+=1;let u=[d,...d.querySelectorAll("*")],k=[],P=n.getElementById("soliderbox");P&&k.push(P);let S=d.parentElement;for(;S&&S!==n.documentElement;){let x=S.classList;(S.id==="page-content-template"||x&&(x.contains("page-content")||x.contains("profile-info-row")||x.contains("profile-info-value")))&&k.push(S),S=S.parentElement}let y=n.getElementById("page-content-template")||n.querySelector(".page-content");y&&!k.includes(y)&&k.push(y);let _=[...u,...k],g=_.map(x=>({element:x,style:x.getAttribute("style")})),v=Array.from(n.querySelectorAll("style")).filter(xd).map(x=>({style:x,disabled:x.sheet?x.sheet.disabled:!1,media:x.getAttribute("media")})),L=Array.from(d.querySelectorAll('[id^="urppp-"], [data-urppp]')),C=c&&c.divBuild,f=c&&c.__urpppOriginalDivBuild,h=!1,w=()=>{h||(h=!0,c&&c.divBuild===f&&typeof C=="function"&&(c.divBuild=C),g.forEach(({element:x,style:E})=>{x.isConnected&&(E===null?x.removeAttribute("style"):x.setAttribute("style",E))}),L.forEach(x=>x.removeAttribute("data-urppp-pdf-hidden")),v.forEach(({style:x,disabled:E,media:z})=>{try{z===null?x.removeAttribute("media"):x.setAttribute("media",z),x.sheet&&(x.sheet.disabled=E)}catch{}}),va=Math.max(0,va-1),Pi(c,()=>{try{typeof o.onAfterRestore=="function"&&o.onAfterRestore()}catch{}}))};try{return v.forEach(({style:x})=>{try{x.setAttribute("media","not all"),x.sheet&&(x.sheet.disabled=!0)}catch{}}),_.forEach(x=>{!x.style||!x.style.length||Array.from(x.style).forEach(E=>{x.style.getPropertyPriority(E)==="important"&&(E==="height"&&x.matches("td, th")||x.style.removeProperty(E))})}),d.querySelectorAll("td").forEach(x=>{x.style.removeProperty("background"),x.style.removeProperty("background-color")}),y&&y.style.setProperty("position","relative","important"),d.style.setProperty("position","static","important"),d.querySelectorAll("td").forEach(x=>{x.style.setProperty("position","static","important")}),L.forEach(x=>{x.setAttribute("data-urppp-pdf-hidden","1"),x.style.setProperty("display","none","important")}),c&&typeof f=="function"&&(c.divBuild=f),w}catch(x){throw w(),x}}function zi(o,n={}){return new Promise((c,d)=>{let u=n.page||Ci(),k=u&&u.back,P=u&&u.html2canvas;if(!o||typeof k!="function"){d(new Error("教务原生导出依赖未就绪"));return}let S=null;try{S=yd(n)}catch(f){d(f);return}let y=0,_=!1,g=null,v=null,L=f=>{if(!_){_=!0,y&&clearTimeout(y),u&&g&&u.back===g&&(u.back=k),v&&u.html2canvas===v&&(u.html2canvas=P);try{S&&S()}catch{}f?d(f):c()}},C=f=>L(f instanceof Error?f:new Error(String(f)));typeof P=="function"&&(v=function(){let f=P.apply(this,arguments);return f&&typeof f.catch=="function"&&f.catch(C),f},u.html2canvas=v),g=function(){try{return k.apply(this,arguments)}finally{setTimeout(()=>L(),0)}},u.back=g,y=setTimeout(()=>{try{k.call(u)}catch{}C(new Error("原生 PDF 生成超时"))},n.timeoutMs||60*1e3),Pi(u,()=>{try{o.click()}catch(f){C(f)}})})}var Li=`.urppp-private-value{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;font-style:inherit!important;line-height:inherit!important;letter-spacing:0!important;color:inherit!important}
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
`;var qi=`      /* 全局 */
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
`;var Ti=`/* Personal and resource schedule course cards. Keep table cells and table surfaces untouched. */
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
`;var Mi=`.urppp-export-wrap{position:relative!important;display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;margin-left:7px!important;font-weight:400!important;vertical-align:middle!important;white-space:nowrap!important}
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
`;var Ii=`/* Settings panel shell */
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
`;var $i=`      /* 表格美化：业务表格、分页、公告卡片（table-beautify） */
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
`;var Ni=`      /* 导航：顶栏、侧栏、面包屑（navigation） */
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
`;var Bi=`/* ===== 插件弹窗统一进入动画：淡入+缩放 + 内容逐条浮现 ===== */
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
`;var Fi=`      /* 首页重构仪表板（dashboard） */
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
`;var Di=`      /* 成绩分析面板（score-analysis） */
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
`;var ji=`      /* ============================================================
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
`;function Oi(){return{open:!1,mobileTab:"home",scoreAnalysisTab:"overview",profile:null,schedule:null,scores:null,catalog:null,occupancy:null,currentBuilding:null,loading:{profile:!1,schedule:!1,scores:!1,room:!1},roomError:"",roomDateOffset:0,selected:{passing:new Set,scheme:new Set},activeSchemeIdx:0,_schemeUserSelected:!1,viewWeek:0,weekLocked:!1,_termWeek:0,_termWeekResolved:!1,uiReady:!1}}function Ri(o){o.profile=null,o.schedule=null,o.scores=null,o.catalog=null,o.occupancy=null,o._termWeekResolved=!1,o._schemeUserSelected=!1,o._schemeInited=!1}function Hi({state:o,deps:n}){async function c(u){if(!u&&o.catalog&&o.catalog.length||o.loading.room)return o.catalog;o.loading.room=!0;try{n.render()}catch{}try{o.catalog=await n.loadClassroomCatalog(),o.roomError=""}catch(k){o.catalog=o.catalog||[],o.roomError=String(k&&k.message||k),console.warn("[URP++] room catalog",k)}finally{o.loading.room=!1;try{n.scheduleRender()}catch{}}return o.catalog}async function d(u){u&&Ri(o),o.loading.profile=o.loading.schedule=o.loading.scores=!0;try{let k=await n.ensureTermWeekResolved();!o.weekLocked&&k>=1&&(o.viewWeek=k)}catch{}if(n.render(),await Promise.all([(async()=>{try{o.profile&&!u||(o.profile=await n.loadProfile()),n.reconcileProfileAndScores()}catch(k){o.profile={name:"同学",majorPlan:"主修方案",majorGpa:"—",avatar:""},console.warn(k)}finally{o.loading.profile=!1,n.scheduleRender()}})(),(async()=>{try{o.schedule&&!u||(o.schedule=await n.loadSchedule())}catch(k){o.schedule={courses:[],error:String(k&&k.message||k)}}finally{if(o.loading.schedule=!1,!o.weekLocked){let k=n.getCurrentWeekNumber()||n.readRememberedTermWeek();k>=1&&(o.viewWeek=k)}n.scheduleRender()}})(),(async()=>{let k=null;try{o.scores&&!u||(o.scores=await n.loadScores(u)),k=o.scores,n.reconcileProfileAndScores(),k&&!k.error&&!k.evaluationReady&&n.enrichScoresWithEvaluation(k).then(()=>{o.scores===k&&(n.reconcileProfileAndScores(),n.scheduleRender())}).catch(P=>{console.warn("[URP++] attach evaluation",P)})}catch(P){o.scores={passing:[],schemes:[],error:String(P&&P.message||P)}}finally{o.loading.scores=!1,n.scheduleRender()}})()]),n.reconcileProfileAndScores(),!o.weekLocked){let k=n.getCurrentWeekNumber()||n.readRememberedTermWeek();k>=1&&(o.viewWeek=k)}n.scheduleRender()}return{ensureRoomCatalogLoaded:c,loadAll:d}}var cr={autumn:{name:"秋季学期",weeks:20,start:"2026-08-31",end:"2027-02-20",events:[{t:"reg",name:"本科生新生报到",start:"2026-08-24",end:"2026-08-25"},{t:"reg",name:"在校生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"研究生新生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"在校本科补缓考",start:"2026-08-28",end:"2026-08-30"},{t:"term",name:"本科生开学典礼",start:"2026-09-01"},{t:"term",name:"研究生开学典礼",start:"2026-09-04"},{t:"term",name:"在校生正式行课",start:"2026-08-31",end:"2026-09-06"},{t:"holiday",name:"中秋节",start:"2026-09-25"},{t:"holiday",name:"国庆节假期",start:"2026-10-01",end:"2026-10-07"},{t:"sport",name:"校秋季田径运动会",start:"2026-10-23",end:"2026-10-24"},{t:"exam",name:"本科生期末集中考试周",start:"2027-01-04",end:"2027-01-15"},{t:"holiday",name:"寒假",start:"2027-01-18",end:"2027-02-20"},{t:"holiday",name:"春节",start:"2027-02-06"}]},spring:{name:"春季学期",weeks:18,start:"2027-03-01",end:"2027-07-03",events:[{t:"reg",name:"在校生报到",start:"2027-02-25",end:"2027-02-26"},{t:"term",name:"正式行课",start:"2027-03-01",end:"2027-03-07"},{t:"holiday",name:"清明节",start:"2027-04-05"},{t:"holiday",name:"劳动节假期",start:"2027-05-01",end:"2027-05-05"},{t:"holiday",name:"端午节",start:"2027-06-09"},{t:"exam",name:"期末集中考试",start:"2027-06-21",end:"2027-06-27"},{t:"term",name:"毕业典礼",start:"2027-06-25"},{t:"holiday",name:"暑假开始",start:"2027-07-04"}]}},vd={"2026-08-24":"农历七月十二","2026-08-25":"农历七月十三","2026-08-27":"农历七月十五","2026-08-28":"农历七月十六","2026-08-30":"农历七月十八","2026-08-31":"农历七月十九","2026-09-01":"农历七月二十","2026-09-04":"农历七月廿三","2026-09-25":"农历八月十五","2026-10-01":"农历八月廿一","2026-10-07":"农历八月廿七","2026-10-23":"农历九月十四","2026-10-24":"农历九月十五","2027-01-04":"农历冬月廿七","2027-01-15":"农历腊月初八","2027-01-18":"农历腊月十一","2027-02-06":"农历正月初一","2027-02-20":"农历正月十五","2027-02-25":"农历正月二十","2027-02-26":"农历正月廿一","2027-03-01":"农历正月廿四","2027-04-05":"农历二月廿九","2027-05-01":"农历三月廿五","2027-05-05":"农历三月廿九","2027-06-09":"农历五月初五","2027-06-21":"农历五月十七","2027-06-25":"农历五月廿一","2027-06-27":"农历五月廿三","2027-07-03":"农历五月廿九","2027-07-04":"农历六月初一"},Nr={term:{color:"#44616f",label:"教学/开学"},reg:{color:"#8a74bd",label:"报到"},exam:{color:"#c08a3f",label:"考试周"},holiday:{color:"#d0716a",label:"假期"},sport:{color:"#778e63",label:"运动会"}};function Gi(){let o=new Date,n=c=>String(c).padStart(2,"0");return`${o.getFullYear()}-${n(o.getMonth()+1)}-${n(o.getDate())}`}function Fo(o,n){return Math.round((Date.parse(n)-Date.parse(o))/864e5)}function Do(o,n){let c=Fo(cr[o].start,n);return c<0?0:Math.floor(c/7)+1}function No(o){return vd[o]||""}function Ui(o){return String(o||"").slice(5)}function wd(o){let n=o||Gi(),[c,d]=n.split("-").map(Number);return d===8&&n>="2026-08-15"||d>=9||d<=2?"autumn":"spring"}function jo(o,n){let c=o&&cr[o]?o:"autumn",d=cr[c],u=n||Gi(),k=d.events.map(g=>({e:g,d:Fo(u,g.start)})).filter(g=>g.d>=-0).sort((g,v)=>g.d-v.d)[0],P=k?Fo(u,k.e.start):null,S=Do(c,u),y=Math.max(0,Math.min(100,S/d.weeks*100)),_=u>=d.start;return{term:d,termId:c,next:k,daysLeft:P,weekNo:S,progress:y,started:_,today:u}}function Ji(o,n){let c=jo(o,n),d=c.next?Nr[c.next.e.t].color:"#c9cdd4",u=c.term;return`<button type="button" class="uc-cal-summary" data-urppp-cal-open aria-label="打开校历时间线">
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
  </button>`}function Vi(o,n){let c=jo(o,n);return`<button type="button" class="uc-cal-summary uc-cal-summary-compact" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-c-dot" style="background:${c.next?Nr[c.next.e.t].color:"#c9cdd4"}"></span>
    <span class="cal-c-count"><b>${c.daysLeft==null?"—":c.daysLeft}</b><em>天后</em></span>
    <span class="cal-c-info">
      <span class="cal-c-name">${c.next?c.next.e.name:"学期已结束"}</span>
      <span class="cal-c-sub">${c.started?`第 ${c.weekNo} 周`:"尚未开学"} · ${c.term.name}</span>
    </span>
    <span class="cal-c-prog"><span class="cal-c-bar"><i style="width:${c.progress}%"></i></span><span class="cal-c-week">本学期进度 ${Math.min(c.weekNo,c.term.weeks)}/${c.term.weeks} 周</span></span>
  </button>`}function Wi(o,n){let c=jo(o,n),d=c.next?Nr[c.next.e.t].color:"#c9cdd4",u=c.term,k=Object.keys(cr).map(v=>`<button type="button" class="cal-term${v===c.termId?" ac":""}" data-cal-term="${v}">${cr[v].name}</button>`).join(""),P=`<div class="cal-widget">
    <div class="cal-w-left">
      <div class="cal-w-label">下一个事件</div>
      <div class="cal-w-ev"><i style="background:${d}"></i><b>${c.next?c.next.e.name:"学期已结束"}</b></div>
      <div class="cal-w-sub">${c.next?c.next.e.start+(c.next.e.end&&c.next.e.end!==c.next.e.start?" ~ "+c.next.e.end:""):""}${c.next&&No(c.next.e.start)?" · "+No(c.next.e.start):""}</div>
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
  </div>`,S=u.events.slice().sort((v,L)=>v.start<L.start?-1:1),y={};S.forEach(v=>{(y[v.start.slice(0,7)]=y[v.start.slice(0,7)]||[]).push(v)});let _=v=>v===c.today?" cal-today":"",g=Object.keys(y).map(v=>{let[,L]=v.split("-");return`<div class="cal-mon">
      <div class="cal-mon-label">${Number(L)} 月</div>
      <div class="cal-mon-items">${y[v].map(C=>{let f=Nr[C.t].color,h=C.end&&C.end!==C.start?"~"+Ui(C.end):"",w=Do(c.termId,C.start)>0?`第 ${Do(c.termId,C.start)} 周`:"开学前";return`<div class="cal-ev${_(C.start)}">
          <span class="cal-ev-dot" style="background:${f}"></span>
          <span class="cal-ev-date">${Ui(C.start)}${h||""}<em>${No(C.start)||"&nbsp;"}</em></span>
          <span class="cal-ev-name">${C.name}</span>
          <span class="cal-ev-tag" style="color:${f};background:${f}1a">${Nr[C.t].label}</span>
          <span class="cal-ev-wk">${w}</span>
        </div>`}).join("")}</div>
    </div>`}).join("");return`<div class="cal-modal-wrap">
    <div class="cal-modal-top">
      <span class="cal-modal-title">校历时间线</span>
      <span class="cal-right"><span class="cal-term-pills">${k}</span><button type="button" class="cal-close" aria-label="关闭">✕</button></span>
    </div>
    ${P}
    <div class="cal-timeline">${g}</div>
  </div>`}function Yi(o,n){let c=typeof document<"u"?document:null;if(!c)return;Bo();let d=o&&cr[o]?o:wd(n),u=c.createElement("div");u.id="urppp-cal-modal",u.innerHTML=`<div class="cal-overlay"></div>
    <div class="cal-dialog"><div class="cal-body">${Wi(d,n)}</div></div>`,c.documentElement.appendChild(u),setTimeout(()=>u.classList.add("open"),20),u.querySelector(".cal-overlay").addEventListener("click",()=>Bo()),u.addEventListener("click",k=>{let P=k.target;if(P&&P.closest&&P.closest(".cal-close")){Bo();return}let S=P&&P.closest?P.closest("[data-cal-term]"):null;if(S){let y=u.querySelector(".cal-body");y&&(y.innerHTML=Wi(S.dataset.calTerm,n)),u.querySelectorAll("[data-cal-term]").forEach(_=>_.classList.toggle("ac",_.dataset.calTerm===S.dataset.calTerm))}})}function Bo(){let o=typeof document<"u"?document:null;if(!o)return;let n=o.getElementById("urppp-cal-modal");n&&(n.classList.remove("open"),n.classList.add("closing"),setTimeout(()=>{n.remove()},200))}function Qi(o,n){let c=o||(typeof document<"u"?document:null);c&&c.addEventListener("click",d=>{let u=d.target;u&&u.closest&&u.closest("[data-urppp-cal-open]")&&(d.preventDefault(),d.stopPropagation(),Yi())})}var wa=!1;function Oo(){let o=typeof document<"u"?document:null;if(!o||wa)return wa;try{let n=o.createElement("style");if(n&&n.id!==void 0){n.id="urppp-cal-style",n.textContent=`
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
  `,n.id="urppp-cal-style";let c=o.head||o.documentElement;c&&c.appendChild(n),wa=!0}}catch{}return wa}function Ki(){let o=typeof document<"u"?document:null;if(!o)return;let n=o.getElementById("urppp-nav-theme")||o.querySelector("#navbar .navbar-header")||o.getElementById("navbar"),c=o.getElementById("urppp-nav-clean"),d=o.getElementById("urppp-nav-cal");if(!n&&!c)return;let u=c&&c.parentElement||n;d&&d.parentElement===u||(d&&d.remove(),d=o.createElement("button"),d.type="button",d.id="urppp-nav-cal",d.title="校历时间线",d.setAttribute("aria-label","校历时间线"),d.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg><span>校历</span>',Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none",margin:"0 0 0 8px","vertical-align":"middle"}).forEach(([k,P])=>d.style.setProperty(k,P,"important")),d.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation(),Yi()}),c&&c.parentElement?c.after(d):u&&u.appendChild(d))}function Zi(){let o=typeof document<"u"?document:null;if(!o)return;let n=o.getElementById("urppp-nav-cal");n&&n.remove()}function Xi({state:o,deps:n}){let c=0,d={gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)"};function u(x,E){let z=x||n.summarizeCourses([]);return`<div class="uc-metrics">${[["TotalCredit","总学分",z.totalCredit],["AvgScore","平均成绩",z.avgScore],["AvgGpa","平均绩点",z.avgGpa],["RequiredCredit","必修学分",z.requiredCredit],["RequiredAvg","必修平均",z.requiredAvg],["RequiredGpa","必修绩点",z.requiredGpa]].map(([q,D,$])=>{let j=n.classifyPrivacyLabel(D)||"grade",G=E&&n.DIRECT_EDIT_LABELS[E+q]?` data-urppp-edit-key="${E+q}"`:"";return`<div class="uc-metric"><em>${D}</em><b data-urppp-private="${j}"${G}>${$}</b></div>`}).join("")}</div>`}function k(){let x=o.scores;if(!x||x.error)return`<div class="uc-sa-empty">${n.escapeHtml(x&&x.error||"暂无成绩数据")}</div>`;let E=null;try{E=n.analyzeScores({scorePack:x,profile:o.profile})}catch{}if(!E||E.empty)return'<div class="uc-sa-empty">暂无可用成绩数据，请先查询成绩后再试。</div>';let z=typeof n.scoreChartLayout=="function"?n.scoreChartLayout():null;return`<div class="uc-sa-charts">
      <div class="uc-sa-chart-card"><h5>学期趋势</h5><div class="uc-sa-chart-scroll">${n.trendChartSvg({trend:E.trend,palette:n.scoreChartPalette||d,layout:z})}</div></div>
      <div class="uc-sa-chart-card"><h5>成绩分段分布</h5><div class="uc-sa-chart-scroll">${n.bandsChartSvg({bands:E.bands,palette:n.scoreChartPalette||d,layout:z})}</div></div>
    </div>
    <div class="uc-sa-more-row"><a class="uc-sa-more" data-href="/student/integratedQuery/scoreQuery/allPassingScores/index?urppp=sa">点击此处跳转到详细分析界面 →</a></div>`}function P(x){let E=!!n.isCleanAnalysisDirect(),z=o.scoreAnalysisTab==="analysis";return E?`<div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
  <div class="uc-bd">
    <div class="uc-sa-pane">${x}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis">${k()}</div>
  </div>`:`<div class="uc-hd uc-hd-tabs" role="tablist">
    <button type="button" class="uc-sa-tab${z?"":" ac"}" data-sa-tab="overview">成绩总览</button>
    <button type="button" class="uc-sa-tab${z?" ac":""}" data-sa-tab="analysis">成绩分析</button>
  </div>
  <div class="uc-bd">
    <div class="uc-sa-pane"${z?" hidden":""}>${x}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis"${z?"":" hidden"}>${k()}</div>
  </div>`}function S(){try{if(window.matchMedia&&window.matchMedia("(max-width:900px)").matches)return 40}catch{}return 56}function y(x){let E=n.getViewWeekNumber(),z=S(),M=Math.max(z-4,28),q=(x||[]).map(j=>Object.assign({},j,{thisWeek:n.weekBitActive(j.classWeek,E)||!j.classWeek&&String(j.week||"").indexOf(String(E))>=0,span:Math.max(1,j.span||1),color:j.color||n.courseColor(j.name)})),D={};q.forEach(j=>{let G=j.day+"_"+j.section;(D[G]||(D[G]=[])).push(j)});let $=`<div class="uc-week" data-urppp-private="schedule" data-week="${E}" data-row="${z}">`;$+='<div class="uc-week-head"><div class="h"></div>';for(let j=0;j<7;j++)$+=`<div class="h">${n.DAY_NAMES[j]}</div>`;$+='</div><div class="uc-week-body">',$+='<div class="uc-sec-col">';for(let j=1;j<=12;j++)$+=`<div class="s" style="height:${z}px">${j}</div>`;$+="</div>";for(let j=0;j<7;j++){$+=`<div class="uc-day-col" data-day="${j}" style="height:${z*12}px">`;for(let G=1;G<=12;G++)$+=`<div class="uc-grid-cell" data-sec="${G}" style="top:${(G-1)*z}px;height:${M}px"></div>`;$+=`<div class="uc-part-line" style="top:${4*z-2}px"></div>`,$+=`<div class="uc-part-line" style="top:${9*z-2}px"></div>`;for(let G=1;G<=12;G++){let U=(D[j+"_"+G]||[]).slice().sort((xt,tt)=>xt.thisWeek!==tt.thisWeek?(tt.thisWeek?1:0)-(xt.thisWeek?1:0):(tt.span||1)-(xt.span||1));if(!U.length)continue;let it=U.filter(xt=>xt.thisWeek)[0]||U[0],bt=U.filter(xt=>xt!==it),J=it.span,Y=(G-1)*z+1,ot=J*z-6,K=it.thisWeek?8:2,ct=it.thisWeek?`--uc-course-color:${it.color};top:${Y}px;height:${ot}px;z-index:${K};background:${it.color}26;border-color:${it.color}80`:`--uc-course-color:${it.color};top:${Y}px;height:${ot}px;z-index:${K};background:color-mix(in srgb,${it.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`,at=bt.length?`<span class="uc-badge">+${bt.length}</span>`:"",st=n.escapeHtml(JSON.stringify({name:it.name,teacher:it.teacher,place:it.place,week:it.week,day:it.day,section:it.section,span:it.span,thisWeek:it.thisWeek,others:bt.map(xt=>({name:xt.name,teacher:xt.teacher,place:xt.place,week:xt.week,thisWeek:xt.thisWeek,section:xt.section,span:xt.span}))}));$+=`<div class="uc-lesson${it.thisWeek?"":" is-fade"}" style="${ct}" data-course='${st}'>
          <b>${n.escapeHtml(it.name)}</b>
          <i>${n.escapeHtml([it.place,it.week].filter(Boolean).join(" · "))}</i>
          ${at}
        </div>`}$+="</div>"}return $+="</div></div>",$}function _(){try{if(o.loading&&o.loading.schedule)return"";let x=n.calVacation?n.calVacation():"term";if(x==="term"||n.getViewWeekNumber()!==0)return"";let E={summer:{title:"放暑假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'},winter:{title:"放寒假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>'},springfestival:{title:"春节快乐！",sub:"",svg:'<svg viewBox="0 0 72 72"><rect x="16" y="16" width="40" height="40" rx="7" fill="#b71c1c" stroke="#f5b301" stroke-width="2.4" transform="rotate(45 36 36)"/><path d="M36 16v40M16 36h40" stroke="#f5b301" stroke-width="1" opacity=".5"/><path d="M24 24l24 24M48 24L24 48" stroke="#f5b301" stroke-width="1" opacity=".35"/><text x="36" y="47" text-anchor="middle" font-size="30" font-weight="900" fill="#ffd54f" font-family="Noto Serif SC,STKaiti,KaiTi,serif" transform="rotate(180 36 36)">福</text></svg>',couplet:{scroll:"万象纳祥",right:"望江听雨华西看杏海纳百川享人间烟火",left:"江安漫步眉山泛舟有容乃大过锦绣新年"}}}[x];if(!E)return"";if(x==="springfestival"&&E.couplet){let M=E.couplet;return`<div class="uc-schedule-mask uc-mask-springfestival">
          <span class="uc-mask-scroll">${M.scroll}</span>
          <span class="uc-mask-cl uc-mask-cl-r">${M.right}</span>
          <span class="uc-mask-cl uc-mask-cl-l">${M.left}</span>
          <span class="uc-mask-ico">${E.svg}</span>
          <span class="uc-mask-txt"><b>${E.title}</b></span>
        </div>`}let z=E.sub?`<i>${E.sub}</i>`:"";return`<div class="uc-schedule-mask uc-mask-${x}"><span class="uc-mask-ico">${E.svg}</span><span class="uc-mask-txt"><b>${E.title}</b>${z}</span></div>`}catch{return""}}function g(){return`<div class="uc-services">${[{t:"空闲教室",i:"room",a:"room"},{t:"教学评估",i:"eval",h:"/student/teachingEvaluation/newEvaluation/index"},{t:"培养方案",i:"plan",h:"/student/integratedQuery/planCompletion/index"},{t:"补办学生证",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082"},{t:"免修申请",i:"apply",h:"/student/personalManagement/individualApplication/exemptionApplication/index"},{t:"替代课申请",i:"apply",h:"/student/personalManagement/personalApplication/curriculumReplacement/index"},{t:"火车票优惠卡",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083"}].map(E=>`
      <button type="button" class="uc-svc" data-action="${E.a||""}" data-href="${E.h||""}">
        ${n.ico(E.i)}<strong>${E.t}</strong>
      </button>`).join("")}</div>`}function v(){let x=n.personalizedProfile(o.profile||{}),E=o.schedule&&o.schedule.courses||[],z=o.scores&&o.scores.passing&&o.scores.passing[0]||{summary:n.summarizeCourses([])},M=o.scores&&o.scores.schemes||[];o.scores&&o.scores.majorIdx!=null&&o._schemeInited!==!0&&(o.activeSchemeIdx=o.scores.majorIdx||0,o._schemeInited=!0);let q=M[o.activeSchemeIdx]||M[0]||{summary:n.summarizeCourses([]),title:"方案成绩"},D=x.avatar?`<img src="${n.escapeHtml(x.avatar)}" alt="">`:`<span>${n.escapeHtml((x.name||"同")[0])}</span>`,$=o.loading.scores?'<div class="uc-loading">成绩加载中</div>':o.scores&&o.scores.error?`<div class="uc-empty">${n.escapeHtml(o.scores.error)}</div>`:`<div class="uc-score-grid">
            <div class="uc-score-pane" data-score="passing"><h5>全部及格成绩</h5>${u(z.summary,"passing")}</div>
            <div class="uc-score-pane" data-score="scheme"><h5>${n.escapeHtml((q.title||"方案成绩").split(/通过|获得|不通过/)[0].trim()||"方案成绩")}</h5>${u(q.summary,"scheme")}</div>
          </div>`,j=P($);return`<div class="uc-desktop">
      <div class="uc-col">
        <div class="uc-card uc-profile-card"><div class="uc-bd"><div class="uc-profile">
          <div class="uc-avatar" data-urppp-private="avatar">${D}</div>
          <div>
            <div class="uc-name" data-urppp-private="name">${n.escapeHtml(x.name||"同学")}</div>
            <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${n.escapeHtml(x.majorPlan||"—")}</span></div>
            <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${n.escapeHtml(String(x.majorGpa||"—"))}</span></div>
          </div>
        </div>${(()=>{try{return Ji()}catch{return""}})()}</div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${n.getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${E.length?E.length+" 课次":o.schedule&&o.schedule.error||""}</span>
            </div>
          </div>
          <div class="uc-bd"><div class="uc-schedule-wrap">${o.loading.schedule?'<div class="uc-loading">课表加载中</div>':E.length?y(E):`<div class="uc-empty">${n.escapeHtml(o.schedule&&o.schedule.error||"暂无课表数据")}</div>`}${_()}</div></div>
        </div>
      </div>
      <div class="uc-col">
        <div class="uc-card">
          ${j}
        </div>
        <div class="uc-card services">
          <div class="uc-hd">服务</div>
          <div class="uc-bd">${g()}</div>
        </div>
      </div>
    </div>`}function L(){let x=n.personalizedProfile(o.profile||{}),E=o.schedule&&o.schedule.courses||[],z=o.scores&&o.scores.passing&&o.scores.passing[0]||{summary:n.summarizeCourses([])},M=(o.scores&&o.scores.schemes||[])[o.activeSchemeIdx]||{summary:n.summarizeCourses([])},q=x.avatar?`<img src="${n.escapeHtml(x.avatar)}" alt="">`:`<span>${n.escapeHtml((x.name||"同")[0])}</span>`;if(o.mobileTab==="scores"){let D=`<div class="uc-score-grid uc-score-grid-mobile">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${u(z.summary,"passing")}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${u(M.summary,"scheme")}</div>
      </div>`;return`<div class="uc-mobile"><div class="uc-card">${P(D)}</div></div>`}return o.mobileTab==="room"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${C()}</div></div></div>`:o.mobileTab==="more"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${g()}</div></div></div>`:`<div class="uc-mobile">
      <div class="uc-card uc-profile-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${q}</div>
        <div><div class="uc-name" data-urppp-private="name">${n.escapeHtml(x.name||"同学")}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${n.escapeHtml(x.majorPlan||"—")}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${n.escapeHtml(String(x.majorGpa||"—"))}</span></div></div>
      </div>${(()=>{try{return Vi()}catch{return""}})()}</div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${n.getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd"><div class="uc-schedule-wrap">${o.loading.schedule?'<div class="uc-loading">课表加载中</div>':E.length?y(E):`<div class="uc-empty">${n.escapeHtml(o.schedule&&o.schedule.error||"暂无课表数据")}</div>`}${_()}</div></div></div>
    </div>`}function C(){if(o.loading.room)return'<div class="uc-loading">教学楼加载中</div>';let x=o.catalog||[];return x.length?x.slice().sort((z,M)=>(/江安/.test(z.campus)?-1:0)-(/江安/.test(M.campus)?-1:0)).map(z=>`
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${n.escapeHtml(z.campus)}</div>
        <div class="uc-build-grid">
          ${z.buildings.map(M=>`<button type="button" data-build-path="${n.escapeHtml(M.path)}" data-cn="${n.escapeHtml(M.campusNumber||"")}" data-bn="${n.escapeHtml(M.buildingNumber||"")}">${n.escapeHtml(M.name)}</button>`).join("")}
        </div>
      </div>`).join(""):`<div class="uc-empty">${n.escapeHtml(o.roomError||"未读到教学楼列表")}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`}function f(x,E){if(!x||!x.rooms||!x.rooms.length)return'<div class="uc-empty">该楼暂无教室占用数据</div>';let z='<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';for(let $=1;$<=12;$++)z+=`<th class="sec">${$}</th>`;z+="</tr>";let M=x.rooms.map($=>{let j=`<tr><th class="sticky">${n.escapeHtml($.name)}</th><th class="sticky2">${n.escapeHtml($.seats)}</th>`;for(let G=1;G<=12;G++){let U=($.slots||[]).find(rt=>rt.section===G)||{busy:!1};if(U.busy){let rt=U.reason||U.typeLabel||"占用",it=U.typeLabel||n.occupancyTypeLabel({occupancymoduleId:U.module}),bt=U.displayChar||n.firstContentChar(rt)||n.firstContentChar(it)||"占",J=Object.assign({},U.detail||{room:$.name,section:G,reason:rt},{reason:rt,typeLabel:it,contentName:U.contentName||U.detail&&U.detail.contentName||""}),Y=n.escapeHtml(JSON.stringify(J));j+=`<td><button type="button" class="uc-slot busy ${n.occupancyKindClass(it)}" data-occ='${Y}' title="${n.escapeHtml($.name)} 第${G}节 · ${n.escapeHtml(rt)}">${n.escapeHtml(bt)}</button></td>`}else j+=`<td><div class="uc-slot free" title="${n.escapeHtml($.name)} 第${G}节 · 空闲"></div></td>`}return j+"</tr>"}).join(""),q=Number(x.dateOffset!=null?x.dateOffset:o.roomDateOffset)||0,D=($,j)=>`<button type="button" class="uc-btn${q===$?" primary":""}" data-room-day="${$}">${j}</button>`;return`
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${n.escapeHtml(E||"")}</div>
          <div class="uc-sub">${n.escapeHtml(x.dateLabel||"")}${x.jxzc?" · 教学第"+x.jxzc+"周":""}</div>
          <div class="uc-room-days">
            ${D(0,"今天")}
            ${D(1,"明天")}
            ${D(2,"后天")}
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
      <div class="uc-occ"><table class="uc-occ-table">${z}${M}</table></div>`}function h(){let x=n.ensureRoot(),E=x.querySelector("#uc-body");n.getViewWeekNumber();let z=typeof window<"u"&&window.matchMedia?window.matchMedia:null,M=z&&z("(max-width:900px)").matches,q=!o.uiReady;E.innerHTML=M?L():v(),q?(o.uiReady=!0,x.classList.remove("uc-settled"),clearTimeout(x.__ucSettleTimer),x.__ucSettleTimer=setTimeout(()=>{o.open&&x.classList.add("uc-settled")},480)):x.classList.add("uc-settled"),n.bindUI(E),n.applyPersonalDisplay(E)}function w(){if(!o.open||c)return;let x=()=>{c=0,o.open&&h()},E=typeof requestAnimationFrame=="function"?requestAnimationFrame:null;c=E?E(x):setTimeout(x,0)}return{analysisHtml:k,metricHtml:u,occupancyHtml:f,render:h,renderScheduleBoard:y,roomPickerHtml:C,scheduleRender:w,scoreSectionHtml:P}}function ts({state:o,deps:n}){function c(v,L){return!v||(v.__urpppCleanUiBindings||(v.__urpppCleanUiBindings=new Set),v.__urpppCleanUiBindings.has(L))?!1:(v.__urpppCleanUiBindings.add(L),!0)}function d(v){if(!v)return;try{n.bindScheduleExportHosts(v)}catch(C){console.warn("[URP++] schedule export menu",C)}v.querySelectorAll("[data-score]").forEach(C=>{c(C,"score")&&C.addEventListener("click",()=>S(C.getAttribute("data-score")))}),v.querySelectorAll("[data-sa-tab]").forEach(C=>{c(C,"saTab")&&C.addEventListener("click",()=>{o.scoreAnalysisTab=C.getAttribute("data-sa-tab")==="analysis"?"analysis":"overview",n.render()})}),v.querySelectorAll("[data-href]").forEach(C=>{c(C,"href")&&C.addEventListener("click",f=>{let h=C.getAttribute("data-href");h&&(f.preventDefault(),n.closeCleanMode(),location.href=h)})}),v.querySelectorAll("[data-eval-url]").forEach(C=>{c(C,"eval")&&C.addEventListener("click",f=>{let h=C.getAttribute("data-eval-url");h&&(f.preventDefault(),f.stopPropagation(),n.closeCleanMode(),location.href=h)})}),v.querySelectorAll('[data-action="room"]').forEach(C=>{c(C,"room")&&C.addEventListener("click",()=>y())}),v.querySelectorAll("[data-room-reload]").forEach(C=>{c(C,"roomReload")&&C.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),n.ensureRoomCatalogLoaded(!0)})}),v.querySelectorAll("[data-build-path]").forEach(C=>{c(C,"building")&&C.addEventListener("click",async()=>{let f=C.getAttribute("data-build-path"),h=(C.textContent||"").trim(),w=C.getAttribute("data-cn")||"",x=C.getAttribute("data-bn")||"",E=C.closest("#uc-room-panel")||C.closest("#uc-modal-body")||null;o.roomDateOffset=0,await g({path:f,name:h,campusNumber:w,buildingNumber:x,dateOffset:0},h,E)})}),v.querySelectorAll("[data-room-day]").forEach(C=>{c(C,"roomDay")&&C.addEventListener("click",async f=>{f.preventDefault(),f.stopPropagation();let h=parseInt(C.getAttribute("data-room-day")||"0",10)||0;if(!o.currentBuilding)return;o.roomDateOffset=h;let w=Object.assign({},o.currentBuilding,{dateOffset:h}),x=C.closest("#uc-room-panel")||C.closest("#uc-modal-body")||null;await g(w,w.name||"",x)})});let L=v.querySelector("#uc-room-back");L&&(L.onclick=()=>{o.occupancy=null,o.currentBuilding=null;let C=L.closest("#uc-room-panel")||document.querySelector("#uc-room-panel")||document.querySelector("#uc-modal-body");C&&C.id==="uc-modal-body"||C&&C.id==="uc-room-panel"?(C.innerHTML=n.roomPickerHtml(),d(C)):n.render()}),v.querySelectorAll(".uc-slot.busy[data-occ]").forEach(C=>{c(C,"occupancy")&&C.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation();try{let h=JSON.parse(C.getAttribute("data-occ")||"{}");k("占用详情",`
            <div class="uc-occ-detail">
              <div class="uc-name">${n.escapeHtml(h.room||"")}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${n.escapeHtml(String(h.section||h.start||""))}${h.span>1?"-"+(Number(h.start||h.section)+Number(h.span)-1):""}节</div>
              <div class="uc-sub">占用类型：${n.escapeHtml(h.typeLabel||h.reason||"占用")}</div>
              <div class="uc-sub">具体内容：${n.escapeHtml(h.contentName||h.reason||"—")}</div>
              ${h.teacher?`<div class="uc-sub">教师：${n.escapeHtml(h.teacher)}</div>`:""}
              ${h.weeks?`<div class="uc-sub">周次：${n.escapeHtml(h.weeks)}</div>`:""}
              ${h.courseNo?`<div class="uc-sub">课程号：${n.escapeHtml(h.courseNo)}</div>`:""}
            </div>
          `,"",{stack:!0})}catch{}})}),v.querySelectorAll(".uc-lesson[data-course]").forEach(C=>{c(C,"course")&&C.addEventListener("click",f=>{f.stopPropagation();try{let h=JSON.parse(C.getAttribute("data-course")||"{}"),w=`第${h.section||"?"}${h.span>1?"-"+(Number(h.section)+Number(h.span)-1):""}节`,x=(h.others||[]).map(E=>`<div class="uc-course-sub ${E.thisWeek?"":"is-fade"}">
              <div class="uc-cd-name">${n.escapeHtml(E.name||"")}</div>
              <div class="uc-cd-meta">${n.escapeHtml([E.place,E.week,E.teacher].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${E.thisWeek?"当前周有课":"当前周无课"}</div>
            </div>`).join("");k("课程详情",`
            <div class="uc-course-detail">
              <div class="uc-cd-name">${n.escapeHtml(h.name||"")}</div>
              <div class="uc-cd-meta">${n.escapeHtml([h.place,h.teacher,h.week].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${h.thisWeek?"当前周有课":"当前周无课"} · ${n.escapeHtml(w)} · ${n.escapeHtml(n.DAY_NAMES[h.day]||"")}</div>
            </div>
            ${x?'<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>'+x:""}
          `,"")}catch{}})}),v.querySelectorAll("[data-week-delta]").forEach(C=>{c(C,"weekDelta")&&C.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation();let h=parseInt(C.getAttribute("data-week-delta")||"0",10)||0,w=o.schedule&&o.schedule.courses||[],x=n.inferMaxWeek(w),E=n.getViewWeekNumber();o.weekLocked=!0,o.viewWeek=Math.min(x,Math.max(1,E+h)),n.render();let z=document.querySelector("#urppp-clean-root .uc-week-label");z&&(z.classList.remove("uc-pop"),z.offsetWidth,z.classList.add("uc-pop"))})}),v.querySelectorAll("[data-week-reset]").forEach(C=>{c(C,"weekReset")&&C.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),o.weekLocked=!1;let h=n.getCurrentWeekNumber()||o._termWeek||1;o.viewWeek=h,n.render();let w=document.querySelector("#urppp-clean-root .uc-week-label");w&&(w.classList.remove("uc-pop"),w.offsetWidth,w.classList.add("uc-pop"))})})}let u=[];function k(v,L,C,f){f=f||{};let h=n.ensureRoot(),w=h.querySelector("#uc-mask"),x=h.querySelector("#uc-modal");f.stack&&x.classList.contains("open")?u.push({title:h.querySelector("#uc-modal-title").textContent,body:h.querySelector("#uc-modal-body").innerHTML,ft:h.querySelector("#uc-modal-ft").innerHTML}):f.stack||(u.length=0),w.classList.add("open"),x.classList.add("open"),h.querySelector("#uc-modal-title").textContent=v,h.querySelector("#uc-modal-body").innerHTML=L,h.querySelector("#uc-modal-ft").innerHTML=C||"",d(h.querySelector("#uc-modal-body")),d(h.querySelector("#uc-modal-ft")),n.applyPersonalDisplay(h.querySelector("#uc-modal"))}function P(){let v=n.rootEl();if(v){if(u.length){let L=u.pop();v.querySelector("#uc-modal-title").textContent=L.title,v.querySelector("#uc-modal-body").innerHTML=L.body,v.querySelector("#uc-modal-ft").innerHTML=L.ft||"",d(v.querySelector("#uc-modal-body")),d(v.querySelector("#uc-modal-ft"));return}v.querySelector("#uc-mask").classList.remove("open"),v.querySelector("#uc-modal").classList.remove("open")}}function S(v){let L=o.scores&&o.scores.passing&&o.scores.passing[0]||{courses:[],summary:n.summarizeCourses([])},C=o.scores&&o.scores.schemes||[];v==="scheme"&&o.scores&&o.scores.majorIdx!=null&&o._schemeInited!==!0&&(o.activeSchemeIdx=o.scores.majorIdx||0,o._schemeInited=!0);let f=C[o.activeSchemeIdx]||C[0]||{courses:[],summary:n.summarizeCourses([]),title:"方案成绩"},h=v==="scheme"?f:L,w=v==="scheme"?"scheme":"passing";o.selected[w]||(o.selected[w]=new Set);let x=v==="scheme"&&C.length>1?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${C.map((tt,dt)=>`<button type="button" class="uc-btn ${dt===o.activeSchemeIdx?"primary":""}" data-scheme-idx="${dt}"><span data-urppp-private="organization">${n.escapeHtml((tt.title||"方案").slice(0,28))}</span></button>`).join("")}</div>`:"",E=tt=>{let dt=!!(tt&&(tt.unevaluated||n.isUnevaluatedScore(tt.score))),At=n.scoreToNumber(tt&&tt.score),kt="";dt?kt=At!=null&&At<60?"uneval-fail":"uneval":At!=null?kt=At>=60?"pass":"fail":/不及格|不合格|不通过/.test(String(tt&&tt.score||""))?kt="fail":tt&&tt.score&&(kt="pass");let Pt=n.escapeHtml(tt&&tt.score||"—"),B=dt?tt.evalUrl||"/student/teachingEvaluation/newEvaluation/index":"";return B?`<span class="uc-score-cell ${kt}" data-eval-url="${n.escapeHtml(B)}" title="未评教，点击前往评教">${Pt}</span>`:`<span class="uc-score-cell ${kt}">${Pt}</span>`},z=(h.courses||[]).map((tt,dt)=>{let At=o.selected[w].has(dt),kt=n.isValidOfficialGpa(tt.officialGpa)?tt.officialGpa:n.scoreToGpa(tt.score),Pt=!!(tt.unevaluated||n.isUnevaluatedScore(tt.score));return`<tr class="${At?"is-on":""}${Pt?" is-uneval":""}" data-idx="${dt}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${At?"✓":""}</span><span class="uc-cname">${n.escapeHtml(tt.name)}</span></td>
        <td><span class="uc-attr-pill">${n.escapeHtml(tt.attr||"—")}</span></td>
        <td data-urppp-private="credit">${tt.credit}</td>
        <td data-urppp-private="grade">${E(tt)}</td>
        <td data-urppp-private="gpa">${Pt||kt==null?"—":kt}</td>
      </tr>`}).join("");k(v==="scheme"?"方案成绩 · "+(f.title||""):"全部及格成绩",`
      ${x}${n.metricHtml(h.summary,v==="scheme"?"scheme":"passing")}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${z||'<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`,'<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>');let M=document.querySelector("#uc-modal-title");M&&(v==="scheme"?M.setAttribute("data-urppp-private","organization"):M.removeAttribute("data-urppp-private"),n.applyPersonalDisplay(M.parentElement||M));let q=document.querySelector("#uc-modal-body"),D=document.getElementById("uc-calc"),$=document.getElementById("uc-score-table"),j=document.getElementById("uc-score-wrap"),G=document.getElementById("uc-select-box"),U=()=>{$.querySelectorAll("tbody tr[data-idx]").forEach(At=>{let kt=parseInt(At.getAttribute("data-idx"),10),Pt=o.selected[w].has(kt);At.classList.toggle("is-on",Pt);let B=At.querySelector(".uc-selmark");B&&(B.textContent=Pt?"✓":"")});let tt=[];o.selected[w].forEach(At=>{h.courses[At]&&tt.push(h.courses[At])});let dt=n.summarizeCoursesPreferOfficial(tt);D&&(D.className="uc-calc",D.innerHTML=tt.length?`已选 <b>${tt.length}</b> 门 · 学分 <b data-urppp-private="credit">${dt.totalCredit}</b> · 均分 <b data-urppp-private="grade">${dt.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${dt.avgGpa}</b>`:"已选 0 门")},rt=(tt,dt)=>{dt===!0?o.selected[w].add(tt):dt===!1||o.selected[w].has(tt)?o.selected[w].delete(tt):o.selected[w].add(tt)},it=!1;$.querySelectorAll("tbody tr[data-idx]").forEach(tt=>{tt.addEventListener("click",dt=>{if(it){it=!1;return}let At=parseInt(tt.getAttribute("data-idx"),10);rt(At),U()})});let bt=!1,J=0,Y=0,ot=null,K=()=>Array.from($.querySelectorAll("tbody tr[data-idx]")),ct=(tt,dt)=>{if(!G||!j)return{left:0,top:0,right:0,bottom:0,w:0,h:0};let At=j.getBoundingClientRect(),kt=Math.min(J,tt),Pt=Math.min(Y,dt),B=Math.max(J,tt),V=Math.max(Y,dt),et=B-kt,ft=V-Pt,ht=kt-At.left+j.scrollLeft,Lt=Pt-At.top+j.scrollTop;return G.style.display=et>3||ft>3?"block":"none",G.style.left=ht+"px",G.style.top=Lt+"px",G.style.width=et+"px",G.style.height=ft+"px",{left:kt,top:Pt,right:B,bottom:V,w:et,h:ft}},at=tt=>{if(!bt)return;tt.preventDefault();let dt=ct(tt.clientX,tt.clientY);dt.w<=3&&dt.h<=3||(o.selected[w]=new Set(ot),K().forEach(At=>{let kt=At.getBoundingClientRect();if(!!(kt.right<dt.left||kt.left>dt.right||kt.bottom<dt.top||kt.top>dt.bottom))return;let B=parseInt(At.getAttribute("data-idx"),10);ot.has(B)?o.selected[w].delete(B):o.selected[w].add(B)}),U())},st=tt=>{let dt=Math.abs(tt.clientX-J)>3||Math.abs(tt.clientY-Y)>3;bt=!1,G&&(G.style.display="none"),document.removeEventListener("mousemove",at,!0),document.removeEventListener("mouseup",st,!0),dt&&(it=!0),U()};j.addEventListener("mousedown",tt=>{tt.button===0&&(bt=!0,J=tt.clientX,Y=tt.clientY,ot=new Set(o.selected[w]),ct(J,Y),document.addEventListener("mousemove",at,!0),document.addEventListener("mouseup",st,!0))}),q.querySelectorAll("[data-scheme-idx]").forEach(tt=>tt.addEventListener("click",()=>{o.activeSchemeIdx=parseInt(tt.getAttribute("data-scheme-idx"),10)||0,o._schemeUserSelected=!0,S("scheme")}));let xt=document.getElementById("uc-clear");xt&&(xt.onclick=()=>{o.selected[w]=new Set,U()}),U()}async function y(){k("空闲教室",'<div class="uc-loading">加载教学楼</div>',"");try{await n.ensureRoomCatalogLoaded(!1),k("空闲教室",n.roomPickerHtml(),'<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>')}catch(v){k("空闲教室",`<div class="uc-empty">${n.escapeHtml(v&&v.message||v)}</div>`,"")}}function _(v){if(v&&v.isConnected)return v;let L=document.querySelector("#uc-room-panel");if(L&&L.offsetParent!==null||L&&o.mobileTab==="room")return L;let C=document.querySelector("#uc-modal-body"),f=document.querySelector("#uc-modal");return f&&f.classList.contains("open")&&C?C:L||C||null}async function g(v,L,C){let f=_(C);if(!f){console.warn("[URP++] no room host");return}f.innerHTML='<div class="uc-loading">加载占用网格</div>';try{let h=await n.loadBuildingOccupancy(v);f.innerHTML='<div class="uc-loading">匹配课程名称</div>';let w=h.planNumber||"";if(!w)try{let z=await n.fetchText("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),M=JSON.parse(z);if(w=M&&(M.zxjxjhh||M.xnxq||M.dateList&&M.dateList[0]&&M.dateList[0].zxjxjhh)||"",!w&&M&&M.xkxx&&M.xkxx[0]){let q=Object.keys(M.xkxx[0]||{}),D=q.length?M.xkxx[0][q[0]]:null;w=D&&(D.zxjxjhh||D.executiveEducationPlanNumber)||""}}catch{}w||(w="2025-2026-2-1"),h.planNumber=w;try{h=await n.enrichOccupancyWithCurriculum(h,typeof v=="object"?v:{},w)}catch(z){console.warn("[URP++] enrich occupancy",z)}o.occupancy=h,o.roomDateOffset=Number(h.dateOffset!=null?h.dateOffset:o.roomDateOffset)||0;let x=typeof v=="object"?v:{path:v,name:L};o.currentBuilding=Object.assign({},x,{name:L||x.name||"",dateOffset:o.roomDateOffset}),L=L||v&&v.name||"";let E=_(f)||f;E.innerHTML=n.occupancyHtml(h,L),d(E)}catch(h){let w=_(f)||f;w&&(w.innerHTML=`<div class="uc-empty">${n.escapeHtml(h&&h.message||h)}</div>`)}}return{bindUI:d,closeModal:P,getRoomHost:_,openModal:k,openRoomModal:y,openScoreModal:S,showBuilding:g}}function es({state:o,deps:n}){function c(){return document.getElementById("urppp-clean-root")}function d(){n.ensureStyle();let y=c();if(y)return y;y=document.createElement("div"),y.id="urppp-clean-root",y.innerHTML=`
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
      </div>`,document.documentElement.appendChild(y),y.querySelector("#uc-exit").onclick=k,y.querySelector("#uc-refresh").onclick=()=>u(!0),y.querySelector("#uc-mask").onclick=n.closeModal,y.querySelector("#uc-modal-close").onclick=n.closeModal;let _=()=>{n.syncThemeDotGroup(y.querySelector("#uc-top-theme"))};y.querySelectorAll("#uc-top-theme .urppp-nav-dot[data-theme]").forEach(w=>{w.addEventListener("click",()=>{n.handleThemeDotClick(w.dataset.theme),_();try{n.syncNavbarThemeUI()}catch{}try{n.syncSettingsPanelUI()}catch{}})});let g=y.querySelector("#uc-settings");g&&g.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation();try{n.openSettingsPanel()}catch{}});let v=y.querySelector("#uc-menu-toggle"),L=w=>{w.classList.remove("urppp-clean-sidebar");let x=w.__urpppCleanInline;if(x){let z=w.style,M=(q,D)=>{let $=x[D];$&&$.v?z.setProperty(q,$.v,$.p||""):z.removeProperty(q)};M("top","top"),M("height","height"),M("z-index","z"),M("position","pos"),M("transform","transform"),M("visibility","vis"),M("pointer-events","pe"),M("transition","transition"),delete w.__urpppCleanInline}let E=w.__urpppCleanOrigin;E&&E.parent&&w.parentElement!==E.parent&&(E.next&&E.next.parentElement===E.parent?E.parent.insertBefore(w,E.next):E.parent.appendChild(w)),delete w.__urpppCleanOrigin},C=()=>{let w=document.getElementById("sidebar");if(w)if(o.open){if(w.classList.add("urppp-clean-sidebar"),!w.__urpppCleanInline){let D=w.style,$=j=>({v:D.getPropertyValue(j),p:D.getPropertyPriority(j)});w.__urpppCleanInline={top:$("top"),height:$("height"),z:$("z-index"),pos:$("position"),transform:$("transform"),vis:$("visibility"),pe:$("pointer-events"),transition:$("transition")},w.__urpppCleanOrigin={parent:w.parentElement,next:w.nextSibling}}if(w.parentElement!==y){let D=y.querySelector(".uc-shell");y.insertBefore(w,D||null)}let x=y.getBoundingClientRect(),E=y.querySelector(".uc-top"),z=E?E.getBoundingClientRect():null,M=Math.max(44,Math.round(z?z.bottom-x.top:60)),q=Math.max(0,Math.round(x.height-M));w.style.setProperty("top",M+"px","important"),w.style.setProperty("height",q+"px","important"),w.style.setProperty("z-index","12030","important"),w.style.setProperty("position","fixed","important")}else L(w)},f=()=>{let w=document.getElementById("sidebar");if(!w)return;try{n.stopDrawerAnimation(w)}catch{}w.classList.remove("display","urppp-drawer-closing"),L(w),v&&(v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label","打开菜单"));let x=document.getElementById("urppp-mobile-menu-button");x&&(x.setAttribute("aria-expanded","false"),x.setAttribute("aria-label","打开菜单"))};v&&v.addEventListener("click",w=>{w.preventDefault(),w.stopImmediatePropagation();let x=document.getElementById("sidebar");if(!x)return;x.__urpppCleanMenuBound||(x.__urpppCleanMenuBound=!0,x.addEventListener("click",M=>{if(!o.open)return;let q=M.target&&M.target.closest?M.target.closest("a[href]"):null;if(!q||q.closest("#urppp-mobile-search-panel"))return;let D=String(q.getAttribute("href")||"").trim();if(q.closest("#urppp-mobile-quick, #urppp-mobile-user")){if(!D||D==="#"||D.startsWith("javascript")||q.target==="_blank"||/^https?:\/\//i.test(D))return;k();return}!D||D==="#"||D.startsWith("javascript")||q.target==="_blank"||/^https?:\/\//i.test(D)||k()},!0));let E=!x.classList.contains("display");C(),n.setDrawerOpen(x,v,E);let z=document.getElementById("urppp-mobile-menu-button");z&&(z.setAttribute("aria-expanded",E?"true":"false"),z.setAttribute("aria-label",E?"关闭菜单":"打开菜单"))}),y.__closeCleanDrawer=f,y.__syncCleanSidebarZ=C,y.__syncCleanThemeDots=_;let h=globalThis.ResizeObserver;if(typeof h=="function"){let w=new h(()=>{o.open&&C()});w.observe(y);let x=y.querySelector(".uc-top");x&&w.observe(x),y.__cleanSidebarResizeObserver=w}try{let w=window.matchMedia&&window.matchMedia("(max-width: 900px)");if(w){let x=()=>{o.open&&(C(),n.render())};typeof w.addEventListener=="function"?w.addEventListener("change",x):typeof w.addListener=="function"&&w.addListener(x),y.__scoreLayoutMedia=w,y.__scoreLayoutChange=x}}catch{}try{n.applySkinAttr()}catch{}return _(),y.querySelectorAll("#uc-tabbar button").forEach(w=>{w.onclick=()=>{o.mobileTab=w.dataset.tab,y.querySelectorAll("#uc-tabbar button").forEach(x=>x.classList.toggle("ac",x===w)),n.render(),o.mobileTab==="room"&&n.ensureRoomCatalogLoaded()}}),Oo(),Qi(y),y}function u(y){d();let _=o.open;o.open=!0,o.uiReady=!1,o.weekLocked=!1;let g=n.getCurrentWeekNumber()||n.readRememberedTermWeek();o.viewWeek=g>=1?g:o.viewWeek>=1?o.viewWeek:0,document.documentElement.classList.add("urppp-clean-lock",n.CLEAN_FLAG);let v=c();v.classList.remove("closing"),_||(v.classList.remove("uc-settled","open"),v.offsetWidth,v.classList.add("open"));try{n.stopDrawerAnimation(document.getElementById("sidebar"))}catch{}try{v.__syncCleanThemeDots&&v.__syncCleanThemeDots()}catch{}try{v.__syncCleanSidebarZ&&v.__syncCleanSidebarZ()}catch{}try{n.injectCleanSidebarSections(document.getElementById("sidebar"))}catch{}n.loadAll(!!y);try{n.ensureRoomCatalogLoaded()}catch{}}function k(){o.open=!1,o.uiReady=!1,n.closeModal(),document.documentElement.classList.remove("urppp-clean-lock",n.CLEAN_FLAG);let y=c();if(y){y.classList.remove("open","uc-settled","uc-drawer-open"),y.classList.add("closing"),clearTimeout(y.__ucSettleTimer);try{y.__closeCleanDrawer&&y.__closeCleanDrawer()}catch{}setTimeout(()=>{y.classList.remove("closing")},360)}try{n.refreshMobileNavbar()}catch{}}function P(){try{n.ensureStyle();let y=document.getElementById("urppp-nav-clean");if(!n.isHomePage()){y&&y.remove(),Zi();return}let _=document.getElementById("urppp-nav-theme")||document.querySelector("#navbar .navbar-header")||document.querySelector("#navbar");if(!_)return;y||(y=document.createElement("button"),y.type="button",y.id="urppp-nav-clean",y.title="清爽模式",y.innerHTML=`${n.ico("clean")}<span>清爽</span>`,y.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),u(!1)}),_.appendChild(y)),Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none"}).forEach(([g,v])=>y.style.setProperty(g,v,"important")),Oo();try{Ki()}catch{}}catch(y){console.warn("[URP++] clean entry",y)}}return{cleanModeApi:{open:u,close:k,inject:P,refresh:n.refreshCleanPersonalDisplay,refreshRender:()=>{try{n.render()}catch{}},scoreToGpa:n.scoreToGpa,summarizeCourses:n.summarizeCourses},closeCleanMode:k,ensureRoot:d,injectCleanEntry:P,openCleanMode:u,rootEl:c}}function rs({deps:o}){function n(){if(window.__urpppScheduleHoverNear)return;window.__urpppScheduleHoverNear=!0;let P=12,S=16,y=0,_=0,g=!1,v=0,L=()=>document.getElementById("schedule-hover"),C=w=>{if(!w||w.style&&w.style.display==="none")return!1;let x=window.getComputedStyle(w);return x.display!=="none"&&x.visibility!=="hidden"},f=()=>{let w=L();if(!w||!C(w)){g=!1;return}g=!0;let x=window.innerWidth||1200,E=window.innerHeight||800,z=y+P,M=_+S,q=Math.min(320,w.offsetWidth||280),D=Math.min(220,w.offsetHeight||160);z+q>x-8&&(z=x-q-8),M+D>E-8&&(M=E-D-8),z<8&&(z=8),M<8&&(M=8),w.style.setProperty("position","fixed","important"),w.style.setProperty("left",Math.round(z)+"px","important"),w.style.setProperty("top",Math.round(M)+"px","important"),w.style.setProperty("right","auto","important"),w.style.setProperty("bottom","auto","important"),w.style.setProperty("margin","0","important"),w.style.setProperty("z-index","3000","important"),w.style.setProperty("pointer-events","none","important")},h=()=>{v||(v=requestAnimationFrame(()=>{v=0,f()}))};document.addEventListener("mousemove",w=>{if(y=w.clientX,_=w.clientY,!g){let x=L();x&&x.style&&x.style.display&&x.style.display!=="none"&&(g=!0)}g&&h()},!0),document.addEventListener("mouseover",w=>{w.target&&w.target.closest&&w.target.closest(".fc-event, .fc-time-grid-event")&&(y=w.clientX,_=w.clientY,setTimeout(()=>{g=!0,f()},0),setTimeout(f,40))},!0),document.addEventListener("mouseout",w=>{w.target&&w.target.closest&&w.target.closest(".fc-event, .fc-time-grid-event")&&setTimeout(()=>{let E=L();C(E)||(g=!1)},50)},!0)}function c(P){try{let S=!!(P&&P.force),y=typeof unsafeWindow<"u"&&unsafeWindow.jQuery?unsafeWindow.jQuery:window.jQuery||null;if(!y||!y.fn||!y.fn.fullCalendar)return!1;let _=document.getElementById("main-calendar")||document.querySelector("#urppp-left .fc, #urppp-dashboard .fc");if(!_)return!1;if(!S&&_.dataset.urpppFcSized==="1")return!0;let g=y(_);if(!(g.data("fullCalendar")||g.hasClass("fc")))return!1;let L=Array.from(_.querySelectorAll(".fc-scroller")).map(f=>({el:f,top:f.scrollTop,left:f.scrollLeft}));if(S||_.dataset.urpppFcRendered!=="1"){try{g.fullCalendar("render")}catch{}_.dataset.urpppFcRendered="1"}else try{g.fullCalendar("updateSize")}catch{}return requestAnimationFrame(()=>{L.forEach(f=>{try{f.el.scrollTop=f.top,f.el.scrollLeft=f.left}catch{}})}),(_.getBoundingClientRect().height||0)>=300&&(_.dataset.urpppFcSized="1"),!0}catch(S){return console.warn("[URP++] fullCalendar refresh failed",S),!1}}function d(){window.__urpppFcRefreshBound||(window.__urpppFcRefreshBound=!0,setTimeout(()=>c({force:!0}),0),setTimeout(()=>c({force:!1}),300))}function u(P,S,y){let _=P.querySelector(".widget-header"),g=_?_.querySelector(".widget-toolbar"):null,v=document.createElement("div");v.className="urppp-card",v.innerHTML=`
      <div class="urppp-card-header">
        <h4>${y}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `,g&&(g.style.display="inline-block",v.querySelector(".urppp-card-tools").appendChild(g)),v.querySelector(".urppp-card-body").appendChild(P),S.appendChild(v)}function k(){try{n()}catch{}if(document.getElementById("urppp-dashboard"))return;let P=document.querySelector(".page-content");if(!P)return;let S=Array.from(P.querySelectorAll(".widget-box"));if(S.length<6)return;let y=S[4],_=y?Array.from(y.querySelectorAll(".infobox")):[],g=document.createElement("div");g.id="urppp-dashboard",g.innerHTML=`
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `,P.appendChild(g);let v=P.querySelector("#warningInfo");v&&document.body.appendChild(v),S.forEach(x=>{let E=x.closest('.widget-container-col, [class*="col-"]');E&&(E.style.display="none")}),P.querySelectorAll(":scope > .row").forEach(x=>{x.style.display="none"});let L=g.querySelector("#urppp-stats"),C=Math.max(_.length,5);for(let x=0;x<C;x++){let E=document.createElement("div");E.className="urppp-stat-card urppp-stat-skeleton",E.innerHTML='<div class="value">-</div><div class="label">加载中</div>',L.appendChild(E)}function f(){let x=y?Array.from(y.querySelectorAll(".infobox")):[];x.length!==0&&(L.innerHTML="",x.forEach(E=>{let z=E.innerText.trim().split(/\n+/).map(rt=>rt.trim()).filter(rt=>rt),M=z[0]||"",q=z.slice(1).join(" ").replace(/更多\.\.\./g,"").trim(),$=/[\u4e00-\u9fa5]/.test(M)||M.length>5?"value urppp-stat-value-text":"value",j=E.closest("a"),G=document.createElement(j?"a":"div");j&&(G.href=j.href||"javascript:void(0)",G.onclick=j.onclick,G.style.textDecoration="none"),G.className="urppp-stat-card";let U=o.statCardPrivacyMarkup(M,q);G.innerHTML=`<div class="${$}">${U.valueHtml}</div><div class="label">${U.labelHtml}</div>`,L.appendChild(G)}))}if(f(),y){let x=new MutationObserver(()=>f());x.observe(y,{childList:!0,subtree:!0}),setTimeout(()=>x.disconnect(),5e3)}let h=g.querySelector("#urppp-left"),w=g.querySelector("#urppp-right");u(S[5],h,"我的日程安排"),u(S[0],w,"通知公告"),u(S[1],w,"我的待办任务"),u(S[2],w,"可申请业务"),u(S[3],w,"常用下载"),y&&(y.style.display="none"),d(),console.log("[URP++] 首页仪表板已重构")}return{rebuildDashboard:k,refreshHomeFullCalendar:c,scheduleHomeFullCalendarRefresh:d,wrapWidget:u}}function Ee(o){return Math.round((Number(o)||0)*100)/100}var kd=[{key:"a",level:"A",range:"90-100",gpa:4,min:90,max:100},{key:"am",level:"A-",range:"85-89",gpa:3.7,min:85,max:89.999},{key:"bp",level:"B+",range:"82-84",gpa:3.3,min:82,max:84.999},{key:"b",level:"B",range:"78-81",gpa:3,min:78,max:81.999},{key:"bm",level:"B-",range:"75-77",gpa:2.7,min:75,max:77.999},{key:"cp",level:"C+",range:"72-74",gpa:2.3,min:72,max:74.999},{key:"c",level:"C",range:"68-71",gpa:2,min:68,max:71.999},{key:"cm",level:"C-",range:"64-67",gpa:1.7,min:64,max:67.999},{key:"dp",level:"D+",range:"60-63",gpa:1.3,min:60,max:63.999},{key:"d",level:"D",range:"60-62",gpa:1,min:60,max:62.999},{key:"f",level:"F",range:"<60",gpa:0,min:0,max:59.999}],as={优秀:95,"A+":98,A:95,"A-":87,良好:85,"B+":83,B:79,"B-":76,中等:73,"C+":73,C:69,"C-":65,及格:62,"D+":62,D:60,不及格:50,F:50},Ad=[{key:"required",label:"必修",test:o=>/必修/.test(o)},{key:"elective",label:"任选",test:o=>/任选/.test(o)},{key:"optional",label:"选修",test:o=>/选修/.test(o)},{key:"other",label:"其他",test:()=>!0}];function os(o){let n=String(o||"").match(/^(\d{4})-(\d{4})-(\d+)/);return n?`${n[1].slice(2)}-${n[2].slice(2)}-${n[3]}`:String(o||"")}function ka({deps:o}){let n=o.scoreToNumber,c=o.scoreToGpa;function d(f){let h=n(f);if(h!=null)return h;let w=String(f||"").trim().toUpperCase();return as[w]!=null?as[w]:null}function u(f){return!f||f.unevaluated?!1:d(f.score)!=null}function k(f){let h=String(f||"").match(/^(\d{4})-(\d{4})-(\d+)/);return h?[Number(h[1]),Number(h[3])]:[9999,9999]}function P(f){let h=f&&f.passing&&f.passing[0];return h&&h.courses||[]}function S(f){let h=f&&f.officialGpa,w=Number(h);return h!=null&&Number.isFinite(w)&&w>=0&&w<=5?w:null}function y(f){let h=S(f);return h??c(f.score)}function _({scorePack:f,profile:h}){let w=P(f),x=h&&h.majorGpa?String(h.majorGpa).trim():"",E=0,z=0,M=0,q=0,D=0,$=0;return w.forEach(j=>{if(!u(j))return;let G=Number(j.credit)||0,U=d(j.score);if(U==null||G<=0)return;E+=G,z+=U*G;let rt=y(j);rt!=null&&(M+=rt*G,q+=G,j.required&&(D+=rt*G,$+=G))}),{majorGpa:x,requiredGpa:Ee($?D/$:0),avgGpa:Ee(q?M/q:0),avgScore:Ee(E?z/E:0),totalCredit:Ee(E),courseCount:w.length}}function g(f){let h=new Map;return(f||[]).forEach(w=>{if(!u(w))return;let x=w.term||"未分组",E=h.get(x);E||(E={term:x,count:0,credit:0,scoreW:0,gpaW:0,gpaCredit:0},h.set(x,E));let z=Number(w.credit)||0,M=d(w.score);if(M==null||(E.count+=1,z<=0))return;E.credit+=z,E.scoreW+=M*z;let q=y(w);q!=null&&(E.gpaW+=q*z,E.gpaCredit+=z)}),Array.from(h.values()).map(w=>({term:w.term,label:os(w.term),count:w.count,credit:Ee(w.credit),avgScore:Ee(w.credit?w.scoreW/w.credit:0),avgGpa:Ee(w.gpaCredit?w.gpaW/w.gpaCredit:0)})).sort((w,x)=>{let E=k(w.term),z=k(x.term);return E[0]-z[0]||E[1]-z[1]})}function v(f){let h=kd.map(x=>({...x,count:0,credit:0}));(f||[]).forEach(x=>{if(!u(x))return;let E=d(x.score);if(E==null)return;let z=h.find(M=>E>=M.min&&E<=M.max);z&&(z.count+=1,z.credit+=Number(x.credit)||0)});let w=h.reduce((x,E)=>Math.max(x,E.count),1);return h.map(x=>({...x,ratio:Math.round(x.count/w*100)}))}function L(f){let h=Ad.map(z=>({...z,credit:0,count:0}));(f||[]).forEach(z=>{if(!u(z))return;let M=String(z.attr||""),q=h.find(D=>D.test(M));q&&(q.credit+=Number(z.credit)||0,q.count+=1)});let w=h.reduce((z,M)=>z+M.credit,0)||1,x=h.filter(z=>z.count>0).map(z=>({key:z.key,label:z.label,credit:Ee(z.credit),count:z.count,ratio:Math.round(z.credit/w*100)})),E=x.find(z=>z.key==="required");return{items:x,requiredCredit:E?E.credit:0,requiredRatio:E?E.ratio:0}}function C({scorePack:f,profile:h}){let w=P(f);return{metrics:_({scorePack:f,profile:h}),trend:g(w),bands:v(w),share:L(w),empty:w.length===0}}return{analyzeScores:C,hasScore:u,officialGpa:S,scoreToNumberWithLevels:d,shortTerm:os}}var le="var(--text-secondary)",Ho="var(--border)";function ce(o){return X(String(o??""))}function ns(o,n,c){let d=!!(o&&o.variant==="mobile");if(n==="trend"){if(!d)return{mobile:d,width:920,height:330,pad:{top:36,right:30,bottom:46,left:30}};let P={top:58,right:20,bottom:44,left:20},S=Math.max(56,Number(o&&o.slotWidth)||72);return{mobile:d,width:Math.max(300,P.left+P.right+Math.max(1,c)*S),height:286,pad:P}}if(!d)return{mobile:d,width:660,height:236,pad:{top:28,right:14,bottom:44,left:14}};let u={top:28,right:14,bottom:44,left:14},k=Math.max(44,Number(o&&o.slotWidth)||48);return{mobile:d,width:Math.max(320,u.left+u.right+Math.max(1,c)*k),height:236,pad:u}}function Ro({width:o,height:n,mobile:c,kind:d,label:u}){let k=c?` data-urppp-chart-layout="mobile" style="width:max(100%,${o}px);max-width:none;height:auto"`:"";return`<svg viewBox="0 0 ${o} ${n}" class="urppp-sa-chart" role="img" aria-label="${u}" data-urppp-chart-kind="${d}"${k}>`}function Aa({trend:o,palette:n,layout:c}){let d=(o||[]).filter(at=>at&&at.avgScore!=null),u=ns(c,"trend",d.length),{width:k,height:P,pad:S,mobile:y}=u,_=k-S.left-S.right,g=P-S.top-S.bottom;if(!d.length)return`${Ro({...u,kind:"trend",label:"学期成绩趋势"})}</svg>`;let v=d.length,L=at=>S.left+(at+.5)*(_/v),C=d.map(at=>Number(at.avgGpa)||0),f=d.map(at=>Number(at.avgScore)||0),h=d.map(at=>Number(at.credit)||0),w=Math.max(0,Math.min(...C)-.2),x=Math.min(5,Math.max(...C)+.2),E=Math.max(0,Math.min(...f)-4),z=Math.min(100,Math.max(...f)+4),M=Math.max(1,...h),q=x-w||1,D=z-E||1,$=at=>S.top+g-(at-w)/q*g,j=at=>S.top+g-(at-E)/D*g,G=at=>S.top+g-at/M*g*.9,U=d.map((at,st)=>`${L(st)},${$(at.avgGpa)}`).join(" "),rt=d.map((at,st)=>`${L(st)},${j(at.avgScore)}`).join(" "),it=[0,.25,.5,.75,1].map(at=>{let st=S.top+g-at*g;return`<line x1="${S.left}" y1="${st.toFixed(1)}" x2="${k-S.right}" y2="${st.toFixed(1)}" stroke="${Ho}" stroke-width="1" stroke-dasharray="3 4"/>`}).join(""),bt=d.map((at,st)=>{let xt=L(st),tt=y?Math.min(30,_/v*.42):Math.min(26,_/v*.32),dt=G(at.credit);return`<rect x="${(xt-tt/2).toFixed(1)}" y="${dt.toFixed(1)}" width="${tt.toFixed(1)}" height="${(S.top+g-dt).toFixed(1)}" rx="3" fill="${n.credit}" opacity="0.55"/>
<text x="${xt.toFixed(1)}" y="${(dt-4).toFixed(1)}" text-anchor="middle" font-size="12" fill="${le}">${ce(at.credit)}</text>`}).join(""),J=d.map((at,st)=>`<text x="${L(st).toFixed(1)}" y="${P-16}" text-anchor="middle" font-size="12" fill="${le}">${ce(at.label)}</text>`).join(""),Y=d.map((at,st)=>{let xt=_/v,tt=L(st)-xt/2,dt=[`学期 ${at.label}`,`课程 ${at.count} 门`,`修读学分 ${at.credit}`,`加权均分 ${at.avgScore}`,`平均绩点 ${at.avgGpa}`].join(`
`);return`<rect class="urppp-sa-hover" x="${tt.toFixed(1)}" y="${S.top}" width="${xt.toFixed(1)}" height="${g.toFixed(1)}" fill="transparent"><title>${ce(dt)}</title></rect>`}).join(""),ot=d.map((at,st)=>`<circle cx="${L(st).toFixed(1)}" cy="${$(at.avgGpa).toFixed(1)}" r="3.5" fill="${n.gpaLine}"/><text x="${L(st).toFixed(1)}" y="${($(at.avgGpa)-9).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${n.gpaLine}">${ce(at.avgGpa)}</text>`).join(""),K=d.map((at,st)=>`<circle cx="${L(st).toFixed(1)}" cy="${j(at.avgScore).toFixed(1)}" r="3" fill="${n.scoreLine}"/><text x="${L(st).toFixed(1)}" y="${(j(at.avgScore)+17).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="${n.scoreLine}">${ce(at.avgScore)}</text>`).join(""),ct=y?`<g font-size="12">
  <rect x="${S.left}" y="30" width="12" height="12" rx="3" fill="${n.gpaLine}"/><text x="${S.left+18}" y="40" fill="${le}">学期平均绩点</text>
  <rect x="${S.left+132}" y="30" width="12" height="12" rx="3" fill="${n.scoreLine}"/><text x="${S.left+150}" y="40" fill="${le}">加权均分</text>
</g>`:`<g font-size="12">
  <rect x="${k-S.right-176}" y="8" width="12" height="12" rx="3" fill="${n.gpaLine}"/><text x="${k-S.right-158}" y="18" fill="${le}">学期平均绩点</text>
  <rect x="${k-S.right-82}" y="8" width="12" height="12" rx="3" fill="${n.scoreLine}"/><text x="${k-S.right-64}" y="18" fill="${le}">加权均分</text>
</g>`;return`${Ro({...u,kind:"trend",label:"学期成绩趋势"})}
${it}
${bt}
<g>${Y}</g>
<text x="${S.left}" y="18" font-size="12" fill="${le}">每学期修读学分（柱）</text>
<g stroke="${n.gpaLine}" stroke-width="2.2" fill="none"><polyline points="${U}"/></g>
<g stroke="${n.scoreLine}" stroke-width="1.8" stroke-dasharray="5 4" fill="none"><polyline points="${rt}"/></g>
<g>${ot}</g>
<g>${K}</g>
<g>${J}</g>
${ct}
</svg>`}function Sa({bands:o,palette:n,layout:c}){let d=o||[],u=ns(c,"bands",d.length),{width:k,height:P,pad:S,mobile:y}=u,_=k-S.left-S.right,g=P-S.top-S.bottom,v=d.length||1,L=Math.max(1,...d.map(h=>h.count)),C=y?Math.min(32,_/v*.62):Math.min(40,_/v*.52),f=d.map((h,w)=>{let x=S.left+(w+.5)*(_/v),E=h.count?Math.max(8,h.count/L*g):0,z=S.top+g-E,M=(.4+(1-w/(v-1))*.6).toFixed(2),q=h.range||(h.min===0?"<60":`${h.min}-${h.max===100?"100":h.max}`),D=[`${h.level||""}（绩点 ${h.gpa}）`,`百分制 ${q}`,`课程 ${h.count} 门`].join(`
`);return`<rect class="urppp-sa-band" x="${(x-C/2).toFixed(1)}" y="${z.toFixed(1)}" width="${C.toFixed(1)}" height="${E.toFixed(1)}" rx="4" fill="${n.primary}" opacity="${M}"><title>${ce(D)}</title></rect>
<text x="${x.toFixed(1)}" y="${(z-6).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)">${ce(h.count)}</text>
<text x="${x.toFixed(1)}" y="${P-26}" text-anchor="middle" font-size="11" font-weight="600" fill="${le}">${ce(q)}</text>
<text x="${x.toFixed(1)}" y="${P-12}" text-anchor="middle" font-size="12" fill="${le}">${ce(h.gpa)}</text>`}).join("");return`${Ro({...u,kind:"bands",label:"成绩分段分布"})}
<line x1="${S.left}" y1="${(S.top+g).toFixed(1)}" x2="${k-S.right}" y2="${(S.top+g).toFixed(1)}" stroke="${Ho}" stroke-width="1"/>
${f}
</svg>`}function ps({items:o,requiredRatio:n,palette:c}){let S=2*Math.PI*56,y=(o||[]).filter(L=>L&&L.ratio>0),_=Math.max(0,Math.min(100,Math.round(Number(n)||0)));if(!y.length)return'<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成"></svg>';let g=-90,v=y.map(L=>{let C=L.ratio/100*S,h=`<circle cx="75" cy="75" r="56" fill="none" stroke="${c.share&&c.share[L.key]||c.required}" stroke-width="24"
  stroke-dasharray="${C.toFixed(2)} ${S.toFixed(2)}"
  stroke-linecap="butt" transform="rotate(${g.toFixed(2)} 75 75)"/>`;return g+=L.ratio/100*360,h}).join("");return`<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成">
<circle cx="75" cy="75" r="56" fill="none" stroke="${Ho}" stroke-width="24"/>
${v}
<text x="75" y="69" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${ce(_)}%</text>
<text x="75" y="91" text-anchor="middle" font-size="11.5" fill="${le}">必修学分占比</text>
</svg>`}var Sd=Object.freeze({gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)",share:Object.freeze({required:"var(--primary)",elective:"var(--text-muted)",optional:"var(--text-secondary)",other:"var(--border)"})}),_d='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>',Ed='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';function is({deps:o}){let n=o&&o.palette||Sd;function c(){return`<div id="urppp-score-analysis" class="urppp-sa" data-urppp-sa-state="collapsed">
  <button type="button" class="urppp-sa-toggle" aria-expanded="false">
    <span class="urppp-sa-icon">${_d}</span>
    <span class="urppp-sa-title">成绩分析</span>
    <span class="urppp-sa-summary" data-urppp-sa-summary>点击展开，查看成绩指标与学期变化</span>
    <span class="urppp-sa-chevron">${Ed}</span>
  </button>
  <div class="urppp-sa-body" data-urppp-sa-body hidden>
    <div class="urppp-sa-content" data-urppp-sa-content></div>
  </div>
</div>`}function d(){return'<div class="urppp-sa-loading"><span class="urppp-sa-spinner"></span><span>正在计算成绩分析…</span></div>'}function u(_){return`<div class="urppp-sa-error">${X(String(_||"成绩数据加载失败"))}
  <button type="button" class="urppp-sa-retry" data-urppp-sa-retry>重试</button></div>`}function k(_){return[{label:"主修必修绩点",value:_.requiredGpa>0?String(_.requiredGpa):"—",hint:"必修课程加权"},{label:"平均绩点",value:_.avgGpa!=null?String(_.avgGpa):"—",hint:"全部及格加权"},{label:"加权均分",value:_.avgScore!=null?String(_.avgScore):"—",hint:"学分加权"},{label:"已修学分",value:_.totalCredit!=null?String(_.totalCredit):"—",hint:"及格课程学分"},{label:"已修课程",value:String(_.courseCount||0),hint:"含未评估"}].map(v=>`<div class="urppp-sa-metric">
  <div class="urppp-sa-metric-value">${X(v.value)}</div>
  <div class="urppp-sa-metric-label">${X(v.label)}</div>
  <div class="urppp-sa-metric-hint">${X(v.hint)}</div>
</div>`).join("")}function P(_){return`<table class="urppp-sa-table">
<thead><tr><th>学期</th><th>课程</th><th>学分</th><th>加权均分</th><th>平均绩点</th></tr></thead>
<tbody>${(_||[]).map(v=>`<tr><td>${X(v.label)}</td><td>${X(v.count)}</td><td>${X(v.credit)}</td><td>${X(v.avgScore)}</td><td>${X(v.avgGpa)}</td></tr>`).join("")}</tbody></table>`}function S(_){return(_||[]).map(g=>`<div class="urppp-sa-legend-item"><i class="urppp-sa-legend-dot" style="background:${n.share&&n.share[g.key]||n.primary}"></i>${X(g.label)} ${X(g.credit)} 学分 · ${X(g.count)} 门</div>`).join("")}function y(_,g={}){if(!_||_.empty)return'<div class="urppp-sa-empty">暂无可用成绩数据，请先在教务系统查询成绩后再试。</div>';let v=_.share||{items:[],requiredRatio:0},L=g.chartLayout||null;return`<div class="urppp-sa-metrics">${k(_.metrics)}</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-trend">
    <h5 class="urppp-sa-card-title">学期趋势</h5>
    <div class="urppp-sa-chart-scroll">${Aa({trend:_.trend,palette:n,layout:L})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-share">
    <h5 class="urppp-sa-card-title">课程类型构成</h5>
    <div class="urppp-sa-share-body">
      <div class="urppp-sa-donut">${ps({items:v.items,requiredRatio:v.requiredRatio,palette:n})}</div>
      <div class="urppp-sa-legend">${S(v.items)}</div>
    </div>
  </section>
</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-bands">
    <h5 class="urppp-sa-card-title">成绩分段分布</h5>
    <div class="urppp-sa-chart-scroll">${Sa({bands:_.bands,palette:n,layout:L})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-detail">
    <h5 class="urppp-sa-card-title">各学期明细</h5>
    ${P(_.trend)}
  </section>
</div>`}return{panelShellHtml:c,loadingHtml:d,errorHtml:u,analysisHtml:y,palette:n}}function ss(){function o(n,c){let d=n.querySelector(".urppp-sa-toggle"),u=n.querySelector("[data-urppp-sa-body]");if(!d||!u)return{isExpanded:()=>!1,setExpanded:()=>{},syncShareLayout:()=>{}};let k=S=>{let y=S?"expanded":"collapsed";n.dataset.urpppSaState=y,d.setAttribute("aria-expanded",String(S)),u.hidden=!S,S&&typeof c.onExpand=="function"&&c.onExpand()};d.addEventListener("click",()=>{let S=d.getAttribute("aria-expanded")==="true";k(!S)}),u.addEventListener("click",S=>{let y=S.target;y&&y.closest&&y.closest("[data-urppp-sa-retry]")&&typeof c.onRetry=="function"&&c.onRetry()});function P(){let S=n.querySelector(".urppp-sa-donut"),y=n.querySelector(".urppp-sa-legend"),_=!!(S&&y&&y.getBoundingClientRect().top>=S.getBoundingClientRect().bottom);n.classList.toggle("urppp-sa-share-stacked",_)}return{setExpanded:k,syncShareLayout:P,isExpanded:()=>d.getAttribute("aria-expanded")==="true"}}return{bindPanel:o}}var ls="urppp-score-analysis";function cs({deps:o}){let n=ka({deps:o}),c=is({deps:o}),d=ss(),u=null,k="idle",P=null,S=null,y=null,_=!1,g=0,v="desktop";function L(){if(!o.styles||document.getElementById("urppp-score-analysis-style"))return;let U=document.createElement("style");U.id="urppp-score-analysis-style",U.textContent=o.styles,(document.head||document.documentElement).appendChild(U)}function C(){if(typeof o.getInsertHost=="function"){let U=o.getInsertHost();if(U)return U}return document.querySelector(".page-content")||document.getElementById("page-content-template")||document.body}function f(){return u&&u.querySelector("[data-urppp-sa-content]")}function h(){return P||(k="loading",P=(async()=>{try{let[U,rt]=await Promise.all([o.loadScores(),o.loadProfile()]);if(U&&U.error)throw new Error(U.error);let it=n.analyzeScores({scorePack:U,profile:rt});return S=it,k="ready",it}catch(U){throw k="error",U}finally{P=null}})(),P)}function w(){k==="idle"&&h().catch(()=>{})}function x(){if(y&&typeof y.syncShareLayout=="function")try{y.syncShareLayout()}catch{}}function E(){try{if(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches)return{variant:"mobile"}}catch{}return null}function z(){let U=f();if(!U||!S)return;let rt=E();v=rt?rt.variant:"desktop",U.innerHTML=c.analysisHtml(S,{chartLayout:rt}),x()}function M(){clearTimeout(g),g=setTimeout(()=>{if(x(),!S||!y||!y.isExpanded())return;let U=E();(U?U.variant:"desktop")!==v&&z()},120)}function q(){_||(_=!0,window.addEventListener("resize",M))}function D(){_&&(_=!1,clearTimeout(g),g=0,window.removeEventListener("resize",M))}async function $(){let U=f();if(U){if(k==="ready"&&S){z();return}U.innerHTML=c.loadingHtml();try{await h(),z()}catch(rt){U.innerHTML=c.errorHtml(rt&&rt.message||String(rt))}}}function j(){if(L(),u&&u.isConnected)return u;if(document.getElementById(ls))return document.getElementById(ls);let U=C();if(!U)return null;let rt=document.createElement("div");return rt.innerHTML=c.panelShellHtml(),u=rt.firstElementChild,U.insertBefore(u,U.firstChild),y=d.bindPanel(u,{onExpand:$,onRetry:$}),q(),w(),o.shouldAutoExpand&&o.shouldAutoExpand()&&(typeof requestAnimationFrame=="function"?requestAnimationFrame:bt=>setTimeout(bt,0))(()=>{try{y.setExpanded(!0)}catch{}}),u}function G(){D(),u&&u.isConnected&&u.remove(),u=null,y=null,k="idle",P=null,S=null,v="desktop"}return{mount:j,unmount:G,getPanel:()=>u,reset:G}}function ds({documentRef:o=document,locationRef:n=location,windowRef:c=window}){function d(_){return String(_||"").replace(/[\u00a0\s]+/g," ").replace(/^[>\u25b8\u203a·•\u00bb]+/,"").replace(/^\s*[\u25b8>]\s*/,"").trim()}function u(_){if(!_)return"";let g=_.querySelector(":scope > a");if(!g)return"";let v=g.querySelector(".menu-text, .urppp-nav-text");if(v)return d(v.textContent);let L=g.cloneNode(!0);return L.querySelectorAll("i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow").forEach(C=>C.remove()),d(L.textContent)}function k(_){let g=[],v=_,L=o.getElementById("menus")||o.getElementById("urppp-menus");for(;v&&v!==L;){if(v.tagName==="LI"){let C=u(v);C&&!/^(首页|一级菜单|二级菜单|三级菜单)$/.test(C)&&g.unshift(C)}v=v.parentElement}return g.filter((C,f)=>C&&C!==g[f-1])}function P(){let _=n.pathname.replace(/\/+$/,"")||"/",g=n.search||"",v=[];return[o.getElementById("menus"),o.getElementById("urppp-menus")].filter(Boolean).forEach(C=>{C.querySelectorAll("a[href]").forEach(f=>{let h=f.getAttribute("href")||"";if(!(!h||h==="#"||h.startsWith("javascript")))try{let w=new URL(h,n.origin),x=w.pathname.replace(/\/+$/,"")||"/";if(x==="/"&&_!=="/")return;let E=0;_===x?E=1e3+x.length:_.startsWith(x+"/")?E=500+x.length:_.includes(x)&&x.length>8&&(E=200+x.length),E&&g&&w.search&&g.indexOf(w.search.slice(1))>=0&&(E+=50),E>0&&v.push({score:E,li:f.closest("li")})}catch{}})}),v.sort((C,f)=>f.score-C.score),v.length?v[0].li:null}function S(){let _=P();if(_){let h=k(_);if(h.length)return h}let g="";try{let h=o.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);h&&(g=decodeURIComponent(h[1]))}catch{}if(g&&g!=="0"){let h=o.getElementById(g);if(h){let w=k(h);if(w.length)return w}}let v=null,L=Array.from(o.querySelectorAll("#menus li.active"));if(L.length){v=L[L.length-1];for(let h=L.length-1;h>=0;h--)if(!L[h].querySelector("li.active")){v=L[h];break}}if(!v){let h=Array.from(o.querySelectorAll("#urppp-menus .urppp-nav-item.active"));if(h.length){v=h[h.length-1];for(let w=h.length-1;w>=0;w--)if(!h[w].querySelector(".urppp-nav-item.active")){v=h[w];break}}}if(v){let h=k(v);if(h.length)return h}let C=o.getElementById("breadcrumbs")||o.querySelector(".breadcrumbs"),f=C&&(C.querySelector("ul.breadcrumb")||C.querySelector(".breadcrumb"));if(f){let h=[];if(Array.from(f.children).forEach((w,x)=>{if(x===0)return;let E=d(w.textContent);!E||/^(首页|一级菜单|二级菜单|三级菜单)$/.test(E)||h[h.length-1]!==E&&h.push(E)}),h.length)return h}return[]}function y(){let _=o.getElementById("breadcrumbs")||o.querySelector(".breadcrumbs");if(!_)return;_.classList.remove("hide"),_.style.removeProperty("display"),_.style.setProperty("display","flex","important");let g=_.querySelector("ul.breadcrumb")||_.querySelector(".breadcrumb");g||(g=o.createElement("ul"),g.className="breadcrumb",_.appendChild(g));let v=S();if(!v.length&&Array.from(g.children).map(h=>d(h.textContent)).filter(Boolean).some(h=>h!=="首页"&&!/^(一级菜单|二级菜单|三级菜单)$/.test(h)))return;g.innerHTML="";let L=o.createElement("li");L.style.cursor="pointer",L.innerHTML='<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>',L.addEventListener("click",()=>{c.location.href="/"}),g.appendChild(L),v.forEach((C,f)=>{let h=o.createElement("li");f===v.length-1&&h.classList.add("active");let w=o.createElement("span");w.className="urppp-bc-label",w.textContent=C,h.appendChild(w),g.appendChild(h)})}return{beautifyBreadcrumbs:y}}function us({documentRef:o=document,windowRef:n=window,MutationObserverRef:c=MutationObserver,nodeTypeRef:d=Node}){function u(){try{let S=o.getElementById("sidebar"),y=o.querySelectorAll(".main-content");if(!y.length)return;let _=n.matchMedia&&n.matchMedia("(max-width: 991px)").matches,g="260px";_?g="0px":S&&(g=S.classList.contains("menu-min")?"50px":"260px"),y.forEach(v=>v.style.setProperty("margin-left",g,"important"))}catch{}}function k(){try{let S=o.getElementById("sidebar"),y=o.querySelector("#navbar, .navbar.navbar-default, .navbar-fixed-top");if(!S||!y||S.classList.contains("urppp-clean-sidebar"))return;let _=y.getBoundingClientRect(),g=Math.max(45,Math.round(_.height||y.offsetHeight||45));o.documentElement.style.setProperty("--urppp-navbar-height",g+"px"),S.style.setProperty("top",g+"px","important"),S.style.setProperty("height","calc(100vh - "+g+"px)","important"),S.style.setProperty("margin-top","0","important"),y.style.setProperty("z-index","1100","important"),S.style.setProperty("z-index","1030","important"),u()}catch{}}function P(){let S=o.getElementById("sidebar"),y=o.getElementById("menus");if(!S||!y)return;if(n.__urpppSidebarMenuObserver){try{n.__urpppSidebarMenuObserver.disconnect()}catch{}n.__urpppSidebarMenuObserver=null}let _=o.getElementById("urppp-menus"),g=S.querySelector(".urppp-sidebar-header");_&&_.remove(),g&&g.remove(),k();let v=new Set;y.querySelectorAll("li.active").forEach($=>{$.id&&v.add($.id)});function L($){return Array.from($.children).filter(j=>j.tagName==="LI").map(j=>{let G=j.querySelector(":scope > a"),U=G?.querySelector(".menu-text"),rt=U?U.textContent.trim():G?Array.from(G.childNodes).filter(st=>st.nodeType===d.TEXT_NODE).map(st=>st.textContent).join("").trim():"",it=G?.querySelector(".menu-icon"),bt=it?Array.from(it.classList).filter(st=>st!=="menu-icon").join(" "):"",J=j.querySelector(":scope > .submenu"),Y=J?L(J):[];Y=Y.filter(st=>st.text&&(st.text.trim()||st.href&&st.href!=="#"));let ot=G?.getAttribute("href")||"#",K=G?.getAttribute("target")||"",ct=j.getAttribute("onclick")||G?.getAttribute("onclick")||"",at=j.id;return ot!=="#"&&!ot.startsWith("javascript")?{id:at,text:rt,iconClass:bt,children:[],href:ot,target:K,onclick:ct}:Y.length===1&&Y[0].children.length===0?{id:at||Y[0].id,text:rt,iconClass:bt||Y[0].iconClass,children:[],href:Y[0].href||ot,target:Y[0].target||K,onclick:Y[0].onclick||ct}:{id:at,text:rt,iconClass:bt,children:Y,href:ot,target:K,onclick:ct}})}let C=L(y);y.style.display="none";let f=o.createElement("div");f.className="urppp-sidebar-header",f.style.cssText="position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)";let h=o.createElement("button");h.type="button",h.className="urppp-sidebar-toggle",h.innerHTML='<i class="fa fa-angle-left" aria-hidden="true"></i>',h.title="收起侧边栏",typeof h.setAttribute=="function"&&h.setAttribute("aria-label","收起侧边栏");let w=()=>!!(n.matchMedia&&n.matchMedia("(max-width: 991px)").matches),x=$=>{if($&&($.preventDefault(),$.stopPropagation()),w()){S.classList.remove("display"),u();return}let j=o.getElementById("sidebar-collapse");j&&j.click()};h.addEventListener("click",x),f.appendChild(h);let E=()=>{let $=w(),j=o.body.classList.contains("menu-min")||S.classList.contains("menu-min"),G=$?"关闭菜单":j?"展开侧边栏":"收起侧边栏";h.innerHTML=$?'<i class="fa fa-times" aria-hidden="true"></i>':j?'<i class="fa fa-angle-right" aria-hidden="true"></i>':'<i class="fa fa-angle-left" aria-hidden="true"></i>',h.title=G,typeof h.setAttribute=="function"&&h.setAttribute("aria-label",G),!$&&j?(f.style.justifyContent="center",f.style.padding="12px 0"):(f.style.justifyContent="flex-end",f.style.padding="")},z=new c(E);z.observe(o.body,{attributes:!0,attributeFilter:["class"]}),z.observe(S,{attributes:!0,attributeFilter:["class"]}),n.__urpppSidebarMenuObserver=z,E();let M=o.createElement("ul");M.id="urppp-menus",M.style.cssText="margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)";function q($){o.querySelectorAll("#urppp-menus .urppp-nav-item").forEach(G=>G.classList.remove("active"));let j=$;for(;j&&j.id!=="urppp-menus";)j.classList.contains("urppp-nav-item")&&j.classList.add("active"),j=j.parentElement}function D($,j){let G=o.createElement("li");G.className="urppp-nav-item",$.id&&(G.id=$.id);let U=$.children.length>0,rt=$.href||"#",it=rt!=="#"&&!rt.startsWith("javascript"),bt=o.createElement("a");if(bt.className="urppp-nav-link",bt.href=it?rt:"javascript:void(0)",$.target&&bt.setAttribute("target",$.target),$.iconClass){let Y=o.createElement("i");$.iconClass.split(" ").forEach(ot=>{ot&&Y.classList.add(ot)}),bt.appendChild(Y)}let J=o.createElement("span");if(J.className="urppp-nav-text",J.textContent=$.text,J.title=$.text,bt.appendChild(J),U){let Y=o.createElement("i");Y.className="urppp-nav-arrow fa fa-angle-down",Y.addEventListener("click",ot=>{ot.preventDefault(),ot.stopPropagation(),G.classList.toggle("open")}),bt.appendChild(Y)}if(G.appendChild(bt),bt.addEventListener("click",Y=>{if(q(G),!it&&U)Y.preventDefault(),G.classList.toggle("open");else if(it)return}),U){let Y=o.createElement("ul");Y.className="urppp-nav-submenu",$.children.forEach(ot=>D(ot,Y)),G.appendChild(Y)}$.id&&v.has($.id)&&G.classList.add("active"),j.appendChild(G)}C.forEach($=>D($,M)),M.querySelectorAll(".urppp-nav-item.open").forEach($=>$.classList.remove("open")),S.insertBefore(f,S.firstChild),S.appendChild(M)}return{rebuildSidebarCompletely:P,syncMobileContentOffset:u,syncSidebarUnderNavbar:k}}function ms({theme:o,settings:n,documentRef:c=document,windowRef:d=window}){function u(_){if(!_)return;let g=o.getSkin(),v=o.skinSupportsFixedPalettes(g),L=o.getCurrent(),C=v?o.getBrutalActivePalette():null,f=v?o.getBrutalSelectedPalette():null;_.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(h=>{let w=h.dataset.theme,x=w==="dark",E=w==="scu-red",z=x&&!o.skinSupportsDark(g)||E&&!o.skinSupportsDynamic(g)&&!v,M=w===L;if(v&&(M=w==="default"&&C.id===o.BRUTAL_DEFAULT_PALETTE||E&&C.id!==o.BRUTAL_DEFAULT_PALETTE),h.disabled=z,h.classList.toggle("urppp-theme-disabled",z),h.classList.toggle("ac",M&&!z),h.setAttribute("aria-disabled",z?"true":"false"),w==="default")h.style.background=v?o.getBrutalPaletteById(o.BRUTAL_DEFAULT_PALETTE).accent:"#F1F3F5",h.title=v?"默认高能粉":"简约白";else if(x)h.style.background=z?"#A7A7A7":"#0B0F14",h.title=z?"当前界面风格不支持暗色模式":"深邃暗";else if(E)if(z)h.style.background="#A7A7A7",h.title="当前界面风格不支持动态配色";else if(v)h.style.background=f.accent,h.title="高对比配色："+f.name;else{let q=o.getAccent()||o.DEFAULT_SEED;try{let D=o.buildSchemePreview(q,o.getScheme());h.style.background="linear-gradient(135deg, "+D.primary+" 0 55%, "+D.surface+" 55% 100%)"}catch{h.style.background=q}h.title="动态配色"}})}function k(_){let g=o.getSkin();if(o.skinSupportsFixedPalettes(g)){if(_==="dark")return;o.getCurrent()!=="default"&&o.applyTheme("default",{manual:!0}),_==="default"&&o.setBrutalPalette(o.BRUTAL_DEFAULT_PALETTE),_==="scu-red"&&o.setBrutalPalette(o.getBrutalSelectedPalette().id);return}o.isThemeModeAvailable(_,g)&&o.applyTheme(_,{manual:!0})}function P(){u(c.getElementById("urppp-nav-theme"))}function S(){try{let _=c.getElementById("navbar")||c.querySelector(".navbar");if(!_)return;if(c.getElementById("urppp-nav-theme")){P();return}let g=_.querySelector(".navbar-header .navbar-brand")||_.querySelector(".navbar-brand")||_.querySelector(".navbar-header");if(!g)return;let v=c.createElement("div");v.id="urppp-nav-theme",v.innerHTML=['<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>','<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>','<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>','<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">','  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">','    <circle cx="12" cy="12" r="3"></circle>','    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',"  </svg>","</button>"].join(""),g.parentElement?(g.parentElement.style.setProperty("display","flex","important"),g.parentElement.style.setProperty("align-items","center","important"),g.nextSibling?g.parentElement.insertBefore(v,g.nextSibling):g.parentElement.appendChild(v)):g.appendChild(v),v.style.setProperty("display","inline-flex","important"),v.style.setProperty("align-items","center","important"),v.style.setProperty("height","36px","important"),v.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(L=>{L.addEventListener("click",()=>{k(L.dataset.theme),P();try{n.syncSettingsPanelUI()}catch{}})}),v.querySelector("#urppp-nav-settings").addEventListener("click",L=>{L.preventDefault(),L.stopPropagation(),n.openSettingsPanel()}),n.ensureSettingsPanel(),P();try{d.__urpppCleanMode&&d.__urpppCleanMode.inject()}catch{}}catch(_){console.warn("[URP++] navbar theme switch inject failed",_)}}function y(){let g=c.getElementById("navbar")?.querySelector(".ace-nav");try{S()}catch{}if(!g)return;function v(E,z){Object.entries(z).forEach(([M,q])=>E.style.setProperty(M,q,"important"))}Array.from(g.childNodes).forEach(E=>{E.nodeType===Node.TEXT_NODE&&!E.textContent.trim()&&E.remove()}),g.querySelectorAll(":scope > li").forEach(E=>{v(E,{display:"inline-flex","align-items":"center","vertical-align":"middle",margin:"0",padding:"0","text-align":"left"})}),g.querySelectorAll(":scope > li > a").forEach(E=>{v(E,{display:"inline-flex","align-items":"center","justify-content":"center",height:"36px",padding:"0 4px","flex-wrap":"nowrap","vertical-align":"middle","text-decoration":"none"}),E.style.lineHeight="1"}),g.querySelectorAll(":scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa").forEach(E=>{v(E,{top:"auto","vertical-align":"middle","line-height":"1","margin-top":"0"})});let L=g.querySelector(':scope > li > a[href*="customerServiceCenter"]');L&&(v(L,{width:"28px","justify-content":"center"}),L.style.padding="0 4px");let C=c.getElementById("clickdiv"),f=c.getElementById("form-search"),h=c.getElementById("search-input"),w=c.getElementById("intellegenceUDiv");if(w&&(w.style.setProperty("position","relative","important"),w.style.setProperty("z-index","30","important"),w.style.setProperty("display","inline-flex","important"),w.style.setProperty("align-items","center","important"),w.style.setProperty("justify-content","center","important"),w.style.setProperty("width","32px","important"),w.style.setProperty("height","36px","important"),w.style.setProperty("vertical-align","middle","important"),w.style.setProperty("margin","0","important"),w.style.setProperty("padding","0","important")),C&&f){C.removeAttribute("onclick"),v(C,{"background-color":"transparent",position:"relative",display:"inline-flex","align-items":"center","justify-content":"center",width:"32px",height:"32px","border-radius":"8px","line-height":"1","z-index":"30"});let E=c.getElementById("clicki");E&&v(E,{color:"var(--text-secondary)","margin-top":"0"}),C.__urpppNavbarClickBound||(C.__urpppNavbarClickBound=!0,C.addEventListener("mouseenter",()=>C.style.setProperty("background-color","var(--input-bg)","important")),C.addEventListener("mouseleave",()=>C.style.setProperty("background-color","transparent","important")),C.addEventListener("click",q=>{q.preventDefault(),q.stopPropagation(),f.dataset.open==="1"?(f.style.width="0px",f.style.opacity="0",f.dataset.open="0"):(f.style.width="180px",f.style.opacity="1",f.dataset.open="1",h&&setTimeout(()=>h.focus(),50))})),d.__urpppNavbarOutsideClickBound||(d.__urpppNavbarOutsideClickBound=!0,c.addEventListener("click",q=>{let D=c.getElementById("clickdiv"),$=c.getElementById("form-search");!D||!$||$.dataset.open!=="1"||!D.contains(q.target)&&!$.contains(q.target)&&($.style.width="0px",$.style.opacity="0",$.dataset.open="0")})),v(f,{position:"absolute",right:"34px",top:"50%",transform:"translateY(-50%)",left:"auto",margin:"0","z-index":"10",background:"transparent",border:"none","box-shadow":"none",overflow:"hidden",padding:"0",transition:"width .2s ease, opacity .2s ease"});let z=f.dataset.open==="1"?"160px":"0px";f.style.width!==z&&(f.style.width=z,f.style.opacity=f.dataset.open==="1"?"1":"0"),h&&v(h,{"background-color":"var(--input-bg)",border:"1px solid var(--border)",color:"var(--text)","border-radius":"8px",height:"32px",padding:"0 12px","line-height":"32px",width:"100%"});let M=f.querySelector(".input-icon > .ace-icon.fa-search");M&&(M.style.display="none")}let x=g.querySelector(":scope > li.light-blue > a");if(x){v(x,{display:"inline-flex","align-items":"center",gap:"6px"});let E=x.querySelector(".user-info");E&&(v(E,{display:"inline-flex","align-items":"center",gap:"4px","max-width":"none","white-space":"nowrap","vertical-align":"middle","line-height":"1","margin-top":"-12px"}),Array.from(E.childNodes).forEach(M=>{M.nodeType===Node.TEXT_NODE&&(M.textContent=M.textContent.replace(/\s+/g,"").trim())}),Array.from(E.children).forEach(M=>{v(M,{display:"inline","white-space":"nowrap","vertical-align":"middle","line-height":"1",margin:"0",padding:"0"}),M.tagName==="SMALL"&&M.style.setProperty("font-size","inherit","important")}));let z=x.querySelector(".nav-user-photo");z&&(z.alt=(z.alt||"").replace(/\s+/g,"").trim(),v(z,{"vertical-align":"middle",display:"inline-block",width:"30px",height:"30px"}))}}return{handleThemeDotClick:k,injectNavbarThemeSwitch:S,rebuildNavbar:y,syncNavbarThemeUI:P,syncThemeDotGroup:u}}(function(){"use strict";try{let t=typeof navigator<"u"&&navigator.userAgent||"";if(/Android|iPhone|iPad|iPod|Mobile/i.test(t)){document.documentElement&&document.documentElement.classList.add("urppp-mobile");let e=document.querySelector('meta[name="viewport"]');e||(e=document.createElement("meta"),e.name="viewport",e.content="width=device-width, initial-scale=1",(document.head||document.documentElement||document).appendChild(e))}}catch{}let o="1.9.7";if(/^id\./i.test(String(location.hostname||""))){try{let t=To({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:o},uiDeps:{openSubpanel:()=>{}}}),e=()=>{try{t.bootFromCache("assist")}catch{}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}catch{}return}let n={mainRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js",assistRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",changelogPage:"https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md",greasySearch:"https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B",versionJson:"version.json",sourceUrls:t=>[`https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`,`https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/${t}`,`https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`]},c="urppp_auto_update_check_v1",d="urppp_skin_v1",u=[{id:"apple",name:"类Apple风格",desc:"系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。",ready:!0,dark:!0,dynamic:!0,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"editorial",name:"编辑杂志",desc:"衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"flat",name:"极简扁平",desc:"无阴影、硬边与纯色层次，冷硬清晰。",ready:!0,dark:!0,dynamic:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"organic",name:"自然有机",desc:"奶油底与大地色，温暖圆角。不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"brutal",name:"新野兽派",desc:"高对比画布、粗边框与硬阴影。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,palettes:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"neu",name:"新拟物",desc:"同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}}],k=GM_addStyle(`
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
  `;function S(t){let e=document.createElement("div");return e.className="urppp-inline-loader",e.innerHTML=P+(t?`<div>${t}</div>`:""),e}function y(t){return!t||!t.closest?!1:!!t.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]')}function _(t){try{(t&&t.querySelectorAll?t:document).querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach(r=>{r.querySelectorAll(".urppp-inline-loader").forEach(a=>{try{a.remove()}catch{}}),r.classList.remove("urppp-loading-active")})}catch{}}function g(t){try{let e=t&&t.querySelectorAll?t:document;_(e),e.querySelectorAll("img").forEach(r=>{try{if(!r||r.dataset.urpppReplaced==="1"||y(r))return;let a=(r.getAttribute("src")||r.src||"").toLowerCase();if(!a||!(a.includes("pageloading")||a.includes("page-loading")||a.includes("loading.gif")||a.includes("loading-0")||a.includes("loading-1"))||a.includes("/loading")&&!a.includes("pageloading")&&!a.includes("loading.gif")&&!a.includes("loading-0"))return;r.dataset.urpppReplaced="1";let p=S("");p.style.minHeight="0",p.style.padding="0",r.parentElement&&r.parentElement.replaceChild(p,r)}catch{}}),e.querySelectorAll(".layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content").forEach(r=>{try{if(!r||r.dataset.urpppReplaced==="1")return;if(r.dataset.urpppReplaced="1",r.style.setProperty("background","transparent","important"),r.style.setProperty("background-image","none","important"),!r.querySelector(".urppp-inline-loader")){let a=S("");a.style.minHeight="0",a.style.padding="0",r.appendChild(a)}}catch{}})}catch{}}if(!window.__urpppLoaderObs){window.__urpppLoaderObs=!0;let t=!1,e=()=>{if(!t){t=!0;try{g(document)}catch{}t=!1}};document.body&&setTimeout(e,0),document.addEventListener("DOMContentLoaded",()=>setTimeout(e,0),{once:!0});let r=()=>{new MutationObserver(()=>{clearTimeout(window.__urpppLoaderTimer),window.__urpppLoaderTimer=setTimeout(e,200)}).observe(document.documentElement,{childList:!0,subtree:!0})};document.body?r():document.addEventListener("DOMContentLoaded",r,{once:!0})}let v="urppp_theme_v3",L="urppp_accent_v1",C="urppp_accent_presets_v1",f="urppp_scheme_v1",h="urppp_theme_follow_system_v1",w="urppp_clean_default_v1",x="urppp_clean_analysis_v1",E="urppp_apple_edge_line_v1",z="urppp_follow_use_dynamic_v1",M="urppp_brutal_palette_v1",q="urppp_brutal_active_palette_v1",D="urppp_privacy_v1",$="urppp_custom_identity_v1",j="urppp_schedule_first_monday_v1",G="urppp_schedule_json_format_v1",U={completedCourses:"已修课程",failedCourses:"未及格课程",majorGpa:"主修绩点",majorPlan:"主修方案",remainingCourses:"待修课程",passingTotalCredit:"全部及格总学分",passingAvgScore:"全部及格平均成绩",passingAvgGpa:"全部及格平均绩点",passingRequiredCredit:"全部及格必修学分",passingRequiredAvg:"全部及格必修平均",passingRequiredGpa:"全部及格必修绩点",schemeTotalCredit:"方案总学分",schemeAvgScore:"方案平均成绩",schemeAvgGpa:"方案平均绩点",schemeRequiredCredit:"方案必修学分",schemeRequiredAvg:"方案必修平均",schemeRequiredGpa:"方案必修绩点"},rt="",it=["#1E3A5F","#B53434","#0F766E","#7C3AED","#C2410C","#0369A1","#BE185D","#365314"],bt="#B53434",J="pink",Y=[{id:"pink",name:"高能粉",desc:"默认配色，热粉强调与酸性绿辅助",accent:"#FF006E",secondary:"#CCFF00",info:"#00D9FF",warning:"#FF9500"},{id:"acid",name:"酸性绿",desc:"酸性绿强调与热粉辅助",accent:"#CCFF00",secondary:"#FF006E",info:"#00D9FF",warning:"#FF9500"},{id:"cyan",name:"电子蓝",desc:"电子蓝强调与亮橙辅助",accent:"#00D9FF",secondary:"#FF9500",info:"#CCFF00",warning:"#FF006E"},{id:"orange",name:"亮橙",desc:"亮橙强调与电子蓝辅助",accent:"#FF9500",secondary:"#00D9FF",info:"#CCFF00",warning:"#FF006E"}],ot="tonal",K=[{id:"paper",name:"纯白卡片",desc:"卡片保持白，仅强调色跟种子"},{id:"tonal",name:"色调点缀",desc:"背景轻染，卡片带同色相浅底"},{id:"soft",name:"柔和粉彩",desc:"卡片明显粉彩/浅色，低对比"},{id:"vibrant",name:"鲜艳",desc:"背景与卡片都更有色，主色更饱和"},{id:"expressive",name:"表现力",desc:"双色拼色：卡片跟主色，背景走协调次色"}],{handleThemeDotClick:ct,injectNavbarThemeSwitch:at,rebuildNavbar:st,syncNavbarThemeUI:xt,syncThemeDotGroup:tt}=ms({theme:{BRUTAL_DEFAULT_PALETTE:J,DEFAULT_SEED:bt,applyTheme:Jt,buildSchemePreview:ee,getAccent:Xt,getBrutalActivePalette:Ko,getBrutalPaletteById:ur,getBrutalSelectedPalette:Qo,getCurrent:Qt,getScheme:je,getSkin:re,isThemeModeAvailable:dr,setBrutalPalette:Zo,skinSupportsDark:Re,skinSupportsDynamic:He,skinSupportsFixedPalettes:Yo},settings:{ensureSettingsPanel:Cn,openSettingsPanel:An,syncSettingsPanelUI:jt}});function dt(){try{if(!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches))return;let e=document.getElementById("navbar"),r=e?.querySelector(".ace-nav");if(!e||!r)return;let a=document.getElementById("intellegenceUDiv"),p=document.getElementById("clickdiv"),i=document.getElementById("form-search");if(!a){let R=document.createElement("li");R.className="green urppp-search-item",a=document.createElement("div"),a.id="intellegenceUDiv",R.appendChild(a),r.appendChild(R)}let l=a.closest("li")||a.parentElement,b=Array.from(r.children).find(R=>{let H=R.querySelector(":scope > a");if(!H)return!1;let F=H.getAttribute("href")||"",Z=(H.getAttribute("title")||"")+" "+(H.textContent||"");return F.includes("customerServiceCenter")||/help|service|support/i.test(F)||!!H.querySelector(".glyphicon-headphones, .fa-headphones, .fa-question-circle, .fa-life-ring")||/帮助|客服|服务|帮助中心/i.test(Z)}),m=Array.from(r.children).find(R=>R.classList.contains("light-blue")),A=b||m||null;A&&l&&A!==l&&((l.compareDocumentPosition(A)&Node.DOCUMENT_POSITION_FOLLOWING)!==0||r.insertBefore(l,A)),l&&!l.classList.contains("urppp-search-item")&&l.classList.add("urppp-search-item");let T=l;p?(p.removeAttribute("onclick"),p.setAttribute("role","button"),p.setAttribute("aria-label","搜索功能")):(p=document.createElement("button"),p.type="button",p.id="clickdiv",p.setAttribute("aria-label","搜索功能"),p.innerHTML='<i class="fa fa-search" id="clicki" aria-hidden="true"></i>',a.appendChild(p)),p.style.setProperty("left","8px","important"),p.style.setProperty("position","relative","important"),p.style.setProperty("z-index","31","important"),i||(i=document.createElement("div"),i.id="form-search",i.className="nav-search",i.innerHTML='<form class="form-search"><span class="input-icon"><input type="text" placeholder="查找功能..." class="nav-search-input" id="search-input" autocomplete="off"><i class="ace-icon fa fa-search" aria-hidden="true"></i></span></form>'),T&&i.parentElement!==T&&T.appendChild(i),T&&T.style.setProperty("position","relative","important"),i.classList.add("urppp-desktop-search"),i.style.setProperty("position","absolute","important"),i.style.setProperty("top","50%","important"),i.style.setProperty("right","24px","important"),i.style.setProperty("left","auto","important"),i.style.setProperty("transform","translateY(-50%)","important"),i.style.setProperty("width",i.dataset.open==="1"?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("max-width","calc(100vw - 24px)","important"),i.style.setProperty("opacity",i.dataset.open==="1"?"1":"0","important"),i.style.setProperty("pointer-events",i.dataset.open==="1"?"auto":"none","important"),i.style.setProperty("z-index","1200","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("background","transparent","important"),i.style.setProperty("border","0 solid transparent","important"),i.style.setProperty("box-shadow","none","important"),i.style.setProperty("overflow","visible","important"),i.style.setProperty("transition","width .2s ease, opacity .2s ease","important");let N=i.querySelector("#search-input"),I=i.querySelector("form");if(!N||!I)return;I.style.setProperty("display","block","important"),I.style.setProperty("margin","0","important"),I.style.setProperty("padding","10px","important");let O=i.querySelector(".input-icon");O&&(O.style.setProperty("display","block","important"),O.style.setProperty("position","relative","important")),N.style.setProperty("display","block","important"),N.style.setProperty("width","100%","important"),N.style.setProperty("height","36px","important"),N.style.setProperty("box-sizing","border-box","important"),N.style.setProperty("padding","0 12px","important"),N.style.setProperty("border","1px solid var(--border)","important"),N.style.setProperty("border-radius","var(--radius-sm)","important"),N.style.setProperty("background","var(--input-bg)","important"),N.style.setProperty("color","var(--text)","important");let Q=R=>{i.dataset.open=R?"1":"0",i.style.setProperty("width",R?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("opacity",R?"1":"0","important"),i.style.setProperty("pointer-events",R?"auto":"none","important"),p.setAttribute("aria-expanded",R?"true":"false"),R&&setTimeout(()=>N.focus(),30)};p.__urpppSearchBound||(p.__urpppSearchBound=!0,p.addEventListener("click",R=>{R.preventDefault(),R.stopImmediatePropagation(),Q(i.dataset.open!=="1")},!0)),document.__urpppDesktopSearchOutsideBound||(document.__urpppDesktopSearchOutsideBound=!0,document.addEventListener("click",R=>{let H=document.getElementById("form-search"),F=document.getElementById("clickdiv");!H||H.dataset.open!=="1"||H.classList.contains("urppp-mobile-form-search")||H.closest("#urppp-mobile-search-panel")||H.contains(R.target)||F?.contains(R.target)||Q(!1)},!0))}catch(t){console.warn("[URP++] desktop search bind failed",t)}}function At(){if(document.getElementById("urppp-boot-loader"))return;let t=document.createElement("div");t.id="urppp-boot-loader",t.setAttribute("aria-busy","true"),t.innerHTML=`
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
    `;let e=document.documentElement||document.body;e&&e.appendChild(t)}function kt(){try{document.documentElement.classList.add("urppp-ready"),document.body&&(document.body.classList.add("urppp-ready"),document.body.style.removeProperty("opacity"));let t=document.getElementById("urppp-boot-loader");if(!t)return;t.classList.add("urppp-boot-hide"),setTimeout(()=>{try{t.remove()}catch{}},280)}catch{}}try{At()}catch{}window.__urpppBootSafety||(window.__urpppBootSafety=setTimeout(()=>{try{kt()}catch{}},2500));let Pt={default:{name:"简约白",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"#0071E3","--input-bg":"#F5F5F7","--primary":"#0071E3","--primary-hover":"#0077ED","--ring":"rgba(0,113,227,0.28)","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px","--border-w":"0px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},dark:{name:"深邃暗",vars:{"--bg":"#000000","--surface":"#1C1C1E","--text":"#F5F5F7","--text-secondary":"#A1A1A6","--text-muted":"#8E8E93","--border":"#38383A","--border-focus":"#0A84FF","--input-bg":"#2C2C2E","--primary":"#0A84FF","--primary-hover":"#409CFF","--ring":"rgba(10,132,255,0.32)","--shadow":"0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},"scu-red":{name:"动态配色",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"var(--urppp-accent, #B53434)","--input-bg":"#F5F5F7","--primary":"var(--urppp-accent, #B53434)","--primary-hover":"var(--urppp-accent-hover, #962929)","--ring":"var(--urppp-accent-ring, rgba(181,52,52,0.18))","--shadow":"0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'}};function B(t,e,r){t/=255,e/=255,r/=255;let a=Math.max(t,e,r),p=Math.min(t,e,r),i=0,l=0,b=(a+p)/2;if(a!==p){let m=a-p;switch(l=b>.5?m/(2-a-p):m/(a+p),a){case t:i=(e-r)/m+(e<r?6:0);break;case e:i=(r-t)/m+2;break;default:i=(t-e)/m+4;break}i/=6}return{h:i*360,s:l,l:b}}function V(t,e,r){t=(t%360+360)%360,e=Math.max(0,Math.min(1,e)),r=Math.max(0,Math.min(1,r));let a=(1-Math.abs(2*r-1))*e,p=a*(1-Math.abs(t/60%2-1)),i=r-a/2,l=0,b=0,m=0;return t<60?(l=a,b=p):t<120?(l=p,b=a):t<180?(b=a,m=p):t<240?(b=p,m=a):t<300?(l=p,m=a):(l=a,m=p),{r:Math.round((l+i)*255),g:Math.round((b+i)*255),b:Math.round((m+i)*255)}}function et(t,e,r){let{r:a,g:p,b:i}=V(t,e,r);return Pr(a,p,i)}function ft(t){let{r:e,g:r,b:a}=nr(Yt(t)||bt),p=B(e,r,a);return p.s<.12&&(p.s=.18),p}function ht(t,e,r){let a=Math.max(0,Math.min(100,r))/100,p=Math.max(0,Math.min(.95,e));return et(t,p,a)}function Lt(t){switch(t){case"paper":case"neutral":return{chroma:1,secShift:0,primaryTone:38,whiteCard:!0,bgSeed:.05,surfaceSeed:0,borderSeed:.08};case"soft":return{chroma:1,secShift:10,primaryTone:42,bgSeed:.14,surfaceSeed:.16,borderSeed:.18};case"vibrant":return{chroma:1.15,secShift:14,primaryTone:36,bgSeed:.2,surfaceSeed:.22,borderSeed:.26};case"expressive":return{chroma:1.08,secShift:0,primaryTone:36,duo:!0,bgSeed:.12,surfaceSeed:.15,borderSeed:.18};default:return{chroma:1,secShift:18,primaryTone:40,bgSeed:.12,surfaceSeed:.13,borderSeed:.16}}}function vt(t,e){let r=Yt(t)||bt,a=Math.max(0,Math.min(.45,Number(e)||0));return a<=.001?"#FFFFFF":Ft("#FFFFFF",r,a)}function Dt(t){return t<25||t>=345?(t+28)%360:t<55?(t+22)%360:t<90?(t+160)%360:t<160?(t+40)%360:t<210?(t+35)%360:t<265?(t+48)%360:t<310?(t+40)%360:(t+24)%360}function zt(t){let e=Yt(t)||bt,{h:r,s:a}=ft(e),p=Dt(r),i=Math.min(.72,Math.max(.28,a*.78));return ht(p,i,42)}function Nt(t,e){let r=Yt(t)||bt,{h:a,s:p}=ft(r),l=Lt(e||ot),b=Math.min(.92,Math.max(.35,p*l.chroma)),m=zt(r),{h:A}=ft(m),T=ht(a,b,l.primaryTone),N=ht(a,b,Math.max(24,l.primaryTone-10)),I=Ft("#FFFFFF",r,.18),O,Q,R;l.whiteCard?(O=Ft("#F1F5F9",Ft("#FFFFFF",r,.08),.5),Q="#FFFFFF",R="#E5E7EB"):l.duo?(O=Ft(vt(m,l.bgSeed+.04),"#EEF1F4",.1),Q=Ft(vt(r,l.surfaceSeed),"#FFFFFF",.1),R=Ft("#E5E7EB",m,.16)):(O=Ft(vt(r,l.bgSeed),"#E8EBEF",.12),Q=Ft(vt(r,l.surfaceSeed),"#FFFFFF",.12),R=Ft("#E5E7EB",r,Math.max(.08,l.borderSeed*.7)));let H=l.whiteCard?"#F8FAFC":Ft(Q,vt(l.duo?m:r,Math.max(.05,(l.surfaceSeed||.1)*.55)),.35),F=ht(a,Math.min(.45,b*.55),14),Z=_e(ht(a,b*.3,34),.88),ut=_e(ht(a,b*.22,46),.76),wt=_e(T,.18),Ct="0 4px 12px "+_e(T,.1)+", 0 1px 2px "+_e(T,.05);return{"--bg":O,"--surface":Q,"--text":F,"--text-secondary":Z,"--text-muted":ut,"--border":R,"--border-focus":T,"--input-bg":H,"--primary":T,"--primary-hover":N,"--ring":wt,"--shadow":Ct,"--radius":"18px","--radius-sm":"12px","--primary-container":I,"--secondary":m}}function ee(t,e){let r=Nt(t,e);return{id:e,primary:r["--primary"],bg:r["--bg"],surface:r["--surface"],border:r["--border"],text:r["--text"]}}function De(t){let e=Yt(t)||Xt()||bt;return K.map(r=>Object.assign({},r,ee(e,r.id)))}function ge(){let t=document.documentElement;["--primary","--primary-hover","--border-focus","--ring","--bg","--surface","--text","--text-secondary","--text-muted","--border","--input-bg","--shadow","--primary-container","--secondary"].forEach(e=>t.style.removeProperty(e))}function Xt(){return Yt(GM_getValue(L,""))||""}function je(){let t=String(GM_getValue(f,ot)||ot);return K.some(e=>e.id===t)?t:ot}function _a(t){let e=K.some(r=>r.id===t)?t:ot;return GM_setValue(f,e),e}function bs(t,e){if(!t)return;let r=Yt(t);if(r){if(GM_setValue(L,r),e&&e.scheme&&_a(e.scheme),e&&e.skipTheme){let a=ko(r,.15),p=_e(r,.15);document.documentElement.style.setProperty("--urppp-accent",r),document.documentElement.style.setProperty("--urppp-accent-hover",a),document.documentElement.style.setProperty("--urppp-accent-ring",p);try{xt()}catch{}try{jt()}catch{}return}Jt("scu-red");try{xt()}catch{}try{jt()}catch{}}}function Ea(){try{let t=GM_getValue(C,"");if(!t)return it.slice();let e=JSON.parse(t);return Array.isArray(e)?e.filter(r=>typeof r=="string"&&/^#?[0-9a-fA-F]{6}$/i.test(r.replace("#",""))).map(r=>r.startsWith("#")?r.toUpperCase():"#"+r.toUpperCase()):it.slice()}catch{return it.slice()}}function hs(t){let e=Yt(t||Xt()||bt);if(!e)return Ea();let r=Ea();return r=[e].concat(r.filter(a=>a.toLowerCase()!==e.toLowerCase())),r=r.slice(0,12),GM_setValue(C,JSON.stringify(r)),r}function te(){try{return!!GM_getValue(h,!1)}catch{return!1}}function Br(t){return GM_setValue(h,!!t),!!t}function Ca(){try{return!!GM_getValue(w,!1)}catch{return!1}}function fs(t){return GM_setValue(w,!!t),!!t}function Pa(){try{return GM_getValue(x,"tab")==="direct"}catch{return!1}}function gs(t){return GM_setValue(x,t==="direct"?"direct":"tab"),t==="direct"?"direct":"tab"}function Ce(){try{let t=GM_getValue(E,!0);return t!==!1&&t!==0&&t!=="0"}catch{return!0}}function xs(t){return GM_setValue(E,!!t),!!t}function za(){try{return!!GM_getValue(c,!1)}catch{return!1}}function ys(t){return GM_setValue(c,!!t),!!t}function Fr(t,e){try{let r=GM_getValue(t,"");if(r&&typeof r=="object")return r;if(typeof r=="string"&&r.trim())return JSON.parse(r)}catch{}return e}function Dr(t,e){return GM_setValue(t,JSON.stringify(e)),e}function Pe(){return Mo(Fr(D,null))}function La(t){return Dr(D,Mo(t))}function Oe(){return $r(Fr($,null))}function Uo(t){return Dr($,$r(t))}function qa(){let t=Fr(j,{});return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}function Wo(t,e){if(!t||!/^\d{4}-\d{2}-\d{2}$/.test(String(e||"")))return;let r=qa();r[String(t)]=String(e),Dr(j,r)}function jr(){let t="";try{t=GM_getValue(G,"")}catch{}let e=!!(t&&(typeof t!="string"||t.trim())),r=Fr(G,null);try{if(e&&(!r||typeof r!="object"||Array.isArray(r)))throw new Error("配置不是 JSON 对象");let a=r&&typeof r=="object"?r:{},p={enabled:!!a.enabled,mapping:Fe(a.mapping||Tr)};return rt="",p}catch{return rt=e?"JSON 映射配置损坏，已回退小爱课程兼容格式":"",{enabled:!1,mapping:Fe(Tr)}}}function Go(t){let e=t&&typeof t=="object"?t:{},r={enabled:!!e.enabled,mapping:Fe(e.mapping||Tr)};return rt="",Dr(G,r)}function Or(){try{let t=String(location.pathname||"").replace(/\/+$/,"")||"/";return t==="/"||t==="/index"||/\/index\.html?$/i.test(t)}catch{return!1}}function Rr(){try{return!!GM_getValue(z,!1)}catch{return!1}}function Ta(t){return GM_setValue(z,!!t),!!t}function vs(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch{return!1}}function xe(){return vs()&&Re()?"dark":Rr()&&He()?"scu-red":"default"}function dr(t,e){return t==="dark"?Re(e):t==="scu-red"?He(e):t==="default"}function Jt(t,e){e=e||{},!Re()&&te()&&Br(!1),!He()&&Rr()&&Ta(!1),e.manual&&Br(!1);let r;e.system||te()&&!e.manual?r=xe():(r=Pt[t]?t:Qt()||"default",Pt[r]||(r="default")),dr(r)||(r="default");let a=Pt[r]||Pt.default;e.skipPersist||GM_setValue(v,r),ge();let p=document.getElementById("urppp-theme-vars")||(()=>{let A=document.createElement("style");return A.id="urppp-theme-vars",(document.head||document.documentElement).appendChild(A),A})(),i=Xt(),l=Object.assign({},a.vars);if(r==="scu-red"){let A=i||bt,T=je();l=Object.assign(l,Nt(A,T));let N=l["--primary"]||A,I=l["--primary-hover"]||ko(N,.12);document.documentElement.style.setProperty("--urppp-accent",N),document.documentElement.style.setProperty("--urppp-accent-hover",I),document.documentElement.style.setProperty("--urppp-accent-ring",l["--ring"]||_e(N,.15)),document.documentElement.style.setProperty("--urppp-seed",A),document.documentElement.style.setProperty("--urppp-scheme",T)}else r==="default"?(document.documentElement.style.setProperty("--urppp-accent","#0071E3"),document.documentElement.style.setProperty("--urppp-accent-hover","#0077ED"),document.documentElement.style.setProperty("--urppp-accent-ring","rgba(0,113,227,0.28)"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme")):(document.documentElement.style.removeProperty("--urppp-accent"),document.documentElement.style.removeProperty("--urppp-accent-hover"),document.documentElement.style.removeProperty("--urppp-accent-ring"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme"));let b=":root {";for(let[A,T]of Object.entries(l))b+=`${A}:${T};`;b+="}",p.textContent=b,document.body&&(document.body.style.fontFamily=a.font);try{let A=document.documentElement;A.dataset.urpppTheme=r,A.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),A.classList.add("urppp-theme-"+r),A.classList.toggle("urppp-theme-follow",te()),document.body&&(document.body.dataset.urpppTheme=r,document.body.classList.toggle("urppp-dark",r==="dark"),document.body.classList.toggle("urppp-theme-follow",te()))}catch{}try{oe()}catch{}try{xt()}catch{}try{jt()}catch{}try{hn()}catch{}try{Ls()}catch{}let m=document.getElementById("urppp-boot-loader");m&&(m.style.fontFamily=a.font)}function Qt(){return GM_getValue(v,"default")}function de(t){try{return!!GM_getValue("urppp_theme_css_"+t,"")}catch{return!1}}function ye(){try{let t=GM_getValue("urppp_local_themes","");return t?JSON.parse(t)||{}:{}}catch{return{}}}function Jo(t,e){try{let r=ye();r[t]=e,GM_setValue("urppp_local_themes",JSON.stringify(r))}catch{}}function ws(t){try{let e=ye();delete e[t],GM_setValue("urppp_local_themes",JSON.stringify(e))}catch{}}function ks(){try{if(typeof GM_listValues!="function")return;let t=ye(),e=!1;GM_listValues().forEach(r=>{let a=/^urppp_theme_css_(.+)$/.exec(r);if(!a)return;let p=a[1],i="";try{i=GM_getValue(r,"")||""}catch{}i&&(u.some(l=>l.id===p)||t[p]||(t[p]={name:p,desc:"下载主题",author:"",version:"1.0.0"},e=!0))}),e&&GM_setValue("urppp_local_themes",JSON.stringify(t))}catch{}}function Ma(t){let e=document.getElementById("urppp-store-theme-"+t);return e||(e=document.createElement("style"),e.id="urppp-store-theme-"+t,e.dataset.urpppStoreTheme=t,(document.head||document.documentElement).appendChild(e)),e}function As(t){let e=document.getElementById("urppp-store-theme-"+t);e&&e.remove()}function Vo(){ks();let t=new Set,e=r=>{if(t.has(r))return;t.add(r);let a="";try{a=GM_getValue("urppp_theme_css_"+r,"")||""}catch{}a&&(Ma(r).textContent=a);let p="";try{p=GM_getValue("urppp_card_css_"+r,"")||""}catch{}p&&ze([{id:r,cardCss:p}])};u.forEach(r=>e(r.id)),Object.keys(ye()).forEach(r=>e(r));try{oe()}catch{}}function re(){let t=GM_getValue(d,"apple"),e=u.find(a=>a.id===t);return e&&e.ready&&(e.installed!==!1||de(e.id))||ye()[t]&&de(t)?t:"apple"}function Ia(t,e){let r=t||re(),a=u.find(p=>p.id===r);return!!(a&&a[e])}function Re(t){return Ia(t,"dark")}function He(t){return Ia(t,"dynamic")}function Yo(t){return Ia(t,"palettes")}function ur(t){return Y.find(e=>e.id===t)||Y[0]}function Qo(){let t=String(GM_getValue(M,"acid")||"acid"),e=ur(t);return e.id===J?ur("acid"):e}function Ko(){let t=String(GM_getValue(q,J)||J);return ur(t)}function Zo(t,e){let r=e||{},a=ur(t);r.select&&a.id!==J&&GM_setValue(M,a.id),GM_setValue(q,a.id);try{oe()}catch{}try{xt()}catch{}try{jt()}catch{}try{let p=document.getElementById("urppp-clean-root");p&&typeof p.__syncCleanThemeDots=="function"&&p.__syncCleanThemeDots()}catch{}}function Ss(t){let e=t||re();return e==="flat"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"2px","--urppp-card-border":"2px solid var(--text)","--urppp-input-border":"2px solid var(--text)","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:e==="organic"?{"--radius":"22px","--radius-sm":"14px","--shadow":"0 2px 10px rgba(92,64,51,0.06)","--border-w":"1px","--urppp-card-border":"1px solid #E7E0D6","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"1px solid var(--border)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--input-bg)","--urppp-action-color":"var(--primary)","--urppp-menu-radius":"14px","--urppp-menu-border":"1px solid var(--border)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}:e==="editorial"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"none","--urppp-action-radius":"0px","--urppp-action-border":"none","--urppp-action-shadow":"none","--urppp-action-bg":"transparent","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"1px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"transparent","--urppp-menu-color":"var(--text)"}:e==="brutal"?{"--radius":"0px","--radius-sm":"0px","--shadow":"6px 6px 0 #000","--border-w":"3px","--urppp-card-border":"3px solid #000","--urppp-input-border":"2px solid #000","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"3px 3px 0 var(--text)","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"3px 3px 0 var(--text)","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:e==="neu"?{"--radius":"16px","--radius-sm":"12px","--shadow":"5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"1px solid rgba(38,49,66,.16)","--urppp-input-shadow":"inset 2px 2px 4px rgba(38,49,66,.16), inset -2px -2px 4px rgba(255,255,255,.72)","--urppp-action-radius":"12px","--urppp-action-border":"none","--urppp-action-shadow":"var(--shadow)","--urppp-action-bg":"var(--bg)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"12px","--urppp-menu-border":"none","--urppp-menu-shadow":"var(--shadow)","--urppp-menu-bg":"var(--bg)","--urppp-menu-color":"var(--text)"}:{"--radius":"18px","--radius-sm":"12px","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--border-w":"0px","--urppp-card-border":e==="apple"&&Ce()?"1px solid rgba(0,0,0,0.08)":"none","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"none","--urppp-action-shadow":"0 2px 6px var(--ring)","--urppp-action-bg":"var(--primary)","--urppp-action-color":"var(--surface)","--urppp-menu-radius":"12px","--urppp-menu-border":e==="apple"&&Ce()?"1px solid var(--border)":"none","--urppp-menu-shadow":"0 1px 3px rgba(0,0,0,.08)","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}}function Ue(){try{let t=re();if(t==="apple")return Ce()?"1px solid rgba(0,0,0,0.08)":"none";if(t==="flat")return"2px solid var(--text)";if(t==="organic")return"1px solid #E7E0D6";if(t==="brutal")return"3px solid var(--text)";if(t==="editorial"||t==="neu")return"none"}catch{}return"1px solid var(--border)"}function oe(){let t=re();try{document.documentElement.setAttribute("data-urppp-skin",t)}catch{}try{document.body&&document.body.setAttribute("data-urppp-skin",t)}catch{}try{let e=t==="apple"&&Ce();document.documentElement.setAttribute("data-urppp-apple-edge",e?"1":"0"),document.body&&document.body.setAttribute("data-urppp-apple-edge",e?"1":"0")}catch{}try{let e=document.getElementById("urppp-skin-vars")||(()=>{let i=document.createElement("style");return i.id="urppp-skin-vars",(document.head||document.documentElement).appendChild(i),i})(),r=Ss(t),a=":root, html[data-urppp-skin] {";if(Object.keys(r).forEach(i=>{a+=i+":"+r[i]+";"}),a+="}",a+=".urppp-nav-dot.urppp-theme-disabled{opacity:.42!important;cursor:not-allowed!important;box-shadow:none!important;filter:grayscale(1)!important;transform:none!important;}",t==="flat"||t==="organic"||t==="brutal"||t==="neu"){if(t==="brutal"){let i=Ko();a+='html[data-urppp-skin="brutal"]{--brutal-accent:'+i.accent+";--brutal-secondary:"+i.secondary+";--brutal-info:"+i.info+";--brutal-warning:"+i.warning+";}"}e.textContent=a;return}if(t==="apple"){let i=Ce(),l=i?"1px solid rgba(0,0,0,0.08)":"none",b=i?"1px solid rgba(255,255,255,0.10)":"none",m=i?"1px solid rgba(0,0,0,0.06)":"none";a+=['html[data-urppp-skin="apple"]{--shadow:0 6px 20px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);--border:'+(i?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.04)")+";}",'html[data-urppp-skin="apple"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="apple"]{--shadow:0 10px 28px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.04);--border:'+(i?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)")+";}",'html[data-urppp-skin="apple"] .widget-box,html[data-urppp-skin="apple"] .widget-box.transparent,html[data-urppp-skin="apple"] .panel,html[data-urppp-skin="apple"] .panel-default,html[data-urppp-skin="apple"] .well,html[data-urppp-skin="apple"] .thumbnail,html[data-urppp-skin="apple"] .infobox,html[data-urppp-skin="apple"] .profile-user-info,html[data-urppp-skin="apple"] .profile-user-info-striped,html[data-urppp-skin="apple"] .modal-content,html[data-urppp-skin="apple"] fieldset,html[data-urppp-skin="apple"] .urppp-stat-card,html[data-urppp-skin="apple"] .urppp-db-card,html[data-urppp-skin="apple"] .urppp-db-panel,html[data-urppp-skin="apple"] #urppp-dashboard .widget-box,html[data-urppp-skin="apple"] #urppp-root .uc,html[data-urppp-skin="apple"] #urppp-clean-root .uc-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-modal,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top,html[data-urppp-skin="apple"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="apple"] .urppp-card,html[data-urppp-skin="apple"] #urppp-dashboard .urppp-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+l+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"].urppp-theme-dark .widget-box,html[data-urppp-skin="apple"].urppp-theme-dark .panel,html[data-urppp-skin="apple"].urppp-theme-dark .profile-user-info,html[data-urppp-skin="apple"].urppp-theme-dark .modal-content,html[data-urppp-skin="apple"].urppp-theme-dark .urppp-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-root .uc{border:'+b+"!important;}",'html[data-urppp-skin="apple"] .page-content .widget-box,html[data-urppp-skin="apple"] #page-content-template .widget-box,html[data-urppp-skin="apple"] html body .page-content .profile-user-info.setLabelWidth{border:'+l+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"] .btn,html[data-urppp-skin="apple"] .btn-default,html[data-urppp-skin="apple"] .btn-white,html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] .btn-success,html[data-urppp-skin="apple"] .btn-warning,html[data-urppp-skin="apple"] .btn-danger,html[data-urppp-skin="apple"] a.btn,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn{border-color:transparent!important;box-shadow:0 1px 2px rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn.primary{border:none!important;}','html[data-urppp-skin="apple"] .table,html[data-urppp-skin="apple"] table,html[data-urppp-skin="apple"] .table-bordered,html[data-urppp-skin="apple"] .table-bordered>thead>tr>th,html[data-urppp-skin="apple"] .table-bordered>tbody>tr>td{border-color:rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"].urppp-theme-dark .table,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>thead>tr>th,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>tbody>tr>td{border-color:rgba(255,255,255,.06)!important;}','html[data-urppp-skin="apple"] .nav-tabs>li>a,html[data-urppp-skin="apple"] .nav-tabs{border-color:transparent!important;}','html[data-urppp-skin="apple"] .urppp-nav-link{border:none!important;}','html[data-urppp-skin="apple"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="apple"] #urppp-clean-root .uc-grid-cell{border-color:'+(i?"rgba(0,0,0,0.06)":"transparent")+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+m+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-dots span{border-radius:50%!important;border:2px solid var(--border)!important;box-shadow:none!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important;background-clip:padding-box!important;flex:0 0 auto!important;}','html[data-urppp-skin="apple"] .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary)!important;box-shadow:0 0 0 3px var(--ring)!important;}','html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-dots span[data-theme="scu-red"]{border-radius:50%!important;border:2px solid var(--border)!important;}'].join("")}else t==="editorial"&&(a+=`
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
        `);e.textContent=a;let p=document.head||document.documentElement;e.parentNode===p&&p.lastElementChild!==e&&p.appendChild(e)}catch(e){try{console.warn("[URP++] applySkinAttr",e)}catch{}}setTimeout(()=>{try{Zt(document)}catch{}},0)}function Xo(t){let e=u.find(p=>p.id===t&&p.ready&&(p.installed!==!1||de(p.id))),r=!e&&ye()[t]&&de(t)?{id:t,ready:!0,installed:!1}:null,a=e||r;if(!a)return!1;GM_setValue(d,a.id);try{a.dynamic||Ta(!1),!a.dark&&te()&&Br(!1);let p=te(),i=p?xe():Qt(),l=dr(i,e.id)?i:"default";oe(),Jt(l,{system:p})}catch{try{oe()}catch{}}try{jt()}catch{}try{xt()}catch{}try{let p=document.getElementById("urppp-clean-root");p&&typeof p.__syncCleanThemeDots=="function"&&p.__syncCleanThemeDots()}catch{}return!0}function _s(){if(!window.__urpppSystemThemeBound&&window.matchMedia){window.__urpppSystemThemeBound=!0;try{let t=window.matchMedia("(prefers-color-scheme: dark)"),e=()=>{if(te())try{Jt(xe(),{system:!0})}catch{}};t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}catch{}}}try{te()?Jt(xe(),{system:!0}):Jt(Qt())}catch{}try{oe()}catch{}try{_s()}catch{}function Es(t){let e=String(document.body&&document.body.innerText||t&&t.innerText||"").replace(/\s+/g," ").trim(),r=[/token\s*校验失败[！!]?/i,/令牌\s*校验失败[！!]?/i,/验证码.{0,12}(?:错误|失败|过期)[！!]?/i,/(?:用户名|账号|学号).{0,12}(?:密码).{0,12}(?:错误|失败)[！!]?/i,/登录.{0,12}(?:错误|失败)[！!]?/i];for(let a of r){let p=e.match(a);if(p)return p[0].trim()}return""}function tn(){let t=location.pathname,e=document.getElementById("formContent"),r=document.querySelector(".form-signin");if(!e||!r){setTimeout(tn,50);return}if(e.querySelector(":scope > #urppp-root"))return;let a=Es(e),p=r.querySelector('a[onclick*="toModifyPwd"]'),i=(()=>{let H=e.querySelector(".fadeIn.first svg");return H?H.outerHTML:""})(),l=(()=>{let H=document.querySelector("#tocas a");return H?H.href:"https://id.scu.edu.cn/"})();for(let H of e.children)H.style.display="none";e.style.cssText="max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;";let b=location.pathname==="/loginEn",m=(H,F)=>b?F:H;e.insertAdjacentHTML("afterbegin",`
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

        ${a?`<div class="urppp-login-error" role="alert">${X(a)}</div>`:""}

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
    </div>`);let A=e.querySelector("#urppp-root");[["#urppp-user","#input_username"],["#urppp-pass","#input_password"],["#urppp-cap","#input_checkcode"]].forEach(([H,F])=>{let Z=A.querySelector(H),ut=document.querySelector(F);Z&&ut&&(ut.value&&(Z.value=ut.value),Z.addEventListener("input",()=>{ut.value=Z.value}))});let T=A.querySelector("#urppp-capimg"),N=A.querySelector("#urppp-capwrap"),I=document.querySelector(".form-signin img");if(T&&I){T.src=I.src;let H=()=>{let F=I.src.replace(/\?.*/,"")+"?"+Date.now();I.src=F,T.src=F};N?N.addEventListener("click",H):T.addEventListener("click",H)}A.querySelectorAll(".ut button").forEach(H=>{H.addEventListener("click",()=>{if(H.dataset.mode==="sso"){location.href=l;return}A.querySelectorAll(".ut button").forEach(ut=>ut.classList.remove("ac")),H.classList.add("ac");let F=A.querySelector("#urppp-form"),Z=A.querySelector("#urppp-sso");F&&(F.style.display="block"),Z&&(Z.style.display="none")})});let O=A.querySelector("#urppp-submit");O.addEventListener("click",()=>{if(O.dataset.submitting==="1")return;O.dataset.submitting="1",O.disabled=!0;let H=document.getElementById("loginButton");H?H.click():typeof r.requestSubmit=="function"?r.requestSubmit():r.submit(),setTimeout(()=>{O.dataset.submitting="0",O.disabled=!1},1500)}),A.querySelectorAll(".ui").forEach(H=>{H.addEventListener("keydown",F=>{F.key==="Enter"&&O.click()})}),A.querySelector("#urppp-forgot").addEventListener("click",H=>{H.preventDefault(),p&&p.click()});let Q=A.querySelector("#urppp-dots"),R=()=>{if(!Q)return;let H=Qt();Q.querySelectorAll("span").forEach(Z=>{Z.classList.toggle("ac",Z.dataset.theme===H)});let F=Q.querySelector('span[data-theme="scu-red"]');if(F){let Z=Xt()||bt;try{let ut=ee(Z,je());F.style.background="linear-gradient(135deg, "+ut.primary+" 0 55%, "+ut.surface+" 55% 100%)"}catch{F.style.background=Z}}};Q&&(Q.querySelectorAll("span").forEach(H=>{H.addEventListener("click",()=>{Jt(H.dataset.theme,{manual:!0}),R()})}),R()),console.log("[URP++] 登录界面已重建"),setTimeout(()=>{document.body.classList.add("urppp-ready"),kt()},100)}let{beautifyBreadcrumbs:Hr}=ds({});function $a(){try{document.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(t=>{if(t.classList.contains("setLabelWidth")||t.classList.contains("urppp-query-form")||t.querySelector(".urppp-query-pair"))return;let e=Array.from(t.querySelectorAll(":scope > .profile-info-row, .profile-info-row"));!e.length||e.some(a=>Array.from(a.children).filter(p=>p.classList&&p.classList.contains("profile-info-name")).length>=2)||(t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("display","block","important"),Gr(t),e.forEach(a=>{a.classList.remove("urppp-query-row","urppp-dual-pair"),delete a.dataset.urpppQueryDone,delete a.dataset.urpppQueryCols;let p=Array.from(a.querySelectorAll(":scope > .urppp-query-pair"));if(p.length){let i=[];for(p.forEach(l=>Array.from(l.children).forEach(b=>i.push(b)));a.firstChild;)a.removeChild(a.firstChild);i.forEach(l=>a.appendChild(l))}a.style.setProperty("display","grid","important"),a.style.setProperty("grid-template-columns","140px minmax(0,1fr)","important"),a.style.setProperty("align-items","stretch","important"),a.style.setProperty("width","100%","important"),Array.from(a.children).forEach(i=>{i.classList&&(i.style.setProperty("float","none","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("box-sizing","border-box","important"))})}))})}catch(t){console.warn("[URP++] single pair profile fix failed",t)}}function Ur(){let t=document.querySelector(".page-content")||document.getElementById("page-content-template");t&&(t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(e=>{if(!e.querySelector(".setLabelWidth"))return;let r=e.querySelector(".setLabelWidth");r&&(e.querySelectorAll("h4.header, h3.header, .header.smaller, .header").forEach(a=>{r.contains(a)||a.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING&&(a.classList.add("urppp-section-label"),["background","background-color","background-image","border","box-shadow","border-radius","padding","margin","min-height"].forEach(p=>{a.style.removeProperty(p)}),a.style.setProperty("background","transparent","important"),a.style.setProperty("background-color","transparent","important"),a.style.setProperty("background-image","none","important"),a.style.setProperty("border","0 none transparent","important"),a.style.setProperty("box-shadow","none","important"),a.style.setProperty("border-radius","0","important"),a.style.setProperty("padding","4px 2px 10px","important"),a.style.setProperty("margin","0 0 8px 0","important"),a.style.setProperty("min-height","0","important"))}),r.classList.remove("urppp-query-form"),r.style.setProperty("padding","0","important"),r.style.setProperty("overflow","hidden","important"),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("border",Ue(),"important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("box-shadow","none","important"))}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(e=>{e.classList.remove("urppp-query-form"),e.querySelectorAll(".profile-info-row").forEach(r=>{r.classList.remove("urppp-query-row"),delete r.dataset.urpppQueryDone,delete r.dataset.urpppQueryCols;let a=Array.from(r.querySelectorAll(":scope > .urppp-query-pair"));if(a.length){let p=[];for(a.forEach(i=>{Array.from(i.children).forEach(l=>p.push(l))});r.firstChild;)r.removeChild(r.firstChild);p.forEach(i=>r.appendChild(i))}})}),t.querySelectorAll(".setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row").forEach(e=>{let r=Array.from(e.querySelectorAll(":scope > .urppp-query-pair"));if(r.length){let i=[];for(r.forEach(l=>{Array.from(l.children).forEach(b=>i.push(b))});e.firstChild;)e.removeChild(e.firstChild);i.forEach(l=>e.appendChild(l))}e.classList.remove("urppp-query-row"),delete e.dataset.urpppQueryDone,delete e.dataset.urpppQueryCols;let a=Array.from(e.children).filter(i=>i.classList&&(i.classList.contains("profile-info-name")||i.classList.contains("profile-info-value")));a.filter(i=>i.classList.contains("profile-info-name")).length>=2?(e.classList.add("urppp-dual-pair"),e.style.setProperty("display","grid","important"),e.style.setProperty("grid-template-columns","112px minmax(140px,1fr) 112px minmax(140px,1fr)","important"),e.style.setProperty("align-items","stretch","important"),e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("float","none","important"),a.forEach(i=>{i.style.setProperty("float","none","important"),i.style.setProperty("clear","none","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("min-width","0","important"),i.style.setProperty("box-sizing","border-box","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.classList.contains("profile-info-value")?(i.style.removeProperty("width"),i.style.setProperty("width","auto","important"),i.style.setProperty("justify-content","flex-start","important"),i.style.setProperty("white-space","normal","important"),i.style.setProperty("word-break","normal","important")):(i.style.setProperty("justify-content","flex-end","important"),i.style.setProperty("white-space","nowrap","important"))})):e.classList.remove("urppp-dual-pair")}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(e=>{e.classList.remove("urppp-query-form"),e.style.cssText=(e.getAttribute("style")||"").replace(/padding\s*:[^;]+;?/gi,""),e.style.setProperty("background","var(--surface)","important"),e.style.setProperty("border-radius","12px","important"),e.style.setProperty("overflow","hidden","important"),e.style.setProperty("border",Ue(),"important"),e.style.setProperty("box-shadow","none","important"),e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("box-sizing","border-box","important"),e.style.setProperty("margin","0 0 16px 0","important"),e.style.setProperty("padding","0","important");let r=e.closest(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8")||e.parentElement;r&&Array.from(r.querySelectorAll("h4.header, h3.header, .header.smaller")).forEach(a=>{e.contains(a)||a.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING&&(a.classList.add("urppp-section-label"),a.style.setProperty("background","transparent","important"),a.style.setProperty("background-color","transparent","important"),a.style.setProperty("background-image","none","important"),a.style.setProperty("border","0 none transparent","important"),a.style.setProperty("box-shadow","none","important"),a.style.setProperty("border-radius","0","important"),a.style.setProperty("padding","4px 2px 10px","important"),a.style.setProperty("margin","0 0 8px 0","important"),a.style.setProperty("min-height","0","important"))})}),t.querySelectorAll(".urppp-col-row").forEach(e=>{e.classList.remove("urppp-col-row"),["display","flex-wrap","gap","align-items","width","box-sizing"].forEach(r=>e.style.removeProperty(r))}),t.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach(e=>{["float","flex","width","max-width","padding-left","padding-right","box-sizing"].forEach(r=>{e.style.getPropertyPriority(r)==="important"&&e.style.removeProperty(r)}),e.style.setProperty("padding-left","0","important"),e.style.setProperty("box-sizing","border-box","important")}),t.querySelectorAll(".col-xs-4, .col-sm-4, .col-md-4").forEach(e=>{e.style.setProperty("padding-right","16px","important")}),t.querySelectorAll(".col-xs-8, .col-sm-8, .col-md-8").forEach(e=>{e.style.setProperty("padding-left","0","important"),e.style.setProperty("padding-right","0","important")}),t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(e=>{e.querySelector(".setLabelWidth")&&e.querySelectorAll(":scope > h4.header, :scope > .header, :scope > .header.smaller").forEach(r=>{r.style.cssText+=";background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;border-radius:0!important;padding:4px 2px 10px!important;margin:0 0 8px 0!important;min-height:0!important;"})}),t.querySelectorAll(".urppp-section-title-wrap").forEach(e=>{let r=e.querySelector("h4.header, h3.header, h5.header, .header.smaller");if(!r){e.remove();return}let a=e.nextElementSibling;for(;a&&!a.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]');)a=a.nextElementSibling;let p=a&&(a.querySelector(".col-xs-4, .col-sm-4, .col-md-4")||Array.from(a.children).find(i=>/col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(i.className||"")));p&&(p.insertBefore(r,p.firstChild),delete r.dataset.urpppHoisted,r.style.removeProperty("width"),r.style.removeProperty("max-width"),r.style.removeProperty("margin-left"),r.style.removeProperty("margin-right"),r.style.removeProperty("box-sizing"),r.style.removeProperty("position"),r.style.removeProperty("left")),e.remove()}))}function Wr(){let t=typeof unsafeWindow<"u"?unsafeWindow:window;return t.jQuery||t.$||window.jQuery||window.$||null}function Cs(t){return t?t.id&&String(t.id).indexOf("pagination_pageSize_")===0?!0:!!(t.closest&&t.closest('#urppagebar, .urppagebreak, .dataTables_paginate, [id^="sample-table-2_paginate_"]')):!1}function en(t){if(t){try{let e=Wr();e&&e.fn&&e(t).data("chosen")&&e(t).chosen("destroy")}catch{}try{if(t.parentElement&&t.parentElement.querySelectorAll(":scope > .chosen-container").forEach(e=>{try{e.remove()}catch{}}),t.nextElementSibling&&t.nextElementSibling.classList.contains("chosen-container"))try{t.nextElementSibling.remove()}catch{}}catch{}t.classList.remove("urppp-chosen-hidden","chzn-done","chosen");try{delete t.dataset.urpppChosen}catch{}t.style.setProperty("display","inline-block","important")}}let rn=0,an=!1;function Ps(){if(an)return;an=!0;let t=e=>{if(Date.now()<rn){try{e.preventDefault()}catch{}try{e.stopPropagation()}catch{}}};document.addEventListener("mousedown",t,!0),document.addEventListener("mouseup",t,!0),document.addEventListener("click",t,!0)}function Na(t){if(!t||t.__urpppChosenNoPierce)return;t.__urpppChosenNoPierce=!0,Ps();let e=t.querySelector(".chosen-drop"),r=a=>{let p=a.target;!p||!p.closest||!p.closest(".chosen-results li")||(rn=Date.now()+350)};t.addEventListener("mouseup",r,!1),t.addEventListener("touchend",r,!1),e&&(e.addEventListener("mouseup",r,!1),e.addEventListener("touchend",r,!1))}function Ba(t=document){try{t.querySelectorAll(".chosen-container").forEach(Na)}catch{}}function ve(){try{let t=Wr();if(!t||!t.fn||typeof t.fn.chosen!="function")return!1;let e=document.querySelectorAll(".profile-user-info, .urppp-query-form, .profile-info-row, form"),r=new Set,a=[];if(e.forEach(p=>{p.querySelectorAll("select").forEach(i=>{r.has(i)||(r.add(i),a.push(i))})}),document.querySelectorAll("select.value_element, .profile-info-value > select").forEach(p=>{r.has(p)||(r.add(p),a.push(p))}),a.forEach(p=>{if(!p||p.multiple||p.disabled||p.size&&p.size>1)return;if(Cs(p)){en(p);return}let i=t(p);if(!!i.data("chosen")||p.classList.contains("chzn-done")||!!(p.nextElementSibling&&p.nextElementSibling.classList.contains("chosen-container"))||!!(p.parentElement&&p.parentElement.querySelector(":scope > .chosen-container"))){p.dataset.urpppChosen="1",p.classList.add("urppp-chosen-hidden"),p.style.setProperty("display","none","important");let b=p.nextElementSibling&&p.nextElementSibling.classList.contains("chosen-container")?p.nextElementSibling:p.parentElement&&p.parentElement.querySelector(":scope > .chosen-container");b&&Na(b);return}try{p.classList.contains("select")||p.classList.add("select");try{i.data("chosen")&&i.chosen("destroy")}catch{}i.chosen({allow_single_deselect:!0,search_contains:!0,width:"100%",no_results_text:"无匹配项",disable_search_threshold:0}),p.dataset.urpppChosen="1",p.classList.add("urppp-chosen-hidden"),p.style.setProperty("display","none","important");let b=p.nextElementSibling&&p.nextElementSibling.classList.contains("chosen-container")?p.nextElementSibling:p.parentElement&&p.parentElement.querySelector(".chosen-container");b&&(b.style.setProperty("width","100%","important"),b.style.setProperty("min-width","0","important"),b.style.setProperty("display","block","important")),b&&Na(b)}catch(b){console.warn("[URP++] chosen init failed",p,b)}}),!window.__urpppChosenHtmlPatch){window.__urpppChosenHtmlPatch=!0;let p=t.fn.html;t.fn.html=function(){let i=p.apply(this,arguments);if(arguments.length)try{this.filter("select").add(this.find("select")).each(function(){let l=t(this);if(l.data("chosen")||l.next(".chosen-container").length)try{l.trigger("chosen:updated")}catch{}})}catch{}return i}}return!0}catch(t){return console.warn("[URP++] ensureQueryChosen failed",t),!1}}function on(){if(window.__urpppChosenScheduleBound)return;window.__urpppChosenScheduleBound=!0,[0,200,600,1500,3e3].forEach(a=>setTimeout(()=>{ve(),Ba()},a));let e=0,r=setInterval(()=>{e+=1;let a=ve();Ba(),(a&&e>3||e>15)&&clearInterval(r)},500)}let{beautifyPagebar:nn}=wi({destroyPagebarChosen:en}),{scheduleBeautifyPagebar:pn}=vi({beautifyPagebar:nn});function Fa(){try{document.querySelectorAll("#drag-ul, ul#drag-ul").forEach(t=>{if(!t)return;let e=Array.from(t.children).filter(r=>r.tagName==="LI");if(!e.length){t.classList.add("urppp-empty"),t.style.setProperty("display","none","important");let r=t.closest("#xq-section, .widget-main, .widget-body");r&&!r.querySelector("li")&&(r.classList.add("urppp-empty"),r.style.setProperty("display","none","important"));return}t.classList.remove("urppp-empty"),t.classList.add("urppp-drag-ul"),t.style.removeProperty("display"),t.style.setProperty("height","auto","important"),t.style.setProperty("min-height","0","important"),e.forEach(r=>{let a=(r.textContent||"").replace(/\s+/g," ").trim(),p=(r.getAttribute("onclick")||"").includes("goDetail")||r.classList.contains("ui-selectee")||r.classList.contains("jc-future")||!!r.querySelector("a");!p&&/校区/.test(a)&&a.length<=12?(r.classList.add("xq-section"),r.classList.remove("ui-selectee","jc-future","urppp-building-active")):p&&!r.classList.contains("jc-future")&&r.classList.add("ui-selectee")})}),window.__urpppBuildingActiveBound||(window.__urpppBuildingActiveBound=!0,document.addEventListener("click",t=>{let e=t.target&&t.target.closest?t.target.closest("#drag-ul > li"):null;if(!e||e.classList.contains("xq-section")||e.classList.contains("jc-future"))return;let r=e.parentElement;r&&(r.querySelectorAll("li.urppp-building-active, li.ui-selected").forEach(a=>{a.classList.remove("urppp-building-active","ui-selected")}),e.classList.add("urppp-building-active","ui-selected"))},!0))}catch(t){console.warn("[URP++] free classroom list beautify failed",t)}}function Gr(t){if(!t||!t.style)return;if(t.classList.contains("setLabelWidth")){t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",Ue(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 16px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important");return}let e=!!(t.closest&&t.closest(".widget-box, .widget-main, .widget-body, .panel"));t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("min-width","0","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("clear","both","important");let r=t.parentElement&&t.parentElement.tagName==="FORM"?t.parentElement:null;r&&(r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("display","block","important"),r.style.setProperty("float","none","important"),r.style.setProperty("box-sizing","border-box","important"),r.style.setProperty("margin","0","important"));let a=t.closest&&t.closest(".tab-pane, .tab-content");if(a&&(a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("box-sizing","border-box","important")),e){t.style.setProperty("background","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("margin","0","important"),t.style.setProperty("box-shadow","none","important");return}t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",Ue(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 18px 0","important"),!t.classList.contains("setLabelWidth")&&(t.classList.contains("urppp-query-form")||!!t.querySelector(".urppp-query-pair, .chosen-container"))?(t.style.setProperty("padding","14px 16px","important"),t.style.setProperty("overflow","visible","important")):(t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important"))}function mr(){try{ve(),document.querySelectorAll(".page-content .profile-user-info, #page-content-template .profile-user-info").forEach(a=>{Gr(a)});let t=a=>{let p=a.closest(".profile-user-info, .urppp-query-form")||a.parentElement;if(!p)return Math.min(Math.max(a.querySelectorAll(":scope > .urppp-query-pair").length,1),4);let i=0;return p.querySelectorAll(":scope > .profile-info-row, .profile-info-row").forEach(l=>{let b=l.querySelectorAll(":scope > .urppp-query-pair").length;b>i&&(i=b)}),Math.min(Math.max(i,1),4)},e=a=>{let p=Array.from(a.querySelectorAll(":scope > .urppp-query-pair")),i=t(a);a.classList.add("urppp-query-row"),a.style.setProperty("display","grid","important"),a.style.removeProperty("grid-template-columns"),a.style.setProperty("column-gap","14px","important"),a.style.setProperty("row-gap","10px","important"),a.style.setProperty("align-items","center","important"),a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("box-sizing","border-box","important"),a.dataset.urpppQueryCols=String(i),p.forEach(l=>{l.style.removeProperty("grid-column")}),p.forEach(l=>{l.style.setProperty("display","flex","important"),l.style.setProperty("align-items","center","important"),l.style.setProperty("width","100%","important"),l.style.setProperty("min-width","0","important"),l.style.setProperty("max-width","100%","important"),l.style.setProperty("box-sizing","border-box","important"),l.style.removeProperty("flex");let b=l.querySelector(".profile-info-name"),m=l.querySelector(".profile-info-value");b&&(b.style.setProperty("float","none","important"),b.style.setProperty("display","flex","important"),b.style.setProperty("align-items","center","important"),b.style.setProperty("justify-content","flex-end","important"),b.style.setProperty("flex","0 0 var(--urppp-qlabel, 84px)","important"),b.style.setProperty("width","var(--urppp-qlabel, 84px)","important"),b.style.setProperty("min-width","var(--urppp-qlabel, 84px)","important"),b.style.setProperty("max-width","var(--urppp-qlabel-max, 96px)","important"),b.style.setProperty("margin","0","important"),b.style.setProperty("margin-left","0","important"),b.style.setProperty("padding","0 8px 0 0","important"),b.style.setProperty("background","transparent","important"),b.style.setProperty("border","none","important"),b.style.setProperty("border-right","none","important")),m&&(m.style.setProperty("float","none","important"),m.style.setProperty("display","flex","important"),m.style.setProperty("align-items","center","important"),m.style.setProperty("flex","1 1 auto","important"),m.style.setProperty("width","auto","important"),m.style.setProperty("min-width","0","important"),m.style.setProperty("max-width","none","important"),m.style.setProperty("margin","0","important"),m.style.setProperty("margin-left","0","important"),m.style.setProperty("padding","0","important"),m.style.setProperty("background","transparent","important"),m.style.setProperty("border","none","important"),m.querySelectorAll("input, select, .chosen-container, .form-control").forEach(A=>{A.style.setProperty("width","100%","important"),A.style.setProperty("min-width","0","important"),A.style.setProperty("max-width","none","important")})),l.querySelectorAll(".chosen-container").forEach(A=>{let T=A.previousElementSibling;T&&T.tagName==="SELECT"&&(T.style.setProperty("display","none","important"),T.classList.add("urppp-chosen-hidden"));let N=A.parentElement&&A.parentElement.querySelector("select");N&&(N.style.setProperty("display","none","important"),N.classList.add("urppp-chosen-hidden")),A.style.setProperty("width","100%","important"),A.style.setProperty("min-width","0","important"),A.style.setProperty("max-width","none","important");let I=A.querySelector(".chosen-single");if(I){I.style.setProperty("width","100%","important"),I.style.setProperty("max-width","none","important"),I.style.setProperty("display","flex","important"),I.style.setProperty("align-items","center","important"),I.style.setProperty("height","34px","important"),I.style.setProperty("line-height","normal","important");let O=I.querySelector(":scope > span, span");O&&(O.style.setProperty("line-height","normal","important"),O.style.setProperty("height","auto","important"),O.style.setProperty("margin-top","0","important"),O.style.setProperty("padding-top","0","important"));let Q=I.querySelector("div");if(Q){Q.style.setProperty("display","flex","important"),Q.style.setProperty("align-items","center","important"),Q.style.setProperty("justify-content","center","important"),Q.style.setProperty("top","0","important"),Q.style.setProperty("bottom","0","important"),Q.style.setProperty("height","auto","important");let R=Q.querySelector("b");R&&(R.style.setProperty("margin","0","important"),R.style.setProperty("background-position","center center","important"),R.style.setProperty("background-size","12px 12px","important"),R.style.setProperty("width","14px","important"),R.style.setProperty("height","14px","important"))}}})})};document.querySelectorAll(".profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)").forEach(a=>{if(a.classList.contains("setLabelWidth")||a.closest&&a.closest("#curriculumInfo-divcon, #curriculumInfo-divcon1, #curriculumInfo-divcon2, #fajh, #xnxq, #kz, #kc, #kcfa"))return;let p=Array.from(a.querySelectorAll(".profile-info-row")).some(l=>Array.from(l.children).filter(b=>b.classList&&b.classList.contains("profile-info-name")).length>=2),i=!!a.querySelector("select.chosen, select.select, .chosen-container");if(!p&&!i){a.classList.remove("urppp-query-form");return}a.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')&&(a.classList.add("urppp-query-form"),Gr(a),a.querySelectorAll(".profile-info-row").forEach(l=>{if(l.dataset.urpppQueryDone==="1"){l.querySelector(":scope > .urppp-query-pair")&&e(l);return}let b=Array.from(l.children).filter(N=>N.classList&&(N.classList.contains("profile-info-name")||N.classList.contains("profile-info-value"))),m=[];for(let N=0;N<b.length;){let I=b[N],O=b[N+1];I&&O&&I.classList.contains("profile-info-name")&&O.classList.contains("profile-info-value")?(m.push([I,O]),N+=2):N+=1}if(!m.length){l.dataset.urpppQueryDone="1";return}let A=document.createDocumentFragment(),T=new Set;for(m.forEach(([N,I])=>{let O=document.createElement("div");O.className="urppp-query-pair",O.appendChild(N),O.appendChild(I),T.add(N),T.add(I),A.appendChild(O)}),b.forEach(N=>{T.has(N)||A.appendChild(N)});l.firstChild;)l.removeChild(l.firstChild);l.appendChild(A),l.dataset.urpppQueryDone="1",e(l)}))}),ve()}catch(t){console.warn("[URP++] query form beautify failed",t)}}function sn(){if(window.__urpppChosenAlignBound)return;window.__urpppChosenAlignBound=!0;let t=!1,e=r=>{if(!t){t=!0;try{let a=r&&r.querySelectorAll?r:document,p=document.getElementById("urppp-chosen-li-style");p||(p=document.createElement("style"),p.id="urppp-chosen-li-style",document.documentElement.appendChild(p)),p.textContent=[".self div.profile-info-value a.chosen-single > span,","body .self div.profile-info-value a.chosen-single > span {","  line-height: normal !important;","  height: auto !important;","  margin-top: 0 !important;","  padding-top: 0 !important;","}",".self div.profile-info-value a.chosen-single,","body .self div.profile-info-value a.chosen-single {","  display: flex !important;","  align-items: center !important;","  height: 34px !important;","  line-height: normal !important;","}","body .chosen-container .chosen-results li,","body .chosen-with-drop .chosen-results li,","html body .chosen-container .chosen-results li.active-result {","  display:flex !important;","  align-items:center !important;","  justify-content:flex-start !important;","  height:36px !important;","  min-height:36px !important;","  max-height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","  margin:0 !important;","  box-sizing:border-box !important;","}","body .chosen-container .chosen-results li.highlighted,","body .chosen-container .chosen-results li.result-selected {","  display:flex !important;","  align-items:center !important;","  height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","}"].join(""),a.querySelectorAll(".chosen-results li").forEach(i=>{i.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-start !important","height:36px !important","min-height:36px !important","max-height:36px !important","line-height:1 !important","padding:0 12px !important","margin:0 !important","box-sizing:border-box !important"].join(";")}),a.querySelectorAll("a.chosen-single").forEach(i=>{i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("height","34px","important"),i.style.setProperty("min-height","34px","important"),i.style.setProperty("line-height","normal","important"),i.style.setProperty("padding-top","0","important"),i.style.setProperty("padding-bottom","0","important");let l=i.querySelector(":scope > span");l&&(l.style.setProperty("line-height","normal","important"),l.style.setProperty("height","auto","important"),l.style.setProperty("margin-top","0","important"),l.style.setProperty("margin-bottom","0","important"),l.style.setProperty("padding-top","0","important"),l.style.setProperty("padding-bottom","0","important"))}),a.querySelectorAll(".chosen-search").forEach(i=>{if(!i.querySelector(".urppp-chosen-search-icon")){let l=document.createElement("i");l.className="fa fa-search urppp-chosen-search-icon",l.setAttribute("aria-hidden","true"),i.appendChild(l)}})}finally{setTimeout(()=>{t=!1},0)}}};document.addEventListener("mousedown",r=>{let a=r.target&&r.target.closest?r.target.closest(".chosen-container"):null;a&&(setTimeout(()=>e(a),0),setTimeout(()=>e(a),30),setTimeout(()=>e(a),100),setTimeout(()=>e(a),200))},!0);try{let r=window.jQuery||window.$;r&&r.fn&&r(document).off("chosen:showing_dropdown.urppp chosen:updated.urppp").on("chosen:showing_dropdown.urppp chosen:updated.urppp",a=>{let p=a.target&&a.target.parentElement?a.target.parentElement:document;setTimeout(()=>e(p),0),setTimeout(()=>e(p),60)})}catch{}}function Da(){try{let t=document.getElementById("work_rest_schedule_modal");if(!t)return;(t.classList.contains("in")||t.classList.contains("show"))&&t.style.setProperty("display","block","important");let e=t.querySelector(".modal-body")||t,r=Array.from(e.querySelectorAll("table"));if(!r.length)return;let a=l=>(l||"").replace(/\s+/g," ").trim(),p=l=>String(l??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");if(e.dataset.urpppWrsDone==="1")return;e.dataset.urpppWrsDone="1",r.forEach(l=>{let b=l.closest(".urppp-table-wrap");b&&t.contains(b)&&b.parentElement&&(b.parentElement.insertBefore(l,b),b.remove()),l.classList.add("urppp-wrs-table"),l.style.setProperty("width","100%","important");let m=Array.from(l.rows||[]);if(!m.length)return;let A=0;m.forEach(T=>{let N=a(T.textContent);if(!/\d{1,2}:\d{2}/.test(N))return;let I=0;Array.from(T.cells||[]).forEach(O=>{I+=O.colSpan||1}),I>A&&(A=I)}),A<4&&m.forEach(T=>{let N=0;Array.from(T.cells||[]).forEach(I=>{N+=I.colSpan||1}),N>A&&(A=N)}),A<1&&(A=1),Array.from(l.rows||[]).forEach(T=>{let N=Array.from(T.cells||[]);if(!N.length)return;let I=a(T.textContent);if(!/\d{1,2}:\d{2}/.test(I)&&(/作息时间|学年/.test(I)||/(望江|华西|江安)/.test(I)&&/校区|时间|安排|作息/.test(I))){let R=I;T.className="urppp-wrs-title-row",T.innerHTML='<td class="urppp-wrs-title" colspan="'+A+'" align="center">'+p(R)+"</td>";return}N.forEach(R=>{["border","borderTop","borderRight","borderBottom","borderLeft","textAlign","verticalAlign","width"].forEach(F=>{try{R.style[F]=""}catch{}}),R.classList.remove("urppp-wrs-title","urppp-wrs-period","urppp-wrs-time","urppp-wrs-head");let H=a(R.textContent);H&&(/^(上午|下午|晚上|中午)$/.test(H)||(R.rowSpan||1)>1&&/上午|下午|晚上|中午/.test(H)?R.classList.add("urppp-wrs-period"):/节次|大节|时间|校区/.test(H)&&!/\d{1,2}:\d{2}/.test(H)&&!/第\d/.test(H)?/节次|时间|大节|校区/.test(I)&&!/\d{1,2}:\d{2}/.test(I)&&R.classList.add("urppp-wrs-head"):/\d{1,2}:\d{2}/.test(H)&&R.classList.add("urppp-wrs-time"),R.style.setProperty("text-align","center","important"),R.style.setProperty("vertical-align","middle","important"))})})});let i=t.querySelector(".modal-title");i&&(i.style.setProperty("text-align","center","important"),i.style.setProperty("width","100%","important")),e.dataset.urpppWrsDone="1"}catch{}}let ln="https://jwc.scu.edu.cn/cdxl.htm";function ja(){let t=['a[onclick*="jwc.scu.edu.cn/article/206"]','a[href*="jwc.scu.edu.cn/article/206"]',".cdsj a",".ace-nav a"],e=new Set;t.forEach(r=>{document.querySelectorAll(r).forEach(a=>{if(e.has(a))return;e.add(a);let p=(a.textContent||"").replace(/\s+/g,""),i=a.getAttribute("onclick")||"",l=a.getAttribute("href")||"";(p.includes("学校校历")||i.includes("article/206")||l.includes("article/206")||i.includes("jwc.scu.edu.cn")&&p.includes("校历"))&&(a.setAttribute("href",ln),a.setAttribute("target","_blank"),a.setAttribute("rel","noopener noreferrer"),a.setAttribute("onclick",`window.open('${ln}');return false;`))})})}function Jr(){document.querySelectorAll("#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static").forEach(t=>{if(!t.querySelector(".nav-tabs"))return;["background","background-color","background-image","border","border-radius","box-shadow"].forEach(a=>{t.style.setProperty(a,a.startsWith("background")||a==="box-shadow"?a==="box-shadow"?"none":"transparent":a==="border"?"none":"0","important")}),t.style.setProperty("background","transparent","important"),t.style.setProperty("background-color","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("width","100%","important"),t.style.setProperty("margin","0 0 14px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("min-height","0","important"),t.style.setProperty("box-sizing","border-box","important");let e=t.querySelector(".navbar-inner");e&&(e.style.setProperty("background","transparent","important"),e.style.setProperty("border","none","important"),e.style.setProperty("box-shadow","none","important"),e.style.setProperty("padding","0","important"),e.style.setProperty("min-height","0","important"),e.style.setProperty("filter","none","important"),e.style.setProperty("width","100%","important")),t.querySelectorAll(".container, .container-fluid").forEach(a=>{a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("margin","0","important"),a.style.setProperty("margin-left","0","important"),a.style.setProperty("padding","0","important"),a.style.setProperty("background","transparent","important"),a.style.setProperty("box-sizing","border-box","important")});let r=t.querySelector(".nav-tabs");r&&(r.style.setProperty("width","100%","important"),r.style.setProperty("margin","0","important"),r.style.setProperty("padding","8px 10px","important"),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("background-color","var(--surface)","important"),r.style.setProperty("border",Ue(),"important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("box-sizing","border-box","important"))})}function We(){let t=e=>{let r=NaN,a=[e.getAttribute("data-percent"),e.querySelector("[data-percent]")?.getAttribute("data-percent"),e.querySelector(".percent")?.textContent,e.querySelector(".urppp-pct-text")?.textContent];for(let p of a){if(p==null||p==="")continue;let i=parseFloat(String(p).replace(/[^\d.]/g,""));if(!Number.isNaN(i)){r=i;break}}if(Number.isNaN(r)){let p=(e.textContent||"").match(/(\d+(?:\.\d+)?)\s*%/);p&&(r=parseFloat(p[1]))}if(Number.isNaN(r)){let p=e.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');if(p){let i=String(p.style.width||"").match(/([\d.]+)%/);i&&(r=parseFloat(i[1]))}}return Number.isNaN(r)?null:Math.max(0,Math.min(100,r))};document.querySelectorAll(".infobox").forEach(e=>{let r=t(e);if(r==null)return;e.querySelectorAll("canvas").forEach(l=>l.remove()),e.querySelectorAll(".easy-pie-chart, .percentage, .infobox-progress").forEach(l=>{l.classList.contains("urppp-pct-bar")||l.remove()}),e.querySelectorAll(".urppp-pct-text, .urppp-pct-bar").forEach(l=>l.remove());let a=e.querySelector(".infobox-data")||e,p=document.createElement("div");p.className="urppp-pct-text",p.textContent=Math.round(r)+"%";let i=document.createElement("div");if(i.className="urppp-pct-bar"+(r<=0?" is-empty":""),r>0){let l=document.createElement("span");l.className="urppp-pct-fill",l.style.width=r+"%",i.appendChild(l)}a.insertBefore(i,a.firstChild),a.insertBefore(p,a.firstChild),e.dataset.urpppPctDone="1"})}function br(t){let e=document.getElementById("treeDemo");if(!e)return;let r=!!(t&&t.force);if(e.dataset.urpppBusy==="1"&&!(t&&t.ignoreBusy))return;let a=e.closest('div[style*="border"]')||e.closest("#tree_div")?.parentElement||e.parentElement;a&&a.classList.add("urppp-plan-tree-shell"),e.classList.add("urppp-ztree");let p=typeof unsafeWindow<"u"?unsafeWindow:window,i=()=>{try{return(p.jQuery||p.$||window.jQuery||window.$)?.fn?.zTree?.getZTreeObj?.("treeDemo")||null}catch{return null}},l=()=>{let H=Array.from(e.querySelectorAll('span.button.switch[class*="_open"]')).filter(F=>!/_docu\b/.test(F.className));return H.reverse().forEach(F=>{try{F.click()}catch{}}),H.length>0},b=()=>{let H=i();if(H)try{H.expandAll(!1)}catch{}return e.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')&&l(),!0};if(!window.__urpppExpandKzPatched){window.__urpppExpandKzPatched=!0;let H=()=>{let F=typeof unsafeWindow<"u"?unsafeWindow:window;try{F.expandKzByRule=function(){e.dataset.urpppUserExpanded||b()}}catch{}};H(),setTimeout(H,0),setTimeout(H,200)}e.dataset.urpppCollapsedOnce||(e.dataset.urpppCollapsedOnce="1",[0,80,200,500,1e3].forEach(H=>setTimeout(()=>{e.dataset.urpppUserExpanded||b()},H)));let m=document.querySelector("#two h4.header, #two .header");if(m&&!m.dataset.urpppLegendDone){let H=m.querySelector("font");if(H){let F=document.createElement("div");F.className="urppp-plan-legend",F.innerHTML=['<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>','<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>','<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>','<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>','<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>'].join(""),H.replaceWith(F)}m.classList.add("urppp-plan-header"),m.dataset.urpppLegendDone="1"}let A=()=>{if(e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}},T=()=>{e.dataset.urpppBusy="0";let H=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&H)try{window.__urpppPlanTreeObs.observe(H,{childList:!0,subtree:!0})}catch{}},N=H=>{let F=H;return F=F.replace(/\((最低修读学分:[^)]+)\)/g,(Z,ut)=>{let wt=ut.split(",").map(Tt=>Tt.trim()).filter(Boolean),Ct=[];return wt.forEach(Tt=>{/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(Tt)&&Ct.push(Tt)}),`<span class="urppp-sub">${(Ct.length?Ct:wt).map(Tt=>{let Ot=Tt.match(/^([^:：]+)[:：]\s*(.+)$/);if(!Ot)return Tt;let Rt=Ot[1].trim(),It=Ot[2].trim(),Ut="neutral";return/通过|已及格/.test(Rt)?Ut="ok":/未修读|未及格/.test(Rt)?Ut=Number(It)>0?"warn":"muted":/最低/.test(Rt)&&(Ut="req"),`<span class="urppp-kv ${Ut}"><em>${Rt}</em><b>${It}</b></span>`}).join("")}</span>`}),F=F.replace(/\[(\d{6,})\]/g,'<span class="urppp-code">$1</span>'),F=F.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g,'<span class="urppp-meta">$1</span>'),F=F.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g,(Z,ut,wt)=>{let Ct=String(wt).trim(),qt=Ct.match(/^(.+?)(?:\((\d{6,8})\))?$/),Tt=(qt?qt[1]:Ct).trim(),Ot=qt&&qt[2]?qt[2]:"",Rt=parseFloat(Tt),It=!1;Number.isNaN(Rt)?/不及格|未通过|不通过/.test(Tt)?It=!1:(/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(Tt),It=!0):It=Rt>=60;let Ut=Ot?`<i>${Ot}</i>`:"";return`<span class="urppp-score ${It?"pass":"fail"}"><b>${ut}</b><em>${Tt}</em>${Ut}</span>`}),F=F.replace(/(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,'$1<span class="urppp-title">$2</span>'),F=F.replace(/(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,'$1 <span class="urppp-gname">$2</span>'),F=F.replace(/(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,"$1 "),F},I=H=>{let F=H.querySelector("i.fa, i.ace-icon"),Z=H.closest("li");Z&&(Z.classList.remove("urppp-node-done","urppp-node-todo","urppp-node-pass","urppp-node-fail","urppp-node-pending"),F&&(F.classList.contains("fa-check-square-o")?Z.classList.add("urppp-node-done"):F.classList.contains("fa-smile-o")?Z.classList.add("urppp-node-pass"):F.classList.contains("fa-frown-o")?Z.classList.add("urppp-node-fail"):F.classList.contains("fa-meh-o")?Z.classList.add("urppp-node-pending"):F.classList.contains("fa-kz")&&Z.classList.add("urppp-node-todo")))},O=H=>{if(!H||!r&&H.dataset.urpppNodeDone==="1")return!1;I(H);let F=H.querySelector("span.node_name")||H;if(!F)return!1;if(!r&&F.querySelector(".urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname"))H.dataset.urpppNodeDone="1";else{let ut=F.dataset.urpppRaw;ut||(F.querySelector(".urppp-score, .urppp-code, .urppp-sub")?(H.dataset.urpppNodeDone="1",ut=null):(ut=F.innerHTML,ut&&(F.dataset.urpppRaw=ut))),ut&&(F.innerHTML=N(ut),H.dataset.urpppNodeDone="1")}let Z=H.parentElement&&H.parentElement.querySelector(":scope > span.button.switch");return Z&&(Z.dataset.urpppSw||(Z.dataset.urpppSw="1",/_docu\b/.test(Z.className)&&(Z.classList.add("urppp-switch-leaf"),Z.style.setProperty("display","none","important"))),/_docu\b/.test(Z.className)||Z.classList.contains("urppp-switch-leaf")?H.classList.remove("urppp-expandable"):H.classList.add("urppp-expandable")),!0},Q=(H,F)=>{let Z=Array.from(H||[]),ut=0,wt=()=>{let Ct=Math.min(ut+48,Z.length);for(;ut<Ct;ut++)O(Z[ut]);ut<Z.length?window.requestIdleCallback?requestIdleCallback(wt,{timeout:120}):setTimeout(wt,0):F&&F()};wt()},R=H=>{let F=H||e;F.querySelectorAll("span.button.switch:not([data-urppp-sw])").forEach(Z=>{Z.dataset.urpppSw="1",/_docu\b/.test(Z.className)&&(Z.classList.add("urppp-switch-leaf"),Z.style.setProperty("display","none","important"))}),F.querySelectorAll("li > a").forEach(Z=>O(Z))};A();try{R(e),e.dataset.urpppExpandClick||(e.dataset.urpppExpandClick="1",e.addEventListener("click",F=>{if(F.target.closest&&F.target.closest("span.button.switch")){let qt=F.target.closest("span.button.switch"),Tt=qt&&qt.parentElement;if(!Tt||/_docu\b/.test(qt.className))return;if(e.dataset.urpppUserExpanded="1",e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}setTimeout(()=>{R(Tt),e.dataset.urpppBusy="0";let Ot=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&Ot)try{window.__urpppPlanTreeObs.observe(Ot,{childList:!0,subtree:!0})}catch{}},0);return}let Z=F.target&&F.target.closest?F.target.closest("li > a"):null;if(!Z||!e.contains(Z))return;let ut=Z.parentElement;if(!ut)return;let wt=ut.querySelector(":scope > span.button.switch");if(!wt||/_docu\b/.test(wt.className)||wt.classList.contains("urppp-switch-leaf")||!Z.classList.contains("urppp-expandable")&&!/_open|_close/.test(wt.className))return;if(F.preventDefault(),F.stopImmediatePropagation(),e.dataset.urpppUserExpanded="1",e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}wt.click(),R(ut),e.dataset.urpppBusy="0";let Ct=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&Ct)try{window.__urpppPlanTreeObs.observe(Ct,{childList:!0,subtree:!0})}catch{}},!0));let H=(F,Z)=>{let ut=document.getElementById(F);return!ut||ut.dataset.urpppBound==="1"?!1:(ut.dataset.urpppBound="1",ut.addEventListener("click",wt=>{wt.preventDefault(),wt.stopImmediatePropagation(),e.dataset.urpppUserExpanded="1",A();try{let Ct=i();if(Z){Ct?Ct.expandAll(!0):e.querySelectorAll('span.button.switch[class*="_close"]').forEach(Tt=>{/_docu\b/.test(Tt.className)||Tt.click()});let qt=e.querySelectorAll('li > a:not([data-urppp-node-done="1"])');Q(qt,T)}else{if(Ct)try{Ct.expandAll(!1)}catch{}l(),setTimeout(()=>{e.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')&&l(),T()},0)}}catch{Z||l(),T()}},!0),!0)};H("expandAllBtn",!0),H("collapseAllBtn",!1),e.dataset.urpppAllBtnsRetry||(e.dataset.urpppAllBtnsRetry="1",setTimeout(()=>{H("expandAllBtn",!0),H("collapseAllBtn",!1)},300),setTimeout(()=>{H("expandAllBtn",!0),H("collapseAllBtn",!1)},1e3))}finally{requestAnimationFrame(()=>{requestAnimationFrame(T)})}}function hr(){if(!fe())try{let t=document.getElementById("soliderbox");if(t){t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","720px","important"),t.style.setProperty("min-width","0","important"),t.classList.remove("container");let p=t.closest(".profile-info-row");p&&(p.style.setProperty("display","flex","important"),p.style.setProperty("align-items","center","important"),p.style.setProperty("width","100%","important"),p.style.setProperty("max-width","100%","important"));let i=t.closest(".profile-info-value");i&&(i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","100%","important"),i.style.setProperty("flex","1 1 auto","important"),i.style.setProperty("min-width","0","important"))}let e=document.getElementById("mycoursetable");if(!e)return;let r=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches);e.classList.toggle("urppp-mobile-schedule-scroll",r),e.style.setProperty("position","relative","important"),e.style.setProperty("width","100%","important");let a=72;r||e.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(p=>{let i=p.offsetHeight||0;i>a&&(a=i)}),a<56&&(a=72),e.querySelectorAll("div.class_div").forEach(p=>{let i=parseInt(p.getAttribute("classNum")||"1",10)||1,l=p.scrollHeight||0;if(l>0){let b=Math.ceil(l/i);a=r?Math.max(a,Math.min(b,88)):Math.max(a,b)}}),r?a=Math.min(Math.max(a,72),88):(a<64&&(a=72),a>160&&(a=120)),e.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(p=>{p.style.setProperty("height",a+"px","important")}),e.querySelectorAll("td").forEach(p=>{let i=Array.from(p.querySelectorAll(":scope > div.class_div"));if(!i.length)return;p.style.setProperty("position","relative","important"),p.style.setProperty("vertical-align","top","important"),p.style.setProperty("overflow","visible","important");let l=p.getBoundingClientRect().width||p.offsetWidth||p.clientWidth||0,b=getComputedStyle(p),m=p.closest("table"),A=m?getComputedStyle(m):null,T=parseFloat(b.borderLeftWidth)||0,N=A&&A.borderCollapse==="collapse"?T/2:T,I=Math.max(1,i.length);i.forEach((O,Q)=>{let R=parseInt(O.getAttribute("classNum")||"1",10)||1,H=Kp(l,I,Q,N),F=H.left,Z=H.width;O.style.setProperty("position","absolute","important"),O.style.setProperty("top","0px","important"),O.style.setProperty("left",F+"px","important"),O.style.setProperty("right","auto","important"),O.style.setProperty("bottom","auto","important"),O.style.setProperty("transform","none","important"),O.style.setProperty("width",Z+"px","important"),O.style.setProperty("max-width","none","important"),O.style.setProperty("height",a*R+"px","important"),O.style.setProperty("margin","0","important"),O.style.setProperty("box-sizing","border-box","important"),O.style.setProperty("z-index","2","important"),O.style.setProperty("overflow","hidden","important")})})}catch(t){console.warn("[URP++] week schedule fix failed",t)}}function Oa(){try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;if(!t||t.__urpppDivBuildPatched||typeof t.divBuild!="function")return;t.__urpppDivBuildPatched=!0;let e=t.divBuild;t.__urpppOriginalDivBuild=e,t.divBuild=function(){try{hr()}catch{try{return e.apply(this,arguments)}catch{}}};try{t.divBuild._urppp=!0}catch{}}catch(t){console.warn("[URP++] patch divBuild failed",t)}}let Ge=null,cn=!1;function dn(){let t=document.getElementById("mycoursetable")||document.getElementById("page-content-template")||document.body;if(Ge&&Ge.root===t&&t?.isConnected){hr();return}Ge&&Ge.disconnect(),Ge=null;let e=!cn;cn=!0;let r=!1,a=()=>{if(!(r||fe())&&!(!document.getElementById("soliderbox")&&!document.getElementById("mycoursetable"))){r=!0;try{Oa(),hr()}finally{setTimeout(()=>{r=!1},40)}}};Oa(),[0,50,150,400,1e3,2e3].forEach(l=>setTimeout(()=>{Oa(),a()},l)),e&&window.addEventListener("resize",()=>{clearTimeout(window.__urpppWeekSchedResize),window.__urpppWeekSchedResize=setTimeout(a,120)});let p=l=>{if(!l||fe())return;let b=[];l.nodeType===1&&(l.matches&&l.matches("div.class_div")&&b.push(l),l.querySelectorAll&&l.querySelectorAll("div.class_div").forEach(m=>b.push(m))),b.forEach(m=>{let A=m.parentElement;A&&A.tagName==="TD"&&A.style.setProperty("position","relative","important"),m.style.setProperty("position","absolute","important"),m.style.setProperty("top","0px","important"),m.style.setProperty("left","0px","important"),m.style.setProperty("right","auto","important"),m.style.setProperty("transform","none","important"),m.style.setProperty("width","100%","important"),m.style.setProperty("margin","0","important"),m.style.setProperty("box-sizing","border-box","important")})},i=new MutationObserver(l=>{if(fe())return;let b=!1;l.forEach(m=>{if(m.type==="childList"&&m.addedNodes.forEach(A=>{p(A),b=!0}),m.type==="attributes"&&m.attributeName==="style"&&m.target&&m.target.classList&&m.target.classList.contains("class_div")){let A=m.target,T=A.style.left||"",N=parseFloat(T);(!T||T==="auto"||Number.isFinite(N)&&N>200)&&(A.style.setProperty("left","0px","important"),A.style.setProperty("top","0px","important"),A.style.setProperty("position","absolute","important")),b=!0}}),b&&(clearTimeout(window.__urpppWeekSchedMut),window.__urpppWeekSchedMut=setTimeout(()=>{requestAnimationFrame(a)},16))});if(t){i.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]});let l=null,b=0,m=0;if(t.id==="mycoursetable"&&typeof window.ResizeObserver=="function"){let A=t.getBoundingClientRect().width||0;l=new window.ResizeObserver(T=>{let N=T[0]?.contentRect?.width||t.getBoundingClientRect().width||0;!N||Math.abs(N-A)<.5||(A=N,b||(b=requestAnimationFrame(()=>{b=0,a()})),clearTimeout(m),m=setTimeout(a,80))}),l.observe(t)}Ge={root:t,observer:i,disconnect(){i.disconnect(),l&&l.disconnect(),b&&cancelAnimationFrame(b),clearTimeout(m)}}}e&&document.addEventListener("mouseup",()=>{document.getElementById("soliderbox")&&(setTimeout(a,200),setTimeout(a,500))},!0)}function un(){try{let t=document.getElementById("curriculumInfo-divcon2");if(!t)return;let e=parseFloat(t.style.width||getComputedStyle(t).width||"0");if(!e||e<40)return;t.classList.add("urppp-curriculum-drawer");let r=t.querySelector(".modal-body");if(!r)return;let a=r.querySelector(":scope > .col-xs-12 > .row")||r.querySelector(".col-xs-12 > .row")||r.querySelector(".row");if(!a)return;a.classList.add("urppp-drawer-layout");let p=a.querySelector(":scope > .urppp-drawer-toolbar, :scope > p");p&&p.tagName==="P"&&p.classList.add("urppp-drawer-toolbar");let i=a.querySelector(":scope > .urppp-drawer-body"),l=a.querySelector(".urppp-drawer-left"),b=a.querySelector(".urppp-drawer-right");i||(i=document.createElement("div"),i.className="urppp-drawer-body"),l||(l=document.createElement("div"),l.className="urppp-drawer-left"),b||(b=document.createElement("div"),b.className="urppp-drawer-right"),i.contains(l)||i.appendChild(l),i.contains(b)||i.appendChild(b),i.parentElement!==a&&(p&&p.parentElement===a?a.insertBefore(i,p.nextSibling):a.appendChild(i)),p&&a.firstElementChild!==p&&a.insertBefore(p,a.firstElementChild);let m=a.querySelector("#treeDemo, .ztree")||t.querySelector("#treeDemo, .ztree"),A=null;if(m){A=m.closest(".col-xs-6, .col-sm-6, .widget-box")||m.parentElement;let Q=m.closest(".col-xs-6, .col-sm-6");Q&&(A=Q)}let T=["fajh","xnxq","kz","kc","kcfa"],N=T.map(Q=>document.getElementById(Q)).filter(Q=>Q&&t.contains(Q));A&&A.parentElement!==l&&l.appendChild(A),Array.from(l.children).forEach(Q=>{(T.includes(Q.id)||Q.id&&T.includes(Q.id)||Q!==A&&Q.querySelector&&!Q.querySelector("#treeDemo, .ztree")&&Q.classList&&Q.classList.contains("col-xs-6"))&&b.appendChild(Q)}),T.forEach(Q=>{let R=document.getElementById(Q);!R||!t.contains(R)||(R.parentElement!==b&&b.appendChild(R),R.style.setProperty("width","100%","important"),R.style.setProperty("max-width","100%","important"),R.style.setProperty("float","none","important"),R.style.setProperty("margin","0","important"),R.style.setProperty("padding","0","important"),R.style.setProperty("box-sizing","border-box","important"),R.style.display!=="none"&&getComputedStyle(R).display!=="none"&&R.style.setProperty("display","block","important"))});let I=document.getElementById("fajh");I&&t.contains(I)&&(I.parentElement!==b&&b.appendChild(I),(!I.innerHTML||!I.innerHTML.trim())&&!I.querySelector(".urppp-drawer-skeleton, .profile-user-info, .widget-box")&&(I.innerHTML=["<div class='widget-box transparent urppp-drawer-skeleton'>","  <div class='widget-header widget-header-small'>","    <h4 class='widget-title smaller grey'>方案计划信息</h4>","  </div>","</div>","<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>","  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>","</div>"].join(""),I.style.setProperty("display","block","important"),I.dataset.urpppSkeleton="1"),I.dataset.urpppSkeleton==="1"&&I.querySelector(".profile-info-value")&&/方案名称|计划名称|年级|院系/.test(I.textContent||"")&&(delete I.dataset.urpppSkeleton,I.querySelectorAll(".urppp-drawer-skeleton, .urppp-drawer-skeleton-card").forEach(R=>R.remove())),I.innerHTML&&I.innerHTML.trim()&&I.style.display==="none"&&(I.dataset.urpppSkeleton==="1"||I.querySelector(".profile-user-info"))&&I.style.setProperty("display","block","important")),b.style.setProperty("min-height","240px","important"),l.style.setProperty("min-height","240px","important"),A&&(A.style.setProperty("width","100%","important"),A.style.setProperty("max-width","100%","important"),A.style.setProperty("float","none","important"),A.style.setProperty("margin","0","important"),A.style.setProperty("padding","0","important"),A.style.setProperty("border","none","important"),A.style.setProperty("box-sizing","border-box","important"));let O=l.querySelector(".widget-box");O&&(O.style.setProperty("width","100%","important"),O.style.setProperty("margin","0","important"),O.style.setProperty("border",Ue(),"important"),O.style.setProperty("border-radius","12px","important"),O.style.setProperty("overflow","hidden","important"),O.style.setProperty("background","var(--surface)","important")),t.querySelectorAll(".profile-info-row").forEach(Q=>{Q.classList.remove("urppp-query-row","urppp-dual-pair"),Q.style.setProperty("display","grid","important"),Q.style.setProperty("grid-template-columns","112px minmax(0,1fr)","important"),Q.style.setProperty("width","100%","important"),Array.from(Q.children).forEach(R=>{R.classList&&(R.style.setProperty("float","none","important"),R.style.setProperty("margin-left","0","important"),R.style.setProperty("width","auto","important"),R.style.setProperty("max-width","none","important"))})}),t.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(Q=>{Q.classList.remove("urppp-query-form");try{Gr(Q)}catch{}Q.querySelectorAll(".profile-info-value, .profile-info-value span, span.editable").forEach(R=>{R.style.setProperty("color","var(--text)","important"),R.style.setProperty("opacity","1","important"),R.style.setProperty("visibility","visible","important")}),Q.style.setProperty("border-radius","12px","important"),Q.style.setProperty("overflow","hidden","important"),Q.style.setProperty("width","100%","important"),Q.style.setProperty("max-width","100%","important"),Q.style.setProperty("display","block","important"),Q.style.setProperty("box-sizing","border-box","important")})}catch(t){console.warn("[URP++] curriculum drawer beautify failed",t)}}function zs(){if(window.__urpppCurriculumDrawerBound)return;window.__urpppCurriculumDrawerBound=!0;let t=()=>un();[0,50,150,350,800,1600].forEach(a=>setTimeout(t,a));let e=new MutationObserver(a=>{a.some(i=>!!(i.type==="childList"||i.type==="attributes"&&i.target&&(i.target.id==="curriculumInfo-divcon2"||i.target.id==="fajh")))&&(clearTimeout(window.__urpppCurriculumDrawerTimer),window.__urpppCurriculumDrawerTimer=setTimeout(()=>requestAnimationFrame(t),16))}),r=document.getElementById("curriculumInfo-divcon2");r&&e.observe(r,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),document.addEventListener("click",a=>{if(!document.getElementById("curriculumInfo-divcon2"))return;let p=a.target&&a.target.closest?a.target.closest("a,button,span,div"):null,i=(p&&p.textContent||"").replace(/\s+/g,"");(/培养方案|与我相关|方案计划|自动化培养/.test(i)||p&&p.closest&&p.closest("#curriculumInfo-divcon2"))&&(setTimeout(t,0),setTimeout(t,50),setTimeout(t,150),setTimeout(t,400))},!0)}let{scheduleScrubTableInlineBg:mn,scrubTableHeaderInlineBg:Ls}=yi({isNativePdfIsolationActive:fe}),{disarmNoticeTableHover:qs,pinNoticeRowSurface:bn,scrubNoticeInlineBg:hn,stripMistakenNoticeTable:fn}=Ai({getCurrentTheme:Qt});function Ra(){try{let t=document.querySelector("h4.header, h3.header, h4, h3, .breadcrumb, .page-header");return hi({pathname:location.pathname,href:location.href,title:document.title,headingText:t?.textContent||""})}catch{return!1}}function Ts(t){return $o(t,{noticePage:Ra()})}function Ha(t){return fi(t,{noticePage:Ra()})}let gn,{bindNoticeHoverScrub:Ms,scheduleBeautifyNoticeTables:xn}=ki({beautifyNoticeTables:t=>gn(t),pinNoticeRowSurface:bn});({beautifyNoticeTables:gn}=Si({isNativePdfIsolationActive:fe,bindNoticeHoverScrub:Ms,scrubNoticeInlineBg:hn,stripMistakenNoticeTable:fn,disarmNoticeTableHover:qs,pinNoticeRowSurface:bn,isBusinessDataTable:Ha,isNoticeListTable:Ts,isNoticePageContext:Ra,isNoticeBulletText:Io}));let{wrapTables:yn,bindTableWrapObserver:vn}=gi({isNativePdfIsolationActive:fe,isBusinessDataTable:Ha});function fr(){try{document.querySelectorAll(".modal").forEach(e=>{if(!e||!e.style)return;e.style.getPropertyPriority("display")==="important"&&e.style.removeProperty("display"),e.classList.contains("in")||e.classList.contains("show")?e.style.display==="none"&&e.style.removeProperty("display"):(e.style.display==="block"||getComputedStyle(e).display!=="none")&&(e.style.setProperty("display","none","important"),setTimeout(()=>{try{!e.classList.contains("in")&&!e.classList.contains("show")&&(e.style.getPropertyPriority("display")==="important"&&e.style.removeProperty("display"),e.style.display="none")}catch{}},0))}),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(e=>{try{e.parentElement&&e.parentElement.removeChild(e)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right")))}catch{}}function Is(){if(window.__urpppModalOpenPatched)return;window.__urpppModalOpenPatched=!0;let t=i=>{!i||!i.style||(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.getPropertyPriority("opacity")==="important"&&i.style.removeProperty("opacity"),i.style.getPropertyPriority("pointer-events")==="important"&&i.style.removeProperty("pointer-events"),i.style.getPropertyPriority("visibility")==="important"&&i.style.removeProperty("visibility"))},e=i=>{if(!(!i||!i.classList))try{i.classList.remove("in","show"),i.setAttribute("aria-hidden","true"),i.style.removeProperty("display"),i.style.setProperty("display","none","important"),setTimeout(()=>{try{!i.classList.contains("in")&&!i.classList.contains("show")&&(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.display="none")}catch{}},30)}catch{}},r=()=>{document.querySelectorAll(".modal-backdrop").forEach(i=>{try{i.parentElement&&i.parentElement.removeChild(i)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"),document.body.style.removeProperty("overflow"))},a=i=>{if(i){if(i.classList&&i.classList.contains("modal-backdrop")&&(i=document.querySelector(".modal.in, .modal.show")||i),!i||!i.classList||!i.classList.contains("modal")){r();return}t(i),e(i),r();try{let l=typeof Wr=="function"&&Wr()||typeof unsafeWindow<"u"&&(unsafeWindow.jQuery||unsafeWindow.$)||window.jQuery||window.$;if(l&&l.fn&&typeof l.fn.modal=="function"){try{l(i).trigger("hide.bs.modal")}catch{}try{l(i).modal("hide")}catch{}try{l(i).trigger("hidden.bs.modal")}catch{}}}catch{}setTimeout(()=>{e(i),document.querySelector(".modal.in, .modal.show")||r();try{fr()}catch{}},0)}};document.addEventListener("show.bs.modal",i=>{let l=i.target;if(!(!l||!l.classList||!l.classList.contains("modal"))){t(l),l.style.display==="none"&&l.style.removeProperty("display");try{l.getAttribute("data-backdrop")==="static"&&l.setAttribute("data-backdrop","true"),l.dataset&&(l.dataset.backdrop="true")}catch{}}},!0),document.addEventListener("hide.bs.modal",i=>{let l=i.target;!l||!l.classList||!l.classList.contains("modal")||t(l)},!0),document.addEventListener("hidden.bs.modal",i=>{let l=i.target;!l||!l.classList||!l.classList.contains("modal")||(e(l),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(b=>{try{b.parentElement&&b.parentElement.removeChild(b)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"))))},!0);let p=i=>{let l=i.target;if(!l||!l.closest||l.closest(".modal-dialog, .modal-content, .modal-header, .modal-body, .modal-footer")&&!l.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return;if(l.classList&&l.classList.contains("modal-backdrop")){let T=document.querySelector(".modal.in, .modal.show")||document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"]');T?(i.preventDefault(),i.stopPropagation(),a(T)):(i.preventDefault(),r(),fr());return}let b=null;if(l.classList&&l.classList.contains("modal")?b=l:b=l.closest(".modal.in, .modal.show, .modal"),!b||!b.classList.contains("modal")||!(b.classList.contains("in")||b.classList.contains("show")||getComputedStyle(b).display!=="none"))return;let A=b.querySelector(".modal-dialog");if(A){let T=A.getBoundingClientRect(),N=i.clientX,I=i.clientY;if(N>=T.left&&N<=T.right&&I>=T.top&&I<=T.bottom&&!l.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return}else if(l.closest(".modal-content"))return;i.preventDefault(),i.stopPropagation(),a(b)};document.addEventListener("pointerdown",p,!0),document.addEventListener("mousedown",p,!0),document.addEventListener("click",p,!0),document.addEventListener("click",i=>{let l=i.target&&i.target.closest?i.target.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'):null;if(!l)return;let b=l.closest(".modal");b&&(i.preventDefault(),i.stopPropagation(),a(b)),setTimeout(()=>{try{fr()}catch{}},50),setTimeout(()=>{try{fr()}catch{}},220)},!0),document.addEventListener("click",i=>{let l=i.target&&i.target.closest?i.target.closest("a,button,td,span,div,i"):null;if(!l)return;["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon","billContainer"].forEach(m=>{let A=document.getElementById(m);A&&(t(A),A.style.opacity==="0"&&A.style.removeProperty("opacity"),A.style.pointerEvents==="none"&&A.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(m=>t(m));let b=l.getAttribute&&(l.getAttribute("data-target")||l.getAttribute("href")||"");if(b&&b.charAt(0)==="#"){let m=document.querySelector(b);m&&t(m)}},!0)}let Je=null,Ua=0;function Wa(){if(fe())return;let t=document.getElementById("courseTable");t&&t.querySelectorAll("td").forEach(e=>{let r=e.style.backgroundColor;if(!r||!r.includes("rgba"))return;let a=r.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);a&&(e.style.backgroundColor=`rgba(${a[1]},${a[2]},${a[3]},0.5)`)})}function wn(){let t=document.getElementById("mycoursetable")||document.getElementById("courseTable");if(Je&&Je.root===t&&t?.isConnected){Wa();return}if(clearTimeout(Ua),Je&&Je.observer.disconnect(),Je=null,!t)return;let e=new MutationObserver(()=>{clearTimeout(Ua),Ua=setTimeout(Wa,60)});e.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style"]}),Je={root:t,observer:e},Wa()}function $s(){try{let T=Qt();document.documentElement.dataset.urpppTheme=T,document.documentElement.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),document.documentElement.classList.add("urppp-theme-"+T),document.body&&(document.body.dataset.urpppTheme=T,document.body.classList.toggle("urppp-dark",T==="dark"))}catch{}let t=document.getElementById("urppp-internal-style");t||(t=document.createElement("style"),t.id="urppp-internal-style",document.head.appendChild(t));{let T=t;T.textContent=qi}let e=document.getElementById("urppp-table-beautify-style");e||(e=document.createElement("style"),e.id="urppp-table-beautify-style",document.head.appendChild(e)),e.textContent=$i;let r=document.getElementById("urppp-navigation-style");r||(r=document.createElement("style"),r.id="urppp-navigation-style",document.head.appendChild(r)),r.textContent=Ni,Or()&&lo(),document.getElementById("urppp-schedule-card-style")||wr(location)&&co();try{window.__urpppIsMobileUA&&Qn()}catch{}try{oe()}catch{}fr(),Is(),["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon"].forEach(T=>{let N=document.getElementById(T);!N||!N.style||(["display","opacity","pointer-events","visibility"].forEach(I=>{N.style.getPropertyPriority(I)==="important"&&N.style.removeProperty(I)}),N.style.opacity==="0"&&N.style.removeProperty("opacity"),N.style.pointerEvents==="none"&&N.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(T=>{T.style&&T.style.getPropertyPriority("display")==="important"&&T.style.removeProperty("display")}),yn(),xn(),mn(),setTimeout(()=>document.querySelectorAll("table").forEach(T=>{Ha(T)&&fn(T)}),500),dn(),hr(),zs(),un(),vn();let p=document.querySelector(".page-content");p&&p.querySelectorAll(".widget-box").length>=4&&setTimeout(bl,500),Jn(),Me(),l();function l(){let T="(max-width: 640px)",N=()=>!!(window.matchMedia&&window.matchMedia(T).matches),I=(W,pt)=>{if(!(!W||!document.body)){if(pt){Object.hasOwn(W.dataset,"urpppDesktopSidebarMin")||(W.dataset.urpppDesktopSidebarMin=W.classList.contains("menu-min")?"1":"0",W.dataset.urpppDesktopBodyMin=document.body.classList.contains("menu-min")?"1":"0"),W.classList.remove("menu-min"),document.body.classList.remove("menu-min");return}Object.hasOwn(W.dataset,"urpppDesktopSidebarMin")&&(W.classList.toggle("menu-min",W.dataset.urpppDesktopSidebarMin==="1"),document.body.classList.toggle("menu-min",W.dataset.urpppDesktopBodyMin==="1"),delete W.dataset.urpppDesktopSidebarMin,delete W.dataset.urpppDesktopBodyMin)}},O=new WeakMap,Q=W=>{let pt=O.get(W);pt&&cancelAnimationFrame(pt),O.delete(W)},R=(W,pt)=>{Q(W);let lt=W.getBoundingClientRect(),yt=Math.max(lt.width,W.offsetWidth||0,260),gt=Math.max(-yt,Math.min(0,lt.left)),_t=pt?0:-yt,Mt=Math.abs(_t-gt),Ht=Math.max(140,Math.round(260*Mt/yt)),he=performance.now(),Wt=W.classList.contains("urppp-clean-sidebar"),pe=Wt?"12030":"1200",Bt=Wt?"12030":"1030";W.style.setProperty("display","block","important"),W.style.setProperty("transition","none","important"),W.style.setProperty("visibility","visible","important"),W.style.setProperty("pointer-events",pt?"auto":"none","important"),W.style.setProperty("z-index",pe,"important"),W.style.setProperty("transform",`translate3d(${gt}px, 0, 0)`,"important"),W.classList.toggle("urppp-drawer-closing",!pt),W.classList.add("display");let St=()=>{W.style.setProperty("transform",`translate3d(${_t}px, 0, 0)`,"important"),pt?(W.classList.remove("urppp-drawer-closing"),W.style.setProperty("pointer-events","auto","important")):(W.classList.remove("display","urppp-drawer-closing"),W.style.setProperty("visibility","hidden","important"),W.style.setProperty("z-index",Bt,"important")),O.delete(W)};if(Mt<1){St();return}let Se=$t=>{if(!W.isConnected){O.delete(W);return}let Gt=Math.min(1,($t-he)/Ht),Mp=Gt<.5?4*Gt*Gt*Gt:1-Math.pow(-2*Gt+2,3)/2,ca=gt+(_t-gt)*Mp;if(W.style.setProperty("transform",`translate3d(${ca}px, 0, 0)`,"important"),Gt>=1){St();return}O.set(W,requestAnimationFrame(Se))};O.set(W,requestAnimationFrame(Se))},H=(W,pt,lt)=>{if(W){R(W,lt),pt&&(pt.setAttribute("aria-expanded",lt?"true":"false"),pt.setAttribute("aria-label",lt?"关闭菜单":"打开菜单"));try{Ye()}catch{}}},F=()=>{H(document.getElementById("sidebar"),document.getElementById("urppp-mobile-menu-button"),!1)},Z=()=>{let pt=document.getElementById("urppp-mobile-search-panel")?.querySelector("#form-search");if(!pt)return;Object.entries({position:"relative",right:"auto",top:"auto",left:"auto",transform:"none",width:"100%","min-width":"0","max-width":"none",height:"36px",opacity:"1",margin:"0",overflow:"visible","z-index":"1"}).forEach(([yt,gt])=>pt.style.setProperty(yt,gt,"important")),[pt.querySelector("form"),pt.querySelector(".input-icon")].forEach(yt=>{yt&&Object.entries({display:"block",position:"relative",width:"100%","min-width":"0","max-width":"none",height:"36px",margin:"0",padding:"0","box-sizing":"border-box"}).forEach(([gt,_t])=>yt.style.setProperty(gt,_t,"important"))});let lt=pt.querySelector("#search-input");lt&&(lt.style.setProperty("display","block","important"),lt.style.setProperty("width","100%","important"),lt.style.setProperty("min-width","0","important"),lt.style.setProperty("max-width","none","important"),lt.style.setProperty("height","36px","important"),lt.style.setProperty("box-sizing","border-box","important"))},ut=()=>{let W=document.getElementById("form-search");if(!W||!W.__urpppMobileParent)return;let pt=W.__urpppMobileParent,lt=W.__urpppMobileNext;pt.isConnected&&(lt&&lt.parentElement===pt?pt.insertBefore(W,lt):pt.appendChild(W)),W.classList.remove("urppp-mobile-form-search"),W.dataset.open="0",W.removeAttribute("style"),delete W.__urpppMobileParent,delete W.__urpppMobileNext;try{dt()}catch{}},wt=()=>{let W=document.querySelector("#navbar .menu-toggler");!W||W.dataset.urpppMobileHidden!=="1"||(W.style.removeProperty("display"),W.removeAttribute("aria-hidden"),W.dataset.urpppPreviousTabindex?W.setAttribute("tabindex",W.dataset.urpppPreviousTabindex):W.removeAttribute("tabindex"),delete W.dataset.urpppPreviousTabindex,delete W.dataset.urpppMobileHidden)},Ct=()=>{let W=document.getElementById("urppp-mobile-menu-button");if(!N())return W?.remove(),wt(),null;if(W)return W;let pt=document.getElementById("navbar"),lt=document.getElementById("sidebar");if(!pt||!lt)return null;let yt=pt.querySelector(".menu-toggler");yt&&(yt.dataset.urpppMobileHidden="1",yt.dataset.urpppPreviousTabindex=yt.getAttribute("tabindex")||"",yt.style.setProperty("display","none","important"),yt.setAttribute("aria-hidden","true"),yt.setAttribute("tabindex","-1"));let gt=document.createElement("button");gt.type="button",gt.id="urppp-mobile-menu-button",gt.className="urppp-mobile-menu-button",gt.setAttribute("aria-label","打开菜单"),gt.setAttribute("aria-expanded","false");let _t=pt.querySelector(".navbar-container")||pt;return _t.insertBefore(gt,_t.firstChild),gt},qt=W=>{!W||W.dataset.urpppIconReady||(W.dataset.urpppIconReady="1",W.innerHTML=['<span class="urppp-menu-icon" aria-hidden="true">','<svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false">','<path d="M5 8h14"></path><path d="M5 16h10"></path>',"</svg>",'<svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false">','<path d="M7 7l10 10"></path><path d="M17 7 7 17"></path>',"</svg>","</span>"].join(""))},Tt=()=>{let W=Ct(),pt=document.getElementById("sidebar");W&&qt(W),W&&pt&&!W.__urpppToggleHandler&&(W.setAttribute("aria-label","打开菜单"),W.setAttribute("aria-expanded",pt.classList.contains("display")?"true":"false"),W.__urpppToggleHandler=lt=>{lt.preventDefault(),lt.stopImmediatePropagation(),N()&&I(pt,!0);let yt=W.getAttribute("aria-expanded")!=="true";H(pt,W,yt)},W.addEventListener("click",W.__urpppToggleHandler,!0)),document.__urpppMobileDrawerOutsideBound||(document.__urpppMobileDrawerOutsideBound=!0,document.addEventListener("click",lt=>{if(!N()||!lt.target.closest)return;let yt=document.getElementById("sidebar");if(!yt||!yt.classList.contains("display"))return;let gt=document.getElementById("urppp-clean-root");gt&&gt.classList.contains("open")||lt.target.closest("#sidebar, #urppp-mobile-menu-button")||F()},!0)),document.__urpppMobileRouteCloseBound||(document.__urpppMobileRouteCloseBound=!0,document.addEventListener("click",lt=>{if(!N()||!lt.target.closest)return;let yt=document.getElementById("urppp-clean-root");if(yt&&yt.classList.contains("open"))return;let gt=lt.target.closest("#sidebar a[href]");if(!gt)return;let _t=String(gt.getAttribute("href")||"").trim();!_t||_t==="#"||_t.startsWith("javascript")||F()}))},Ot=(W,pt)=>{let lt=W?W.cloneNode(!0):document.createElement("a");return lt.className="urppp-mobile-user-action",lt.removeAttribute("style"),lt.removeAttribute("id"),!W&&pt&&(lt.href=pt.href,pt.onclick&&lt.setAttribute("onclick",pt.onclick),lt.innerHTML='<i class="ace-icon fa '+pt.icon+'" aria-hidden="true"></i><span>'+pt.label+"</span>"),lt},Rt=(W,pt)=>{if(document.getElementById("urppp-mobile-user"))return;let lt=W.querySelector(":scope > li.light-blue")||Array.from(W.children).find(Gt=>Gt.querySelector&&Gt.querySelector(".nav-user-photo, .user-menu, .dropdown-menu")),yt=document.createElement("section");yt.id="urppp-mobile-user",yt.className="urppp-mobile-user";let gt=document.createElement("div");gt.className="urppp-mobile-user-identity";let _t=lt?.querySelector(".nav-user-photo")||document.querySelector("#navbar .nav-user-photo"),Mt=_t?_t.cloneNode(!0):document.createElement("img");Mt.className="nav-user-photo",Mt.removeAttribute("style"),Mt.getAttribute("src")||Mt.setAttribute("src","/main/queryStudent/img"),Mt.setAttribute("data-urppp-private","avatar"),Mt.alt=_t?.alt?.replace(/\s+/g," ").trim()||"用户头像";let Ht=lt?.querySelector(".user-info")||document.querySelector("#navbar .user-info"),he=document.createElement("span");he.className="urppp-mobile-user-copy";let Wt=document.createElement("small");Wt.className="urppp-mobile-user-welcome",Wt.textContent="欢迎您，";let pe=document.createElement("span");pe.className="user-info urppp-user-name-value",pe.setAttribute("data-urppp-private","name"),pe.textContent=Ht?.textContent?.replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim()||_t?.alt?.replace(/\s+/g," ").trim()||"我的账户",he.append(Wt,pe),gt.append(Mt,he),yt.appendChild(gt);let Bt=document.createElement("div");Bt.className="urppp-mobile-user-actions";let St=lt?Array.from(lt.querySelectorAll(".user-menu a, .dropdown-menu a")):[],Se=[{label:"首页",href:"/",icon:"fa-home"},{label:"在线反馈",href:"/main/systemQuestion/index",icon:"fa-question-circle"},{label:"修改密码",href:"javascript:changePassword('/student/rollManagement/personalInfoUpdate/updatePassword')",icon:"fa-user"},{label:"注销",href:"/logout",icon:"fa-power-off"}];St.length?St.forEach(Gt=>Bt.appendChild(Ot(Gt))):Se.forEach(Gt=>Bt.appendChild(Ot(null,Gt))),yt.appendChild(Bt);let $t=pt.querySelector(".urppp-sidebar-header");$t&&$t.nextSibling?pt.insertBefore(yt,$t.nextSibling):$t?pt.appendChild(yt):pt.insertBefore(yt,pt.firstChild);try{Zt(yt)}catch{}},It=(W,pt,lt,yt={})=>{if(!lt||document.getElementById("urppp-mobile-quick"))return;let gt=document.createElement("section");gt.id="urppp-mobile-quick",gt.className="urppp-mobile-quick",gt.innerHTML='<div class="urppp-mobile-quick-title">快捷功能</div>';let _t=document.createElement("div");_t.className="urppp-mobile-tool-row";let Mt=W.querySelector(':scope > li > a[href*="customerServiceCenter"]'),Ht=Mt?Mt.cloneNode(!0):document.createElement("a");Ht.className="urppp-mobile-tool-button urppp-mobile-help-button",Ht.removeAttribute("style"),Ht.removeAttribute("onclick"),Ht.removeAttribute("data-toggle"),Ht.removeAttribute("target"),Ht.querySelectorAll("[style]").forEach(St=>St.removeAttribute("style"));let he=String(Ht.getAttribute("href")||"").trim();(!he||he==="#"||he.startsWith("javascript"))&&(Ht.href="/main/customerServiceCenter"),Ht.querySelector("i")||(Ht.innerHTML='<i class="ace-icon glyphicon glyphicon-headphones" aria-hidden="true"></i>'),Ht.querySelectorAll("span").forEach(St=>St.remove()),Ht.insertAdjacentHTML("beforeend","<span>帮助</span>"),_t.appendChild(Ht);let Wt=document.createElement("button");Wt.type="button",Wt.id="urppp-mobile-search-button",Wt.className="urppp-mobile-tool-button",Wt.setAttribute("aria-expanded","false"),Wt.innerHTML='<i class="ace-icon fa fa-search" aria-hidden="true"></i><span>搜索</span>',_t.appendChild(Wt),gt.appendChild(_t);let pe=document.createElement("div");pe.className="urppp-mobile-quick-links",Array.from(W.querySelectorAll(":scope > li > a")).forEach(St=>{let Se=St.closest("li");if(Se?.classList.contains("light-blue")||Se?.querySelector("#intellegenceUDiv, #form-search")||St===Mt||St.classList.contains("dropdown-toggle")||!St.getAttribute("href")&&!St.getAttribute("onclick"))return;let $t=St.cloneNode(!0);$t.className="urppp-mobile-quick-link",$t.removeAttribute("style");let Gt=String(St.getAttribute("onclick")||"");if(/openWorkRestSchedule|open\w*Schedule/i.test(Gt)||$t.removeAttribute("onclick"),yt.cleanMode){let ca=String(St.getAttribute("href")||"");(ca==="/holiday"||/holiday/i.test(ca)||/假期/.test(St.textContent||""))&&($t.removeAttribute("href"),$t.removeAttribute("target"),$t.style.cursor="default",$t.style.pointerEvents="none")}pe.appendChild($t)});let Bt=document.createElement("div");Bt.id="urppp-mobile-search-panel",Bt.className="urppp-mobile-search-panel",Bt.hidden=!0;{let St=document.getElementById("form-search");St&&(St.__urpppMobileParent||(St.__urpppMobileParent=St.parentElement,St.__urpppMobileNext=St.nextSibling),St.classList.add("urppp-mobile-form-search"),St.dataset.open="0",Bt.appendChild(St),Z())}gt.appendChild(Bt),pe.children.length&&gt.appendChild(pe),Wt.addEventListener("click",St=>{if(St.preventDefault(),St.stopPropagation(),Bt.hidden){Z();let $t=Bt.querySelector("#form-search");$t&&($t.dataset.open="0",$t.style.setProperty("pointer-events","auto","important"),$t.style.setProperty("opacity","1","important"),$t.style.setProperty("width","100%","important"),$t.style.setProperty("min-width","0","important")),Bt.hidden=!1,Bt.classList.add("open"),setTimeout(()=>Bt.querySelector("#search-input")?.focus(),30),Wt.setAttribute("aria-expanded","true")}else Bt.hidden=!0,Bt.classList.remove("open"),Wt.setAttribute("aria-expanded","false")}),pt.insertBefore(gt,lt)},Ut=()=>{let W=N(),pt=document.querySelector("#navbar .navbar-buttons .ace-nav"),lt=document.getElementById("sidebar"),yt=document.getElementById("urppp-menus");if(lt&&I(lt,W),Tt(),!W){let gt=document.documentElement.classList.contains("urppp-clean-open");gt||ut(),gt||(document.getElementById("urppp-mobile-quick")?.remove(),document.getElementById("urppp-mobile-user")?.remove());let _t=document.getElementById("urppp-nav-clean"),Mt=document.getElementById("urppp-nav-theme");_t&&Mt&&_t.parentElement!==Mt&&Mt.appendChild(_t),Mt&&Mt.style.setProperty("display","inline-flex","important");return}if(!(!pt||!lt)){try{let gt=document.getElementById("urppp-nav-clean"),_t=document.querySelector("#navbar .navbar-header"),Mt=document.getElementById("urppp-nav-theme");gt&&_t&&gt.parentElement!==_t&&_t.appendChild(gt),Mt&&Mt.style.setProperty("display","inline-flex","important"),document.getElementById("urppp-nav-cal")?.remove()}catch{}Rt(pt,lt),It(pt,lt,yt),Z()}};window.__urpppRefreshMobileNavbar=Ut,window.__urpppCloseMobileDrawer=F,window.__urpppSetDrawerOpen=(W,pt,lt)=>{H(W,pt,lt)},window.__urpppStopDrawerAnimation=W=>{W&&Q(W)},window.__urpppInjectCleanSidebarSections=W=>{let pt=document.querySelector("#navbar .navbar-buttons .ace-nav")||document.querySelector("#navbar .ace-nav"),lt=document.getElementById("urppp-menus");if(!pt||!W)return;try{Rt(pt,W)}catch{}let yt=document.getElementById("urppp-mobile-quick");if(yt){let gt=yt.querySelector("#urppp-mobile-search-panel");if(gt&&gt.querySelector("#form-search"))try{ut()}catch{}yt.remove()}try{It(pt,W,lt,{cleanMode:!0})}catch{}};try{Ut()}catch{}if(setTimeout(Ut,300),setTimeout(Ut,900),setTimeout(Ut,1800),window.matchMedia){let W=window.matchMedia(T),pt=()=>Ut();typeof W.addEventListener=="function"?W.addEventListener("change",pt):typeof W.addListener=="function"&&W.addListener(pt)}try{window.__urpppMobileNavbarObserver&&window.__urpppMobileNavbarObserver.disconnect();let W=0,pt=new MutationObserver(()=>{clearTimeout(W),W=setTimeout(()=>{try{Ut()}catch{}},40)}),lt=document.getElementById("navbar"),yt=document.getElementById("sidebar");lt&&pt.observe(lt,{childList:!0,subtree:!0}),yt&&pt.observe(yt,{childList:!0}),window.__urpppMobileNavbarObserver=pt}catch{}}let m=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches)?"8px 8px 24px":"16px 64px 40px";if(document.querySelectorAll(".page-content, #page-content-template").forEach(T=>{T.style.setProperty("padding",m,"important"),T.style.setProperty("box-sizing","border-box","important")}),Ur(),$a(),Jr(),We(),Fa(),setTimeout(()=>{We(),Fa()},300),setTimeout(()=>{We(),Fa()},1e3),pn(),nn(),on(),ve(),Ba(),mr(),sn(),setTimeout(()=>{ve(),mr()},200),setTimeout(()=>{ve(),mr()},800),setTimeout($a,350),setTimeout($a,1e3),br(),setTimeout(()=>br(),400),!window.__urpppPlanTreeObs){let T=0;window.__urpppPlanTreeObs=new MutationObserver(()=>{let I=document.getElementById("treeDemo");!I||I.dataset.urpppBusy==="1"||I.querySelector('li > a:not([data-urppp-node-done="1"])')&&(clearTimeout(T),T=setTimeout(()=>br(),220))});let N=document.getElementById("tree_div")||document.getElementById("treeDemo");N&&window.__urpppPlanTreeObs.observe(N,{childList:!0,subtree:!0})}window.__urpppWrsBound||(window.__urpppWrsBound=!0,document.addEventListener("shown.bs.modal",T=>{T.target&&(T.target.id==="work_rest_schedule_modal"||T.target.querySelector?.("#work_rest_schedule_modal"))&&setTimeout(Da,30)},!0),document.addEventListener("click",T=>{let N=T.target&&T.target.closest?T.target.closest("a,button"):null;if(!N)return;let I=N.getAttribute("onclick")||"",O=(N.textContent||"").trim();(I.includes("openWorkRestSchedule")||O.includes("作息时间表"))&&(setTimeout(Da,80),setTimeout(Da,300))},!0)),Hr(),st(),dt(),ja();let A=()=>{Ur(),Jr(),Hr()};setTimeout(A,200),setTimeout(A,800),window.__urpppLoadBound||(window.__urpppLoadBound=!0,window.addEventListener("load",()=>{st(),dt(),at(),ja(),Hr(),Ur(),Jr()})),setTimeout(()=>{document.body.classList.add("urppp-ready"),kt()},600),console.log("[URP++] style applied apple-leaning");try{bindScheduleHoverNearCursor()}catch{}wn()}function Ns(t){if(!t)return;let e=t.querySelector("#urppp-set-brutal-palettes");if(!e)return;let r=Qo();e.innerHTML="",Y.filter(a=>a.id!==J).forEach(a=>{let p=document.createElement("button");p.type="button",p.className="urppp-set-scheme"+(a.id===r.id?" ac":""),p.dataset.palette=a.id,p.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:#000"></span>','  <span style="background:'+a.accent+'"></span>','  <span style="background:'+a.secondary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+a.name+"</strong>","  <em>"+a.desc+"</em>","</div>"].join(""),p.addEventListener("click",()=>Zo(a.id,{select:!0})),e.appendChild(p)})}let Vr=ui({getPrivacySettings:Pe,setPrivacySettings:La,getCustomIdentity:Oe,setCustomIdentity:Uo,applyDisplay:()=>Zt(document),refreshCleanDisplay:mo,finishActiveDirectEdit:t=>{Ae?.__finish&&Ae.__finish(t)}}),Bs=Vr.sync,Cd=Vr.collect,Pd=Vr.setStatus,Fs=Vr.bind,Ga=ci({document,getSettings:jr,setSettings:Go,validateMapping:Fe,defaultMapping:Tr,getRecoveryMessage:()=>rt}),zd=Ga.setStatus,Ds=Ga.sync,js=Ga.bind;function jt(){let t=document.getElementById("urppp-settings-panel");if(!t)return;let e=Xt()||bt,r=je(),a=Qt(),p=te(),i=re(),l=Re(i),b=He(i),m=Yo(i),A={};t.querySelectorAll(".urppp-set-mode").forEach(I=>{A[I.dataset.theme]=dr(I.dataset.theme,i)}),bi(t,{seed:e,currentTheme:a,followSystem:p,skinId:i,darkSupported:l,dynamicSupported:b,fixedPalettes:m,followUseDynamic:Rr(),cleanDefault:Ca(),cleanAnalysis:Pa()?"direct":"tab",appleEdge:Ce(),autoUpdate:za(),modeAvailability:A}),m&&Ns(t);try{Bs(t)}catch{}try{Ds(t)}catch{}try{window.__urpppCleanMode&&typeof window.__urpppCleanMode.refreshRender=="function"&&window.__urpppCleanMode.refreshRender()}catch{}let T=t.querySelector("#urppp-set-presets");T&&(T.innerHTML="",Ea().forEach(I=>{let O=document.createElement("button");O.type="button",O.className="urppp-set-swatch"+(I.toLowerCase()===e.toLowerCase()?" ac":""),O.title=I,O.style.background=I,O.addEventListener("click",()=>{GM_setValue(L,I),te()?Jt(xe(),{system:!0}):Jt("scu-red",{manual:!0}),jt()}),T.appendChild(O)}));let N=t.querySelector("#urppp-set-schemes");N&&(N.innerHTML="",De(e).forEach(I=>{let O=document.createElement("button");O.type="button",O.className="urppp-set-scheme"+(I.id===r?" ac":""),O.dataset.scheme=I.id,O.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+I.bg+'"></span>','  <span style="background:'+I.surface+";border-color:"+I.border+'"></span>','  <span style="background:'+I.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+I.name+"</strong>","  <em>"+I.desc+"</em>","</div>"].join(""),O.addEventListener("click",()=>{_a(I.id),GM_setValue(L,e),te()?Jt(xe(),{system:!0}):Jt("scu-red",{manual:!0}),jt()}),N.appendChild(O)}));try{pl(t)}catch(I){try{console.warn("[URP++] renderSkinCards",I)}catch{}}try{let I=t.querySelector(".urppp-about-ver, #urppp-about-ver");I&&(I.textContent="SCU URP++ v"+o,I.tagName==="A"&&(I.setAttribute("href",n.repo),I.setAttribute("target","_blank"),I.setAttribute("rel","noopener noreferrer")))}catch{}try{En(t)}catch{}}let kn=si({document,ensurePanel:Cn,syncPanel:jt,refreshUpdateStatus:Gn}),Os=mi({document,theme:{isModeAvailable:dr,apply:Jt,supportsDark:Re,supportsDynamic:He,getFollowSystem:te,setFollowSystem:Br,resolveFollowTheme:xe,getCurrent:Qt,getFollowDynamic:Rr,setFollowDynamic:Ta,syncNavbar:xt},preferences:{getCleanDefault:Ca,setCleanDefault:fs,getCleanAnalysis:()=>Pa()?"direct":"tab",setCleanAnalysis:gs,getAppleEdge:Ce,setAppleEdge:xs,applySkin:oe,getAutoUpdate:za,setAutoUpdate:ys,checkUpdates:no},accent:{normalize:Yt,setAccent:t=>GM_setValue(L,t),savePreset:hs,getScheme:je,setScheme:_a,listSchemePreviews:De},syncPanel:jt}),Et=To({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:o},uiDeps:{openSubpanel:t=>{t==="plugin-store"&&Ja("plugin")}}});(function(){let e=()=>{try{Et.bootFromCache("assist")}catch{}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()})();function An(){return kn.open()}function Sn(){kn.close()}let Yr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=",Rs="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAJTElEQVR4nORbfWxbVxW/7773/J6f7SRO07VNGydpkjbJ2qbQURioEkgI/gBpgICpg8EfqIIhxMeAfzoE0gBpoK2D7g8QZRQxxDQhMYkPIYQ0PrQhbaxlS5u0adPEbUKWLEkdO87ze35fO+faz3FcO7Edx7G9n/Ry/T6u43Pu+brnnEfJ2xwC2WK0te0/oDTL36GEDnIcCXIcbSKEUzhKJY7jeHzGcRzLsW0dPqmOY8cch0RsYo8mYvqj8/M3xskWgiNbgI6ug/fxvPgQz9P3Ul4IAKGkHABjiGWZy7ZlvWiaxlPTN6/9lVQYFWVA5/67fy+K4scoz2ckC1aUGIZBbMsktm2zAwlzbIuN7EcAgzjKs5FSCiMlvCASQRQJzWIeMMIwzeTz4Ruj95MKoRIM4ELd/T8RPTKsOC/iBcs0GNEmHvCZ28R/wa9ERoiiB5iS4qtlm0bSMM5O3Rj9Npw6ZBPYFAM6Ovsf9sjS92HBFTxHYhNqHFeKbAVQsGTFRwSB8ZmYlrli6trpW+Gxs6RMlMsAuav30EWPRxrAEwsI1hIrsOJJUg0IIA2yVyGupiV1/VL4xuV3wUedlIiSGbBnT9+AElBeBnEMoD7rmgqHtikxLxceSSaSrDC7YZpmTI3pQ7OzV8OlfAdfysOh0MFPev2+F3iBl3HVV5ajTN+3g3gEeAiwNTqzEYIgSKIkfEXxBUZi0dtXiv2OohnQ0T34uKwoZ4DbFHUdid+k/akMwJOACjC7AFJJQT0+7Q+0+KJLC38vZnpRDOjcP3AGdO5hcFOcridIYmWZ1BqMpM5UARjBgUS8Twm0NMciC3/baN6GDOjo6jspe/2P42ctAfoOR62CGWHQR5QGURDvVXzN12JLC5fXm7Ou9u4O9Q76laZhSjkeOazW4MrnA9gBInokDLqsuLp8ZPbW+GihZ2mhGzt37vT7vb5XkHjU+XohHoG/1TJNVAkeaHi5vb1dKfRsQQYEWvaMQBzvQ1enxmOk1nFyRzP548EuNiJW4lEWdgMNfsnfdqnQvLwMCPUM/hgMSQhjdfwiN2avJ2T/drAH+zu7Bx7N91w+G0B7+4+qID0ShrVJXSO1jB927CKHFe8d1y+pCfLI1BwES17ihfDZtuzE+Nj//HDLzn7uDgno6jl0BokH+1HzxBeDJLjtlCpQb3fPoR/l3l8jAb29vRInBGKQrPCgIUHLXy9A3T/ZFiTPLkTIs4vRNffQI6BngKRL8vpVClJwwXDvrZEAg3ifQuIxzK0n4jcC0oJhM9LW1af/NPveWgnof4cGrkPCMBddXyNBEDzEF2hybUHGLWYkYG/XwHuQeNT9RiMeAZmkjC0IhfqPudczDBAF/us4GlXa028HcOeI4DzCN9xrmdwdT+kH2UPJjRnw+iure4yfnXuG/Pzcb0u+l4uh4x8u6v+VMi8XJtAmgVvkuRStCCYBd3V374KIqZVlYetU/HMjwXxA1UYaYdt8F3i8JrzGGKBw3q/hVheTmI2OVJKW4yxH/CqeMxUA93AvjugqqoX/XnydvHphOHP+pVOfzXzG669eHC5q3vnjR8iO6OpeBWMBPNxIMBeYnofAgDic8AE4/UHKBnDcbhwwh18tIBEFbQd5piADcud94r4PES1a/GbNttO1CNjw4piSAI40p25WjwGVwq5HvsnG6B/+RJae/3PeSDAbLo2gBUEcUwwgXADHakrAdsFxFzm96GkbwMs4blVBIx8eOvUgO1wU687KnefCXWTKUUZzWgUyVVrS6MBIl4FyrLzE3CCUKlN7gsan/w4amQQ4tmNAfljkKFc1KaiUGywV4PLZyGgmLgMcJwGDiCVqp0qxQKXcYKnARUakaU6rgGPHsm82MmjK3GVoTsmD7URSNylpdLgqABxYxMHdDWLMeJgrgwG5bikb9xw7Qsg5UlOgrgrYDouTGcWwB3gJR0HY8p6pbQdNNbGAAJgvsnP8sxxNPglGwcHGg0aHCKV0pPXm5PITeM6WPBKZiAZ3HpmDouJubE7aKCeArsjFzMwcmXljddfFxD6Nf/zzP2vmYYLERa4rK/deKcC8IDZiQRF1Fn45q/JmzH6o5+5fy5L8eez20BJx0ojwKn7WVaJriV/dnBj9Al7LWD3eNs/gKHoaVw1c2iziPOZeyzBgcnJsGOoBKjYZiA1oCwSPh/UfWrYZn564ct29vsbvmbb5NI6y10caDd40TYZp/zL7em7oJ0BxJApSoNRbaWw9oN6j/kMyJDF+dW2BNDfyMS3D+B5+aCQpwFY6BKTFT5Oc6nDe4L/34NAipsmx+REsJqlnIPHYVAnJnsXxsdfacu/njX2TlvFFdzLlS2olrClgJ6kkp3oHDFM/le+Zgtu/7r7D/wZvcAKTiPFYpO6yRRjw+JuCrHUObNm/Jscvvz/vc+t8B+05MDQDVZRdq42R9QN/oIV1l4NRm50YG24nBfJd623/7Oht7Z0gAQb23WGDQb1A8TUx4iH/l4xHlo+SdZJ96+5/FxbGZnRN/RQWE7DLwrWmtQwJvBdGfDZkf7WE+vE335ycW+/5DS1cbGlxLNAc9IAUnMCmZB6MYq2W0FFKJfD5aK8MTfvuVHjs6Y3mFGXio5H5F3yBYBCs6rtBtDgMld1aey0AQ1x/oJm9R4BbXV3Xzt6avHK6qLmkBHR29j8ger2/wQ5MzK+vxGNVLabkA7o6xd/ErD22xuraymemwteeK3Z+yVnQvV19R2XZ9xJPeQWrLNhKp21TA7Uk++CQmcuDrFZc09UT/w9ff62U7ygrDdza2trUsmPfZbAJHXjO3hzBTnK9Om+OZL8pgjANY2p56Y3B+fn5khMZZYV5iURCj9yee9IXaJWB3uM8vi4Gljfdob1afqogWMurRwZxDzAGpFddT2raE+GJkY+oqlqWZa7EeomhnsFfiKL0IA+2AS9gnyH27rPDTG7i3zgsjYV7eRz5dFju2JaZ1I3zNydHvgynm6rkVExg9+3b5xXk5ufAEn+UZlVYMIbAHKNlGZkXJwl7cdJmvhojFJrnxUlBFCAxI635HzDXBob+xdSi909PT1dkl1ZxjW1vP6aIivoAdcTPUZ7ewwu8l2wClmklbMu+YHPmec5UfxcOhyvawLzlJmvv3gNDgiR8C1Z1ABY2CGtc1MvTMF7R1eRjs7PjI2QL0fjFwA3wFgAAAP//9xCJogAAAAZJREFUAwAJZkVSj1sY7gAAAABJRU5ErkJggg==";function _n(){try{let t=document.head||document.documentElement;t.querySelectorAll("link[rel]").forEach(r=>{let a=(r.getAttribute("rel")||"").toLowerCase();a.includes("icon")&&!a.includes("apple-touch")&&r.remove()});let e=document.createElement("link");e.rel="shortcut icon",e.href=Rs,t.appendChild(e)}catch{}}function En(t){let e=t&&t.querySelector?t.querySelector("#urppp-about-logo"):document.getElementById("urppp-about-logo");e&&(e.getAttribute("src")!==Yr&&e.setAttribute("src",Yr),e.removeAttribute("referrerpolicy"),e.alt="SCU URP++",e.style.maxWidth="100%",e.style.height="auto",e.style.display="block")}function Cn(){if(document.getElementById("urppp-settings-panel"))return;gl();try{oe()}catch{}try{Vt&&Vt.length&&ze(Vt)}catch{}let t=document.createElement("div");t.id="urppp-settings-mask",t.addEventListener("click",Sn);let e=document.createElement("div");e.id="urppp-settings-panel",e.setAttribute("role","dialog"),e.setAttribute("aria-label","URP++ 设置");let r=Yr;e.innerHTML=li({logoData:Yr,repositoryUrl:n.repo,version:o}),document.documentElement.appendChild(t),document.documentElement.appendChild(e),ii(e),e.querySelector("#urppp-set-close").addEventListener("click",Sn);try{Fs(e)}catch(p){console.warn("[URP++] privacy settings",p)}try{js(e)}catch(p){console.warn("[URP++] JSON settings",p)}try{En(e)}catch{}let a=e.querySelector("#urppp-about-logo");a&&!a.__urpppFallback&&(a.__urpppFallback=!0,a.addEventListener("error",()=>{a.dataset.fallback!=="1"&&(a.dataset.fallback="1",a.src=r)})),Os.bind(e);try{Et.renderAssistUi(e.querySelector("#urppp-set-assist-slot"))}catch(p){console.warn("[URP++] plugin manager",p)}}function Ja(t){let e=document.getElementById("urppp-settings-panel");if(!e)return;let r=document.getElementById("urppp-store-subpanel");r||(r=document.createElement("div"),r.id="urppp-store-subpanel",r.className="urppp-store-subpanel",r.innerHTML=`
        <div class="urppp-store-sub-head">
          <button type="button" class="urppp-store-sub-back" id="urppp-store-sub-back" aria-label="返回">←</button>
          <div class="urppp-store-sub-title" id="urppp-store-sub-title"></div>
        </div>
        <div class="urppp-store-sub-body" id="urppp-store-sub-body"></div>`,e.appendChild(r),r.querySelector("#urppp-store-sub-back").onclick=Hs);let a=r.querySelector("#urppp-store-sub-title"),p=r.querySelector("#urppp-store-sub-body");a.textContent=t==="theme"?"主题商店":"插件商店",p.innerHTML="",t==="theme"?tl(p):jn(p),r.classList.add("open")}function Hs(){let t=document.getElementById("urppp-store-subpanel");if(!t)return;t.classList.remove("open");let e=t.querySelector("#urppp-store-sub-body");e&&(e.innerHTML="")}function Pn(t){t.querySelectorAll(".urppp-store-tab").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll(".urppp-store-tab").forEach(a=>a.className="urppp-store-tab"),e.className="urppp-store-tab ac",t.querySelectorAll(".urppp-store-pane").forEach(a=>a.style.display="none");let r=t.querySelector('.urppp-store-pane[data-pane="'+e.dataset.tab+'"]');r&&(r.style.display="")})})}function ze(t){Array.isArray(t)&&t.forEach(e=>{if(!e||!e.id)return;let r="";try{r=GM_getValue("urppp_card_css_"+e.id,"")||""}catch{}let a=r||e.cardCss||"";if(!a)return;let p=document.getElementById("urppp-store-card-css-"+e.id);p||(p=document.createElement("style"),p.id="urppp-store-card-css-"+e.id,(document.head||document.documentElement).appendChild(p)),p.textContent!==a&&(p.textContent=a)})}function Us(t,e){let r=(u.find(b=>b.id===t.id)||{}).repo,a=t.repo||r,p=a?`<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${X(a)}">仓库</button>`:"",i=t.cardCss||"",l=i?`<style>${i}</style>`:"";return`<div class="urppp-skin-card" data-skin="${X(t.id)}">
      ${l}
      <div class="urppp-skin-name">${X(t.name||t.id)}</div>
      <div class="urppp-skin-meta">${X(t.author||"")}${t.author&&t.version?" · ":""}v${X(t.version||"")}<span class="urppp-dows" data-dows-id="${X(t.id)}"></span></div>
      <p class="urppp-skin-desc">${X(t.description||"")}</p>
      <button type="button" class="urppp-skin-apply" data-store-theme="${X(t.id)}"${e?" disabled":""}>${e?"已安装":"下载"}</button>
      ${p}
    </div>`}async function gr(t){let e=t.querySelector('[data-pane="download"]');if(!e)return;let r=a=>{if(!a.length){e.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载主题</p><p class="urppp-store-sub">已安装的主题不会再显示在这里。</p></div>';return}ze(a),e.innerHTML=`<div class="urppp-store-theme-grid">${a.map(p=>Us(p,!1)).join("")}</div>`,e.querySelectorAll("[data-store-theme]").forEach(p=>{p.addEventListener("click",()=>Ws(p.dataset.storeTheme,p))}),e.querySelectorAll("[data-repo]").forEach(p=>p.addEventListener("click",()=>{try{window.open(p.dataset.repo,"_blank","noopener")}catch{}}));try{yr(e)}catch{}};r((Vt||[]).filter(a=>a.type==="theme"&&!de(a.id)));try{let a=await we(!0);Vt=a,Qa(a),e.isConnected&&r(a.filter(p=>p.type==="theme"&&!de(p.id)))}catch{}}async function Ws(t,e){if(!e||e.disabled)return;e.disabled=!0,e.textContent="下载中…";let r=(await we()).find(l=>l.id===t);if(!r||!Array.isArray(r.entry)||!r.entry.length){e.disabled=!1,e.textContent="下载";return}let a=await In(r);if(a==="fail"&&!await ta("签名校验失败：该条目可能被篡改。是否仍要安装？")){e.disabled=!1,e.textContent="下载";return}if(a==="unknown"&&r._srcPub&&!await ta("该源无有效签名校验，可能被篡改。是否自担风险继续下载？")){e.disabled=!1,e.textContent="下载";return}let p="";for(let l of r.entry)try{let b=await Promise.race([fetch(l,{cache:"no-store"}),new Promise((m,A)=>setTimeout(()=>A(new Error("timeout")),6e3))]);if(b&&b.ok){p=await b.text();break}}catch{}if(!p){qe("下载失败：所有源均不可达（本地测试源已关/网络不通）","error"),e.textContent="下载失败",setTimeout(()=>{e.textContent="下载",e.disabled=!1},1400);return}try{GM_setValue("urppp_theme_css_"+t,p)}catch{}if(u.some(l=>l.id===t)||Jo(t,{name:r.name||t,desc:r.desc||"下载主题",author:r.author||"",version:r.version||"1.0.0"}),r.cardCss)try{GM_setValue("urppp_card_css_"+t,r.cardCss)}catch{}try{Ma(t).textContent=p}catch{}try{ze([{id:t,cardCss:r.cardCss||""}])}catch{}e.textContent="已安装",e.disabled=!0;try{Ka(t,r._srcUrl)}catch{}let i=e.closest&&e.closest(".urppp-store-inline");if(i){try{let l=i.querySelector("#urppp-theme-manage");l&&await Qr(l)}catch{}try{gr(i)}catch{}}try{jt()}catch{}}function Gs(t,e){let a=t.installed!==!1?"":`<button type="button" class="urppp-skin-apply urppp-store-del" data-theme-del="${X(t.id)}">删除</button>`,p=e&&e.repo||t.repo,i=p?`<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${X(p)}">仓库</button>`:"",l=re()===t.id,b=e&&e.cardCss||"";if(!b)try{b=GM_getValue("urppp_card_css_"+t.id,"")||""}catch{}let m=b?`<style>${b}</style>`:"";return`<div class="urppp-skin-card${l?" is-active":""}" data-skin="${X(t.id)}">
      ${m}
      <div class="urppp-skin-name">${X(t.name)}</div>
      <div class="urppp-skin-meta">${X(e&&e.author||"")}${e&&e.author&&t.version?" · ":""}v${X(t.version||"")}<span class="urppp-dows" data-dows-id="${X(t.id)}"></span></div>
      <p class="urppp-skin-desc">${X(t.desc||"")}</p>
      <button type="button" class="urppp-skin-apply${l?" is-current":""}" data-theme-use="${X(t.id)}"${l?" disabled":""}>${l?"使用中":"使用"}</button>
      ${a}${i}
    </div>`}async function Qr(t){if(!t)return;let e=Vt||[],r=ye(),a=Object.keys(r).map(i=>({id:i,name:r[i].name||i,desc:r[i].desc||"本地主题",version:r[i].version||"1.0.0",author:r[i].author||"本地",installed:!1})),p=u.filter(i=>i.installed!==!1||de(i.id)).concat(a.filter(i=>!u.some(l=>l.id===i.id)));if(!p.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无已装主题</p></div>';return}ze(p.map(i=>{let l="";try{l=GM_getValue("urppp_card_css_"+i.id,"")||""}catch{}return{id:i.id,cardCss:l||(e.find(b=>b.id===i.id)||{}).cardCss||""}})),t.innerHTML=`<div class="urppp-store-theme-grid">${p.map(i=>Gs(i,e.find(l=>l.id===i.id))).join("")}</div>`;try{yr(t)}catch{}t.querySelectorAll("[data-theme-use]").forEach(i=>i.addEventListener("click",()=>{if(Xo(i.dataset.themeUse)){try{jt()}catch{}t.querySelectorAll(".urppp-skin-card").forEach(l=>{let b=l.dataset.skin,m=l.querySelector(".urppp-skin-apply"),A=re()===b;l.classList.toggle("is-active",A),m&&(m.classList.toggle("is-current",A),m.disabled=A,m.textContent=A?"使用中":"使用")})}})),t.querySelectorAll("[data-theme-del]").forEach(i=>i.addEventListener("click",()=>{let l=i.dataset.themeDel,b=re()===l;try{GM_setValue("urppp_theme_css_"+l,"")}catch{}try{GM_setValue("urppp_card_css_"+l,"")}catch{}ws(l),As(l);try{if(b){GM_setValue(d,"apple");try{document.documentElement.removeAttribute("data-urppp-skin")}catch{}try{document.body&&document.body.removeAttribute("data-urppp-skin")}catch{}oe();let A=te(),T=A?xe():Qt();Jt(T,{system:A})}}catch{}try{jt()}catch{}let m=t.closest(".urppp-store-inline");if(m){try{Qr(t)}catch{}try{gr(m)}catch{}}})),t.querySelectorAll("[data-repo]").forEach(i=>i.addEventListener("click",()=>{try{window.open(i.dataset.repo,"_blank","noopener")}catch{}}))}function zn(){return`<div class="urppp-store-settings">
      <button type="button" class="urppp-set-follow" data-store-auto-update>自动检测更新：关</button>
      <button type="button" class="urppp-set-btn" data-store-check-update>检查更新</button>
    </div>`}let Ln=["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json"],Js=["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/sources.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/sources.json","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/sources.json"];function Va(t,e=5e3){return new Promise(r=>{try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:"GET",url:t,timeout:e,onload:a=>r(a&&a.responseText||""),onerror:()=>r(""),ontimeout:()=>r("")});return}fetch(t,{cache:"no-store"}).then(a=>a&&a.ok?a.text():"").then(a=>r(a||"")).catch(()=>r(""))}catch{r("")}})}function qn(t){try{let e=JSON.parse(t);return e&&Array.isArray(e.items)?e:null}catch{return null}}let Ya=null;async function Tn(t){if(Ya&&!t)return Ya;let e=await Promise.allSettled(Js.map(r=>Va(r)));for(let r of e)if(!(r.status!=="fulfilled"||!r.value))try{let a=JSON.parse(r.value);if(a&&Array.isArray(a.sources))return Ya=a,a}catch{}return null}let xr=Ln[0];function Le(){try{let t=JSON.parse(GM_getValue("urppp_store_sources","[]")),e=Array.isArray(t)?t:[],r=!1;for(let a of e)a&&"hidden"in a&&(delete a.hidden,r=!0);if(GM_getValue("urppp_sources_migrated",!1)||(e.some(a=>a&&a.url===xr)||e.unshift({name:"SCU URP++ 官方商店仓库",url:xr,mirrors:Ln.slice(),enabled:!0}),GM_setValue("urppp_sources_migrated",!0),r=!0),r)try{GM_setValue("urppp_store_sources",JSON.stringify(e))}catch{}return e}catch{return[]}}function Kr(t){try{GM_setValue("urppp_store_sources",JSON.stringify(t))}catch{}}function Vs(){try{let t=GM_getValue("urppp_catalog_cache","");return t&&JSON.parse(t)||null}catch{return null}}function Qa(t){try{Array.isArray(t)&&t.length&&GM_setValue("urppp_catalog_cache",JSON.stringify(t))}catch{}}let Vt=Vs();async function we(t){if(Vt&&!t)return Vt;let e=async l=>qn(await Va(l)),r=Le().filter(l=>l&&l.url&&l.enabled!==!1),a=await Promise.allSettled(r.map(async l=>{let b=Array.isArray(l.mirrors)&&l.mirrors.length?l.mirrors:[l.url];b.includes(l.url)||b.unshift(l.url);let m=null;for(let A of b)if(m=await e(A),m)break;return{doc:m,pubkey:m&&m.pubkey||""}})),p=[],i=new Set;for(let l of a){if(!(l.status==="fulfilled"&&l.value&&l.value.doc))continue;let b=l.value.pubkey||"";for(let m of l.value.doc.items)!m||!m.id||i.has(m.id)||(i.add(m.id),b&&(m._srcPub=b),m._srcUrl=s.url,p.push(m))}return Vt=p,Qa(p),p}function Ys(){try{if(typeof crypto<"u"&&crypto&&crypto.subtle)return crypto.subtle;let t=typeof unsafeWindow<"u"&&unsafeWindow?unsafeWindow:typeof window<"u"?window:null;if(t&&t.crypto&&t.crypto.subtle)return t.crypto.subtle}catch{}return null}function Zr(t){if(Array.isArray(t))return t.map(Zr);if(t&&typeof t=="object"){let e={};for(let r of Object.keys(t).filter(a=>a!=="signature"&&a!=="_srcPub").sort())e[r]=Zr(t[r]);return e}return t}function Xr(t){try{let e=atob(t),r=new Uint8Array(e.length);for(let a=0;a<e.length;a+=1)r[a]=e.charCodeAt(a);return r}catch{return null}}async function Qs(t,e){let r=Ys();if(!r)try{if(!e||!t||!t.signature)return!1;let a=Xr(e),p=Xr(t.signature);if(!a||!p)return!1;let i=JSON.stringify(Zr(t));return Dp(p,a,Po(i))}catch{return null}if(!e||!t||!t.signature)return!1;try{let a=Xr(e);if(!a)return null;let p=await r.importKey("raw",a,{name:"Ed25519"},!1,["verify"]),i=Xr(t.signature);if(!i)return!1;let l=JSON.stringify(Zr(t)),b=await r.digest("SHA-256",new TextEncoder().encode(l)),m=new Uint8Array(b);return await r.verify({name:"Ed25519"},p,i,m)}catch{return null}}function qe(t,e){try{let r=document.getElementById("urppp-toast");r||(r=document.createElement("div"),r.id="urppp-toast",r.className="urppp-toast",(document.body||document.documentElement).appendChild(r)),r.textContent=t,r.className="urppp-toast"+(e==="error"?" error":""),r.style.display="",r.style.pointerEvents="auto",r.style.transition="opacity .22s, transform .22s",r.style.opacity="0",r.style.transform="translateY(14px)",requestAnimationFrame(()=>{r.style.opacity="1",r.style.transform="none"}),clearTimeout(r._t),r._t=setTimeout(()=>{r.style.pointerEvents="none",r.style.opacity="0",r.style.transform="translateY(20px)",setTimeout(()=>{r.style.display="none"},260)},3200)}catch{try{window.alert(t)}catch{}}}function ta(t){return new Promise(e=>{try{let r=document.getElementById("urppp-confirm");r||(r=document.createElement("div"),r.id="urppp-confirm",r.className="urppp-confirm",r.innerHTML='<div class="urppp-confirm-card"><div class="urppp-confirm-txt"></div><div class="urppp-confirm-ops"><button type="button" class="urppp-set-btn ghost" data-cac>取消</button><button type="button" class="urppp-set-btn" data-ok>继续</button></div></div>',(document.body||document.documentElement).appendChild(r)),r.style.display="",r.querySelector(".urppp-confirm-txt").textContent=t,r.style.pointerEvents="auto",r.style.transition="opacity .22s, transform .22s",r.style.opacity="0",r.style.transform="translateY(14px)",requestAnimationFrame(()=>{r.style.opacity="1",r.style.transform="none"});let a=p=>{r.querySelector("[data-ok]").onclick=r.querySelector("[data-cac]").onclick=null,r.style.pointerEvents="none",r.style.opacity="0",r.style.transform="translateY(20px)",setTimeout(()=>{r.style.display="none"},260),e(p)};r.querySelector("[data-ok]").onclick=()=>a(!0),r.querySelector("[data-cac]").onclick=()=>a(!1)}catch{try{e(window.confirm(t))}catch{e(!1)}}})}let ke="https://api.yanjiangrd.site";function Ks(){return new Promise(t=>{let e=!1,r=a=>{e||(e=!0,t(a))};try{let a=GM_getValue("urppp_downs_salt","");if(a)return r(a);if(!ke||typeof GM_xmlhttpRequest!="function")return r("");GM_xmlhttpRequest({method:"GET",url:ke+"/downs/salt",timeout:8e3,onload:p=>{try{let i=String((JSON.parse(p.responseText)||{}).salt||"");if(/^[0-9a-f]{16,128}$/.test(i)){try{GM_setValue("urppp_downs_salt",i)}catch{}r(i)}else r("")}catch{r("")}},onerror:()=>r(""),ontimeout:()=>r("")}),setTimeout(()=>r(""),9500)}catch{r("")}})}function Zs(){try{let t=GM_getValue("urppp_downs_sid","");if(t&&/^\d{6,20}$/.test(t))return t;let e=document.getElementById("urppp-user");if(e&&/^\d{6,20}$/.test(String(e.value||"").trim())){let a=String(e.value).trim();try{GM_setValue("urppp_downs_sid",a)}catch{}return a}let r=String(location.search||"").match(/[?&](?:userAccount|sno)=(\d{6,20})/);if(r){try{GM_setValue("urppp_downs_sid",r[1])}catch{}return r[1]}}catch{}return""}async function Ka(t,e){try{if(!ke||!t)return;let r=await Tn(),a=r&&Array.isArray(r.sources)?r.sources.map(A=>A&&A.url).filter(Boolean):[];if(!e||!a.includes(e))return;let p=await Ks();if(!p)return;let i=Zs();if(!i)return;let l=Po(new TextEncoder().encode(p+"|"+i+"|"+t)),b="";for(let A=0;A<16;A++)b+=l[A].toString(16).padStart(2,"0");let m=JSON.stringify({id:String(t),uid:b});try{await Promise.race([fetch(ke+"/downs",{method:"POST",headers:{"Content-Type":"application/json"},body:m}),new Promise((A,T)=>setTimeout(()=>T(new Error("timeout")),6e3))]);return}catch{}try{typeof GM_xmlhttpRequest=="function"&&GM_xmlhttpRequest({method:"POST",url:ke+"/downs",timeout:8e3,headers:{"Content-Type":"application/json"},data:m,onerror:()=>{},ontimeout:()=>{}})}catch{}}catch{}}function Mn(t){let e=ke+"/downs?ids="+encodeURIComponent(t.join(",")),r=()=>new Promise(a=>{let p=!1,i=l=>{p||(p=!0,a(l||{}))};try{if(typeof GM_xmlhttpRequest!="function")return i({});GM_xmlhttpRequest({method:"GET",url:e,timeout:8e3,onload:l=>{try{i(JSON.parse(l.responseText)||{})}catch{i({})}},onerror:()=>i({}),ontimeout:()=>i({})}),setTimeout(()=>i({}),9500)}catch{i({})}});return(async()=>{try{let a=await Promise.race([fetch(e,{cache:"no-store"}),new Promise((p,i)=>setTimeout(()=>i(new Error("timeout")),6e3))]);if(a&&a.ok)return await a.json()||{}}catch{}return r()})()}async function yr(t){let e=(typeof unsafeWindow<"u"?unsafeWindow:window).__urpppDownsLast={t:Date.now(),hasRoot:!!t,api:ke||"(empty)"};try{if(!t||!ke){e.stop="no-root-or-api";return}let r=t.querySelectorAll("[data-dows-id]");if(e.els=r.length,!r.length){e.stop="no-placeholders";return}let a=Array.from(new Set(Array.from(r).map(l=>l.dataset.dowsId)));e.ids=a;let p=await Mn(a);if(e.map=p,!t.isConnected){e.stop="root-detached";return}let i=0;t.querySelectorAll("[data-dows-id]").forEach(l=>{let b=p[l.dataset.dowsId];typeof b=="number"&&b>=0&&(l.textContent=" · ↓"+(b>=1e4?(b/1e4).toFixed(1)+"w":String(b)),i++)}),e.filled=i;try{console.log("[URP++ downs]",JSON.stringify(e))}catch{}}catch(r){e.err=String(r);try{console.log("[URP++ downs] err",String(r))}catch{}}}try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;t.__urpppDownsVer="v8",t.__urpppDownsTest=Mn,t.__urpppDownsRefresh=yr,t.__urpppStoreTest=e=>gr(e),t.__urpppStoreForceRefresh=async()=>{let e=await we(!0);return console.log("[urppp store] force refresh done:",e.map(r=>r.id+":"+(r._srcUrl||"?")).join(", ")),e},t.__urpppStoreDiag=async()=>{let e={};try{let r=GM_getValue("urppp_catalog_cache","");e.catalogCache=r?JSON.parse(r).map(a=>a.id+":"+(a._srcUrl||"?")).join(", "):"(empty)"}catch(r){e.catalogCache="ERR "+r.message}try{e.sources=JSON.parse(GM_getValue("urppp_store_sources","[]")).map(r=>({n:r.name,u:r.url,e:r.enabled,m:(r.mirrors||[]).length}))}catch(r){e.sources="ERR "+r.message}e.migrated=GM_getValue("urppp_sources_migrated","unset"),e.cacheInMem=Vt?Vt.map(r=>r.id+":"+(r._srcUrl||"?")).join(", "):"(null)",e.officialURL=xr,console.log("[urppp store diag]",JSON.stringify(e,null,2)),["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json"].forEach(r=>{try{GM_xmlhttpRequest({method:"GET",url:r,timeout:8e3,onload:a=>console.log("[urppp probe] GM-OK",r.slice(0,60),(a.responseText||"").length+"B"),onerror:a=>console.log("[urppp probe] GM-ERR",r.slice(0,60)),ontimeout:()=>console.log("[urppp probe] GM-TIMEOUT",r.slice(0,60))})}catch(a){console.log("[urppp probe] EXC",r.slice(0,60),a.message)}})}}catch{}async function In(t){let e=t&&t._srcPub;if(!e)return"trust";let r=await Qs(t,e);return r===!0?"ok":r===!1?"fail":"unknown"}function $n(t,e){let r=String(t||"0").split(".").map(Number),a=String(e||"0").split(".").map(Number);for(let p=0;p<Math.max(r.length,a.length);p+=1){let i=r[p]||0,l=a[p]||0;if(i!==l)return i>l}return!1}function Xs(t,e){let r=0;return e.forEach(a=>{if(!a.id)return;let p=t.querySelector('[data-theme-use="'+a.id+'"]');p&&$n(a.version,u.find(l=>l.id===a.id)&&u.find(l=>l.id===a.id).version)&&(Nn(p.closest(".urppp-skin-card"),"主题"),r+=1);let i=t.querySelector('[data-plugin-id="'+a.id+'"]');if(i){let l=Et&&Et.api&&Et.api.get&&Et.api.get(a.id);l&&$n(a.version,l.version)&&(Nn(i.closest(".urppp-store-item"),"插件"),r+=1)}}),r}function Nn(t,e){if(!t||t.querySelector(".urppp-store-update"))return;let r=t.querySelector(".urppp-store-ops");if(!r)return;let a=document.createElement("button");a.type="button",a.className="urppp-set-btn urppp-store-update",a.textContent="有新更新",a.addEventListener("click",()=>{try{a.textContent="更新中…"}catch{}}),r.appendChild(a)}function Bn(t){let e=t.querySelector("[data-store-auto-update]"),r=t.querySelector("[data-store-check-update]");if(!e||!r)return;let a=GM_getValue("urppp_store_auto_update",!1),p=()=>{e.textContent="自动检测更新："+(a?"开":"关")};p(),e.addEventListener("click",()=>{a=!a,GM_setValue("urppp_store_auto_update",a),p()}),r.addEventListener("click",async()=>{r.disabled=!0;let i=r.textContent;r.textContent="检查中…";try{let l=await we(),b=Xs(t,l);r.textContent=b?"发现更新":"已是最新"}catch{r.textContent="检查失败"}setTimeout(()=>{r.textContent=i,r.disabled=!1},1600)})}function tl(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">主题下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">主题管理</button>
          <button type="button" class="urppp-store-tab" data-tab="sources">仓库源</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${zn()}<button type="button" class="urppp-set-btn ghost" data-add-local-theme style="width:100%;margin:0 0 10px">＋ 添加本地主题</button><input type="file" accept=".css,.txt" data-local-theme-file style="display:none"><div class="urppp-store-bd"><div id="urppp-theme-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div></div>
          <div class="urppp-store-pane" data-pane="sources" style="display:none">${Za()}</div>
        </div>
      </div>`,Pn(t),Bn(t),rl(t),Xa(t),gr(t),setTimeout(()=>{try{yr(t)}catch{}},800),Qr(t.querySelector("#urppp-theme-manage"))}function Za(){let t=Le();return`<div class="urppp-src-manage">
      <div class="urppp-src-official">
        <p class="urppp-src-hint"><strong>官方收录源</strong>（点击添加；收录申请见 <a class="urppp-src-link" href="https://github.com/chaolan2019/URP-plusplus-Repository/tree/main/contribute" target="_blank" rel="noopener noreferrer">商店仓库投稿指南</a>）</p>
        <div data-src-official-list><div class="urppp-store-empty"><p>正在加载收录列表…</p></div></div>
      </div>
      <div class="urppp-src-mine">
        <p class="urppp-src-hint"><strong>我的仓库源</strong></p>
        ${t.length?t.map((r,a)=>`
      <div class="urppp-src-item">
        <div class="urppp-src-meta"><strong>${X(r.name||"未命名")}</strong><span class="urppp-src-url">${X(r.url)}</span></div>
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
    </div>`}function el(t){t.dataset.srcAutoRefresh||(t.dataset.srcAutoRefresh="1",t.addEventListener("click",e=>{let r=e.target,a=r&&r.closest?r.closest("button"):null;!a||!a.closest('[data-pane="sources"]')||(clearTimeout(window.__urpppSrcAutoRefreshTimer),window.__urpppSrcAutoRefreshTimer=setTimeout(()=>{try{gr(t)}catch{}},400))}))}async function Fn(t){let e=t.querySelector("[data-src-official-list]");if(!e)return;let r=await Tn();if(!r||!e.isConnected)return;let a=Le(),p=(r.sources||[]).filter(i=>i&&i.url&&!a.some(l=>l.url===i.url));if(!p.length){e.innerHTML='<div class="urppp-store-empty"><p>已收录全部可用源</p></div>';return}e.innerHTML=p.map((i,l)=>`
      <div class="urppp-src-item">
        <div class="urppp-src-meta"><strong>${X(i.name||i.id||"未命名")}</strong><span class="urppp-src-url">${X(i.author?i.author+" · ":"")}${X(i.url)}</span>${i.description?`<span class="urppp-src-url">${X(i.description)}</span>`:""}</div>
        <div class="urppp-src-ops"><button type="button" class="urppp-set-btn ghost" data-src-official="${l}">添加</button></div>
      </div>`).join(""),e.querySelectorAll("[data-src-official]").forEach(i=>i.addEventListener("click",async()=>{let l=p[Number(i.dataset.srcOfficial)];if(!l||!l.url)return;i.disabled=!0;let b=Le();if(b.some(A=>A.url===l.url)){qe("该源已存在");return}let m=Object.assign({name:l.name||l.id||l.url,url:l.url,enabled:!0},Array.isArray(l.mirrors)&&l.mirrors.length?{mirrors:l.mirrors.slice()}:{});l.url===xr?b.unshift(m):b.push(m),Kr(b),Vt=null,qe("已添加仓库源："+(l.name||l.url)),ea(t)}))}function Xa(t){let e=t.querySelector("[data-src-add]");if(e){let r=t.querySelector("[data-src-url]"),a=t.querySelector("[data-src-name]");e.addEventListener("click",async()=>{let p=(r.value||"").trim();if(!p)return;e.disabled=!0;let i=e.textContent;e.textContent="验证中…";try{if(!qn(await Va(p,8e3)))throw new Error("无法访问或不是合法 catalog（无 items）");let b=Le();if(b.some(m=>m.url===p)){qe("该源已存在");return}b.push({name:(a.value||"").trim()||p,url:p,enabled:!0}),Kr(b),Vt=null,ea(t)}catch(l){qe("添加失败："+(l&&l.message?l.message:l),"error")}finally{e.disabled=!1,e.textContent=i}})}t.querySelectorAll("[data-src-toggle]").forEach(r=>r.addEventListener("click",()=>{let a=Number(r.dataset.srcToggle),p=Le();p[a]&&(p[a].enabled=p[a].enabled===!1,Kr(p),ea(t))})),t.querySelectorAll("[data-src-del]").forEach(r=>r.addEventListener("click",()=>{let a=Number(r.dataset.srcDel),p=Le();p[a]&&(p.splice(a,1),Kr(p),ea(t))}));try{Fn(t)}catch{}el(t)}function ea(t){let e=t.querySelector('[data-pane="sources"]');if(e){let r=t;e.innerHTML=Za(),Xa(r),Fn(r)}}function rl(t){let e=t.querySelector("[data-add-local-theme]"),r=t.querySelector("[data-local-theme-file]");!e||!r||(e.addEventListener("click",()=>r.click()),r.addEventListener("change",async()=>{let a=r.files&&r.files[0];if(!a)return;let p=await a.text(),i=p.match(/html\[data-urppp-skin="([\w-]+)"\]/);if(!i){qe('未能从 CSS 中识别主题 id（需要 html[data-urppp-skin="…"]）',"error"),r.value="";return}let l=i[1];try{GM_setValue("urppp_theme_css_"+l,p)}catch{}Jo(l,{name:l,desc:"本地主题",author:"本地",version:"1.0.0"});try{Ma(l).textContent=p}catch{}r.value="";try{Qr(t.querySelector("#urppp-theme-manage"))}catch{}}))}function al(t){let e=t.repo?`<button type="button" class="urppp-store-repo" data-repo="${X(t.repo)}">仓库</button>`:"";return`<div class="urppp-store-item" data-plugin-card="${X(t.id)}">
      <div class="urppp-store-info">
        <div><strong>${X(t.name||t.id)}</strong><span class="urppp-store-meta">${X(t.author||"")}${t.author&&t.version?" · ":""}v${X(t.version||"")}<span class="urppp-dows" data-dows-id="${X(t.id)}"></span></span></div>
        <div class="urppp-store-item-desc">${X(t.description||"")}</div>
      </div>
      <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-apply="${X(t.id)}">安装</button>${e}</div>
    </div>`}async function ol(t){if(!t)return;let e=a=>{if(!a.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载插件</p><p class="urppp-store-sub">已安装的插件不会再显示在这里。</p></div>';return}t.innerHTML=`${a.map(p=>al(p)).join("")}`,t.querySelectorAll("[data-plugin-apply]").forEach(p=>p.addEventListener("click",async()=>{p.disabled=!0;let i=p.textContent;p.textContent="下载中…";try{let l=(await we()).find(m=>m.id===p.dataset.pluginApply),b=l?await In(l):"trust";if(b==="fail"&&!await ta("签名校验失败：该插件可能被篡改。是否仍要装载？")){p.textContent="下载",p.disabled=!1;return}if(b==="unknown"&&l&&l._srcPub&&!await ta("该源无有效签名校验，可能被篡改。是否自担风险继续装载？")){p.textContent="下载",p.disabled=!1;return}Et&&Et.api&&Et.api.install&&await Et.api.install(p.dataset.pluginApply,null),p.textContent="已安装";try{jt()}catch{}try{Ka(p.dataset.pluginApply)}catch{}}catch{p.textContent="失败"}setTimeout(()=>{p.textContent=i,p.disabled=!1},1200)})),t.querySelectorAll("[data-repo]").forEach(p=>p.addEventListener("click",()=>{try{window.open(p.dataset.repo,"_blank","noopener")}catch{}}));try{yr(t)}catch{}},r=a=>(a||[]).filter(p=>p.type==="plugin"&&!(Et&&Et.api&&Et.api.isEnabled&&Et.api.isEnabled(p.id)));e(r(Vt));try{let a=await we(!0);Vt=a,Qa(a),document.body.contains(t)&&e(r(a))}catch{}}async function Dn(t){if(!t)return;let e=[];try{e=await we()}catch{}let r=Et&&Et.api&&Et.api.list&&Et.api.list()||[];if(!r.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}t.innerHTML=r.map(a=>{let p=e.find(b=>b.id===a.id),i=p&&p.downloads!=null?`<span class="urppp-store-dl">↓ ${X(String(p.downloads))}</span>`:"",l=a.repo||p&&p.repo?`<button type="button" class="urppp-set-btn ghost" data-repo="${X(a.repo||p.repo)}">仓库</button>`:"";return`<div class="urppp-store-item">
        <div class="urppp-store-row">
          <div class="urppp-store-info"><strong>${X(a.name||a.id)}</strong>${a.author?`<span class="urppp-store-author">${X(a.author)}</span>`:""}<span class="urppp-store-ver">${a.version?"v"+X(a.version):""}</span><span class="urppp-store-state ok">已装</span>${i}</div>
          <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-op="reload" data-plugin-id="${X(a.id)}">重新装载</button><button type="button" class="urppp-set-btn ghost" data-plugin-op="unload" data-plugin-id="${X(a.id)}">卸载</button>${l}</div>
        </div>
        ${a.description?`<p class="urppp-store-item-desc">${X(a.description)}</p>`:""}
      </div>`}).join(""),t.querySelectorAll('[data-plugin-op="reload"]').forEach(a=>a.addEventListener("click",async()=>{a.disabled=!0;let p=a.textContent;a.textContent="装载中…";try{Et&&Et.api&&Et.api.install&&await Et.api.install(a.dataset.pluginId,null),a.textContent="已装载";try{jt()}catch{}}catch{a.textContent="失败"}setTimeout(()=>{a.textContent=p,a.disabled=!1},1200)})),t.querySelectorAll('[data-plugin-op="unload"]').forEach(a=>a.addEventListener("click",()=>{try{Et&&Et.api&&Et.api.unregister&&Et.api.unregister(a.dataset.pluginId)}catch{}try{jt()}catch{}let p=t.closest(".urppp-store-inline");try{jn(p)}catch{}})),t.querySelectorAll("[data-repo]").forEach(a=>a.addEventListener("click",()=>{try{window.open(a.dataset.repo,"_blank","noopener")}catch{}}))}function jn(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">插件下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">插件管理</button>
          <button type="button" class="urppp-store-tab" data-tab="sources">仓库源</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${zn()}<button type="button" class="urppp-set-btn ghost" data-add-local-plugin style="width:100%;margin:0 0 10px">＋ 添加本地插件</button><input type="file" accept=".js,.txt" data-local-plugin-file style="display:none"><div class="urppp-store-bd" id="urppp-plugin-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div>
          <div class="urppp-store-pane" data-pane="sources" style="display:none">${Za()}</div>
        </div>
      </div>`,Pn(t),Bn(t),nl(t),Xa(t),ol(t.querySelector('[data-pane="download"]')),Dn(t.querySelector("#urppp-plugin-manage"))}function nl(t){let e=t.querySelector("[data-add-local-plugin]"),r=t.querySelector("[data-local-plugin-file]");!e||!r||(e.addEventListener("click",()=>r.click()),r.addEventListener("change",async()=>{let a=r.files&&r.files[0];if(!a)return;let p=await a.text();r.value="";try{new Function(p)()}catch(i){qe("本地插件加载失败："+(i&&i.message?i.message:i),"error")}try{Dn(t.querySelector("#urppp-plugin-manage"))}catch{}}))}function pl(t){if(!t)return;let e=t.querySelector("#urppp-theme-store");e&&!e.dataset.bound&&(e.dataset.bound="1",e.addEventListener("click",()=>Ja("theme")));let r=t.querySelector("#urppp-skin-list");if(!r)return;let a=re();if(r.innerHTML="",!u||!u.length){r.innerHTML='<p class="urppp-set-tip">暂无可用风格</p>';return}let p=ye(),i=u.filter(l=>l.installed!==!1||de(l.id)).concat(Object.keys(p).filter(l=>!u.some(b=>b.id===l)).map(l=>({id:l,name:p[l].name||l,desc:p[l].desc||"本地主题",version:p[l].version||"1.0.0",installed:!1})));i.forEach(l=>{let b=!!p[l.id],m=document.createElement("div");m.className="urppp-skin-card"+(l.id===a?" is-active":""),m.dataset.skin=l.id;let A=document.createElement("button");A.type="button",A.className="urppp-skin-apply";let T=l.installed!==!1||de(l.id)||b;T?l.id===a&&(l.ready||b)?(A.classList.add("is-current"),A.textContent="使用中",A.disabled=!0):A.textContent="应用主题":(A.classList.add("is-disabled"),A.textContent="去下载"),A.addEventListener("click",N=>{if(N.preventDefault(),N.stopPropagation(),!T){Ja("theme");return}if(!(l.id===a&&l.ready)&&Xo(l.id)){jt();try{window.__urpppCleanMode&&window.__urpppCleanMode.inject&&window.__urpppCleanMode.inject()}catch{}}}),m.innerHTML=['<div class="urppp-skin-name"></div>','<p class="urppp-skin-desc"></p>'].join(""),m.querySelector(".urppp-skin-name").textContent=l.name,m.querySelector(".urppp-skin-desc").textContent=l.desc,m.appendChild(A);try{let N="";try{N=GM_getValue("urppp_card_css_"+l.id,"")||""}catch{}if(N){let I=document.createElement("style");I.textContent=N,m.appendChild(I)}}catch{}r.appendChild(m)});try{let l=i.map(b=>{let m="";try{m=GM_getValue("urppp_card_css_"+b.id,"")||""}catch{}return{id:b.id,cardCss:m}});ze(l)}catch{}}let Ve=[],to=!1;function On(t,e,r){let a=typeof AbortController=="function"?new AbortController:null,p=a?setTimeout(()=>a.abort(),r):null;return fetch(t,{cache:"no-store",headers:e,signal:a?a.signal:void 0}).then(i=>{if(!i.ok)throw new Error("HTTP "+i.status);return i.text()}).finally(()=>{p&&clearTimeout(p)})}function il(t,e){return new Promise((r,a)=>{try{GM_xmlhttpRequest({method:"GET",url:t,timeout:12e3,headers:e,onload:p=>{p.status>=200&&p.status<400?r(p.responseText||""):a(new Error("HTTP "+p.status))},onerror:()=>a(new Error("network error")),ontimeout:()=>a(new Error("timeout"))})}catch(p){a(p)}})}function sl(t,e){let r={"Cache-Control":"no-cache"};return e&&e.range&&(r.Range=e.range),typeof GM_xmlhttpRequest=="function"?il(t,r).catch(()=>On(t,r,12e3)):On(t,r,12e3)}async function eo(t,e,r=1e3){let a=[],p=t[0],i=t.slice(1),l=I=>sl(I,e).then(O=>({url:I,text:O})).catch(O=>(a.push((I.split("/")[2]||I)+": "+(O&&O.message||O)),null)),b=l(p),m=new Promise(I=>setTimeout(()=>I("__TIMEOUT__"),r)),A=await Promise.race([b,m]);if(A!=="__TIMEOUT__"){if(A&&A.text&&A.text.length>0)return A.text;let O=(await Promise.all(i.map(l))).find(Q=>Q&&Q.text&&Q.text.length>0);if(O)return O.text;throw new Error("所有更新源均不可用（"+a.join("; ")+"）")}let T=Promise.all(i.map(l)).then(I=>{let O=I.find(Q=>Q&&Q.text&&Q.text.length>0);if(O)return O.text;throw new Error("所有更新源均不可用（"+a.join("; ")+"）")}),N=b.then(I=>{if(I&&I.text&&I.text.length>0)return I.text;throw new Error("主源内容无效")}).catch(()=>new Promise(()=>{}));return Promise.race([N,T])}function Te(t,e){let r=document.getElementById("urppp-set-update-status");r&&(r.dataset.locked=t?"1":"",r.innerHTML=t||"",r.style.color=e==="err"?"#b91c1c":e==="ok"?"#15803d":"var(--text-muted)")}async function ro(){let t=o,e="",r=!1,a="";try{let i=await eo(n.sourceUrls(n.versionJson)),l=JSON.parse(i);e=String(l&&l.version||"").trim(),l&&String(l.prevVersion||"").trim()===t&&(r=!0),l&&typeof l.changelog=="string"&&l.changelog.trim()&&(a=l.changelog)}catch{}if(!e){let i=await eo(n.sourceUrls("urppp.user.js"),{range:"bytes=0-2048"});e=So(i)}if(!e)throw new Error("无法解析远程主插件版本");let p=zr(e,t);return{id:"main",name:"主插件",local:t,remote:e,status:p>0?"update":p===0?"latest":"ahead",updateUrl:n.mainRaw,pageUrl:n.greasySearch,changelogMd:r?a:""}}function Rn(t,e,r){let a=String(t||"").replace(/\r\n/g,`
`);if(!a.trim())return"";let p=/^##\s*\[?v?([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)\]?[^\n]*$/gim,i=[],l;for(;(l=p.exec(a))!==null;)i.push({ver:l[1],index:l.index,headEnd:p.lastIndex});if(!i.length)return"";for(let m=0;m<i.length;m++){let A=m+1<i.length?i[m+1].index:a.length;i[m].body=a.slice(i[m].index,A).trim()}let b=[];for(let m of i)zr(m.ver,r)>0||zr(m.ver,e)<=0||b.push(m.body);return b.join(`

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
    `,document.documentElement.appendChild(e)}function ll(t){let e=String(t||"").replace(/\r\n/g,`
`).trim();if(!e)return'<p class="uuc-meta">暂无更新日志</p>';let r=b=>{let m=X(b);return m=m.replace(/`([^`]+)`/g,"<code>$1</code>"),m=m.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),m=m.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),m=m.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g,'$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'),m},a=e.split(`
`),p=[],i=!1,l=()=>{i&&(p.push("</ul>"),i=!1)};for(let b=0;b<a.length;b++){let A=a[b].replace(/\s+$/,"");if(!A.trim()){l();continue}let T=A.match(/^(#{2,3})\s+(.+)$/);if(T){l();let I=T[1].length,O=T[2];p.push(I===2?`<h2>${r(O)}</h2>`:`<h3>${r(O)}</h3>`);continue}let N=A.match(/^[-*]\s+(.+)$/);if(N){i||(p.push("<ul>"),i=!0),p.push(`<li>${r(N[1])}</li>`);continue}l(),p.push(`<p>${r(A)}</p>`)}return l(),p.join("")||'<p class="uuc-meta">暂无更新日志</p>'}function Un(t){let e=t||document.getElementById("urppp-update-toast");if(!e||!e.classList.contains("open")){e&&e.classList.remove("open","closing");return}if(e.__closing)return;e.__closing=!0,e.classList.add("closing"),e.classList.remove("open");let r=()=>{e.classList.remove("closing"),e.__closing=!1,e.removeEventListener("transitionend",a)},a=p=>{p&&p.target!==e||p&&p.propertyName&&p.propertyName!=="opacity"&&p.propertyName!=="transform"||r()};e.addEventListener("transitionend",a),setTimeout(r,380)}function cl(t){let e=t||document.getElementById("urppp-update-changelog");if(!e||!e.classList.contains("open")&&!e.classList.contains("closing")||e.__closing)return;e.__closing=!0,e.classList.add("closing"),e.classList.remove("open");let r=()=>{e.classList.remove("closing"),e.__closing=!1,e.removeEventListener("transitionend",a)},a=p=>{p&&p.target!==e||p&&p.propertyName&&p.propertyName!=="opacity"&&p.propertyName!=="background-color"&&p.propertyName!=="background"||r()};e.addEventListener("transitionend",a),setTimeout(r,360)}function Wn(t,e){Hn();let r=document.getElementById("urppp-update-changelog");r||(r=document.createElement("div"),r.id="urppp-update-changelog",r.innerHTML=`
        <div class="uuc-panel" role="dialog" aria-modal="true" aria-label="更新日志">
          <div class="uuc-head">
            <h3></h3>
            <button type="button" class="uut-btn ghost" data-close="1">关闭</button>
          </div>
          <div class="uuc-body"></div>
        </div>`,r.addEventListener("click",a=>{(a.target===r||a.target&&a.target.getAttribute&&a.target.getAttribute("data-close")==="1")&&cl(r)}),document.documentElement.appendChild(r)),r.querySelector("h3").textContent=t||"更新日志",r.querySelector(".uuc-body").innerHTML=e||'<p class="uuc-meta">暂无更新日志</p>',r.__closing=!1,r.classList.remove("open","closing"),r.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>r.classList.add("open"))})}function ao(t){Hn();let e=document.getElementById("urppp-update-toast");e||(e=document.createElement("div"),e.id="urppp-update-toast",e.innerHTML=`
        <button type="button" class="uut-close" aria-label="关闭">×</button>
        <div class="uut-title"></div>
        <div class="uut-sub"></div>
        <div class="uut-actions">
          <button type="button" class="uut-btn" data-act="log">更新日志</button>
          <button type="button" class="uut-btn primary" data-act="go">去更新</button>
          <button type="button" class="uut-btn ghost" data-act="later">稍后</button>
        </div>`,e.querySelector(".uut-close").addEventListener("click",()=>Un(e)),e.addEventListener("click",async r=>{let a=r.target&&r.target.closest?r.target.closest("[data-act]"):null;if(!a)return;let p=a.getAttribute("data-act"),i=e.__pack||{};if(p==="later"){Un(e);return}if(p==="go"){let l=i.updateUrl||n.mainRaw;try{window.open(l,"_blank","noopener,noreferrer")}catch{location.href=l}return}if(p==="log"){a.disabled=!0,a.textContent="加载中…";try{let l=i.changelogMd;l||(l=await eo(n.sourceUrls("CHANGELOG.md")),i.changelogMd=l);let b=Rn(l,i.local,i.remote),m=b?ll(b):'<p class="uuc-meta">未找到区间日志。</p><p><a href="'+n.changelogPage+'" target="_blank" rel="noopener noreferrer">打开完整 CHANGELOG</a></p>';Wn("更新日志 "+i.local+" → "+i.remote,m)}catch(l){Wn("更新日志","<p>加载失败："+X(l&&l.message||l)+'</p><p><a href="'+n.changelogPage+'" target="_blank" rel="noopener noreferrer">打开 GitHub CHANGELOG</a></p>')}finally{a.disabled=!1,a.textContent="更新日志"}}}),document.documentElement.appendChild(e)),e.__pack=t||{},e.querySelector(".uut-title").textContent="发现新版本 "+(t&&t.remote||""),e.querySelector(".uut-sub").textContent="当前 "+(t&&t.local||"")+" · 主插件可更新",e.__closing=!1,e.classList.remove("open","closing"),e.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>e.classList.add("open"))})}async function oo(){if(za()&&!window.__urpppAutoUpdateTried){window.__urpppAutoUpdateTried=!0;try{let t=await ro();t&&t.status==="update"&&ao(t);let e=await dl();if(e)try{console.log("[URP++] 辅助插件热更新到",e.version)}catch{}}catch(t){try{console.debug("[URP++] auto update check failed",t)}catch{}}}}function dl(){let t=(window.__urpppUpdateCheckers||Ve||[]).find(e=>e&&e.id==="assist");return!t||typeof t.check!="function"?Promise.resolve(null):Promise.resolve().then(()=>t.check()).then(e=>e&&e.status==="update"?Et.update("assist"):null).catch(()=>null)}async function no(){if(to)return;to=!0;let t=document.getElementById("urppp-set-check-update");t&&(t.disabled=!0,t.textContent="检查中…"),Te("正在从多源检查更新…");try{let e=[ro()];(Ve||[]).forEach(m=>{m&&typeof m.check=="function"&&e.push(Promise.resolve().then(()=>m.check()).then(A=>A||{id:m.id||"extra",name:m.name||"扩展",status:"err",message:"无结果"}).catch(A=>({id:m.id||"extra",name:m.name||"扩展",status:"err",message:String(A&&A.message||A)})))});let r=await Promise.all(e),a=r.map(m=>{if(!m)return"";if(m.status==="err")return`• <b>${X(m.name||m.id)}</b>：检查失败（${X(m.message||"unknown")}）`;if(m.status==="update"){let A="";if(m.id==="assist"&&Et&&Et.loaded("assist"))A=' <a class="urppp-update-relaunch" href="javascript:void(0)" data-urppp-relaunch="assist" rel="nofollow">重新装载</a>';else{let T=m.updateUrl?` <a href="${X(m.updateUrl)}" target="_blank" rel="noopener noreferrer">打开更新源</a>`:"",N=m.pageUrl?` <a href="${X(m.pageUrl)}" target="_blank" rel="noopener noreferrer">Greasy Fork</a>`:"";A=T+N}return`• <b>${X(m.name)}</b>：发现新版本 <b>${X(m.remote)}</b>（当前 ${X(m.local)}）${A}`}return m.status==="ahead"?`• <b>${X(m.name)}</b>：本地 ${X(m.local)} 新于远程 ${X(m.remote)}`:`• <b>${X(m.name)}</b>：已是最新（${X(m.local)}）`}).filter(Boolean),p=r.some(m=>m&&m.status==="update"),i=r.some(m=>m&&m.status==="err");Te(`${p?"检查完成：发现更新":i?"检查完成：部分失败":"检查完成：全部最新"}<br>${a.join("<br>")}<br><span style="opacity:.85">仓库：<a href="${n.repo}" target="_blank" rel="noopener noreferrer">SCU-URP-plusplus</a></span>`,i?"err":"ok");let b=document.querySelector('#urppp-set-update-status .urppp-update-relaunch[data-urppp-relaunch="assist"]');b&&b.addEventListener("click",()=>{try{Te("正在重新装载辅助插件…",""),Et.install("assist").then(()=>{Te("辅助插件已重新装载，刷新页面后生效。","ok")}).catch(m=>{Te("重新装载失败："+(m&&m.message?m.message:m),"err")})}catch(m){Te("重新装载失败："+(m&&m.message?m.message:m),"err")}})}catch(e){Te("检查失败："+X(e&&e.message||e),"err")}finally{to=!1,t&&(t.disabled=!1,t.textContent="检查更新")}}function Gn(){let t=document.getElementById("urppp-set-update-status");if(!t||t.dataset.locked==="1")return;let e="当前主插件："+o,r=t.getAttribute("data-assist-version")||"";r&&(e+="；辅助插件："+r),t.textContent=e,t.style.color="var(--text-muted)"}function ul(t){if(!t||typeof t.check!="function")return!1;let e=String(t.id||t.name||"").trim();if(!e)return!1;let r=Ve.findIndex(p=>p&&p.id===e),a={id:e,name:t.name||e,check:t.check,localVersion:t.localVersion||""};r>=0?Ve[r]=a:Ve.push(a);try{let p=document.getElementById("urppp-set-update-status");p&&a.localVersion&&e==="assist"&&p.setAttribute("data-assist-version",String(a.localVersion))}catch{}try{Gn()}catch{}return!0}function ml(){let t={version:o,urls:n,check:no,checkMain:ro,registerChecker:ul,compareVersions:zr,parseUserscriptVersion:So,extractChangelogRange:Rn,showUpdateToast:ao,maybeAutoCheckUpdate:oo,listCheckers:()=>Ve.slice()};try{window.__urpppUpdate=t}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppUpdate=t)}catch{}return t}ml();let{rebuildSidebarCompletely:Jn,syncMobileContentOffset:Ye,syncSidebarUnderNavbar:Me}=us({}),{rebuildDashboard:bl}=rs({deps:{statCardPrivacyMarkup:wl}}),hl="urppp-clean-open",po={100:4,99:4,98:4,97:4,96:4,95:4,94:3.9,93:3.8,92:3.7,91:3.6,90:3.5,89:3.4,88:3.3,87:3.2,86:3.1,85:3,84:2.9,83:2.8,82:2.7,81:2.6,80:2.5,79:2.4,78:2.3,77:2.2,76:2.1,75:2,74:1.9,73:1.8,72:1.7,71:1.6,70:1.5,69:1.4,68:1.3,67:1.2,66:1.1,65:1,64:.9,63:.8,62:.7,61:.6,60:.5};function ue(t){if(t==null||t==="")return!1;let e=String(t).trim();if(!e)return!1;if(/未评估|未评教|待评估|待评教/.test(e))return!0;let r=Number(e);return!Number.isNaN(r)&&r<0}function ra(t){if(t==null||t==="")return!1;let e=Number(t);return!Number.isNaN(e)&&e>=0&&e<=5}function aa(t){let e=String(t||"").trim();if(!e)return"";let r=e.match(/[\u4e00-\u9fffA-Za-z0-9]/);return r?r[0]:e.charAt(0)}function io(t,e){let r=String(t||""),a=Number(e)||0;return!r||a<=0||a>r.length?!1:r.charAt(a-1)==="1"}function Qe(t){if(t==null||t==="")return null;let e=String(t).trim();if(!e||ue(e)||/^免修$|^通过$|^取消$|^缓考$|^旷考$|^缺考$/.test(e))return null;if(/^A\+$/i.test(e)||/^A$/i.test(e))return 4;if(/^A-$/i.test(e))return 3.7;if(/^B\+$/i.test(e))return 3.3;if(/^B$/i.test(e))return 3;if(/^B-$/i.test(e))return 2.7;if(/^C\+$/i.test(e))return 2.3;if(/^C$/i.test(e))return 2;if(/^C-$/i.test(e))return 1.7;if(/^D$/i.test(e))return 1.3;if(/^F$/i.test(e))return 0;if(/优秀/.test(e))return 4;if(/良好/.test(e))return 3;if(/中等/.test(e))return 2;if(/及格/.test(e)&&!/不及格/.test(e))return 1;if(/不及格|不合格|不通过/.test(e))return 0;if(/合格/.test(e))return 1;let r=parseFloat(e.replace(/[^\d.]/g,""));if(Number.isNaN(r)||r<0)return null;let a=Math.round(r);return a<60?0:a>100?4:po[a]!=null?po[a]:po[Math.max(60,Math.min(100,Math.floor(r)))]||0}function Ke(t){let e=String(t||"").trim();if(!e||ue(e))return null;if(/优秀/.test(e))return 95;if(/良好/.test(e))return 85;if(/中等/.test(e))return 75;if(/及格/.test(e)&&!/不及格/.test(e))return 65;if(/不及格|不合格|不通过/.test(e))return 0;if(/合格/.test(e))return 70;if(/^A/i.test(e))return 95;if(/^B/i.test(e))return 85;if(/^C/i.test(e))return 75;if(/^D/i.test(e))return 65;if(/^F/i.test(e))return 0;let r=parseFloat(e.replace(/[^\d.]/g,""));return Number.isNaN(r)||r<0?null:r}function Ie(t){return Math.round((Number(t)||0)*100)/100}function Vn(t){return/必修/.test(String(t||""))}function ne(t){let e=0,r=0,a=0,p=0,i=0,l=0,b=0,m=0;return(t||[]).forEach(A=>{if(A&&(A.unevaluated||ue(A.score)))return;let T=Number(A.credit)||0,N=Ke(A.score),I=ra(A.officialGpa)?Number(A.officialGpa):Qe(A.score);N==null||T<=0||(e+=T,r+=N*T,I!=null&&(a+=I*T,p+=T),A.required&&(i+=T,l+=N*T,I!=null&&(b+=I*T,m+=T)))}),{totalCredit:Ie(e),avgScore:Ie(e?r/e:0),avgGpa:Ie(p?a/p:0),requiredCredit:Ie(i),requiredGpa:Ie(m?b/m:0),requiredAvg:Ie(i?l/i:0),count:(t||[]).length}}function so(t){let e=String(t||"");return/^https?:\/\//i.test(e)?e:e.startsWith("//")?location.protocol+e:e.startsWith("/")?location.origin+e:location.origin+"/"+e.replace(/^\.\//,"")}function Kt(t,e){let r=so(t),a=e&&e.method||"GET",p=e&&e.data||null;return new Promise((i,l)=>{let b=(m,A)=>m?i(A):l(new Error(A||"fetch failed"));try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:a,url:r,data:p||void 0,headers:e&&e.headers?e.headers:{},withCredentials:!0,onload:m=>{m.status>=200&&m.status<400?b(!0,m.responseText||""):b(!1,"HTTP "+m.status)},onerror:()=>b(!1,"network error")});return}}catch{}fetch(r,{method:a,credentials:"include",cache:"no-store",headers:e&&e.headers?e.headers:{},body:p||void 0}).then(m=>{if(!m.ok)throw new Error("HTTP "+m.status);return m.text()}).then(m=>b(!0,m)).catch(m=>b(!1,m&&m.message))})}function oa(t){return new DOMParser().parseFromString(String(t||""),"text/html")}function Yn(){if(document.getElementById("urppp-feature-style"))return;let t=document.createElement("style");t.id="urppp-feature-style",t.textContent=Li,(document.head||document.documentElement).appendChild(t)}function fl(){if(document.getElementById("urppp-schedule-export-style"))return;let t=document.createElement("style");t.id="urppp-schedule-export-style",t.textContent=Mi,(document.head||document.documentElement).appendChild(t)}function gl(){if(document.getElementById("urppp-settings-style"))return;let t=document.createElement("style");t.id="urppp-settings-style",t.textContent=Ii,(document.head||document.documentElement).appendChild(t)}function lo(){if(document.getElementById("urppp-dashboard-style"))return;let t=document.createElement("style");t.id="urppp-dashboard-style",t.textContent=Fi,(document.head||document.documentElement).appendChild(t)}function co(){if(document.getElementById("urppp-schedule-card-style"))return;let t=document.createElement("style");t.id="urppp-schedule-card-style",t.textContent=Ti,(document.head||document.documentElement).appendChild(t)}function Qn(){if(document.getElementById("urppp-mobile-style"))return;let t=document.createElement("style");t.id="urppp-mobile-style",t.textContent=ji,(document.head||document.documentElement).appendChild(t)}function xl(){try{Or()&&lo()}catch{}try{wr(location)&&co()}catch{}}function yl(){if(window.__urpppDeferredStylesDone)return;window.__urpppDeferredStylesDone=!0;let t=()=>{try{Qn()}catch{}try{lo()}catch{}try{co()}catch{}};try{typeof window.requestIdleCallback=="function"?window.requestIdleCallback(t,{timeout:4e3}):setTimeout(t,2200)}catch{setTimeout(t,2200)}}function Kn(t){let r=(t&&t.querySelector?t:document).querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(!r)return null;let a=r.querySelector(".urppp-user-name-value");if(a)return a;let p=r.cloneNode(!0);p.querySelectorAll("small, i, img, b, .badge").forEach(b=>b.remove());let i=(p.textContent||"").replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim();Array.from(r.childNodes).forEach(b=>{b.nodeType===Node.TEXT_NODE&&b.textContent.trim()&&b.remove()});let l=document.createElement("span");return l.className="urppp-user-name-value",l.textContent=i||"同学",l.__urpppOriginalText=l.textContent,r.appendChild(l),l}function na(t){let e=String(t||"").replace(/[\s:：]/g,"");return e?/姓名|英文姓名|姓名拼音/.test(e)?"name":/学号|证件|身份证|护照|证书编号|考生号|录取号|学籍号/.test(e)?"identity":/学院|院系|专业|班级|年级|主修方案|培养方案|专业方向|分流方向|毕业中学/.test(e)?"organization":/电话|手机|电子邮件|邮箱|QQ|地址|家长|个人主页|出生日期|入学日期|乘车区间|性别|籍贯|民族|政治面貌|国籍|户口|户籍|生源|出生地|健康|宗教|血型|婚姻|联系人|家庭/.test(e)?"contact":/绩点|GPA/.test(e)?"gpa":/学分/.test(e)?"credit":/成绩|分数|高考总分|均分|平均分|必修平均|课程门数|及格课程|不及格课程|待修读课程|已修读课程/.test(e)?"grade":/课表|日程安排/.test(e)?"schedule":"":""}function vl(t,e){let r=String(t||"")+" "+String(e||"");return/绩点|GPA/.test(r)?"majorGpa":/主修为|培养方案|方案/.test(r)?"majorPlan":/尚不及格|未及格/.test(r)?"failedCourses":/待修读课程/.test(r)?"remainingCourses":/已修读课程/.test(r)?"completedCourses":""}function pa(t,e,r){let a=e?` data-urppp-edit-key="${e}"`:"";return`<span class="urppp-private-value" data-urppp-private="${t}"${a}>${r}</span>`}function wl(t,e){let r=X(t),a=X(e),p=vl(t,e),l={completedCourses:"other",failedCourses:"other",majorGpa:"gpa",majorPlan:"organization",remainingCourses:"other"}[p]||na(String(t||"")+" "+String(e||""));if(l==="organization")return e?{valueHtml:r,labelHtml:pa("organization",p,a)}:{valueHtml:pa("organization",p,r),labelHtml:a};if(!["grade","gpa","credit","other"].includes(l))return{valueHtml:r,labelHtml:a};let b=String(e||"").match(/-?\d+(?:\.\d+)?/);if(!(/^-?\d+(?:\.\d+)?$/.test(String(t||"").trim())||/^(优秀|良好|中等|及格|不及格|合格|不合格)$/.test(String(t||"").trim()))&&b){let A=b.index||0,T=String(e).slice(0,A),N=String(e).slice(A+b[0].length);return{valueHtml:r,labelHtml:`${X(T)}${pa(l,p,X(b[0]))}${X(N)}`}}return{valueHtml:pa(l,p,r),labelHtml:a}}function $e(t,e){if(!t||t.mode==="off")return"";if(t.mode==="one")return t.mask||Ir;if(e==="name")return"";let r=t.fields&&t.fields[e];return!r||!r.enabled?"":String(r.replacement||t.mask||Ir)}function vr(t,e){if(!(!t||!e)&&!(t.querySelector&&t.querySelector("input,select,textarea,button"))){if(!t.classList.contains("urppp-private-text")){let r=getComputedStyle(t).fontSize;r&&r!=="0px"&&t.style.setProperty("--urppp-private-font-size",r)}t.classList.add("urppp-private-text"),t.setAttribute("data-urppp-private-mask",e)}}function Zn(t,e){if(!t||!t.parentElement)return;let r=t.parentElement;t.classList.add("urppp-private-avatar"),r.classList.add("urppp-private-avatar-host"),r.setAttribute("data-urppp-private-mask",e||Ir);let a=t.getBoundingClientRect();r.style.setProperty("--urppp-avatar-left",t.offsetLeft+"px"),r.style.setProperty("--urppp-avatar-top",t.offsetTop+"px"),r.style.setProperty("--urppp-avatar-width",Math.max(1,a.width)+"px"),r.style.setProperty("--urppp-avatar-height",Math.max(1,a.height)+"px"),r.style.setProperty("--urppp-avatar-radius",getComputedStyle(t).borderRadius||"50%")}function kl(t,e){if(!t||!e)return;let r=t.matches("table")&&t.closest(".table-responsive, .urppp-table-wrap")||t;r.classList.add("urppp-private-block"),r.setAttribute("data-urppp-private-mask",e)}function Al(t,e){if(!(!t||!U[e])){if(!t.hasAttribute("data-urppp-direct-tabindex")){let r=t.getAttribute("tabindex");t.setAttribute("data-urppp-direct-tabindex",r??"__none__"),t.__urpppDirectTitle=t.getAttribute("title"),t.__urpppDirectAriaLabel=t.getAttribute("aria-label")}t.classList.add("urppp-direct-editable"),t.setAttribute("tabindex","0"),t.setAttribute("data-urppp-edit-key",e),t.setAttribute("aria-label","修改"+U[e]+"显示值"),t.title="点击修改显示值"}}let Ae=null;function Xn(t){let e=t&&t.getAttribute("data-urppp-edit-key");if(!e||!U[e])return;Ae&&Ae.__finish&&Ae.__finish(!1);let r=Pe();if(r.mode!=="custom"||!r.directEdit.enabled)return;let p=String(r.directEdit.values[e]||"")||t.getAttribute("data-urppp-private-mask")||String(t.textContent||"").trim(),i=t.getBoundingClientRect(),l=t.parentElement?.getBoundingClientRect(),b=i.height>=8||!l?i:{left:i.left,top:l.top,width:Math.max(i.width,40),height:l.height},m=document.createElement("input"),A=getComputedStyle(t),T=Math.min(Math.max(b.width+64,140),Math.max(140,window.innerWidth-24)),N=Math.min(Math.max(12,b.left),Math.max(12,window.innerWidth-T-12)),I=Math.min(Math.max(12,b.top+(b.height-36)/2),Math.max(12,window.innerHeight-48));m.type="text",m.maxLength=80,m.className="urppp-direct-edit-input",m.value=p,m.setAttribute("aria-label","修改"+U[e]+"显示值"),m.style.left=N+"px",m.style.top=I+"px",m.style.setProperty("--urppp-direct-edit-width",T+"px"),m.style.fontFamily=A.fontFamily,m.style.fontSize=(window.innerWidth<=520?16:Math.min(18,Math.max(13,parseFloat(A.fontSize)||14)))+"px";let O=!1,Q=R=>{if(O||(O=!0,m.remove(),Ae===m&&(Ae=null),R))return;let H=Pe();H.mode!=="custom"||!H.directEdit.enabled||(H.directEdit.values[e]=String(m.value||"").trim().slice(0,80),La(H),Zt(document),fo(H.directEdit.values[e]?"显示值已更新":"已恢复分类设置"))};m.__finish=Q,m.addEventListener("click",R=>R.stopPropagation()),m.addEventListener("blur",()=>Q(!1)),m.addEventListener("keydown",R=>{R.key==="Enter"&&(R.preventDefault(),Q(!1)),R.key==="Escape"&&(R.preventDefault(),Q(!0))}),document.documentElement.appendChild(m),Ae=m,m.focus(),m.select()}function Sl(){document.__urpppDirectEditBound||(document.__urpppDirectEditBound=!0,document.addEventListener("click",t=>{let e=t.target?.closest?.(".urppp-direct-editable");e&&(t.preventDefault(),t.stopPropagation(),Xn(e))},!0),document.addEventListener("keydown",t=>{if(!["Enter"," "].includes(t.key))return;let e=t.target?.closest?.(".urppp-direct-editable");e&&(t.preventDefault(),t.stopPropagation(),Xn(e))},!0))}function _l(t){let e=t&&t.querySelectorAll?t:document;e.querySelectorAll(".urppp-direct-editable").forEach(r=>{let a=r.getAttribute("data-urppp-direct-tabindex");r.classList.remove("urppp-direct-editable"),r.removeAttribute("data-urppp-direct-tabindex"),a==="__none__"?r.removeAttribute("tabindex"):a!=null&&r.setAttribute("tabindex",a),r.__urpppDirectTitle==null?r.removeAttribute("title"):r.setAttribute("title",r.__urpppDirectTitle),r.__urpppDirectAriaLabel==null?r.removeAttribute("aria-label"):r.setAttribute("aria-label",r.__urpppDirectAriaLabel),delete r.__urpppDirectTitle,delete r.__urpppDirectAriaLabel}),e.querySelectorAll(".urppp-private-text").forEach(r=>{r.classList.remove("urppp-private-text"),r.removeAttribute("data-urppp-private-mask"),r.style.removeProperty("--urppp-private-font-size")}),e.querySelectorAll(".urppp-private-avatar").forEach(r=>r.classList.remove("urppp-private-avatar")),e.querySelectorAll(".urppp-private-avatar-host").forEach(r=>{r.classList.remove("urppp-private-avatar-host"),r.removeAttribute("data-urppp-private-mask"),["--urppp-avatar-left","--urppp-avatar-top","--urppp-avatar-width","--urppp-avatar-height","--urppp-avatar-radius"].forEach(a=>r.style.removeProperty(a))}),e.querySelectorAll(".urppp-private-avatar-block").forEach(r=>{r.classList.remove("urppp-private-avatar-block"),r.removeAttribute("data-urppp-private-mask")}),e.querySelectorAll(".urppp-private-block").forEach(r=>{r.classList.remove("urppp-private-block"),r.removeAttribute("data-urppp-private-mask")})}function tp(t,e,r){if(!t||t.matches?.("input,select,textarea,button")||t.querySelector?.("input,select,textarea,button"))return;if(t.__urpppOriginalText==null){if(!e)return;t.__urpppOriginalText=t.textContent||""}let a=e&&r?r:t.__urpppOriginalText;t.textContent!==a&&(t.textContent=a)}function El(t){let e=t&&t.querySelectorAll?t:document,r=Oe(),p=e.querySelector?.(".urppp-user-name-value")||(r.nameEnabled?Kn(e):null);tp(p,r.nameEnabled,r.name),e.querySelectorAll(".profile-info-row").forEach(b=>{let m=b.querySelector(".profile-info-name"),A=b.querySelector(".profile-info-value");!m||!A||String(m.textContent||"").replace(/[\s:：]/g,"")!=="姓名"||tp(A,r.nameEnabled,r.name)});let i=lr(r.avatar),l=r.avatarEnabled&&!!i;e.querySelectorAll("#navbar img.nav-user-photo, #urppp-mobile-user img.nav-user-photo, img#avatar, .profile-picture img").forEach(b=>{let m=b.getAttribute("src")||"";m&&m!==b.__urpppAppliedCustomSrc&&(b.__urpppOriginalSrc=m),l?(b.__urpppOriginalSrc==null&&(b.__urpppOriginalSrc=m),m!==i&&b.setAttribute("src",i),b.__urpppAppliedCustomSrc=i):b.__urpppAppliedCustomSrc!=null&&(b.__urpppOriginalSrc&&b.setAttribute("src",b.__urpppOriginalSrc),delete b.__urpppAppliedCustomSrc)})}function Cl(t,e){t.querySelectorAll(".profile-info-row").forEach(r=>{let a=r.querySelector(".profile-info-name, th, label"),p=r.querySelector(".profile-info-value, td:last-child");if(!a||!p||a===p)return;let i=na(a.textContent),l=$e(e,i);l&&vr(p,l)})}function Pl(t,e){t.querySelectorAll("table").forEach(r=>{let a=Array.from(r.querySelectorAll("thead th, thead td, tr:first-child th, tr:first-child td"));if(!a.length)return;let p=a.map(i=>{let l=na(i.textContent);return["grade","gpa","credit"].includes(l)?l:""});p.some(Boolean)&&r.querySelectorAll("tbody tr").forEach(i=>{let l=i.querySelectorAll("td");p.forEach((b,m)=>{let A=$e(e,b);b&&A&&vr(l[m],A)})})})}function zl(t){let e=t&&t.querySelectorAll?t:document,r=Pe();if(r.mode==="off")return;let a=$e(r,"name"),p=$e(r,"avatar"),i=$e(r,"schedule"),l=a?Kn(e):e.querySelector?.(".urppp-user-name-value");a&&vr(l,a),[["#courseNum, #coursePas, #xy_kcms","other"],["#gpa","gpa"],["#bottom","organization"]].forEach(([A,T])=>{let N=$e(r,T);N&&e.querySelectorAll(A).forEach(I=>vr(I,N))}),Pl(e,r);let m=r.mode==="custom"&&r.directEdit.enabled;if(e.querySelectorAll("[data-urppp-private]").forEach(A=>{let T=A.getAttribute("data-urppp-private"),N=A.getAttribute("data-urppp-edit-key"),O=(m&&N?String(r.directEdit.values[N]||"").trim():"")||$e(r,T);!["avatar","schedule"].includes(T)&&O&&vr(A,O),m&&N&&Al(A,N)}),m&&Sl(),Cl(e,r),p&&(e.querySelectorAll('[data-urppp-private="avatar"]').forEach(A=>{let T=A.matches("img")?A:A.querySelector("img");T?Zn(T,p):(A.classList.add("urppp-private-avatar-block"),A.setAttribute("data-urppp-private-mask",p))}),e.querySelectorAll("#navbar img.nav-user-photo, img#avatar, .profile-picture img, .uc-avatar img").forEach(A=>Zn(A,p))),i){let A=Array.from(e.querySelectorAll('[data-urppp-private="schedule"], #main-calendar, #courseTable'));A.filter(T=>!A.some(N=>N!==T&&N.contains(T))).forEach(T=>kl(T,i))}}let uo=0,me=[];function ep(){let t=Pe(),e=Oe();return t.mode!=="off"||e.nameEnabled||e.avatarEnabled}function Ll(){me=me.filter(({root:t})=>t&&t.isConnected),me.forEach(({root:t,observer:e})=>e.observe(t,{childList:!0,subtree:!0}))}function Zt(t){let e=t||document;me.forEach(({observer:r})=>r.disconnect());try{Yn()}catch{}try{_l(e)}catch{}try{El(e)}catch(r){console.warn("[URP++] custom identity",r)}try{zl(e)}catch(r){console.warn("[URP++] privacy",r)}ep()?(Ll(),Tl()):(clearTimeout(uo),me=[])}function ql(t){clearTimeout(uo),uo=setTimeout(()=>Zt(t||document),140)}function mo(){try{nt&&nt.open&&ar()}catch{}}function Tl(){if(!ep()){me.forEach(({observer:t})=>t.disconnect()),me=[];return}[document.getElementById("navbar"),document.getElementById("page-content-template"),document.getElementById("urppp-clean-root")].filter(Boolean).forEach(t=>{if(me.some(r=>r.root===t))return;let e=new MutationObserver(()=>ql(document));me.push({root:t,observer:e}),e.observe(t,{childList:!0,subtree:!0})})}function Ml(t){let e=Object.assign({},t||{}),r=Oe();r.nameEnabled&&r.name&&(e.name=r.name);let a=lr(r.avatar);return r.avatarEnabled&&a&&(e.avatar=a),e}let rp="/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback",Il="/student/courseSelect/thisSemesterCurriculum/callback",$l="/student/courseSelect/thisSemesterCurriculum/index";async function Nl(){let t=document.querySelector("#planCode, #zxjxjhh");if(t&&t.value&&t.value!=="no")return String(t.value);try{let e=new URLSearchParams(location.search),r=e.get("planCode")||e.get("zxjxjhh");if(r)return r}catch{}if(nt&&nt.schedule&&nt.schedule.exportData){let e=nt.schedule.exportData.semester&&nt.schedule.exportData.semester.planCode;if(e)return e}if(/\/student\/courseSelect\/courseSelectResult\//.test(location.pathname))try{let e=await Kt(Il),r=JSON.parse(e),a=sr(r);if(a)return a}catch{}return""}async function ap(t){let e=await Nl(),r=e?{method:"POST",data:"planCode="+encodeURIComponent(e),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}:null,a=await Kt(rp,r),p;try{p=JSON.parse(a)}catch{throw new Error("课表接口返回了非 JSON 内容，请刷新教务页面后重试")}e||(e=sr(p)),(!p.jcsjbs||!p.jcsjbs.length)&&e&&(p=JSON.parse(await Kt(rp,{method:"POST",data:"planCode="+encodeURIComponent(e),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}})));let i=np(p,e,t);if(!i.courses.length)throw new Error("没有读取到可导出的课表数据");return i}function bo(t){return String(t||"学生课表").replace(/[\\/:*?"<>|]+/g,"-").replace(/\s+/g,"").slice(0,80)||"学生课表"}function ho(t,e){let r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download=e,a.style.display="none",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(r),1200)}function Bl(t){let e=ma(t),r=jr(),a=r.enabled?ha(e,r.mapping):ba(e),p=JSON.stringify(a,null,2)+`
`;return ho(new Blob([p],{type:"application/json;charset=utf-8"}),bo(t.semester.label)+".json"),Object.assign({customFormat:r.enabled},e.stats)}function op(t){let r=(Array.from(document.querySelectorAll(".span_bbzx")).map(l=>l.textContent||"").join(" ")+" "+(document.querySelector("#navbar")?.textContent||"")).replace(/\s+/g," ").match(/(\d{4})-(\d{4})\s*(春|秋).*?第\s*(\d{1,2})\s*周/);if(!r)return"";let a=r[3]==="秋"?"1":"2";if(t&&!String(t).startsWith(r[1]+"-"+r[2]+"-"+a))return"";let p=Number(r[4]);if(p<1||p>30)return"";let i=qo(new Date);return i.setDate(i.getDate()-(p-1)*7),Mr(i)}function np(t,e,r){let a=e||sr(t),p=op(a)||qa()[a]||"";return Qp(t,a,r,{firstMonday:p})}function Fl(t){let e=t.semester.planCode,r=qa()[e],a=op(e);return a?(Wo(e,a),Promise.resolve(a)):ir(r)?Promise.resolve(r):new Promise((p,i)=>{document.querySelector('.urppp-dialog-mask[data-dialog="schedule-date"]')?.remove();let l=document.createElement("div");l.className="urppp-dialog-mask",l.dataset.dialog="schedule-date",l.innerHTML=`<div class="urppp-dialog" role="dialog" aria-modal="true"><h3>确认第一教学周周一</h3><p>${X(t.semester.label)}没有可可靠推导的起始日期。该日期决定 ICS 中每节课的实际日历时间；预填值仅为估算，请对照校历核对。</p><input type="date" value="${X(r||Wp(e))}"><div class="urppp-dialog-actions"><button type="button" class="urppp-set-btn ghost" data-action="cancel">取消</button><button type="button" class="urppp-set-btn" data-action="ok">确认并导出</button></div></div>`,document.documentElement.appendChild(l);let b=(m,A)=>{l.remove(),m?i(m):p(A)};l.querySelector('[data-action="cancel"]').addEventListener("click",()=>b(new Error("已取消导出"))),l.querySelector('[data-action="ok"]').addEventListener("click",()=>{let m=l.querySelector("input").value;ir(m)&&(Wo(e,m),b(null,m))}),l.addEventListener("click",m=>{m.target===l&&b(new Error("已取消导出"))})})}async function Dl(t){let e=await Fl(t),r=Jp(t,e);return ho(new Blob([r],{type:"text/calendar;charset=utf-8"}),bo(t.semester.label)+".ics"),Vp(t)}let jl={apple:"类 Apple",flat:"极简扁平",organic:"自然有机",brutal:"新野兽派",editorial:"编辑杂志",neu:"新拟物"};function be(t,e,r){if(typeof document>"u")return Yt(e)||"#000000";let a=document.createElement("span");a.style.cssText="position:fixed;left:-9999px;visibility:hidden;color:var("+t+","+e+")",(document.body||document.documentElement).appendChild(a);let p=getComputedStyle(a).color;a.remove();let i=String(p||"").match(/[\d.]+/g)?.map(Number)||[];if(i.length>=3){let l=Pr(i[0],i[1],i[2]),b=i.length>3?Math.max(0,Math.min(1,i[3])):1;return b<1?Ft(r||e,l,b):l}return Yt(p)||Yt(e)||"#000000"}function pp(){let t=Qt(),e=re(),r=t==="dark",a=r?{bg:"#000000",surface:"#1C1C1E",input:"#2C2C2E",text:"#F5F5F7",secondary:"#A1A1A6",muted:"#8E8E93",border:"#38383A",primary:"#0A84FF"}:{bg:"#F5F5F7",surface:"#FFFFFF",input:"#F5F5F7",text:"#1D1D1F",secondary:"#6E6E73",muted:"#86868B",border:"#D2D2D7",primary:"#0071E3"},p={bg:be("--bg",a.bg),surface:be(e==="neu"?"--neu-base":"--surface",a.surface),input:be("--input-bg",a.input),text:be("--text",a.text),secondary:be("--text-secondary",a.secondary),muted:be("--text-muted",a.muted),border:be("--border",a.border,be(e==="neu"?"--neu-base":"--surface",a.surface)),primary:be("--primary",a.primary)},i={apple:{frameRadius:24,headerRadius:13,gridRadius:10,cardRadius:12,frameStroke:1,cardStroke:1,shadow:"soft"},flat:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:2,cardStroke:2,shadow:"none"},organic:{frameRadius:30,headerRadius:18,gridRadius:14,cardRadius:18,frameStroke:1,cardStroke:1,shadow:"warm"},brutal:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:3,cardStroke:3,shadow:"hard"},editorial:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:1,cardStroke:1,shadow:"none",serif:!0},neu:{frameRadius:22,headerRadius:14,gridRadius:10,cardRadius:14,frameStroke:0,cardStroke:0,shadow:"neu"}};return{id:t,skin:e,dark:r,label:(jl[e]||e)+" · "+(Pt[t]&&Pt[t].name||t),colors:p,shape:i[e]||i.apple}}function ip(t,e){return ni(t,e||pp())}function Ol(t){return new Promise((e,r)=>{let a=new Blob([t.svg],{type:"image/svg+xml;charset=utf-8"}),p=URL.createObjectURL(a),i=new Image;i.onload=()=>{try{let b=Math.min(2,Math.sqrt(15e6/(t.width*t.height))),m=document.createElement("canvas");m.width=Math.floor(t.width*b),m.height=Math.floor(t.height*b);let A=m.getContext("2d");A.scale(m.width/t.width,m.height/t.height),A.fillStyle=t.background||"#F8FAFC",A.fillRect(0,0,t.width,t.height),A.drawImage(i,0,0,t.width,t.height),m.toBlob(T=>T?e(T):r(new Error("无法生成课表图片")),"image/png")}catch(l){r(l)}finally{URL.revokeObjectURL(p)}},i.onerror=()=>{URL.revokeObjectURL(p),r(new Error("课表图片渲染失败"))},i.src=p})}async function Rl(t){let e=await Ol(ip(t));ho(e,bo(t.semester.label)+".png")}function fo(t,e){document.getElementById("urppp-feature-toast")?.remove();let r=document.createElement("div");r.id="urppp-feature-toast",r.textContent=String(t||""),r.className=e?"error":"",document.documentElement.appendChild(r),requestAnimationFrame(()=>r.classList.add("open")),setTimeout(()=>{r.classList.remove("open"),setTimeout(()=>r.remove(),220)},e?4200:2400)}let go=pi({document,window,ensureStyles:fl,loadData:ap,exportJson:Bl,exportIcs:Dl,exportPng:Rl,showToast:fo,nativePageUrl:$l,navigate:t=>{location.href=t},logger:console});function Hl(t,e,r,a){return go.run(t,e,r,a)}function Ul(t){return go.createMenu(t)}function Wl(t){if(t){try{t.stage.remove()}catch{}try{document.getElementById("urppp-pdf-reset-style")?.remove()}catch{}}}function Gl(){window.__urpppPdfDiagnose||(window.__urpppPdfDiagnose=async()=>{let t={time:new Date().toISOString()},e=document.getElementById("mycoursetable"),r=document.getElementById("page-content-template");t.host=!!e,t.pageSource=!!r,t.hostCards=e?e.querySelectorAll("div.class_div").length:-1,t.hostHasCourseTable=e?!!e.querySelector("#courseTable"):!1,t.hostHasCourseTableBody=e?!!e.querySelector("#courseTableBody"):!1,t.hostTableId=e&&e.querySelector("table")?e.querySelector("table").id:"none";try{let p=Ei(e);t.stage="ok",t.stageCards=p.target.querySelectorAll(".urppp-pdf-card").length,t.stageTableId=p.target.querySelector("table")?p.target.querySelector("table").id:"none",Wl(p)}catch(p){t.stage="failed",t.stageError=p&&p.message||String(p)}let a=typeof unsafeWindow<"u"?unsafeWindow:window;return t.deps={dollar:typeof a.$,loadFileList:typeof(a.Import&&a.Import.LoadFileList),back:typeof a.back,html2canvas:typeof a.html2canvas,originalDivBuild:typeof a.__urpppOriginalDivBuild},t})}function Jl(t){return t?(Gl(),async()=>{let e=document.getElementById("urppp-settings-panel"),r=document.getElementById("urppp-settings-mask");e&&e.classList.contains("open")&&e.classList.remove("open"),r&&r.classList.contains("open")&&r.classList.remove("open");try{await zi(t,{document,page:typeof unsafeWindow<"u"?unsafeWindow:window,onAfterRestore:hr})}catch(a){console.warn("[URP++] isolated native PDF export failed",a),fo("原生 PDF 隔离导出失败："+(a&&a.message||String(a))+"，请重试",!0)}}):null}function wr(t=location){return/\/(?:student\/courseSelect\/(?:thisSemesterCurriculum|courseSelectResult|calendarSemesterCurriculum)|student\/personalSenate\/giveLessonInfo\/thisSemesterSchedule)\//.test(t.pathname)}function Vl(t=location){return/\/student\/integratedQuery\/scoreQuery\/[^/]+\/index$/.test(t.pathname)}function xo(){if(!wr())return;let t=document.querySelector("#h4_id1")?.closest("h4")||document.querySelector("h4.header"),e=t?.querySelector(".right_top_oper")||document.querySelector("#mainDIV .right_top_oper, .page-content .right_top_oper"),r=Array.from((e||document).querySelectorAll("button, a")),a=l=>[l.textContent,l.getAttribute("title"),l.getAttribute("onclick")].filter(Boolean).join(" ").replace(/\s+/g," ");if(r.forEach(l=>{/打印.*课表|\bdy\s*\(/i.test(a(l))&&l.setAttribute("data-urppp-native-print-source","1")}),document.getElementById("urppp-native-schedule-export"))return;let p=r.find(l=>/导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(a(l))),i=Ul({source:"native",pdfHandler:Jl(p)});if(i.id="urppp-native-schedule-export",p&&p.parentElement){p.__urpppNativeExportState||(p.__urpppNativeExportState={display:p.style.getPropertyValue("display"),displayPriority:p.style.getPropertyPriority("display"),ariaHidden:p.getAttribute("aria-hidden"),tabIndex:p.getAttribute("tabindex")}),p.setAttribute("data-urppp-native-export-source","1"),p.style.setProperty("display","none","important"),p.setAttribute("aria-hidden","true"),p.setAttribute("tabindex","-1"),p.parentElement.insertBefore(i,p.nextSibling);return}if(e)e.appendChild(i);else if(t)t.appendChild(i);else{let l=document.getElementById("page-content-template")||document.querySelector(".page-content");if(l){let b=document.createElement("div");b.className="urppp-export-fallback",b.appendChild(i),l.prepend(b)}}}let Ze=null,ia=0;function yo(){clearTimeout(ia),ia=0,Ze&&Ze.observer.disconnect(),Ze=null}function Yl(){if(!wr()){yo();return}let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;if(!t||Ze&&Ze.root===t&&t.isConnected)return;yo();let e=new MutationObserver(()=>{clearTimeout(ia),ia=setTimeout(()=>xo(),80)});e.observe(t,{childList:!0,subtree:!0}),Ze={root:t,observer:e}}function sp(t,e,r){r===null?t.removeAttribute(e):t.setAttribute(e,r)}function Ql(t=document){let e=t&&t.querySelectorAll?t:document,r=e.matches?.("#urppp-native-schedule-export")?e:e.querySelector("#urppp-native-schedule-export");if(r){let a=r.closest(".urppp-export-fallback");r.remove(),a&&!a.children.length&&a.remove()}e.querySelectorAll("[data-urppp-native-export-source]").forEach(a=>{let p=a.__urpppNativeExportState;p&&(p.display?a.style.setProperty("display",p.display,p.displayPriority):a.style.removeProperty("display"),sp(a,"aria-hidden",p.ariaHidden),sp(a,"tabindex",p.tabIndex)),a.removeAttribute("data-urppp-native-export-source");try{delete a.__urpppNativeExportState}catch{}}),e.querySelectorAll("[data-urppp-native-print-source]").forEach(a=>{a.removeAttribute("data-urppp-native-print-source")})}let lp=cs({deps:{styles:Di,loadScores:Ap,loadProfile:cp,scoreToNumber:Ke,scoreToGpa:Qe,getInsertHost:()=>document.querySelector(".page-content")||document.getElementById("page-content-template")||null,shouldAutoExpand:()=>{let t=/[?&]urppp=sa(?:&|$)/.test(window.location.search);if(t)try{history.replaceState(null,"",window.location.pathname+window.location.hash)}catch{}return t}}}),Kl=Ip([da({id:"schedule-export",matches:t=>wr(t.location),mount:()=>{xo(),Yl()},unmount:t=>{yo(),Ql(t?.lifecycleKey)}}),da({id:"score-analysis",matches:t=>Vl(t.location),mount:()=>{try{lp.mount()}catch(t){console.warn("[URP++] score analysis mount",t)}},unmount:()=>{try{lp.unmount()}catch{}}})]);function sa(){let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;return Kl.refresh({document,location,window,lifecycleKey:t})}function Zl(t){go.bindHosts(t)}function kr(t){return String(t||"").replace(/\u00a0/g," ").replace(/\s+/g," ").replace(/^[\s:：]+|[\s:：]+$/g,"").trim()}function la(t,e){if(!t||!t.querySelectorAll)return"";let r=(e||[]).map(p=>kr(p).replace(/[：:]/g,"")),a=t.querySelectorAll(".profile-info-row, tr");for(let p=0;p<a.length;p++){let i=a[p],l=i.querySelector(".profile-info-name, th, label"),b=i.querySelector(".profile-info-value, td:last-child");if(!l||!b||l===b)continue;let m=kr(l.textContent).replace(/[：:]/g,"");if(!r.some(T=>m===T||m.endsWith(T)))continue;let A=kr(b.textContent);if(A&&A!=="—"&&A!=="-")return A}return""}function Xe(t){return kr(t).replace(/^主修为\s*/,"").replace(/培养方案概况.*$/,"").replace(/…+/g,"").split(/主修必修GPA|GPA算法|已修读|尚不及格|本学期/)[0].trim()}function Xl(t){let e={majorPlan:"",majorGpa:""};return!t||!t.querySelectorAll||t.querySelectorAll(".infobox, .widget-box, .urppp-stat-card").forEach(r=>{let a=(r.innerText||r.textContent||"").trim(),p=kr(a);if(/主修必修GPA/.test(p)){let i=p.match(/(-?\d+(?:\.\d+)?)\s*主修必修GPA/)||p.match(/主修必修GPA[^\d-]{0,20}(-?\d+(?:\.\d+)?)/);if(i){let l=Number(i[1]),b=Number(e.majorGpa);Number.isFinite(l)&&l>=0&&l<=5&&(!e.majorGpa||b===0||l>0)&&(e.majorGpa=i[1])}}if(/主修为|培养方案/.test(p)){let i=p.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·+\-]{2,60}(?:培养方案|教学计划))/)||p.match(/^(.{2,60}?)\s*主修为/)||p.match(/主修为\s*(.{2,60})$/),l=Xe(i&&i[1]);if(l&&!/GPA|已修读|尚不及格|本学期/.test(l)){let b=/培养方案|教学计划/.test(l);(!e.majorPlan||b)&&(e.majorPlan=l)}}}),e}async function cp(){let t={name:"",avatar:"",majorPlan:"",majorGpa:"",studentId:""};try{let r=document.querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(r){let i=r.querySelector(".urppp-user-name-value"),l=i&&i.__urpppOriginalText;l&&(t.name=String(l).trim());let b=(r.innerText||r.textContent||"").replace(/\s+/g," ").trim(),m=t.name?null:b.match(/欢迎您[，,]\s*([\u4e00-\u9fa5·]{2,12})/);if(!t.name&&!m){let A=r.cloneNode(!0);A.querySelectorAll("small, i, img, b, .badge").forEach(N=>N.remove());let T=(A.textContent||"").replace(/\s+/g," ").trim();T=T.replace(/^欢迎您[，,]\s*/g,"").replace(/\d{8,}/g,"").trim(),m=T.match(/([\u4e00-\u9fa5·]{2,12})/)}m&&m[1]&&!/欢迎|同学|首页|反馈|密码|注销/.test(m[1])&&(t.name=m[1])}let a=document.querySelector("#navbar img.nav-user-photo, .ace-nav img.nav-user-photo");a&&(t.avatar=a.__urpppOriginalSrc||a.src||a.getAttribute("src")||"");let p=Xl(document);t.majorPlan=p.majorPlan,t.majorGpa=p.majorGpa}catch{}try{let r=await Kt("/student/rollManagement/rollInfo/index"),a=oa(r),p=a.body&&(a.body.innerText||a.body.textContent)||"";if(!t.name&&(t.name=la(a,["姓名"]),!t.name)){let m=p.match(/姓名\s*[：:]?\s*([\u4e00-\u9fa5·]{2,20})/);m&&(t.name=m[1].trim())}let i=la(a,["主修方案名称"]),l=la(a,["专业"]);if(t.studentId=la(a,["学号"]),t.studentId&&/^\d{6,20}$/.test(String(t.studentId)))try{GM_setValue("urppp_downs_sid",String(t.studentId))}catch{}i?t.majorPlan=Xe(i):!t.majorPlan&&l&&(t.majorPlan=Xe(l));let b=a.querySelector('.profile-picture img, img#avatar, img[src*="photo" i], img[src*="Photo"]');if(b&&b.getAttribute("src")&&!t.avatar){let m=b.getAttribute("src");t.avatar=/^https?:/i.test(m)?m:so(m)}}catch{}let e=Number(t.majorGpa);return t.name||(t.name="同学"),t.majorPlan||(t.majorPlan="主修方案"),(!Number.isFinite(e)||e<=0||e>5)&&(t.majorGpa="—"),t}let dp=["周日","周一","周二","周三","周四","周五","周六"];function vo(t){let e=[],r=t.querySelector("#courseTableBody")||t.querySelector("#courseTable tbody");if(!r)return e;r.querySelectorAll("td[id]").forEach(p=>{let i=String(p.id||"").match(/^(\d+)_(\d+)$/);if(!i)return;let l=parseInt(i[1],10),b=parseInt(i[2],10),m=l===7?0:l,A=p.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"]'),T=A.length?A:[];if(!T.length&&(p.textContent||"").trim()){let N=(p.textContent||"").replace(/\s+/g," ").trim();N&&e.push({name:N.slice(0,40),teacher:"",place:"",week:"",day:m,section:b});return}T.forEach(N=>{let I=Array.from(N.querySelectorAll("p")).map(Z=>(Z.textContent||"").trim()).filter(Boolean),O=(N.querySelector(".p-kcm-1, .p-kcm")||{}).textContent||I[0]||"",Q=(N.querySelector('.p-jxl-1, [class*="jxl"]')||{}).textContent||"",R=I.find((Z,ut)=>ut>0&&!/周|节/.test(Z)&&Z!==Q)||"",H=I.find(Z=>/周/.test(Z))||"",F=String(O).replace(/_\d+\s*$/,"").trim();!F||F.length<2||e.push({name:F,teacher:String(R).trim(),place:String(Q||"").trim(),week:String(H).trim(),day:m,section:b})})});let a=new Set;return e.filter(p=>{let i=[p.day,p.section,p.name,p.place].join("|");return a.has(i)?!1:(a.add(i),!0)})}let up="urppp_term_week_v1";function tr(t){let e=Number(t)||0;if(e<1||e>30)return 0;nt._termWeek=e,nt._termWeekResolved=!0;try{GM_setValue(up,e)}catch{}return e}function Ar(){if(nt&&nt._termWeek>=1)return nt._termWeekResolved=!0,nt._termWeek;try{let t=Number(GM_getValue(up,0))||0;if(t>=1&&t<=30)return tr(t)}catch{}return 0}function Sr(t){let e=String(t||"").replace(/\s+/g," ");if(!e)return 0;let r=[/(?:\d{4}\s*[-–]\s*\d{4}).{0,40}?第\s*(\d{1,2})\s*周/,/20\d{2}.{0,40}?第\s*(\d{1,2})\s*周/,/(?:春|秋|夏|冬)\s*第\s*(\d{1,2})\s*周/,/第\s*(\d{1,2})\s*周\s*(?:星期|周[一二三四五六日天])/];for(let a=0;a<r.length;a++){let p=e.match(r[a]);if(p){let i=parseInt(p[1],10);if(i>=1&&i<=30)return i}}return 0}function Ne(){if(nt._termWeekResolved&&nt._termWeek>=1&&nt._termWeek<=30)return nt._termWeek;try{let t=[document.querySelector("#navbar"),document.querySelector(".navbar-fixed-top"),document.querySelector(".navbar"),document.querySelector("#navbar .navbar-header"),document.querySelector("#navbar .navbar-buttons"),document.querySelector(".ace-nav"),document.querySelector("#breadcrumbs"),document.querySelector("#page-content-header"),document.querySelector(".page-header"),document.querySelector("header")].filter(Boolean);for(let l=0;l<t.length;l++){let b=t[l],m=Sr(b.innerText||b.textContent||"")||Sr(b.innerHTML||"");if(m)return tr(m)}let e=document.documentElement&&document.documentElement.innerHTML||"",r=Sr(e);if(r)return tr(r);let a=document.body&&document.body.innerText||"",p=Sr(a);if(p)return tr(p);let i=Ar();if(i)return i}catch{}return 0}let er=null;function tc(){let t=new Date,e=r=>String(r).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function ec(t,e){let r=new Date(`${t}T00:00:00`);r.setDate(r.getDate()+e);let a=p=>String(p).padStart(2,"0");return`${r.getFullYear()}-${a(r.getMonth()+1)}-${a(r.getDate())}`}function _r(t){if(er)return er;let e=t||tc();return e>="2027-02-06"&&e<=ec("2027-02-06",6)?"springfestival":e>="2027-01-18"&&e<"2027-03-01"?"winter":e>="2027-07-04"&&e<"2027-08-31"||e>="2026-07-04"&&e<"2026-08-31"?"summer":"term"}function rc(){let t='<svg viewBox="0 0 52 190"><path d="M26 0v16" stroke="#c8102e" stroke-width="3"/><rect x="16" y="16" width="20" height="8" rx="4" fill="#c8102e"/><ellipse cx="26" cy="62" rx="22" ry="30" fill="#e63946"/><path d="M26 26v72M14 34q12 12 0 24M38 34q-12 12 0 24" stroke="#ffd75e" stroke-width="1.4" fill="none"/><path d="M14 92h24M17 98h18M20 104h12" stroke="#ffd75e" stroke-width="2.4" stroke-linecap="round"/></svg>';return`<div id="urppp-festive-decor" aria-hidden="true"><div class="ufd ufd-left">${t}</div><div class="ufd ufd-right">${t}</div></div>`}function mp(){let t=typeof document<"u"?document:null;if(!t)return;let e=_r()==="springfestival",r=t.getElementById("urppp-festive-decor");e&&!r?t.documentElement.insertAdjacentHTML("beforeend",rc()):!e&&r&&r.remove()}function bp(t){er=t==="summer"||t==="winter"||t==="springfestival"||t==="term"?t:null,er&&er!=="term"&&(nt.weekLocked=!1,nt.viewWeek=0);try{mp()}catch{}try{typeof ar=="function"&&ar()}catch{}return er}function ac(){return _r()}function hp(){if(_r()!=="term")return nt.weekLocked?(!nt.viewWeek||nt.viewWeek<0)&&(nt.viewWeek=0):nt.viewWeek=0,nt.viewWeek;let t=Ne()||Ar()||0;return nt.weekLocked?(!nt.viewWeek||nt.viewWeek<1)&&(nt.viewWeek=t>=1?t:1):t>=1?nt.viewWeek=t:(!nt.viewWeek||nt.viewWeek<1)&&(nt.viewWeek=1),!nt.weekLocked&&t>1&&nt.viewWeek===1&&(nt.viewWeek=t),nt.viewWeek}async function oc(){let t=Ne();if(t>=1)return t;try{let e=await Kt("/index");if(t=Sr(e),t)return tr(t)}catch{}try{let e=new Date,r=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0"),a="xqh=03&jxlh=302&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(r),p=await Kt("/student/teachingResources/classroomUseStatus/jasInfo",{method:"POST",data:a,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),i=JSON.parse(p),l=Number(i&&i.jxzc);if(l>=1&&l<=30)return tr(l)}catch{}return Ar()||0}function nc(t){let e=Ne()||20;return(t||[]).forEach(r=>{let a=String(r.classWeek||"");a.length>e&&(e=a.length);let p=String(r.week||"").match(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/);p&&(e=Math.max(e,parseInt(p[2],10)||0));let i=String(r.week||"").match(/\d{1,2}/g);i&&i.forEach(l=>{e=Math.max(e,parseInt(l,10)||0)})}),Math.min(Math.max(e,1),30)}function fp(t,e){if(!e||!t)return!1;let r=String(t);return r.length>=e?r.charAt(e-1)==="1":!1}let gp=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#EC4899","#84CC16","#F97316","#6366F1"];function xp(t){let e=0,r=String(t||"");for(let a=0;a<r.length;a++)e=e*31+r.charCodeAt(a)>>>0;return gp[e%gp.length]}function pc(t){let e=[],r=Ne();(t&&t.xkxx||[]).forEach(i=>{Object.keys(i||{}).forEach(l=>{let b=i[l];if(!b)return;let m=b.courseName||b.englishCourseName||l,A=b.attendClassTeacher||"";(b.timeAndPlaceList||[]).forEach(N=>{let I=Number(N.classDay)||0,O=I===7?0:I,Q=Number(N.classSessions)||1,R=Math.max(1,Number(N.continuingSession)||1),H=[N.campusName,N.teachingBuildingName,N.classroomName].filter(Boolean).join(""),F=N.weekDescription||b.skzcs||"",Z=fp(N.classWeek,r)||r&&F.indexOf(String(r))>=0;e.push({name:String(m).trim(),teacher:String(A).trim(),place:String(H).trim(),week:String(F).trim(),classWeek:String(N.classWeek||""),day:O,section:Q,span:R,thisWeek:!!Z,color:xp(m)})})})});let p=new Set;return e.filter(i=>{let l=[i.day,i.section,i.span,i.name,i.place,i.week].join("|");return p.has(l)?!1:(p.add(l),!0)})}async function ic(){try{let t=await Kt("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),e=[],r=null;try{r=JSON.parse(t);let p=Number(r&&(r.jxzc||r.zc||r.currentWeek));p>=1&&p<=30&&(nt._termWeek=Math.max(nt._termWeek||0,p),nt.weekLocked||(nt.viewWeek=nt._termWeek)),e=pc(r)}catch{e=vo(oa(t))}e.length||(e=vo(document));let a=r?np(r,sr(r),"clean"):null;return{courses:e,exportData:a,rawOk:e.length>0,error:e.length?"":"课表 JSON 无 timeAndPlaceList"}}catch(t){try{let e=vo(document);if(e.length)return{courses:e,rawOk:!0,error:""}}catch{}return{courses:[],rawOk:!1,error:String(t&&t.message||t)}}}function sc(t,e){let r=String(t||""),a=new RegExp(`url\\s*=\\s*["']([^"']*`+e+`[^"']*)["']`,"i"),p=r.match(a);if(p&&p[1])return p[1];let i=new RegExp(`(\\/student\\/integratedQuery\\/scoreQuery\\/[^"'\\s]+`+e+")","i"),l=r.match(i);return l?l[1]:""}function lc(t){let e=[];return(t&&t.lnList||[]).forEach(a=>{let p=a.cjlx||a.cjbh||a.famc||a.zxjxjhh||"成绩",i=[];(a.cjList||[]).forEach(l=>{let b=l.courseName||l.englishCourseName||"";if(!b)return;let m=l.cj!=null&&l.cj!==""?String(l.cj):"";!m&&l.courseScore!=null&&(m=String(l.courseScore)),!m&&l.gradeName&&(m=String(l.gradeName)),!m&&l.zscj!=null&&(m=String(l.zscj));let A=l.courseAttributeName||l.xkcsxmc||"",T=parseFloat(l.credit)||0,N=l.id&&(l.id.courseNumber||l.id.kch_zj)||"",I=l.id&&(l.id.coureSequenceNumber||l.id.courseSequenceNumber||l.id.kxh)||l.classNo||"",O=l.gradePointScore!=null?Number(l.gradePointScore):null,Q=ue(m)||ue(l.gradeName)||O!=null&&O<0,R=Q?"未评估":m;i.push({code:N,seq:String(I||""),name:b,attr:A,credit:T,score:R,unevaluated:Q,required:Vn(A),officialGpa:ra(O)?O:null,evalUrl:""})}),i.length&&e.push({title:String(p).slice(0,100),courses:i,summary:ne(i),meta:{zxf:a.zxf,tgms:a.tgms,zms:a.zms,famc:a.famc}})}),e}async function yp(t,e){let r=await Kt(t),a=vp(oa(r));if(a.length)return a;let p=sc(r,e);if(!p)return[];let i=await Kt(p);try{let l=JSON.parse(i);a=lc(l).map(b=>(b.summary=ne(b.courses),b))}catch{a=vp(oa(i))}return a}function vp(t){let e=[];return t.querySelectorAll("table").forEach(r=>{let a=Array.from(r.tHead&&r.tHead.rows[0]?r.tHead.rows[0].cells:r.rows[0]&&r.rows[0].cells||[]).map(T=>(T.textContent||"").replace(/\s+/g,""));if(!a.length)return;let p=a.join("|");if(!/课程名/.test(p)||!/成绩/.test(p))return;let i={code:a.findIndex(T=>T==="课程号"),name:a.findIndex(T=>T==="课程名"),attr:a.findIndex(T=>/课程属性|属性/.test(T)),credit:a.findIndex(T=>T==="学分"),score:a.findIndex(T=>T==="成绩")};if(i.name<0||i.score<0)return;let l="成绩",b=r.previousElementSibling;for(let T=0;T<8&&b;T++,b=b.previousElementSibling)if(/^H[1-4]$/.test(b.tagName)||b.classList&&b.classList.contains("header")){l=(b.textContent||"").replace(/\s+/g," ").trim();break}let m=[],A=r.tBodies.length?r.tBodies[0].rows:Array.from(r.rows).slice(1);Array.from(A).forEach(T=>{let N=Array.from(T.cells||T.querySelectorAll("td"));if(N.length<4)return;let I=F=>F>=0&&N[F]?(N[F].textContent||"").replace(/\s+/g," ").trim():"",O=I(i.name),Q=I(i.score);if(!O||!Q||/课程名|序号/.test(O))return;let R=I(i.attr),H=ue(Q);m.push({code:I(i.code),name:O,attr:R,credit:parseFloat(I(i.credit))||0,score:H?"未评估":Q,unevaluated:H,required:Vn(R),officialGpa:null,evalUrl:""})}),m.length&&e.push({title:l.slice(0,100),courses:m,summary:ne(m)})}),e}function Er(t){return Xe(t&&t.meta&&t.meta.famc||t&&t.title||"")}function wp(t,e){if(!t||!t.length)return 0;let r=Xe(e),a=t.findIndex(l=>{let b=Er(l);return/培养方案/.test(b)&&!/微专业|辅修|双学位/.test(b)});if(a>=0&&(!r||Er(t[a]).includes(r.slice(0,4)))||r&&(a=t.findIndex(l=>{let b=Er(l);return b.includes(r.replace(/培养方案.*/,"培养方案"))||r.includes(b.slice(0,4))||b.includes(r.slice(0,4))}),a>=0))return a;let p=0,i=-1;return t.forEach((l,b)=>{if(/微专业|辅修/.test(Er(l)))return;let m=(l.courses||[]).length;m>i&&(i=m,p=b)}),p}async function cc(){let t={};try{let e=await Kt("/student/teachingAssessment/evaluation/queryAll",{method:"POST",data:"pageNum=1&pageSize=200&flag=kt",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),r;try{r=JSON.parse(e)}catch{r=null}(r&&r.data&&r.data.records||[]).forEach(p=>{let i=String(p.KCH||"").trim();if(!i)return;let l=String(p.SFPG)==="1",b=String(p.KTID||"").trim();if(!t[i]){t[i]={ktid:b,kxh:String(p.KXH||""),kcm:p.KCM||"",done:l,pending:l?0:1,total:1,url:!l&&b?"/student/teachingEvaluation/newEvaluation/evaluation/"+b:"/student/teachingEvaluation/newEvaluation/index"};return}t[i].total+=1,l||(t[i].pending+=1,t[i].done=!1,b&&(t[i].ktid=b,t[i].url="/student/teachingEvaluation/newEvaluation/evaluation/"+b))}),Object.keys(t).forEach(p=>{let i=t[p];i.done=!(i.pending>0)})}catch(e){console.warn("[URP++] evaluation map",e)}return t}function dc(t){if(!t)return!1;if(t.officialGpa!=null&&ra(t.officialGpa))return!0;let e=t.score;return e==null||e===""||ue(e)?!1:Ke(e)!=null||Qe(e)!=null?!0:!/未评估|未评教|待评估|待评教/.test(String(e))}function uc(t,e){if(!t||!e)return t;let r=a=>(a||[]).forEach(p=>{if(!p||!p.code)return;let i=e[p.code];if(i){if(dc(p)){p.unevaluated=!1,i.done?p.evalUrl=p.evalUrl||"":p.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index";return}i.done||(p.unevaluated=!0,p.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index",(!p.score||p.score===""||ue(p.score))&&(p.score="未评估"))}});return(t.passing||[]).forEach(a=>r(a.courses)),(t.schemes||[]).forEach(a=>r(a.courses)),t}function kp(t){return t&&(t.passing&&t.passing[0]&&(t.passing[0].summary=ne(t.passing[0].courses)),t.schemes=(t.schemes||[]).map(e=>(e.summary=ne(e.courses),e)),t)}async function mc(t){if(!t||t.evaluationLoading)return t;t.evaluationLoading=!0;try{let e=await cc();return uc(t,e),t.evalMap=e,t.evaluationReady=!0,kp(t)}finally{t.evaluationLoading=!1}}function bc(){if(!nt.scores||!nt.scores.schemes)return;let t=nt.scores.schemes,e=nt.profile&&nt.profile.majorPlan,r=wp(t,e);nt.scores.majorIdx=r,nt._schemeUserSelected||(nt.activeSchemeIdx=r,nt._schemeInited=!0);let a=t[r];if(!a||!nt.profile)return;let p=Er(a),i=Xe(nt.profile.majorPlan);/培养方案|教学计划/.test(p)&&(!/培养方案|教学计划/.test(i)||i==="主修方案")&&(nt.profile.majorPlan=p);let l=a.summary||{},b=Number(l.requiredCredit),m=Number(l.requiredGpa),A=Number(nt.profile.majorGpa);b>0&&Number.isFinite(m)&&m>=0&&m<=5&&(!Number.isFinite(A)||A<=0)&&(nt.profile.majorGpa=String(Ie(m)))}let rr=null;async function Ap(t){return t&&(rr=null),rr&&!rr.error||(rr=await hc()),rr}async function hc(){let t={passing:[],schemes:[],error:"",majorIdx:0,evaluationReady:!1,evaluationLoading:!1};try{let[e,r]=await Promise.all([yp("/student/integratedQuery/scoreQuery/allPassingScores/index","allPassingScores/callback"),yp("/student/integratedQuery/scoreQuery/schemeScores/index","schemeScores/callback")]),a=[];e.forEach(p=>p.courses.forEach(i=>{a.push(Object.assign({term:p.title},i))})),t.passing=[{title:"全部及格成绩",courses:a,summary:ne(a),groups:e}],t.schemes=r,!t.schemes.length&&a.length&&(t.schemes=[{title:"方案成绩",courses:a,summary:ne(a)}]),kp(t),t.majorIdx=wp(t.schemes,nt.profile&&nt.profile.majorPlan),!a.length&&!t.schemes.length&&(t.error="成绩 callback 无数据")}catch(e){t.error=String(e&&e.message||e)}return t}function Be(t){if(!t)return[];let e=String(t).trim();if(!e)return[];e=e.replace(/^['"]|['"]$/g,"");try{return JSON.parse(e)}catch{}try{return JSON.parse(e.replace(/&quot;/g,'"').replace(/&#34;/g,'"'))}catch{}return[]}function Sp(t,e){let r=t.indexOf(e);if(r<0)return"";let a=t.indexOf("[",r);if(a<0)return"";let p=0;for(let i=a;i<t.length&&i<a+3e5;i++){let l=t[i];if(l==="[")p++;else if(l==="]"&&(p--,p===0))return t.slice(a,i+1)}return""}async function fc(){let t=await Kt("/student/teachingResources/classroomUseStatus/index");if(/欢迎登录|name=["']j_username["']|loginEn/i.test(t)&&!/jxlList|teachingBuildingName|classroomUseStatus/i.test(t))throw new Error("登录已失效，请刷新页面后重试");let e=[],r=[];try{let i=(t.match(/id=["']xqList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']xqList["'][^>]*value=["']([^"']*)["']/i)||[])[1],l=(t.match(/id=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||[])[1];if(i&&(e=Be(i)),l&&(r=Be(l)),!e.length){let b=t.match(/(?:var\s+)?xqList\s*=\s*(\[[\s\S]*?\])\s*;/);b&&(e=Be(b[1]))}if(!r.length){let b=t.match(/(?:var\s+)?jxlList\s*=\s*(\[[\s\S]*?\])\s*;/);b&&(r=Be(b[1]))}if(!r.length){let b=Sp(t,"teachingBuildingName");b&&(r=Be(b))}if(!e.length){let b=Sp(t,"campusName");b&&(e=Be(b))}}catch(i){console.warn("[URP++] classroom json parse",i)}if(!r.length){let i=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}];e=i;let l=[];for(let b of i)try{let m=await Kt("/student/teachingResources/classroomCurriculum/"+b.campusNumber+"/teachingBuildingJson");Be(m).forEach(T=>{l.push({id:{campusNumber:b.campusNumber,teachingBuildingNumber:String(T.id&&T.id.teachingBuildingNumber||T.teachingBuildingNumber||"")},teachingBuildingName:T.teachingBuildingName||T.name||""})})}catch(m){console.warn("[URP++] building json",b.campusNumber,m)}r=l}e.length||(e=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}]);let a=e.map(i=>({campus:i.campusName||i.campusNumber,campusNumber:String(i.campusNumber||i.id&&i.id.campusNumber||""),buildings:[]}));r.forEach(i=>{let l=String(i.id&&i.id.campusNumber||i.campusNumber||""),b=String(i.id&&i.id.teachingBuildingNumber||i.teachingBuildingNumber||""),m=i.teachingBuildingName||i.name||b;if(!l||!b||!m)return;let A=a.find(N=>N.campusNumber===l);A||(A={campus:l,campusNumber:l,buildings:[]},a.push(A));let T="/student/teachingResources/classroomUseStatus/"+l+"/"+b+"/"+encodeURI(encodeURI(A.campus||l))+"/"+encodeURI(encodeURI(m));A.buildings.push({name:m,path:T,campusNumber:l,buildingNumber:b})});let p=a.filter(i=>i.buildings.length);if(!p.length)throw new Error("未解析到教学楼，请刷新后重试");return p}function Cr(t){let e=String(t&&t.occupancymoduleId||""),r={"06":"有课","07":"考试",14:"实验",room:"借用"};if(r[e])return r[e];if(t&&t.remark){let a=String(t.remark).trim();if(a)return a}return"占用"}function gc(t){if(t&&t.contentName)return String(t.contentName).trim();if(t&&t.remark){let e=String(t.remark).trim();if(e)return e}return Cr(t)}async function xc(t,e,r,a){let p=new URLSearchParams({planNumber:String(t||""),campusNumber:String(e||""),teachingBuildingNumber:String(r||""),classroomNumber:String(a||"")}),i=await Kt("/student/teachingResources/classroomCurriculum/searchCurriculum/callback?"+p.toString());try{let l=JSON.parse(i);return Array.isArray(l)?l.length&&Array.isArray(l[0])?l[0]:l.filter(b=>b&&typeof b=="object"&&(b.kcm||b.id&&b.id.kch)):l&&Array.isArray(l.list)?l.list:[]}catch{return[]}}function yc(t,e,r){let a=t||[],p=Number(e.xq)||0,i=Number(e.start)||0,l=Number(r)||0,b=[];return a.forEach(m=>{let A=m.id||{},T=Number(A.skxq!=null?A.skxq:m.skxq)||0,N=Number(A.skjc!=null?A.skjc:m.skjc)||0,I=Math.max(1,Number(m.cxjc)||1),O=A.skzc||m.skzc||"";p&&T&&p!==T||i&&(i<N||i>=N+I)||l&&O&&!io(O,l)||b.push(m)}),b.length?(b.sort((m,A)=>{let T=io(m.id&&m.id.skzc||m.skzc,l)?0:1,N=io(A.id&&A.id.skzc||A.skzc,l)?0:1;return T-N}),b[0]):null}async function vc(t,e,r){if(!t||!t.rooms||!t.rooms.length)return t;let a=String(e.campusNumber||""),p=String(e.buildingNumber||""),i=r||t.planNumber||"";if(!a||!p||!i)return t;let l=t.rooms.filter(I=>(I.slots||[]).some(O=>O.busy)),b={},m=async I=>{if(b[I])return b[I];try{b[I]=await xc(i,a,p,I)}catch{b[I]=[]}return b[I]},A=4,T=0,N=new Array(Math.min(A,Math.max(l.length,1))).fill(0).map(async()=>{for(;T<l.length;){let I=T++,O=l[I],Q=await m(O.name);(O.slots||[]).forEach(R=>{if(!R.busy)return;let H={xq:R.detail&&R.detail.xq||R.xq||0,start:R.section,week:t.jxzc};R.detail&&R.detail.xq!=null&&(H.xq=R.detail.xq);let F=yc(Q,H,t.jxzc);if(F&&F.kcm){let Z=String(F.kcm).trim();R.contentName=Z,R.reason=Z,R.displayChar=aa(Z),R.detail&&(R.detail.contentName=Z,R.detail.reason=Z,R.detail.teacher=F.jsm||"",R.detail.weeks=F.zcsm||"",R.detail.courseNo=F.id&&F.id.kch||"",R.detail.typeLabel=Cr({occupancymoduleId:R.module}))}else R.displayChar=aa(R.reason||"占用"),R.detail&&(R.detail.typeLabel=Cr({occupancymoduleId:R.module}))})}});return await Promise.all(N),t}function wc(t){return t==="有课"?"kind-course":t==="考试"?"kind-exam":t==="实验"?"kind-lab":t==="借用"?"kind-borrow":"kind-busy"}async function kc(t){let e="",r="",a="",p="";if(t&&typeof t=="object")e=String(t.campusNumber||""),r=String(t.buildingNumber||""),a=t.name||"",p=t.path||"";else{p=String(t||"");let F=p.match(/classroomUseStatus\/(\d+)\/(\d+)\//);F&&(e=F[1],r=F[2])}if(!e||!r)throw new Error("缺少校区/楼栋编号");let i=Number(t&&t.dateOffset!=null?t.dateOffset:nt.roomDateOffset)||0,l=Ac(_p(new Date,i)),b="xqh="+encodeURIComponent(e)+"&jxlh="+encodeURIComponent(r)+"&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(l),m=await new Promise((F,Z)=>{let ut=so("/student/teachingResources/classroomUseStatus/jasInfo");typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest({method:"POST",url:ut,data:b,withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},onload:wt=>wt.status>=200&&wt.status<400?F(wt.responseText||""):Z(new Error("HTTP "+wt.status)),onerror:()=>Z(new Error("network"))}):fetch(ut,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:b}).then(wt=>wt.text()).then(F).catch(Z)}),A;try{A=JSON.parse(m)}catch{throw new Error("jasInfo 非 JSON")}let T=(A.classrooms||[]).map(F=>{let Z=F.classroomName||F.id&&F.id.classroomNumber||"",ut=F.placeNum||"",wt=F.remark||"",Ct=[];for(let qt=1;qt<=12;qt++)Ct.push({section:qt,busy:!1});return{name:Z,seats:ut,type:wt,slots:Ct,map:{}}}),N={};T.forEach(F=>{N[F.name]=F}),(A.classroomTime||[]).forEach(F=>{let Z=F.id||{},ut=Z.classroomNumber||"",wt=Number(Z.sessionstart)||1,Ct=Math.max(1,Number(F.continuingsession)||1),qt=N[ut];if(!qt)return;let Tt=Cr(F),Ot=gc(F);for(let Rt=wt;Rt<wt+Ct&&Rt<=12;Rt++){let It=qt.slots.find(Ut=>Ut.section===Rt);It&&(It.busy=!0,It.kind=F.timestatenumber||F.occupancymoduleId||"",It.module=F.occupancymoduleId||"",It.reason=Ot,It.typeLabel=Tt,It.displayChar=aa(Ot),It.xq=Z.xq,It.weekBitmap=Z.week||"",It.detail={room:ut,section:Rt,start:wt,span:Ct,reason:Ot,typeLabel:Tt,week:Z.week||"",xq:Z.xq||"",state:F.timestatenumber||"",module:F.occupancymoduleId||""})}});let I="";try{let F=A.jhZxjxjhb;typeof F=="string"&&/\d{4}-\d{4}-\d-\d/.test(F)?I=F:F&&typeof F=="object"&&(I=String(F.zxjxjhh||F.jhxnxq||F.executiveEducationPlanNumber||F.planNumber||""))}catch{}if(!I&&A.classrooms&&A.classrooms[0]&&A.classrooms[0].id&&(I=A.classrooms[0].id.executiveEducationPlanNumber||""),A.jxzc!=null&&Number(A.jxzc)>=1){let F=Number(A.jxzc);nt._termWeek=Math.max(nt._termWeek||0,F),nt.weekLocked||(nt.viewWeek=nt._termWeek)}let O=["日","一","二","三","四","五","六"],Q=Sc(A.date||l)||_p(new Date,i),R=A.week!=null?Number(A.week):Q.getDay(),H=i===1?"明天":i===2?"后天":"今天";return{rooms:T,dateLabel:(A.date||l)+"（周"+(O[R]||R)+" · "+H+"）",jxzc:A.jxzc,planNumber:I,week:A.week!=null?A.week:R,searchDate:A.date||l,dateOffset:i}}function _p(t,e){let r=new Date(t.getFullYear(),t.getMonth(),t.getDate());return r.setDate(r.getDate()+(Number(e)||0)),r}function Ac(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}function Sc(t){let e=String(t||"").match(/(\d{4})-(\d{1,2})-(\d{1,2})/);return e?new Date(Number(e[1]),Number(e[2])-1,Number(e[3])):null}let Ep={clean:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h11M4 17h14"/></svg>',exit:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M14 12H8"/><path d="m14 8 4 4-4 4"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',schedule:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/></svg>',score:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h10v17H7z"/><path d="M10 8h4M10 12h4M10 16h3"/></svg>',room:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-7h6v7"/><path d="M9 10h.01M15 10h.01"/></svg>',eval:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 7h11M8 12h11M8 17h8"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg>',plan:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h8l3 3V20.5H7z"/><path d="M15 3.5V7h3M10 12h5M10 16h5"/></svg>',apply:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',home:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 11 8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/></svg>',more:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',close:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'};function Cp(t){return Ep[t]||Ep.more}let nt=Oi();function _c(){if(document.getElementById("urppp-clean-style"))return;let t=document.createElement("style");t.id="urppp-clean-style",t.textContent=Bi,(document.head||document.documentElement).appendChild(t)}let Ec=ka({deps:{scoreToNumber:Ke,scoreToGpa:Qe}}),{metricHtml:Cc,occupancyHtml:Pc,render:ar,renderScheduleBoard:Ld,roomPickerHtml:zc,scheduleRender:Lc}=Xi({state:nt,deps:{DIRECT_EDIT_LABELS:U,DAY_NAMES:dp,analyzeScores:t=>Ec.analyzeScores(t),applyPersonalDisplay:Zt,bandsChartSvg:Sa,bindUI:t=>Tc(t),classifyPrivacyLabel:na,courseColor:xp,ensureRoot:()=>zp(),escapeHtml:X,firstContentChar:aa,getViewWeekNumber:hp,ico:Cp,isCleanAnalysisDirect:Pa,occupancyKindClass:wc,occupancyTypeLabel:Cr,personalizedProfile:Ml,scoreChartLayout:()=>{try{return window.matchMedia&&window.matchMedia("(max-width: 900px)").matches?{variant:"mobile"}:null}catch{return null}},scoreToNumber:Ke,summarizeCourses:ne,trendChartSvg:Aa,weekBitActive:fp,calVacation:_r,setCalendarPhase:bp}}),{ensureRoomCatalogLoaded:Pp,loadAll:qc}=Hi({state:nt,deps:{ensureTermWeekResolved:oc,enrichScoresWithEvaluation:mc,getCurrentWeekNumber:Ne,loadClassroomCatalog:fc,loadProfile:cp,loadSchedule:ic,loadScores:Ap,readRememberedTermWeek:Ar,reconcileProfileAndScores:bc,render:ar,scheduleRender:Lc}}),{bindUI:Tc,closeModal:Mc,getRoomHost:qd,openModal:Td,openRoomModal:Md,openScoreModal:Id,showBuilding:$d}=ts({state:nt,deps:{DAY_NAMES:dp,applyPersonalDisplay:Zt,bindScheduleExportHosts:Zl,closeCleanMode:()=>$c(),ensureRoomCatalogLoaded:Pp,enrichOccupancyWithCurriculum:vc,ensureRoot:()=>zp(),escapeHtml:X,fetchText:Kt,getCurrentWeekNumber:Ne,getViewWeekNumber:hp,inferMaxWeek:nc,isUnevaluatedScore:ue,isValidOfficialGpa:ra,loadBuildingOccupancy:kc,metricHtml:Cc,occupancyHtml:Pc,render:ar,rootEl:()=>Nc(),roomPickerHtml:zc,scoreToGpa:Qe,scoreToNumber:Ke,summarizeCourses:ne,summarizeCoursesPreferOfficial:ne}}),{cleanModeApi:Ic,closeCleanMode:$c,ensureRoot:zp,injectCleanEntry:Nd,openCleanMode:Bd,rootEl:Nc}=es({state:nt,deps:{CLEAN_FLAG:hl,applySkinAttr:oe,closeModal:Mc,ensureRoomCatalogLoaded:Pp,ensureStyle:_c,getCurrentWeekNumber:Ne,getSkin:re,handleThemeDotClick:ct,ico:Cp,injectCleanSidebarSections:t=>{try{window.__urpppInjectCleanSidebarSections?.(t)}catch{}},refreshMobileNavbar:()=>{try{window.__urpppRefreshMobileNavbar?.()}catch{}},setDrawerOpen:(t,e,r)=>{try{window.__urpppSetDrawerOpen?.(t,e,r)}catch{}},stopDrawerAnimation:t=>{try{window.__urpppStopDrawerAnimation?.(t)}catch{}},isHomePage:Or,loadAll:qc,openSettingsPanel:An,readRememberedTermWeek:Ar,refreshCleanPersonalDisplay:mo,render:ar,scoreToGpa:Qe,summarizeCourses:ne,syncNavbarThemeUI:xt,syncSettingsPanelUI:jt,syncThemeDotGroup:tt}});window.__urpppCleanMode=Ic;function wo(){if(!document.body){setTimeout(wo,10);return}if(Vo(),Jt(Qt()),setTimeout(()=>{try{we().then(e=>ze(e))}catch{}},0),document.addEventListener("focusin",e=>{let r=e.target;if(!r||!r.matches||!r.matches(".chosen-search input"))return;let a=[],p=r.parentElement;for(;p;){let i=p.scrollTop,l=p.scrollLeft;(i||l||p.scrollHeight>p.clientHeight||p.scrollWidth>p.clientWidth)&&a.push({el:p,top:i,left:l}),p=p.parentElement}requestAnimationFrame(()=>{a.forEach(i=>{i.el.scrollTop=i.top,i.el.scrollLeft=i.left})})},!0),!!document.getElementById("formContent")&&!!document.querySelector(".form-signin")){tn();try{_n()}catch{}try{Tp()}catch{}}else{try{_n()}catch{}try{Tp()}catch{}$s();try{Yn()}catch{}try{sa()}catch(e){console.warn("[URP++] route feature refresh",e)}try{yl()}catch{}try{Zt(document)}catch{}try{mp()}catch{}[350,900,1800].forEach(e=>setTimeout(()=>{try{sa()}catch{}try{Zt(document)}catch{}},e));try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}[400,1200,2500].forEach(e=>setTimeout(()=>{try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}},e));try{Ca()&&Or()&&window.__urpppCleanMode&&setTimeout(()=>{try{window.__urpppCleanMode.open(!1)}catch{}},700)}catch{}}}if(!window.__urpppSidebarSyncBound){window.__urpppSidebarSyncBound=!0,window.addEventListener("resize",()=>{clearTimeout(window.__urpppSidebarSyncTimer),window.__urpppSidebarSyncTimer=setTimeout(Me,50)}),window.addEventListener("load",()=>{Me(),Ye(),setTimeout(Me,100),setTimeout(Me,400)}),document.addEventListener("click",e=>{e.target&&e.target.closest&&e.target.closest("#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse")&&(setTimeout(Ye,0),setTimeout(Ye,50),setTimeout(Ye,200))},!0);let t=document.getElementById("sidebar");t&&!t.__urpppMarginObs&&(t.__urpppMarginObs=new MutationObserver(()=>{clearTimeout(window.__urpppMarginObsTimer),window.__urpppMarginObsTimer=setTimeout(Ye,30)}),t.__urpppMarginObs.observe(t,{attributes:!0,attributeFilter:["class","style"]}))}function Lp(){if(window.__urpppRouteWatchBound)return;window.__urpppRouteWatchBound=!0;let t=0,e=()=>{try{let p=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches),i=!!(document.getElementById("urppp-clean-root")&&document.getElementById("urppp-clean-root").classList.contains("open"));p&&!i&&window.__urpppCloseMobileDrawer&&window.__urpppCloseMobileDrawer()}catch{}clearTimeout(t),t=setTimeout(()=>{if(nt._termWeekResolved=!1,!!document.getElementById("sidebar")){Me(),Jn(),st(),Me();try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}dt(),[250,700].forEach(i=>setTimeout(()=>{try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}},i)),ja(),yn(),vn(),dn(),wn(),xn(),mn(),document.querySelectorAll(".page-content, #page-content-template").forEach(i=>{let l=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches);i.style.setProperty("padding",l?"8px 8px 24px":"16px 64px 40px","important"),i.style.setProperty("box-sizing","border-box","important")}),Ur(),Jr(),We(),setTimeout(We,300),setTimeout(We,1e3),on(),ve(),mr(),sn(),setTimeout(mr,300),br(),setTimeout(()=>br(),500),Hr(),pn();try{xl()}catch{}try{sa()}catch{}try{Zt(document)}catch{}setTimeout(()=>{try{sa()}catch{}try{Zt(document)}catch{}},500)}},100)};window.addEventListener("popstate",e),window.addEventListener("hashchange",e);let r=history.pushState,a=history.replaceState;history.pushState=function(...p){let i=r.apply(this,p);return e(),i},history.replaceState=function(...p){let i=a.apply(this,p);return e(),i}}let or=typeof unsafeWindow<"u"?unsafeWindow:window;or.__urpppDebug=or.__urpppDebug||{},or.__urpppDebug.setCalendarPhase=t=>bp(t),or.__urpppDebug.getCalendarPhase=()=>ac(),or.__urpppDebug.calVacation=t=>_r(t),or.urppp={version:o,showLogo(t){let e=document.querySelector("#urppp-brand .ub-logo");e&&e.classList.toggle("show",t)},theme:{apply:t=>{Jt(t)},setAccent:bs,getAccent:Xt,getCurrent:Qt,list:()=>Object.entries(Pt).map(([t,e])=>({name:t,displayName:e.name,current:t===Qt()}))},update:{check:no,auto:oo,showToast:ao},privacy:{get:Pe,set(t){return La(t),Zt(document),Pe()},apply:()=>Zt(document),identity:{get:Oe,set(t){return Uo(t),Zt(document),mo(),Oe()}}},scheduleExport:{load:()=>ap("api"),run:t=>Hl(t,"api",null,null),patch:xo,image:{theme:pp,build:(t,e)=>ip(t,e)},jsonFormat:{get:jr,set:Go,validate:Fe,build(t,e){let r=ma(t);if(e)return ha(r,Fe(e));let a=jr();return a.enabled?ha(r,a.mapping):ba(r)},buildDefault(t){return ba(ma(t))}}}};function qp(){setTimeout(()=>{try{oo()}catch{}},1800)}function Tp(){setTimeout(()=>{try{if(GM_getValue("urppp_builtin_downs_reported",!1))return;(typeof u<"u"?u:[]).filter(e=>e&&e.builtin).map(e=>e.id).forEach(e=>{try{Ka(e,xr)}catch{}}),GM_setValue("urppp_builtin_downs_reported",!0)}catch{}},2600)}try{Vo()}catch{}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{wo(),Lp(),qp()}):(wo(),Lp(),qp())})();})();
