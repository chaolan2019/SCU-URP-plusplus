// ==UserScript==
// @name         SCU URP++教务系统美化
// @namespace    https://github.com/chaolan2019/SCU-URP-plusplus
// @version      1.9.4
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
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      cdn.jsdelivr.net
// @connect      gh-proxy.com
// @run-at       document-start
// ==/UserScript==

// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

(()=>{function Yr(n){let o=String(n).replace("#","").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return o?{r:parseInt(o[1],16),g:parseInt(o[2],16),b:parseInt(o[3],16)}:{r:30,g:58,b:95}}function me(n,o,l){return"#"+[n,o,l].map(c=>Math.max(0,Math.min(255,Math.round(c))).toString(16).padStart(2,"0")).join("")}function Ut(n){let o=String(n||"").trim();return o?(o[0]!=="#"&&(o="#"+o),/^#[0-9a-fA-F]{6}$/.test(o)?o.toUpperCase():""):""}function Wa(n,o){let{r:l,g:c,b:d}=Yr(n),w=1-o;return me(l*w,c*w,d*w)}function hr(n,o){let{r:l,g:c,b:d}=Yr(n);return`rgba(${l},${c},${d},${o})`}function It(n,o,l){let c=Yr(Ut(n)||"#FFFFFF"),d=Yr(Ut(o)||"#FFFFFF"),w=Math.max(0,Math.min(1,Number(l)||0));return me(c.r+(d.r-c.r)*w,c.g+(d.g-c.g)*w,c.b+(d.b-c.b)*w)}function Ga(n,o){if(typeof n!="function")throw new TypeError(`${o} must be a function`)}function He(n){if(!n||typeof n!="object")throw new TypeError("feature definition must be an object");let o=String(n.id||"").trim();if(!o)throw new TypeError("feature id is required");return Ga(n.matches,`${o}.matches`),Ga(n.mount,`${o}.mount`),Ga(n.unmount,`${o}.unmount`),Object.freeze({id:o,matches:n.matches,mount:n.mount,unmount:n.unmount})}function Un(n){if(!Array.isArray(n))throw new TypeError("features must be an array");let o=n.map(He),l=new Set;o.forEach(A=>{if(l.has(A.id))throw new Error(`duplicate feature id: ${A.id}`);l.add(A.id)});let c=null,d=null;function w(){if(!c)return;let A=c,x=d;c=null,d=null,A.unmount(x)}function C(A={}){let x=o.find(h=>h.matches(A));if(x&&c===x&&A.lifecycleKey!==void 0&&d?.lifecycleKey===A.lifecycleKey)try{return x.mount(A),d=A,x.id}catch(h){throw w(),h}if(w(),!x)return null;try{return x.mount(A),c=x,d=A,x.id}catch(h){try{x.unmount(A)}catch{}throw h}}return Object.freeze({refresh:C,unmount:w,getActiveFeatureId:()=>c?.id||null,listFeatureIds:()=>o.map(A=>A.id)})}function it(n){return String(n||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function Ja(n){let o=String(n||"").match(/@version\s+([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)/i);return o?o[1]:""}function Wn(n){return String(n||"0").replace(/^v/i,"").split(/[.+\-]/).filter(Boolean).map(o=>/^\d+$/.test(o)?parseInt(o,10):o)}function be(n,o){let l=Wn(n),c=Wn(o),d=Math.max(l.length,c.length);for(let w=0;w<d;w+=1){let C=l[w]==null?0:l[w],A=c[w]==null?0:c[w];if(typeof C=="number"&&typeof A=="number"){if(C>A)return 1;if(C<A)return-1;continue}let h=String(C),v=String(A);if(h>v)return 1;if(h<v)return-1}return 0}var ge={base:{},coursesPath:"courses",schedulePath:"schedule",courseFields:{name:"name",teacher:"teacher",position:"position",day:"day",sections:"sections",weeks:"weeks"},scheduleFields:{morningNum:"morningNum",afternoonNum:"afternoonNum",nightNum:"nightNum",sections:"sections"}},Pl=["name","teacher","position","day","sections","weeks","code","sequence","englishName","attribute","category","credit","status","campus","building","classroom","startSection","endSection","weekList"],zl=["morningNum","afternoonNum","nightNum","sections","sectionList"];function Ya(n){return JSON.parse(JSON.stringify(n))}function Yn(n,o){return n===o||n.startsWith(`${o}.`)||o.startsWith(`${n}.`)}function Re(n,o){let l=String(n??"").trim();if(!l){if(o)return"";throw new Error("课程数组输出路径不能为空")}if(l.length>120)throw new Error("JSON 输出路径不能超过 120 个字符");let c=l.split("."),d=new Set(["__proto__","prototype","constructor"]);if(c.some(C=>!C||/^\d+$/.test(C)||/[\[\]\x00-\x1f]/.test(C)||d.has(C)))throw new Error(`JSON 输出路径包含无效片段：${l}`);return c.join(".")}function Ll(n,o){for(let l=0;l<n.length;l+=1)for(let c=l+1;c<n.length;c+=1)if(Yn(n[l],n[c]))throw new Error(`${o}目标路径不能重叠：${n[l]} / ${n[c]}`)}function Gn(n,o,l){let c=o.split("."),d=n;for(let w=0;w<c.length;w+=1){let C=c[w];if(!Object.prototype.hasOwnProperty.call(d,C))return;if(w===c.length-1)throw new Error(`${l}输出路径与 base 字段重叠：${o}`);if(d=d[C],!d||typeof d!="object"||Array.isArray(d)){let A=c.slice(0,w+1).join(".");throw new Error(`${l}输出路径无法穿过 base 中的非对象字段：${A}`)}}}function Jn(n,o,l){if(!n||typeof n!="object"||Array.isArray(n))throw new Error(`${l}字段映射必须是对象`);let c={};return Object.entries(n).forEach(([d,w])=>{if(!o.includes(d))throw new Error(`${l}不支持源字段：${d}`);let C=Re(w,!0);C&&(c[d]=C)}),Ll(Object.values(c),`${l}字段`),c}function Cr(n){if(!n||typeof n!="object"||Array.isArray(n))throw new Error("自定义 JSON 映射必须是对象");let o=n.base==null?{}:n.base;if(!o||typeof o!="object"||Array.isArray(o))throw new Error("base 必须是 JSON 对象");let l={base:Ya(o),coursesPath:Re(n.coursesPath,!1),schedulePath:Re(n.schedulePath,!0),courseFields:Jn(n.courseFields,Pl,"课程"),scheduleFields:Jn(n.scheduleFields||{},zl,"时间表")};if(!Object.keys(l.courseFields).length)throw new Error("至少保留一个课程字段映射");if(l.schedulePath&&Yn(l.schedulePath,l.coursesPath))throw new Error("课程与时间表输出路径不能重叠");return Gn(l.base,l.coursesPath,"课程"),l.schedulePath&&Gn(l.base,l.schedulePath,"时间表"),l}function he(n){let o=String(n||"").replace(/\D/g,"").padStart(4,"0").slice(-4),l=`${o.slice(0,2)}:${o.slice(2)}`;return/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(l)?l:""}function Va(n,o,l){let c=Re(o,!1).split("."),d=n;c.forEach((w,C)=>{if(C===c.length-1){d[w]=l;return}(!d[w]||typeof d[w]!="object"||Array.isArray(d[w]))&&(d[w]={}),d=d[w]})}function Vn(n,o){let l={};return Object.entries(o||{}).forEach(([c,d])=>{!Object.prototype.hasOwnProperty.call(n,c)||n[c]===void 0||Va(l,d,Ya(n[c]))}),l}function ql(n){return[n.campus,n.building,n.classroom].map(o=>String(o||"").trim()).filter(Boolean).join(" ")}function Tl(n){let o=Number(n.startSection)||0,l=Number(n.endSection)||o;return o<1||l<o?"":Array.from({length:l-o+1},(c,d)=>o+d).join(",")}function Ml(n,o){let l=Number(o.day)||0,c=Tl(o),d=Array.from(new Set((o.weeks||[]).map(Number).filter(w=>Number.isInteger(w)&&w>=1&&w<=60))).sort((w,C)=>w-C);return l<1||l>7||!c?{error:"invalid"}:d.length?{value:{name:n.name,teacher:n.teacher,position:ql(o),day:l,sections:c,weeks:d.join(","),code:n.code,sequence:n.sequence,englishName:n.englishName,attribute:n.attribute,category:n.category,credit:n.credit,status:n.status,campus:o.campus,building:o.building,classroom:o.classroom,startSection:o.startSection,endSection:o.endSection,weekList:d}}:{error:"weeks"}}function $l(n,o){let l=[];return n.courses.forEach(c=>{if(!c.arrangements.length){o.unscheduledCourses+=1;return}c.arrangements.forEach(d=>{let w=Ml(c,d);w.error==="weeks"?o.missingWeeks+=1:w.error?o.invalidArrangements+=1:l.push(w.value)})}),l}function Il(n){let o=new Map;return(n||[]).forEach(l=>{let c=Number(l.section),d=he(l.start),w=he(l.end);!Number.isInteger(c)||c<1||c>20||!d||!w||o.set(c,{i:c,s:d,e:w})}),Array.from(o.values()).sort((l,c)=>l.i-c.i)}function Nl(n){let o=Il(n);if(!o.length)return{};let l={sections:JSON.stringify(o),sectionList:o};if(!o.every((d,w)=>d.i===w+1))return l;let c={morningNum:0,afternoonNum:0,nightNum:0};return o.forEach(d=>{let[w,C]=d.s.split(":").map(Number),A=w*60+C;A<720?c.morningNum+=1:A>=1080?c.nightNum+=1:c.afternoonNum+=1}),c.morningNum&&c.afternoonNum&&c.nightNum?Object.assign(l,c):l}function Ue(n){let o={unscheduledCourses:0,missingWeeks:0,invalidArrangements:0},l=$l(n,o);if(!l.length)throw new Error("没有符合导入格式的已排课课程");return{courses:l,schedule:Nl(n.sections),stats:o}}function We(n){let o={courses:n.courses.map(c=>({name:c.name,teacher:c.teacher,position:c.position,day:c.day,sections:c.sections,weeks:c.weeks}))},l={};return["morningNum","afternoonNum","nightNum","sections"].forEach(c=>{Object.prototype.hasOwnProperty.call(n.schedule,c)&&(l[c]=n.schedule[c])}),Object.keys(l).length&&(o.schedule=l),o}function Ge(n,o){let l=Ya(o.base||{}),c=n.courses.map(d=>Vn(d,o.courseFields));if(Va(l,o.coursesPath,c),o.schedulePath&&Object.keys(n.schedule).length){let d=Vn(n.schedule,o.scheduleFields);Object.keys(d).length&&Va(l,o.schedulePath,d)}return l}function fe(n){return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0")}function Qr(n){let o=String(n||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!o)return null;let l=new Date(Number(o[1]),Number(o[2])-1,Number(o[3]));return Number.isNaN(l.getTime())||fe(l)!==String(n)?null:l}function Qa(n){let o=new Date(n.getFullYear(),n.getMonth(),n.getDate()),l=o.getDay();return o.setDate(o.getDate()-(l===0?6:l-1)),o}function Xn(n){let o=String(n||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!o)return fe(Qa(new Date));let l=o[3]==="1"?Number(o[1]):Number(o[2]),c=o[3]==="1"?8:2,d=new Date(l,c,1);for(;d.getDay()!==1;)d.setDate(d.getDate()+1);return fe(d)}function Qn(n){return n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0")+"T"+String(n.getHours()).padStart(2,"0")+String(n.getMinutes()).padStart(2,"0")+"00"}function Je(n){return String(n||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}function Bl(n){if(typeof TextEncoder!="function")return n;let o=new TextEncoder,l=[],c="",d=73;for(let w of String(n))o.encode(c+w).length>d&&c?(l.push(c),c=" "+w,d=74):c+=w;return c&&l.push(c),l.join(`\r
`)}function Fl(n){let o=2166136261,l=String(n||"");for(let c=0;c<l.length;c+=1)o=Math.imul(o^l.charCodeAt(c),16777619);return(o>>>0).toString(16)+"@scu-urppp"}function Kn(n){let o=new Map;return n.sections.forEach(l=>o.set(l.section,l)),o}function Dl(n){return n.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}function Zn(n,o,l={}){let c=Qr(o);if(!c)throw new Error("第一教学周日期无效");let d=Kn(n);if(!d.size)throw new Error("教务接口没有返回节次时间，无法生成 ICS");let w=Dl(l.now instanceof Date?l.now:new Date),C=0,A=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SCU URP++//Schedule Export//CN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:"+Je(n.semester.label+"课表"),"X-WR-TIMEZONE:Asia/Shanghai","BEGIN:VTIMEZONE","TZID:Asia/Shanghai","X-LIC-LOCATION:Asia/Shanghai","BEGIN:STANDARD","TZOFFSETFROM:+0800","TZOFFSETTO:+0800","TZNAME:CST","DTSTART:19700101T000000","END:STANDARD","END:VTIMEZONE"];if(n.courses.forEach(x=>x.arrangements.forEach(k=>{let h=d.get(k.startSection),v=d.get(k.endSection);!h||!v||k.weeks.forEach(q=>{let E=new Date(c);E.setDate(c.getDate()+(q-1)*7+k.day-1);let m=new Date(E),u=new Date(E),y=h.start.split(":").map(Number),f=v.end.split(":").map(Number);m.setHours(y[0],y[1],0,0),u.setHours(f[0],f[1],0,0);let S=[k.campus,k.building,k.classroom].filter(Boolean).join(" "),L=["教师："+x.teacher,"周次："+k.weekDescription,"课程号："+x.code+(x.sequence?"_"+x.sequence:""),"学分："+x.credit,"课程属性："+x.attribute].filter(z=>!/[：:]$/.test(z)).join(`
`),$=[n.semester.planCode,x.code,x.sequence,k.day,k.startSection,k.endSection,q,k.campus,k.building,k.classroom].join("|");C+=1,A.push("BEGIN:VEVENT","UID:"+Fl($),"DTSTAMP:"+w,"SUMMARY:"+Je(x.name),"LOCATION:"+Je(S),"DESCRIPTION:"+Je(L),"DTSTART;TZID=Asia/Shanghai:"+Qn(m),"DTEND;TZID=Asia/Shanghai:"+Qn(u),"END:VEVENT")})})),!C)throw new Error("课表中没有已安排时间的课程，无法生成 ICS");return A.push("END:VCALENDAR"),A.map(Bl).join(`\r
`)+`\r
`}function tp(n){let o=Kn(n),l=0,c=0;return n.courses.forEach(d=>d.arrangements.forEach(w=>{w.weeks.length||(l+=1),(!o.has(w.startSection)||!o.has(w.endSection))&&(c+=1)})),{missingWeeks:l,missingTimes:c}}function jl(n){let o=String(n||"").replace(/[—–]/g,"-"),l=/单周|单数周|[（(]单[）)]/.test(o)?1:/双周|双数周|[（(]双[）)]/.test(o)?0:-1,c=new Set,d=w=>{let C=Number(w);C>=1&&C<=30&&(l<0||C%2===l)&&c.add(C)};return o.replace(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/g,(w,C,A)=>{let x=Math.min(Number(C),Number(A)),k=Math.max(Number(C),Number(A));for(let h=x;h<=k;h+=1)d(h);return w}),(o.match(/\d{1,2}/g)||[]).forEach(d),Array.from(c).sort((w,C)=>w-C)}function rp(n,o){let l=String(n||"").trim();if(/^[01]+$/.test(l)){let c=[];for(let d=0;d<l.length;d+=1)l.charAt(d)==="1"&&c.push(d+1);return c}return jl(o||l)}function Ol(n){let o=n&&Array.isArray(n.xkxx)?n.xkxx:[];for(let l of o){let c=Object.values(l||{});if(c.length)return c[0]}return null}function Xr(n){let o=Ol(n);if(!o)return"";let l=Array.isArray(o.timeAndPlaceList)?o.timeAndPlaceList[0]:null;return String(o.zxjxjhh||o.executiveEducationPlanNumber||o.id&&(o.id.zxjxjhh||o.id.executiveEducationPlanNumber)||l&&(l.zxjxjhh||l.executiveEducationPlanNumber)||"").trim()}function Hl(n){let o=String(n||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!o)return"学生课表";let l=o[3]==="1"?"秋季学期":o[3]==="2"?"春季学期":"学期";return o[1]+"-"+o[2]+"学年"+l}function ep(n,o,l,c={}){let d=o||Xr(n),w=(Array.isArray(n&&n.jcsjbs)?n.jcsjbs:[]).map(x=>({section:Number(x.jc)||0,start:he(x.kssj),end:he(x.jssj)})).filter(x=>x.section>=1&&x.section<=20&&x.start&&x.end).sort((x,k)=>x.section-k.section),C=[];(Array.isArray(n&&n.xkxx)?n.xkxx:[]).forEach(x=>{Object.keys(x||{}).forEach(k=>{let h=x[k];if(!h)return;let v=h.id||{},q=(h.timeAndPlaceList||[]).map(E=>({day:Number(E.classDay)||0,startSection:Number(E.classSessions)||1,endSection:Math.min(12,(Number(E.classSessions)||1)+Math.max(1,Number(E.continuingSession)||1)-1),weeks:rp(E.classWeek,E.weekDescription||h.skzcs),weekDescription:String(E.weekDescription||h.skzcs||"").trim(),campus:String(E.campusName||"").trim(),building:String(E.teachingBuildingName||"").trim(),classroom:String(E.classroomName||"").trim()})).filter(E=>E.day>=1&&E.day<=7&&E.startSection>=1&&E.startSection<=12);C.push({code:String(v.coureNumber||h.zkch||"").trim(),sequence:String(v.coureSequenceNumber||h.zkxh||"").trim(),name:String(h.courseName||h.englishCourseName||k).trim(),englishName:String(h.englishCourseName||"").trim(),teacher:String(h.attendClassTeacher||"").trim(),attribute:String(h.coursePropertiesName||"").trim(),category:String(h.courseCategoryName||"").trim(),credit:Number(h.unit)||0,status:String(h.selectCourseStatusName||"").trim(),arrangements:q})})});let A=String(c.firstMonday||"").trim();return{schemaVersion:1,exportedAt:(c.now instanceof Date?c.now:new Date).toISOString(),source:l||"SCU URP++",semester:{planCode:d,label:Hl(d),firstMonday:Qr(A)?A:""},sections:w,courses:C}}function ap(n,o,l,c=0){let d=Math.max(0,Number(n)||0),w=Math.max(1,Math.floor(Number(o)||1)),C=Math.max(0,Math.min(w-1,Math.floor(Number(l)||0))),A=-Math.max(0,Number(c)||0),x=A+d*C/w,k=A+d*(C+1)/w;return{left:x,width:Math.max(0,k-x)}}function Ve(n,o,l){let c=[],d=String(n||""),w=Math.max(4,Number(o)||4);for(;d;)c.push({text:d.slice(0,w),kind:l}),d=d.slice(w);return c}function Ye(n,o){let l=n.slice(0,Math.max(0,o)).map(c=>({...c}));if(l.length&&l.length<n.length){let c=l[l.length-1];c.text=c.text.length>1?c.text.slice(0,-1)+"…":"…"}return l}var op=["#2563EB","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#DB2777","#4D7C0F","#EA580C","#4F46E5"];function pp(n){let o=0,l=String(n||"");for(let c=0;c<l.length;c+=1)o=o*31+l.charCodeAt(c)>>>0;return op[o%op.length]}function np(n){let o=[];n.forEach(l=>{let c=o.findIndex(d=>d<l.startSection);c<0&&(c=o.length,o.push(0)),o[c]=l.endSection,l.lane=c}),n.forEach(l=>{l.laneCount=Math.max(1,o.length)})}function ip(n){let o=n.slice().sort((d,w)=>d.startSection-w.startSection||d.endSection-w.endSection||d.course.name.localeCompare(w.course.name)),l=[],c=0;return o.forEach(d=>{l.length&&d.startSection>c&&(np(l),l=[],c=0),l.push(d),c=Math.max(c,d.endSection)}),l.length&&np(l),o}function sp(n){let o=[];return n.courses.forEach(l=>l.arrangements.forEach(c=>{o.push({course:l,arrangement:c,startSection:c.startSection,endSection:c.endSection,day:c.day})})),o}function lp(n,o){let l=[],c=String(n||"");for(;c;)l.push(c.slice(0,o)),c=c.slice(o);return l}function cp(n,o,l){let c=n.startSection===n.endSection?n.startSection+"节":n.startSection+"-"+n.endSection+"节",d=Ve(n.name,Math.max(5,o),"title"),w=Ve(n.teacher,Math.max(6,o+2),"teacher"),C=Ve([n.weekDescription,c].filter(Boolean).join(" · "),Math.max(6,o+2),"schedule"),A=Ve([n.campus,n.building,n.classroom].filter(Boolean).join(" "),Math.max(6,o+2),"location"),x=Math.max(1,Number(l)||1),k=A.length&&x>=2?Math.min(2,A.length):0,h=C.length&&x>=3?1:0,v=w.length&&x>=4?1:0,q=Math.max(1,x-k-h-v),E=Ye(d,q),m=x-E.length,u=Math.min(w.length,Math.max(0,m-h-k));E.push(...Ye(w,u)),m=x-E.length;let y=Math.min(C.length,Math.max(0,m-k));return E.push(...Ye(C,y)),m=x-E.length,E.push(...Ye(A,m)),E.slice(0,x)}function Rl(n,o){let l=pp(o),c=n.colors,d=n.skin;return d==="brutal"?{fill:It(c.surface,l,.48),stroke:"#000000",text:"#111111",secondary:"#242424",stripe:l}:d==="flat"?{fill:It(c.surface,l,n.dark?.24:.16),stroke:c.text,text:c.text,secondary:c.secondary,stripe:l}:d==="editorial"?{fill:It(c.surface,l,n.dark?.16:.08),stroke:c.border,text:c.text,secondary:c.secondary,stripe:l}:{fill:It(c.surface,l,n.dark?.28:d==="organic"?.2:.14),stroke:It(c.border,l,n.dark?.52:.42),text:c.text,secondary:c.secondary,stripe:l}}function dp(n,o,l={}){if(!o||!o.colors||!o.shape)throw new Error("课表图片主题未解析");let c=o.colors,d=o.shape,w=l.now instanceof Date?l.now:new Date,C=1960,A=40,x=136,k=C-A*2,h=A+24,v=64,q=8,E=h+v+12,m=A+k-24,u=(m-E-q*6)/7,y=x+88,f=108,S=102,$=y+f*12-x+24,z=n.courses.filter(et=>!et.arrangements.length).map(et=>et.name),j=lp(z.join("、"),92),T=j.length?74+j.length*27:44,O=x+$+T,W=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],R=d.serif?"Georgia,Noto Serif SC,Songti SC,STSong,SimSun,serif":"Microsoft YaHei,Segoe UI,sans-serif",tt="Microsoft YaHei,Segoe UI,sans-serif",nt=["soft","warm","neu"].includes(d.shadow)?' filter="url(#schedule-frame-shadow)"':"",ut=["soft","warm","neu"].includes(d.shadow)?' filter="url(#schedule-card-shadow)"':"",J=[`<svg xmlns="http://www.w3.org/2000/svg" width="${C}" height="${O}" viewBox="0 0 ${C} ${O}">`,"<defs>",`<filter id="schedule-frame-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${o.dark?10:7}" stdDeviation="${o.dark?16:11}" flood-color="${o.dark?"#000000":c.text}" flood-opacity="${o.dark?.48:.1}"/></filter>`,`<filter id="schedule-card-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${o.dark?"#000000":c.text}" flood-opacity="${o.dark?.34:.1}"/></filter>`,"</defs>",`<rect width="100%" height="100%" fill="${c.bg}"/>`,`<rect x="${A}" y="32" width="142" height="36" rx="${d.headerRadius}" fill="${c.primary}"/>`,`<text x="${A+71}" y="56" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="700" font-family="${tt}">SCU URP++</text>`,`<text x="${A}" y="106" fill="${c.text}" font-size="36" font-weight="700" font-family="${R}">${it(n.semester.label)}课表</text>`,`<text x="${C-A}" y="54" text-anchor="end" fill="${c.secondary}" font-size="16" font-family="${tt}">${it(o.label)}</text>`,`<text x="${C-A}" y="83" text-anchor="end" fill="${c.muted}" font-size="14" font-family="${tt}">${it(w.toLocaleString("zh-CN",{hour12:!1}))}</text>`];d.shadow==="hard"&&J.push(`<rect x="${A+8}" y="${x+8}" width="${k}" height="${$}" fill="#000000"/>`),J.push(`<rect x="${A}" y="${x}" width="${k}" height="${$}" rx="${d.frameRadius}" fill="${c.surface}" stroke="${d.shadow==="hard"?"#000000":c.border}" stroke-width="${d.frameStroke}"${nt}/>`),W.forEach((et,Q)=>{let lt=E+Q*(u+q);J.push(`<rect x="${lt}" y="${x+22}" width="${u}" height="48" rx="${d.headerRadius}" fill="${c.input}" stroke="${c.border}" stroke-width="${d.frameStroke?1:0}"/>`,`<text x="${lt+u/2}" y="${x+53}" text-anchor="middle" fill="${c.secondary}" font-size="17" font-weight="600" font-family="${tt}">${et}</text>`)});for(let et=1;et<=12;et+=1){let Q=y+(et-1)*f;J.push(`<rect x="${h}" y="${Q}" width="${v}" height="${S}" rx="${d.gridRadius}" fill="${c.input}" stroke="${c.border}" stroke-width="${d.frameStroke?1:0}"/>`,`<text x="${h+v/2}" y="${Q+S/2+6}" text-anchor="middle" fill="${c.muted}" font-size="16" font-weight="600" font-family="${tt}">${et}</text>`),W.forEach((lt,rt)=>{let pt=E+rt*(u+q);J.push(`<rect x="${pt}" y="${Q}" width="${u}" height="${S}" rx="${d.gridRadius}" fill="${c.input}" stroke="${c.border}" stroke-width="${d.frameStroke?1:0}"/>`)})}[4,9].forEach(et=>{let Q=y+et*f-3;J.push(`<line x1="${E}" y1="${Q}" x2="${m}" y2="${Q}" stroke="${c.primary}" stroke-opacity=".42" stroke-width="2" stroke-dasharray="10 9"/>`)});for(let et=1;et<=7;et+=1)ip(sp(n).filter(lt=>lt.day===et)).forEach((lt,rt)=>{let pt=u/lt.laneCount,gt=E+(et-1)*(u+q)+lt.lane*pt,K=y+(lt.startSection-1)*f,ct=pt,wt=Math.max(S,(lt.endSection-lt.startSection)*f+S),vt=Rl(o,lt.course.name),_t="course-clip-"+et+"-"+rt,I=Math.max(1,Math.floor((wt-18)/23)),V=cp({name:lt.course.name,teacher:lt.course.teacher,weekDescription:lt.arrangement.weekDescription,startSection:lt.startSection,endSection:lt.endSection,campus:lt.arrangement.campus,building:lt.arrangement.building,classroom:lt.arrangement.classroom},Math.floor((ct-22)/16),I);J.push(`<clipPath id="${_t}"><rect x="${gt+11}" y="${K+8}" width="${Math.max(10,ct-22)}" height="${Math.max(18,wt-16)}" rx="${Math.max(0,d.cardRadius-5)}"/></clipPath>`,`<rect data-course-card="1" data-day="${et}" data-start="${lt.startSection}" data-end="${lt.endSection}" x="${gt}" y="${K}" width="${ct}" height="${wt}" rx="${d.cardRadius}" fill="${vt.fill}" stroke="${vt.stroke}" stroke-width="${d.cardStroke}"${ut}/>`),o.skin==="brutal"&&J.push(`<path d="M ${gt+ct-4} ${K+4} V ${K+wt-4} H ${gt+4}" fill="none" stroke="#000000" stroke-opacity=".28" stroke-width="5"/>`),o.skin==="editorial"&&J.push(`<rect x="${gt}" y="${K}" width="6" height="${wt}" fill="${vt.stripe}"/>`),o.skin==="neu"&&J.push(`<path d="M ${gt+d.cardRadius} ${K+1} H ${gt+ct-d.cardRadius}" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2"/>`),J.push('<g clip-path="url(#'+_t+')">'),V.forEach((Z,bt)=>{let mt=Z.kind==="title";J.push(`<text data-kind="${Z.kind}" x="${gt+14}" y="${K+28+bt*23}" fill="${mt?vt.text:vt.secondary}" font-size="${mt?16:13}" font-weight="${mt?700:500}" font-family="${mt&&d.serif?R:tt}">${it(Z.text)}</text>`)}),J.push("</g>")});let Y=x+$+30;return j.length?(J.push(`<text x="${A}" y="${Y}" fill="${c.secondary}" font-size="15" font-weight="700" font-family="${tt}">未排定时间的课程</text>`),j.forEach((et,Q)=>J.push(`<text x="${A}" y="${Y+29+Q*27}" fill="${c.muted}" font-size="14" font-family="${tt}">${it(et)}</text>`))):J.push(`<text x="${A}" y="${Y}" fill="${c.muted}" font-size="14" font-family="${tt}">由 SCU URP++ 基于结构化课表数据生成</text>`),J.push("</svg>"),{svg:J.join(""),width:C,height:O,background:c.bg,theme:o}}function Ul(n,o,l={}){let c=[],d=l.json||null,w=l.ics||null,C=n==="ics"?o.courses.filter(A=>!A.arrangements.length).length:0;return C&&c.push(C+" 门未排定时间的课程未写入日历"),d&&d.unscheduledCourses&&c.push(d.unscheduledCourses+" 门未排定时间的课程未写入 JSON"),d&&d.missingWeeks&&c.push(d.missingWeeks+" 个上课安排缺少周次"),d&&d.invalidArrangements&&c.push(d.invalidArrangements+" 个上课安排缺少日期或节次"),w&&w.missingWeeks&&c.push(w.missingWeeks+" 个上课安排缺少周次"),w&&w.missingTimes&&c.push(w.missingTimes+" 个上课安排缺少节次时间"),c}function Qe(n,o,l,c,d){return`<button type="button" class="urppp-export-option" role="menuitem" data-export-type="${n}"${d?" disabled":""}><i class="fa ${o}" aria-hidden="true"></i><span><strong>${l}</strong><small>${c}</small></span></button>`}function up(n){let{document:o,window:l,ensureStyles:c,loadData:d,exportJson:w,exportIcs:C,exportPng:A,showToast:x,nativePageUrl:k,navigate:h,logger:v=console}=n;function q(f){f&&(f.classList.remove("open"),f.querySelector(".urppp-export-trigger")?.setAttribute("aria-expanded","false"))}function E(){l.__urpppExportDismissBound||(l.__urpppExportDismissBound=!0,o.addEventListener("click",f=>{o.querySelectorAll(".urppp-export-wrap.open").forEach(S=>{S.contains(f.target)||q(S)})},!0),o.addEventListener("keydown",f=>{f.key==="Escape"&&o.querySelectorAll(".urppp-export-wrap.open").forEach(q)}))}async function m(f,S,L,$){if($&&$.disabled)return;let z=$&&$.innerHTML;try{if($&&($.disabled=!0,$.innerHTML='<i class="fa fa-spinner fa-spin"></i> 准备中'),f==="pdf"){if(typeof L!="function")throw new Error("当前页面不提供原生 PDF 导出");await L();return}let j=await d(S),T={};if(f==="json")T.json=await w(j);else if(f==="ics")T.ics=await C(j);else if(f==="png")await A(j);else throw new Error("未知导出格式");let O=Ul(f,j,T);x("课表已导出："+f.toUpperCase()+(O.length?"；"+O.join("，"):""))}catch(j){if(j&&j.message==="已取消导出")return;v.warn("[URP++] schedule export",j),x(j&&j.message||String(j),!0)}finally{$&&($.disabled=!1,$.innerHTML=z)}}function u(f={}){c();let S=f.source||"native",L=f.pdfHandler,$=typeof L=="function",z=o.createElement("span"),j=S==="native"?"导出课表":"导出";z.className="urppp-export-wrap",z.innerHTML=`<button type="button" class="urppp-export-trigger" aria-haspopup="menu" aria-expanded="false" title="导出课表"><i class="fa fa-cloud-download" aria-hidden="true"></i><span>${j}</span><i class="fa fa-angle-down" aria-hidden="true"></i></button><div class="urppp-export-menu" role="menu">${Qe("ics","fa-calendar","ICS 日历","导入系统日历或日历应用",!1)}${Qe("json","fa-code","JSON 数据","兼容小爱课程导入，可自定义格式",!1)}${Qe("png","fa-image","PNG 图片","完整学期课表高清图片",!1)}${Qe("pdf","fa-file-pdf-o","PDF",$?"使用教务系统原生导出":"仅原教务课表页面可用",!$)}${$?"":'<div class="urppp-export-guide">PDF 依赖原教务课表页面。<button type="button" data-export-native="1">前往本学期课表</button></div>'}</div>`;let T=z.querySelector(".urppp-export-trigger");T.addEventListener("click",W=>{W.preventDefault(),W.stopPropagation();let R=!z.classList.contains("open");o.querySelectorAll(".urppp-export-wrap.open").forEach(q),z.classList.toggle("open",R),T.setAttribute("aria-expanded",R?"true":"false")}),z.querySelectorAll("[data-export-type]:not(:disabled)").forEach(W=>{W.addEventListener("click",()=>{q(z),m(W.getAttribute("data-export-type"),S,L,T)})});let O=z.querySelector("[data-export-native]");return O&&O.addEventListener("click",()=>h(k)),E(),z}function y(f){(f&&f.querySelectorAll?f:o).querySelectorAll("[data-schedule-export-host]").forEach(L=>{L.querySelector(".urppp-export-wrap")||L.appendChild(u({source:L.getAttribute("data-schedule-export-host")||"clean"}))})}return{bindHosts:y,closeMenu:q,createMenu:u,run:m}}function mp(n){let o=l=>{n.querySelectorAll(".urppp-set-tab").forEach(c=>{let d=c.dataset.tab===l;c.classList.toggle("ac",d),c.setAttribute("aria-selected",d?"true":"false")}),n.querySelectorAll(".urppp-set-pane").forEach(c=>{c.classList.toggle("ac",c.dataset.pane===l)});try{let c=n.querySelector(".urppp-set-body");c&&(c.scrollTop=0)}catch{}};return n.querySelectorAll(".urppp-set-tab").forEach(l=>{l.addEventListener("click",()=>o(l.dataset.tab))}),n.__urpppSwitchTab=o,o}function bp(n){let{document:o,ensurePanel:l,syncPanel:c,refreshUpdateStatus:d,defaultTab:w="theme"}=n;function C(){l();let x=o.getElementById("urppp-settings-panel"),k=o.getElementById("urppp-settings-mask");if(!x||!k)return!1;c();try{d()}catch{}try{x.__urpppSwitchTab&&x.__urpppSwitchTab(w)}catch{}k.classList.remove("open"),x.classList.remove("open"),x.offsetWidth,k.classList.add("open"),x.classList.add("open");try{let h=x.querySelector(".urppp-set-body");h&&(h.scrollTop=0)}catch{}return!0}function A(){let x=o.getElementById("urppp-settings-panel"),k=o.getElementById("urppp-settings-mask");x&&x.classList.remove("open"),k&&k.classList.remove("open")}return{close:A,open:C}}function hp(n){let{logoData:o,repositoryUrl:l,version:c}=n;return['<div class="urppp-set-head">','  <div class="urppp-set-title">设置</div>','  <button type="button" class="urppp-set-close" id="urppp-set-close" aria-label="关闭">×</button>',"</div>",'<div class="urppp-set-tabs" role="tablist">','  <button type="button" class="urppp-set-tab ac" data-tab="theme" role="tab" aria-selected="true">主题设置</button>','  <button type="button" class="urppp-set-tab" data-tab="skin" role="tab" aria-selected="false">主题选择</button>','  <button type="button" class="urppp-set-tab" data-tab="system" role="tab" aria-selected="false">系统设置</button>','  <button type="button" class="urppp-set-tab" data-tab="about" role="tab" aria-selected="false">关于</button>',"</div>",'<div class="urppp-set-body">','  <div class="urppp-set-pane ac" data-pane="theme">','    <section class="urppp-set-sec">',"      <h3>主题模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-modes">','        <button type="button" class="urppp-set-mode" data-theme="default">简约白</button>','        <button type="button" class="urppp-set-mode" data-theme="dark">深邃暗</button>','        <button type="button" class="urppp-set-mode" data-theme="scu-red">动态配色</button>',"      </div>",'      <div class="urppp-set-follow-row">','        <button type="button" class="urppp-set-follow" id="urppp-set-follow" aria-pressed="false">跟随系统：关</button>','        <button type="button" class="urppp-set-follow" id="urppp-set-follow-dynamic" aria-pressed="false">浅色用动态配色：关</button>',"      </div>",'      <button type="button" class="urppp-set-follow" id="urppp-set-clean-default" aria-pressed="false" style="margin-top:12px;width:100%">默认进入清爽模式：关</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-clean-analysis" aria-pressed="false" style="margin-top:12px;width:100%">清爽成绩分析展示：选项卡</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-apple-edge" aria-pressed="true" style="margin-top:12px;width:100%">类Apple边缘线条：开</button>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-dynamic">',"      <h3>种子色</h3>",'      <p class="urppp-set-tip">选一个颜色，自动生成背景、卡片、强调色等多套方案</p>','      <div class="urppp-set-presets" id="urppp-set-presets"></div>','      <div class="urppp-set-custom">','        <input type="color" id="urppp-set-color" value="#B53434" />','        <input type="text" id="urppp-set-hex" maxlength="7" value="#B53434" spellcheck="false" />','        <button type="button" class="urppp-set-btn" id="urppp-set-gen">生成方案</button>','        <button type="button" class="urppp-set-btn ghost" id="urppp-set-save">存为预设</button>',"      </div>",'      <h3 style="margin-top:16px">配色方案</h3>','      <div class="urppp-set-schemes" id="urppp-set-schemes"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-brutal" style="display:none">',"      <h3>高对比配色</h3>",'      <p class="urppp-set-tip">默认圆点使用高能粉；选择一种备用配色后，可由左上第三个圆点快速切换。</p>','      <div class="urppp-set-schemes" id="urppp-set-brutal-palettes"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="skin">','    <section class="urppp-set-sec">',"      <h3>界面风格</h3>",'      <p class="urppp-set-tip">在同一布局上切换视觉气质。因适配规模较大，仅保证清爽模式的完整适配，如有影响请使用默认类Apple风格并选择性开启边缘线条。</p>','      <div class="urppp-theme-store-bar"><button type="button" class="urppp-set-btn ghost" id="urppp-theme-store">主题商店</button></div>','      <div id="urppp-theme-store-inline" class="urppp-store-inline" style="display:none"></div>','      <div class="urppp-skin-list" id="urppp-skin-list"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="system">','    <section class="urppp-set-sec" id="urppp-set-privacy">',"      <h3>隐私模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-privacy-modes">','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="off">关闭</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="one">一键隐私</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="custom">自定义</button>',"      </div>",'      <div class="urppp-privacy-groups" id="urppp-set-privacy-custom">','        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">身份信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-identity" type="checkbox" data-privacy-field="identity" aria-label="隐藏学号和证件"><label for="urppp-privacy-identity">学号/证件</label><input class="urppp-feature-input" data-privacy-value="identity" maxlength="40" aria-label="学号和证件替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-organization" type="checkbox" data-privacy-field="organization" aria-label="隐藏学院和专业"><label for="urppp-privacy-organization">学院/专业</label><input class="urppp-feature-input" data-privacy-value="organization" maxlength="40" aria-label="学院和专业替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-contact" type="checkbox" data-privacy-field="contact" aria-label="隐藏联系和个人信息"><label for="urppp-privacy-contact">联系/个人信息</label><input class="urppp-feature-input" data-privacy-value="contact" maxlength="40" aria-label="联系和个人信息替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">学业信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-grade" type="checkbox" data-privacy-field="grade" aria-label="隐藏成绩"><label for="urppp-privacy-grade">成绩</label><input class="urppp-feature-input" data-privacy-value="grade" maxlength="40" aria-label="成绩替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-gpa" type="checkbox" data-privacy-field="gpa" aria-label="隐藏绩点"><label for="urppp-privacy-gpa">绩点</label><input class="urppp-feature-input" data-privacy-value="gpa" maxlength="40" aria-label="绩点替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-credit" type="checkbox" data-privacy-field="credit" aria-label="隐藏学分"><label for="urppp-privacy-credit">学分</label><input class="urppp-feature-input" data-privacy-value="credit" maxlength="40" aria-label="学分替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">页面内容</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-other" type="checkbox" data-privacy-field="other" aria-label="隐藏其他数据"><label for="urppp-privacy-other">其他数据</label><input class="urppp-feature-input" data-privacy-value="other" maxlength="40" aria-label="其他数据替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-schedule" type="checkbox" data-privacy-field="schedule" aria-label="隐藏课表"><label for="urppp-privacy-schedule">课表</label><input class="urppp-feature-input" data-privacy-value="schedule" maxlength="40" aria-label="课表替换内容"></div>','            <div class="urppp-privacy-field urppp-privacy-field-static"><input id="urppp-privacy-avatar" type="checkbox" data-privacy-field="avatar" aria-label="隐藏头像"><label for="urppp-privacy-avatar">头像</label><span class="urppp-privacy-note">使用统一遮罩</span></div>',"          </div>","        </div>","      </div>",'      <div class="urppp-direct-edit-control">',"        <div><strong>自由修改显示数据</strong><span>开启后，直接点击首页或清爽模式中带标记的数据进行修改</span></div>",'        <button type="button" class="urppp-set-follow" id="urppp-set-direct-edit-toggle" aria-pressed="false">页面内修改：关</button>',"      </div>","    </section>",'    <section class="urppp-set-sec" id="urppp-set-identity">',"      <h3>自定义姓名与头像</h3>",'      <div class="urppp-identity-editor">','        <div class="urppp-identity-fields">','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-name-enabled"> 自定义姓名</label><input class="urppp-feature-input" id="urppp-set-custom-name" maxlength="40" placeholder="输入显示姓名"></div>','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-avatar-enabled"> 自定义头像</label><input class="urppp-feature-input" id="urppp-set-custom-avatar-url" placeholder="https://... 图片地址"></div>','          <div class="urppp-feature-row"><label for="urppp-set-custom-avatar-file">本地图片</label><input class="urppp-feature-input" type="file" id="urppp-set-custom-avatar-file" accept="image/png,image/jpeg,image/webp,image/gif"></div>',"        </div>",'        <div class="urppp-identity-preview">','          <span class="urppp-identity-preview-label">头像预览</span>','          <div class="urppp-avatar-preview-shell"><span>未设置</span><img class="urppp-avatar-preview" id="urppp-set-avatar-preview" alt="自定义头像预览"></div>',"        </div>","      </div>",'      <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-privacy-save">保存隐私与显示设置</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-avatar-clear">清除自定义头像</button></div>','      <div class="urppp-set-tip" id="urppp-set-privacy-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-json-export">',"      <h3>JSON 导出格式</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-json-custom" aria-pressed="false" style="width:100%">自定义 JSON：关</button>','      <div class="urppp-json-mapping-editor" id="urppp-set-json-editor">','        <label for="urppp-set-json-mapping">字段映射</label>','        <textarea id="urppp-set-json-mapping" spellcheck="false" aria-label="自定义 JSON 字段映射"></textarea>','        <p class="urppp-set-tip">源字段包括 name、teacher、position、day、sections、weeks、code、credit、campus、building、classroom、weekList 等；目标值支持 data.courses 形式的嵌套路径。</p>','        <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-json-save">保存映射</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-json-reset">恢复默认映射</button></div>',"      </div>",'      <div class="urppp-set-tip" id="urppp-set-json-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-update">',"      <h3>更新</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-auto-update" aria-pressed="false" style="width:100%">自动检测更新：关</button>','      <button type="button" class="urppp-set-btn" id="urppp-set-check-update" style="margin-top:12px;width:100%">检查更新</button>','      <div id="urppp-set-update-status" class="urppp-set-tip" style="margin-top:8px"></div>',"    </section>",'    <div id="urppp-set-assist-slot"></div>',"  </div>",'  <div class="urppp-set-pane" data-pane="about">','    <div class="urppp-about">','      <img class="urppp-about-logo" id="urppp-about-logo" src="'+o+'" alt="SCU URP++" referrerpolicy="no-referrer" />','      <a class="urppp-about-ver" id="urppp-about-ver" href="'+l+'" target="_blank" rel="noopener noreferrer">SCU URP++ v'+c+"</a>",'      <p class="urppp-about-author">作者：Chao_Lan · Hanako</p>','      <p class="urppp-about-contact">QQ：2718748334</p>',`      <p class="urppp-about-msg">有任何问题欢迎及时反馈！
半夜Vibe有点爽怎么回事。</p>`,"    </div>","  </div>","</div>"].join("")}var Kt="urppp_plugin_",Wl="1.0.0";function Xa({GM:n,doc:o,hostInfo:l,uiDeps:c}){let{getValue:d=()=>null,setValue:w=()=>{},xmlHttp:C,addStyle:A}=n||{},x=(typeof c=="function"?c:c&&c.openSubpanel)||null,k=new Map,h=new Map,v=new Map,q=[],E=null;function m(I,V){let Z=v.get(I);Z&&Z.forEach(bt=>{try{bt(V)}catch{}})}function u(I,V){return v.has(I)||v.set(I,new Set),v.get(I).add(V),()=>v.get(I).delete(V)}function y(I,V){return d(`${Kt}${I}_${V}`)}function f(I,V,Z){w(`${Kt}${I}_${V}`,Z)}function S(){return I=>({get:V=>y(I,V),set:(V,Z)=>f(I,V,Z),remove:V=>w(`${Kt}${I}_${V}`,void 0)})}function L(I,V={}){return new Promise((Z,bt)=>{if(typeof C!="function"){bt(new Error("GM_xmlhttpRequest 不可用（未授权跨域？）"));return}C({method:V.method||"GET",url:I,headers:V.headers||{},data:V.data,timeout:V.timeout||8e3,onload:mt=>mt.status>=200&&mt.status<300?Z(mt.responseText):bt(new Error(`HTTP ${mt.status}`)),onerror:()=>bt(new Error("网络错误")),ontimeout:()=>bt(new Error("超时(8s)"))})})}async function $(I,V){let Z=Array.isArray(I)?I:[I],bt=[];for(let mt=0;mt<Z.length;mt+=1){let Ct=Z[mt];V&&V({stage:"downloading",index:mt+1,total:Z.length,url:Ct});try{let xt=await L(Ct);return V&&V({stage:"downloaded",url:Ct,size:xt.length}),xt}catch(xt){bt.push(`源${mt+1}(${z(Ct)})失败: ${xt&&xt.message?xt.message:xt}`),V&&V({stage:"source_failed",index:mt+1,total:Z.length,error:xt&&xt.message?xt.message:xt})}}throw new Error("所有下载源失败 → "+bt.join(" ｜ "))}function z(I){try{return new URL(I).host}catch{return I}}function j(I){let V=String(I||"").match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);return V?I.replace(V[0],""):I}function T(I,V){try{let Z=j(I),bt=["GM_getValue","GM_setValue","GM_xmlhttpRequest","GM_registerMenuCommand","GM_addStyle","unsafeWindow"],mt=[typeof GM_getValue=="function"?GM_getValue:void 0,typeof GM_setValue=="function"?GM_setValue:void 0,typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:void 0,typeof GM_registerMenuCommand=="function"?GM_registerMenuCommand:void 0,typeof GM_addStyle=="function"?GM_addStyle:void 0,typeof unsafeWindow<"u"?unsafeWindow:null];return new Function(...bt,Z)(...mt),!0}catch(Z){return console.warn("[URP++ plugin] 注入失败",V,Z),!1}}function O(I,V){let Z=h.get(I);return Z?(Z.enabled=!!V,w(`${Kt}${I}_enabled`,Z.enabled),m(V?"enabled":"disabled",I),!0):!1}function W(I){let V=h.get(I);return!!V&&V.enabled}function R(I){if(!I||!I.id)return!1;if(k.has(I.id)&&k.get(I.id).__urpppRegistered)return!0;let V=Object.assign({type:"plugin"},I);V.__urpppRegistered=!0,k.set(I.id,V);let Z=h.get(I.id)||{loaded:!1,enabled:!1,version:I.version||""};return Z.version=V.version||Z.version,h.set(I.id,Z),m("registered",V.id),!0}function tt(I){return k.get(I)||null}function nt(I){let V=[];for(let Z of k.values())(!I||Z.type===I)&&V.push(Z);return V}function ut(I){let V=h.get(I);return!!V&&V.loaded}async function J(I,V,Z){Z&&Z({stage:"start",id:I});let bt=Array.isArray(V)?V:V?[V]:rt(I),mt=await $(bt,Z);w(`${Kt}${I}_code`,mt),Z&&Z({stage:"injecting",id:I});let Ct=T(mt,I),xt=h.get(I)||{loaded:!1,enabled:!1,version:""};return xt.loaded=Ct,xt.enabled=Ct,xt.code=mt,xt.version=xt.version||Y(mt),h.set(I,xt),w(`${Kt}${I}_enabled`,Ct),m("loaded",I),Ct}function Y(I){let V=String(I||"").match(/@version\s+(\S+)/);return V?V[1]:""}async function et(I,V,Z){let bt=Array.isArray(V)?V:V?[V]:rt(I),mt=await $(bt,Z);w(`${Kt}${I}_code`,mt);let Ct=Y(mt),xt=h.get(I)||{loaded:!1,enabled:!1,version:""};return xt.version=Ct||xt.version,xt.code=mt,h.set(I,xt),m("updated",I),{ok:!0,version:Ct||xt.version}}function Q(I){let V=d(`${Kt}${I}_code`);if(!V)return!1;let Z=h.get(I);if(Z&&Z.loaded)return!0;let bt=T(V,I),mt=h.get(I)||{loaded:!1,enabled:!1,version:Y(V)};return mt.loaded=bt,mt.enabled=bt&&d(`${Kt}${I}_enabled`)!==!1,mt.code=V,h.set(I,mt),m("loaded",I),bt}function lt(I){let V=k.get(I);return k.delete(I),h.delete(I),w(`${Kt}${I}_enabled`,!1),m("unregistered",I),!!V}function rt(I){return I==="assist"?["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/plugins/urpppp.plugin.js","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js"]:[]}let pt={protocolVersion:Wl,register:R,unregister:lt,get:tt,list:nt,loaded:ut,isEnabled:W,enable:(I,V=!0)=>O(I,V),disable:I=>O(I,!1),install:J,update:et,bootFromCache:Q,storage:()=>d&&{get:I=>d(I),set:(I,V)=>w(I,V)},pluginStorage:I=>S()(I),request:L,addStyle:I=>{try{A&&A(I)}catch{}},log:(...I)=>{console.log("[URP++ plugin]",...I)},on:u,emit:m,hostInfo:Object.assign({name:"SCU URP++"},l||{}),getSubpanel:()=>x};try{window.__urpppPlugin=pt}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppPlugin=pt)}catch{}function gt(I){if(!I||!o||I.querySelector(".urppp-plugin-sec, .urpppp-entry-sec"))return;let V=o.createElement("section");V.className="urppp-set-sec urppp-plugin-sec",V.id="urppp-plugin-sec",V.innerHTML=`
      <h3>辅助插件</h3>
      <div class="urppp-plugin-status" id="urppp-plugin-status">检查中…</div>
      <div class="urppp-plugin-actions">
        <button type="button" class="urppp-set-btn" id="urppp-plugin-install">装载辅助插件</button>
        <button type="button" class="urppp-set-btn ghost" id="urppp-plugin-store">插件商店</button>
      </div>
      <div id="urppp-plugin-panels" style="margin-top:10px"></div>
      <div id="urppp-store-inline" class="urppp-store-inline" style="display:none"></div>
      <p class="urppp-set-tip" id="urppp-plugin-tip" style="margin-top:8px"></p>
    `,I.appendChild(V);let Z=V.querySelector("#urppp-plugin-status"),bt=V.querySelector("#urppp-plugin-install"),mt=V.querySelector("#urppp-plugin-store"),Ct=V.querySelector("#urppp-plugin-panels"),xt=V.querySelector("#urppp-plugin-tip");function Nt(){let Et=h.get("assist"),Mt=k.has("assist");Et&&Et.loaded||Mt?(Z.textContent=`辅助插件 v${Et&&Et.version?Et.version:tt("assist")&&tt("assist").version||""} 已装载`,Z.className="urppp-plugin-status ok",bt.textContent="重新装载",bt.dataset.state="loaded",xt.textContent="已装载。下方为扩展入口。"):(Z.textContent=E||"未装载",Z.className=E?"urppp-plugin-status err":"urppp-plugin-status",bt.textContent="装载辅助插件",bt.dataset.state="notloaded",xt.textContent=E?"装载失败，可就近重试或放回本地安装。下方为装载/商店入口。":"点击装载后，主插件会下载并注入辅助插件（登录助手/评教/会话保持/2FA），无需再单独安装。"),Ct.innerHTML="";let Qt=_t();if(Qt&&Object.keys(Qt).length){let Pr=o.createElement("div");Pr.className="urppp-plugin-sub",Object.keys(Qt).forEach(dr=>{let Vt=o.createElement("button");Vt.type="button",Vt.className="urppp-set-btn ghost",Vt.textContent=Qt[dr].label||dr,Vt.addEventListener("click",()=>{try{Qt[dr]&&typeof Qt[dr].open=="function"?Qt[dr].open():x&&x(dr)}catch{}}),Pr.appendChild(Vt)}),Ct.appendChild(Pr)}}bt.addEventListener("click",async()=>{bt.disabled=!0,bt.textContent="装载中…",Z.className="urppp-plugin-status",Z.textContent="正在开始装载…";try{if(await J("assist",null,Mt=>{try{Mt.stage==="downloading"?Z.textContent=`下载中… 源${Mt.index}/${Mt.total}（${z(Mt.url)}）`:Mt.stage==="downloaded"?Z.textContent=`已下载（${Mt.size} 字节），注入中…`:Mt.stage==="source_failed"?Z.textContent=`源${Mt.index}失败（${Mt.error||""}），切换下一源…`:Mt.stage==="injecting"?Z.textContent="注入中…":Mt.stage==="start"&&(Z.textContent="正在开始装载…"),console.log("[URP++ plugin] assist 装载进度",Mt)}catch{}}))E=null,Z.textContent="辅助插件已装载 v"+(tt("assist")&&tt("assist").version||""),console.log("[URP++ plugin] assist 装载成功");else throw new Error("注入失败")}catch(Et){E="装载失败："+(Et&&Et.message?Et.message:Et),Z.textContent=E,Z.className="urppp-plugin-status err",console.warn("[URP++ plugin] assist 装载失败",Et)}finally{bt.disabled=!1,Nt()}}),mt.addEventListener("click",()=>{x&&x("plugin-store")}),u("loaded",Et=>{Et==="assist"&&Nt()}),u("registered",Et=>{Et==="assist"&&Nt()}),u("unregistered",Et=>{Et==="assist"&&Nt()}),Nt()}function K(I){return String(I??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ct(I){if(I){if(wt(),I.dataset.rendered==="1"){I.style.display=I.style.display==="none"?"":"none";return}I.dataset.rendered="1",I.innerHTML=`
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
      </div>`,I.querySelectorAll(".urppp-store-tab").forEach(V=>{V.addEventListener("click",()=>{I.querySelectorAll(".urppp-store-tab").forEach(bt=>bt.className="urppp-store-tab"),V.className="urppp-store-tab ac",I.querySelectorAll(".urppp-store-pane").forEach(bt=>bt.style.display="none");let Z=I.querySelector('.urppp-store-pane[data-pane="'+V.dataset.tab+'"]');Z&&(Z.style.display="")})}),vt(I.querySelector("#urppp-store-manage-list")),I.style.display=""}}function wt(){if(o.getElementById("urppp-store-style"))return;let I=o.createElement("style");I.id="urppp-store-style",I.textContent=`
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
    `,(o.head||o.documentElement).appendChild(I)}function vt(I){if(!I)return;I.innerHTML="";let V=Array.from(k.values());if(!V.length){I.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}V.forEach(Z=>{let bt=h.get(Z.id)||{},mt=o.createElement("div");mt.className="urppp-store-item";let Ct=o.createElement("div");Ct.className="urppp-store-info",Ct.innerHTML="<strong>"+K(Z.name||Z.id)+'</strong><span class="urppp-store-ver">'+(Z.version?"v"+K(Z.version):"")+'</span><span class="urppp-store-state'+(bt.loaded?" ok":"")+'">'+(bt.loaded?"已装载":"未装载")+"</span>";let xt=o.createElement("div");xt.className="urppp-store-ops";let Nt=o.createElement("button");Nt.type="button",Nt.textContent="重新装载",Nt.addEventListener("click",async()=>{Nt.disabled=!0,Nt.textContent="装载中…";try{let Mt=await J(Z.id,null);Nt.textContent=Mt?"已装载":"装载失败",m("loaded",Z.id)}catch{Nt.textContent="装载失败"}setTimeout(()=>{Nt.disabled=!1,Nt.textContent="重新装载"},1400)});let Et=o.createElement("button");Et.type="button",Et.className="danger",Et.textContent="卸载",Et.addEventListener("click",()=>{lt(Z.id),w(`${Kt}${Z.id}_code`,""),w(`${Kt}${Z.id}_enabled`,!1),m("unregistered",Z.id),vt(I)}),xt.appendChild(Nt),xt.appendChild(Et),mt.appendChild(Ct),mt.appendChild(xt),I.appendChild(mt)})}function _t(){let I={};return k.forEach(V=>{if(V.subpanels&&typeof V.subpanels=="function"){let Z=V.subpanels();Object.keys(Z||{}).forEach(bt=>{I[bt]=Z[bt]})}else V.subpanels&&typeof V.subpanels=="object"&&Object.keys(V.subpanels).forEach(Z=>{I[Z]=V.subpanels[Z]})}),I}return{api:pt,install:J,update:et,renderAssistUi:gt,openPluginStore:ct,bootFromCache:Q,register:R}}function gp(n){let{document:o,getSettings:l,setSettings:c,validateMapping:d,defaultMapping:w,getRecoveryMessage:C=()=>""}=n;function A(h,v,q){let E=h&&h.querySelector("#urppp-set-json-status");E&&(E.textContent=v||"",E.classList.toggle("urppp-status-error",!!q),E.style.color=q?"var(--danger,#b91c1c)":"var(--text-muted)")}function x(h,v){if(!h)return;let q=l(),E=h.querySelector("#urppp-set-json-custom"),m=h.querySelector("#urppp-set-json-editor"),u=h.querySelector("#urppp-set-json-mapping");E&&(E.classList.toggle("ac",q.enabled),E.setAttribute("aria-pressed",q.enabled?"true":"false"),E.textContent="自定义 JSON："+(q.enabled?"开":"关")),m&&(m.style.display=q.enabled?"grid":"none"),u&&(v||!h.__urpppJsonMappingDirty&&o.activeElement!==u)&&(u.value=JSON.stringify(q.mapping,null,2),h.__urpppJsonMappingDirty=!1);let y=C();y&&A(h,y,!0)}function k(h){if(!h||h.__urpppJsonSettingsBound)return;h.__urpppJsonSettingsBound=!0;let v=h.querySelector("#urppp-set-json-custom"),q=h.querySelector("#urppp-set-json-mapping"),E=h.querySelector("#urppp-set-json-save"),m=h.querySelector("#urppp-set-json-reset");q&&q.addEventListener("input",()=>{h.__urpppJsonMappingDirty=!0}),v&&v.addEventListener("click",()=>{let u=l();u.enabled=!u.enabled;let y=!!h.__urpppJsonMappingDirty;c(u),x(h,!1);let f=u.enabled?"已启用自定义 JSON 格式":"已恢复小爱课程兼容格式";A(h,y?f+"；未保存草稿已保留":f)}),E&&E.addEventListener("click",()=>{try{let u=JSON.parse(String(q&&q.value||"").trim()),y=l();y.mapping=d(u),c(y),h.__urpppJsonMappingDirty=!1,x(h,!0),A(h,"自定义 JSON 映射已保存")}catch(u){A(h,u&&u.message||String(u),!0)}}),m&&m.addEventListener("click",()=>{let u=l();u.mapping=d(w),c(u),h.__urpppJsonMappingDirty=!1,x(h,!0),A(h,"已恢复默认字段映射")})}return{bind:k,setStatus:A,sync:x}}var xe="••••";var fp={name:{enabled:!1,replacement:"同学"},identity:{enabled:!0,replacement:"已隐藏"},organization:{enabled:!0,replacement:"已隐藏"},contact:{enabled:!0,replacement:"已隐藏"},grade:{enabled:!0,replacement:"已隐藏"},gpa:{enabled:!0,replacement:"••••"},credit:{enabled:!0,replacement:"••••"},other:{enabled:!0,replacement:"已隐藏"},avatar:{enabled:!0,replacement:""},schedule:{enabled:!1,replacement:"课表已隐藏"}},Gl=["completedCourses","failedCourses","majorGpa","majorPlan","remainingCourses","passingTotalCredit","passingAvgScore","passingAvgGpa","passingRequiredCredit","passingRequiredAvg","passingRequiredGpa","schemeTotalCredit","schemeAvgScore","schemeAvgGpa","schemeRequiredCredit","schemeRequiredAvg","schemeRequiredGpa"];function Ka(n){let o=n&&typeof n=="object"?n:{},l=["off","one","custom"].includes(o.mode)?o.mode:"off",c={},d=o.fields&&typeof o.fields=="object"?o.fields:{},w=d.score&&typeof d.score=="object"?d.score:null;Object.keys(fp).forEach(h=>{let v=fp[h],q=["grade","gpa","credit"].includes(h)?w:null,E=h==="other"&&d.grade&&typeof d.grade=="object"?d.grade:null,m=d[h]&&typeof d[h]=="object"?d[h]:q||E||{};c[h]={enabled:h==="name"?!1:m.enabled==null?v.enabled:!!m.enabled,replacement:String(m.replacement==null?v.replacement:m.replacement).slice(0,80)}});let C=o.homepage&&typeof o.homepage=="object"?o.homepage:{},A=o.directEdit&&typeof o.directEdit=="object"?o.directEdit:C,x=A.values&&typeof A.values=="object"?A.values:{},k={};return Gl.forEach(h=>{k[h]=String(x[h]==null?"":x[h]).trim().slice(0,80)}),{mode:l,mask:xe,fields:c,directEdit:{enabled:!!A.enabled,values:k}}}function ye(n){let o=n&&typeof n=="object"?n:{},l=String(o.avatar||"").trim();return{nameEnabled:!!o.nameEnabled,name:String(o.name||"").trim().slice(0,40),avatarEnabled:!!o.avatarEnabled,avatar:l.length<=3145728?l:"",avatarName:String(o.avatarName||"").trim().slice(0,120)}}function Kr(n){let o=String(n||"").trim();return o.length>3145728?"":/^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(o)?o:""}function Jl(n,o=globalThis.FileReader){return new Promise((l,c)=>{if(!n||!/^image\/(png|jpeg|webp|gif)$/i.test(n.type||"")){c(new Error("请选择 PNG、JPG、WebP 或 GIF 图片"));return}if(n.size>2*1024*1024){c(new Error("本地头像不能超过 2MB"));return}let d=new o;d.onload=()=>l(String(d.result||"")),d.onerror=()=>c(new Error("读取头像失败")),d.readAsDataURL(n)})}function xp(n){let{getPrivacySettings:o,setPrivacySettings:l,getCustomIdentity:c,setCustomIdentity:d,applyDisplay:w,refreshCleanDisplay:C,finishActiveDirectEdit:A,readAvatar:x=Jl}=n;function k(m,u){let y=u.mode==="custom",f=m.querySelector(".urppp-direct-edit-control"),S=m.querySelector("#urppp-set-direct-edit-toggle");f&&(f.style.display=y?"flex":"none"),S&&(S.dataset.enabled=u.directEdit.enabled?"1":"0",S.classList.toggle("ac",u.directEdit.enabled),S.setAttribute("aria-pressed",u.directEdit.enabled?"true":"false"),S.textContent="页面内修改："+(u.directEdit.enabled?"开":"关"))}function h(m){if(!m)return;let u=o();m.querySelectorAll("[data-privacy-mode]").forEach(T=>{let O=T.getAttribute("data-privacy-mode")===u.mode;T.classList.toggle("ac",O),T.setAttribute("aria-pressed",O?"true":"false")});let y=m.querySelector("#urppp-set-privacy-custom");y&&(y.style.display=u.mode==="custom"?"grid":"none"),Object.keys(u.fields).forEach(T=>{let O=u.fields[T],W=m.querySelector('[data-privacy-field="'+T+'"]'),R=m.querySelector('[data-privacy-value="'+T+'"]');W&&(W.checked=!!O.enabled),R&&(R.value=O.replacement||"",R.disabled=!O.enabled)}),k(m,u);let f=c(),S=m.querySelector("#urppp-set-name-enabled"),L=m.querySelector("#urppp-set-custom-name"),$=m.querySelector("#urppp-set-avatar-enabled"),z=m.querySelector("#urppp-set-custom-avatar-url"),j=m.querySelector("#urppp-set-avatar-preview");if(S&&(S.checked=f.nameEnabled),L&&(L.value=f.name,L.disabled=!f.nameEnabled),$&&($.checked=f.avatarEnabled),z&&(z.value=/^data:image\//i.test(f.avatar)?"":f.avatar,z.disabled=!f.avatarEnabled),m.__urpppAvatarSource=f.avatar,j){let T=Kr(f.avatar);j.style.display=T?"block":"none",T?j.src=T:j.removeAttribute("src")}}function v(m){let u=o();Object.keys(u.fields).forEach(f=>{let S=m.querySelector('[data-privacy-field="'+f+'"]'),L=m.querySelector('[data-privacy-value="'+f+'"]');S&&(u.fields[f].enabled=!!S.checked),L&&(u.fields[f].replacement=String(L.value||"").trim().slice(0,80))});let y=m.querySelector("#urppp-set-direct-edit-toggle");return u.directEdit.enabled=!!(y&&y.dataset.enabled==="1"),u}function q(m,u,y){let f=m&&m.querySelector("#urppp-set-privacy-status");f&&(f.textContent=u||"",f.style.color=y?"#b91c1c":"var(--text-muted)")}function E(m){if(!m||m.__urpppPrivacyBound)return;m.__urpppPrivacyBound=!0,m.querySelectorAll("[data-privacy-mode]").forEach(z=>{z.addEventListener("click",()=>{let j=o();j.mode=z.getAttribute("data-privacy-mode")||"off",l(j),h(m),w()})}),m.querySelectorAll("[data-privacy-field]").forEach(z=>{z.addEventListener("change",()=>{let j=z.getAttribute("data-privacy-field"),T=m.querySelector('[data-privacy-value="'+j+'"]');T&&(T.disabled=!z.checked)})});let u=m.querySelector("#urppp-set-direct-edit-toggle");u&&u.addEventListener("click",()=>{let z=u.dataset.enabled!=="1";u.dataset.enabled=z?"1":"0",u.classList.toggle("ac",z),u.setAttribute("aria-pressed",z?"true":"false"),u.textContent="页面内修改："+(z?"开":"关")});let y=m.querySelector("#urppp-set-name-enabled"),f=m.querySelector("#urppp-set-avatar-enabled");y&&y.addEventListener("change",()=>{let z=m.querySelector("#urppp-set-custom-name");z&&(z.disabled=!y.checked)}),f&&f.addEventListener("change",()=>{let z=m.querySelector("#urppp-set-custom-avatar-url");z&&(z.disabled=!f.checked)});let S=m.querySelector("#urppp-set-custom-avatar-file");S&&S.addEventListener("change",async()=>{try{let z=await x(S.files&&S.files[0]);m.__urpppAvatarSource=z;let j=m.querySelector("#urppp-set-avatar-preview");j&&(j.src=z,j.style.display="block"),f&&(f.checked=!0),q(m,"本地头像已读取，点击保存后生效")}catch(z){q(m,z&&z.message||String(z),!0)}});let L=m.querySelector("#urppp-set-avatar-clear");L&&L.addEventListener("click",()=>{try{let z=c();z.avatarEnabled=!1,z.avatar="",z.avatarName="",d(z),m.__urpppAvatarSource="",h(m),w(),C(),q(m,"已清除自定义头像")}catch(z){q(m,z&&z.message||"清除自定义头像失败",!0)}});let $=m.querySelector("#urppp-set-privacy-save");$&&$.addEventListener("click",()=>{let z=o(),j=c();try{let T=v(m),O=m.querySelector("#urppp-set-custom-avatar-url"),R=String(O&&O.value||"").trim()||m.__urpppAvatarSource||"",tt=ye({nameEnabled:!!(y&&y.checked),name:String(m.querySelector("#urppp-set-custom-name")?.value||"").trim(),avatarEnabled:!!(f&&f.checked),avatar:R,avatarName:j.avatarName});if(tt.avatarEnabled&&!Kr(tt.avatar))throw new Error("头像地址必须是 http(s) 图片或已选择的本地图片");z.directEdit.enabled&&!T.directEdit.enabled&&A(!0);try{d(tt),l(T)}catch(nt){try{d(j),l(z)}catch{}throw nt}w(),C(),h(m),q(m,"隐私与显示设置已保存")}catch(T){q(m,T&&T.message||String(T),!0)}})}return{bind:E,collect:v,setStatus:q,sync:h}}function yp(n){let{document:o,theme:l,preferences:c,accent:d,syncPanel:w}=n;function C(){l.getFollowSystem()?l.apply(l.resolveFollowTheme(),{system:!0}):l.apply("scu-red",{manual:!0})}function A(k,h){let v=k.querySelector("#urppp-set-schemes");if(!v)return;let q=d.getScheme();v.innerHTML="",d.listSchemePreviews(h).forEach(E=>{let m=o.createElement("button");m.type="button",m.className="urppp-set-scheme"+(E.id===q?" ac":""),m.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+E.bg+'"></span>','  <span style="background:'+E.surface+";border-color:"+E.border+'"></span>','  <span style="background:'+E.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+E.name+"</strong>","  <em>"+E.desc+"</em>","</div>"].join(""),m.addEventListener("click",()=>{d.setAccent(h),d.setScheme(E.id),C(),w()}),v.appendChild(m)})}function x(k){k.querySelectorAll(".urppp-set-mode").forEach(z=>{z.addEventListener("click",()=>{l.isModeAvailable(z.dataset.theme)&&(l.apply(z.dataset.theme,{manual:!0}),w())})});let h=k.querySelector("#urppp-set-follow");h&&h.addEventListener("click",()=>{if(!l.supportsDark())return;let z=!l.getFollowSystem();l.setFollowSystem(z),z?l.apply(l.resolveFollowTheme(),{system:!0}):l.apply(l.getCurrent(),{manual:!0}),w(),l.syncNavbar()});let v=k.querySelector("#urppp-set-follow-dynamic");v&&v.addEventListener("click",()=>{l.supportsDynamic()&&(l.getFollowSystem()?l.setFollowDynamic(!l.getFollowDynamic()):(l.setFollowSystem(!0),l.setFollowDynamic(!0)),l.apply(l.resolveFollowTheme(),{system:!0}),w(),l.syncNavbar())});let q=k.querySelector("#urppp-set-clean-default");q&&q.addEventListener("click",()=>{c.setCleanDefault(!c.getCleanDefault()),w()});let E=k.querySelector("#urppp-set-clean-analysis");E&&E.addEventListener("click",()=>{let z=c.getCleanAnalysis()==="direct";c.setCleanAnalysis(z?"tab":"direct"),w()});let m=k.querySelector("#urppp-set-apple-edge");m&&m.addEventListener("click",()=>{c.setAppleEdge(!c.getAppleEdge());try{c.applySkin()}catch{}w()});let u=k.querySelector("#urppp-set-auto-update");u&&u.addEventListener("click",()=>{c.setAutoUpdate(!c.getAutoUpdate()),w()});let y=k.querySelector("#urppp-set-check-update");y&&!y.__urpppBound&&(y.__urpppBound=!0,y.addEventListener("click",()=>{c.checkUpdates()}));let f=k.querySelector("#urppp-set-color"),S=k.querySelector("#urppp-set-hex");if(!f||!S)return;f.addEventListener("input",()=>{S.value=f.value.toUpperCase()}),S.addEventListener("change",()=>{let z=d.normalize(S.value);z&&(S.value=z,f.value=z)});let L=k.querySelector("#urppp-set-gen");L&&L.addEventListener("click",()=>{let z=d.normalize(S.value)||f.value;z&&(d.setAccent(d.normalize(z)),C(),w())});let $=k.querySelector("#urppp-set-save");$&&$.addEventListener("click",()=>{let z=d.normalize(S.value)||f.value;z&&(d.savePreset(z),d.setAccent(d.normalize(z)),C(),w())}),f.addEventListener("change",()=>{let z=d.normalize(f.value);z&&(S.value=z,A(k,z))})}return{bind:x,renderSchemeChoices:A}}function vp(n,o){let{seed:l,currentTheme:c,followSystem:d,skinId:w,darkSupported:C,dynamicSupported:A,fixedPalettes:x,followUseDynamic:k,cleanDefault:h,cleanAnalysis:v,appleEdge:q,autoUpdate:E,modeAvailability:m}=o,u=n.querySelector("#urppp-set-color"),y=n.querySelector("#urppp-set-hex");u&&(u.value=l),y&&(y.value=l),n.querySelectorAll(".urppp-set-mode").forEach(R=>{let tt=R.dataset.theme,nt=m[tt]!==!1,ut=!d&&tt===c&&nt;R.disabled=!nt,R.classList.toggle("ac",ut),R.classList.toggle("urppp-dyn-disabled",!nt),R.setAttribute("aria-disabled",nt?"false":"true"),nt?R.removeAttribute("title"):R.title=tt==="dark"?"当前界面风格不支持暗色模式":"当前界面风格不支持动态配色"});let f=n.querySelector("#urppp-set-follow");f&&(f.disabled=!C,f.classList.toggle("ac",d&&C),f.classList.toggle("urppp-dyn-disabled",!C),f.setAttribute("aria-pressed",d&&C?"true":"false"),f.textContent=d&&C?"跟随系统：开":"跟随系统：关",f.title=C?"":"当前界面风格不支持暗色模式");let S=n.querySelector("#urppp-set-follow-dynamic");S&&(S.classList.toggle("ac",k&&A),S.setAttribute("aria-pressed",k&&A?"true":"false"),S.textContent=k?"浅色用动态配色：开":"浅色用动态配色：关",S.disabled=!d||!A,S.classList.toggle("urppp-dyn-disabled",!A),S.style.opacity=A&&d?"1":"0.5",S.title=A?"":"当前界面风格不支持动态配色");let L=n.querySelector("#urppp-set-dynamic");L&&(L.style.display=A?"":"none",L.style.opacity="1",L.classList.toggle("urppp-dyn-disabled",!1),L.querySelectorAll("button, input, .urppp-set-scheme, .urppp-set-swatch").forEach(R=>{R.disabled=!1,R.classList.toggle("urppp-dyn-disabled",!1)}),L.querySelectorAll("h3, .urppp-set-tip, label").forEach(R=>{R.classList.toggle("urppp-dyn-disabled",!1)}));let $=n.querySelector("#urppp-set-brutal");$&&($.style.display=x?"":"none");let z=n.querySelector("#urppp-set-clean-default");z&&(z.classList.toggle("ac",h),z.setAttribute("aria-pressed",h?"true":"false"),z.textContent=h?"默认进入清爽模式：开":"默认进入清爽模式：关");let j=n.querySelector("#urppp-set-clean-analysis");if(j){let R=v==="direct";j.classList.toggle("ac",R),j.setAttribute("aria-pressed",R?"true":"false"),j.textContent=R?"清爽成绩分析展示：直接显示":"清爽成绩分析展示：选项卡"}let T=n.querySelector("#urppp-set-apple-edge"),O=n.querySelector("#urppp-set-apple-edge-tip");if(T){let R=w==="apple";T.style.display=R?"":"none",O&&(O.style.display=R?"":"none"),R&&(T.classList.toggle("ac",q),T.setAttribute("aria-pressed",q?"true":"false"),T.textContent=q?"类Apple边缘线条：开":"类Apple边缘线条：关")}let W=n.querySelector("#urppp-set-auto-update");W&&(W.classList.toggle("ac",E),W.setAttribute("aria-pressed",E?"true":"false"),W.textContent=E?"自动检测更新：开":"自动检测更新：关")}function Za(n){let o=String(n||"").replace(/\s+/g,"");return/^[•·●○▪◆★\-–]$/.test(o)||/^\d{1,4}$/.test(o)}function Vl(n){return/\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(n||""))}function wp({pathname:n="",href:o="",title:l="",headingText:c=""}={}){return/courseSelectNotice|evaluationNotice|notice\/index/i.test(`${n} ${o}`)?!0:/评估公告|通知公告|选课公告|公告|通知/.test(`${l} ${c}`)}function to(n,{noticePage:o=!1}={}){if(!n)return!1;let c=(n.querySelector("thead")?.textContent||"").replace(/\s+/g,"");if(/标题/.test(c)&&/发布时间|发布日期|日期|时间/.test(c)||o&&/标题|公告|通知/.test(c)&&!/教室|教学楼|课程号|成绩|学号|座位数/.test(c))return!0;let d=n.querySelectorAll("tbody tr, tr"),w=0;if(d.forEach(A=>{let x=A.querySelectorAll("td");x.length<2||x.length>4||Za(x[0].textContent)&&A.querySelector("a")&&Vl(A.textContent)&&(w+=1)}),w<1)return!1;if(o||w===d.length)return!0;let C=n.getAttribute("style")||"";return/dashed/i.test(C)||n.classList.contains("no-border-top")||!!n.getAttribute("width")}function kp(n,{noticePage:o=!1}={}){if(!n)return!0;if(n.classList?.contains("urppp-notice-table")||to(n,{noticePage:o}))return!1;let l=`${n.id||""} ${n.getAttribute("class")||""}`;if(/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(l)||n.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]'))return!0;let c=n.querySelector("tbody tr, tr");if(c&&c.querySelectorAll("td,th").length>=5)return!0;let w=(n.querySelector("thead")?.textContent||"").replace(/\s+/g,"");return!!(w&&(/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(w)||/序号/.test(w)&&!/标题|公告|通知|发布时间/.test(w))||n.querySelector("a")&&/课表|教室信息|查看/.test(n.textContent||"")&&!o&&/座位数|教学楼|教室号|校区名/.test(n.textContent||""))}function Ap({isNativePdfIsolationActive:n,isBusinessDataTable:o,documentRef:l=document,windowRef:c=window,MutationObserverRef:d=MutationObserver,getComputedStyleRef:w=getComputedStyle}){function C(){n()||l.querySelectorAll("table.table, table.table-bordered, table.dataTable").forEach(x=>{if(!x||x.closest(".urppp-table-wrap")||x.id==="courseTable"||x.closest(".modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal")||x.classList.contains("urppp-wrs-table")||x.classList.contains("urppp-notice-table"))return;o(x);let k=x.parentElement;if(!k)return;let h=k.style?.overflow||w(k).overflow;if(k.id?.endsWith("_scroll")||h==="auto"||h==="scroll"){k.classList.add("urppp-scroll-table-host");return}let q=l.createElement("div");q.className="urppp-table-wrap",k.insertBefore(q,x),q.appendChild(x)})}function A(){let x=l.getElementById("page-content-template")||l.querySelector(".page-content")||l.body;if(!x)return;let k=c.__urpppTableObsRoot;if(c.__urpppTableObs&&k===x&&x.isConnected)return;c.__urpppTableObs&&c.__urpppTableObs.disconnect();let h=0,v=new d(()=>{clearTimeout(h),h=setTimeout(C,80)});v.observe(x,{childList:!0,subtree:!0}),c.__urpppTableObs=v,c.__urpppTableObsRoot=x}return{bindTableWrapObserver:A,wrapTables:C}}function Sp(n){let o=String(n||"").trim().toLowerCase();if(!o||o==="transparent"||o==="inherit"||o==="initial")return!1;if(/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(o))return!0;let l=o.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);if(!l)return!1;let c=Number(l[1]),d=Number(l[2]),w=Number(l[3]);return(c+d+w)/3>=200}function Yl(n){if(!n?.style)return;let o=n.getAttribute("style")||"";if(!o||!/background/i.test(o))return;let l=n.style.backgroundColor||n.style.background||"";(Sp(l)||/background(-color|-image)?\s*:/i.test(o))&&(n.style.removeProperty("background"),n.style.removeProperty("background-color"),n.style.removeProperty("background-image")),["borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"].forEach(c=>{let d=n.style[c];!d||!Sp(d)||n.style.removeProperty(c.replace(/[A-Z]/g,w=>`-${w.toLowerCase()}`))}),/border(-color)?\s*:/i.test(o)&&/#e6e6e6|#eee|#ddd|#ccc/i.test(o)&&(n.style.removeProperty("border-color"),n.style.removeProperty("border-top-color"),n.style.removeProperty("border-right-color"),n.style.removeProperty("border-bottom-color"),n.style.removeProperty("border-left-color"))}function _p({isNativePdfIsolationActive:n,documentRef:o=document,windowRef:l=window,MutationObserverRef:c=MutationObserver}){function d(){if(!n())try{let C=o.documentElement.classList.contains("urppp-theme-dark"),A=o.body?.classList.contains("urppp-dark");if(!C&&!A)return;o.querySelectorAll("table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th").forEach(Yl)}catch{}}function w(){[0,200,800,1600].forEach(C=>setTimeout(()=>{try{d()}catch{}},C));try{let C=o.querySelector(".page-content, #page-content-template, .main-content")||o.body;if(!C)return;let A=l.__urpppTableScrubObs;if(A&&A.root===C&&C.isConnected)return;A?.observer&&A.observer.disconnect();let x=new c(()=>{clearTimeout(l.__urpppTableScrubTimer),l.__urpppTableScrubTimer=setTimeout(()=>{try{d()}catch{}},120)});x.observe(C,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),l.__urpppTableScrubObs={root:C,observer:x}}catch{}}return{scheduleScrubTableInlineBg:w,scrubTableHeaderInlineBg:d}}function Ep({beautifyPagebar:n,documentRef:o=document,windowRef:l=window,MutationObserverRef:c=MutationObserver,setTimeoutRef:d=setTimeout,clearTimeoutRef:w=clearTimeout}){function C(){n(),o.querySelectorAll("#urppagebar").forEach(x=>{if(x.__urpppPagebarObs)return;x.__urpppPagebarObs=!0,new c(()=>{w(l.__urpppPagebarTimer),l.__urpppPagebarTimer=d(()=>n(x.parentElement||o),150)}).observe(x,{childList:!0,subtree:!0})})}function A(){if(l.__urpppPagebarBound){d(C,0);return}l.__urpppPagebarBound=!0,[0,300,1e3,2500].forEach(x=>d(C,x))}return{scheduleBeautifyPagebar:A}}function Cp({destroyPagebarChosen:n,documentRef:o=document,logger:l=console}){function c(d){try{(d?.querySelectorAll?d.querySelectorAll("#urppagebar"):o.querySelectorAll("#urppagebar")).forEach(C=>{if(!C)return;C.classList.add("urppp-pagebar"),C.style.setProperty("display","block","important"),C.style.setProperty("width","100%","important"),C.style.setProperty("line-height","1.5","important");let A=C.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]')||C,x=Array.from(C.querySelectorAll('[id^="span_page_txt_"]')).map(m=>String(m.textContent||"").trim()).join(""),k=C.querySelector('select[id^="pagination_pageSize_"]'),h=k?String(k.value||""):"",v=C.querySelector('[id^="turnpageto_"]'),q=!!(v&&(v.readOnly||v.hasAttribute("readonly")));if(!(x.includes("转到")&&!q&&!h.includes("_"))){C.classList.add("urppp-pagebar-scroll"),C.classList.remove("urppp-pagebar-jump"),C.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach(m=>{m.style.setProperty("display","none","important")}),C.querySelectorAll("select").forEach(m=>{n(m),m.style.setProperty("width","128px","important"),m.style.setProperty("min-width","128px","important"),m.style.setProperty("max-width","128px","important")}),C.querySelectorAll(".chosen-container").forEach(m=>{try{m.style.setProperty("display","none","important")}catch{}});return}C.classList.add("urppp-pagebar-jump"),C.classList.remove("urppp-pagebar-scroll"),A.style.setProperty("display","flex","important"),A.style.setProperty("align-items","center","important"),A.style.setProperty("flex-wrap","wrap","important"),A.style.setProperty("gap","8px","important"),A.style.setProperty("position","relative","important"),A.style.setProperty("line-height","1.5","important"),C.querySelectorAll("ul.pagination").forEach(m=>{m.classList.add("urppp-pagination"),m.style.cssText=["display:inline-flex !important","align-items:center !important","flex-wrap:wrap !important","gap:4px !important","margin:0 !important","padding:0 !important","list-style:none !important","float:none !important","position:static !important"].join(";")}),C.querySelectorAll("ul.pagination > li").forEach(m=>{let u=m.classList.contains("active"),y=m.classList.contains("disabled"),f=m.classList.contains("previous")||/previous/i.test(m.getAttribute("name")||""),S=m.classList.contains("next")||/next/i.test(m.getAttribute("name")||"");m.classList.add("urppp-page-li"),u&&m.classList.add("urppp-page-li-active"),y&&m.classList.add("urppp-page-li-disabled"),f&&m.classList.add("urppp-page-li-prev"),S&&m.classList.add("urppp-page-li-next"),m.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","float:none !important","position:static !important","margin:0 !important","padding:0 !important","list-style:none !important","border:none !important","background:transparent !important","height:auto !important","min-height:0 !important"].join(";");let L=m.querySelector(":scope > span, :scope > a")||m.firstElementChild;if(!L)return;L.classList.add("urppp-page-chip"),u&&L.classList.add("urppp-page-chip-active"),y&&L.classList.add("urppp-page-chip-disabled"),(f||S)&&L.classList.add("urppp-page-chip-nav");let $=f||S?"72px":"40px",z=u?"var(--pagination-active-bg, var(--primary))":"var(--surface)",j=u?"var(--pagination-active-border, var(--primary))":"var(--border)",T=u?"var(--pagination-active-foreground, var(--primary-foreground, #fff))":y?"var(--text-muted)":"var(--text)";L.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","box-sizing:border-box !important","float:none !important","position:static !important","width:auto !important",`min-width:${$} !important`,"height:36px !important","min-height:36px !important","max-height:36px !important","padding:0 12px !important","margin:0 !important","line-height:36px !important","font-size:14px !important","font-weight:600 !important","border-radius:8px !important",`border:1px solid ${j} !important`,`background:${z} !important`,`color:${T} !important`,"box-shadow:none !important","text-decoration:none !important",`cursor:${y?"default":"pointer"} !important`,"white-space:nowrap !important","overflow:hidden !important"].join(";")}),C.querySelectorAll('[id^="btn_turnpageto_"]').forEach(m=>{m.classList.add("urppp-page-confirm"),m.style.setProperty("position","static","important"),m.style.setProperty("left","auto","important"),m.style.setProperty("top","auto","important"),m.style.setProperty("float","none","important"),m.style.setProperty("height","32px","important"),m.style.setProperty("min-width","52px","important"),m.style.setProperty("padding","0 12px","important"),m.style.setProperty("margin","0 4px","important"),m.style.setProperty("font-size","13px","important"),m.style.setProperty("line-height","1","important"),m.style.setProperty("vertical-align","middle","important")}),C.querySelectorAll('[id^="turnpageto_"]').forEach(m=>{m.classList.add("urppp-page-goto"),m.style.setProperty("position","static","important"),m.style.setProperty("display","inline-block","important"),m.style.setProperty("height","32px","important"),m.style.setProperty("width","48px","important"),m.style.setProperty("margin","0 4px","important"),m.style.setProperty("padding","4px 8px","important"),m.style.setProperty("font-size","14px","important"),m.style.setProperty("line-height","1.2","important"),m.style.setProperty("box-sizing","border-box","important"),m.style.setProperty("vertical-align","middle","important");let u=m.parentElement;u?.tagName==="SPAN"&&(u.style.setProperty("position","static","important"),u.style.setProperty("display","inline-flex","important"),u.style.setProperty("align-items","center","important"),u.style.setProperty("width","auto","important"),u.style.setProperty("height","auto","important"),u.style.setProperty("min-height","0","important"),u.style.setProperty("vertical-align","middle","important"))}),C.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach(m=>{m.style.setProperty("display","inline","important"),m.style.setProperty("border","none","important"),m.style.setProperty("background","transparent","important"),m.style.setProperty("padding","0","important"),m.style.setProperty("margin","0","important"),m.style.setProperty("height","auto","important"),m.style.setProperty("line-height","1.5","important"),m.style.setProperty("font-size","13px","important"),m.style.setProperty("color","var(--text-secondary, var(--text-muted))","important")})})}catch(w){l.warn("[URP++] pagebar beautify failed",w)}}return{beautifyPagebar:c}}function Pp({beautifyNoticeTables:n,pinNoticeRowSurface:o,documentRef:l=document,windowRef:c=window,MutationObserverRef:d=MutationObserver,requestAnimationFrameRef:w=requestAnimationFrame,setTimeoutRef:C=setTimeout,clearTimeoutRef:A=clearTimeout}){function x(){c.__urpppNoticeHoverScrub||(c.__urpppNoticeHoverScrub=!0,l.addEventListener("mouseout",h=>{let v=h.target?.closest?h.target.closest("table.urppp-notice-table tr.urppp-notice-row"):null;v&&w(()=>o(v))},!0))}function k(){[0,400,1500].forEach(h=>C(()=>{try{n()}catch{}},h));try{let h=l.getElementById("page-content-template")||l.querySelector(".page-content, .main-content")||l.body;if(!h)return;let v=c.__urpppNoticeObs;if(v&&v.root===h&&h.isConnected)return;v?.observer&&v.observer.disconnect();let q=new d(()=>{A(c.__urpppNoticeTimer),c.__urpppNoticeTimer=C(()=>{try{n()}catch{}},180)});q.observe(h,{childList:!0,subtree:!0}),c.__urpppNoticeObs={root:h,observer:q}}catch{}}return{bindNoticeHoverScrub:x,scheduleBeautifyNoticeTables:k}}function zp({getCurrentTheme:n,documentRef:o=document,getComputedStyleRef:l=getComputedStyle}){function c(){try{return l(o.documentElement).getPropertyValue("--surface").trim()||(n()==="dark"?"#151A24":"#FFFFFF")}catch{return n()==="dark"?"#151A24":"#FFFFFF"}}function d(x){if(!x?.classList?.contains("urppp-notice-row"))return;let k=c();x.classList.remove("hover"),x.style.setProperty("background",k,"important"),x.style.setProperty("background-color",k,"important"),x.querySelectorAll("td, th").forEach(h=>{h.classList.remove("hover"),h.style.setProperty("background","transparent","important"),h.style.setProperty("background-color","transparent","important")})}function w(x){try{let k=x||o;if(k.matches?.("tr.urppp-notice-row")){d(k);return}k.querySelectorAll("table.urppp-notice-table tr.urppp-notice-row").forEach(d)}catch{}}function C(x){x&&(x.classList.remove("table-hover","table-striped"),x.classList.add("urppp-notice-nohover"),x.querySelectorAll("tr.urppp-notice-row").forEach(k=>{k.classList.remove("hover"),d(k)}))}function A(x){if(!x)return;x.classList.remove("urppp-notice-table"),delete x.dataset.urpppNoticeScan,x.style.removeProperty("border"),x.style.removeProperty("border-left"),x.style.removeProperty("background");let k=x.closest(".urppp-table-wrap.urppp-notice-wrap");k&&(k.classList.remove("urppp-notice-wrap"),k.style.removeProperty("border"),k.style.removeProperty("background"),k.style.removeProperty("box-shadow"),k.style.removeProperty("overflow"),k.style.removeProperty("border-radius")),x.querySelectorAll("tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card").forEach(h=>{h.classList.remove("urppp-notice-row","urppp-notice-title-cell","urppp-notice-date-cell","urppp-notice-bullet-cell","urppp-notice-link","urppp-notice-time","urppp-notice-card","urppp-notice-card-row","urppp-notice-main","urppp-notice-meta","urppp-notice-title","urppp-notice-body"),(h.tagName==="TR"||h.tagName==="TD")&&["display","border","background","padding","margin","width","box-shadow","border-radius","float","position"].forEach(v=>{h.style.getPropertyPriority(v)==="important"&&h.style.removeProperty(v)}),delete h.dataset.urpppNoticeDone})}return{disarmNoticeTableHover:C,pinNoticeRowSurface:d,scrubNoticeInlineBg:w,stripMistakenNoticeTable:A}}function Lp({isNativePdfIsolationActive:n,bindNoticeHoverScrub:o,scrubNoticeInlineBg:l,stripMistakenNoticeTable:c,disarmNoticeTableHover:d,pinNoticeRowSurface:w,isBusinessDataTable:C,isNoticeListTable:A,isNoticePageContext:x,isNoticeBulletText:k,documentRef:h=document,windowRef:v=window,logger:q=console}){function E(){if(!n())try{o(),l(),h.querySelectorAll("table.urppp-notice-table, table.table").forEach(u=>{C(u)&&(u.classList.contains("urppp-notice-table")||u.querySelector(".urppp-notice-row, .urppp-notice-title-cell"))&&c(u)});let m=new Set(h.querySelectorAll('.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'));x()?h.querySelectorAll("table").forEach(u=>m.add(u)):h.querySelectorAll("table").forEach(u=>{A(u)&&m.add(u)}),Array.from(m).forEach(u=>{if(!u||C(u))return;if(u.querySelector("thead th")&&u.querySelectorAll("thead th").length>=3){let z=u.querySelector("thead")?.textContent||"";if(!A(u)&&/序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(z)&&!/标题|公告|通知/.test(z))return}let y=Array.from(u.querySelectorAll("tbody > tr, tr")).filter(z=>z.querySelector("td"));if(!y.length)return;let f=0;y.slice(0,12).forEach(z=>{let j=Array.from(z.children).filter(tt=>tt.tagName==="TD"||tt.tagName==="TH");if(j.length>=5)return;let T=(z.textContent||"").replace(/\s+/g," ").trim(),O=!!z.querySelector("a[href], a[onclick], a"),W=/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(T),R=j.some(tt=>k(tt.textContent));(O&&W||R&&O||R&&W)&&(f+=1)});let S=u.classList.contains("no-border-top")||/dashed|border-left-style/.test(u.getAttribute("style")||""),L=x();if(f<1){if(L){if(y.slice(0,8).filter(j=>{let T=Array.from(j.children).filter(W=>W.tagName==="TD"||W.tagName==="TH");if(T.length<1||T.length>4)return!1;let O=(j.textContent||"").replace(/\s+/g," ").trim();return!!j.querySelector("a")||/\d{4}/.test(O)}).length<1&&!S)return}else if(!(S&&/公告|通知/.test(h.title||"")))return}if(C(u))return;u.classList.add("urppp-notice-table"),u.dataset.urpppNoticeScan="1",d(u),u.style.setProperty("border","none","important"),u.style.setProperty("border-left","none","important"),u.style.setProperty("background","transparent","important"),u.style.setProperty("width","100%","important");let $=u.closest(".urppp-table-wrap");$&&($.classList.add("urppp-notice-wrap"),$.style.setProperty("border","none","important"),$.style.setProperty("background","transparent","important"),$.style.setProperty("box-shadow","none","important"),$.style.setProperty("overflow","visible","important"),$.style.setProperty("border-radius","0","important")),y.forEach(z=>{if(z.dataset.urpppNoticeDone==="1")return;let j=Array.from(z.children).filter(J=>J.tagName==="TD"||J.tagName==="TH");if(!j.length)return;let T=J=>(J||"").replace(/\u00AD/g,"").replace(/\u200B/g,"").replace(/\s+/g," ").trim();if(j.length>=2){let J=null,Y=null,et=null;if(j.forEach((Q,lt)=>{let rt=T(Q.textContent),pt=!!Q.querySelector("a");if(!J&&k(rt)&&(lt===0||j.length>=2)){J=Q;return}if(!et&&(/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(rt)||/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(rt)||/text-align\s*:\s*right/i.test(Q.getAttribute("style")||"")||lt===j.length-1&&rt.length<=28&&/\d{4}/.test(rt))&&/\d{4}/.test(rt)&&rt.length<=32){et=Q;return}!Y&&(pt||rt.length>4)&&(Y=Q)}),Y||(Y=j.find(Q=>Q!==J&&Q!==et)||j[0]),!et&&j.length>=2){let Q=j[j.length-1];Q!==Y&&Q!==J&&(et=Q)}if(z.classList.add("urppp-notice-row"),w(z),z.removeAttribute("width"),z.style.setProperty("flex-wrap","nowrap","important"),j.forEach(Q=>{Q.removeAttribute("width"),Q.removeAttribute("height"),Q.removeAttribute("align"),Q.style.setProperty("border","none","important"),Q.style.setProperty("background","transparent","important"),Q.style.setProperty("vertical-align","middle","important"),Q.style.removeProperty("width"),Q.style.setProperty("width","auto","important")}),J&&(J.classList.add("urppp-notice-bullet-cell"),J.style.setProperty("display","none","important"),J.style.setProperty("width","0","important"),J.style.setProperty("padding","0","important")),Y){Y.classList.add("urppp-notice-title-cell"),Y.removeAttribute("width"),Y.style.setProperty("width","auto","important"),Y.style.setProperty("max-width","100%","important"),Y.style.setProperty("min-width","0","important"),Y.style.setProperty("flex","1 1 0%","important"),Y.style.setProperty("overflow","hidden","important"),Y.style.setProperty("padding","0","important"),Y.style.setProperty("pointer-events","auto","important"),Y.style.setProperty("white-space","nowrap","important");let Q=Y.querySelector("a[href], a[onclick], a");if(Q||(Q=z.querySelector("a[href], a[onclick], a")),Q){Y.contains(Q)||(Y.innerHTML="",Y.appendChild(Q)),Q.classList.add("urppp-notice-link");let lt=Q.getAttribute("href"),rt=Q.getAttribute("onclick"),pt=Q.getAttribute("target"),gt=T(Q.textContent);Q.textContent=gt,lt!=null&&Q.setAttribute("href",lt),rt!=null&&Q.setAttribute("onclick",rt),pt!=null&&Q.setAttribute("target",pt),Q.style.setProperty("color","var(--text)","important"),Q.style.setProperty("text-decoration","none","important"),Q.style.setProperty("font-size","14px","important"),Q.style.setProperty("font-weight","500","important"),Q.style.setProperty("line-height","1.5","important"),Q.style.setProperty("pointer-events","auto","important"),Q.style.setProperty("cursor","pointer","important"),Q.style.setProperty("position","relative","important"),Q.style.setProperty("z-index","2","important"),Q.style.setProperty("display","block","important"),Q.style.setProperty("white-space","nowrap","important"),Q.style.setProperty("overflow","hidden","important"),Q.style.setProperty("text-overflow","ellipsis","important"),z.dataset.urpppNoticeClickBound!=="1"&&(z.dataset.urpppNoticeClickBound="1",z.style.setProperty("cursor","pointer","important"),z.addEventListener("click",K=>{if(K.target&&K.target.closest&&K.target.closest("a,button,input,select,textarea,label"))return;if(Q.getAttribute("onclick")){Q.click();return}let ct=Q.getAttribute("href");if(!ct||ct==="#"||ct.indexOf("javascript:")===0){Q.click();return}Q.target==="_blank"?v.open(ct,"_blank"):v.location.href=ct}))}else{let lt=T(Y.textContent);lt&&!Y.querySelector("button, input, select")&&(!Y.querySelector("*")||Y.children.length===0)&&(Y.textContent=lt)}}if(et){et.classList.add("urppp-notice-date-cell"),et.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-end !important","flex:0 0 auto !important","width:auto !important","max-width:none !important","white-space:nowrap !important","text-align:right !important","padding:0 !important","margin:0 0 0 auto !important","border:none !important","background:transparent !important","float:none !important","position:static !important","right:auto !important","left:auto !important","top:auto !important"].join(";");let Q=T(et.textContent);et.innerHTML="";let lt=h.createElement("span");lt.className="urppp-notice-time",lt.textContent=Q,et.appendChild(lt)}Y&&(Y.style.setProperty("flex","1 1 auto","important"),Y.style.setProperty("min-width","0","important"),Y.style.setProperty("margin","0","important"),Y.style.setProperty("float","none","important"),Y.style.setProperty("position","static","important")),z.style.setProperty("display","flex","important"),z.style.setProperty("align-items","center","important"),z.style.setProperty("justify-content","space-between","important"),z.style.setProperty("gap","16px","important"),z.style.setProperty("max-width","100%","important"),z.style.setProperty("box-sizing","border-box","important"),z.style.setProperty("overflow","hidden","important"),z.dataset.urpppNoticeDone="1";return}let O=j[0],W=Array.from(O.querySelectorAll(":scope > span"));if(W.length<2){let J=O.querySelector("a"),Y=T(O.textContent),et=Y.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);if(J||et){z.classList.add("urppp-notice-row");let Q=h.createElement("div");Q.className="urppp-notice-card urppp-notice-card-row";let lt=h.createElement("div");if(lt.className="urppp-notice-main",J){J.classList.add("urppp-notice-link");let rt=J.getAttribute("href"),pt=J.getAttribute("onclick"),gt=T(J.textContent);J.textContent=gt,rt!=null&&J.setAttribute("href",rt),pt!=null&&J.setAttribute("onclick",pt),J.style.setProperty("pointer-events","auto","important"),J.style.setProperty("cursor","pointer","important"),lt.appendChild(J),z.dataset.urpppNoticeClickBound!=="1"&&(z.dataset.urpppNoticeClickBound="1",z.style.setProperty("cursor","pointer","important"),z.addEventListener("click",K=>{if(!(K.target&&K.target.closest&&K.target.closest("a,button,input,select"))){if(J.getAttribute("onclick")||!J.getAttribute("href")||J.getAttribute("href")==="#"){J.click();return}v.location.href=J.getAttribute("href")}}))}else{let rt=h.createElement("div");rt.className="urppp-notice-title",rt.textContent=et?Y.replace(et[0],"").trim():Y,lt.appendChild(rt)}if(Q.appendChild(lt),et){let rt=h.createElement("div");rt.className="urppp-notice-meta";let pt=h.createElement("span");pt.className="urppp-notice-time",pt.textContent=et[1],rt.appendChild(pt),Q.appendChild(rt)}O.innerHTML="",O.appendChild(Q),O.dataset.urpppNoticeDone="1",z.dataset.urpppNoticeDone="1"}return}let R=null,tt=null,nt=[];if(W.forEach(J=>{let Y=(J.getAttribute("style")||"")+" "+(J.style.cssText||""),et=T(J.textContent);if(et){if(/font-size\s*:\s*18/i.test(Y)||!R&&/font-size\s*:\s*1[6-9]/i.test(Y)){R=J;return}if(/font-size\s*:\s*12/i.test(Y)||/float\s*:\s*right/i.test(Y)||/^\d{4}-\d{2}-\d{2}/.test(et)){tt=J;return}nt.push(J)}}),R||(R=W[0]),!tt){let J=W[W.length-1];J!==R&&(tt=J)}let ut=h.createElement("div");if(ut.className="urppp-notice-card",R){let J=h.createElement("div");J.className="urppp-notice-title",J.textContent=T(R.textContent),ut.appendChild(J)}if((nt.length?nt:W.filter(J=>J!==R&&J!==tt)).forEach(J=>{let Y=h.createElement("div");Y.className="urppp-notice-body",Y.textContent=T(J.textContent),Y.textContent&&ut.appendChild(Y)}),tt){let J=h.createElement("div");J.className="urppp-notice-meta";let Y=h.createElement("span");Y.className="urppp-notice-time",Y.textContent=T(tt.textContent),J.appendChild(Y),ut.appendChild(J)}O.innerHTML="",O.appendChild(ut),O.dataset.urpppNoticeDone="1",z.dataset.urpppNoticeDone="1",z.classList.add("urppp-notice-row")})})}catch(m){q.warn("[URP++] notice table beautify failed",m)}}return{beautifyNoticeTables:E}}var qp={"page-content-template":"urppp-pdf-page",mycoursetable:"urppp-pdf-mycoursetable",courseTable:"urppp-pdf-courseTable",courseTableBody:"urppp-pdf-courseTableBody",h4_id1:"urppp-pdf-h4-1",h4_id2:"urppp-pdf-h4-2",infoTable:"urppp-pdf-info-table","rwskxxbg-course":"urppp-pdf-rwskxxbg","other-course":"urppp-pdf-other-course",temp_title:"urppp-pdf-temp-title",temp_subtitle:"urppp-pdf-temp-subtitle"};function Ql(n){return n.querySelectorAll('script, iframe, object, embed, [id^="urppp-"], [data-urppp]').forEach(o=>o.remove()),[n,...n.querySelectorAll("*")].forEach(o=>{Array.from(o.classList||[]).forEach(l=>{/^urppp(?:-|$)/.test(l)&&o.classList.remove(l)}),Array.from(o.attributes||[]).forEach(l=>{/^data-urppp(?:-|$)/.test(l.name)&&o.removeAttribute(l.name)}),o.style&&Array.from(o.style).forEach(l=>{o.style.getPropertyPriority(l)==="important"&&o.style.removeProperty(l)})}),n}function Xl(n){return[n,...n.querySelectorAll("*")].forEach(o=>{o.id&&qp[o.id]&&(o.id=qp[o.id]),o.classList.contains("class_div")&&(o.classList.remove("class_div"),o.classList.remove("box_font"),o.classList.add("urppp-pdf-card")),o.classList.contains("course")&&(o.classList.remove("course"),o.classList.add("urppp-pdf-course"))}),n}function Kl(){let n=[];document.querySelectorAll('style[id^="urppp-"]').forEach(c=>{c.sheet&&!c.sheet.disabled&&(n.push(c),c.sheet.disabled=!0)});let o=0,l=document.getElementById("mycoursetable");return l&&(o=l.getBoundingClientRect().width),n.forEach(c=>{c.sheet.disabled=!1}),o}var Zl=`
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
`;function tc(n){n.querySelectorAll("td, th").forEach(o=>{o.style.removeProperty("background"),o.style.removeProperty("background-color")}),n.querySelectorAll("th[rowspan]").forEach(o=>{o.style.removeProperty("width"),o.style.setProperty("white-space","nowrap"),o.style.setProperty("text-align","center")}),n.querySelectorAll("table").forEach(o=>{o.style.setProperty("background","#ffffff","important"),o.style.setProperty("background-color","#ffffff","important"),o.style.setProperty("border","none","important"),o.style.setProperty("color","#000000","important")}),n.querySelectorAll("th").forEach(o=>{if(o.style.setProperty("color","#000000","important"),o.style.setProperty("border","1px solid #dddddd","important"),o.style.setProperty("font-weight","normal","important"),o.childNodes.length===1&&o.firstChild&&o.firstChild.nodeType===3){let l=document.createElement("span");l.textContent=o.textContent,o.textContent="",o.appendChild(l)}}),n.querySelectorAll("thead th").forEach(o=>{o.style.setProperty("background","#dddddd","important"),o.style.setProperty("background-color","#dddddd","important")}),n.querySelectorAll("tbody th").forEach(o=>{o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important")}),n.querySelectorAll("td").forEach(o=>{o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important"),o.style.setProperty("color","#000000","important"),o.style.setProperty("border","1px solid #dddddd","important")})}function Tp(n){let o=Kl(),l=document.createElement("div");l.id="urppp-pdf-stage",l.style.cssText="position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;width:"+(o||window.innerWidth||1440)+"px;";let c=document.createElement("div");c.id="urppp-pdf-page",c.style.cssText="position:relative;width:100%;box-sizing:border-box;";let d=n.cloneNode(!0);Ql(d),Xl(d),c.appendChild(d),l.appendChild(c),tc(d);let w=document.createElement("style");w.id="urppp-pdf-reset-style",w.textContent=Zl,document.head.appendChild(w),document.body.appendChild(l);let C=l.querySelector("#urppp-pdf-mycoursetable"),A=l.querySelector("#urppp-pdf-page")||l;if(!C)throw l.remove(),new Error("无法建立原生课表捕获节点");return{stage:l,target:C,page:A,sourceHost:n}}var Xe=0;function cr(){return Xe>0}function rc(n){return!n||n.tagName!=="STYLE"?!1:/^urppp(?:-|$)/.test(n.id||"")||n.hasAttribute("data-urppp-style")?!0:(n.textContent||"").includes("urppp-")}function Mp(){try{if(typeof unsafeWindow<"u"&&unsafeWindow)return unsafeWindow}catch{}return typeof window<"u"?window:null}function $p(n,o){let l=n&&typeof n.requestAnimationFrame=="function"?n.requestAnimationFrame.bind(n):typeof requestAnimationFrame=="function"?requestAnimationFrame:null;return l?l(o):setTimeout(o,0)}function ec(n={}){let o=n.document||(typeof document<"u"?document:null),l=n.page||Mp();if(!o)throw new Error("原生 PDF 隔离缺少 document");let c=o.getElementById("mycoursetable");if(!c)throw new Error("当前页面没有课表节点");Xe+=1;let d=[c,...c.querySelectorAll("*")],w=[],C=o.getElementById("soliderbox");C&&w.push(C);let A=c.parentElement;for(;A&&A!==o.documentElement;){let f=A.classList;(A.id==="page-content-template"||f&&(f.contains("page-content")||f.contains("profile-info-row")||f.contains("profile-info-value")))&&w.push(A),A=A.parentElement}let x=o.getElementById("page-content-template")||o.querySelector(".page-content");x&&!w.includes(x)&&w.push(x);let k=[...d,...w],h=k.map(f=>({element:f,style:f.getAttribute("style")})),v=Array.from(o.querySelectorAll("style")).filter(rc).map(f=>({style:f,disabled:f.sheet?f.sheet.disabled:!1,media:f.getAttribute("media")})),q=Array.from(c.querySelectorAll('[id^="urppp-"], [data-urppp]')),E=l&&l.divBuild,m=l&&l.__urpppOriginalDivBuild,u=!1,y=()=>{u||(u=!0,l&&l.divBuild===m&&typeof E=="function"&&(l.divBuild=E),h.forEach(({element:f,style:S})=>{f.isConnected&&(S===null?f.removeAttribute("style"):f.setAttribute("style",S))}),q.forEach(f=>f.removeAttribute("data-urppp-pdf-hidden")),v.forEach(({style:f,disabled:S,media:L})=>{try{L===null?f.removeAttribute("media"):f.setAttribute("media",L),f.sheet&&(f.sheet.disabled=S)}catch{}}),Xe=Math.max(0,Xe-1),$p(l,()=>{try{typeof n.onAfterRestore=="function"&&n.onAfterRestore()}catch{}}))};try{return v.forEach(({style:f})=>{try{f.setAttribute("media","not all"),f.sheet&&(f.sheet.disabled=!0)}catch{}}),k.forEach(f=>{!f.style||!f.style.length||Array.from(f.style).forEach(S=>{f.style.getPropertyPriority(S)==="important"&&(S==="height"&&f.matches("td, th")||f.style.removeProperty(S))})}),c.querySelectorAll("td").forEach(f=>{f.style.removeProperty("background"),f.style.removeProperty("background-color")}),x&&x.style.setProperty("position","relative","important"),c.style.setProperty("position","static","important"),c.querySelectorAll("td").forEach(f=>{f.style.setProperty("position","static","important")}),q.forEach(f=>{f.setAttribute("data-urppp-pdf-hidden","1"),f.style.setProperty("display","none","important")}),l&&typeof m=="function"&&(l.divBuild=m),y}catch(f){throw y(),f}}function Ip(n,o={}){return new Promise((l,c)=>{let d=o.page||Mp(),w=d&&d.back,C=d&&d.html2canvas;if(!n||typeof w!="function"){c(new Error("教务原生导出依赖未就绪"));return}let A=null;try{A=ec(o)}catch(m){c(m);return}let x=0,k=!1,h=null,v=null,q=m=>{if(!k){k=!0,x&&clearTimeout(x),d&&h&&d.back===h&&(d.back=w),v&&d.html2canvas===v&&(d.html2canvas=C);try{A&&A()}catch{}m?c(m):l()}},E=m=>q(m instanceof Error?m:new Error(String(m)));typeof C=="function"&&(v=function(){let m=C.apply(this,arguments);return m&&typeof m.catch=="function"&&m.catch(E),m},d.html2canvas=v),h=function(){try{return w.apply(this,arguments)}finally{setTimeout(()=>q(),0)}},d.back=h,x=setTimeout(()=>{try{w.call(d)}catch{}E(new Error("原生 PDF 生成超时"))},o.timeoutMs||60*1e3),$p(d,()=>{try{n.click()}catch(m){E(m)}})})}var Np=`.urppp-private-value{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;font-style:inherit!important;line-height:inherit!important;letter-spacing:0!important;color:inherit!important}
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
`;var Bp=`      /* 全局 */
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
`;var Fp=`/* Personal and resource schedule course cards. Keep table cells and table surfaces untouched. */
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
`;var Dp=`.urppp-export-wrap{position:relative!important;display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;margin-left:7px!important;font-weight:400!important;vertical-align:middle!important;white-space:nowrap!important}
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
`;var jp=`/* Settings panel shell */
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
#urppp-settings-panel .urppp-set-btn.ghost {
  background: var(--input-bg) !important;
  color: var(--text) !important;
  border-color: var(--border) !important;
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
#urppp-settings-panel .urppp-skin-card[data-skin="flat"] {
  background: #fff !important; color: #000 !important; border: 2px solid #000 !important; border-radius: 0 !important; box-shadow: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="flat"]:hover {
  background: #000 !important; color: #fff !important; border-color: #000 !important; transform: none !important; box-shadow: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="flat"].is-active { outline: 3px solid #000 !important; outline-offset: 2px !important; box-shadow: none !important; }
#urppp-settings-panel .urppp-skin-card[data-skin="flat"] > .urppp-skin-apply {
  border: 2px solid #000 !important; border-radius: 0 !important; background: #fff !important; color: #000 !important; box-shadow: none !important; transform: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="flat"] > .urppp-skin-apply:not(:disabled):hover,
#urppp-settings-panel .urppp-skin-card[data-skin="flat"] > .urppp-skin-apply.is-current {
  background: #000 !important; color: #fff !important; box-shadow: none !important; transform: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="flat"]:hover > .urppp-skin-apply { border-color: #fff !important; }
#urppp-settings-panel .urppp-skin-card[data-skin="organic"] {
  background: #faf6f1 !important; color: #5c4033 !important; border: 1px solid #e7e0d6 !important;
  border-radius: 22px !important; box-shadow: 0 3px 12px rgba(92,64,51,.06) !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="organic"]:hover {
  background: #f2e8dc !important; border-color: #8b9d77 !important; transform: translateY(-1px) !important; box-shadow: 0 8px 20px rgba(92,64,51,.12) !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="organic"].is-active { box-shadow: 0 0 0 2px #8b9d77, 0 8px 20px rgba(92,64,51,.1) !important; }
#urppp-settings-panel .urppp-skin-card[data-skin="organic"] > .urppp-skin-apply {
  border: 1px solid #8b9d77 !important; border-radius: 999px !important; background: #fffcf7 !important; color: #5c4033 !important; box-shadow: none !important; transform: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="organic"] > .urppp-skin-apply:not(:disabled):hover,
#urppp-settings-panel .urppp-skin-card[data-skin="organic"] > .urppp-skin-apply.is-current {
  background: #5c4033 !important; border-color: #5c4033 !important; color: #fff !important; box-shadow: none !important; transform: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="brutal"] {
  background: #fff !important; color: #000 !important; border: 3px solid #000 !important; border-radius: 0 !important;
  box-shadow: 5px 5px 0 #000 !important; transition-duration: 150ms !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="brutal"]:hover {
  background: #ccff00 !important; color: #000 !important; transform: translate(-2px,-2px) !important; box-shadow: 8px 8px 0 #000 !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="brutal"].is-active { outline: 4px solid #ff006e !important; outline-offset: 3px !important; box-shadow: 7px 7px 0 #000 !important; }
#urppp-settings-panel .urppp-skin-card[data-skin="brutal"] .urppp-skin-name { font-family: "Arial Black", "Microsoft YaHei UI", sans-serif !important; font-weight: 900 !important; }
#urppp-settings-panel .urppp-skin-card[data-skin="brutal"] > .urppp-skin-apply {
  border: 3px solid #000 !important; border-radius: 0 !important; background: #ff006e !important; color: #000 !important;
  box-shadow: 3px 3px 0 #000 !important; transform: none !important; transition-duration: 150ms !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="brutal"] > .urppp-skin-apply:not(:disabled):hover {
  background: #00d9ff !important; color: #000 !important; box-shadow: 5px 5px 0 #000 !important; transform: translate(-2px,-2px) !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="brutal"] > .urppp-skin-apply:not(:disabled):active {
  background: #ccff00 !important; box-shadow: none !important; transform: translate(3px,3px) !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="brutal"] > .urppp-skin-apply.is-current {
  background: #ff006e !important; border-color: #000 !important; color: #000 !important; box-shadow: 3px 3px 0 #000 !important; transform: none !important;
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
#urppp-settings-panel .urppp-skin-card[data-skin="neu"] {
  background: #e0e5ec !important; color: #3d4450 !important; border: none !important; border-radius: 20px !important;
  box-shadow: 5px 5px 10px #bec3ca, -5px -5px 10px #f7f9fc !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="neu"]:hover {
  background: #e0e5ec !important; transform: none !important; box-shadow: 2px 2px 4px #bec3ca, -2px -2px 4px #f7f9fc !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="neu"].is-active {
  box-shadow: inset 4px 4px 8px #b8bcc2, inset -4px -4px 8px #fff, 0 0 0 2px #6d5dfc !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="neu"] > .urppp-skin-apply {
  border: none !important; border-radius: 14px !important; background: #e0e5ec !important; color: #3d4450 !important;
  box-shadow: 3px 3px 6px #bec3ca, -3px -3px 6px #f7f9fc !important; transform: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="neu"] > .urppp-skin-apply.is-current {
  background: #e0e5ec !important; color: #263142 !important;
  box-shadow: inset 3px 3px 6px #b8bcc2, inset -3px -3px 6px #fff !important; transform: none !important;
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

html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="flat"] {
  background: #000 !important; color: #fff !important; border-color: #fff !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="flat"]:hover { background: #fff !important; color: #000 !important; }
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="flat"] > .urppp-skin-apply { background: #fff !important; color: #000 !important; border-color: #fff !important; }
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="flat"]:hover > .urppp-skin-apply { border-color: #000 !important; }

html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="organic"] {
  background: #332a24 !important; color: #eadbc8 !important; border-color: #5a4a3c !important;
  box-shadow: 0 3px 12px rgba(0,0,0,.4) !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="organic"]:hover { background: #3e332b !important; border-color: #9caf7f !important; }
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="organic"] > .urppp-skin-apply {
  background: #2b231d !important; color: #b9c99a !important; border-color: #6f8f52 !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="organic"] > .urppp-skin-apply:not(:disabled):hover,
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="organic"] > .urppp-skin-apply.is-current {
  background: #5c4033 !important; border-color: #5c4033 !important; color: #fff !important;
}

html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="brutal"] {
  background: #000 !important; color: #fff !important; border: 3px solid #fff !important;
  box-shadow: 5px 5px 0 #fff !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="brutal"]:hover {
  background: #1a1a1a !important; color: #ccff00 !important; transform: translate(-2px,-2px) !important; box-shadow: 8px 8px 0 #fff !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="brutal"] > .urppp-skin-apply {
  background: #ff006e !important; color: #fff !important; border-color: #fff !important; box-shadow: 3px 3px 0 #fff !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="brutal"] > .urppp-skin-apply:not(:disabled):hover {
  background: #00d9ff !important; color: #000 !important; box-shadow: 5px 5px 0 #fff !important; transform: translate(-2px,-2px) !important;
}

html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"] {
  background: #1e1e1c !important; color: #e8e8e4 !important; border: 0 !important; box-shadow: none !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"]:hover { background: #262624 !important; }
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"].is-active { background: #2c2c28 !important; }
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"] > .urppp-skin-apply { color: #e8e8e4 !important; }

html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="neu"] {
  background: #262b33 !important; color: #c9cdd6 !important;
  box-shadow: 5px 5px 10px #171a1f, -5px -5px 10px #343b46 !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="neu"]:hover {
  background: #262b33 !important; box-shadow: 2px 2px 4px #171a1f, -2px -2px 4px #343b46 !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="neu"] > .urppp-skin-apply {
  background: #262b33 !important; color: #c9cdd6 !important;
  box-shadow: 3px 3px 6px #171a1f, -3px -3px 6px #343b46 !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="neu"] > .urppp-skin-apply:not(:disabled):hover,
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="neu"] > .urppp-skin-apply.is-current {
  background: #262b33 !important; color: #fff !important;
  box-shadow: inset 3px 3px 6px #171a1f, inset -3px -3px 6px #343b46 !important;
}


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
html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-privacy-groups,html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-identity-editor{border:2px solid var(--text);border-radius:0;background:var(--surface)}
html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-privacy-group+.urppp-privacy-group{border-left:2px solid var(--text)}
html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-feature-input,html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-avatar-preview-shell{border:2px solid var(--text);border-radius:0;background:var(--surface)}
html[data-urppp-skin="flat"] #urppp-settings-panel #urppp-set-json-mapping{border:2px solid var(--text)!important;border-radius:0!important;background:var(--surface)!important}
html[data-urppp-skin="organic"] #urppp-settings-panel .urppp-privacy-groups,html[data-urppp-skin="organic"] #urppp-settings-panel .urppp-identity-editor{border-radius:18px}
html[data-urppp-skin="organic"] #urppp-settings-panel .urppp-feature-input,html[data-urppp-skin="organic"] #urppp-settings-panel .urppp-avatar-preview-shell{border-radius:12px}
html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-privacy-groups,html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-identity-editor{border:3px solid #000;border-radius:0;background:var(--surface)}
html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-privacy-group+.urppp-privacy-group{border-left:3px solid #000}
html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-feature-input,html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-avatar-preview-shell{border:2px solid #000;border-radius:0;background:var(--surface)}
html[data-urppp-skin="brutal"] #urppp-settings-panel #urppp-set-json-mapping{border:2px solid #000!important;border-radius:0!important;background:var(--surface)!important}
/* brutal 暗色：清爽服务卡文字/图标强制白字（补办学生证等黑底黑字可见） */
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-clean-root .uc-svc,
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-clean-root .uc-svc strong,
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-clean-root .uc-svc svg{color:#fff!important;stroke:#fff!important}
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-clean-root .uc-svc{background:#111!important;border-color:var(--brutal-accent)!important}
/* brutal 暗色：校历弹窗'下一个事件'卡黑底白字(默认近白背景+白字) */
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-cal-modal .cal-widget,
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-cal-modal .cal-widget .cal-w-sub,
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-cal-modal .cal-widget .cal-w-wk,
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-cal-modal .cal-widget .cal-w-prog-lbl,
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-cal-modal .cal-widget .cal-w-ev b{color:#fff!important}
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-cal-modal .cal-widget{background:#0a0a0a!important;border-color:var(--brutal-accent)!important}
html[data-urppp-skin="brutal"].urppp-theme-dark #urppp-cal-modal .cal-widget .cal-w-num{color:var(--brutal-accent)!important}
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
`;var Op=`      /* 表格美化：业务表格、分页、公告卡片（table-beautify） */
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
`;var Hp=`      /* 导航：顶栏、侧栏、面包屑（navigation） */
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
`;var Rp=`/* ===== 插件弹窗统一进入动画：淡入+缩放 + 内容逐条浮现 ===== */
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
  #urppp-clean-root .uc-modal{inset:0;left:0;top:0;right:0;bottom:0;width:100%;height:100%;max-height:none;border-radius:0;transform:translateY(16px)}
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
`;var Up=`      /* 首页重构仪表板（dashboard） */
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
`;var Wp=`      /* 成绩分析面板（score-analysis） */
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
`;var Gp=`      /* ============================================================
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
`;function Jp(){return{open:!1,mobileTab:"home",scoreAnalysisTab:"overview",profile:null,schedule:null,scores:null,catalog:null,occupancy:null,currentBuilding:null,loading:{profile:!1,schedule:!1,scores:!1,room:!1},roomError:"",roomDateOffset:0,selected:{passing:new Set,scheme:new Set},activeSchemeIdx:0,_schemeUserSelected:!1,viewWeek:0,weekLocked:!1,_termWeek:0,_termWeekResolved:!1,uiReady:!1}}function Vp(n){n.profile=null,n.schedule=null,n.scores=null,n.catalog=null,n.occupancy=null,n._termWeekResolved=!1,n._schemeUserSelected=!1,n._schemeInited=!1}function Yp({state:n,deps:o}){async function l(d){if(!d&&n.catalog&&n.catalog.length||n.loading.room)return n.catalog;n.loading.room=!0;try{o.render()}catch{}try{n.catalog=await o.loadClassroomCatalog(),n.roomError=""}catch(w){n.catalog=n.catalog||[],n.roomError=String(w&&w.message||w),console.warn("[URP++] room catalog",w)}finally{n.loading.room=!1;try{o.scheduleRender()}catch{}}return n.catalog}async function c(d){d&&Vp(n),n.loading.profile=n.loading.schedule=n.loading.scores=!0;try{let w=await o.ensureTermWeekResolved();!n.weekLocked&&w>=1&&(n.viewWeek=w)}catch{}if(o.render(),await Promise.all([(async()=>{try{n.profile&&!d||(n.profile=await o.loadProfile()),o.reconcileProfileAndScores()}catch(w){n.profile={name:"同学",majorPlan:"主修方案",majorGpa:"—",avatar:""},console.warn(w)}finally{n.loading.profile=!1,o.scheduleRender()}})(),(async()=>{try{n.schedule&&!d||(n.schedule=await o.loadSchedule())}catch(w){n.schedule={courses:[],error:String(w&&w.message||w)}}finally{if(n.loading.schedule=!1,!n.weekLocked){let w=o.getCurrentWeekNumber()||o.readRememberedTermWeek();w>=1&&(n.viewWeek=w)}o.scheduleRender()}})(),(async()=>{let w=null;try{n.scores&&!d||(n.scores=await o.loadScores(d)),w=n.scores,o.reconcileProfileAndScores(),w&&!w.error&&!w.evaluationReady&&o.enrichScoresWithEvaluation(w).then(()=>{n.scores===w&&(o.reconcileProfileAndScores(),o.scheduleRender())}).catch(C=>{console.warn("[URP++] attach evaluation",C)})}catch(C){n.scores={passing:[],schemes:[],error:String(C&&C.message||C)}}finally{n.loading.scores=!1,o.scheduleRender()}})()]),o.reconcileProfileAndScores(),!n.weekLocked){let w=o.getCurrentWeekNumber()||o.readRememberedTermWeek();w>=1&&(n.viewWeek=w)}o.scheduleRender()}return{ensureRoomCatalogLoaded:l,loadAll:c}}var Zr={autumn:{name:"秋季学期",weeks:20,start:"2026-08-31",end:"2027-02-20",events:[{t:"reg",name:"本科生新生报到",start:"2026-08-24",end:"2026-08-25"},{t:"reg",name:"在校生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"研究生新生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"在校本科补缓考",start:"2026-08-28",end:"2026-08-30"},{t:"term",name:"本科生开学典礼",start:"2026-09-01"},{t:"term",name:"研究生开学典礼",start:"2026-09-04"},{t:"term",name:"在校生正式行课",start:"2026-08-31",end:"2026-09-06"},{t:"holiday",name:"中秋节",start:"2026-09-25"},{t:"holiday",name:"国庆节假期",start:"2026-10-01",end:"2026-10-07"},{t:"sport",name:"校秋季田径运动会",start:"2026-10-23",end:"2026-10-24"},{t:"exam",name:"本科生期末集中考试周",start:"2027-01-04",end:"2027-01-15"},{t:"holiday",name:"寒假",start:"2027-01-18",end:"2027-02-20"},{t:"holiday",name:"春节",start:"2027-02-06"}]},spring:{name:"春季学期",weeks:18,start:"2027-03-01",end:"2027-07-03",events:[{t:"reg",name:"在校生报到",start:"2027-02-25",end:"2027-02-26"},{t:"term",name:"正式行课",start:"2027-03-01",end:"2027-03-07"},{t:"holiday",name:"清明节",start:"2027-04-05"},{t:"holiday",name:"劳动节假期",start:"2027-05-01",end:"2027-05-05"},{t:"holiday",name:"端午节",start:"2027-06-09"},{t:"exam",name:"期末集中考试",start:"2027-06-21",end:"2027-06-27"},{t:"term",name:"毕业典礼",start:"2027-06-25"},{t:"holiday",name:"暑假开始",start:"2027-07-04"}]}},ac={"2026-08-24":"农历七月十二","2026-08-25":"农历七月十三","2026-08-27":"农历七月十五","2026-08-28":"农历七月十六","2026-08-30":"农历七月十八","2026-08-31":"农历七月十九","2026-09-01":"农历七月二十","2026-09-04":"农历七月廿三","2026-09-25":"农历八月十五","2026-10-01":"农历八月廿一","2026-10-07":"农历八月廿七","2026-10-23":"农历九月十四","2026-10-24":"农历九月十五","2027-01-04":"农历冬月廿七","2027-01-15":"农历腊月初八","2027-01-18":"农历腊月十一","2027-02-06":"农历正月初一","2027-02-20":"农历正月十五","2027-02-25":"农历正月二十","2027-02-26":"农历正月廿一","2027-03-01":"农历正月廿四","2027-04-05":"农历二月廿九","2027-05-01":"农历三月廿五","2027-05-05":"农历三月廿九","2027-06-09":"农历五月初五","2027-06-21":"农历五月十七","2027-06-25":"农历五月廿一","2027-06-27":"农历五月廿三","2027-07-03":"农历五月廿九","2027-07-04":"农历六月初一"},ve={term:{color:"#44616f",label:"教学/开学"},reg:{color:"#8a74bd",label:"报到"},exam:{color:"#c08a3f",label:"考试周"},holiday:{color:"#d0716a",label:"假期"},sport:{color:"#778e63",label:"运动会"}};function Kp(){let n=new Date,o=l=>String(l).padStart(2,"0");return`${n.getFullYear()}-${o(n.getMonth()+1)}-${o(n.getDate())}`}function ao(n,o){return Math.round((Date.parse(o)-Date.parse(n))/864e5)}function oo(n,o){let l=ao(Zr[n].start,o);return l<0?0:Math.floor(l/7)+1}function ro(n){return ac[n]||""}function Qp(n){return String(n||"").slice(5)}function oc(n){let o=n||Kp(),[l,c]=o.split("-").map(Number);return c===8&&o>="2026-08-15"||c>=9||c<=2?"autumn":"spring"}function no(n,o){let l=n&&Zr[n]?n:"autumn",c=Zr[l],d=o||Kp(),w=c.events.map(h=>({e:h,d:ao(d,h.start)})).filter(h=>h.d>=-0).sort((h,v)=>h.d-v.d)[0],C=w?ao(d,w.e.start):null,A=oo(l,d),x=Math.max(0,Math.min(100,A/c.weeks*100)),k=d>=c.start;return{term:c,termId:l,next:w,daysLeft:C,weekNo:A,progress:x,started:k,today:d}}function Zp(n,o){let l=no(n,o),c=l.next?ve[l.next.e.t].color:"#c9cdd4",d=l.term;return`<button type="button" class="uc-cal-summary" data-urppp-cal-open aria-label="打开校历时间线">
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
  </button>`}function ti(n,o){let l=no(n,o);return`<button type="button" class="uc-cal-summary uc-cal-summary-compact" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-c-dot" style="background:${l.next?ve[l.next.e.t].color:"#c9cdd4"}"></span>
    <span class="cal-c-count"><b>${l.daysLeft==null?"—":l.daysLeft}</b><em>天后</em></span>
    <span class="cal-c-info">
      <span class="cal-c-name">${l.next?l.next.e.name:"学期已结束"}</span>
      <span class="cal-c-sub">${l.started?`第 ${l.weekNo} 周`:"尚未开学"} · ${l.term.name}</span>
    </span>
    <span class="cal-c-prog"><span class="cal-c-bar"><i style="width:${l.progress}%"></i></span><span class="cal-c-week">本学期进度 ${Math.min(l.weekNo,l.term.weeks)}/${l.term.weeks} 周</span></span>
  </button>`}function Xp(n,o){let l=no(n,o),c=l.next?ve[l.next.e.t].color:"#c9cdd4",d=l.term,w=Object.keys(Zr).map(v=>`<button type="button" class="cal-term${v===l.termId?" ac":""}" data-cal-term="${v}">${Zr[v].name}</button>`).join(""),C=`<div class="cal-widget">
    <div class="cal-w-left">
      <div class="cal-w-label">下一个事件</div>
      <div class="cal-w-ev"><i style="background:${c}"></i><b>${l.next?l.next.e.name:"学期已结束"}</b></div>
      <div class="cal-w-sub">${l.next?l.next.e.start+(l.next.e.end&&l.next.e.end!==l.next.e.start?" ~ "+l.next.e.end:""):""}${l.next&&ro(l.next.e.start)?" · "+ro(l.next.e.start):""}</div>
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
  </div>`,A=d.events.slice().sort((v,q)=>v.start<q.start?-1:1),x={};A.forEach(v=>{(x[v.start.slice(0,7)]=x[v.start.slice(0,7)]||[]).push(v)});let k=v=>v===l.today?" cal-today":"",h=Object.keys(x).map(v=>{let[,q]=v.split("-");return`<div class="cal-mon">
      <div class="cal-mon-label">${Number(q)} 月</div>
      <div class="cal-mon-items">${x[v].map(E=>{let m=ve[E.t].color,u=E.end&&E.end!==E.start?"~"+Qp(E.end):"",y=oo(l.termId,E.start)>0?`第 ${oo(l.termId,E.start)} 周`:"开学前";return`<div class="cal-ev${k(E.start)}">
          <span class="cal-ev-dot" style="background:${m}"></span>
          <span class="cal-ev-date">${Qp(E.start)}${u||""}<em>${ro(E.start)||"&nbsp;"}</em></span>
          <span class="cal-ev-name">${E.name}</span>
          <span class="cal-ev-tag" style="color:${m};background:${m}1a">${ve[E.t].label}</span>
          <span class="cal-ev-wk">${y}</span>
        </div>`}).join("")}</div>
    </div>`}).join("");return`<div class="cal-modal-wrap">
    <div class="cal-modal-top">
      <span class="cal-modal-title">校历时间线</span>
      <span class="cal-right"><span class="cal-term-pills">${w}</span><button type="button" class="cal-close" aria-label="关闭">✕</button></span>
    </div>
    ${C}
    <div class="cal-timeline">${h}</div>
  </div>`}function ri(n,o){let l=typeof document<"u"?document:null;if(!l)return;eo();let c=n&&Zr[n]?n:oc(o),d=l.createElement("div");d.id="urppp-cal-modal",d.innerHTML=`<div class="cal-overlay"></div>
    <div class="cal-dialog"><div class="cal-body">${Xp(c,o)}</div></div>`,l.documentElement.appendChild(d),setTimeout(()=>d.classList.add("open"),20),d.querySelector(".cal-overlay").addEventListener("click",()=>eo()),d.addEventListener("click",w=>{let C=w.target;if(C&&C.closest&&C.closest(".cal-close")){eo();return}let A=C&&C.closest?C.closest("[data-cal-term]"):null;if(A){let x=d.querySelector(".cal-body");x&&(x.innerHTML=Xp(A.dataset.calTerm,o)),d.querySelectorAll("[data-cal-term]").forEach(k=>k.classList.toggle("ac",k.dataset.calTerm===A.dataset.calTerm))}})}function eo(){let n=typeof document<"u"?document:null;if(!n)return;let o=n.getElementById("urppp-cal-modal");o&&(o.classList.remove("open"),o.classList.add("closing"),setTimeout(()=>{o.remove()},200))}function ei(n,o){let l=n||(typeof document<"u"?document:null);l&&l.addEventListener("click",c=>{let d=c.target;d&&d.closest&&d.closest("[data-urppp-cal-open]")&&(c.preventDefault(),c.stopPropagation(),ri())})}var Ke=!1;function po(){let n=typeof document<"u"?document:null;if(!n||Ke)return Ke;try{let o=n.createElement("style");if(o&&o.id!==void 0){o.id="urppp-cal-style",o.textContent=`
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
  `,o.id="urppp-cal-style";let l=n.head||n.documentElement;l&&l.appendChild(o),Ke=!0}}catch{}return Ke}function ai(){let n=typeof document<"u"?document:null;if(!n)return;let o=n.getElementById("urppp-nav-theme")||n.querySelector("#navbar .navbar-header")||n.getElementById("navbar"),l=n.getElementById("urppp-nav-clean"),c=n.getElementById("urppp-nav-cal");if(!o&&!l)return;let d=l&&l.parentElement||o;c&&c.parentElement===d||(c&&c.remove(),c=n.createElement("button"),c.type="button",c.id="urppp-nav-cal",c.title="校历时间线",c.setAttribute("aria-label","校历时间线"),c.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg><span>校历</span>',Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none",margin:"0 0 0 8px","vertical-align":"middle"}).forEach(([w,C])=>c.style.setProperty(w,C,"important")),c.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation(),ri()}),l&&l.parentElement?l.after(c):d&&d.appendChild(c))}function oi(){let n=typeof document<"u"?document:null;if(!n)return;let o=n.getElementById("urppp-nav-cal");o&&o.remove()}function ni({state:n,deps:o}){let l=0,c={gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)"};function d(f,S){let L=f||o.summarizeCourses([]);return`<div class="uc-metrics">${[["TotalCredit","总学分",L.totalCredit],["AvgScore","平均成绩",L.avgScore],["AvgGpa","平均绩点",L.avgGpa],["RequiredCredit","必修学分",L.requiredCredit],["RequiredAvg","必修平均",L.requiredAvg],["RequiredGpa","必修绩点",L.requiredGpa]].map(([z,j,T])=>{let O=o.classifyPrivacyLabel(j)||"grade",W=S&&o.DIRECT_EDIT_LABELS[S+z]?` data-urppp-edit-key="${S+z}"`:"";return`<div class="uc-metric"><em>${j}</em><b data-urppp-private="${O}"${W}>${T}</b></div>`}).join("")}</div>`}function w(){let f=n.scores;if(!f||f.error)return`<div class="uc-sa-empty">${o.escapeHtml(f&&f.error||"暂无成绩数据")}</div>`;let S=null;try{S=o.analyzeScores({scorePack:f,profile:n.profile})}catch{}if(!S||S.empty)return'<div class="uc-sa-empty">暂无可用成绩数据，请先查询成绩后再试。</div>';let L=typeof o.scoreChartLayout=="function"?o.scoreChartLayout():null;return`<div class="uc-sa-charts">
      <div class="uc-sa-chart-card"><h5>学期趋势</h5><div class="uc-sa-chart-scroll">${o.trendChartSvg({trend:S.trend,palette:o.scoreChartPalette||c,layout:L})}</div></div>
      <div class="uc-sa-chart-card"><h5>成绩分段分布</h5><div class="uc-sa-chart-scroll">${o.bandsChartSvg({bands:S.bands,palette:o.scoreChartPalette||c,layout:L})}</div></div>
    </div>
    <div class="uc-sa-more-row"><a class="uc-sa-more" data-href="/student/integratedQuery/scoreQuery/allPassingScores/index?urppp=sa">点击此处跳转到详细分析界面 →</a></div>`}function C(f){let S=!!o.isCleanAnalysisDirect(),L=n.scoreAnalysisTab==="analysis";return S?`<div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
  <div class="uc-bd">
    <div class="uc-sa-pane">${f}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis">${w()}</div>
  </div>`:`<div class="uc-hd uc-hd-tabs" role="tablist">
    <button type="button" class="uc-sa-tab${L?"":" ac"}" data-sa-tab="overview">成绩总览</button>
    <button type="button" class="uc-sa-tab${L?" ac":""}" data-sa-tab="analysis">成绩分析</button>
  </div>
  <div class="uc-bd">
    <div class="uc-sa-pane"${L?" hidden":""}>${f}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis"${L?"":" hidden"}>${w()}</div>
  </div>`}function A(){try{if(window.matchMedia&&window.matchMedia("(max-width:900px)").matches)return 40}catch{}return 56}function x(f){let S=o.getViewWeekNumber(),L=A(),$=Math.max(L-4,28),z=(f||[]).map(O=>Object.assign({},O,{thisWeek:o.weekBitActive(O.classWeek,S)||!O.classWeek&&String(O.week||"").indexOf(String(S))>=0,span:Math.max(1,O.span||1),color:O.color||o.courseColor(O.name)})),j={};z.forEach(O=>{let W=O.day+"_"+O.section;(j[W]||(j[W]=[])).push(O)});let T=`<div class="uc-week" data-urppp-private="schedule" data-week="${S}" data-row="${L}">`;T+='<div class="uc-week-head"><div class="h"></div>';for(let O=0;O<7;O++)T+=`<div class="h">${o.DAY_NAMES[O]}</div>`;T+='</div><div class="uc-week-body">',T+='<div class="uc-sec-col">';for(let O=1;O<=12;O++)T+=`<div class="s" style="height:${L}px">${O}</div>`;T+="</div>";for(let O=0;O<7;O++){T+=`<div class="uc-day-col" data-day="${O}" style="height:${L*12}px">`;for(let W=1;W<=12;W++)T+=`<div class="uc-grid-cell" data-sec="${W}" style="top:${(W-1)*L}px;height:${$}px"></div>`;T+=`<div class="uc-part-line" style="top:${4*L-2}px"></div>`,T+=`<div class="uc-part-line" style="top:${9*L-2}px"></div>`;for(let W=1;W<=12;W++){let R=(j[O+"_"+W]||[]).slice().sort((gt,K)=>gt.thisWeek!==K.thisWeek?(K.thisWeek?1:0)-(gt.thisWeek?1:0):(K.span||1)-(gt.span||1));if(!R.length)continue;let nt=R.filter(gt=>gt.thisWeek)[0]||R[0],ut=R.filter(gt=>gt!==nt),J=nt.span,Y=(W-1)*L+1,et=J*L-6,Q=nt.thisWeek?8:2,lt=nt.thisWeek?`--uc-course-color:${nt.color};top:${Y}px;height:${et}px;z-index:${Q};background:${nt.color}26;border-color:${nt.color}80`:`--uc-course-color:${nt.color};top:${Y}px;height:${et}px;z-index:${Q};background:color-mix(in srgb,${nt.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`,rt=ut.length?`<span class="uc-badge">+${ut.length}</span>`:"",pt=o.escapeHtml(JSON.stringify({name:nt.name,teacher:nt.teacher,place:nt.place,week:nt.week,day:nt.day,section:nt.section,span:nt.span,thisWeek:nt.thisWeek,others:ut.map(gt=>({name:gt.name,teacher:gt.teacher,place:gt.place,week:gt.week,thisWeek:gt.thisWeek,section:gt.section,span:gt.span}))}));T+=`<div class="uc-lesson${nt.thisWeek?"":" is-fade"}" style="${lt}" data-course='${pt}'>
          <b>${o.escapeHtml(nt.name)}</b>
          <i>${o.escapeHtml([nt.place,nt.week].filter(Boolean).join(" · "))}</i>
          ${rt}
        </div>`}T+="</div>"}return T+="</div></div>",T}function k(){try{if(n.loading&&n.loading.schedule)return"";let f=o.calVacation?o.calVacation():"term";if(f==="term"||o.getViewWeekNumber()!==0)return"";let S={summer:{title:"放暑假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'},winter:{title:"放寒假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>'},springfestival:{title:"春节快乐！",sub:"",svg:'<svg viewBox="0 0 72 72"><rect x="16" y="16" width="40" height="40" rx="7" fill="#b71c1c" stroke="#f5b301" stroke-width="2.4" transform="rotate(45 36 36)"/><path d="M36 16v40M16 36h40" stroke="#f5b301" stroke-width="1" opacity=".5"/><path d="M24 24l24 24M48 24L24 48" stroke="#f5b301" stroke-width="1" opacity=".35"/><text x="36" y="47" text-anchor="middle" font-size="30" font-weight="900" fill="#ffd54f" font-family="Noto Serif SC,STKaiti,KaiTi,serif" transform="rotate(180 36 36)">福</text></svg>',couplet:{scroll:"万象纳祥",right:"望江听雨华西看杏海纳百川享人间烟火",left:"江安漫步眉山泛舟有容乃大过锦绣新年"}}}[f];if(!S)return"";if(f==="springfestival"&&S.couplet){let $=S.couplet;return`<div class="uc-schedule-mask uc-mask-springfestival">
          <span class="uc-mask-scroll">${$.scroll}</span>
          <span class="uc-mask-cl uc-mask-cl-r">${$.right}</span>
          <span class="uc-mask-cl uc-mask-cl-l">${$.left}</span>
          <span class="uc-mask-ico">${S.svg}</span>
          <span class="uc-mask-txt"><b>${S.title}</b></span>
        </div>`}let L=S.sub?`<i>${S.sub}</i>`:"";return`<div class="uc-schedule-mask uc-mask-${f}"><span class="uc-mask-ico">${S.svg}</span><span class="uc-mask-txt"><b>${S.title}</b>${L}</span></div>`}catch{return""}}function h(){return`<div class="uc-services">${[{t:"空闲教室",i:"room",a:"room"},{t:"教学评估",i:"eval",h:"/student/teachingEvaluation/newEvaluation/index"},{t:"培养方案",i:"plan",h:"/student/integratedQuery/planCompletion/index"},{t:"补办学生证",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082"},{t:"免修申请",i:"apply",h:"/student/personalManagement/individualApplication/exemptionApplication/index"},{t:"替代课申请",i:"apply",h:"/student/personalManagement/personalApplication/curriculumReplacement/index"},{t:"火车票优惠卡",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083"}].map(S=>`
      <button type="button" class="uc-svc" data-action="${S.a||""}" data-href="${S.h||""}">
        ${o.ico(S.i)}<strong>${S.t}</strong>
      </button>`).join("")}</div>`}function v(){let f=o.personalizedProfile(n.profile||{}),S=n.schedule&&n.schedule.courses||[],L=n.scores&&n.scores.passing&&n.scores.passing[0]||{summary:o.summarizeCourses([])},$=n.scores&&n.scores.schemes||[];n.scores&&n.scores.majorIdx!=null&&n._schemeInited!==!0&&(n.activeSchemeIdx=n.scores.majorIdx||0,n._schemeInited=!0);let z=$[n.activeSchemeIdx]||$[0]||{summary:o.summarizeCourses([]),title:"方案成绩"},j=f.avatar?`<img src="${o.escapeHtml(f.avatar)}" alt="">`:`<span>${o.escapeHtml((f.name||"同")[0])}</span>`,T=n.loading.scores?'<div class="uc-loading">成绩加载中</div>':n.scores&&n.scores.error?`<div class="uc-empty">${o.escapeHtml(n.scores.error)}</div>`:`<div class="uc-score-grid">
            <div class="uc-score-pane" data-score="passing"><h5>全部及格成绩</h5>${d(L.summary,"passing")}</div>
            <div class="uc-score-pane" data-score="scheme"><h5>${o.escapeHtml((z.title||"方案成绩").split(/通过|获得|不通过/)[0].trim()||"方案成绩")}</h5>${d(z.summary,"scheme")}</div>
          </div>`,O=C(T);return`<div class="uc-desktop">
      <div class="uc-col">
        <div class="uc-card uc-profile-card"><div class="uc-bd"><div class="uc-profile">
          <div class="uc-avatar" data-urppp-private="avatar">${j}</div>
          <div>
            <div class="uc-name" data-urppp-private="name">${o.escapeHtml(f.name||"同学")}</div>
            <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${o.escapeHtml(f.majorPlan||"—")}</span></div>
            <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${o.escapeHtml(String(f.majorGpa||"—"))}</span></div>
          </div>
        </div>${(()=>{try{return Zp()}catch{return""}})()}</div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${o.getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${S.length?S.length+" 课次":n.schedule&&n.schedule.error||""}</span>
            </div>
          </div>
          <div class="uc-bd"><div class="uc-schedule-wrap">${n.loading.schedule?'<div class="uc-loading">课表加载中</div>':S.length?x(S):`<div class="uc-empty">${o.escapeHtml(n.schedule&&n.schedule.error||"暂无课表数据")}</div>`}${k()}</div></div>
        </div>
      </div>
      <div class="uc-col">
        <div class="uc-card">
          ${O}
        </div>
        <div class="uc-card services">
          <div class="uc-hd">服务</div>
          <div class="uc-bd">${h()}</div>
        </div>
      </div>
    </div>`}function q(){let f=o.personalizedProfile(n.profile||{}),S=n.schedule&&n.schedule.courses||[],L=n.scores&&n.scores.passing&&n.scores.passing[0]||{summary:o.summarizeCourses([])},$=(n.scores&&n.scores.schemes||[])[n.activeSchemeIdx]||{summary:o.summarizeCourses([])},z=f.avatar?`<img src="${o.escapeHtml(f.avatar)}" alt="">`:`<span>${o.escapeHtml((f.name||"同")[0])}</span>`;if(n.mobileTab==="scores"){let j=`<div class="uc-score-grid uc-score-grid-mobile">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${d(L.summary,"passing")}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${d($.summary,"scheme")}</div>
      </div>`;return`<div class="uc-mobile"><div class="uc-card">${C(j)}</div></div>`}return n.mobileTab==="room"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${E()}</div></div></div>`:n.mobileTab==="more"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${h()}</div></div></div>`:`<div class="uc-mobile">
      <div class="uc-card uc-profile-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${z}</div>
        <div><div class="uc-name" data-urppp-private="name">${o.escapeHtml(f.name||"同学")}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${o.escapeHtml(f.majorPlan||"—")}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${o.escapeHtml(String(f.majorGpa||"—"))}</span></div></div>
      </div>${(()=>{try{return ti()}catch{return""}})()}</div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${o.getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd"><div class="uc-schedule-wrap">${n.loading.schedule?'<div class="uc-loading">课表加载中</div>':S.length?x(S):`<div class="uc-empty">${o.escapeHtml(n.schedule&&n.schedule.error||"暂无课表数据")}</div>`}${k()}</div></div></div>
    </div>`}function E(){if(n.loading.room)return'<div class="uc-loading">教学楼加载中</div>';let f=n.catalog||[];return f.length?f.slice().sort((L,$)=>(/江安/.test(L.campus)?-1:0)-(/江安/.test($.campus)?-1:0)).map(L=>`
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${o.escapeHtml(L.campus)}</div>
        <div class="uc-build-grid">
          ${L.buildings.map($=>`<button type="button" data-build-path="${o.escapeHtml($.path)}" data-cn="${o.escapeHtml($.campusNumber||"")}" data-bn="${o.escapeHtml($.buildingNumber||"")}">${o.escapeHtml($.name)}</button>`).join("")}
        </div>
      </div>`).join(""):`<div class="uc-empty">${o.escapeHtml(n.roomError||"未读到教学楼列表")}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`}function m(f,S){if(!f||!f.rooms||!f.rooms.length)return'<div class="uc-empty">该楼暂无教室占用数据</div>';let L='<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';for(let T=1;T<=12;T++)L+=`<th class="sec">${T}</th>`;L+="</tr>";let $=f.rooms.map(T=>{let O=`<tr><th class="sticky">${o.escapeHtml(T.name)}</th><th class="sticky2">${o.escapeHtml(T.seats)}</th>`;for(let W=1;W<=12;W++){let R=(T.slots||[]).find(tt=>tt.section===W)||{busy:!1};if(R.busy){let tt=R.reason||R.typeLabel||"占用",nt=R.typeLabel||o.occupancyTypeLabel({occupancymoduleId:R.module}),ut=R.displayChar||o.firstContentChar(tt)||o.firstContentChar(nt)||"占",J=Object.assign({},R.detail||{room:T.name,section:W,reason:tt},{reason:tt,typeLabel:nt,contentName:R.contentName||R.detail&&R.detail.contentName||""}),Y=o.escapeHtml(JSON.stringify(J));O+=`<td><button type="button" class="uc-slot busy ${o.occupancyKindClass(nt)}" data-occ='${Y}' title="${o.escapeHtml(T.name)} 第${W}节 · ${o.escapeHtml(tt)}">${o.escapeHtml(ut)}</button></td>`}else O+=`<td><div class="uc-slot free" title="${o.escapeHtml(T.name)} 第${W}节 · 空闲"></div></td>`}return O+"</tr>"}).join(""),z=Number(f.dateOffset!=null?f.dateOffset:n.roomDateOffset)||0,j=(T,O)=>`<button type="button" class="uc-btn${z===T?" primary":""}" data-room-day="${T}">${O}</button>`;return`
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${o.escapeHtml(S||"")}</div>
          <div class="uc-sub">${o.escapeHtml(f.dateLabel||"")}${f.jxzc?" · 教学第"+f.jxzc+"周":""}</div>
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
      <div class="uc-occ"><table class="uc-occ-table">${L}${$}</table></div>`}function u(){let f=o.ensureRoot(),S=f.querySelector("#uc-body");o.getViewWeekNumber();let L=typeof window<"u"&&window.matchMedia?window.matchMedia:null,$=L&&L("(max-width:900px)").matches,z=!n.uiReady;S.innerHTML=$?q():v(),z?(n.uiReady=!0,f.classList.remove("uc-settled"),clearTimeout(f.__ucSettleTimer),f.__ucSettleTimer=setTimeout(()=>{n.open&&f.classList.add("uc-settled")},480)):f.classList.add("uc-settled"),o.bindUI(S),o.applyPersonalDisplay(S)}function y(){if(!n.open||l)return;let f=()=>{l=0,n.open&&u()},S=typeof requestAnimationFrame=="function"?requestAnimationFrame:null;l=S?S(f):setTimeout(f,0)}return{analysisHtml:w,metricHtml:d,occupancyHtml:m,render:u,renderScheduleBoard:x,roomPickerHtml:E,scheduleRender:y,scoreSectionHtml:C}}function pi({state:n,deps:o}){function l(v,q){return!v||(v.__urpppCleanUiBindings||(v.__urpppCleanUiBindings=new Set),v.__urpppCleanUiBindings.has(q))?!1:(v.__urpppCleanUiBindings.add(q),!0)}function c(v){if(!v)return;try{o.bindScheduleExportHosts(v)}catch(E){console.warn("[URP++] schedule export menu",E)}v.querySelectorAll("[data-score]").forEach(E=>{l(E,"score")&&E.addEventListener("click",()=>A(E.getAttribute("data-score")))}),v.querySelectorAll("[data-sa-tab]").forEach(E=>{l(E,"saTab")&&E.addEventListener("click",()=>{n.scoreAnalysisTab=E.getAttribute("data-sa-tab")==="analysis"?"analysis":"overview",o.render()})}),v.querySelectorAll("[data-href]").forEach(E=>{l(E,"href")&&E.addEventListener("click",m=>{let u=E.getAttribute("data-href");u&&(m.preventDefault(),o.closeCleanMode(),location.href=u)})}),v.querySelectorAll("[data-eval-url]").forEach(E=>{l(E,"eval")&&E.addEventListener("click",m=>{let u=E.getAttribute("data-eval-url");u&&(m.preventDefault(),m.stopPropagation(),o.closeCleanMode(),location.href=u)})}),v.querySelectorAll('[data-action="room"]').forEach(E=>{l(E,"room")&&E.addEventListener("click",()=>x())}),v.querySelectorAll("[data-room-reload]").forEach(E=>{l(E,"roomReload")&&E.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),o.ensureRoomCatalogLoaded(!0)})}),v.querySelectorAll("[data-build-path]").forEach(E=>{l(E,"building")&&E.addEventListener("click",async()=>{let m=E.getAttribute("data-build-path"),u=(E.textContent||"").trim(),y=E.getAttribute("data-cn")||"",f=E.getAttribute("data-bn")||"",S=E.closest("#uc-room-panel")||E.closest("#uc-modal-body")||null;n.roomDateOffset=0,await h({path:m,name:u,campusNumber:y,buildingNumber:f,dateOffset:0},u,S)})}),v.querySelectorAll("[data-room-day]").forEach(E=>{l(E,"roomDay")&&E.addEventListener("click",async m=>{m.preventDefault(),m.stopPropagation();let u=parseInt(E.getAttribute("data-room-day")||"0",10)||0;if(!n.currentBuilding)return;n.roomDateOffset=u;let y=Object.assign({},n.currentBuilding,{dateOffset:u}),f=E.closest("#uc-room-panel")||E.closest("#uc-modal-body")||null;await h(y,y.name||"",f)})});let q=v.querySelector("#uc-room-back");q&&(q.onclick=()=>{n.occupancy=null,n.currentBuilding=null;let E=q.closest("#uc-room-panel")||document.querySelector("#uc-room-panel")||document.querySelector("#uc-modal-body");E&&E.id==="uc-modal-body"||E&&E.id==="uc-room-panel"?(E.innerHTML=o.roomPickerHtml(),c(E)):o.render()}),v.querySelectorAll(".uc-slot.busy[data-occ]").forEach(E=>{l(E,"occupancy")&&E.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation();try{let u=JSON.parse(E.getAttribute("data-occ")||"{}");w("占用详情",`
            <div class="uc-occ-detail">
              <div class="uc-name">${o.escapeHtml(u.room||"")}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${o.escapeHtml(String(u.section||u.start||""))}${u.span>1?"-"+(Number(u.start||u.section)+Number(u.span)-1):""}节</div>
              <div class="uc-sub">占用类型：${o.escapeHtml(u.typeLabel||u.reason||"占用")}</div>
              <div class="uc-sub">具体内容：${o.escapeHtml(u.contentName||u.reason||"—")}</div>
              ${u.teacher?`<div class="uc-sub">教师：${o.escapeHtml(u.teacher)}</div>`:""}
              ${u.weeks?`<div class="uc-sub">周次：${o.escapeHtml(u.weeks)}</div>`:""}
              ${u.courseNo?`<div class="uc-sub">课程号：${o.escapeHtml(u.courseNo)}</div>`:""}
            </div>
          `,"",{stack:!0})}catch{}})}),v.querySelectorAll(".uc-lesson[data-course]").forEach(E=>{l(E,"course")&&E.addEventListener("click",m=>{m.stopPropagation();try{let u=JSON.parse(E.getAttribute("data-course")||"{}"),y=`第${u.section||"?"}${u.span>1?"-"+(Number(u.section)+Number(u.span)-1):""}节`,f=(u.others||[]).map(S=>`<div class="uc-course-sub ${S.thisWeek?"":"is-fade"}">
              <div class="uc-cd-name">${o.escapeHtml(S.name||"")}</div>
              <div class="uc-cd-meta">${o.escapeHtml([S.place,S.week,S.teacher].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${S.thisWeek?"当前周有课":"当前周无课"}</div>
            </div>`).join("");w("课程详情",`
            <div class="uc-course-detail">
              <div class="uc-cd-name">${o.escapeHtml(u.name||"")}</div>
              <div class="uc-cd-meta">${o.escapeHtml([u.place,u.teacher,u.week].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${u.thisWeek?"当前周有课":"当前周无课"} · ${o.escapeHtml(y)} · ${o.escapeHtml(o.DAY_NAMES[u.day]||"")}</div>
            </div>
            ${f?'<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>'+f:""}
          `,"")}catch{}})}),v.querySelectorAll("[data-week-delta]").forEach(E=>{l(E,"weekDelta")&&E.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation();let u=parseInt(E.getAttribute("data-week-delta")||"0",10)||0,y=n.schedule&&n.schedule.courses||[],f=o.inferMaxWeek(y),S=o.getViewWeekNumber();n.weekLocked=!0,n.viewWeek=Math.min(f,Math.max(1,S+u)),o.render();let L=document.querySelector("#urppp-clean-root .uc-week-label");L&&(L.classList.remove("uc-pop"),L.offsetWidth,L.classList.add("uc-pop"))})}),v.querySelectorAll("[data-week-reset]").forEach(E=>{l(E,"weekReset")&&E.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),n.weekLocked=!1;let u=o.getCurrentWeekNumber()||n._termWeek||1;n.viewWeek=u,o.render();let y=document.querySelector("#urppp-clean-root .uc-week-label");y&&(y.classList.remove("uc-pop"),y.offsetWidth,y.classList.add("uc-pop"))})})}let d=[];function w(v,q,E,m){m=m||{};let u=o.ensureRoot(),y=u.querySelector("#uc-mask"),f=u.querySelector("#uc-modal");m.stack&&f.classList.contains("open")?d.push({title:u.querySelector("#uc-modal-title").textContent,body:u.querySelector("#uc-modal-body").innerHTML,ft:u.querySelector("#uc-modal-ft").innerHTML}):m.stack||(d.length=0),y.classList.add("open"),f.classList.add("open"),u.querySelector("#uc-modal-title").textContent=v,u.querySelector("#uc-modal-body").innerHTML=q,u.querySelector("#uc-modal-ft").innerHTML=E||"",c(u.querySelector("#uc-modal-body")),c(u.querySelector("#uc-modal-ft")),o.applyPersonalDisplay(u.querySelector("#uc-modal"))}function C(){let v=o.rootEl();if(v){if(d.length){let q=d.pop();v.querySelector("#uc-modal-title").textContent=q.title,v.querySelector("#uc-modal-body").innerHTML=q.body,v.querySelector("#uc-modal-ft").innerHTML=q.ft||"",c(v.querySelector("#uc-modal-body")),c(v.querySelector("#uc-modal-ft"));return}v.querySelector("#uc-mask").classList.remove("open"),v.querySelector("#uc-modal").classList.remove("open")}}function A(v){let q=n.scores&&n.scores.passing&&n.scores.passing[0]||{courses:[],summary:o.summarizeCourses([])},E=n.scores&&n.scores.schemes||[];v==="scheme"&&n.scores&&n.scores.majorIdx!=null&&n._schemeInited!==!0&&(n.activeSchemeIdx=n.scores.majorIdx||0,n._schemeInited=!0);let m=E[n.activeSchemeIdx]||E[0]||{courses:[],summary:o.summarizeCourses([]),title:"方案成绩"},u=v==="scheme"?m:q,y=v==="scheme"?"scheme":"passing";n.selected[y]||(n.selected[y]=new Set);let f=v==="scheme"&&E.length>1?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${E.map((K,ct)=>`<button type="button" class="uc-btn ${ct===n.activeSchemeIdx?"primary":""}" data-scheme-idx="${ct}"><span data-urppp-private="organization">${o.escapeHtml((K.title||"方案").slice(0,28))}</span></button>`).join("")}</div>`:"",S=K=>{let ct=!!(K&&(K.unevaluated||o.isUnevaluatedScore(K.score))),wt=o.scoreToNumber(K&&K.score),vt="";ct?vt=wt!=null&&wt<60?"uneval-fail":"uneval":wt!=null?vt=wt>=60?"pass":"fail":/不及格|不合格|不通过/.test(String(K&&K.score||""))?vt="fail":K&&K.score&&(vt="pass");let _t=o.escapeHtml(K&&K.score||"—"),I=ct?K.evalUrl||"/student/teachingEvaluation/newEvaluation/index":"";return I?`<span class="uc-score-cell ${vt}" data-eval-url="${o.escapeHtml(I)}" title="未评教，点击前往评教">${_t}</span>`:`<span class="uc-score-cell ${vt}">${_t}</span>`},L=(u.courses||[]).map((K,ct)=>{let wt=n.selected[y].has(ct),vt=o.isValidOfficialGpa(K.officialGpa)?K.officialGpa:o.scoreToGpa(K.score),_t=!!(K.unevaluated||o.isUnevaluatedScore(K.score));return`<tr class="${wt?"is-on":""}${_t?" is-uneval":""}" data-idx="${ct}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${wt?"✓":""}</span><span class="uc-cname">${o.escapeHtml(K.name)}</span></td>
        <td><span class="uc-attr-pill">${o.escapeHtml(K.attr||"—")}</span></td>
        <td data-urppp-private="credit">${K.credit}</td>
        <td data-urppp-private="grade">${S(K)}</td>
        <td data-urppp-private="gpa">${_t||vt==null?"—":vt}</td>
      </tr>`}).join("");w(v==="scheme"?"方案成绩 · "+(m.title||""):"全部及格成绩",`
      ${f}${o.metricHtml(u.summary,v==="scheme"?"scheme":"passing")}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${L||'<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`,'<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>');let $=document.querySelector("#uc-modal-title");$&&(v==="scheme"?$.setAttribute("data-urppp-private","organization"):$.removeAttribute("data-urppp-private"),o.applyPersonalDisplay($.parentElement||$));let z=document.querySelector("#uc-modal-body"),j=document.getElementById("uc-calc"),T=document.getElementById("uc-score-table"),O=document.getElementById("uc-score-wrap"),W=document.getElementById("uc-select-box"),R=()=>{T.querySelectorAll("tbody tr[data-idx]").forEach(wt=>{let vt=parseInt(wt.getAttribute("data-idx"),10),_t=n.selected[y].has(vt);wt.classList.toggle("is-on",_t);let I=wt.querySelector(".uc-selmark");I&&(I.textContent=_t?"✓":"")});let K=[];n.selected[y].forEach(wt=>{u.courses[wt]&&K.push(u.courses[wt])});let ct=o.summarizeCoursesPreferOfficial(K);j&&(j.className="uc-calc",j.innerHTML=K.length?`已选 <b>${K.length}</b> 门 · 学分 <b data-urppp-private="credit">${ct.totalCredit}</b> · 均分 <b data-urppp-private="grade">${ct.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${ct.avgGpa}</b>`:"已选 0 门")},tt=(K,ct)=>{ct===!0?n.selected[y].add(K):ct===!1||n.selected[y].has(K)?n.selected[y].delete(K):n.selected[y].add(K)},nt=!1;T.querySelectorAll("tbody tr[data-idx]").forEach(K=>{K.addEventListener("click",ct=>{if(nt){nt=!1;return}let wt=parseInt(K.getAttribute("data-idx"),10);tt(wt),R()})});let ut=!1,J=0,Y=0,et=null,Q=()=>Array.from(T.querySelectorAll("tbody tr[data-idx]")),lt=(K,ct)=>{if(!W||!O)return{left:0,top:0,right:0,bottom:0,w:0,h:0};let wt=O.getBoundingClientRect(),vt=Math.min(J,K),_t=Math.min(Y,ct),I=Math.max(J,K),V=Math.max(Y,ct),Z=I-vt,bt=V-_t,mt=vt-wt.left+O.scrollLeft,Ct=_t-wt.top+O.scrollTop;return W.style.display=Z>3||bt>3?"block":"none",W.style.left=mt+"px",W.style.top=Ct+"px",W.style.width=Z+"px",W.style.height=bt+"px",{left:vt,top:_t,right:I,bottom:V,w:Z,h:bt}},rt=K=>{if(!ut)return;K.preventDefault();let ct=lt(K.clientX,K.clientY);ct.w<=3&&ct.h<=3||(n.selected[y]=new Set(et),Q().forEach(wt=>{let vt=wt.getBoundingClientRect();if(!!(vt.right<ct.left||vt.left>ct.right||vt.bottom<ct.top||vt.top>ct.bottom))return;let I=parseInt(wt.getAttribute("data-idx"),10);et.has(I)?n.selected[y].delete(I):n.selected[y].add(I)}),R())},pt=K=>{let ct=Math.abs(K.clientX-J)>3||Math.abs(K.clientY-Y)>3;ut=!1,W&&(W.style.display="none"),document.removeEventListener("mousemove",rt,!0),document.removeEventListener("mouseup",pt,!0),ct&&(nt=!0),R()};O.addEventListener("mousedown",K=>{K.button===0&&(ut=!0,J=K.clientX,Y=K.clientY,et=new Set(n.selected[y]),lt(J,Y),document.addEventListener("mousemove",rt,!0),document.addEventListener("mouseup",pt,!0))}),z.querySelectorAll("[data-scheme-idx]").forEach(K=>K.addEventListener("click",()=>{n.activeSchemeIdx=parseInt(K.getAttribute("data-scheme-idx"),10)||0,n._schemeUserSelected=!0,A("scheme")}));let gt=document.getElementById("uc-clear");gt&&(gt.onclick=()=>{n.selected[y]=new Set,R()}),R()}async function x(){w("空闲教室",'<div class="uc-loading">加载教学楼</div>',"");try{await o.ensureRoomCatalogLoaded(!1),w("空闲教室",o.roomPickerHtml(),'<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>')}catch(v){w("空闲教室",`<div class="uc-empty">${o.escapeHtml(v&&v.message||v)}</div>`,"")}}function k(v){if(v&&v.isConnected)return v;let q=document.querySelector("#uc-room-panel");if(q&&q.offsetParent!==null||q&&n.mobileTab==="room")return q;let E=document.querySelector("#uc-modal-body"),m=document.querySelector("#uc-modal");return m&&m.classList.contains("open")&&E?E:q||E||null}async function h(v,q,E){let m=k(E);if(!m){console.warn("[URP++] no room host");return}m.innerHTML='<div class="uc-loading">加载占用网格</div>';try{let u=await o.loadBuildingOccupancy(v);m.innerHTML='<div class="uc-loading">匹配课程名称</div>';let y=u.planNumber||"";if(!y)try{let L=await o.fetchText("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),$=JSON.parse(L);if(y=$&&($.zxjxjhh||$.xnxq||$.dateList&&$.dateList[0]&&$.dateList[0].zxjxjhh)||"",!y&&$&&$.xkxx&&$.xkxx[0]){let z=Object.keys($.xkxx[0]||{}),j=z.length?$.xkxx[0][z[0]]:null;y=j&&(j.zxjxjhh||j.executiveEducationPlanNumber)||""}}catch{}y||(y="2025-2026-2-1"),u.planNumber=y;try{u=await o.enrichOccupancyWithCurriculum(u,typeof v=="object"?v:{},y)}catch(L){console.warn("[URP++] enrich occupancy",L)}n.occupancy=u,n.roomDateOffset=Number(u.dateOffset!=null?u.dateOffset:n.roomDateOffset)||0;let f=typeof v=="object"?v:{path:v,name:q};n.currentBuilding=Object.assign({},f,{name:q||f.name||"",dateOffset:n.roomDateOffset}),q=q||v&&v.name||"";let S=k(m)||m;S.innerHTML=o.occupancyHtml(u,q),c(S)}catch(u){let y=k(m)||m;y&&(y.innerHTML=`<div class="uc-empty">${o.escapeHtml(u&&u.message||u)}</div>`)}}return{bindUI:c,closeModal:C,getRoomHost:k,openModal:w,openRoomModal:x,openScoreModal:A,showBuilding:h}}function ii({state:n,deps:o}){function l(){return document.getElementById("urppp-clean-root")}function c(){o.ensureStyle();let x=l();if(x)return x;x=document.createElement("div"),x.id="urppp-clean-root",x.innerHTML=`
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
          <button type="button" class="uc-btn" id="uc-refresh">${o.ico("refresh")}<span>刷新</span></button>
          <button type="button" class="uc-btn primary" id="uc-exit">${o.ico("exit")}<span>退出</span></button>
        </div>
      </div>
      <div class="uc-shell"><div class="uc-shell-inner" id="uc-body"></div></div>
      <div class="uc-tabbar" id="uc-tabbar">
        <button type="button" data-tab="home" class="ac">${o.ico("home")}<span>首页</span></button>
        <button type="button" data-tab="scores">${o.ico("score")}<span>成绩</span></button>
        <button type="button" data-tab="room">${o.ico("room")}<span>教室</span></button>
        <button type="button" data-tab="more">${o.ico("more")}<span>其他</span></button>
      </div>
      <div class="uc-mask" id="uc-mask"></div>
      <div class="uc-modal" id="uc-modal">
        <div class="uc-modal-hd"><span id="uc-modal-title">详情</span><button type="button" class="uc-btn" id="uc-modal-close">${o.ico("close")}</button></div>
        <div class="uc-modal-bd" id="uc-modal-body"></div>
        <div class="uc-modal-ft" id="uc-modal-ft"></div>
      </div>`,document.documentElement.appendChild(x),x.querySelector("#uc-exit").onclick=w,x.querySelector("#uc-refresh").onclick=()=>d(!0),x.querySelector("#uc-mask").onclick=o.closeModal,x.querySelector("#uc-modal-close").onclick=o.closeModal;let k=()=>{o.syncThemeDotGroup(x.querySelector("#uc-top-theme"))};x.querySelectorAll("#uc-top-theme .urppp-nav-dot[data-theme]").forEach(y=>{y.addEventListener("click",()=>{o.handleThemeDotClick(y.dataset.theme),k();try{o.syncNavbarThemeUI()}catch{}try{o.syncSettingsPanelUI()}catch{}})});let h=x.querySelector("#uc-settings");h&&h.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation();try{o.openSettingsPanel()}catch{}});let v=x.querySelector("#uc-menu-toggle"),q=y=>{y.classList.remove("urppp-clean-sidebar");let f=y.__urpppCleanInline;if(f){let L=y.style,$=(z,j)=>{let T=f[j];T&&T.v?L.setProperty(z,T.v,T.p||""):L.removeProperty(z)};$("top","top"),$("height","height"),$("z-index","z"),$("position","pos"),$("transform","transform"),$("visibility","vis"),$("pointer-events","pe"),$("transition","transition"),delete y.__urpppCleanInline}let S=y.__urpppCleanOrigin;S&&S.parent&&y.parentElement!==S.parent&&(S.next&&S.next.parentElement===S.parent?S.parent.insertBefore(y,S.next):S.parent.appendChild(y)),delete y.__urpppCleanOrigin},E=()=>{let y=document.getElementById("sidebar");if(y)if(n.open){if(y.classList.add("urppp-clean-sidebar"),!y.__urpppCleanInline){let j=y.style,T=O=>({v:j.getPropertyValue(O),p:j.getPropertyPriority(O)});y.__urpppCleanInline={top:T("top"),height:T("height"),z:T("z-index"),pos:T("position"),transform:T("transform"),vis:T("visibility"),pe:T("pointer-events"),transition:T("transition")},y.__urpppCleanOrigin={parent:y.parentElement,next:y.nextSibling}}if(y.parentElement!==x){let j=x.querySelector(".uc-shell");x.insertBefore(y,j||null)}let f=x.getBoundingClientRect(),S=x.querySelector(".uc-top"),L=S?S.getBoundingClientRect():null,$=Math.max(44,Math.round(L?L.bottom-f.top:60)),z=Math.max(0,Math.round(f.height-$));y.style.setProperty("top",$+"px","important"),y.style.setProperty("height",z+"px","important"),y.style.setProperty("z-index","12030","important"),y.style.setProperty("position","fixed","important")}else q(y)},m=()=>{let y=document.getElementById("sidebar");if(!y)return;try{o.stopDrawerAnimation(y)}catch{}y.classList.remove("display","urppp-drawer-closing"),q(y),v&&(v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label","打开菜单"));let f=document.getElementById("urppp-mobile-menu-button");f&&(f.setAttribute("aria-expanded","false"),f.setAttribute("aria-label","打开菜单"))};v&&v.addEventListener("click",y=>{y.preventDefault(),y.stopImmediatePropagation();let f=document.getElementById("sidebar");if(!f)return;f.__urpppCleanMenuBound||(f.__urpppCleanMenuBound=!0,f.addEventListener("click",$=>{if(!n.open)return;let z=$.target&&$.target.closest?$.target.closest("a[href]"):null;if(!z||z.closest("#urppp-mobile-search-panel"))return;let j=String(z.getAttribute("href")||"").trim();if(z.closest("#urppp-mobile-quick, #urppp-mobile-user")){if(!j||j==="#"||j.startsWith("javascript")||z.target==="_blank"||/^https?:\/\//i.test(j))return;w();return}!j||j==="#"||j.startsWith("javascript")||z.target==="_blank"||/^https?:\/\//i.test(j)||w()},!0));let S=!f.classList.contains("display");E(),o.setDrawerOpen(f,v,S);let L=document.getElementById("urppp-mobile-menu-button");L&&(L.setAttribute("aria-expanded",S?"true":"false"),L.setAttribute("aria-label",S?"关闭菜单":"打开菜单"))}),x.__closeCleanDrawer=m,x.__syncCleanSidebarZ=E,x.__syncCleanThemeDots=k;let u=globalThis.ResizeObserver;if(typeof u=="function"){let y=new u(()=>{n.open&&E()});y.observe(x);let f=x.querySelector(".uc-top");f&&y.observe(f),x.__cleanSidebarResizeObserver=y}try{let y=window.matchMedia&&window.matchMedia("(max-width: 900px)");if(y){let f=()=>{n.open&&(E(),o.render())};typeof y.addEventListener=="function"?y.addEventListener("change",f):typeof y.addListener=="function"&&y.addListener(f),x.__scoreLayoutMedia=y,x.__scoreLayoutChange=f}}catch{}try{o.applySkinAttr()}catch{}return k(),x.querySelectorAll("#uc-tabbar button").forEach(y=>{y.onclick=()=>{n.mobileTab=y.dataset.tab,x.querySelectorAll("#uc-tabbar button").forEach(f=>f.classList.toggle("ac",f===y)),o.render(),n.mobileTab==="room"&&o.ensureRoomCatalogLoaded()}}),po(),ei(x),x}function d(x){c();let k=n.open;n.open=!0,n.uiReady=!1,n.weekLocked=!1;let h=o.getCurrentWeekNumber()||o.readRememberedTermWeek();n.viewWeek=h>=1?h:n.viewWeek>=1?n.viewWeek:0,document.documentElement.classList.add("urppp-clean-lock",o.CLEAN_FLAG);let v=l();v.classList.remove("closing"),k||(v.classList.remove("uc-settled","open"),v.offsetWidth,v.classList.add("open"));try{o.stopDrawerAnimation(document.getElementById("sidebar"))}catch{}try{v.__syncCleanThemeDots&&v.__syncCleanThemeDots()}catch{}try{v.__syncCleanSidebarZ&&v.__syncCleanSidebarZ()}catch{}try{o.injectCleanSidebarSections(document.getElementById("sidebar"))}catch{}o.loadAll(!!x);try{o.ensureRoomCatalogLoaded()}catch{}}function w(){n.open=!1,n.uiReady=!1,o.closeModal(),document.documentElement.classList.remove("urppp-clean-lock",o.CLEAN_FLAG);let x=l();if(x){x.classList.remove("open","uc-settled","uc-drawer-open"),x.classList.add("closing"),clearTimeout(x.__ucSettleTimer);try{x.__closeCleanDrawer&&x.__closeCleanDrawer()}catch{}setTimeout(()=>{x.classList.remove("closing")},360)}try{o.refreshMobileNavbar()}catch{}}function C(){try{o.ensureStyle();let x=document.getElementById("urppp-nav-clean");if(!o.isHomePage()){x&&x.remove(),oi();return}let k=document.getElementById("urppp-nav-theme")||document.querySelector("#navbar .navbar-header")||document.querySelector("#navbar");if(!k)return;x||(x=document.createElement("button"),x.type="button",x.id="urppp-nav-clean",x.title="清爽模式",x.innerHTML=`${o.ico("clean")}<span>清爽</span>`,x.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),d(!1)}),k.appendChild(x)),Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none"}).forEach(([h,v])=>x.style.setProperty(h,v,"important")),po();try{ai()}catch{}}catch(x){console.warn("[URP++] clean entry",x)}}return{cleanModeApi:{open:d,close:w,inject:C,refresh:o.refreshCleanPersonalDisplay,refreshRender:()=>{try{o.render()}catch{}},scoreToGpa:o.scoreToGpa,summarizeCourses:o.summarizeCourses},closeCleanMode:w,ensureRoot:c,injectCleanEntry:C,openCleanMode:d,rootEl:l}}function si({deps:n}){function o(){if(window.__urpppScheduleHoverNear)return;window.__urpppScheduleHoverNear=!0;let C=12,A=16,x=0,k=0,h=!1,v=0,q=()=>document.getElementById("schedule-hover"),E=y=>{if(!y||y.style&&y.style.display==="none")return!1;let f=window.getComputedStyle(y);return f.display!=="none"&&f.visibility!=="hidden"},m=()=>{let y=q();if(!y||!E(y)){h=!1;return}h=!0;let f=window.innerWidth||1200,S=window.innerHeight||800,L=x+C,$=k+A,z=Math.min(320,y.offsetWidth||280),j=Math.min(220,y.offsetHeight||160);L+z>f-8&&(L=f-z-8),$+j>S-8&&($=S-j-8),L<8&&(L=8),$<8&&($=8),y.style.setProperty("position","fixed","important"),y.style.setProperty("left",Math.round(L)+"px","important"),y.style.setProperty("top",Math.round($)+"px","important"),y.style.setProperty("right","auto","important"),y.style.setProperty("bottom","auto","important"),y.style.setProperty("margin","0","important"),y.style.setProperty("z-index","3000","important"),y.style.setProperty("pointer-events","none","important")},u=()=>{v||(v=requestAnimationFrame(()=>{v=0,m()}))};document.addEventListener("mousemove",y=>{if(x=y.clientX,k=y.clientY,!h){let f=q();f&&f.style&&f.style.display&&f.style.display!=="none"&&(h=!0)}h&&u()},!0),document.addEventListener("mouseover",y=>{y.target&&y.target.closest&&y.target.closest(".fc-event, .fc-time-grid-event")&&(x=y.clientX,k=y.clientY,setTimeout(()=>{h=!0,m()},0),setTimeout(m,40))},!0),document.addEventListener("mouseout",y=>{y.target&&y.target.closest&&y.target.closest(".fc-event, .fc-time-grid-event")&&setTimeout(()=>{let S=q();E(S)||(h=!1)},50)},!0)}function l(C){try{let A=!!(C&&C.force),x=typeof unsafeWindow<"u"&&unsafeWindow.jQuery?unsafeWindow.jQuery:window.jQuery||null;if(!x||!x.fn||!x.fn.fullCalendar)return!1;let k=document.getElementById("main-calendar")||document.querySelector("#urppp-left .fc, #urppp-dashboard .fc");if(!k)return!1;if(!A&&k.dataset.urpppFcSized==="1")return!0;let h=x(k);if(!(h.data("fullCalendar")||h.hasClass("fc")))return!1;let q=Array.from(k.querySelectorAll(".fc-scroller")).map(m=>({el:m,top:m.scrollTop,left:m.scrollLeft}));if(A||k.dataset.urpppFcRendered!=="1"){try{h.fullCalendar("render")}catch{}k.dataset.urpppFcRendered="1"}else try{h.fullCalendar("updateSize")}catch{}return requestAnimationFrame(()=>{q.forEach(m=>{try{m.el.scrollTop=m.top,m.el.scrollLeft=m.left}catch{}})}),(k.getBoundingClientRect().height||0)>=300&&(k.dataset.urpppFcSized="1"),!0}catch(A){return console.warn("[URP++] fullCalendar refresh failed",A),!1}}function c(){window.__urpppFcRefreshBound||(window.__urpppFcRefreshBound=!0,setTimeout(()=>l({force:!0}),0),setTimeout(()=>l({force:!1}),300))}function d(C,A,x){let k=C.querySelector(".widget-header"),h=k?k.querySelector(".widget-toolbar"):null,v=document.createElement("div");v.className="urppp-card",v.innerHTML=`
      <div class="urppp-card-header">
        <h4>${x}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `,h&&(h.style.display="inline-block",v.querySelector(".urppp-card-tools").appendChild(h)),v.querySelector(".urppp-card-body").appendChild(C),A.appendChild(v)}function w(){try{o()}catch{}if(document.getElementById("urppp-dashboard"))return;let C=document.querySelector(".page-content");if(!C)return;let A=Array.from(C.querySelectorAll(".widget-box"));if(A.length<6)return;let x=A[4],k=x?Array.from(x.querySelectorAll(".infobox")):[],h=document.createElement("div");h.id="urppp-dashboard",h.innerHTML=`
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `,C.appendChild(h);let v=C.querySelector("#warningInfo");v&&document.body.appendChild(v),A.forEach(f=>{let S=f.closest('.widget-container-col, [class*="col-"]');S&&(S.style.display="none")}),C.querySelectorAll(":scope > .row").forEach(f=>{f.style.display="none"});let q=h.querySelector("#urppp-stats"),E=Math.max(k.length,5);for(let f=0;f<E;f++){let S=document.createElement("div");S.className="urppp-stat-card urppp-stat-skeleton",S.innerHTML='<div class="value">-</div><div class="label">加载中</div>',q.appendChild(S)}function m(){let f=x?Array.from(x.querySelectorAll(".infobox")):[];f.length!==0&&(q.innerHTML="",f.forEach(S=>{let L=S.innerText.trim().split(/\n+/).map(tt=>tt.trim()).filter(tt=>tt),$=L[0]||"",z=L.slice(1).join(" ").replace(/更多\.\.\./g,"").trim(),T=/[\u4e00-\u9fa5]/.test($)||$.length>5?"value urppp-stat-value-text":"value",O=S.closest("a"),W=document.createElement(O?"a":"div");O&&(W.href=O.href||"javascript:void(0)",W.onclick=O.onclick,W.style.textDecoration="none"),W.className="urppp-stat-card";let R=n.statCardPrivacyMarkup($,z);W.innerHTML=`<div class="${T}">${R.valueHtml}</div><div class="label">${R.labelHtml}</div>`,q.appendChild(W)}))}if(m(),x){let f=new MutationObserver(()=>m());f.observe(x,{childList:!0,subtree:!0}),setTimeout(()=>f.disconnect(),5e3)}let u=h.querySelector("#urppp-left"),y=h.querySelector("#urppp-right");d(A[5],u,"我的日程安排"),d(A[0],y,"通知公告"),d(A[1],y,"我的待办任务"),d(A[2],y,"可申请业务"),d(A[3],y,"常用下载"),x&&(x.style.display="none"),c(),console.log("[URP++] 首页仪表板已重构")}return{rebuildDashboard:w,refreshHomeFullCalendar:l,scheduleHomeFullCalendarRefresh:c,wrapWidget:d}}function gr(n){return Math.round((Number(n)||0)*100)/100}var nc=[{key:"a",level:"A",range:"90-100",gpa:4,min:90,max:100},{key:"am",level:"A-",range:"85-89",gpa:3.7,min:85,max:89.999},{key:"bp",level:"B+",range:"82-84",gpa:3.3,min:82,max:84.999},{key:"b",level:"B",range:"78-81",gpa:3,min:78,max:81.999},{key:"bm",level:"B-",range:"75-77",gpa:2.7,min:75,max:77.999},{key:"cp",level:"C+",range:"72-74",gpa:2.3,min:72,max:74.999},{key:"c",level:"C",range:"68-71",gpa:2,min:68,max:71.999},{key:"cm",level:"C-",range:"64-67",gpa:1.7,min:64,max:67.999},{key:"dp",level:"D+",range:"60-63",gpa:1.3,min:60,max:63.999},{key:"d",level:"D",range:"60-62",gpa:1,min:60,max:62.999},{key:"f",level:"F",range:"<60",gpa:0,min:0,max:59.999}],li={优秀:95,"A+":98,A:95,"A-":87,良好:85,"B+":83,B:79,"B-":76,中等:73,"C+":73,C:69,"C-":65,及格:62,"D+":62,D:60,不及格:50,F:50},pc=[{key:"required",label:"必修",test:n=>/必修/.test(n)},{key:"elective",label:"任选",test:n=>/任选/.test(n)},{key:"optional",label:"选修",test:n=>/选修/.test(n)},{key:"other",label:"其他",test:()=>!0}];function ci(n){let o=String(n||"").match(/^(\d{4})-(\d{4})-(\d+)/);return o?`${o[1].slice(2)}-${o[2].slice(2)}-${o[3]}`:String(n||"")}function Ze({deps:n}){let o=n.scoreToNumber,l=n.scoreToGpa;function c(m){let u=o(m);if(u!=null)return u;let y=String(m||"").trim().toUpperCase();return li[y]!=null?li[y]:null}function d(m){return!m||m.unevaluated?!1:c(m.score)!=null}function w(m){let u=String(m||"").match(/^(\d{4})-(\d{4})-(\d+)/);return u?[Number(u[1]),Number(u[3])]:[9999,9999]}function C(m){let u=m&&m.passing&&m.passing[0];return u&&u.courses||[]}function A(m){let u=m&&m.officialGpa,y=Number(u);return u!=null&&Number.isFinite(y)&&y>=0&&y<=5?y:null}function x(m){let u=A(m);return u??l(m.score)}function k({scorePack:m,profile:u}){let y=C(m),f=u&&u.majorGpa?String(u.majorGpa).trim():"",S=0,L=0,$=0,z=0,j=0,T=0;return y.forEach(O=>{if(!d(O))return;let W=Number(O.credit)||0,R=c(O.score);if(R==null||W<=0)return;S+=W,L+=R*W;let tt=x(O);tt!=null&&($+=tt*W,z+=W,O.required&&(j+=tt*W,T+=W))}),{majorGpa:f,requiredGpa:gr(T?j/T:0),avgGpa:gr(z?$/z:0),avgScore:gr(S?L/S:0),totalCredit:gr(S),courseCount:y.length}}function h(m){let u=new Map;return(m||[]).forEach(y=>{if(!d(y))return;let f=y.term||"未分组",S=u.get(f);S||(S={term:f,count:0,credit:0,scoreW:0,gpaW:0,gpaCredit:0},u.set(f,S));let L=Number(y.credit)||0,$=c(y.score);if($==null||(S.count+=1,L<=0))return;S.credit+=L,S.scoreW+=$*L;let z=x(y);z!=null&&(S.gpaW+=z*L,S.gpaCredit+=L)}),Array.from(u.values()).map(y=>({term:y.term,label:ci(y.term),count:y.count,credit:gr(y.credit),avgScore:gr(y.credit?y.scoreW/y.credit:0),avgGpa:gr(y.gpaCredit?y.gpaW/y.gpaCredit:0)})).sort((y,f)=>{let S=w(y.term),L=w(f.term);return S[0]-L[0]||S[1]-L[1]})}function v(m){let u=nc.map(f=>({...f,count:0,credit:0}));(m||[]).forEach(f=>{if(!d(f))return;let S=c(f.score);if(S==null)return;let L=u.find($=>S>=$.min&&S<=$.max);L&&(L.count+=1,L.credit+=Number(f.credit)||0)});let y=u.reduce((f,S)=>Math.max(f,S.count),1);return u.map(f=>({...f,ratio:Math.round(f.count/y*100)}))}function q(m){let u=pc.map(L=>({...L,credit:0,count:0}));(m||[]).forEach(L=>{if(!d(L))return;let $=String(L.attr||""),z=u.find(j=>j.test($));z&&(z.credit+=Number(L.credit)||0,z.count+=1)});let y=u.reduce((L,$)=>L+$.credit,0)||1,f=u.filter(L=>L.count>0).map(L=>({key:L.key,label:L.label,credit:gr(L.credit),count:L.count,ratio:Math.round(L.credit/y*100)})),S=f.find(L=>L.key==="required");return{items:f,requiredCredit:S?S.credit:0,requiredRatio:S?S.ratio:0}}function E({scorePack:m,profile:u}){let y=C(m);return{metrics:k({scorePack:m,profile:u}),trend:h(y),bands:v(y),share:q(y),empty:y.length===0}}return{analyzeScores:E,hasScore:d,officialGpa:A,scoreToNumberWithLevels:c,shortTerm:ci}}var er="var(--text-secondary)",so="var(--border)";function ar(n){return it(String(n??""))}function di(n,o,l){let c=!!(n&&n.variant==="mobile");if(o==="trend"){if(!c)return{mobile:c,width:920,height:330,pad:{top:36,right:30,bottom:46,left:30}};let C={top:58,right:20,bottom:44,left:20},A=Math.max(56,Number(n&&n.slotWidth)||72);return{mobile:c,width:Math.max(300,C.left+C.right+Math.max(1,l)*A),height:286,pad:C}}if(!c)return{mobile:c,width:660,height:236,pad:{top:28,right:14,bottom:44,left:14}};let d={top:28,right:14,bottom:44,left:14},w=Math.max(44,Number(n&&n.slotWidth)||48);return{mobile:c,width:Math.max(320,d.left+d.right+Math.max(1,l)*w),height:236,pad:d}}function io({width:n,height:o,mobile:l,kind:c,label:d}){let w=l?` data-urppp-chart-layout="mobile" style="width:max(100%,${n}px);max-width:none;height:auto"`:"";return`<svg viewBox="0 0 ${n} ${o}" class="urppp-sa-chart" role="img" aria-label="${d}" data-urppp-chart-kind="${c}"${w}>`}function ta({trend:n,palette:o,layout:l}){let c=(n||[]).filter(rt=>rt&&rt.avgScore!=null),d=di(l,"trend",c.length),{width:w,height:C,pad:A,mobile:x}=d,k=w-A.left-A.right,h=C-A.top-A.bottom;if(!c.length)return`${io({...d,kind:"trend",label:"学期成绩趋势"})}</svg>`;let v=c.length,q=rt=>A.left+(rt+.5)*(k/v),E=c.map(rt=>Number(rt.avgGpa)||0),m=c.map(rt=>Number(rt.avgScore)||0),u=c.map(rt=>Number(rt.credit)||0),y=Math.max(0,Math.min(...E)-.2),f=Math.min(5,Math.max(...E)+.2),S=Math.max(0,Math.min(...m)-4),L=Math.min(100,Math.max(...m)+4),$=Math.max(1,...u),z=f-y||1,j=L-S||1,T=rt=>A.top+h-(rt-y)/z*h,O=rt=>A.top+h-(rt-S)/j*h,W=rt=>A.top+h-rt/$*h*.9,R=c.map((rt,pt)=>`${q(pt)},${T(rt.avgGpa)}`).join(" "),tt=c.map((rt,pt)=>`${q(pt)},${O(rt.avgScore)}`).join(" "),nt=[0,.25,.5,.75,1].map(rt=>{let pt=A.top+h-rt*h;return`<line x1="${A.left}" y1="${pt.toFixed(1)}" x2="${w-A.right}" y2="${pt.toFixed(1)}" stroke="${so}" stroke-width="1" stroke-dasharray="3 4"/>`}).join(""),ut=c.map((rt,pt)=>{let gt=q(pt),K=x?Math.min(30,k/v*.42):Math.min(26,k/v*.32),ct=W(rt.credit);return`<rect x="${(gt-K/2).toFixed(1)}" y="${ct.toFixed(1)}" width="${K.toFixed(1)}" height="${(A.top+h-ct).toFixed(1)}" rx="3" fill="${o.credit}" opacity="0.55"/>
<text x="${gt.toFixed(1)}" y="${(ct-4).toFixed(1)}" text-anchor="middle" font-size="12" fill="${er}">${ar(rt.credit)}</text>`}).join(""),J=c.map((rt,pt)=>`<text x="${q(pt).toFixed(1)}" y="${C-16}" text-anchor="middle" font-size="12" fill="${er}">${ar(rt.label)}</text>`).join(""),Y=c.map((rt,pt)=>{let gt=k/v,K=q(pt)-gt/2,ct=[`学期 ${rt.label}`,`课程 ${rt.count} 门`,`修读学分 ${rt.credit}`,`加权均分 ${rt.avgScore}`,`平均绩点 ${rt.avgGpa}`].join(`
`);return`<rect class="urppp-sa-hover" x="${K.toFixed(1)}" y="${A.top}" width="${gt.toFixed(1)}" height="${h.toFixed(1)}" fill="transparent"><title>${ar(ct)}</title></rect>`}).join(""),et=c.map((rt,pt)=>`<circle cx="${q(pt).toFixed(1)}" cy="${T(rt.avgGpa).toFixed(1)}" r="3.5" fill="${o.gpaLine}"/><text x="${q(pt).toFixed(1)}" y="${(T(rt.avgGpa)-9).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${o.gpaLine}">${ar(rt.avgGpa)}</text>`).join(""),Q=c.map((rt,pt)=>`<circle cx="${q(pt).toFixed(1)}" cy="${O(rt.avgScore).toFixed(1)}" r="3" fill="${o.scoreLine}"/><text x="${q(pt).toFixed(1)}" y="${(O(rt.avgScore)+17).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="${o.scoreLine}">${ar(rt.avgScore)}</text>`).join(""),lt=x?`<g font-size="12">
  <rect x="${A.left}" y="30" width="12" height="12" rx="3" fill="${o.gpaLine}"/><text x="${A.left+18}" y="40" fill="${er}">学期平均绩点</text>
  <rect x="${A.left+132}" y="30" width="12" height="12" rx="3" fill="${o.scoreLine}"/><text x="${A.left+150}" y="40" fill="${er}">加权均分</text>
</g>`:`<g font-size="12">
  <rect x="${w-A.right-176}" y="8" width="12" height="12" rx="3" fill="${o.gpaLine}"/><text x="${w-A.right-158}" y="18" fill="${er}">学期平均绩点</text>
  <rect x="${w-A.right-82}" y="8" width="12" height="12" rx="3" fill="${o.scoreLine}"/><text x="${w-A.right-64}" y="18" fill="${er}">加权均分</text>
</g>`;return`${io({...d,kind:"trend",label:"学期成绩趋势"})}
${nt}
${ut}
<g>${Y}</g>
<text x="${A.left}" y="18" font-size="12" fill="${er}">每学期修读学分（柱）</text>
<g stroke="${o.gpaLine}" stroke-width="2.2" fill="none"><polyline points="${R}"/></g>
<g stroke="${o.scoreLine}" stroke-width="1.8" stroke-dasharray="5 4" fill="none"><polyline points="${tt}"/></g>
<g>${et}</g>
<g>${Q}</g>
<g>${J}</g>
${lt}
</svg>`}function ra({bands:n,palette:o,layout:l}){let c=n||[],d=di(l,"bands",c.length),{width:w,height:C,pad:A,mobile:x}=d,k=w-A.left-A.right,h=C-A.top-A.bottom,v=c.length||1,q=Math.max(1,...c.map(u=>u.count)),E=x?Math.min(32,k/v*.62):Math.min(40,k/v*.52),m=c.map((u,y)=>{let f=A.left+(y+.5)*(k/v),S=u.count?Math.max(8,u.count/q*h):0,L=A.top+h-S,$=(.4+(1-y/(v-1))*.6).toFixed(2),z=u.range||(u.min===0?"<60":`${u.min}-${u.max===100?"100":u.max}`),j=[`${u.level||""}（绩点 ${u.gpa}）`,`百分制 ${z}`,`课程 ${u.count} 门`].join(`
`);return`<rect class="urppp-sa-band" x="${(f-E/2).toFixed(1)}" y="${L.toFixed(1)}" width="${E.toFixed(1)}" height="${S.toFixed(1)}" rx="4" fill="${o.primary}" opacity="${$}"><title>${ar(j)}</title></rect>
<text x="${f.toFixed(1)}" y="${(L-6).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)">${ar(u.count)}</text>
<text x="${f.toFixed(1)}" y="${C-26}" text-anchor="middle" font-size="11" font-weight="600" fill="${er}">${ar(z)}</text>
<text x="${f.toFixed(1)}" y="${C-12}" text-anchor="middle" font-size="12" fill="${er}">${ar(u.gpa)}</text>`}).join("");return`${io({...d,kind:"bands",label:"成绩分段分布"})}
<line x1="${A.left}" y1="${(A.top+h).toFixed(1)}" x2="${w-A.right}" y2="${(A.top+h).toFixed(1)}" stroke="${so}" stroke-width="1"/>
${m}
</svg>`}function ui({items:n,requiredRatio:o,palette:l}){let A=2*Math.PI*56,x=(n||[]).filter(q=>q&&q.ratio>0),k=Math.max(0,Math.min(100,Math.round(Number(o)||0)));if(!x.length)return'<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成"></svg>';let h=-90,v=x.map(q=>{let E=q.ratio/100*A,u=`<circle cx="75" cy="75" r="56" fill="none" stroke="${l.share&&l.share[q.key]||l.required}" stroke-width="24"
  stroke-dasharray="${E.toFixed(2)} ${A.toFixed(2)}"
  stroke-linecap="butt" transform="rotate(${h.toFixed(2)} 75 75)"/>`;return h+=q.ratio/100*360,u}).join("");return`<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成">
<circle cx="75" cy="75" r="56" fill="none" stroke="${so}" stroke-width="24"/>
${v}
<text x="75" y="69" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${ar(k)}%</text>
<text x="75" y="91" text-anchor="middle" font-size="11.5" fill="${er}">必修学分占比</text>
</svg>`}var ic=Object.freeze({gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)",share:Object.freeze({required:"var(--primary)",elective:"var(--text-muted)",optional:"var(--text-secondary)",other:"var(--border)"})}),sc='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>',lc='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';function mi({deps:n}){let o=n&&n.palette||ic;function l(){return`<div id="urppp-score-analysis" class="urppp-sa" data-urppp-sa-state="collapsed">
  <button type="button" class="urppp-sa-toggle" aria-expanded="false">
    <span class="urppp-sa-icon">${sc}</span>
    <span class="urppp-sa-title">成绩分析</span>
    <span class="urppp-sa-summary" data-urppp-sa-summary>点击展开，查看成绩指标与学期变化</span>
    <span class="urppp-sa-chevron">${lc}</span>
  </button>
  <div class="urppp-sa-body" data-urppp-sa-body hidden>
    <div class="urppp-sa-content" data-urppp-sa-content></div>
  </div>
</div>`}function c(){return'<div class="urppp-sa-loading"><span class="urppp-sa-spinner"></span><span>正在计算成绩分析…</span></div>'}function d(k){return`<div class="urppp-sa-error">${it(String(k||"成绩数据加载失败"))}
  <button type="button" class="urppp-sa-retry" data-urppp-sa-retry>重试</button></div>`}function w(k){return[{label:"主修必修绩点",value:k.requiredGpa>0?String(k.requiredGpa):"—",hint:"必修课程加权"},{label:"平均绩点",value:k.avgGpa!=null?String(k.avgGpa):"—",hint:"全部及格加权"},{label:"加权均分",value:k.avgScore!=null?String(k.avgScore):"—",hint:"学分加权"},{label:"已修学分",value:k.totalCredit!=null?String(k.totalCredit):"—",hint:"及格课程学分"},{label:"已修课程",value:String(k.courseCount||0),hint:"含未评估"}].map(v=>`<div class="urppp-sa-metric">
  <div class="urppp-sa-metric-value">${it(v.value)}</div>
  <div class="urppp-sa-metric-label">${it(v.label)}</div>
  <div class="urppp-sa-metric-hint">${it(v.hint)}</div>
</div>`).join("")}function C(k){return`<table class="urppp-sa-table">
<thead><tr><th>学期</th><th>课程</th><th>学分</th><th>加权均分</th><th>平均绩点</th></tr></thead>
<tbody>${(k||[]).map(v=>`<tr><td>${it(v.label)}</td><td>${it(v.count)}</td><td>${it(v.credit)}</td><td>${it(v.avgScore)}</td><td>${it(v.avgGpa)}</td></tr>`).join("")}</tbody></table>`}function A(k){return(k||[]).map(h=>`<div class="urppp-sa-legend-item"><i class="urppp-sa-legend-dot" style="background:${o.share&&o.share[h.key]||o.primary}"></i>${it(h.label)} ${it(h.credit)} 学分 · ${it(h.count)} 门</div>`).join("")}function x(k,h={}){if(!k||k.empty)return'<div class="urppp-sa-empty">暂无可用成绩数据，请先在教务系统查询成绩后再试。</div>';let v=k.share||{items:[],requiredRatio:0},q=h.chartLayout||null;return`<div class="urppp-sa-metrics">${w(k.metrics)}</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-trend">
    <h5 class="urppp-sa-card-title">学期趋势</h5>
    <div class="urppp-sa-chart-scroll">${ta({trend:k.trend,palette:o,layout:q})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-share">
    <h5 class="urppp-sa-card-title">课程类型构成</h5>
    <div class="urppp-sa-share-body">
      <div class="urppp-sa-donut">${ui({items:v.items,requiredRatio:v.requiredRatio,palette:o})}</div>
      <div class="urppp-sa-legend">${A(v.items)}</div>
    </div>
  </section>
</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-bands">
    <h5 class="urppp-sa-card-title">成绩分段分布</h5>
    <div class="urppp-sa-chart-scroll">${ra({bands:k.bands,palette:o,layout:q})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-detail">
    <h5 class="urppp-sa-card-title">各学期明细</h5>
    ${C(k.trend)}
  </section>
</div>`}return{panelShellHtml:l,loadingHtml:c,errorHtml:d,analysisHtml:x,palette:o}}function bi(){function n(o,l){let c=o.querySelector(".urppp-sa-toggle"),d=o.querySelector("[data-urppp-sa-body]");if(!c||!d)return{isExpanded:()=>!1,setExpanded:()=>{},syncShareLayout:()=>{}};let w=A=>{let x=A?"expanded":"collapsed";o.dataset.urpppSaState=x,c.setAttribute("aria-expanded",String(A)),d.hidden=!A,A&&typeof l.onExpand=="function"&&l.onExpand()};c.addEventListener("click",()=>{let A=c.getAttribute("aria-expanded")==="true";w(!A)}),d.addEventListener("click",A=>{let x=A.target;x&&x.closest&&x.closest("[data-urppp-sa-retry]")&&typeof l.onRetry=="function"&&l.onRetry()});function C(){let A=o.querySelector(".urppp-sa-donut"),x=o.querySelector(".urppp-sa-legend"),k=!!(A&&x&&x.getBoundingClientRect().top>=A.getBoundingClientRect().bottom);o.classList.toggle("urppp-sa-share-stacked",k)}return{setExpanded:w,syncShareLayout:C,isExpanded:()=>c.getAttribute("aria-expanded")==="true"}}return{bindPanel:n}}var hi="urppp-score-analysis";function gi({deps:n}){let o=Ze({deps:n}),l=mi({deps:n}),c=bi(),d=null,w="idle",C=null,A=null,x=null,k=!1,h=0,v="desktop";function q(){if(!n.styles||document.getElementById("urppp-score-analysis-style"))return;let R=document.createElement("style");R.id="urppp-score-analysis-style",R.textContent=n.styles,(document.head||document.documentElement).appendChild(R)}function E(){if(typeof n.getInsertHost=="function"){let R=n.getInsertHost();if(R)return R}return document.querySelector(".page-content")||document.getElementById("page-content-template")||document.body}function m(){return d&&d.querySelector("[data-urppp-sa-content]")}function u(){return C||(w="loading",C=(async()=>{try{let[R,tt]=await Promise.all([n.loadScores(),n.loadProfile()]);if(R&&R.error)throw new Error(R.error);let nt=o.analyzeScores({scorePack:R,profile:tt});return A=nt,w="ready",nt}catch(R){throw w="error",R}finally{C=null}})(),C)}function y(){w==="idle"&&u().catch(()=>{})}function f(){if(x&&typeof x.syncShareLayout=="function")try{x.syncShareLayout()}catch{}}function S(){try{if(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches)return{variant:"mobile"}}catch{}return null}function L(){let R=m();if(!R||!A)return;let tt=S();v=tt?tt.variant:"desktop",R.innerHTML=l.analysisHtml(A,{chartLayout:tt}),f()}function $(){clearTimeout(h),h=setTimeout(()=>{if(f(),!A||!x||!x.isExpanded())return;let R=S();(R?R.variant:"desktop")!==v&&L()},120)}function z(){k||(k=!0,window.addEventListener("resize",$))}function j(){k&&(k=!1,clearTimeout(h),h=0,window.removeEventListener("resize",$))}async function T(){let R=m();if(R){if(w==="ready"&&A){L();return}R.innerHTML=l.loadingHtml();try{await u(),L()}catch(tt){R.innerHTML=l.errorHtml(tt&&tt.message||String(tt))}}}function O(){if(q(),d&&d.isConnected)return d;if(document.getElementById(hi))return document.getElementById(hi);let R=E();if(!R)return null;let tt=document.createElement("div");return tt.innerHTML=l.panelShellHtml(),d=tt.firstElementChild,R.insertBefore(d,R.firstChild),x=c.bindPanel(d,{onExpand:T,onRetry:T}),z(),y(),n.shouldAutoExpand&&n.shouldAutoExpand()&&(typeof requestAnimationFrame=="function"?requestAnimationFrame:ut=>setTimeout(ut,0))(()=>{try{x.setExpanded(!0)}catch{}}),d}function W(){j(),d&&d.isConnected&&d.remove(),d=null,x=null,w="idle",C=null,A=null,v="desktop"}return{mount:O,unmount:W,getPanel:()=>d,reset:W}}function fi({documentRef:n=document,locationRef:o=location,windowRef:l=window}){function c(k){return String(k||"").replace(/[\u00a0\s]+/g," ").replace(/^[>\u25b8\u203a·•\u00bb]+/,"").replace(/^\s*[\u25b8>]\s*/,"").trim()}function d(k){if(!k)return"";let h=k.querySelector(":scope > a");if(!h)return"";let v=h.querySelector(".menu-text, .urppp-nav-text");if(v)return c(v.textContent);let q=h.cloneNode(!0);return q.querySelectorAll("i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow").forEach(E=>E.remove()),c(q.textContent)}function w(k){let h=[],v=k,q=n.getElementById("menus")||n.getElementById("urppp-menus");for(;v&&v!==q;){if(v.tagName==="LI"){let E=d(v);E&&!/^(首页|一级菜单|二级菜单|三级菜单)$/.test(E)&&h.unshift(E)}v=v.parentElement}return h.filter((E,m)=>E&&E!==h[m-1])}function C(){let k=o.pathname.replace(/\/+$/,"")||"/",h=o.search||"",v=[];return[n.getElementById("menus"),n.getElementById("urppp-menus")].filter(Boolean).forEach(E=>{E.querySelectorAll("a[href]").forEach(m=>{let u=m.getAttribute("href")||"";if(!(!u||u==="#"||u.startsWith("javascript")))try{let y=new URL(u,o.origin),f=y.pathname.replace(/\/+$/,"")||"/";if(f==="/"&&k!=="/")return;let S=0;k===f?S=1e3+f.length:k.startsWith(f+"/")?S=500+f.length:k.includes(f)&&f.length>8&&(S=200+f.length),S&&h&&y.search&&h.indexOf(y.search.slice(1))>=0&&(S+=50),S>0&&v.push({score:S,li:m.closest("li")})}catch{}})}),v.sort((E,m)=>m.score-E.score),v.length?v[0].li:null}function A(){let k=C();if(k){let u=w(k);if(u.length)return u}let h="";try{let u=n.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);u&&(h=decodeURIComponent(u[1]))}catch{}if(h&&h!=="0"){let u=n.getElementById(h);if(u){let y=w(u);if(y.length)return y}}let v=null,q=Array.from(n.querySelectorAll("#menus li.active"));if(q.length){v=q[q.length-1];for(let u=q.length-1;u>=0;u--)if(!q[u].querySelector("li.active")){v=q[u];break}}if(!v){let u=Array.from(n.querySelectorAll("#urppp-menus .urppp-nav-item.active"));if(u.length){v=u[u.length-1];for(let y=u.length-1;y>=0;y--)if(!u[y].querySelector(".urppp-nav-item.active")){v=u[y];break}}}if(v){let u=w(v);if(u.length)return u}let E=n.getElementById("breadcrumbs")||n.querySelector(".breadcrumbs"),m=E&&(E.querySelector("ul.breadcrumb")||E.querySelector(".breadcrumb"));if(m){let u=[];if(Array.from(m.children).forEach((y,f)=>{if(f===0)return;let S=c(y.textContent);!S||/^(首页|一级菜单|二级菜单|三级菜单)$/.test(S)||u[u.length-1]!==S&&u.push(S)}),u.length)return u}return[]}function x(){let k=n.getElementById("breadcrumbs")||n.querySelector(".breadcrumbs");if(!k)return;k.classList.remove("hide"),k.style.removeProperty("display"),k.style.setProperty("display","flex","important");let h=k.querySelector("ul.breadcrumb")||k.querySelector(".breadcrumb");h||(h=n.createElement("ul"),h.className="breadcrumb",k.appendChild(h));let v=A();if(!v.length&&Array.from(h.children).map(u=>c(u.textContent)).filter(Boolean).some(u=>u!=="首页"&&!/^(一级菜单|二级菜单|三级菜单)$/.test(u)))return;h.innerHTML="";let q=n.createElement("li");q.style.cursor="pointer",q.innerHTML='<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>',q.addEventListener("click",()=>{l.location.href="/"}),h.appendChild(q),v.forEach((E,m)=>{let u=n.createElement("li");m===v.length-1&&u.classList.add("active");let y=n.createElement("span");y.className="urppp-bc-label",y.textContent=E,u.appendChild(y),h.appendChild(u)})}return{beautifyBreadcrumbs:x}}function xi({documentRef:n=document,windowRef:o=window,MutationObserverRef:l=MutationObserver,nodeTypeRef:c=Node}){function d(){try{let A=n.getElementById("sidebar"),x=n.querySelectorAll(".main-content");if(!x.length)return;let k=o.matchMedia&&o.matchMedia("(max-width: 991px)").matches,h="260px";k?h="0px":A&&(h=A.classList.contains("menu-min")?"50px":"260px"),x.forEach(v=>v.style.setProperty("margin-left",h,"important"))}catch{}}function w(){try{let A=n.getElementById("sidebar"),x=n.querySelector("#navbar, .navbar.navbar-default, .navbar-fixed-top");if(!A||!x||A.classList.contains("urppp-clean-sidebar"))return;let k=x.getBoundingClientRect(),h=Math.max(45,Math.round(k.height||x.offsetHeight||45));n.documentElement.style.setProperty("--urppp-navbar-height",h+"px"),A.style.setProperty("top",h+"px","important"),A.style.setProperty("height","calc(100vh - "+h+"px)","important"),A.style.setProperty("margin-top","0","important"),x.style.setProperty("z-index","1100","important"),A.style.setProperty("z-index","1030","important"),d()}catch{}}function C(){let A=n.getElementById("sidebar"),x=n.getElementById("menus");if(!A||!x)return;if(o.__urpppSidebarMenuObserver){try{o.__urpppSidebarMenuObserver.disconnect()}catch{}o.__urpppSidebarMenuObserver=null}let k=n.getElementById("urppp-menus"),h=A.querySelector(".urppp-sidebar-header");k&&k.remove(),h&&h.remove(),w();let v=new Set;x.querySelectorAll("li.active").forEach(T=>{T.id&&v.add(T.id)});function q(T){return Array.from(T.children).filter(O=>O.tagName==="LI").map(O=>{let W=O.querySelector(":scope > a"),R=W?.querySelector(".menu-text"),tt=R?R.textContent.trim():W?Array.from(W.childNodes).filter(pt=>pt.nodeType===c.TEXT_NODE).map(pt=>pt.textContent).join("").trim():"",nt=W?.querySelector(".menu-icon"),ut=nt?Array.from(nt.classList).filter(pt=>pt!=="menu-icon").join(" "):"",J=O.querySelector(":scope > .submenu"),Y=J?q(J):[];Y=Y.filter(pt=>pt.text&&(pt.text.trim()||pt.href&&pt.href!=="#"));let et=W?.getAttribute("href")||"#",Q=W?.getAttribute("target")||"",lt=O.getAttribute("onclick")||W?.getAttribute("onclick")||"",rt=O.id;return et!=="#"&&!et.startsWith("javascript")?{id:rt,text:tt,iconClass:ut,children:[],href:et,target:Q,onclick:lt}:Y.length===1&&Y[0].children.length===0?{id:rt||Y[0].id,text:tt,iconClass:ut||Y[0].iconClass,children:[],href:Y[0].href||et,target:Y[0].target||Q,onclick:Y[0].onclick||lt}:{id:rt,text:tt,iconClass:ut,children:Y,href:et,target:Q,onclick:lt}})}let E=q(x);x.style.display="none";let m=n.createElement("div");m.className="urppp-sidebar-header",m.style.cssText="position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)";let u=n.createElement("button");u.type="button",u.className="urppp-sidebar-toggle",u.innerHTML='<i class="fa fa-angle-left" aria-hidden="true"></i>',u.title="收起侧边栏",typeof u.setAttribute=="function"&&u.setAttribute("aria-label","收起侧边栏");let y=()=>!!(o.matchMedia&&o.matchMedia("(max-width: 991px)").matches),f=T=>{if(T&&(T.preventDefault(),T.stopPropagation()),y()){A.classList.remove("display"),d();return}let O=n.getElementById("sidebar-collapse");O&&O.click()};u.addEventListener("click",f),m.appendChild(u);let S=()=>{let T=y(),O=n.body.classList.contains("menu-min")||A.classList.contains("menu-min"),W=T?"关闭菜单":O?"展开侧边栏":"收起侧边栏";u.innerHTML=T?'<i class="fa fa-times" aria-hidden="true"></i>':O?'<i class="fa fa-angle-right" aria-hidden="true"></i>':'<i class="fa fa-angle-left" aria-hidden="true"></i>',u.title=W,typeof u.setAttribute=="function"&&u.setAttribute("aria-label",W),!T&&O?(m.style.justifyContent="center",m.style.padding="12px 0"):(m.style.justifyContent="flex-end",m.style.padding="")},L=new l(S);L.observe(n.body,{attributes:!0,attributeFilter:["class"]}),L.observe(A,{attributes:!0,attributeFilter:["class"]}),o.__urpppSidebarMenuObserver=L,S();let $=n.createElement("ul");$.id="urppp-menus",$.style.cssText="margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)";function z(T){n.querySelectorAll("#urppp-menus .urppp-nav-item").forEach(W=>W.classList.remove("active"));let O=T;for(;O&&O.id!=="urppp-menus";)O.classList.contains("urppp-nav-item")&&O.classList.add("active"),O=O.parentElement}function j(T,O){let W=n.createElement("li");W.className="urppp-nav-item",T.id&&(W.id=T.id);let R=T.children.length>0,tt=T.href||"#",nt=tt!=="#"&&!tt.startsWith("javascript"),ut=n.createElement("a");if(ut.className="urppp-nav-link",ut.href=nt?tt:"javascript:void(0)",T.target&&ut.setAttribute("target",T.target),T.iconClass){let Y=n.createElement("i");T.iconClass.split(" ").forEach(et=>{et&&Y.classList.add(et)}),ut.appendChild(Y)}let J=n.createElement("span");if(J.className="urppp-nav-text",J.textContent=T.text,J.title=T.text,ut.appendChild(J),R){let Y=n.createElement("i");Y.className="urppp-nav-arrow fa fa-angle-down",Y.addEventListener("click",et=>{et.preventDefault(),et.stopPropagation(),W.classList.toggle("open")}),ut.appendChild(Y)}if(W.appendChild(ut),ut.addEventListener("click",Y=>{if(z(W),!nt&&R)Y.preventDefault(),W.classList.toggle("open");else if(nt)return}),R){let Y=n.createElement("ul");Y.className="urppp-nav-submenu",T.children.forEach(et=>j(et,Y)),W.appendChild(Y)}T.id&&v.has(T.id)&&W.classList.add("active"),O.appendChild(W)}E.forEach(T=>j(T,$)),$.querySelectorAll(".urppp-nav-item.open").forEach(T=>T.classList.remove("open")),A.insertBefore(m,A.firstChild),A.appendChild($)}return{rebuildSidebarCompletely:C,syncMobileContentOffset:d,syncSidebarUnderNavbar:w}}function yi({theme:n,settings:o,documentRef:l=document,windowRef:c=window}){function d(k){if(!k)return;let h=n.getSkin(),v=n.skinSupportsFixedPalettes(h),q=n.getCurrent(),E=v?n.getBrutalActivePalette():null,m=v?n.getBrutalSelectedPalette():null;k.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(u=>{let y=u.dataset.theme,f=y==="dark",S=y==="scu-red",L=f&&!n.skinSupportsDark(h)||S&&!n.skinSupportsDynamic(h)&&!v,$=y===q;if(v&&($=y==="default"&&E.id===n.BRUTAL_DEFAULT_PALETTE||S&&E.id!==n.BRUTAL_DEFAULT_PALETTE),u.disabled=L,u.classList.toggle("urppp-theme-disabled",L),u.classList.toggle("ac",$&&!L),u.setAttribute("aria-disabled",L?"true":"false"),y==="default")u.style.background=v?n.getBrutalPaletteById(n.BRUTAL_DEFAULT_PALETTE).accent:"#F1F3F5",u.title=v?"默认高能粉":"简约白";else if(f)u.style.background=L?"#A7A7A7":"#0B0F14",u.title=L?"当前界面风格不支持暗色模式":"深邃暗";else if(S)if(L)u.style.background="#A7A7A7",u.title="当前界面风格不支持动态配色";else if(v)u.style.background=m.accent,u.title="高对比配色："+m.name;else{let z=n.getAccent()||n.DEFAULT_SEED;try{let j=n.buildSchemePreview(z,n.getScheme());u.style.background="linear-gradient(135deg, "+j.primary+" 0 55%, "+j.surface+" 55% 100%)"}catch{u.style.background=z}u.title="动态配色"}})}function w(k){let h=n.getSkin();if(n.skinSupportsFixedPalettes(h)){if(k==="dark")return;n.getCurrent()!=="default"&&n.applyTheme("default",{manual:!0}),k==="default"&&n.setBrutalPalette(n.BRUTAL_DEFAULT_PALETTE),k==="scu-red"&&n.setBrutalPalette(n.getBrutalSelectedPalette().id);return}n.isThemeModeAvailable(k,h)&&n.applyTheme(k,{manual:!0})}function C(){d(l.getElementById("urppp-nav-theme"))}function A(){try{let k=l.getElementById("navbar")||l.querySelector(".navbar");if(!k)return;if(l.getElementById("urppp-nav-theme")){C();return}let h=k.querySelector(".navbar-header .navbar-brand")||k.querySelector(".navbar-brand")||k.querySelector(".navbar-header");if(!h)return;let v=l.createElement("div");v.id="urppp-nav-theme",v.innerHTML=['<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>','<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>','<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>','<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">','  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">','    <circle cx="12" cy="12" r="3"></circle>','    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',"  </svg>","</button>"].join(""),h.parentElement?(h.parentElement.style.setProperty("display","flex","important"),h.parentElement.style.setProperty("align-items","center","important"),h.nextSibling?h.parentElement.insertBefore(v,h.nextSibling):h.parentElement.appendChild(v)):h.appendChild(v),v.style.setProperty("display","inline-flex","important"),v.style.setProperty("align-items","center","important"),v.style.setProperty("height","36px","important"),v.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(q=>{q.addEventListener("click",()=>{w(q.dataset.theme),C();try{o.syncSettingsPanelUI()}catch{}})}),v.querySelector("#urppp-nav-settings").addEventListener("click",q=>{q.preventDefault(),q.stopPropagation(),o.openSettingsPanel()}),o.ensureSettingsPanel(),C();try{c.__urpppCleanMode&&c.__urpppCleanMode.inject()}catch{}}catch(k){console.warn("[URP++] navbar theme switch inject failed",k)}}function x(){let h=l.getElementById("navbar")?.querySelector(".ace-nav");try{A()}catch{}if(!h)return;function v(S,L){Object.entries(L).forEach(([$,z])=>S.style.setProperty($,z,"important"))}Array.from(h.childNodes).forEach(S=>{S.nodeType===Node.TEXT_NODE&&!S.textContent.trim()&&S.remove()}),h.querySelectorAll(":scope > li").forEach(S=>{v(S,{display:"inline-flex","align-items":"center","vertical-align":"middle",margin:"0",padding:"0","text-align":"left"})}),h.querySelectorAll(":scope > li > a").forEach(S=>{v(S,{display:"inline-flex","align-items":"center","justify-content":"center",height:"36px",padding:"0 4px","flex-wrap":"nowrap","vertical-align":"middle","text-decoration":"none"}),S.style.lineHeight="1"}),h.querySelectorAll(":scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa").forEach(S=>{v(S,{top:"auto","vertical-align":"middle","line-height":"1","margin-top":"0"})});let q=h.querySelector(':scope > li > a[href*="customerServiceCenter"]');q&&(v(q,{width:"28px","justify-content":"center"}),q.style.padding="0 4px");let E=l.getElementById("clickdiv"),m=l.getElementById("form-search"),u=l.getElementById("search-input"),y=l.getElementById("intellegenceUDiv");if(y&&(y.style.setProperty("position","relative","important"),y.style.setProperty("z-index","30","important"),y.style.setProperty("display","inline-flex","important"),y.style.setProperty("align-items","center","important"),y.style.setProperty("justify-content","center","important"),y.style.setProperty("width","32px","important"),y.style.setProperty("height","36px","important"),y.style.setProperty("vertical-align","middle","important"),y.style.setProperty("margin","0","important"),y.style.setProperty("padding","0","important")),E&&m){E.removeAttribute("onclick"),v(E,{"background-color":"transparent",position:"relative",display:"inline-flex","align-items":"center","justify-content":"center",width:"32px",height:"32px","border-radius":"8px","line-height":"1","z-index":"30"});let S=l.getElementById("clicki");S&&v(S,{color:"var(--text-secondary)","margin-top":"0"}),E.__urpppNavbarClickBound||(E.__urpppNavbarClickBound=!0,E.addEventListener("mouseenter",()=>E.style.setProperty("background-color","var(--input-bg)","important")),E.addEventListener("mouseleave",()=>E.style.setProperty("background-color","transparent","important")),E.addEventListener("click",z=>{z.preventDefault(),z.stopPropagation(),m.dataset.open==="1"?(m.style.width="0px",m.style.opacity="0",m.dataset.open="0"):(m.style.width="180px",m.style.opacity="1",m.dataset.open="1",u&&setTimeout(()=>u.focus(),50))})),c.__urpppNavbarOutsideClickBound||(c.__urpppNavbarOutsideClickBound=!0,l.addEventListener("click",z=>{let j=l.getElementById("clickdiv"),T=l.getElementById("form-search");!j||!T||T.dataset.open!=="1"||!j.contains(z.target)&&!T.contains(z.target)&&(T.style.width="0px",T.style.opacity="0",T.dataset.open="0")})),v(m,{position:"absolute",right:"34px",top:"50%",transform:"translateY(-50%)",left:"auto",margin:"0","z-index":"10",background:"transparent",border:"none","box-shadow":"none",overflow:"hidden",padding:"0",transition:"width .2s ease, opacity .2s ease"});let L=m.dataset.open==="1"?"160px":"0px";m.style.width!==L&&(m.style.width=L,m.style.opacity=m.dataset.open==="1"?"1":"0"),u&&v(u,{"background-color":"var(--input-bg)",border:"1px solid var(--border)",color:"var(--text)","border-radius":"8px",height:"32px",padding:"0 12px","line-height":"32px",width:"100%"});let $=m.querySelector(".input-icon > .ace-icon.fa-search");$&&($.style.display="none")}let f=h.querySelector(":scope > li.light-blue > a");if(f){v(f,{display:"inline-flex","align-items":"center",gap:"6px"});let S=f.querySelector(".user-info");S&&(v(S,{display:"inline-flex","align-items":"center",gap:"4px","max-width":"none","white-space":"nowrap","vertical-align":"middle","line-height":"1","margin-top":"-12px"}),Array.from(S.childNodes).forEach($=>{$.nodeType===Node.TEXT_NODE&&($.textContent=$.textContent.replace(/\s+/g,"").trim())}),Array.from(S.children).forEach($=>{v($,{display:"inline","white-space":"nowrap","vertical-align":"middle","line-height":"1",margin:"0",padding:"0"}),$.tagName==="SMALL"&&$.style.setProperty("font-size","inherit","important")}));let L=f.querySelector(".nav-user-photo");L&&(L.alt=(L.alt||"").replace(/\s+/g,"").trim(),v(L,{"vertical-align":"middle",display:"inline-block",width:"30px",height:"30px"}))}}return{handleThemeDotClick:w,injectNavbarThemeSwitch:A,rebuildNavbar:x,syncNavbarThemeUI:C,syncThemeDotGroup:d}}(function(){"use strict";try{let t=typeof navigator<"u"&&navigator.userAgent||"";if(/Android|iPhone|iPad|iPod|Mobile/i.test(t)){document.documentElement&&document.documentElement.classList.add("urppp-mobile");let r=document.querySelector('meta[name="viewport"]');r||(r=document.createElement("meta"),r.name="viewport",r.content="width=device-width, initial-scale=1",(document.head||document.documentElement||document).appendChild(r))}}catch{}let n="1.9.4";if(/^id\./i.test(String(location.hostname||""))){try{let t=Xa({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:n},uiDeps:{openSubpanel:()=>{}}}),r=()=>{try{t.bootFromCache("assist")}catch{}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r()}catch{}return}let o={mainRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js",assistRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",changelogPage:"https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md",greasySearch:"https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B",versionJson:"version.json",sourceUrls:t=>[`https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`,`https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/${t}`,`https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`]},l="urppp_auto_update_check_v1",c="urppp_skin_v1",d=[{id:"apple",name:"类Apple风格",desc:"系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。",ready:!0,dark:!0,dynamic:!0,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"editorial",name:"编辑杂志",desc:"衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"flat",name:"极简扁平",desc:"无阴影、硬边与纯色层次，冷硬清晰。",ready:!0,dark:!0,dynamic:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"organic",name:"自然有机",desc:"奶油底与大地色，温暖圆角。不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"brutal",name:"新野兽派",desc:"高对比画布、粗边框与硬阴影。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,palettes:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"neu",name:"新拟物",desc:"同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}}],w=GM_addStyle(`
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
  `);w&&(w.id="urppp-early-style");let C=`
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
  `;function A(t){let r=document.createElement("div");return r.className="urppp-inline-loader",r.innerHTML=C+(t?`<div>${t}</div>`:""),r}function x(t){return!t||!t.closest?!1:!!t.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]')}function k(t){try{(t&&t.querySelectorAll?t:document).querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach(e=>{e.querySelectorAll(".urppp-inline-loader").forEach(a=>{try{a.remove()}catch{}}),e.classList.remove("urppp-loading-active")})}catch{}}function h(t){try{let r=t&&t.querySelectorAll?t:document;k(r),r.querySelectorAll("img").forEach(e=>{try{if(!e||e.dataset.urpppReplaced==="1"||x(e))return;let a=(e.getAttribute("src")||e.src||"").toLowerCase();if(!a||!(a.includes("pageloading")||a.includes("page-loading")||a.includes("loading.gif")||a.includes("loading-0")||a.includes("loading-1"))||a.includes("/loading")&&!a.includes("pageloading")&&!a.includes("loading.gif")&&!a.includes("loading-0"))return;e.dataset.urpppReplaced="1";let i=A("");i.style.minHeight="0",i.style.padding="0",e.parentElement&&e.parentElement.replaceChild(i,e)}catch{}}),r.querySelectorAll(".layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content").forEach(e=>{try{if(!e||e.dataset.urpppReplaced==="1")return;if(e.dataset.urpppReplaced="1",e.style.setProperty("background","transparent","important"),e.style.setProperty("background-image","none","important"),!e.querySelector(".urppp-inline-loader")){let a=A("");a.style.minHeight="0",a.style.padding="0",e.appendChild(a)}}catch{}})}catch{}}if(!window.__urpppLoaderObs){window.__urpppLoaderObs=!0;let t=!1,r=()=>{if(!t){t=!0;try{h(document)}catch{}t=!1}};document.body&&setTimeout(r,0),document.addEventListener("DOMContentLoaded",()=>setTimeout(r,0),{once:!0});let e=()=>{new MutationObserver(()=>{clearTimeout(window.__urpppLoaderTimer),window.__urpppLoaderTimer=setTimeout(r,200)}).observe(document.documentElement,{childList:!0,subtree:!0})};document.body?e():document.addEventListener("DOMContentLoaded",e,{once:!0})}let v="urppp_theme_v3",q="urppp_accent_v1",E="urppp_accent_presets_v1",m="urppp_scheme_v1",u="urppp_theme_follow_system_v1",y="urppp_clean_default_v1",f="urppp_clean_analysis_v1",S="urppp_apple_edge_line_v1",L="urppp_follow_use_dynamic_v1",$="urppp_brutal_palette_v1",z="urppp_brutal_active_palette_v1",j="urppp_privacy_v1",T="urppp_custom_identity_v1",O="urppp_schedule_first_monday_v1",W="urppp_schedule_json_format_v1",R={completedCourses:"已修课程",failedCourses:"未及格课程",majorGpa:"主修绩点",majorPlan:"主修方案",remainingCourses:"待修课程",passingTotalCredit:"全部及格总学分",passingAvgScore:"全部及格平均成绩",passingAvgGpa:"全部及格平均绩点",passingRequiredCredit:"全部及格必修学分",passingRequiredAvg:"全部及格必修平均",passingRequiredGpa:"全部及格必修绩点",schemeTotalCredit:"方案总学分",schemeAvgScore:"方案平均成绩",schemeAvgGpa:"方案平均绩点",schemeRequiredCredit:"方案必修学分",schemeRequiredAvg:"方案必修平均",schemeRequiredGpa:"方案必修绩点"},tt="",nt=["#1E3A5F","#B53434","#0F766E","#7C3AED","#C2410C","#0369A1","#BE185D","#365314"],ut="#B53434",J="pink",Y=[{id:"pink",name:"高能粉",desc:"默认配色，热粉强调与酸性绿辅助",accent:"#FF006E",secondary:"#CCFF00",info:"#00D9FF",warning:"#FF9500"},{id:"acid",name:"酸性绿",desc:"酸性绿强调与热粉辅助",accent:"#CCFF00",secondary:"#FF006E",info:"#00D9FF",warning:"#FF9500"},{id:"cyan",name:"电子蓝",desc:"电子蓝强调与亮橙辅助",accent:"#00D9FF",secondary:"#FF9500",info:"#CCFF00",warning:"#FF006E"},{id:"orange",name:"亮橙",desc:"亮橙强调与电子蓝辅助",accent:"#FF9500",secondary:"#00D9FF",info:"#CCFF00",warning:"#FF006E"}],et="tonal",Q=[{id:"paper",name:"纯白卡片",desc:"卡片保持白，仅强调色跟种子"},{id:"tonal",name:"色调点缀",desc:"背景轻染，卡片带同色相浅底"},{id:"soft",name:"柔和粉彩",desc:"卡片明显粉彩/浅色，低对比"},{id:"vibrant",name:"鲜艳",desc:"背景与卡片都更有色，主色更饱和"},{id:"expressive",name:"表现力",desc:"双色拼色：卡片跟主色，背景走协调次色"}],{handleThemeDotClick:lt,injectNavbarThemeSwitch:rt,rebuildNavbar:pt,syncNavbarThemeUI:gt,syncThemeDotGroup:K}=yi({theme:{BRUTAL_DEFAULT_PALETTE:J,DEFAULT_SEED:ut,applyTheme:Wt,buildSchemePreview:Qt,getAccent:Vt,getBrutalActivePalette:go,getBrutalPaletteById:re,getBrutalSelectedPalette:ho,getCurrent:Yt,getScheme:zr,getSkin:or,isThemeModeAvailable:te,setBrutalPalette:fo,skinSupportsDark:Tr,skinSupportsDynamic:Mr,skinSupportsFixedPalettes:bo},settings:{ensureSettingsPanel:Uo,openSettingsPanel:Oo,syncSettingsPanelUI:Rt}});function ct(){try{if(!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches))return;let r=document.getElementById("navbar"),e=r?.querySelector(".ace-nav");if(!r||!e)return;let a=document.getElementById("intellegenceUDiv"),i=document.getElementById("clickdiv"),p=document.getElementById("form-search");if(!a){let F=document.createElement("li");F.className="green urppp-search-item",a=document.createElement("div"),a.id="intellegenceUDiv",F.appendChild(a),e.appendChild(F)}let s=a.closest("li")||a.parentElement,g=Array.from(e.children).find(F=>{let H=F.querySelector(":scope > a");if(!H)return!1;let N=H.getAttribute("href")||"",X=(H.getAttribute("title")||"")+" "+(H.textContent||"");return N.includes("customerServiceCenter")||/help|service|support/i.test(N)||!!H.querySelector(".glyphicon-headphones, .fa-headphones, .fa-question-circle, .fa-life-ring")||/帮助|客服|服务|帮助中心/i.test(X)}),b=Array.from(e.children).find(F=>F.classList.contains("light-blue")),_=g||b||null;_&&s&&_!==s&&((s.compareDocumentPosition(_)&Node.DOCUMENT_POSITION_FOLLOWING)!==0||e.insertBefore(s,_)),s&&!s.classList.contains("urppp-search-item")&&s.classList.add("urppp-search-item");let M=s;i?(i.removeAttribute("onclick"),i.setAttribute("role","button"),i.setAttribute("aria-label","搜索功能")):(i=document.createElement("button"),i.type="button",i.id="clickdiv",i.setAttribute("aria-label","搜索功能"),i.innerHTML='<i class="fa fa-search" id="clicki" aria-hidden="true"></i>',a.appendChild(i)),i.style.setProperty("left","8px","important"),i.style.setProperty("position","relative","important"),i.style.setProperty("z-index","31","important"),p||(p=document.createElement("div"),p.id="form-search",p.className="nav-search",p.innerHTML='<form class="form-search"><span class="input-icon"><input type="text" placeholder="查找功能..." class="nav-search-input" id="search-input" autocomplete="off"><i class="ace-icon fa fa-search" aria-hidden="true"></i></span></form>'),M&&p.parentElement!==M&&M.appendChild(p),M&&M.style.setProperty("position","relative","important"),p.classList.add("urppp-desktop-search"),p.style.setProperty("position","absolute","important"),p.style.setProperty("top","50%","important"),p.style.setProperty("right","24px","important"),p.style.setProperty("left","auto","important"),p.style.setProperty("transform","translateY(-50%)","important"),p.style.setProperty("width",p.dataset.open==="1"?"min(240px, calc(100vw - 24px))":"0px","important"),p.style.setProperty("max-width","calc(100vw - 24px)","important"),p.style.setProperty("opacity",p.dataset.open==="1"?"1":"0","important"),p.style.setProperty("pointer-events",p.dataset.open==="1"?"auto":"none","important"),p.style.setProperty("z-index","1200","important"),p.style.setProperty("margin","0","important"),p.style.setProperty("background","transparent","important"),p.style.setProperty("border","0 solid transparent","important"),p.style.setProperty("box-shadow","none","important"),p.style.setProperty("overflow","visible","important"),p.style.setProperty("transition","width .2s ease, opacity .2s ease","important");let D=p.querySelector("#search-input"),P=p.querySelector("form");if(!D||!P)return;P.style.setProperty("display","block","important"),P.style.setProperty("margin","0","important"),P.style.setProperty("padding","10px","important");let B=p.querySelector(".input-icon");B&&(B.style.setProperty("display","block","important"),B.style.setProperty("position","relative","important")),D.style.setProperty("display","block","important"),D.style.setProperty("width","100%","important"),D.style.setProperty("height","36px","important"),D.style.setProperty("box-sizing","border-box","important"),D.style.setProperty("padding","0 12px","important"),D.style.setProperty("border","1px solid var(--border)","important"),D.style.setProperty("border-radius","var(--radius-sm)","important"),D.style.setProperty("background","var(--input-bg)","important"),D.style.setProperty("color","var(--text)","important");let G=F=>{p.dataset.open=F?"1":"0",p.style.setProperty("width",F?"min(240px, calc(100vw - 24px))":"0px","important"),p.style.setProperty("opacity",F?"1":"0","important"),p.style.setProperty("pointer-events",F?"auto":"none","important"),i.setAttribute("aria-expanded",F?"true":"false"),F&&setTimeout(()=>D.focus(),30)};i.__urpppSearchBound||(i.__urpppSearchBound=!0,i.addEventListener("click",F=>{F.preventDefault(),F.stopImmediatePropagation(),G(p.dataset.open!=="1")},!0)),document.__urpppDesktopSearchOutsideBound||(document.__urpppDesktopSearchOutsideBound=!0,document.addEventListener("click",F=>{let H=document.getElementById("form-search"),N=document.getElementById("clickdiv");!H||H.dataset.open!=="1"||H.classList.contains("urppp-mobile-form-search")||H.closest("#urppp-mobile-search-panel")||H.contains(F.target)||N?.contains(F.target)||G(!1)},!0))}catch(t){console.warn("[URP++] desktop search bind failed",t)}}function wt(){if(document.getElementById("urppp-boot-loader"))return;let t=document.createElement("div");t.id="urppp-boot-loader",t.setAttribute("aria-busy","true"),t.innerHTML=`
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
    `;let r=document.documentElement||document.body;r&&r.appendChild(t)}function vt(){try{document.documentElement.classList.add("urppp-ready"),document.body&&(document.body.classList.add("urppp-ready"),document.body.style.removeProperty("opacity"));let t=document.getElementById("urppp-boot-loader");if(!t)return;t.classList.add("urppp-boot-hide"),setTimeout(()=>{try{t.remove()}catch{}},280)}catch{}}try{wt()}catch{}window.__urpppBootSafety||(window.__urpppBootSafety=setTimeout(()=>{try{vt()}catch{}},2500));let _t={default:{name:"简约白",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"#0071E3","--input-bg":"#F5F5F7","--primary":"#0071E3","--primary-hover":"#0077ED","--ring":"rgba(0,113,227,0.28)","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px","--border-w":"0px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},dark:{name:"深邃暗",vars:{"--bg":"#000000","--surface":"#1C1C1E","--text":"#F5F5F7","--text-secondary":"#A1A1A6","--text-muted":"#8E8E93","--border":"#38383A","--border-focus":"#0A84FF","--input-bg":"#2C2C2E","--primary":"#0A84FF","--primary-hover":"#409CFF","--ring":"rgba(10,132,255,0.32)","--shadow":"0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},"scu-red":{name:"动态配色",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"var(--urppp-accent, #B53434)","--input-bg":"#F5F5F7","--primary":"var(--urppp-accent, #B53434)","--primary-hover":"var(--urppp-accent-hover, #962929)","--ring":"var(--urppp-accent-ring, rgba(181,52,52,0.18))","--shadow":"0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'}};function I(t,r,e){t/=255,r/=255,e/=255;let a=Math.max(t,r,e),i=Math.min(t,r,e),p=0,s=0,g=(a+i)/2;if(a!==i){let b=a-i;switch(s=g>.5?b/(2-a-i):b/(a+i),a){case t:p=(r-e)/b+(r<e?6:0);break;case r:p=(e-t)/b+2;break;default:p=(t-r)/b+4;break}p/=6}return{h:p*360,s,l:g}}function V(t,r,e){t=(t%360+360)%360,r=Math.max(0,Math.min(1,r)),e=Math.max(0,Math.min(1,e));let a=(1-Math.abs(2*e-1))*r,i=a*(1-Math.abs(t/60%2-1)),p=e-a/2,s=0,g=0,b=0;return t<60?(s=a,g=i):t<120?(s=i,g=a):t<180?(g=a,b=i):t<240?(g=i,b=a):t<300?(s=i,b=a):(s=a,b=i),{r:Math.round((s+p)*255),g:Math.round((g+p)*255),b:Math.round((b+p)*255)}}function Z(t,r,e){let{r:a,g:i,b:p}=V(t,r,e);return me(a,i,p)}function bt(t){let{r,g:e,b:a}=Yr(Ut(t)||ut),i=I(r,e,a);return i.s<.12&&(i.s=.18),i}function mt(t,r,e){let a=Math.max(0,Math.min(100,e))/100,i=Math.max(0,Math.min(.95,r));return Z(t,i,a)}function Ct(t){switch(t){case"paper":case"neutral":return{chroma:1,secShift:0,primaryTone:38,whiteCard:!0,bgSeed:.05,surfaceSeed:0,borderSeed:.08};case"soft":return{chroma:1,secShift:10,primaryTone:42,bgSeed:.14,surfaceSeed:.16,borderSeed:.18};case"vibrant":return{chroma:1.15,secShift:14,primaryTone:36,bgSeed:.2,surfaceSeed:.22,borderSeed:.26};case"expressive":return{chroma:1.08,secShift:0,primaryTone:36,duo:!0,bgSeed:.12,surfaceSeed:.15,borderSeed:.18};default:return{chroma:1,secShift:18,primaryTone:40,bgSeed:.12,surfaceSeed:.13,borderSeed:.16}}}function xt(t,r){let e=Ut(t)||ut,a=Math.max(0,Math.min(.45,Number(r)||0));return a<=.001?"#FFFFFF":It("#FFFFFF",e,a)}function Nt(t){return t<25||t>=345?(t+28)%360:t<55?(t+22)%360:t<90?(t+160)%360:t<160?(t+40)%360:t<210?(t+35)%360:t<265?(t+48)%360:t<310?(t+40)%360:(t+24)%360}function Et(t){let r=Ut(t)||ut,{h:e,s:a}=bt(r),i=Nt(e),p=Math.min(.72,Math.max(.28,a*.78));return mt(i,p,42)}function Mt(t,r){let e=Ut(t)||ut,{h:a,s:i}=bt(e),s=Ct(r||et),g=Math.min(.92,Math.max(.35,i*s.chroma)),b=Et(e),{h:_}=bt(b),M=mt(a,g,s.primaryTone),D=mt(a,g,Math.max(24,s.primaryTone-10)),P=It("#FFFFFF",e,.18),B,G,F;s.whiteCard?(B=It("#F1F5F9",It("#FFFFFF",e,.08),.5),G="#FFFFFF",F="#E5E7EB"):s.duo?(B=It(xt(b,s.bgSeed+.04),"#EEF1F4",.1),G=It(xt(e,s.surfaceSeed),"#FFFFFF",.1),F=It("#E5E7EB",b,.16)):(B=It(xt(e,s.bgSeed),"#E8EBEF",.12),G=It(xt(e,s.surfaceSeed),"#FFFFFF",.12),F=It("#E5E7EB",e,Math.max(.08,s.borderSeed*.7)));let H=s.whiteCard?"#F8FAFC":It(G,xt(s.duo?b:e,Math.max(.05,(s.surfaceSeed||.1)*.55)),.35),N=mt(a,Math.min(.45,g*.55),14),X=hr(mt(a,g*.3,34),.88),dt=hr(mt(a,g*.22,46),.76),yt=hr(M,.18),St="0 4px 12px "+hr(M,.1)+", 0 1px 2px "+hr(M,.05);return{"--bg":B,"--surface":G,"--text":N,"--text-secondary":X,"--text-muted":dt,"--border":F,"--border-focus":M,"--input-bg":H,"--primary":M,"--primary-hover":D,"--ring":yt,"--shadow":St,"--radius":"18px","--radius-sm":"12px","--primary-container":P,"--secondary":b}}function Qt(t,r){let e=Mt(t,r);return{id:r,primary:e["--primary"],bg:e["--bg"],surface:e["--surface"],border:e["--border"],text:e["--text"]}}function Pr(t){let r=Ut(t)||Vt()||ut;return Q.map(e=>Object.assign({},e,Qt(r,e.id)))}function dr(){let t=document.documentElement;["--primary","--primary-hover","--border-focus","--ring","--bg","--surface","--text","--text-secondary","--text-muted","--border","--input-bg","--shadow","--primary-container","--secondary"].forEach(r=>t.style.removeProperty(r))}function Vt(){return Ut(GM_getValue(q,""))||""}function zr(){let t=String(GM_getValue(m,et)||et);return Q.some(r=>r.id===t)?t:et}function ea(t){let r=Q.some(e=>e.id===t)?t:et;return GM_setValue(m,r),r}function vi(t,r){if(!t)return;let e=Ut(t);if(e){if(GM_setValue(q,e),r&&r.scheme&&ea(r.scheme),r&&r.skipTheme){let a=Wa(e,.15),i=hr(e,.15);document.documentElement.style.setProperty("--urppp-accent",e),document.documentElement.style.setProperty("--urppp-accent-hover",a),document.documentElement.style.setProperty("--urppp-accent-ring",i);try{gt()}catch{}try{Rt()}catch{}return}Wt("scu-red");try{gt()}catch{}try{Rt()}catch{}}}function aa(){try{let t=GM_getValue(E,"");if(!t)return nt.slice();let r=JSON.parse(t);return Array.isArray(r)?r.filter(e=>typeof e=="string"&&/^#?[0-9a-fA-F]{6}$/i.test(e.replace("#",""))).map(e=>e.startsWith("#")?e.toUpperCase():"#"+e.toUpperCase()):nt.slice()}catch{return nt.slice()}}function wi(t){let r=Ut(t||Vt()||ut);if(!r)return aa();let e=aa();return e=[r].concat(e.filter(a=>a.toLowerCase()!==r.toLowerCase())),e=e.slice(0,12),GM_setValue(E,JSON.stringify(e)),e}function Xt(){try{return!!GM_getValue(u,!1)}catch{return!1}}function we(t){return GM_setValue(u,!!t),!!t}function oa(){try{return!!GM_getValue(y,!1)}catch{return!1}}function ki(t){return GM_setValue(y,!!t),!!t}function na(){try{return GM_getValue(f,"tab")==="direct"}catch{return!1}}function Ai(t){return GM_setValue(f,t==="direct"?"direct":"tab"),t==="direct"?"direct":"tab"}function fr(){try{let t=GM_getValue(S,!0);return t!==!1&&t!==0&&t!=="0"}catch{return!0}}function Si(t){return GM_setValue(S,!!t),!!t}function pa(){try{return!!GM_getValue(l,!1)}catch{return!1}}function _i(t){return GM_setValue(l,!!t),!!t}function ke(t,r){try{let e=GM_getValue(t,"");if(e&&typeof e=="object")return e;if(typeof e=="string"&&e.trim())return JSON.parse(e)}catch{}return r}function Ae(t,r){return GM_setValue(t,JSON.stringify(r)),r}function xr(){return Ka(ke(j,null))}function ia(t){return Ae(j,Ka(t))}function Lr(){return ye(ke(T,null))}function lo(t){return Ae(T,ye(t))}function sa(){let t=ke(O,{});return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}function co(t,r){if(!t||!/^\d{4}-\d{2}-\d{2}$/.test(String(r||"")))return;let e=sa();e[String(t)]=String(r),Ae(O,e)}function Se(){let t="";try{t=GM_getValue(W,"")}catch{}let r=!!(t&&(typeof t!="string"||t.trim())),e=ke(W,null);try{if(r&&(!e||typeof e!="object"||Array.isArray(e)))throw new Error("配置不是 JSON 对象");let a=e&&typeof e=="object"?e:{},i={enabled:!!a.enabled,mapping:Cr(a.mapping||ge)};return tt="",i}catch{return tt=r?"JSON 映射配置损坏，已回退小爱课程兼容格式":"",{enabled:!1,mapping:Cr(ge)}}}function uo(t){let r=t&&typeof t=="object"?t:{},e={enabled:!!r.enabled,mapping:Cr(r.mapping||ge)};return tt="",Ae(W,e)}function mo(){try{let t=String(location.pathname||"").replace(/\/+$/,"")||"/";return t==="/"||t==="/index"||/\/index\.html?$/i.test(t)}catch{return!1}}function _e(){try{return!!GM_getValue(L,!1)}catch{return!1}}function la(t){return GM_setValue(L,!!t),!!t}function Ei(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch{return!1}}function yr(){return Ei()&&Tr()?"dark":_e()&&Mr()?"scu-red":"default"}function te(t,r){return t==="dark"?Tr(r):t==="scu-red"?Mr(r):t==="default"}function Wt(t,r){r=r||{},!Tr()&&Xt()&&we(!1),!Mr()&&_e()&&la(!1),r.manual&&we(!1);let e;r.system||Xt()&&!r.manual?e=yr():(e=_t[t]?t:Yt()||"default",_t[e]||(e="default")),te(e)||(e="default");let a=_t[e]||_t.default;r.skipPersist||GM_setValue(v,e),dr();let i=document.getElementById("urppp-theme-vars")||(()=>{let _=document.createElement("style");return _.id="urppp-theme-vars",(document.head||document.documentElement).appendChild(_),_})(),p=Vt(),s=Object.assign({},a.vars);if(e==="scu-red"){let _=p||ut,M=zr();s=Object.assign(s,Mt(_,M));let D=s["--primary"]||_,P=s["--primary-hover"]||Wa(D,.12);document.documentElement.style.setProperty("--urppp-accent",D),document.documentElement.style.setProperty("--urppp-accent-hover",P),document.documentElement.style.setProperty("--urppp-accent-ring",s["--ring"]||hr(D,.15)),document.documentElement.style.setProperty("--urppp-seed",_),document.documentElement.style.setProperty("--urppp-scheme",M)}else e==="default"?(document.documentElement.style.setProperty("--urppp-accent","#0071E3"),document.documentElement.style.setProperty("--urppp-accent-hover","#0077ED"),document.documentElement.style.setProperty("--urppp-accent-ring","rgba(0,113,227,0.28)"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme")):(document.documentElement.style.removeProperty("--urppp-accent"),document.documentElement.style.removeProperty("--urppp-accent-hover"),document.documentElement.style.removeProperty("--urppp-accent-ring"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme"));let g=":root {";for(let[_,M]of Object.entries(s))g+=`${_}:${M};`;g+="}",i.textContent=g,document.body&&(document.body.style.fontFamily=a.font);try{let _=document.documentElement;_.dataset.urpppTheme=e,_.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),_.classList.add("urppp-theme-"+e),_.classList.toggle("urppp-theme-follow",Xt()),document.body&&(document.body.dataset.urpppTheme=e,document.body.classList.toggle("urppp-dark",e==="dark"),document.body.classList.toggle("urppp-theme-follow",Xt()))}catch{}try{nr()}catch{}try{gt()}catch{}try{Rt()}catch{}try{Mo()}catch{}try{Mi()}catch{}let b=document.getElementById("urppp-boot-loader");b&&(b.style.fontFamily=a.font)}function Yt(){return GM_getValue(v,"default")}function qr(t){try{return!!GM_getValue("urppp_theme_css_"+t,"")}catch{return!1}}function or(){let t=GM_getValue(c,"apple"),r=d.find(e=>e.id===t);return r&&r.ready&&(r.installed!==!1||qr(r.id))?t:"apple"}function ca(t,r){let e=t||or(),a=d.find(i=>i.id===e);return!!(a&&a[r])}function Tr(t){return ca(t,"dark")}function Mr(t){return ca(t,"dynamic")}function bo(t){return ca(t,"palettes")}function re(t){return Y.find(r=>r.id===t)||Y[0]}function ho(){let t=String(GM_getValue($,"acid")||"acid"),r=re(t);return r.id===J?re("acid"):r}function go(){let t=String(GM_getValue(z,J)||J);return re(t)}function fo(t,r){let e=r||{},a=re(t);e.select&&a.id!==J&&GM_setValue($,a.id),GM_setValue(z,a.id);try{nr()}catch{}try{gt()}catch{}try{Rt()}catch{}try{let i=document.getElementById("urppp-clean-root");i&&typeof i.__syncCleanThemeDots=="function"&&i.__syncCleanThemeDots()}catch{}}function Ci(t){let r=t||or();return r==="flat"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"2px","--urppp-card-border":"2px solid var(--text)","--urppp-input-border":"2px solid var(--text)","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:r==="organic"?{"--radius":"22px","--radius-sm":"14px","--shadow":"0 2px 10px rgba(92,64,51,0.06)","--border-w":"1px","--urppp-card-border":"1px solid #E7E0D6","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"1px solid var(--border)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--input-bg)","--urppp-action-color":"var(--primary)","--urppp-menu-radius":"14px","--urppp-menu-border":"1px solid var(--border)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}:r==="editorial"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"none","--urppp-action-radius":"0px","--urppp-action-border":"none","--urppp-action-shadow":"none","--urppp-action-bg":"transparent","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"1px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"transparent","--urppp-menu-color":"var(--text)"}:r==="brutal"?{"--radius":"0px","--radius-sm":"0px","--shadow":"6px 6px 0 #000","--border-w":"3px","--urppp-card-border":"3px solid #000","--urppp-input-border":"2px solid #000","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"3px 3px 0 var(--text)","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"3px 3px 0 var(--text)","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:r==="neu"?{"--radius":"16px","--radius-sm":"12px","--shadow":"5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"1px solid rgba(38,49,66,.16)","--urppp-input-shadow":"inset 2px 2px 4px rgba(38,49,66,.16), inset -2px -2px 4px rgba(255,255,255,.72)","--urppp-action-radius":"12px","--urppp-action-border":"none","--urppp-action-shadow":"var(--shadow)","--urppp-action-bg":"var(--bg)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"12px","--urppp-menu-border":"none","--urppp-menu-shadow":"var(--shadow)","--urppp-menu-bg":"var(--bg)","--urppp-menu-color":"var(--text)"}:{"--radius":"18px","--radius-sm":"12px","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--border-w":"0px","--urppp-card-border":r==="apple"&&fr()?"1px solid rgba(0,0,0,0.08)":"none","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"none","--urppp-action-shadow":"0 2px 6px var(--ring)","--urppp-action-bg":"var(--primary)","--urppp-action-color":"var(--surface)","--urppp-menu-radius":"12px","--urppp-menu-border":r==="apple"&&fr()?"1px solid var(--border)":"none","--urppp-menu-shadow":"0 1px 3px rgba(0,0,0,.08)","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}}function $r(){try{let t=or();if(t==="apple")return fr()?"1px solid rgba(0,0,0,0.08)":"none";if(t==="flat")return"2px solid var(--text)";if(t==="organic")return"1px solid #E7E0D6";if(t==="brutal")return"3px solid var(--text)";if(t==="editorial"||t==="neu")return"none"}catch{}return"1px solid var(--border)"}function nr(){let t=or();try{document.documentElement.setAttribute("data-urppp-skin",t)}catch{}try{document.body&&document.body.setAttribute("data-urppp-skin",t)}catch{}try{let r=t==="apple"&&fr();document.documentElement.setAttribute("data-urppp-apple-edge",r?"1":"0"),document.body&&document.body.setAttribute("data-urppp-apple-edge",r?"1":"0")}catch{}try{let r=document.getElementById("urppp-skin-vars")||(()=>{let p=document.createElement("style");return p.id="urppp-skin-vars",(document.head||document.documentElement).appendChild(p),p})(),e=Ci(t),a=":root, html[data-urppp-skin] {";if(Object.keys(e).forEach(p=>{a+=p+":"+e[p]+";"}),a+="}",a+=".urppp-nav-dot.urppp-theme-disabled{opacity:.42!important;cursor:not-allowed!important;box-shadow:none!important;filter:grayscale(1)!important;transform:none!important;}",t==="flat"||t==="organic"||t==="brutal"||t==="neu"){if(t==="brutal"){let p=go();a+='html[data-urppp-skin="brutal"]{--brutal-accent:'+p.accent+";--brutal-secondary:"+p.secondary+";--brutal-info:"+p.info+";--brutal-warning:"+p.warning+";}"}r.textContent=a;return}if(t==="apple"){let p=fr(),s=p?"1px solid rgba(0,0,0,0.08)":"none",g=p?"1px solid rgba(255,255,255,0.10)":"none",b=p?"1px solid rgba(0,0,0,0.06)":"none";a+=['html[data-urppp-skin="apple"]{--shadow:0 6px 20px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);--border:'+(p?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.04)")+";}",'html[data-urppp-skin="apple"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="apple"]{--shadow:0 10px 28px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.04);--border:'+(p?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)")+";}",'html[data-urppp-skin="apple"] .widget-box,html[data-urppp-skin="apple"] .widget-box.transparent,html[data-urppp-skin="apple"] .panel,html[data-urppp-skin="apple"] .panel-default,html[data-urppp-skin="apple"] .well,html[data-urppp-skin="apple"] .thumbnail,html[data-urppp-skin="apple"] .infobox,html[data-urppp-skin="apple"] .profile-user-info,html[data-urppp-skin="apple"] .profile-user-info-striped,html[data-urppp-skin="apple"] .modal-content,html[data-urppp-skin="apple"] fieldset,html[data-urppp-skin="apple"] .urppp-stat-card,html[data-urppp-skin="apple"] .urppp-db-card,html[data-urppp-skin="apple"] .urppp-db-panel,html[data-urppp-skin="apple"] #urppp-dashboard .widget-box,html[data-urppp-skin="apple"] #urppp-root .uc,html[data-urppp-skin="apple"] #urppp-clean-root .uc-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-modal,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top,html[data-urppp-skin="apple"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="apple"] .urppp-card,html[data-urppp-skin="apple"] #urppp-dashboard .urppp-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+s+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"].urppp-theme-dark .widget-box,html[data-urppp-skin="apple"].urppp-theme-dark .panel,html[data-urppp-skin="apple"].urppp-theme-dark .profile-user-info,html[data-urppp-skin="apple"].urppp-theme-dark .modal-content,html[data-urppp-skin="apple"].urppp-theme-dark .urppp-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-root .uc{border:'+g+"!important;}",'html[data-urppp-skin="apple"] .page-content .widget-box,html[data-urppp-skin="apple"] #page-content-template .widget-box,html[data-urppp-skin="apple"] html body .page-content .profile-user-info.setLabelWidth{border:'+s+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"] .btn,html[data-urppp-skin="apple"] .btn-default,html[data-urppp-skin="apple"] .btn-white,html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] .btn-success,html[data-urppp-skin="apple"] .btn-warning,html[data-urppp-skin="apple"] .btn-danger,html[data-urppp-skin="apple"] a.btn,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn{border-color:transparent!important;box-shadow:0 1px 2px rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn.primary{border:none!important;}','html[data-urppp-skin="apple"] .table,html[data-urppp-skin="apple"] table,html[data-urppp-skin="apple"] .table-bordered,html[data-urppp-skin="apple"] .table-bordered>thead>tr>th,html[data-urppp-skin="apple"] .table-bordered>tbody>tr>td{border-color:rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"].urppp-theme-dark .table,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>thead>tr>th,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>tbody>tr>td{border-color:rgba(255,255,255,.06)!important;}','html[data-urppp-skin="apple"] .nav-tabs>li>a,html[data-urppp-skin="apple"] .nav-tabs{border-color:transparent!important;}','html[data-urppp-skin="apple"] .urppp-nav-link{border:none!important;}','html[data-urppp-skin="apple"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="apple"] #urppp-clean-root .uc-grid-cell{border-color:'+(p?"rgba(0,0,0,0.06)":"transparent")+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+b+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-dots span{border-radius:50%!important;border:2px solid var(--border)!important;box-shadow:none!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important;background-clip:padding-box!important;flex:0 0 auto!important;}','html[data-urppp-skin="apple"] .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary)!important;box-shadow:0 0 0 3px var(--ring)!important;}','html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-dots span[data-theme="scu-red"]{border-radius:50%!important;border:2px solid var(--border)!important;}'].join("")}else t==="editorial"&&(a+=`
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
        `);r.textContent=a;let i=document.head||document.documentElement;r.parentNode===i&&i.lastElementChild!==r&&i.appendChild(r)}catch(r){try{console.warn("[URP++] applySkinAttr",r)}catch{}}setTimeout(()=>{try{Jt(document)}catch{}},0)}function xo(t){let r=d.find(e=>e.id===t&&e.ready&&(e.installed!==!1||qr(e.id)));if(!r)return!1;GM_setValue(c,r.id);try{r.dynamic||la(!1),!r.dark&&Xt()&&we(!1);let e=Xt(),a=e?yr():Yt(),i=te(a,r.id)?a:"default";nr(),Wt(i,{system:e})}catch{try{nr()}catch{}}try{Rt()}catch{}try{gt()}catch{}try{let e=document.getElementById("urppp-clean-root");e&&typeof e.__syncCleanThemeDots=="function"&&e.__syncCleanThemeDots()}catch{}return!0}function Pi(){if(!window.__urpppSystemThemeBound&&window.matchMedia){window.__urpppSystemThemeBound=!0;try{let t=window.matchMedia("(prefers-color-scheme: dark)"),r=()=>{if(Xt())try{Wt(yr(),{system:!0})}catch{}};t.addEventListener?t.addEventListener("change",r):t.addListener&&t.addListener(r)}catch{}}}try{Xt()?Wt(yr(),{system:!0}):Wt(Yt())}catch{}try{nr()}catch{}try{Pi()}catch{}function zi(t){let r=String(document.body&&document.body.innerText||t&&t.innerText||"").replace(/\s+/g," ").trim(),e=[/token\s*校验失败[！!]?/i,/令牌\s*校验失败[！!]?/i,/验证码.{0,12}(?:错误|失败|过期)[！!]?/i,/(?:用户名|账号|学号).{0,12}(?:密码).{0,12}(?:错误|失败)[！!]?/i,/登录.{0,12}(?:错误|失败)[！!]?/i];for(let a of e){let i=r.match(a);if(i)return i[0].trim()}return""}function yo(){let t=location.pathname,r=document.getElementById("formContent"),e=document.querySelector(".form-signin");if(!r||!e){setTimeout(yo,50);return}if(r.querySelector(":scope > #urppp-root"))return;let a=zi(r),i=e.querySelector('a[onclick*="toModifyPwd"]'),p=(()=>{let H=r.querySelector(".fadeIn.first svg");return H?H.outerHTML:""})(),s=(()=>{let H=document.querySelector("#tocas a");return H?H.href:"https://id.scu.edu.cn/"})();for(let H of r.children)H.style.display="none";r.style.cssText="max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;";let g=location.pathname==="/loginEn",b=(H,N)=>g?N:H;r.insertAdjacentHTML("afterbegin",`
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
          <div class="ub-logo">${p||""}</div>
          <h1>${b("四川大学教务管理系统","SCU Academic System")}</h1>
          <p>${b("学生端 · 欢迎登录","Student Portal · Welcome")}</p>
        </div>

        <div class="ut" id="urppp-tabs">
          <button class="ac" data-mode="account">${b("账号登录","Account")}</button>
          <button data-mode="sso">${b("统一认证","SSO")}</button>
        </div>

        ${a?`<div class="urppp-login-error" role="alert">${it(a)}</div>`:""}

        <div class="ufb" id="urppp-form">
          <div class="ufg">
            <label class="ufl" for="urppp-user">${b("学号","Student ID")}</label>
            <input class="ui" id="urppp-user" type="text" placeholder="${b("请输入学号","Enter student ID")}" autocomplete="username">
          </div>
          <div class="ufg">
            <label class="ufl" for="urppp-pass">${b("密码","Password")}</label>
            <input class="ui" id="urppp-pass" type="password" placeholder="${b("请输入密码","Enter password")}" autocomplete="current-password">
          </div>
          <div class="ucr">
            <div class="ufg ufg-cap">
              <label class="ufl" for="urppp-cap">${b("验证码","Captcha")}</label>
              <div class="ucap-input-wrap">
                <input class="ui" id="urppp-cap" type="text" placeholder="${b("请输入","Enter")}" maxlength="4" autocomplete="off">
                <div class="uci-wrap" id="urppp-capwrap" title="${b("点击刷新","Refresh")}">
                  <img class="uci" id="urppp-capimg" src="" alt="Captcha">
                </div>
              </div>
            </div>
          </div>
          <button class="ubtn" id="urppp-submit">${b("登 录","Sign In")}</button>
        </div>

        <div class="uft">
          <a href="javascript:void(0)" id="urppp-forgot">${b("忘记密码？","Forgot password?")}</a>
          <a href="${g?"/login":"/loginEn"}">${g?"中文":"EN"}</a>
        </div>

        <div class="us" id="urppp-dots">
          <span data-theme="default" title="简约白" style="background:#F5F5F7;box-shadow:inset 0 0 0 1px #D2D2D7"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="动态配色" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);let _=r.querySelector("#urppp-root");[["#urppp-user","#input_username"],["#urppp-pass","#input_password"],["#urppp-cap","#input_checkcode"]].forEach(([H,N])=>{let X=_.querySelector(H),dt=document.querySelector(N);X&&dt&&(dt.value&&(X.value=dt.value),X.addEventListener("input",()=>{dt.value=X.value}))});let M=_.querySelector("#urppp-capimg"),D=_.querySelector("#urppp-capwrap"),P=document.querySelector(".form-signin img");if(M&&P){M.src=P.src;let H=()=>{let N=P.src.replace(/\?.*/,"")+"?"+Date.now();P.src=N,M.src=N};D?D.addEventListener("click",H):M.addEventListener("click",H)}_.querySelectorAll(".ut button").forEach(H=>{H.addEventListener("click",()=>{if(H.dataset.mode==="sso"){location.href=s;return}_.querySelectorAll(".ut button").forEach(dt=>dt.classList.remove("ac")),H.classList.add("ac");let N=_.querySelector("#urppp-form"),X=_.querySelector("#urppp-sso");N&&(N.style.display="block"),X&&(X.style.display="none")})});let B=_.querySelector("#urppp-submit");B.addEventListener("click",()=>{if(B.dataset.submitting==="1")return;B.dataset.submitting="1",B.disabled=!0;let H=document.getElementById("loginButton");H?H.click():typeof e.requestSubmit=="function"?e.requestSubmit():e.submit(),setTimeout(()=>{B.dataset.submitting="0",B.disabled=!1},1500)}),_.querySelectorAll(".ui").forEach(H=>{H.addEventListener("keydown",N=>{N.key==="Enter"&&B.click()})}),_.querySelector("#urppp-forgot").addEventListener("click",H=>{H.preventDefault(),i&&i.click()});let G=_.querySelector("#urppp-dots"),F=()=>{if(!G)return;let H=Yt();G.querySelectorAll("span").forEach(X=>{X.classList.toggle("ac",X.dataset.theme===H)});let N=G.querySelector('span[data-theme="scu-red"]');if(N){let X=Vt()||ut;try{let dt=Qt(X,zr());N.style.background="linear-gradient(135deg, "+dt.primary+" 0 55%, "+dt.surface+" 55% 100%)"}catch{N.style.background=X}}};G&&(G.querySelectorAll("span").forEach(H=>{H.addEventListener("click",()=>{Wt(H.dataset.theme,{manual:!0}),F()})}),F()),console.log("[URP++] 登录界面已重建"),setTimeout(()=>{document.body.classList.add("urppp-ready"),vt()},100)}let{beautifyBreadcrumbs:Ee}=fi({});function da(){try{document.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(t=>{if(t.classList.contains("setLabelWidth")||t.classList.contains("urppp-query-form")||t.querySelector(".urppp-query-pair"))return;let r=Array.from(t.querySelectorAll(":scope > .profile-info-row, .profile-info-row"));!r.length||r.some(a=>Array.from(a.children).filter(i=>i.classList&&i.classList.contains("profile-info-name")).length>=2)||(t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("display","block","important"),ze(t),r.forEach(a=>{a.classList.remove("urppp-query-row","urppp-dual-pair"),delete a.dataset.urpppQueryDone,delete a.dataset.urpppQueryCols;let i=Array.from(a.querySelectorAll(":scope > .urppp-query-pair"));if(i.length){let p=[];for(i.forEach(s=>Array.from(s.children).forEach(g=>p.push(g)));a.firstChild;)a.removeChild(a.firstChild);p.forEach(s=>a.appendChild(s))}a.style.setProperty("display","grid","important"),a.style.setProperty("grid-template-columns","140px minmax(0,1fr)","important"),a.style.setProperty("align-items","stretch","important"),a.style.setProperty("width","100%","important"),Array.from(a.children).forEach(p=>{p.classList&&(p.style.setProperty("float","none","important"),p.style.setProperty("margin-left","0","important"),p.style.setProperty("width","auto","important"),p.style.setProperty("max-width","none","important"),p.style.setProperty("display","flex","important"),p.style.setProperty("align-items","center","important"),p.style.setProperty("box-sizing","border-box","important"))})}))})}catch(t){console.warn("[URP++] single pair profile fix failed",t)}}function Ce(){let t=document.querySelector(".page-content")||document.getElementById("page-content-template");t&&(t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(r=>{if(!r.querySelector(".setLabelWidth"))return;let e=r.querySelector(".setLabelWidth");e&&(r.querySelectorAll("h4.header, h3.header, .header.smaller, .header").forEach(a=>{e.contains(a)||a.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING&&(a.classList.add("urppp-section-label"),["background","background-color","background-image","border","box-shadow","border-radius","padding","margin","min-height"].forEach(i=>{a.style.removeProperty(i)}),a.style.setProperty("background","transparent","important"),a.style.setProperty("background-color","transparent","important"),a.style.setProperty("background-image","none","important"),a.style.setProperty("border","0 none transparent","important"),a.style.setProperty("box-shadow","none","important"),a.style.setProperty("border-radius","0","important"),a.style.setProperty("padding","4px 2px 10px","important"),a.style.setProperty("margin","0 0 8px 0","important"),a.style.setProperty("min-height","0","important"))}),e.classList.remove("urppp-query-form"),e.style.setProperty("padding","0","important"),e.style.setProperty("overflow","hidden","important"),e.style.setProperty("background","var(--surface)","important"),e.style.setProperty("border",$r(),"important"),e.style.setProperty("border-radius","12px","important"),e.style.setProperty("box-shadow","none","important"))}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(r=>{r.classList.remove("urppp-query-form"),r.querySelectorAll(".profile-info-row").forEach(e=>{e.classList.remove("urppp-query-row"),delete e.dataset.urpppQueryDone,delete e.dataset.urpppQueryCols;let a=Array.from(e.querySelectorAll(":scope > .urppp-query-pair"));if(a.length){let i=[];for(a.forEach(p=>{Array.from(p.children).forEach(s=>i.push(s))});e.firstChild;)e.removeChild(e.firstChild);i.forEach(p=>e.appendChild(p))}})}),t.querySelectorAll(".setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row").forEach(r=>{let e=Array.from(r.querySelectorAll(":scope > .urppp-query-pair"));if(e.length){let p=[];for(e.forEach(s=>{Array.from(s.children).forEach(g=>p.push(g))});r.firstChild;)r.removeChild(r.firstChild);p.forEach(s=>r.appendChild(s))}r.classList.remove("urppp-query-row"),delete r.dataset.urpppQueryDone,delete r.dataset.urpppQueryCols;let a=Array.from(r.children).filter(p=>p.classList&&(p.classList.contains("profile-info-name")||p.classList.contains("profile-info-value")));a.filter(p=>p.classList.contains("profile-info-name")).length>=2?(r.classList.add("urppp-dual-pair"),r.style.setProperty("display","grid","important"),r.style.setProperty("grid-template-columns","112px minmax(140px,1fr) 112px minmax(140px,1fr)","important"),r.style.setProperty("align-items","stretch","important"),r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("float","none","important"),a.forEach(p=>{p.style.setProperty("float","none","important"),p.style.setProperty("clear","none","important"),p.style.setProperty("margin","0","important"),p.style.setProperty("margin-left","0","important"),p.style.setProperty("width","auto","important"),p.style.setProperty("max-width","none","important"),p.style.setProperty("min-width","0","important"),p.style.setProperty("box-sizing","border-box","important"),p.style.setProperty("display","flex","important"),p.style.setProperty("align-items","center","important"),p.classList.contains("profile-info-value")?(p.style.removeProperty("width"),p.style.setProperty("width","auto","important"),p.style.setProperty("justify-content","flex-start","important"),p.style.setProperty("white-space","normal","important"),p.style.setProperty("word-break","normal","important")):(p.style.setProperty("justify-content","flex-end","important"),p.style.setProperty("white-space","nowrap","important"))})):r.classList.remove("urppp-dual-pair")}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(r=>{r.classList.remove("urppp-query-form"),r.style.cssText=(r.getAttribute("style")||"").replace(/padding\s*:[^;]+;?/gi,""),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("overflow","hidden","important"),r.style.setProperty("border",$r(),"important"),r.style.setProperty("box-shadow","none","important"),r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("box-sizing","border-box","important"),r.style.setProperty("margin","0 0 16px 0","important"),r.style.setProperty("padding","0","important");let e=r.closest(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8")||r.parentElement;e&&Array.from(e.querySelectorAll("h4.header, h3.header, .header.smaller")).forEach(a=>{r.contains(a)||a.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING&&(a.classList.add("urppp-section-label"),a.style.setProperty("background","transparent","important"),a.style.setProperty("background-color","transparent","important"),a.style.setProperty("background-image","none","important"),a.style.setProperty("border","0 none transparent","important"),a.style.setProperty("box-shadow","none","important"),a.style.setProperty("border-radius","0","important"),a.style.setProperty("padding","4px 2px 10px","important"),a.style.setProperty("margin","0 0 8px 0","important"),a.style.setProperty("min-height","0","important"))})}),t.querySelectorAll(".urppp-col-row").forEach(r=>{r.classList.remove("urppp-col-row"),["display","flex-wrap","gap","align-items","width","box-sizing"].forEach(e=>r.style.removeProperty(e))}),t.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach(r=>{["float","flex","width","max-width","padding-left","padding-right","box-sizing"].forEach(e=>{r.style.getPropertyPriority(e)==="important"&&r.style.removeProperty(e)}),r.style.setProperty("padding-left","0","important"),r.style.setProperty("box-sizing","border-box","important")}),t.querySelectorAll(".col-xs-4, .col-sm-4, .col-md-4").forEach(r=>{r.style.setProperty("padding-right","16px","important")}),t.querySelectorAll(".col-xs-8, .col-sm-8, .col-md-8").forEach(r=>{r.style.setProperty("padding-left","0","important"),r.style.setProperty("padding-right","0","important")}),t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(r=>{r.querySelector(".setLabelWidth")&&r.querySelectorAll(":scope > h4.header, :scope > .header, :scope > .header.smaller").forEach(e=>{e.style.cssText+=";background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;border-radius:0!important;padding:4px 2px 10px!important;margin:0 0 8px 0!important;min-height:0!important;"})}),t.querySelectorAll(".urppp-section-title-wrap").forEach(r=>{let e=r.querySelector("h4.header, h3.header, h5.header, .header.smaller");if(!e){r.remove();return}let a=r.nextElementSibling;for(;a&&!a.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]');)a=a.nextElementSibling;let i=a&&(a.querySelector(".col-xs-4, .col-sm-4, .col-md-4")||Array.from(a.children).find(p=>/col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(p.className||"")));i&&(i.insertBefore(e,i.firstChild),delete e.dataset.urpppHoisted,e.style.removeProperty("width"),e.style.removeProperty("max-width"),e.style.removeProperty("margin-left"),e.style.removeProperty("margin-right"),e.style.removeProperty("box-sizing"),e.style.removeProperty("position"),e.style.removeProperty("left")),r.remove()}))}function Pe(){let t=typeof unsafeWindow<"u"?unsafeWindow:window;return t.jQuery||t.$||window.jQuery||window.$||null}function Li(t){return t?t.id&&String(t.id).indexOf("pagination_pageSize_")===0?!0:!!(t.closest&&t.closest('#urppagebar, .urppagebreak, .dataTables_paginate, [id^="sample-table-2_paginate_"]')):!1}function vo(t){if(t){try{let r=Pe();r&&r.fn&&r(t).data("chosen")&&r(t).chosen("destroy")}catch{}try{if(t.parentElement&&t.parentElement.querySelectorAll(":scope > .chosen-container").forEach(r=>{try{r.remove()}catch{}}),t.nextElementSibling&&t.nextElementSibling.classList.contains("chosen-container"))try{t.nextElementSibling.remove()}catch{}}catch{}t.classList.remove("urppp-chosen-hidden","chzn-done","chosen");try{delete t.dataset.urpppChosen}catch{}t.style.setProperty("display","inline-block","important")}}let wo=0,ko=!1;function qi(){if(ko)return;ko=!0;let t=r=>{if(Date.now()<wo){try{r.preventDefault()}catch{}try{r.stopPropagation()}catch{}}};document.addEventListener("mousedown",t,!0),document.addEventListener("mouseup",t,!0),document.addEventListener("click",t,!0)}function ua(t){if(!t||t.__urpppChosenNoPierce)return;t.__urpppChosenNoPierce=!0,qi();let r=t.querySelector(".chosen-drop"),e=a=>{let i=a.target;!i||!i.closest||!i.closest(".chosen-results li")||(wo=Date.now()+350)};t.addEventListener("mouseup",e,!1),t.addEventListener("touchend",e,!1),r&&(r.addEventListener("mouseup",e,!1),r.addEventListener("touchend",e,!1))}function ma(t=document){try{t.querySelectorAll(".chosen-container").forEach(ua)}catch{}}function ur(){try{let t=Pe();if(!t||!t.fn||typeof t.fn.chosen!="function")return!1;let r=document.querySelectorAll(".profile-user-info, .urppp-query-form, .profile-info-row, form"),e=new Set,a=[];if(r.forEach(i=>{i.querySelectorAll("select").forEach(p=>{e.has(p)||(e.add(p),a.push(p))})}),document.querySelectorAll("select.value_element, .profile-info-value > select").forEach(i=>{e.has(i)||(e.add(i),a.push(i))}),a.forEach(i=>{if(!i||i.multiple||i.disabled||i.size&&i.size>1)return;if(Li(i)){vo(i);return}let p=t(i);if(!!p.data("chosen")||i.classList.contains("chzn-done")||!!(i.nextElementSibling&&i.nextElementSibling.classList.contains("chosen-container"))||!!(i.parentElement&&i.parentElement.querySelector(":scope > .chosen-container"))){i.dataset.urpppChosen="1",i.classList.add("urppp-chosen-hidden"),i.style.setProperty("display","none","important");let g=i.nextElementSibling&&i.nextElementSibling.classList.contains("chosen-container")?i.nextElementSibling:i.parentElement&&i.parentElement.querySelector(":scope > .chosen-container");g&&ua(g);return}try{i.classList.contains("select")||i.classList.add("select");try{p.data("chosen")&&p.chosen("destroy")}catch{}p.chosen({allow_single_deselect:!0,search_contains:!0,width:"100%",no_results_text:"无匹配项",disable_search_threshold:0}),i.dataset.urpppChosen="1",i.classList.add("urppp-chosen-hidden"),i.style.setProperty("display","none","important");let g=i.nextElementSibling&&i.nextElementSibling.classList.contains("chosen-container")?i.nextElementSibling:i.parentElement&&i.parentElement.querySelector(".chosen-container");g&&(g.style.setProperty("width","100%","important"),g.style.setProperty("min-width","0","important"),g.style.setProperty("display","block","important")),g&&ua(g)}catch(g){console.warn("[URP++] chosen init failed",i,g)}}),!window.__urpppChosenHtmlPatch){window.__urpppChosenHtmlPatch=!0;let i=t.fn.html;t.fn.html=function(){let p=i.apply(this,arguments);if(arguments.length)try{this.filter("select").add(this.find("select")).each(function(){let s=t(this);if(s.data("chosen")||s.next(".chosen-container").length)try{s.trigger("chosen:updated")}catch{}})}catch{}return p}}return!0}catch(t){return console.warn("[URP++] ensureQueryChosen failed",t),!1}}function Ao(){if(window.__urpppChosenScheduleBound)return;window.__urpppChosenScheduleBound=!0,[0,200,600,1500,3e3].forEach(a=>setTimeout(()=>{ur(),ma()},a));let r=0,e=setInterval(()=>{r+=1;let a=ur();ma(),(a&&r>3||r>15)&&clearInterval(e)},500)}let{beautifyPagebar:So}=Cp({destroyPagebarChosen:vo}),{scheduleBeautifyPagebar:_o}=Ep({beautifyPagebar:So});function ba(){try{document.querySelectorAll("#drag-ul, ul#drag-ul").forEach(t=>{if(!t)return;let r=Array.from(t.children).filter(e=>e.tagName==="LI");if(!r.length){t.classList.add("urppp-empty"),t.style.setProperty("display","none","important");let e=t.closest("#xq-section, .widget-main, .widget-body");e&&!e.querySelector("li")&&(e.classList.add("urppp-empty"),e.style.setProperty("display","none","important"));return}t.classList.remove("urppp-empty"),t.classList.add("urppp-drag-ul"),t.style.removeProperty("display"),t.style.setProperty("height","auto","important"),t.style.setProperty("min-height","0","important"),r.forEach(e=>{let a=(e.textContent||"").replace(/\s+/g," ").trim(),i=(e.getAttribute("onclick")||"").includes("goDetail")||e.classList.contains("ui-selectee")||e.classList.contains("jc-future")||!!e.querySelector("a");!i&&/校区/.test(a)&&a.length<=12?(e.classList.add("xq-section"),e.classList.remove("ui-selectee","jc-future","urppp-building-active")):i&&!e.classList.contains("jc-future")&&e.classList.add("ui-selectee")})}),window.__urpppBuildingActiveBound||(window.__urpppBuildingActiveBound=!0,document.addEventListener("click",t=>{let r=t.target&&t.target.closest?t.target.closest("#drag-ul > li"):null;if(!r||r.classList.contains("xq-section")||r.classList.contains("jc-future"))return;let e=r.parentElement;e&&(e.querySelectorAll("li.urppp-building-active, li.ui-selected").forEach(a=>{a.classList.remove("urppp-building-active","ui-selected")}),r.classList.add("urppp-building-active","ui-selected"))},!0))}catch(t){console.warn("[URP++] free classroom list beautify failed",t)}}function ze(t){if(!t||!t.style)return;if(t.classList.contains("setLabelWidth")){t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",$r(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 16px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important");return}let r=!!(t.closest&&t.closest(".widget-box, .widget-main, .widget-body, .panel"));t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("min-width","0","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("clear","both","important");let e=t.parentElement&&t.parentElement.tagName==="FORM"?t.parentElement:null;e&&(e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("display","block","important"),e.style.setProperty("float","none","important"),e.style.setProperty("box-sizing","border-box","important"),e.style.setProperty("margin","0","important"));let a=t.closest&&t.closest(".tab-pane, .tab-content");if(a&&(a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("box-sizing","border-box","important")),r){t.style.setProperty("background","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("margin","0","important"),t.style.setProperty("box-shadow","none","important");return}t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",$r(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 18px 0","important"),!t.classList.contains("setLabelWidth")&&(t.classList.contains("urppp-query-form")||!!t.querySelector(".urppp-query-pair, .chosen-container"))?(t.style.setProperty("padding","14px 16px","important"),t.style.setProperty("overflow","visible","important")):(t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important"))}function ee(){try{ur(),document.querySelectorAll(".page-content .profile-user-info, #page-content-template .profile-user-info").forEach(a=>{ze(a)});let t=a=>{let i=a.closest(".profile-user-info, .urppp-query-form")||a.parentElement;if(!i)return Math.min(Math.max(a.querySelectorAll(":scope > .urppp-query-pair").length,1),4);let p=0;return i.querySelectorAll(":scope > .profile-info-row, .profile-info-row").forEach(s=>{let g=s.querySelectorAll(":scope > .urppp-query-pair").length;g>p&&(p=g)}),Math.min(Math.max(p,1),4)},r=a=>{let i=Array.from(a.querySelectorAll(":scope > .urppp-query-pair")),p=t(a);a.classList.add("urppp-query-row"),a.style.setProperty("display","grid","important"),a.style.removeProperty("grid-template-columns"),a.style.setProperty("column-gap","14px","important"),a.style.setProperty("row-gap","10px","important"),a.style.setProperty("align-items","center","important"),a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("box-sizing","border-box","important"),a.dataset.urpppQueryCols=String(p),i.forEach(s=>{s.style.removeProperty("grid-column")}),i.forEach(s=>{s.style.setProperty("display","flex","important"),s.style.setProperty("align-items","center","important"),s.style.setProperty("width","100%","important"),s.style.setProperty("min-width","0","important"),s.style.setProperty("max-width","100%","important"),s.style.setProperty("box-sizing","border-box","important"),s.style.removeProperty("flex");let g=s.querySelector(".profile-info-name"),b=s.querySelector(".profile-info-value");g&&(g.style.setProperty("float","none","important"),g.style.setProperty("display","flex","important"),g.style.setProperty("align-items","center","important"),g.style.setProperty("justify-content","flex-end","important"),g.style.setProperty("flex","0 0 var(--urppp-qlabel, 84px)","important"),g.style.setProperty("width","var(--urppp-qlabel, 84px)","important"),g.style.setProperty("min-width","var(--urppp-qlabel, 84px)","important"),g.style.setProperty("max-width","var(--urppp-qlabel-max, 96px)","important"),g.style.setProperty("margin","0","important"),g.style.setProperty("margin-left","0","important"),g.style.setProperty("padding","0 8px 0 0","important"),g.style.setProperty("background","transparent","important"),g.style.setProperty("border","none","important"),g.style.setProperty("border-right","none","important")),b&&(b.style.setProperty("float","none","important"),b.style.setProperty("display","flex","important"),b.style.setProperty("align-items","center","important"),b.style.setProperty("flex","1 1 auto","important"),b.style.setProperty("width","auto","important"),b.style.setProperty("min-width","0","important"),b.style.setProperty("max-width","none","important"),b.style.setProperty("margin","0","important"),b.style.setProperty("margin-left","0","important"),b.style.setProperty("padding","0","important"),b.style.setProperty("background","transparent","important"),b.style.setProperty("border","none","important"),b.querySelectorAll("input, select, .chosen-container, .form-control").forEach(_=>{_.style.setProperty("width","100%","important"),_.style.setProperty("min-width","0","important"),_.style.setProperty("max-width","none","important")})),s.querySelectorAll(".chosen-container").forEach(_=>{let M=_.previousElementSibling;M&&M.tagName==="SELECT"&&(M.style.setProperty("display","none","important"),M.classList.add("urppp-chosen-hidden"));let D=_.parentElement&&_.parentElement.querySelector("select");D&&(D.style.setProperty("display","none","important"),D.classList.add("urppp-chosen-hidden")),_.style.setProperty("width","100%","important"),_.style.setProperty("min-width","0","important"),_.style.setProperty("max-width","none","important");let P=_.querySelector(".chosen-single");if(P){P.style.setProperty("width","100%","important"),P.style.setProperty("max-width","none","important"),P.style.setProperty("display","flex","important"),P.style.setProperty("align-items","center","important"),P.style.setProperty("height","34px","important"),P.style.setProperty("line-height","normal","important");let B=P.querySelector(":scope > span, span");B&&(B.style.setProperty("line-height","normal","important"),B.style.setProperty("height","auto","important"),B.style.setProperty("margin-top","0","important"),B.style.setProperty("padding-top","0","important"));let G=P.querySelector("div");if(G){G.style.setProperty("display","flex","important"),G.style.setProperty("align-items","center","important"),G.style.setProperty("justify-content","center","important"),G.style.setProperty("top","0","important"),G.style.setProperty("bottom","0","important"),G.style.setProperty("height","auto","important");let F=G.querySelector("b");F&&(F.style.setProperty("margin","0","important"),F.style.setProperty("background-position","center center","important"),F.style.setProperty("background-size","12px 12px","important"),F.style.setProperty("width","14px","important"),F.style.setProperty("height","14px","important"))}}})})};document.querySelectorAll(".profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)").forEach(a=>{if(a.classList.contains("setLabelWidth")||a.closest&&a.closest("#curriculumInfo-divcon, #curriculumInfo-divcon1, #curriculumInfo-divcon2, #fajh, #xnxq, #kz, #kc, #kcfa"))return;let i=Array.from(a.querySelectorAll(".profile-info-row")).some(s=>Array.from(s.children).filter(g=>g.classList&&g.classList.contains("profile-info-name")).length>=2),p=!!a.querySelector("select.chosen, select.select, .chosen-container");if(!i&&!p){a.classList.remove("urppp-query-form");return}a.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')&&(a.classList.add("urppp-query-form"),ze(a),a.querySelectorAll(".profile-info-row").forEach(s=>{if(s.dataset.urpppQueryDone==="1"){s.querySelector(":scope > .urppp-query-pair")&&r(s);return}let g=Array.from(s.children).filter(D=>D.classList&&(D.classList.contains("profile-info-name")||D.classList.contains("profile-info-value"))),b=[];for(let D=0;D<g.length;){let P=g[D],B=g[D+1];P&&B&&P.classList.contains("profile-info-name")&&B.classList.contains("profile-info-value")?(b.push([P,B]),D+=2):D+=1}if(!b.length){s.dataset.urpppQueryDone="1";return}let _=document.createDocumentFragment(),M=new Set;for(b.forEach(([D,P])=>{let B=document.createElement("div");B.className="urppp-query-pair",B.appendChild(D),B.appendChild(P),M.add(D),M.add(P),_.appendChild(B)}),g.forEach(D=>{M.has(D)||_.appendChild(D)});s.firstChild;)s.removeChild(s.firstChild);s.appendChild(_),s.dataset.urpppQueryDone="1",r(s)}))}),ur()}catch(t){console.warn("[URP++] query form beautify failed",t)}}function Eo(){if(window.__urpppChosenAlignBound)return;window.__urpppChosenAlignBound=!0;let t=!1,r=e=>{if(!t){t=!0;try{let a=e&&e.querySelectorAll?e:document,i=document.getElementById("urppp-chosen-li-style");i||(i=document.createElement("style"),i.id="urppp-chosen-li-style",document.documentElement.appendChild(i)),i.textContent=[".self div.profile-info-value a.chosen-single > span,","body .self div.profile-info-value a.chosen-single > span {","  line-height: normal !important;","  height: auto !important;","  margin-top: 0 !important;","  padding-top: 0 !important;","}",".self div.profile-info-value a.chosen-single,","body .self div.profile-info-value a.chosen-single {","  display: flex !important;","  align-items: center !important;","  height: 34px !important;","  line-height: normal !important;","}","body .chosen-container .chosen-results li,","body .chosen-with-drop .chosen-results li,","html body .chosen-container .chosen-results li.active-result {","  display:flex !important;","  align-items:center !important;","  justify-content:flex-start !important;","  height:36px !important;","  min-height:36px !important;","  max-height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","  margin:0 !important;","  box-sizing:border-box !important;","}","body .chosen-container .chosen-results li.highlighted,","body .chosen-container .chosen-results li.result-selected {","  display:flex !important;","  align-items:center !important;","  height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","}"].join(""),a.querySelectorAll(".chosen-results li").forEach(p=>{p.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-start !important","height:36px !important","min-height:36px !important","max-height:36px !important","line-height:1 !important","padding:0 12px !important","margin:0 !important","box-sizing:border-box !important"].join(";")}),a.querySelectorAll("a.chosen-single").forEach(p=>{p.style.setProperty("display","flex","important"),p.style.setProperty("align-items","center","important"),p.style.setProperty("height","34px","important"),p.style.setProperty("min-height","34px","important"),p.style.setProperty("line-height","normal","important"),p.style.setProperty("padding-top","0","important"),p.style.setProperty("padding-bottom","0","important");let s=p.querySelector(":scope > span");s&&(s.style.setProperty("line-height","normal","important"),s.style.setProperty("height","auto","important"),s.style.setProperty("margin-top","0","important"),s.style.setProperty("margin-bottom","0","important"),s.style.setProperty("padding-top","0","important"),s.style.setProperty("padding-bottom","0","important"))}),a.querySelectorAll(".chosen-search").forEach(p=>{if(!p.querySelector(".urppp-chosen-search-icon")){let s=document.createElement("i");s.className="fa fa-search urppp-chosen-search-icon",s.setAttribute("aria-hidden","true"),p.appendChild(s)}})}finally{setTimeout(()=>{t=!1},0)}}};document.addEventListener("mousedown",e=>{let a=e.target&&e.target.closest?e.target.closest(".chosen-container"):null;a&&(setTimeout(()=>r(a),0),setTimeout(()=>r(a),30),setTimeout(()=>r(a),100),setTimeout(()=>r(a),200))},!0);try{let e=window.jQuery||window.$;e&&e.fn&&e(document).off("chosen:showing_dropdown.urppp chosen:updated.urppp").on("chosen:showing_dropdown.urppp chosen:updated.urppp",a=>{let i=a.target&&a.target.parentElement?a.target.parentElement:document;setTimeout(()=>r(i),0),setTimeout(()=>r(i),60)})}catch{}}function ha(){try{let t=document.getElementById("work_rest_schedule_modal");if(!t)return;(t.classList.contains("in")||t.classList.contains("show"))&&t.style.setProperty("display","block","important");let r=t.querySelector(".modal-body")||t,e=Array.from(r.querySelectorAll("table"));if(!e.length)return;let a=s=>(s||"").replace(/\s+/g," ").trim(),i=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");if(r.dataset.urpppWrsDone==="1")return;r.dataset.urpppWrsDone="1",e.forEach(s=>{let g=s.closest(".urppp-table-wrap");g&&t.contains(g)&&g.parentElement&&(g.parentElement.insertBefore(s,g),g.remove()),s.classList.add("urppp-wrs-table"),s.style.setProperty("width","100%","important");let b=Array.from(s.rows||[]);if(!b.length)return;let _=0;b.forEach(M=>{let D=a(M.textContent);if(!/\d{1,2}:\d{2}/.test(D))return;let P=0;Array.from(M.cells||[]).forEach(B=>{P+=B.colSpan||1}),P>_&&(_=P)}),_<4&&b.forEach(M=>{let D=0;Array.from(M.cells||[]).forEach(P=>{D+=P.colSpan||1}),D>_&&(_=D)}),_<1&&(_=1),Array.from(s.rows||[]).forEach(M=>{let D=Array.from(M.cells||[]);if(!D.length)return;let P=a(M.textContent);if(!/\d{1,2}:\d{2}/.test(P)&&(/作息时间|学年/.test(P)||/(望江|华西|江安)/.test(P)&&/校区|时间|安排|作息/.test(P))){let F=P;M.className="urppp-wrs-title-row",M.innerHTML='<td class="urppp-wrs-title" colspan="'+_+'" align="center">'+i(F)+"</td>";return}D.forEach(F=>{["border","borderTop","borderRight","borderBottom","borderLeft","textAlign","verticalAlign","width"].forEach(N=>{try{F.style[N]=""}catch{}}),F.classList.remove("urppp-wrs-title","urppp-wrs-period","urppp-wrs-time","urppp-wrs-head");let H=a(F.textContent);H&&(/^(上午|下午|晚上|中午)$/.test(H)||(F.rowSpan||1)>1&&/上午|下午|晚上|中午/.test(H)?F.classList.add("urppp-wrs-period"):/节次|大节|时间|校区/.test(H)&&!/\d{1,2}:\d{2}/.test(H)&&!/第\d/.test(H)?/节次|时间|大节|校区/.test(P)&&!/\d{1,2}:\d{2}/.test(P)&&F.classList.add("urppp-wrs-head"):/\d{1,2}:\d{2}/.test(H)&&F.classList.add("urppp-wrs-time"),F.style.setProperty("text-align","center","important"),F.style.setProperty("vertical-align","middle","important"))})})});let p=t.querySelector(".modal-title");p&&(p.style.setProperty("text-align","center","important"),p.style.setProperty("width","100%","important")),r.dataset.urpppWrsDone="1"}catch{}}let Co="https://jwc.scu.edu.cn/cdxl.htm";function ga(){let t=['a[onclick*="jwc.scu.edu.cn/article/206"]','a[href*="jwc.scu.edu.cn/article/206"]',".cdsj a",".ace-nav a"],r=new Set;t.forEach(e=>{document.querySelectorAll(e).forEach(a=>{if(r.has(a))return;r.add(a);let i=(a.textContent||"").replace(/\s+/g,""),p=a.getAttribute("onclick")||"",s=a.getAttribute("href")||"";(i.includes("学校校历")||p.includes("article/206")||s.includes("article/206")||p.includes("jwc.scu.edu.cn")&&i.includes("校历"))&&(a.setAttribute("href",Co),a.setAttribute("target","_blank"),a.setAttribute("rel","noopener noreferrer"),a.setAttribute("onclick",`window.open('${Co}');return false;`))})})}function Le(){document.querySelectorAll("#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static").forEach(t=>{if(!t.querySelector(".nav-tabs"))return;["background","background-color","background-image","border","border-radius","box-shadow"].forEach(a=>{t.style.setProperty(a,a.startsWith("background")||a==="box-shadow"?a==="box-shadow"?"none":"transparent":a==="border"?"none":"0","important")}),t.style.setProperty("background","transparent","important"),t.style.setProperty("background-color","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("width","100%","important"),t.style.setProperty("margin","0 0 14px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("min-height","0","important"),t.style.setProperty("box-sizing","border-box","important");let r=t.querySelector(".navbar-inner");r&&(r.style.setProperty("background","transparent","important"),r.style.setProperty("border","none","important"),r.style.setProperty("box-shadow","none","important"),r.style.setProperty("padding","0","important"),r.style.setProperty("min-height","0","important"),r.style.setProperty("filter","none","important"),r.style.setProperty("width","100%","important")),t.querySelectorAll(".container, .container-fluid").forEach(a=>{a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("margin","0","important"),a.style.setProperty("margin-left","0","important"),a.style.setProperty("padding","0","important"),a.style.setProperty("background","transparent","important"),a.style.setProperty("box-sizing","border-box","important")});let e=t.querySelector(".nav-tabs");e&&(e.style.setProperty("width","100%","important"),e.style.setProperty("margin","0","important"),e.style.setProperty("padding","8px 10px","important"),e.style.setProperty("background","var(--surface)","important"),e.style.setProperty("background-color","var(--surface)","important"),e.style.setProperty("border",$r(),"important"),e.style.setProperty("border-radius","12px","important"),e.style.setProperty("box-sizing","border-box","important"))})}function Ir(){let t=r=>{let e=NaN,a=[r.getAttribute("data-percent"),r.querySelector("[data-percent]")?.getAttribute("data-percent"),r.querySelector(".percent")?.textContent,r.querySelector(".urppp-pct-text")?.textContent];for(let i of a){if(i==null||i==="")continue;let p=parseFloat(String(i).replace(/[^\d.]/g,""));if(!Number.isNaN(p)){e=p;break}}if(Number.isNaN(e)){let i=(r.textContent||"").match(/(\d+(?:\.\d+)?)\s*%/);i&&(e=parseFloat(i[1]))}if(Number.isNaN(e)){let i=r.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');if(i){let p=String(i.style.width||"").match(/([\d.]+)%/);p&&(e=parseFloat(p[1]))}}return Number.isNaN(e)?null:Math.max(0,Math.min(100,e))};document.querySelectorAll(".infobox").forEach(r=>{let e=t(r);if(e==null)return;r.querySelectorAll("canvas").forEach(s=>s.remove()),r.querySelectorAll(".easy-pie-chart, .percentage, .infobox-progress").forEach(s=>{s.classList.contains("urppp-pct-bar")||s.remove()}),r.querySelectorAll(".urppp-pct-text, .urppp-pct-bar").forEach(s=>s.remove());let a=r.querySelector(".infobox-data")||r,i=document.createElement("div");i.className="urppp-pct-text",i.textContent=Math.round(e)+"%";let p=document.createElement("div");if(p.className="urppp-pct-bar"+(e<=0?" is-empty":""),e>0){let s=document.createElement("span");s.className="urppp-pct-fill",s.style.width=e+"%",p.appendChild(s)}a.insertBefore(p,a.firstChild),a.insertBefore(i,a.firstChild),r.dataset.urpppPctDone="1"})}function ae(t){let r=document.getElementById("treeDemo");if(!r)return;let e=!!(t&&t.force);if(r.dataset.urpppBusy==="1"&&!(t&&t.ignoreBusy))return;let a=r.closest('div[style*="border"]')||r.closest("#tree_div")?.parentElement||r.parentElement;a&&a.classList.add("urppp-plan-tree-shell"),r.classList.add("urppp-ztree");let i=typeof unsafeWindow<"u"?unsafeWindow:window,p=()=>{try{return(i.jQuery||i.$||window.jQuery||window.$)?.fn?.zTree?.getZTreeObj?.("treeDemo")||null}catch{return null}},s=()=>{let H=Array.from(r.querySelectorAll('span.button.switch[class*="_open"]')).filter(N=>!/_docu\b/.test(N.className));return H.reverse().forEach(N=>{try{N.click()}catch{}}),H.length>0},g=()=>{let H=p();if(H)try{H.expandAll(!1)}catch{}return r.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')&&s(),!0};if(!window.__urpppExpandKzPatched){window.__urpppExpandKzPatched=!0;let H=()=>{let N=typeof unsafeWindow<"u"?unsafeWindow:window;try{N.expandKzByRule=function(){r.dataset.urpppUserExpanded||g()}}catch{}};H(),setTimeout(H,0),setTimeout(H,200)}r.dataset.urpppCollapsedOnce||(r.dataset.urpppCollapsedOnce="1",[0,80,200,500,1e3].forEach(H=>setTimeout(()=>{r.dataset.urpppUserExpanded||g()},H)));let b=document.querySelector("#two h4.header, #two .header");if(b&&!b.dataset.urpppLegendDone){let H=b.querySelector("font");if(H){let N=document.createElement("div");N.className="urppp-plan-legend",N.innerHTML=['<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>','<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>','<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>','<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>','<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>'].join(""),H.replaceWith(N)}b.classList.add("urppp-plan-header"),b.dataset.urpppLegendDone="1"}let _=()=>{if(r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}},M=()=>{r.dataset.urpppBusy="0";let H=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&H)try{window.__urpppPlanTreeObs.observe(H,{childList:!0,subtree:!0})}catch{}},D=H=>{let N=H;return N=N.replace(/\((最低修读学分:[^)]+)\)/g,(X,dt)=>{let yt=dt.split(",").map(zt=>zt.trim()).filter(Boolean),St=[];return yt.forEach(zt=>{/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(zt)&&St.push(zt)}),`<span class="urppp-sub">${(St.length?St:yt).map(zt=>{let Dt=zt.match(/^([^:：]+)[:：]\s*(.+)$/);if(!Dt)return zt;let jt=Dt[1].trim(),qt=Dt[2].trim(),tr="neutral";return/通过|已及格/.test(jt)?tr="ok":/未修读|未及格/.test(jt)?tr=Number(qt)>0?"warn":"muted":/最低/.test(jt)&&(tr="req"),`<span class="urppp-kv ${tr}"><em>${jt}</em><b>${qt}</b></span>`}).join("")}</span>`}),N=N.replace(/\[(\d{6,})\]/g,'<span class="urppp-code">$1</span>'),N=N.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g,'<span class="urppp-meta">$1</span>'),N=N.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g,(X,dt,yt)=>{let St=String(yt).trim(),Pt=St.match(/^(.+?)(?:\((\d{6,8})\))?$/),zt=(Pt?Pt[1]:St).trim(),Dt=Pt&&Pt[2]?Pt[2]:"",jt=parseFloat(zt),qt=!1;Number.isNaN(jt)?/不及格|未通过|不通过/.test(zt)?qt=!1:(/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(zt),qt=!0):qt=jt>=60;let tr=Dt?`<i>${Dt}</i>`:"";return`<span class="urppp-score ${qt?"pass":"fail"}"><b>${dt}</b><em>${zt}</em>${tr}</span>`}),N=N.replace(/(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,'$1<span class="urppp-title">$2</span>'),N=N.replace(/(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,'$1 <span class="urppp-gname">$2</span>'),N=N.replace(/(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,"$1 "),N},P=H=>{let N=H.querySelector("i.fa, i.ace-icon"),X=H.closest("li");X&&(X.classList.remove("urppp-node-done","urppp-node-todo","urppp-node-pass","urppp-node-fail","urppp-node-pending"),N&&(N.classList.contains("fa-check-square-o")?X.classList.add("urppp-node-done"):N.classList.contains("fa-smile-o")?X.classList.add("urppp-node-pass"):N.classList.contains("fa-frown-o")?X.classList.add("urppp-node-fail"):N.classList.contains("fa-meh-o")?X.classList.add("urppp-node-pending"):N.classList.contains("fa-kz")&&X.classList.add("urppp-node-todo")))},B=H=>{if(!H||!e&&H.dataset.urpppNodeDone==="1")return!1;P(H);let N=H.querySelector("span.node_name")||H;if(!N)return!1;if(!e&&N.querySelector(".urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname"))H.dataset.urpppNodeDone="1";else{let dt=N.dataset.urpppRaw;dt||(N.querySelector(".urppp-score, .urppp-code, .urppp-sub")?(H.dataset.urpppNodeDone="1",dt=null):(dt=N.innerHTML,dt&&(N.dataset.urpppRaw=dt))),dt&&(N.innerHTML=D(dt),H.dataset.urpppNodeDone="1")}let X=H.parentElement&&H.parentElement.querySelector(":scope > span.button.switch");return X&&(X.dataset.urpppSw||(X.dataset.urpppSw="1",/_docu\b/.test(X.className)&&(X.classList.add("urppp-switch-leaf"),X.style.setProperty("display","none","important"))),/_docu\b/.test(X.className)||X.classList.contains("urppp-switch-leaf")?H.classList.remove("urppp-expandable"):H.classList.add("urppp-expandable")),!0},G=(H,N)=>{let X=Array.from(H||[]),dt=0,yt=()=>{let St=Math.min(dt+48,X.length);for(;dt<St;dt++)B(X[dt]);dt<X.length?window.requestIdleCallback?requestIdleCallback(yt,{timeout:120}):setTimeout(yt,0):N&&N()};yt()},F=H=>{let N=H||r;N.querySelectorAll("span.button.switch:not([data-urppp-sw])").forEach(X=>{X.dataset.urpppSw="1",/_docu\b/.test(X.className)&&(X.classList.add("urppp-switch-leaf"),X.style.setProperty("display","none","important"))}),N.querySelectorAll("li > a").forEach(X=>B(X))};_();try{F(r),r.dataset.urpppExpandClick||(r.dataset.urpppExpandClick="1",r.addEventListener("click",N=>{if(N.target.closest&&N.target.closest("span.button.switch")){let Pt=N.target.closest("span.button.switch"),zt=Pt&&Pt.parentElement;if(!zt||/_docu\b/.test(Pt.className))return;if(r.dataset.urpppUserExpanded="1",r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}setTimeout(()=>{F(zt),r.dataset.urpppBusy="0";let Dt=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&Dt)try{window.__urpppPlanTreeObs.observe(Dt,{childList:!0,subtree:!0})}catch{}},0);return}let X=N.target&&N.target.closest?N.target.closest("li > a"):null;if(!X||!r.contains(X))return;let dt=X.parentElement;if(!dt)return;let yt=dt.querySelector(":scope > span.button.switch");if(!yt||/_docu\b/.test(yt.className)||yt.classList.contains("urppp-switch-leaf")||!X.classList.contains("urppp-expandable")&&!/_open|_close/.test(yt.className))return;if(N.preventDefault(),N.stopImmediatePropagation(),r.dataset.urpppUserExpanded="1",r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}yt.click(),F(dt),r.dataset.urpppBusy="0";let St=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&St)try{window.__urpppPlanTreeObs.observe(St,{childList:!0,subtree:!0})}catch{}},!0));let H=(N,X)=>{let dt=document.getElementById(N);return!dt||dt.dataset.urpppBound==="1"?!1:(dt.dataset.urpppBound="1",dt.addEventListener("click",yt=>{yt.preventDefault(),yt.stopImmediatePropagation(),r.dataset.urpppUserExpanded="1",_();try{let St=p();if(X){St?St.expandAll(!0):r.querySelectorAll('span.button.switch[class*="_close"]').forEach(zt=>{/_docu\b/.test(zt.className)||zt.click()});let Pt=r.querySelectorAll('li > a:not([data-urppp-node-done="1"])');G(Pt,M)}else{if(St)try{St.expandAll(!1)}catch{}s(),setTimeout(()=>{r.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')&&s(),M()},0)}}catch{X||s(),M()}},!0),!0)};H("expandAllBtn",!0),H("collapseAllBtn",!1),r.dataset.urpppAllBtnsRetry||(r.dataset.urpppAllBtnsRetry="1",setTimeout(()=>{H("expandAllBtn",!0),H("collapseAllBtn",!1)},300),setTimeout(()=>{H("expandAllBtn",!0),H("collapseAllBtn",!1)},1e3))}finally{requestAnimationFrame(()=>{requestAnimationFrame(M)})}}function oe(){if(!cr())try{let t=document.getElementById("soliderbox");if(t){t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","720px","important"),t.style.setProperty("min-width","0","important"),t.classList.remove("container");let i=t.closest(".profile-info-row");i&&(i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("width","100%","important"),i.style.setProperty("max-width","100%","important"));let p=t.closest(".profile-info-value");p&&(p.style.setProperty("width","auto","important"),p.style.setProperty("max-width","100%","important"),p.style.setProperty("flex","1 1 auto","important"),p.style.setProperty("min-width","0","important"))}let r=document.getElementById("mycoursetable");if(!r)return;let e=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches);r.classList.toggle("urppp-mobile-schedule-scroll",e),r.style.setProperty("position","relative","important"),r.style.setProperty("width","100%","important");let a=72;e||r.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(i=>{let p=i.offsetHeight||0;p>a&&(a=p)}),a<56&&(a=72),r.querySelectorAll("div.class_div").forEach(i=>{let p=parseInt(i.getAttribute("classNum")||"1",10)||1,s=i.scrollHeight||0;if(s>0){let g=Math.ceil(s/p);a=e?Math.max(a,Math.min(g,88)):Math.max(a,g)}}),e?a=Math.min(Math.max(a,72),88):(a<64&&(a=72),a>160&&(a=120)),r.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(i=>{i.style.setProperty("height",a+"px","important")}),r.querySelectorAll("td").forEach(i=>{let p=Array.from(i.querySelectorAll(":scope > div.class_div"));if(!p.length)return;i.style.setProperty("position","relative","important"),i.style.setProperty("vertical-align","top","important"),i.style.setProperty("overflow","visible","important");let s=i.getBoundingClientRect().width||i.offsetWidth||i.clientWidth||0,g=getComputedStyle(i),b=i.closest("table"),_=b?getComputedStyle(b):null,M=parseFloat(g.borderLeftWidth)||0,D=_&&_.borderCollapse==="collapse"?M/2:M,P=Math.max(1,p.length);p.forEach((B,G)=>{let F=parseInt(B.getAttribute("classNum")||"1",10)||1,H=ap(s,P,G,D),N=H.left,X=H.width;B.style.setProperty("position","absolute","important"),B.style.setProperty("top","0px","important"),B.style.setProperty("left",N+"px","important"),B.style.setProperty("right","auto","important"),B.style.setProperty("bottom","auto","important"),B.style.setProperty("transform","none","important"),B.style.setProperty("width",X+"px","important"),B.style.setProperty("max-width","none","important"),B.style.setProperty("height",a*F+"px","important"),B.style.setProperty("margin","0","important"),B.style.setProperty("box-sizing","border-box","important"),B.style.setProperty("z-index","2","important"),B.style.setProperty("overflow","hidden","important")})})}catch(t){console.warn("[URP++] week schedule fix failed",t)}}function fa(){try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;if(!t||t.__urpppDivBuildPatched||typeof t.divBuild!="function")return;t.__urpppDivBuildPatched=!0;let r=t.divBuild;t.__urpppOriginalDivBuild=r,t.divBuild=function(){try{oe()}catch{try{return r.apply(this,arguments)}catch{}}};try{t.divBuild._urppp=!0}catch{}}catch(t){console.warn("[URP++] patch divBuild failed",t)}}let Nr=null,Po=!1;function zo(){let t=document.getElementById("mycoursetable")||document.getElementById("page-content-template")||document.body;if(Nr&&Nr.root===t&&t?.isConnected){oe();return}Nr&&Nr.disconnect(),Nr=null;let r=!Po;Po=!0;let e=!1,a=()=>{if(!(e||cr())&&!(!document.getElementById("soliderbox")&&!document.getElementById("mycoursetable"))){e=!0;try{fa(),oe()}finally{setTimeout(()=>{e=!1},40)}}};fa(),[0,50,150,400,1e3,2e3].forEach(s=>setTimeout(()=>{fa(),a()},s)),r&&window.addEventListener("resize",()=>{clearTimeout(window.__urpppWeekSchedResize),window.__urpppWeekSchedResize=setTimeout(a,120)});let i=s=>{if(!s||cr())return;let g=[];s.nodeType===1&&(s.matches&&s.matches("div.class_div")&&g.push(s),s.querySelectorAll&&s.querySelectorAll("div.class_div").forEach(b=>g.push(b))),g.forEach(b=>{let _=b.parentElement;_&&_.tagName==="TD"&&_.style.setProperty("position","relative","important"),b.style.setProperty("position","absolute","important"),b.style.setProperty("top","0px","important"),b.style.setProperty("left","0px","important"),b.style.setProperty("right","auto","important"),b.style.setProperty("transform","none","important"),b.style.setProperty("width","100%","important"),b.style.setProperty("margin","0","important"),b.style.setProperty("box-sizing","border-box","important")})},p=new MutationObserver(s=>{if(cr())return;let g=!1;s.forEach(b=>{if(b.type==="childList"&&b.addedNodes.forEach(_=>{i(_),g=!0}),b.type==="attributes"&&b.attributeName==="style"&&b.target&&b.target.classList&&b.target.classList.contains("class_div")){let _=b.target,M=_.style.left||"",D=parseFloat(M);(!M||M==="auto"||Number.isFinite(D)&&D>200)&&(_.style.setProperty("left","0px","important"),_.style.setProperty("top","0px","important"),_.style.setProperty("position","absolute","important")),g=!0}}),g&&(clearTimeout(window.__urpppWeekSchedMut),window.__urpppWeekSchedMut=setTimeout(()=>{requestAnimationFrame(a)},16))});if(t){p.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]});let s=null,g=0,b=0;if(t.id==="mycoursetable"&&typeof window.ResizeObserver=="function"){let _=t.getBoundingClientRect().width||0;s=new window.ResizeObserver(M=>{let D=M[0]?.contentRect?.width||t.getBoundingClientRect().width||0;!D||Math.abs(D-_)<.5||(_=D,g||(g=requestAnimationFrame(()=>{g=0,a()})),clearTimeout(b),b=setTimeout(a,80))}),s.observe(t)}Nr={root:t,observer:p,disconnect(){p.disconnect(),s&&s.disconnect(),g&&cancelAnimationFrame(g),clearTimeout(b)}}}r&&document.addEventListener("mouseup",()=>{document.getElementById("soliderbox")&&(setTimeout(a,200),setTimeout(a,500))},!0)}function Lo(){try{let t=document.getElementById("curriculumInfo-divcon2");if(!t)return;let r=parseFloat(t.style.width||getComputedStyle(t).width||"0");if(!r||r<40)return;t.classList.add("urppp-curriculum-drawer");let e=t.querySelector(".modal-body");if(!e)return;let a=e.querySelector(":scope > .col-xs-12 > .row")||e.querySelector(".col-xs-12 > .row")||e.querySelector(".row");if(!a)return;a.classList.add("urppp-drawer-layout");let i=a.querySelector(":scope > .urppp-drawer-toolbar, :scope > p");i&&i.tagName==="P"&&i.classList.add("urppp-drawer-toolbar");let p=a.querySelector(":scope > .urppp-drawer-body"),s=a.querySelector(".urppp-drawer-left"),g=a.querySelector(".urppp-drawer-right");p||(p=document.createElement("div"),p.className="urppp-drawer-body"),s||(s=document.createElement("div"),s.className="urppp-drawer-left"),g||(g=document.createElement("div"),g.className="urppp-drawer-right"),p.contains(s)||p.appendChild(s),p.contains(g)||p.appendChild(g),p.parentElement!==a&&(i&&i.parentElement===a?a.insertBefore(p,i.nextSibling):a.appendChild(p)),i&&a.firstElementChild!==i&&a.insertBefore(i,a.firstElementChild);let b=a.querySelector("#treeDemo, .ztree")||t.querySelector("#treeDemo, .ztree"),_=null;if(b){_=b.closest(".col-xs-6, .col-sm-6, .widget-box")||b.parentElement;let G=b.closest(".col-xs-6, .col-sm-6");G&&(_=G)}let M=["fajh","xnxq","kz","kc","kcfa"],D=M.map(G=>document.getElementById(G)).filter(G=>G&&t.contains(G));_&&_.parentElement!==s&&s.appendChild(_),Array.from(s.children).forEach(G=>{(M.includes(G.id)||G.id&&M.includes(G.id)||G!==_&&G.querySelector&&!G.querySelector("#treeDemo, .ztree")&&G.classList&&G.classList.contains("col-xs-6"))&&g.appendChild(G)}),M.forEach(G=>{let F=document.getElementById(G);!F||!t.contains(F)||(F.parentElement!==g&&g.appendChild(F),F.style.setProperty("width","100%","important"),F.style.setProperty("max-width","100%","important"),F.style.setProperty("float","none","important"),F.style.setProperty("margin","0","important"),F.style.setProperty("padding","0","important"),F.style.setProperty("box-sizing","border-box","important"),F.style.display!=="none"&&getComputedStyle(F).display!=="none"&&F.style.setProperty("display","block","important"))});let P=document.getElementById("fajh");P&&t.contains(P)&&(P.parentElement!==g&&g.appendChild(P),(!P.innerHTML||!P.innerHTML.trim())&&!P.querySelector(".urppp-drawer-skeleton, .profile-user-info, .widget-box")&&(P.innerHTML=["<div class='widget-box transparent urppp-drawer-skeleton'>","  <div class='widget-header widget-header-small'>","    <h4 class='widget-title smaller grey'>方案计划信息</h4>","  </div>","</div>","<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>","  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>","</div>"].join(""),P.style.setProperty("display","block","important"),P.dataset.urpppSkeleton="1"),P.dataset.urpppSkeleton==="1"&&P.querySelector(".profile-info-value")&&/方案名称|计划名称|年级|院系/.test(P.textContent||"")&&(delete P.dataset.urpppSkeleton,P.querySelectorAll(".urppp-drawer-skeleton, .urppp-drawer-skeleton-card").forEach(F=>F.remove())),P.innerHTML&&P.innerHTML.trim()&&P.style.display==="none"&&(P.dataset.urpppSkeleton==="1"||P.querySelector(".profile-user-info"))&&P.style.setProperty("display","block","important")),g.style.setProperty("min-height","240px","important"),s.style.setProperty("min-height","240px","important"),_&&(_.style.setProperty("width","100%","important"),_.style.setProperty("max-width","100%","important"),_.style.setProperty("float","none","important"),_.style.setProperty("margin","0","important"),_.style.setProperty("padding","0","important"),_.style.setProperty("border","none","important"),_.style.setProperty("box-sizing","border-box","important"));let B=s.querySelector(".widget-box");B&&(B.style.setProperty("width","100%","important"),B.style.setProperty("margin","0","important"),B.style.setProperty("border",$r(),"important"),B.style.setProperty("border-radius","12px","important"),B.style.setProperty("overflow","hidden","important"),B.style.setProperty("background","var(--surface)","important")),t.querySelectorAll(".profile-info-row").forEach(G=>{G.classList.remove("urppp-query-row","urppp-dual-pair"),G.style.setProperty("display","grid","important"),G.style.setProperty("grid-template-columns","112px minmax(0,1fr)","important"),G.style.setProperty("width","100%","important"),Array.from(G.children).forEach(F=>{F.classList&&(F.style.setProperty("float","none","important"),F.style.setProperty("margin-left","0","important"),F.style.setProperty("width","auto","important"),F.style.setProperty("max-width","none","important"))})}),t.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(G=>{G.classList.remove("urppp-query-form");try{ze(G)}catch{}G.querySelectorAll(".profile-info-value, .profile-info-value span, span.editable").forEach(F=>{F.style.setProperty("color","var(--text)","important"),F.style.setProperty("opacity","1","important"),F.style.setProperty("visibility","visible","important")}),G.style.setProperty("border-radius","12px","important"),G.style.setProperty("overflow","hidden","important"),G.style.setProperty("width","100%","important"),G.style.setProperty("max-width","100%","important"),G.style.setProperty("display","block","important"),G.style.setProperty("box-sizing","border-box","important")})}catch(t){console.warn("[URP++] curriculum drawer beautify failed",t)}}function Ti(){if(window.__urpppCurriculumDrawerBound)return;window.__urpppCurriculumDrawerBound=!0;let t=()=>Lo();[0,50,150,350,800,1600].forEach(a=>setTimeout(t,a));let r=new MutationObserver(a=>{a.some(p=>!!(p.type==="childList"||p.type==="attributes"&&p.target&&(p.target.id==="curriculumInfo-divcon2"||p.target.id==="fajh")))&&(clearTimeout(window.__urpppCurriculumDrawerTimer),window.__urpppCurriculumDrawerTimer=setTimeout(()=>requestAnimationFrame(t),16))}),e=document.getElementById("curriculumInfo-divcon2");e&&r.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),document.addEventListener("click",a=>{if(!document.getElementById("curriculumInfo-divcon2"))return;let i=a.target&&a.target.closest?a.target.closest("a,button,span,div"):null,p=(i&&i.textContent||"").replace(/\s+/g,"");(/培养方案|与我相关|方案计划|自动化培养/.test(p)||i&&i.closest&&i.closest("#curriculumInfo-divcon2"))&&(setTimeout(t,0),setTimeout(t,50),setTimeout(t,150),setTimeout(t,400))},!0)}let{scheduleScrubTableInlineBg:qo,scrubTableHeaderInlineBg:Mi}=_p({isNativePdfIsolationActive:cr}),{disarmNoticeTableHover:$i,pinNoticeRowSurface:To,scrubNoticeInlineBg:Mo,stripMistakenNoticeTable:$o}=zp({getCurrentTheme:Yt});function xa(){try{let t=document.querySelector("h4.header, h3.header, h4, h3, .breadcrumb, .page-header");return wp({pathname:location.pathname,href:location.href,title:document.title,headingText:t?.textContent||""})}catch{return!1}}function Ii(t){return to(t,{noticePage:xa()})}function ya(t){return kp(t,{noticePage:xa()})}let Io,{bindNoticeHoverScrub:Ni,scheduleBeautifyNoticeTables:No}=Pp({beautifyNoticeTables:t=>Io(t),pinNoticeRowSurface:To});({beautifyNoticeTables:Io}=Lp({isNativePdfIsolationActive:cr,bindNoticeHoverScrub:Ni,scrubNoticeInlineBg:Mo,stripMistakenNoticeTable:$o,disarmNoticeTableHover:$i,pinNoticeRowSurface:To,isBusinessDataTable:ya,isNoticeListTable:Ii,isNoticePageContext:xa,isNoticeBulletText:Za}));let{wrapTables:Bo,bindTableWrapObserver:Fo}=Ap({isNativePdfIsolationActive:cr,isBusinessDataTable:ya});function ne(){try{document.querySelectorAll(".modal").forEach(r=>{if(!r||!r.style)return;r.style.getPropertyPriority("display")==="important"&&r.style.removeProperty("display"),r.classList.contains("in")||r.classList.contains("show")?r.style.display==="none"&&r.style.removeProperty("display"):(r.style.display==="block"||getComputedStyle(r).display!=="none")&&(r.style.setProperty("display","none","important"),setTimeout(()=>{try{!r.classList.contains("in")&&!r.classList.contains("show")&&(r.style.getPropertyPriority("display")==="important"&&r.style.removeProperty("display"),r.style.display="none")}catch{}},0))}),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(r=>{try{r.parentElement&&r.parentElement.removeChild(r)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right")))}catch{}}function Bi(){if(window.__urpppModalOpenPatched)return;window.__urpppModalOpenPatched=!0;let t=p=>{!p||!p.style||(p.style.getPropertyPriority("display")==="important"&&p.style.removeProperty("display"),p.style.getPropertyPriority("opacity")==="important"&&p.style.removeProperty("opacity"),p.style.getPropertyPriority("pointer-events")==="important"&&p.style.removeProperty("pointer-events"),p.style.getPropertyPriority("visibility")==="important"&&p.style.removeProperty("visibility"))},r=p=>{if(!(!p||!p.classList))try{p.classList.remove("in","show"),p.setAttribute("aria-hidden","true"),p.style.removeProperty("display"),p.style.setProperty("display","none","important"),setTimeout(()=>{try{!p.classList.contains("in")&&!p.classList.contains("show")&&(p.style.getPropertyPriority("display")==="important"&&p.style.removeProperty("display"),p.style.display="none")}catch{}},30)}catch{}},e=()=>{document.querySelectorAll(".modal-backdrop").forEach(p=>{try{p.parentElement&&p.parentElement.removeChild(p)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"),document.body.style.removeProperty("overflow"))},a=p=>{if(p){if(p.classList&&p.classList.contains("modal-backdrop")&&(p=document.querySelector(".modal.in, .modal.show")||p),!p||!p.classList||!p.classList.contains("modal")){e();return}t(p),r(p),e();try{let s=typeof Pe=="function"&&Pe()||typeof unsafeWindow<"u"&&(unsafeWindow.jQuery||unsafeWindow.$)||window.jQuery||window.$;if(s&&s.fn&&typeof s.fn.modal=="function"){try{s(p).trigger("hide.bs.modal")}catch{}try{s(p).modal("hide")}catch{}try{s(p).trigger("hidden.bs.modal")}catch{}}}catch{}setTimeout(()=>{r(p),document.querySelector(".modal.in, .modal.show")||e();try{ne()}catch{}},0)}};document.addEventListener("show.bs.modal",p=>{let s=p.target;if(!(!s||!s.classList||!s.classList.contains("modal"))){t(s),s.style.display==="none"&&s.style.removeProperty("display");try{s.getAttribute("data-backdrop")==="static"&&s.setAttribute("data-backdrop","true"),s.dataset&&(s.dataset.backdrop="true")}catch{}}},!0),document.addEventListener("hide.bs.modal",p=>{let s=p.target;!s||!s.classList||!s.classList.contains("modal")||t(s)},!0),document.addEventListener("hidden.bs.modal",p=>{let s=p.target;!s||!s.classList||!s.classList.contains("modal")||(r(s),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(g=>{try{g.parentElement&&g.parentElement.removeChild(g)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"))))},!0);let i=p=>{let s=p.target;if(!s||!s.closest||s.closest(".modal-dialog, .modal-content, .modal-header, .modal-body, .modal-footer")&&!s.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return;if(s.classList&&s.classList.contains("modal-backdrop")){let M=document.querySelector(".modal.in, .modal.show")||document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"]');M?(p.preventDefault(),p.stopPropagation(),a(M)):(p.preventDefault(),e(),ne());return}let g=null;if(s.classList&&s.classList.contains("modal")?g=s:g=s.closest(".modal.in, .modal.show, .modal"),!g||!g.classList.contains("modal")||!(g.classList.contains("in")||g.classList.contains("show")||getComputedStyle(g).display!=="none"))return;let _=g.querySelector(".modal-dialog");if(_){let M=_.getBoundingClientRect(),D=p.clientX,P=p.clientY;if(D>=M.left&&D<=M.right&&P>=M.top&&P<=M.bottom&&!s.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return}else if(s.closest(".modal-content"))return;p.preventDefault(),p.stopPropagation(),a(g)};document.addEventListener("pointerdown",i,!0),document.addEventListener("mousedown",i,!0),document.addEventListener("click",i,!0),document.addEventListener("click",p=>{let s=p.target&&p.target.closest?p.target.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'):null;if(!s)return;let g=s.closest(".modal");g&&(p.preventDefault(),p.stopPropagation(),a(g)),setTimeout(()=>{try{ne()}catch{}},50),setTimeout(()=>{try{ne()}catch{}},220)},!0),document.addEventListener("click",p=>{let s=p.target&&p.target.closest?p.target.closest("a,button,td,span,div,i"):null;if(!s)return;["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon","billContainer"].forEach(b=>{let _=document.getElementById(b);_&&(t(_),_.style.opacity==="0"&&_.style.removeProperty("opacity"),_.style.pointerEvents==="none"&&_.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(b=>t(b));let g=s.getAttribute&&(s.getAttribute("data-target")||s.getAttribute("href")||"");if(g&&g.charAt(0)==="#"){let b=document.querySelector(g);b&&t(b)}},!0)}let Br=null,va=0;function wa(){if(cr())return;let t=document.getElementById("courseTable");t&&t.querySelectorAll("td").forEach(r=>{let e=r.style.backgroundColor;if(!e||!e.includes("rgba"))return;let a=e.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);a&&(r.style.backgroundColor=`rgba(${a[1]},${a[2]},${a[3]},0.5)`)})}function Do(){let t=document.getElementById("mycoursetable")||document.getElementById("courseTable");if(Br&&Br.root===t&&t?.isConnected){wa();return}if(clearTimeout(va),Br&&Br.observer.disconnect(),Br=null,!t)return;let r=new MutationObserver(()=>{clearTimeout(va),va=setTimeout(wa,60)});r.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style"]}),Br={root:t,observer:r},wa()}function Fi(){try{let P=Yt();document.documentElement.dataset.urpppTheme=P,document.documentElement.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),document.documentElement.classList.add("urppp-theme-"+P),document.body&&(document.body.dataset.urpppTheme=P,document.body.classList.toggle("urppp-dark",P==="dark"))}catch{}let t=document.getElementById("urppp-internal-style");t||(t=document.createElement("style"),t.id="urppp-internal-style",document.head.appendChild(t));{let P=t;P.textContent=Bp}let r=document.getElementById("urppp-table-beautify-style");r||(r=document.createElement("style"),r.id="urppp-table-beautify-style",document.head.appendChild(r)),r.textContent=Op;let e=document.getElementById("urppp-navigation-style");e||(e=document.createElement("style"),e.id="urppp-navigation-style",document.head.appendChild(e)),e.textContent=Hp;let a=document.getElementById("urppp-dashboard-style");a||(a=document.createElement("style"),a.id="urppp-dashboard-style",document.head.appendChild(a)),a.textContent=Up;let i=document.getElementById("urppp-schedule-card-style");i||(i=document.createElement("style"),i.id="urppp-schedule-card-style",document.head.appendChild(i)),i.textContent=Fp;let p=document.getElementById("urppp-mobile-style");p||(p=document.createElement("style"),p.id="urppp-mobile-style",document.head.appendChild(p)),p.textContent=Gp;try{nr()}catch{}ne(),Bi(),["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon"].forEach(P=>{let B=document.getElementById(P);!B||!B.style||(["display","opacity","pointer-events","visibility"].forEach(G=>{B.style.getPropertyPriority(G)==="important"&&B.style.removeProperty(G)}),B.style.opacity==="0"&&B.style.removeProperty("opacity"),B.style.pointerEvents==="none"&&B.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(P=>{P.style&&P.style.getPropertyPriority("display")==="important"&&P.style.removeProperty("display")}),Bo(),No(),qo(),setTimeout(()=>document.querySelectorAll("table").forEach(P=>{ya(P)&&$o(P)}),500),zo(),oe(),Ti(),Lo(),Fo();let s=document.querySelector(".page-content");s&&s.querySelectorAll(".widget-box").length>=4&&setTimeout(is,500),an(),wr(),b();function b(){let P="(max-width: 640px)",B=()=>!!(window.matchMedia&&window.matchMedia(P).matches),G=(U,ot)=>{if(!(!U||!document.body)){if(ot){Object.hasOwn(U.dataset,"urpppDesktopSidebarMin")||(U.dataset.urpppDesktopSidebarMin=U.classList.contains("menu-min")?"1":"0",U.dataset.urpppDesktopBodyMin=document.body.classList.contains("menu-min")?"1":"0"),U.classList.remove("menu-min"),document.body.classList.remove("menu-min");return}Object.hasOwn(U.dataset,"urpppDesktopSidebarMin")&&(U.classList.toggle("menu-min",U.dataset.urpppDesktopSidebarMin==="1"),document.body.classList.toggle("menu-min",U.dataset.urpppDesktopBodyMin==="1"),delete U.dataset.urpppDesktopSidebarMin,delete U.dataset.urpppDesktopBodyMin)}},F=new WeakMap,H=U=>{let ot=F.get(U);ot&&cancelAnimationFrame(ot),F.delete(U)},N=(U,ot)=>{H(U);let st=U.getBoundingClientRect(),ft=Math.max(st.width,U.offsetWidth||0,260),ht=Math.max(-ft,Math.min(0,st.left)),At=ot?0:-ft,Lt=Math.abs(At-ht),Bt=Math.max(140,Math.round(260*Lt/ft)),lr=performance.now(),Ot=U.classList.contains("urppp-clean-sidebar"),rr=Ot?"12030":"1200",$t=Ot?"12030":"1030";U.style.setProperty("display","block","important"),U.style.setProperty("transition","none","important"),U.style.setProperty("visibility","visible","important"),U.style.setProperty("pointer-events",ot?"auto":"none","important"),U.style.setProperty("z-index",rr,"important"),U.style.setProperty("transform",`translate3d(${ht}px, 0, 0)`,"important"),U.classList.toggle("urppp-drawer-closing",!ot),U.classList.add("display");let kt=()=>{U.style.setProperty("transform",`translate3d(${At}px, 0, 0)`,"important"),ot?(U.classList.remove("urppp-drawer-closing"),U.style.setProperty("pointer-events","auto","important")):(U.classList.remove("display","urppp-drawer-closing"),U.style.setProperty("visibility","hidden","important"),U.style.setProperty("z-index",$t,"important")),F.delete(U)};if(Lt<1){kt();return}let br=Tt=>{if(!U.isConnected){F.delete(U);return}let Ht=Math.min(1,(Tt-lr)/Bt),Rn=Ht<.5?4*Ht*Ht*Ht:1-Math.pow(-2*Ht+2,3)/2,Oe=ht+(At-ht)*Rn;if(U.style.setProperty("transform",`translate3d(${Oe}px, 0, 0)`,"important"),Ht>=1){kt();return}F.set(U,requestAnimationFrame(br))};F.set(U,requestAnimationFrame(br))},X=(U,ot,st)=>{if(U){N(U,st),ot&&(ot.setAttribute("aria-expanded",st?"true":"false"),ot.setAttribute("aria-label",st?"关闭菜单":"打开菜单"));try{Dr()}catch{}}},dt=()=>{X(document.getElementById("sidebar"),document.getElementById("urppp-mobile-menu-button"),!1)},yt=()=>{let ot=document.getElementById("urppp-mobile-search-panel")?.querySelector("#form-search");if(!ot)return;Object.entries({position:"relative",right:"auto",top:"auto",left:"auto",transform:"none",width:"100%","min-width":"0","max-width":"none",height:"36px",opacity:"1",margin:"0",overflow:"visible","z-index":"1"}).forEach(([ft,ht])=>ot.style.setProperty(ft,ht,"important")),[ot.querySelector("form"),ot.querySelector(".input-icon")].forEach(ft=>{ft&&Object.entries({display:"block",position:"relative",width:"100%","min-width":"0","max-width":"none",height:"36px",margin:"0",padding:"0","box-sizing":"border-box"}).forEach(([ht,At])=>ft.style.setProperty(ht,At,"important"))});let st=ot.querySelector("#search-input");st&&(st.style.setProperty("display","block","important"),st.style.setProperty("width","100%","important"),st.style.setProperty("min-width","0","important"),st.style.setProperty("max-width","none","important"),st.style.setProperty("height","36px","important"),st.style.setProperty("box-sizing","border-box","important"))},St=()=>{let U=document.getElementById("form-search");if(!U||!U.__urpppMobileParent)return;let ot=U.__urpppMobileParent,st=U.__urpppMobileNext;ot.isConnected&&(st&&st.parentElement===ot?ot.insertBefore(U,st):ot.appendChild(U)),U.classList.remove("urppp-mobile-form-search"),U.dataset.open="0",U.removeAttribute("style"),delete U.__urpppMobileParent,delete U.__urpppMobileNext;try{ct()}catch{}},Pt=()=>{let U=document.querySelector("#navbar .menu-toggler");!U||U.dataset.urpppMobileHidden!=="1"||(U.style.removeProperty("display"),U.removeAttribute("aria-hidden"),U.dataset.urpppPreviousTabindex?U.setAttribute("tabindex",U.dataset.urpppPreviousTabindex):U.removeAttribute("tabindex"),delete U.dataset.urpppPreviousTabindex,delete U.dataset.urpppMobileHidden)},zt=()=>{let U=document.getElementById("urppp-mobile-menu-button");if(!B())return U?.remove(),Pt(),null;if(U)return U;let ot=document.getElementById("navbar"),st=document.getElementById("sidebar");if(!ot||!st)return null;let ft=ot.querySelector(".menu-toggler");ft&&(ft.dataset.urpppMobileHidden="1",ft.dataset.urpppPreviousTabindex=ft.getAttribute("tabindex")||"",ft.style.setProperty("display","none","important"),ft.setAttribute("aria-hidden","true"),ft.setAttribute("tabindex","-1"));let ht=document.createElement("button");ht.type="button",ht.id="urppp-mobile-menu-button",ht.className="urppp-mobile-menu-button",ht.setAttribute("aria-label","打开菜单"),ht.setAttribute("aria-expanded","false");let At=ot.querySelector(".navbar-container")||ot;return At.insertBefore(ht,At.firstChild),ht},Dt=U=>{!U||U.dataset.urpppIconReady||(U.dataset.urpppIconReady="1",U.innerHTML=['<span class="urppp-menu-icon" aria-hidden="true">','<svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false">','<path d="M5 8h14"></path><path d="M5 16h10"></path>',"</svg>",'<svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false">','<path d="M7 7l10 10"></path><path d="M17 7 7 17"></path>',"</svg>","</span>"].join(""))},jt=()=>{let U=zt(),ot=document.getElementById("sidebar");U&&Dt(U),U&&ot&&!U.__urpppToggleHandler&&(U.setAttribute("aria-label","打开菜单"),U.setAttribute("aria-expanded",ot.classList.contains("display")?"true":"false"),U.__urpppToggleHandler=st=>{st.preventDefault(),st.stopImmediatePropagation(),B()&&G(ot,!0);let ft=U.getAttribute("aria-expanded")!=="true";X(ot,U,ft)},U.addEventListener("click",U.__urpppToggleHandler,!0)),document.__urpppMobileDrawerOutsideBound||(document.__urpppMobileDrawerOutsideBound=!0,document.addEventListener("click",st=>{if(!B()||!st.target.closest)return;let ft=document.getElementById("sidebar");if(!ft||!ft.classList.contains("display"))return;let ht=document.getElementById("urppp-clean-root");ht&&ht.classList.contains("open")||st.target.closest("#sidebar, #urppp-mobile-menu-button")||dt()},!0)),document.__urpppMobileRouteCloseBound||(document.__urpppMobileRouteCloseBound=!0,document.addEventListener("click",st=>{if(!B()||!st.target.closest)return;let ft=document.getElementById("urppp-clean-root");if(ft&&ft.classList.contains("open"))return;let ht=st.target.closest("#sidebar a[href]");if(!ht)return;let At=String(ht.getAttribute("href")||"").trim();!At||At==="#"||At.startsWith("javascript")||dt()}))},qt=(U,ot)=>{let st=U?U.cloneNode(!0):document.createElement("a");return st.className="urppp-mobile-user-action",st.removeAttribute("style"),st.removeAttribute("id"),!U&&ot&&(st.href=ot.href,ot.onclick&&st.setAttribute("onclick",ot.onclick),st.innerHTML='<i class="ace-icon fa '+ot.icon+'" aria-hidden="true"></i><span>'+ot.label+"</span>"),st},tr=(U,ot)=>{if(document.getElementById("urppp-mobile-user"))return;let st=U.querySelector(":scope > li.light-blue")||Array.from(U.children).find(Ht=>Ht.querySelector&&Ht.querySelector(".nav-user-photo, .user-menu, .dropdown-menu")),ft=document.createElement("section");ft.id="urppp-mobile-user",ft.className="urppp-mobile-user";let ht=document.createElement("div");ht.className="urppp-mobile-user-identity";let At=st?.querySelector(".nav-user-photo")||document.querySelector("#navbar .nav-user-photo"),Lt=At?At.cloneNode(!0):document.createElement("img");Lt.className="nav-user-photo",Lt.removeAttribute("style"),Lt.getAttribute("src")||Lt.setAttribute("src","/main/queryStudent/img"),Lt.setAttribute("data-urppp-private","avatar"),Lt.alt=At?.alt?.replace(/\s+/g," ").trim()||"用户头像";let Bt=st?.querySelector(".user-info")||document.querySelector("#navbar .user-info"),lr=document.createElement("span");lr.className="urppp-mobile-user-copy";let Ot=document.createElement("small");Ot.className="urppp-mobile-user-welcome",Ot.textContent="欢迎您，";let rr=document.createElement("span");rr.className="user-info urppp-user-name-value",rr.setAttribute("data-urppp-private","name"),rr.textContent=Bt?.textContent?.replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim()||At?.alt?.replace(/\s+/g," ").trim()||"我的账户",lr.append(Ot,rr),ht.append(Lt,lr),ft.appendChild(ht);let $t=document.createElement("div");$t.className="urppp-mobile-user-actions";let kt=st?Array.from(st.querySelectorAll(".user-menu a, .dropdown-menu a")):[],br=[{label:"首页",href:"/",icon:"fa-home"},{label:"在线反馈",href:"/main/systemQuestion/index",icon:"fa-question-circle"},{label:"修改密码",href:"javascript:changePassword('/student/rollManagement/personalInfoUpdate/updatePassword')",icon:"fa-user"},{label:"注销",href:"/logout",icon:"fa-power-off"}];kt.length?kt.forEach(Ht=>$t.appendChild(qt(Ht))):br.forEach(Ht=>$t.appendChild(qt(null,Ht))),ft.appendChild($t);let Tt=ot.querySelector(".urppp-sidebar-header");Tt&&Tt.nextSibling?ot.insertBefore(ft,Tt.nextSibling):Tt?ot.appendChild(ft):ot.insertBefore(ft,ot.firstChild);try{Jt(ft)}catch{}},Hn=(U,ot,st,ft={})=>{if(!st||document.getElementById("urppp-mobile-quick"))return;let ht=document.createElement("section");ht.id="urppp-mobile-quick",ht.className="urppp-mobile-quick",ht.innerHTML='<div class="urppp-mobile-quick-title">快捷功能</div>';let At=document.createElement("div");At.className="urppp-mobile-tool-row";let Lt=U.querySelector(':scope > li > a[href*="customerServiceCenter"]'),Bt=Lt?Lt.cloneNode(!0):document.createElement("a");Bt.className="urppp-mobile-tool-button urppp-mobile-help-button",Bt.removeAttribute("style"),Bt.removeAttribute("onclick"),Bt.removeAttribute("data-toggle"),Bt.removeAttribute("target"),Bt.querySelectorAll("[style]").forEach(kt=>kt.removeAttribute("style"));let lr=String(Bt.getAttribute("href")||"").trim();(!lr||lr==="#"||lr.startsWith("javascript"))&&(Bt.href="/main/customerServiceCenter"),Bt.querySelector("i")||(Bt.innerHTML='<i class="ace-icon glyphicon glyphicon-headphones" aria-hidden="true"></i>'),Bt.querySelectorAll("span").forEach(kt=>kt.remove()),Bt.insertAdjacentHTML("beforeend","<span>帮助</span>"),At.appendChild(Bt);let Ot=document.createElement("button");Ot.type="button",Ot.id="urppp-mobile-search-button",Ot.className="urppp-mobile-tool-button",Ot.setAttribute("aria-expanded","false"),Ot.innerHTML='<i class="ace-icon fa fa-search" aria-hidden="true"></i><span>搜索</span>',At.appendChild(Ot),ht.appendChild(At);let rr=document.createElement("div");rr.className="urppp-mobile-quick-links",Array.from(U.querySelectorAll(":scope > li > a")).forEach(kt=>{let br=kt.closest("li");if(br?.classList.contains("light-blue")||br?.querySelector("#intellegenceUDiv, #form-search")||kt===Lt||kt.classList.contains("dropdown-toggle")||!kt.getAttribute("href")&&!kt.getAttribute("onclick"))return;let Tt=kt.cloneNode(!0);Tt.className="urppp-mobile-quick-link",Tt.removeAttribute("style");let Ht=String(kt.getAttribute("onclick")||"");if(/openWorkRestSchedule|open\w*Schedule/i.test(Ht)||Tt.removeAttribute("onclick"),ft.cleanMode){let Oe=String(kt.getAttribute("href")||"");(Oe==="/holiday"||/holiday/i.test(Oe)||/假期/.test(kt.textContent||""))&&(Tt.removeAttribute("href"),Tt.removeAttribute("target"),Tt.style.cursor="default",Tt.style.pointerEvents="none")}rr.appendChild(Tt)});let $t=document.createElement("div");$t.id="urppp-mobile-search-panel",$t.className="urppp-mobile-search-panel",$t.hidden=!0;{let kt=document.getElementById("form-search");kt&&(kt.__urpppMobileParent||(kt.__urpppMobileParent=kt.parentElement,kt.__urpppMobileNext=kt.nextSibling),kt.classList.add("urppp-mobile-form-search"),kt.dataset.open="0",$t.appendChild(kt),yt())}ht.appendChild($t),rr.children.length&&ht.appendChild(rr),Ot.addEventListener("click",kt=>{if(kt.preventDefault(),kt.stopPropagation(),$t.hidden){yt();let Tt=$t.querySelector("#form-search");Tt&&(Tt.dataset.open="0",Tt.style.setProperty("pointer-events","auto","important"),Tt.style.setProperty("opacity","1","important"),Tt.style.setProperty("width","100%","important"),Tt.style.setProperty("min-width","0","important")),$t.hidden=!1,$t.classList.add("open"),setTimeout(()=>$t.querySelector("#search-input")?.focus(),30),Ot.setAttribute("aria-expanded","true")}else $t.hidden=!0,$t.classList.remove("open"),Ot.setAttribute("aria-expanded","false")}),ot.insertBefore(ht,st)},Er=()=>{let U=B(),ot=document.querySelector("#navbar .navbar-buttons .ace-nav"),st=document.getElementById("sidebar"),ft=document.getElementById("urppp-menus");if(st&&G(st,U),jt(),!U){let ht=document.documentElement.classList.contains("urppp-clean-open");ht||St(),ht||(document.getElementById("urppp-mobile-quick")?.remove(),document.getElementById("urppp-mobile-user")?.remove());let At=document.getElementById("urppp-nav-clean"),Lt=document.getElementById("urppp-nav-theme");At&&Lt&&At.parentElement!==Lt&&Lt.appendChild(At),Lt&&Lt.style.setProperty("display","inline-flex","important");return}if(!(!ot||!st)){try{let ht=document.getElementById("urppp-nav-clean"),At=document.querySelector("#navbar .navbar-header"),Lt=document.getElementById("urppp-nav-theme");ht&&At&&ht.parentElement!==At&&At.appendChild(ht),Lt&&Lt.style.setProperty("display","inline-flex","important"),document.getElementById("urppp-nav-cal")?.remove()}catch{}tr(ot,st),Hn(ot,st,ft),yt()}};window.__urpppRefreshMobileNavbar=Er,window.__urpppCloseMobileDrawer=dt,window.__urpppSetDrawerOpen=(U,ot,st)=>{X(U,ot,st)},window.__urpppStopDrawerAnimation=U=>{U&&H(U)},window.__urpppInjectCleanSidebarSections=U=>{let ot=document.querySelector("#navbar .navbar-buttons .ace-nav")||document.querySelector("#navbar .ace-nav"),st=document.getElementById("urppp-menus");if(!ot||!U)return;try{tr(ot,U)}catch{}let ft=document.getElementById("urppp-mobile-quick");if(ft){let ht=ft.querySelector("#urppp-mobile-search-panel");if(ht&&ht.querySelector("#form-search"))try{St()}catch{}ft.remove()}try{Hn(ot,U,st,{cleanMode:!0})}catch{}};try{Er()}catch{}if(setTimeout(Er,300),setTimeout(Er,900),setTimeout(Er,1800),window.matchMedia){let U=window.matchMedia(P),ot=()=>Er();typeof U.addEventListener=="function"?U.addEventListener("change",ot):typeof U.addListener=="function"&&U.addListener(ot)}try{window.__urpppMobileNavbarObserver&&window.__urpppMobileNavbarObserver.disconnect();let U=0,ot=new MutationObserver(()=>{clearTimeout(U),U=setTimeout(()=>{try{Er()}catch{}},40)}),st=document.getElementById("navbar"),ft=document.getElementById("sidebar");st&&ot.observe(st,{childList:!0,subtree:!0}),ft&&ot.observe(ft,{childList:!0}),window.__urpppMobileNavbarObserver=ot}catch{}}let M=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches)?"8px 8px 24px":"16px 64px 40px";if(document.querySelectorAll(".page-content, #page-content-template").forEach(P=>{P.style.setProperty("padding",M,"important"),P.style.setProperty("box-sizing","border-box","important")}),Ce(),da(),Le(),Ir(),ba(),setTimeout(()=>{Ir(),ba()},300),setTimeout(()=>{Ir(),ba()},1e3),_o(),So(),Ao(),ur(),ma(),ee(),Eo(),setTimeout(()=>{ur(),ee()},200),setTimeout(()=>{ur(),ee()},800),setTimeout(da,350),setTimeout(da,1e3),ae(),setTimeout(()=>ae(),400),!window.__urpppPlanTreeObs){let P=0;window.__urpppPlanTreeObs=new MutationObserver(()=>{let G=document.getElementById("treeDemo");!G||G.dataset.urpppBusy==="1"||G.querySelector('li > a:not([data-urppp-node-done="1"])')&&(clearTimeout(P),P=setTimeout(()=>ae(),220))});let B=document.getElementById("tree_div")||document.getElementById("treeDemo");B&&window.__urpppPlanTreeObs.observe(B,{childList:!0,subtree:!0})}window.__urpppWrsBound||(window.__urpppWrsBound=!0,document.addEventListener("shown.bs.modal",P=>{P.target&&(P.target.id==="work_rest_schedule_modal"||P.target.querySelector?.("#work_rest_schedule_modal"))&&setTimeout(ha,30)},!0),document.addEventListener("click",P=>{let B=P.target&&P.target.closest?P.target.closest("a,button"):null;if(!B)return;let G=B.getAttribute("onclick")||"",F=(B.textContent||"").trim();(G.includes("openWorkRestSchedule")||F.includes("作息时间表"))&&(setTimeout(ha,80),setTimeout(ha,300))},!0)),Ee(),pt(),ct(),ga();let D=()=>{Ce(),Le(),Ee()};setTimeout(D,200),setTimeout(D,800),window.__urpppLoadBound||(window.__urpppLoadBound=!0,window.addEventListener("load",()=>{pt(),ct(),rt(),ga(),Ee(),Ce(),Le()})),setTimeout(()=>{document.body.classList.add("urppp-ready"),vt()},600),console.log("[URP++] style applied apple-leaning");try{bindScheduleHoverNearCursor()}catch{}Do()}function Di(t){if(!t)return;let r=t.querySelector("#urppp-set-brutal-palettes");if(!r)return;let e=ho();r.innerHTML="",Y.filter(a=>a.id!==J).forEach(a=>{let i=document.createElement("button");i.type="button",i.className="urppp-set-scheme"+(a.id===e.id?" ac":""),i.dataset.palette=a.id,i.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:#000"></span>','  <span style="background:'+a.accent+'"></span>','  <span style="background:'+a.secondary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+a.name+"</strong>","  <em>"+a.desc+"</em>","</div>"].join(""),i.addEventListener("click",()=>fo(a.id,{select:!0})),r.appendChild(i)})}let qe=xp({getPrivacySettings:xr,setPrivacySettings:ia,getCustomIdentity:Lr,setCustomIdentity:lo,applyDisplay:()=>Jt(document),refreshCleanDisplay:Ia,finishActiveDirectEdit:t=>{mr?.__finish&&mr.__finish(t)}}),ji=qe.sync,cc=qe.collect,dc=qe.setStatus,Oi=qe.bind,ka=gp({document,getSettings:Se,setSettings:uo,validateMapping:Cr,defaultMapping:ge,getRecoveryMessage:()=>tt}),uc=ka.setStatus,Hi=ka.sync,Ri=ka.bind;function Rt(){let t=document.getElementById("urppp-settings-panel");if(!t)return;let r=Vt()||ut,e=zr(),a=Yt(),i=Xt(),p=or(),s=Tr(p),g=Mr(p),b=bo(p),_={};t.querySelectorAll(".urppp-set-mode").forEach(P=>{_[P.dataset.theme]=te(P.dataset.theme,p)}),vp(t,{seed:r,currentTheme:a,followSystem:i,skinId:p,darkSupported:s,dynamicSupported:g,fixedPalettes:b,followUseDynamic:_e(),cleanDefault:oa(),cleanAnalysis:na()?"direct":"tab",appleEdge:fr(),autoUpdate:pa(),modeAvailability:_}),b&&Di(t);try{ji(t)}catch{}try{Hi(t)}catch{}try{window.__urpppCleanMode&&typeof window.__urpppCleanMode.refreshRender=="function"&&window.__urpppCleanMode.refreshRender()}catch{}let M=t.querySelector("#urppp-set-presets");M&&(M.innerHTML="",aa().forEach(P=>{let B=document.createElement("button");B.type="button",B.className="urppp-set-swatch"+(P.toLowerCase()===r.toLowerCase()?" ac":""),B.title=P,B.style.background=P,B.addEventListener("click",()=>{GM_setValue(q,P),Xt()?Wt(yr(),{system:!0}):Wt("scu-red",{manual:!0}),Rt()}),M.appendChild(B)}));let D=t.querySelector("#urppp-set-schemes");D&&(D.innerHTML="",Pr(r).forEach(P=>{let B=document.createElement("button");B.type="button",B.className="urppp-set-scheme"+(P.id===e?" ac":""),B.dataset.scheme=P.id,B.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+P.bg+'"></span>','  <span style="background:'+P.surface+";border-color:"+P.border+'"></span>','  <span style="background:'+P.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+P.name+"</strong>","  <em>"+P.desc+"</em>","</div>"].join(""),B.addEventListener("click",()=>{ea(P.id),GM_setValue(q,r),Xt()?Wt(yr(),{system:!0}):Wt("scu-red",{manual:!0}),Rt()}),D.appendChild(B)}));try{Ki(t)}catch(P){try{console.warn("[URP++] renderSkinCards",P)}catch{}}try{let P=t.querySelector(".urppp-about-ver, #urppp-about-ver");P&&(P.textContent="SCU URP++ v"+n,P.tagName==="A"&&(P.setAttribute("href",o.repo),P.setAttribute("target","_blank"),P.setAttribute("rel","noopener noreferrer")))}catch{}try{Ro(t)}catch{}}let jo=bp({document,ensurePanel:Uo,syncPanel:Rt,refreshUpdateStatus:en}),Ui=yp({document,theme:{isModeAvailable:te,apply:Wt,supportsDark:Tr,supportsDynamic:Mr,getFollowSystem:Xt,setFollowSystem:we,resolveFollowTheme:yr,getCurrent:Yt,getFollowDynamic:_e,setFollowDynamic:la,syncNavbar:gt},preferences:{getCleanDefault:oa,setCleanDefault:ki,getCleanAnalysis:()=>na()?"direct":"tab",setCleanAnalysis:Ai,getAppleEdge:fr,setAppleEdge:Si,applySkin:nr,getAutoUpdate:pa,setAutoUpdate:_i,checkUpdates:La},accent:{normalize:Ut,setAccent:t=>GM_setValue(q,t),savePreset:wi,getScheme:zr,setScheme:ea,listSchemePreviews:Pr},syncPanel:Rt}),Ft=Xa({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:n},uiDeps:{openSubpanel:t=>{t==="plugin-store"&&Aa("plugin")}}});(function(){let r=()=>{try{Ft.bootFromCache("assist")}catch{}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r()})();function Oo(){return jo.open()}function Ho(){jo.close()}let Te="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=";function Ro(t){let r=t&&t.querySelector?t.querySelector("#urppp-about-logo"):document.getElementById("urppp-about-logo");r&&(r.getAttribute("src")!==Te&&r.setAttribute("src",Te),r.removeAttribute("referrerpolicy"),r.alt="SCU URP++",r.style.maxWidth="100%",r.style.height="auto",r.style.display="block")}function Uo(){if(document.getElementById("urppp-settings-panel"))return;cs();try{nr()}catch{}let t=document.createElement("div");t.id="urppp-settings-mask",t.addEventListener("click",Ho);let r=document.createElement("div");r.id="urppp-settings-panel",r.setAttribute("role","dialog"),r.setAttribute("aria-label","URP++ 设置");let e=Te;r.innerHTML=hp({logoData:Te,repositoryUrl:o.repo,version:n}),document.documentElement.appendChild(t),document.documentElement.appendChild(r),mp(r),r.querySelector("#urppp-set-close").addEventListener("click",Ho);try{Oi(r)}catch(i){console.warn("[URP++] privacy settings",i)}try{Ri(r)}catch(i){console.warn("[URP++] JSON settings",i)}try{Ro(r)}catch{}let a=r.querySelector("#urppp-about-logo");a&&!a.__urpppFallback&&(a.__urpppFallback=!0,a.addEventListener("error",()=>{a.dataset.fallback!=="1"&&(a.dataset.fallback="1",a.src=e)})),Ui.bind(r);try{Ft.renderAssistUi(r.querySelector("#urppp-set-assist-slot"))}catch(i){console.warn("[URP++] plugin manager",i)}}function Aa(t){let r=document.getElementById("urppp-settings-panel");if(!r)return;let e=document.getElementById("urppp-store-subpanel");e||(e=document.createElement("div"),e.id="urppp-store-subpanel",e.className="urppp-store-subpanel",e.innerHTML=`
        <div class="urppp-store-sub-head">
          <button type="button" class="urppp-store-sub-back" id="urppp-store-sub-back" aria-label="返回">←</button>
          <div class="urppp-store-sub-title" id="urppp-store-sub-title"></div>
        </div>
        <div class="urppp-store-sub-body" id="urppp-store-sub-body"></div>`,r.appendChild(e),e.querySelector("#urppp-store-sub-back").onclick=Wi);let a=e.querySelector("#urppp-store-sub-title"),i=e.querySelector("#urppp-store-sub-body");a.textContent=t==="theme"?"主题商店":"插件商店",i.innerHTML="",t==="theme"?Qo(i):Xo(i),e.classList.add("open")}function Wi(){let t=document.getElementById("urppp-store-subpanel");if(!t)return;t.classList.remove("open");let r=t.querySelector("#urppp-store-sub-body");r&&(r.innerHTML="")}function Wo(t){t.querySelectorAll(".urppp-store-tab").forEach(r=>{r.addEventListener("click",()=>{t.querySelectorAll(".urppp-store-tab").forEach(a=>a.className="urppp-store-tab"),r.className="urppp-store-tab ac",t.querySelectorAll(".urppp-store-pane").forEach(a=>a.style.display="none");let e=t.querySelector('.urppp-store-pane[data-pane="'+r.dataset.tab+'"]');e&&(e.style.display="")})})}function Gi(t,r){return`<div class="urppp-skin-card" data-skin="${it(t.id)}">
      <div class="urppp-skin-name">${it(t.name||t.id)}</div>
      <p class="urppp-skin-desc">${it(t.description||"")}</p>
      <button type="button" class="urppp-skin-apply" data-store-theme="${it(t.id)}"${r?" disabled":""}>${r?"已安装":"下载"}</button>
    </div>`}async function Ji(t){let r=t.querySelector('[data-pane="download"]');if(!r)return;let e=[];try{e=(await Sa()).filter(a=>a.type==="theme")}catch{}if(!e.length){r.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无主题</p><p class="urppp-store-sub">主题市场正在筹备中。</p></div>';return}r.innerHTML=`<div class="urppp-store-theme-grid">${e.map(a=>Gi(a,qr(a.id))).join("")}</div>`,r.querySelectorAll("[data-store-theme]").forEach(a=>{a.addEventListener("click",()=>Vi(a.dataset.storeTheme,a))})}async function Vi(t,r){if(!r||r.disabled)return;let e=(await Sa()).find(i=>i.id===t);if(!e||!Array.isArray(e.entry)||!e.entry.length)return;r.disabled=!0,r.textContent="下载中…";let a="";for(let i of e.entry)try{let p=await fetch(i,{cache:"no-store"});if(p.ok){a=await p.text();break}}catch{}if(!a){r.textContent="下载失败",setTimeout(()=>{r.textContent="下载",r.disabled=!1},1400);return}try{GM_setValue("urppp_theme_css_"+t,a)}catch{}try{typeof GM_addStyle=="function"&&GM_addStyle(a)}catch{}r.textContent="已安装",r.disabled=!0;try{Rt()}catch{}}function Yi(){let t=d.filter(r=>r.installed!==!1||qr(r.id));return t.length?t.map(r=>{let e=r.installed!==!1,a=e?"内置":"已下载",i=e?"":`<button type="button" class="urppp-set-btn ghost" data-theme-del="${it(r.id)}">删除</button>`;return`<div class="urppp-store-item">
        <div class="urppp-store-info"><strong>${it(r.name)}</strong><span class="urppp-store-ver">v${it(r.version||"")}</span><span class="urppp-store-state${e?" ok":""}">${a}</span></div>
        <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-theme-use="${it(r.id)}">使用</button>${i}</div>
      </div>`}).join(""):'<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无已装主题</p></div>'}function Go(){return`<div class="urppp-store-settings">
      <button type="button" class="urppp-set-follow" data-store-auto-update>自动检测更新：关</button>
      <button type="button" class="urppp-set-btn" data-store-check-update>检查更新</button>
    </div>`}let Qi=["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json"];async function Sa(){for(let t of Qi)try{let r=await fetch(t,{cache:"no-store"});if(r.ok){let e=await r.json();if(e&&Array.isArray(e.items))return e.items}}catch{}return[]}function Jo(t,r){let e=String(t||"0").split(".").map(Number),a=String(r||"0").split(".").map(Number);for(let i=0;i<Math.max(e.length,a.length);i+=1){let p=e[i]||0,s=a[i]||0;if(p!==s)return p>s}return!1}function Xi(t,r){let e=0;return r.forEach(a=>{if(!a.id)return;let i=t.querySelector('[data-theme-use="'+a.id+'"]');i&&Jo(a.version,d.find(s=>s.id===a.id)&&d.find(s=>s.id===a.id).version)&&(Vo(i.closest(".urppp-store-item"),"主题"),e+=1);let p=t.querySelector('[data-plugin-id="'+a.id+'"]');if(p){let s=Ft&&Ft.api&&Ft.api.get&&Ft.api.get(a.id);s&&Jo(a.version,s.version)&&(Vo(p.closest(".urppp-store-item"),"插件"),e+=1)}}),e}function Vo(t,r){if(!t||t.querySelector(".urppp-store-update"))return;let e=t.querySelector(".urppp-store-ops");if(!e)return;let a=document.createElement("button");a.type="button",a.className="urppp-set-btn urppp-store-update",a.textContent="有新更新",a.addEventListener("click",()=>{try{a.textContent="更新中…"}catch{}}),e.appendChild(a)}function Yo(t){let r=t.querySelector("[data-store-auto-update]"),e=t.querySelector("[data-store-check-update]");if(!r||!e)return;let a=GM_getValue("urppp_store_auto_update",!1),i=()=>{r.textContent="自动检测更新："+(a?"开":"关")};i(),r.addEventListener("click",()=>{a=!a,GM_setValue("urppp_store_auto_update",a),i()}),e.addEventListener("click",async()=>{e.disabled=!0;let p=e.textContent;e.textContent="检查中…";try{let s=await Sa(),g=Xi(t,s);e.textContent=g?"发现更新":"已是最新"}catch{e.textContent="检查失败"}setTimeout(()=>{e.textContent=p,e.disabled=!1},1600)})}function Qo(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">主题下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">主题管理</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${Go()}${Yi()}</div>
        </div>
      </div>`,Wo(t),t.querySelectorAll("[data-theme-use]").forEach(r=>{r.addEventListener("click",()=>{xo(r.dataset.themeUse)&&Rt()})}),t.querySelectorAll("[data-theme-del]").forEach(r=>{r.addEventListener("click",()=>{try{GM_setValue("urppp_theme_css_"+r.dataset.themeDel,"")}catch{}try{Rt()}catch{}try{Qo(t)}catch{}})}),Yo(t),Ji(t)}function Xo(t){let r=Ft&&Ft.api&&Ft.api.list&&Ft.api.list()||[],e=r.length?r.map(a=>`
        <div class="urppp-store-item">
          <div class="urppp-store-info"><strong>${it(a.name||a.id)}</strong><span class="urppp-store-ver">${a.version?"v"+it(a.version):""}</span><span class="urppp-store-state ok">已装</span></div>
          <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-op="reload" data-plugin-id="${it(a.id)}">重新装载</button><button type="button" class="urppp-set-btn ghost" data-plugin-op="unload" data-plugin-id="${it(a.id)}">卸载</button></div>
        </div>`).join(""):'<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">插件下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">插件管理</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">敬请期待</p><p class="urppp-store-sub">插件市场正在筹备中，后续可从这里在线安装更多功能插件。</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${Go()}${e}</div>
        </div>
      </div>`,Wo(t),t.querySelectorAll('[data-plugin-op="reload"]').forEach(a=>{a.addEventListener("click",async()=>{a.disabled=!0;let i=a.textContent;a.textContent="装载中…";try{await Ft.api.install(a.dataset.pluginId,null),a.textContent="已装载"}catch{a.textContent="失败"}setTimeout(()=>{a.textContent=i,a.disabled=!1},1200)})}),t.querySelectorAll('[data-plugin-op="unload"]').forEach(a=>{a.addEventListener("click",()=>{try{Ft.api.unregister(a.dataset.pluginId)}catch{}Xo(t)})}),Yo(t)}function Ki(t){if(!t)return;let r=t.querySelector("#urppp-theme-store");r&&!r.dataset.bound&&(r.dataset.bound="1",r.addEventListener("click",()=>Aa("theme")));let e=t.querySelector("#urppp-skin-list");if(!e)return;let a=or();if(e.innerHTML="",!d||!d.length){e.innerHTML='<p class="urppp-set-tip">暂无可用风格</p>';return}d.filter(i=>i.installed!==!1||qr(i.id)).forEach(i=>{let p=document.createElement("div");p.className="urppp-skin-card"+(i.id===a?" is-active":""),p.dataset.skin=i.id;let s=document.createElement("button");s.type="button",s.className="urppp-skin-apply";let g=i.installed!==!1||qr(i.id);g?i.id===a&&i.ready?(s.classList.add("is-current"),s.textContent="使用中",s.disabled=!0):s.textContent="应用主题":(s.classList.add("is-disabled"),s.textContent="去下载"),s.addEventListener("click",b=>{if(b.preventDefault(),b.stopPropagation(),!g){Aa("theme");return}if(!(i.id===a&&i.ready)&&xo(i.id)){Rt();try{window.__urpppCleanMode&&window.__urpppCleanMode.inject&&window.__urpppCleanMode.inject()}catch{}}}),p.innerHTML=['<div class="urppp-skin-name"></div>','<p class="urppp-skin-desc"></p>'].join(""),p.querySelector(".urppp-skin-name").textContent=i.name,p.querySelector(".urppp-skin-desc").textContent=i.desc,p.appendChild(s),e.appendChild(p)})}let Fr=[],_a=!1;function Zi(t,r,e){let a=typeof AbortController=="function"?new AbortController:null,i=a?setTimeout(()=>a.abort(),e):null;return fetch(t,{cache:"no-store",headers:r,signal:a?a.signal:void 0}).then(p=>{if(!p.ok)throw new Error("HTTP "+p.status);return p.text()}).finally(()=>{i&&clearTimeout(i)})}function ts(t,r){return new Promise((e,a)=>{try{GM_xmlhttpRequest({method:"GET",url:t,timeout:12e3,headers:r,onload:i=>{i.status>=200&&i.status<400?e(i.responseText||""):a(new Error("HTTP "+i.status))},onerror:()=>a(new Error("network error")),ontimeout:()=>a(new Error("timeout"))})}catch(i){a(i)}})}function rs(t,r){let e={"Cache-Control":"no-cache"};return r&&r.range&&(e.Range=r.range),Zi(t,e,12e3).catch(a=>{if(typeof GM_xmlhttpRequest=="function")return ts(t,e);throw a})}async function Ea(t,r,e=1e3){let a=[],i=t[0],p=t.slice(1),s=P=>rs(P,r).then(B=>({url:P,text:B})).catch(B=>(a.push((P.split("/")[2]||P)+": "+(B&&B.message||B)),null)),g=s(i),b=new Promise(P=>setTimeout(()=>P("__TIMEOUT__"),e)),_=await Promise.race([g,b]);if(_!=="__TIMEOUT__"){if(_&&_.text&&_.text.length>0)return _.text;let B=(await Promise.all(p.map(s))).find(G=>G&&G.text&&G.text.length>0);if(B)return B.text;throw new Error("所有更新源均不可用（"+a.join("; ")+"）")}let M=Promise.all(p.map(s)).then(P=>{let B=P.find(G=>G&&G.text&&G.text.length>0);if(B)return B.text;throw new Error("所有更新源均不可用（"+a.join("; ")+"）")}),D=g.then(P=>{if(P&&P.text&&P.text.length>0)return P.text;throw new Error("主源内容无效")}).catch(()=>new Promise(()=>{}));return Promise.race([D,M])}function vr(t,r){let e=document.getElementById("urppp-set-update-status");e&&(e.dataset.locked=t?"1":"",e.innerHTML=t||"",e.style.color=r==="err"?"#b91c1c":r==="ok"?"#15803d":"var(--text-muted)")}async function Ca(){let t=n,r="",e=!1,a="";try{let p=await Ea(o.sourceUrls(o.versionJson)),s=JSON.parse(p);r=String(s&&s.version||"").trim(),s&&String(s.prevVersion||"").trim()===t&&(e=!0),s&&typeof s.changelog=="string"&&s.changelog.trim()&&(a=s.changelog)}catch{}if(!r){let p=await Ea(o.sourceUrls("urppp.user.js"),{range:"bytes=0-2048"});r=Ja(p)}if(!r)throw new Error("无法解析远程主插件版本");let i=be(r,t);return{id:"main",name:"主插件",local:t,remote:r,status:i>0?"update":i===0?"latest":"ahead",updateUrl:o.mainRaw,pageUrl:o.greasySearch,changelogMd:e?a:""}}function Ko(t,r,e){let a=String(t||"").replace(/\r\n/g,`
`);if(!a.trim())return"";let i=/^##\s*\[?v?([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)\]?[^\n]*$/gim,p=[],s;for(;(s=i.exec(a))!==null;)p.push({ver:s[1],index:s.index,headEnd:i.lastIndex});if(!p.length)return"";for(let b=0;b<p.length;b++){let _=b+1<p.length?p[b+1].index:a.length;p[b].body=a.slice(p[b].index,_).trim()}let g=[];for(let b of p)be(b.ver,e)>0||be(b.ver,r)<=0||g.push(b.body);return g.join(`

`).trim()}function Zo(){let t=document.getElementById("urppp-update-toast-style");t&&t.remove();let r=document.createElement("style");r.id="urppp-update-toast-style",r.textContent=`
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
    `,document.documentElement.appendChild(r)}function es(t){let r=String(t||"").replace(/\r\n/g,`
`).trim();if(!r)return'<p class="uuc-meta">暂无更新日志</p>';let e=g=>{let b=it(g);return b=b.replace(/`([^`]+)`/g,"<code>$1</code>"),b=b.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),b=b.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),b=b.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g,'$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'),b},a=r.split(`
`),i=[],p=!1,s=()=>{p&&(i.push("</ul>"),p=!1)};for(let g=0;g<a.length;g++){let _=a[g].replace(/\s+$/,"");if(!_.trim()){s();continue}let M=_.match(/^(#{2,3})\s+(.+)$/);if(M){s();let P=M[1].length,B=M[2];i.push(P===2?`<h2>${e(B)}</h2>`:`<h3>${e(B)}</h3>`);continue}let D=_.match(/^[-*]\s+(.+)$/);if(D){p||(i.push("<ul>"),p=!0),i.push(`<li>${e(D[1])}</li>`);continue}s(),i.push(`<p>${e(_)}</p>`)}return s(),i.join("")||'<p class="uuc-meta">暂无更新日志</p>'}function tn(t){let r=t||document.getElementById("urppp-update-toast");if(!r||!r.classList.contains("open")){r&&r.classList.remove("open","closing");return}if(r.__closing)return;r.__closing=!0,r.classList.add("closing"),r.classList.remove("open");let e=()=>{r.classList.remove("closing"),r.__closing=!1,r.removeEventListener("transitionend",a)},a=i=>{i&&i.target!==r||i&&i.propertyName&&i.propertyName!=="opacity"&&i.propertyName!=="transform"||e()};r.addEventListener("transitionend",a),setTimeout(e,380)}function as(t){let r=t||document.getElementById("urppp-update-changelog");if(!r||!r.classList.contains("open")&&!r.classList.contains("closing")||r.__closing)return;r.__closing=!0,r.classList.add("closing"),r.classList.remove("open");let e=()=>{r.classList.remove("closing"),r.__closing=!1,r.removeEventListener("transitionend",a)},a=i=>{i&&i.target!==r||i&&i.propertyName&&i.propertyName!=="opacity"&&i.propertyName!=="background-color"&&i.propertyName!=="background"||e()};r.addEventListener("transitionend",a),setTimeout(e,360)}function rn(t,r){Zo();let e=document.getElementById("urppp-update-changelog");e||(e=document.createElement("div"),e.id="urppp-update-changelog",e.innerHTML=`
        <div class="uuc-panel" role="dialog" aria-modal="true" aria-label="更新日志">
          <div class="uuc-head">
            <h3></h3>
            <button type="button" class="uut-btn ghost" data-close="1">关闭</button>
          </div>
          <div class="uuc-body"></div>
        </div>`,e.addEventListener("click",a=>{(a.target===e||a.target&&a.target.getAttribute&&a.target.getAttribute("data-close")==="1")&&as(e)}),document.documentElement.appendChild(e)),e.querySelector("h3").textContent=t||"更新日志",e.querySelector(".uuc-body").innerHTML=r||'<p class="uuc-meta">暂无更新日志</p>',e.__closing=!1,e.classList.remove("open","closing"),e.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>e.classList.add("open"))})}function Pa(t){Zo();let r=document.getElementById("urppp-update-toast");r||(r=document.createElement("div"),r.id="urppp-update-toast",r.innerHTML=`
        <button type="button" class="uut-close" aria-label="关闭">×</button>
        <div class="uut-title"></div>
        <div class="uut-sub"></div>
        <div class="uut-actions">
          <button type="button" class="uut-btn" data-act="log">更新日志</button>
          <button type="button" class="uut-btn primary" data-act="go">去更新</button>
          <button type="button" class="uut-btn ghost" data-act="later">稍后</button>
        </div>`,r.querySelector(".uut-close").addEventListener("click",()=>tn(r)),r.addEventListener("click",async e=>{let a=e.target&&e.target.closest?e.target.closest("[data-act]"):null;if(!a)return;let i=a.getAttribute("data-act"),p=r.__pack||{};if(i==="later"){tn(r);return}if(i==="go"){let s=p.updateUrl||o.mainRaw;try{window.open(s,"_blank","noopener,noreferrer")}catch{location.href=s}return}if(i==="log"){a.disabled=!0,a.textContent="加载中…";try{let s=p.changelogMd;s||(s=await Ea(o.sourceUrls("CHANGELOG.md")),p.changelogMd=s);let g=Ko(s,p.local,p.remote),b=g?es(g):'<p class="uuc-meta">未找到区间日志。</p><p><a href="'+o.changelogPage+'" target="_blank" rel="noopener noreferrer">打开完整 CHANGELOG</a></p>';rn("更新日志 "+p.local+" → "+p.remote,b)}catch(s){rn("更新日志","<p>加载失败："+it(s&&s.message||s)+'</p><p><a href="'+o.changelogPage+'" target="_blank" rel="noopener noreferrer">打开 GitHub CHANGELOG</a></p>')}finally{a.disabled=!1,a.textContent="更新日志"}}}),document.documentElement.appendChild(r)),r.__pack=t||{},r.querySelector(".uut-title").textContent="发现新版本 "+(t&&t.remote||""),r.querySelector(".uut-sub").textContent="当前 "+(t&&t.local||"")+" · 主插件可更新",r.__closing=!1,r.classList.remove("open","closing"),r.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>r.classList.add("open"))})}async function za(){if(pa()&&!window.__urpppAutoUpdateTried){window.__urpppAutoUpdateTried=!0;try{let t=await Ca();t&&t.status==="update"&&Pa(t);let r=await os();if(r)try{console.log("[URP++] 辅助插件热更新到",r.version)}catch{}}catch(t){try{console.debug("[URP++] auto update check failed",t)}catch{}}}}function os(){let t=(window.__urpppUpdateCheckers||Fr||[]).find(r=>r&&r.id==="assist");return!t||typeof t.check!="function"?Promise.resolve(null):Promise.resolve().then(()=>t.check()).then(r=>r&&r.status==="update"?Ft.update("assist"):null).catch(()=>null)}async function La(){if(_a)return;_a=!0;let t=document.getElementById("urppp-set-check-update");t&&(t.disabled=!0,t.textContent="检查中…"),vr("正在从多源检查更新…");try{let r=[Ca()];(Fr||[]).forEach(b=>{b&&typeof b.check=="function"&&r.push(Promise.resolve().then(()=>b.check()).then(_=>_||{id:b.id||"extra",name:b.name||"扩展",status:"err",message:"无结果"}).catch(_=>({id:b.id||"extra",name:b.name||"扩展",status:"err",message:String(_&&_.message||_)})))});let e=await Promise.all(r),a=e.map(b=>{if(!b)return"";if(b.status==="err")return`• <b>${it(b.name||b.id)}</b>：检查失败（${it(b.message||"unknown")}）`;if(b.status==="update"){let _="";if(b.id==="assist"&&Ft&&Ft.loaded("assist"))_=' <a class="urppp-update-relaunch" href="javascript:void(0)" data-urppp-relaunch="assist" rel="nofollow">重新装载</a>';else{let M=b.updateUrl?` <a href="${it(b.updateUrl)}" target="_blank" rel="noopener noreferrer">打开更新源</a>`:"",D=b.pageUrl?` <a href="${it(b.pageUrl)}" target="_blank" rel="noopener noreferrer">Greasy Fork</a>`:"";_=M+D}return`• <b>${it(b.name)}</b>：发现新版本 <b>${it(b.remote)}</b>（当前 ${it(b.local)}）${_}`}return b.status==="ahead"?`• <b>${it(b.name)}</b>：本地 ${it(b.local)} 新于远程 ${it(b.remote)}`:`• <b>${it(b.name)}</b>：已是最新（${it(b.local)}）`}).filter(Boolean),i=e.some(b=>b&&b.status==="update"),p=e.some(b=>b&&b.status==="err");vr(`${i?"检查完成：发现更新":p?"检查完成：部分失败":"检查完成：全部最新"}<br>${a.join("<br>")}<br><span style="opacity:.85">仓库：<a href="${o.repo}" target="_blank" rel="noopener noreferrer">SCU-URP-plusplus</a></span>`,p?"err":"ok");let g=document.querySelector('#urppp-set-update-status .urppp-update-relaunch[data-urppp-relaunch="assist"]');g&&g.addEventListener("click",()=>{try{vr("正在重新装载辅助插件…",""),Ft.install("assist").then(()=>{vr("辅助插件已重新装载，刷新页面后生效。","ok")}).catch(b=>{vr("重新装载失败："+(b&&b.message?b.message:b),"err")})}catch(b){vr("重新装载失败："+(b&&b.message?b.message:b),"err")}})}catch(r){vr("检查失败："+it(r&&r.message||r),"err")}finally{_a=!1,t&&(t.disabled=!1,t.textContent="检查更新")}}function en(){let t=document.getElementById("urppp-set-update-status");if(!t||t.dataset.locked==="1")return;let r="当前主插件："+n,e=t.getAttribute("data-assist-version")||"";e&&(r+="；辅助插件："+e),t.textContent=r,t.style.color="var(--text-muted)"}function ns(t){if(!t||typeof t.check!="function")return!1;let r=String(t.id||t.name||"").trim();if(!r)return!1;let e=Fr.findIndex(i=>i&&i.id===r),a={id:r,name:t.name||r,check:t.check,localVersion:t.localVersion||""};e>=0?Fr[e]=a:Fr.push(a);try{let i=document.getElementById("urppp-set-update-status");i&&a.localVersion&&r==="assist"&&i.setAttribute("data-assist-version",String(a.localVersion))}catch{}try{en()}catch{}return!0}function ps(){let t={version:n,urls:o,check:La,checkMain:Ca,registerChecker:ns,compareVersions:be,parseUserscriptVersion:Ja,extractChangelogRange:Ko,showUpdateToast:Pa,maybeAutoCheckUpdate:za,listCheckers:()=>Fr.slice()};try{window.__urpppUpdate=t}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppUpdate=t)}catch{}return t}ps();let{rebuildSidebarCompletely:an,syncMobileContentOffset:Dr,syncSidebarUnderNavbar:wr}=xi({}),{rebuildDashboard:is}=si({deps:{statCardPrivacyMarkup:us}}),ss="urppp-clean-open",qa={100:4,99:4,98:4,97:4,96:4,95:4,94:3.9,93:3.8,92:3.7,91:3.6,90:3.5,89:3.4,88:3.3,87:3.2,86:3.1,85:3,84:2.9,83:2.8,82:2.7,81:2.6,80:2.5,79:2.4,78:2.3,77:2.2,76:2.1,75:2,74:1.9,73:1.8,72:1.7,71:1.6,70:1.5,69:1.4,68:1.3,67:1.2,66:1.1,65:1,64:.9,63:.8,62:.7,61:.6,60:.5};function pr(t){if(t==null||t==="")return!1;let r=String(t).trim();if(!r)return!1;if(/未评估|未评教|待评估|待评教/.test(r))return!0;let e=Number(r);return!Number.isNaN(e)&&e<0}function Me(t){if(t==null||t==="")return!1;let r=Number(t);return!Number.isNaN(r)&&r>=0&&r<=5}function $e(t){let r=String(t||"").trim();if(!r)return"";let e=r.match(/[\u4e00-\u9fffA-Za-z0-9]/);return e?e[0]:r.charAt(0)}function Ta(t,r){let e=String(t||""),a=Number(r)||0;return!e||a<=0||a>e.length?!1:e.charAt(a-1)==="1"}function jr(t){if(t==null||t==="")return null;let r=String(t).trim();if(!r||pr(r)||/^免修$|^通过$|^取消$|^缓考$|^旷考$|^缺考$/.test(r))return null;if(/^A\+$/i.test(r)||/^A$/i.test(r))return 4;if(/^A-$/i.test(r))return 3.7;if(/^B\+$/i.test(r))return 3.3;if(/^B$/i.test(r))return 3;if(/^B-$/i.test(r))return 2.7;if(/^C\+$/i.test(r))return 2.3;if(/^C$/i.test(r))return 2;if(/^C-$/i.test(r))return 1.7;if(/^D$/i.test(r))return 1.3;if(/^F$/i.test(r))return 0;if(/优秀/.test(r))return 4;if(/良好/.test(r))return 3;if(/中等/.test(r))return 2;if(/及格/.test(r)&&!/不及格/.test(r))return 1;if(/不及格|不合格|不通过/.test(r))return 0;if(/合格/.test(r))return 1;let e=parseFloat(r.replace(/[^\d.]/g,""));if(Number.isNaN(e)||e<0)return null;let a=Math.round(e);return a<60?0:a>100?4:qa[a]!=null?qa[a]:qa[Math.max(60,Math.min(100,Math.floor(e)))]||0}function Or(t){let r=String(t||"").trim();if(!r||pr(r))return null;if(/优秀/.test(r))return 95;if(/良好/.test(r))return 85;if(/中等/.test(r))return 75;if(/及格/.test(r)&&!/不及格/.test(r))return 65;if(/不及格|不合格|不通过/.test(r))return 0;if(/合格/.test(r))return 70;if(/^A/i.test(r))return 95;if(/^B/i.test(r))return 85;if(/^C/i.test(r))return 75;if(/^D/i.test(r))return 65;if(/^F/i.test(r))return 0;let e=parseFloat(r.replace(/[^\d.]/g,""));return Number.isNaN(e)||e<0?null:e}function kr(t){return Math.round((Number(t)||0)*100)/100}function on(t){return/必修/.test(String(t||""))}function Zt(t){let r=0,e=0,a=0,i=0,p=0,s=0,g=0,b=0;return(t||[]).forEach(_=>{if(_&&(_.unevaluated||pr(_.score)))return;let M=Number(_.credit)||0,D=Or(_.score),P=Me(_.officialGpa)?Number(_.officialGpa):jr(_.score);D==null||M<=0||(r+=M,e+=D*M,P!=null&&(a+=P*M,i+=M),_.required&&(p+=M,s+=D*M,P!=null&&(g+=P*M,b+=M)))}),{totalCredit:kr(r),avgScore:kr(r?e/r:0),avgGpa:kr(i?a/i:0),requiredCredit:kr(p),requiredGpa:kr(b?g/b:0),requiredAvg:kr(p?s/p:0),count:(t||[]).length}}function Ma(t){let r=String(t||"");return/^https?:\/\//i.test(r)?r:r.startsWith("//")?location.protocol+r:r.startsWith("/")?location.origin+r:location.origin+"/"+r.replace(/^\.\//,"")}function Gt(t,r){let e=Ma(t),a=r&&r.method||"GET",i=r&&r.data||null;return new Promise((p,s)=>{let g=(b,_)=>b?p(_):s(new Error(_||"fetch failed"));try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:a,url:e,data:i||void 0,headers:r&&r.headers?r.headers:{},withCredentials:!0,onload:b=>{b.status>=200&&b.status<400?g(!0,b.responseText||""):g(!1,"HTTP "+b.status)},onerror:()=>g(!1,"network error")});return}}catch{}fetch(e,{method:a,credentials:"include",cache:"no-store",headers:r&&r.headers?r.headers:{},body:i||void 0}).then(b=>{if(!b.ok)throw new Error("HTTP "+b.status);return b.text()}).then(b=>g(!0,b)).catch(b=>g(!1,b&&b.message))})}function Ie(t){return new DOMParser().parseFromString(String(t||""),"text/html")}function nn(){if(document.getElementById("urppp-feature-style"))return;let t=document.createElement("style");t.id="urppp-feature-style",t.textContent=Np,(document.head||document.documentElement).appendChild(t)}function ls(){if(document.getElementById("urppp-schedule-export-style"))return;let t=document.createElement("style");t.id="urppp-schedule-export-style",t.textContent=Dp,(document.head||document.documentElement).appendChild(t)}function cs(){if(document.getElementById("urppp-settings-style"))return;let t=document.createElement("style");t.id="urppp-settings-style",t.textContent=jp,(document.head||document.documentElement).appendChild(t)}function pn(t){let e=(t&&t.querySelector?t:document).querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(!e)return null;let a=e.querySelector(".urppp-user-name-value");if(a)return a;let i=e.cloneNode(!0);i.querySelectorAll("small, i, img, b, .badge").forEach(g=>g.remove());let p=(i.textContent||"").replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim();Array.from(e.childNodes).forEach(g=>{g.nodeType===Node.TEXT_NODE&&g.textContent.trim()&&g.remove()});let s=document.createElement("span");return s.className="urppp-user-name-value",s.textContent=p||"同学",s.__urpppOriginalText=s.textContent,e.appendChild(s),s}function Ne(t){let r=String(t||"").replace(/[\s:：]/g,"");return r?/姓名|英文姓名|姓名拼音/.test(r)?"name":/学号|证件|身份证|护照|证书编号|考生号|录取号|学籍号/.test(r)?"identity":/学院|院系|专业|班级|年级|主修方案|培养方案|专业方向|分流方向|毕业中学/.test(r)?"organization":/电话|手机|电子邮件|邮箱|QQ|地址|家长|个人主页|出生日期|入学日期|乘车区间|性别|籍贯|民族|政治面貌|国籍|户口|户籍|生源|出生地|健康|宗教|血型|婚姻|联系人|家庭/.test(r)?"contact":/绩点|GPA/.test(r)?"gpa":/学分/.test(r)?"credit":/成绩|分数|高考总分|均分|平均分|必修平均|课程门数|及格课程|不及格课程|待修读课程|已修读课程/.test(r)?"grade":/课表|日程安排/.test(r)?"schedule":"":""}function ds(t,r){let e=String(t||"")+" "+String(r||"");return/绩点|GPA/.test(e)?"majorGpa":/主修为|培养方案|方案/.test(e)?"majorPlan":/尚不及格|未及格/.test(e)?"failedCourses":/待修读课程/.test(e)?"remainingCourses":/已修读课程/.test(e)?"completedCourses":""}function Be(t,r,e){let a=r?` data-urppp-edit-key="${r}"`:"";return`<span class="urppp-private-value" data-urppp-private="${t}"${a}>${e}</span>`}function us(t,r){let e=it(t),a=it(r),i=ds(t,r),s={completedCourses:"other",failedCourses:"other",majorGpa:"gpa",majorPlan:"organization",remainingCourses:"other"}[i]||Ne(String(t||"")+" "+String(r||""));if(s==="organization")return r?{valueHtml:e,labelHtml:Be("organization",i,a)}:{valueHtml:Be("organization",i,e),labelHtml:a};if(!["grade","gpa","credit","other"].includes(s))return{valueHtml:e,labelHtml:a};let g=String(r||"").match(/-?\d+(?:\.\d+)?/);if(!(/^-?\d+(?:\.\d+)?$/.test(String(t||"").trim())||/^(优秀|良好|中等|及格|不及格|合格|不合格)$/.test(String(t||"").trim()))&&g){let _=g.index||0,M=String(r).slice(0,_),D=String(r).slice(_+g[0].length);return{valueHtml:e,labelHtml:`${it(M)}${Be(s,i,it(g[0]))}${it(D)}`}}return{valueHtml:Be(s,i,e),labelHtml:a}}function Ar(t,r){if(!t||t.mode==="off")return"";if(t.mode==="one")return t.mask||xe;if(r==="name")return"";let e=t.fields&&t.fields[r];return!e||!e.enabled?"":String(e.replacement||t.mask||xe)}function pe(t,r){if(!(!t||!r)&&!(t.querySelector&&t.querySelector("input,select,textarea,button"))){if(!t.classList.contains("urppp-private-text")){let e=getComputedStyle(t).fontSize;e&&e!=="0px"&&t.style.setProperty("--urppp-private-font-size",e)}t.classList.add("urppp-private-text"),t.setAttribute("data-urppp-private-mask",r)}}function sn(t,r){if(!t||!t.parentElement)return;let e=t.parentElement;t.classList.add("urppp-private-avatar"),e.classList.add("urppp-private-avatar-host"),e.setAttribute("data-urppp-private-mask",r||xe);let a=t.getBoundingClientRect();e.style.setProperty("--urppp-avatar-left",t.offsetLeft+"px"),e.style.setProperty("--urppp-avatar-top",t.offsetTop+"px"),e.style.setProperty("--urppp-avatar-width",Math.max(1,a.width)+"px"),e.style.setProperty("--urppp-avatar-height",Math.max(1,a.height)+"px"),e.style.setProperty("--urppp-avatar-radius",getComputedStyle(t).borderRadius||"50%")}function ms(t,r){if(!t||!r)return;let e=t.matches("table")&&t.closest(".table-responsive, .urppp-table-wrap")||t;e.classList.add("urppp-private-block"),e.setAttribute("data-urppp-private-mask",r)}function bs(t,r){if(!(!t||!R[r])){if(!t.hasAttribute("data-urppp-direct-tabindex")){let e=t.getAttribute("tabindex");t.setAttribute("data-urppp-direct-tabindex",e??"__none__"),t.__urpppDirectTitle=t.getAttribute("title"),t.__urpppDirectAriaLabel=t.getAttribute("aria-label")}t.classList.add("urppp-direct-editable"),t.setAttribute("tabindex","0"),t.setAttribute("data-urppp-edit-key",r),t.setAttribute("aria-label","修改"+R[r]+"显示值"),t.title="点击修改显示值"}}let mr=null;function ln(t){let r=t&&t.getAttribute("data-urppp-edit-key");if(!r||!R[r])return;mr&&mr.__finish&&mr.__finish(!1);let e=xr();if(e.mode!=="custom"||!e.directEdit.enabled)return;let i=String(e.directEdit.values[r]||"")||t.getAttribute("data-urppp-private-mask")||String(t.textContent||"").trim(),p=t.getBoundingClientRect(),s=t.parentElement?.getBoundingClientRect(),g=p.height>=8||!s?p:{left:p.left,top:s.top,width:Math.max(p.width,40),height:s.height},b=document.createElement("input"),_=getComputedStyle(t),M=Math.min(Math.max(g.width+64,140),Math.max(140,window.innerWidth-24)),D=Math.min(Math.max(12,g.left),Math.max(12,window.innerWidth-M-12)),P=Math.min(Math.max(12,g.top+(g.height-36)/2),Math.max(12,window.innerHeight-48));b.type="text",b.maxLength=80,b.className="urppp-direct-edit-input",b.value=i,b.setAttribute("aria-label","修改"+R[r]+"显示值"),b.style.left=D+"px",b.style.top=P+"px",b.style.setProperty("--urppp-direct-edit-width",M+"px"),b.style.fontFamily=_.fontFamily,b.style.fontSize=(window.innerWidth<=520?16:Math.min(18,Math.max(13,parseFloat(_.fontSize)||14)))+"px";let B=!1,G=F=>{if(B||(B=!0,b.remove(),mr===b&&(mr=null),F))return;let H=xr();H.mode!=="custom"||!H.directEdit.enabled||(H.directEdit.values[r]=String(b.value||"").trim().slice(0,80),ia(H),Jt(document),Fa(H.directEdit.values[r]?"显示值已更新":"已恢复分类设置"))};b.__finish=G,b.addEventListener("click",F=>F.stopPropagation()),b.addEventListener("blur",()=>G(!1)),b.addEventListener("keydown",F=>{F.key==="Enter"&&(F.preventDefault(),G(!1)),F.key==="Escape"&&(F.preventDefault(),G(!0))}),document.documentElement.appendChild(b),mr=b,b.focus(),b.select()}function hs(){document.__urpppDirectEditBound||(document.__urpppDirectEditBound=!0,document.addEventListener("click",t=>{let r=t.target?.closest?.(".urppp-direct-editable");r&&(t.preventDefault(),t.stopPropagation(),ln(r))},!0),document.addEventListener("keydown",t=>{if(!["Enter"," "].includes(t.key))return;let r=t.target?.closest?.(".urppp-direct-editable");r&&(t.preventDefault(),t.stopPropagation(),ln(r))},!0))}function gs(t){let r=t&&t.querySelectorAll?t:document;r.querySelectorAll(".urppp-direct-editable").forEach(e=>{let a=e.getAttribute("data-urppp-direct-tabindex");e.classList.remove("urppp-direct-editable"),e.removeAttribute("data-urppp-direct-tabindex"),a==="__none__"?e.removeAttribute("tabindex"):a!=null&&e.setAttribute("tabindex",a),e.__urpppDirectTitle==null?e.removeAttribute("title"):e.setAttribute("title",e.__urpppDirectTitle),e.__urpppDirectAriaLabel==null?e.removeAttribute("aria-label"):e.setAttribute("aria-label",e.__urpppDirectAriaLabel),delete e.__urpppDirectTitle,delete e.__urpppDirectAriaLabel}),r.querySelectorAll(".urppp-private-text").forEach(e=>{e.classList.remove("urppp-private-text"),e.removeAttribute("data-urppp-private-mask"),e.style.removeProperty("--urppp-private-font-size")}),r.querySelectorAll(".urppp-private-avatar").forEach(e=>e.classList.remove("urppp-private-avatar")),r.querySelectorAll(".urppp-private-avatar-host").forEach(e=>{e.classList.remove("urppp-private-avatar-host"),e.removeAttribute("data-urppp-private-mask"),["--urppp-avatar-left","--urppp-avatar-top","--urppp-avatar-width","--urppp-avatar-height","--urppp-avatar-radius"].forEach(a=>e.style.removeProperty(a))}),r.querySelectorAll(".urppp-private-avatar-block").forEach(e=>{e.classList.remove("urppp-private-avatar-block"),e.removeAttribute("data-urppp-private-mask")}),r.querySelectorAll(".urppp-private-block").forEach(e=>{e.classList.remove("urppp-private-block"),e.removeAttribute("data-urppp-private-mask")})}function cn(t,r,e){if(!t||t.matches?.("input,select,textarea,button")||t.querySelector?.("input,select,textarea,button"))return;if(t.__urpppOriginalText==null){if(!r)return;t.__urpppOriginalText=t.textContent||""}let a=r&&e?e:t.__urpppOriginalText;t.textContent!==a&&(t.textContent=a)}function fs(t){let r=t&&t.querySelectorAll?t:document,e=Lr(),i=r.querySelector?.(".urppp-user-name-value")||(e.nameEnabled?pn(r):null);cn(i,e.nameEnabled,e.name),r.querySelectorAll(".profile-info-row").forEach(g=>{let b=g.querySelector(".profile-info-name"),_=g.querySelector(".profile-info-value");!b||!_||String(b.textContent||"").replace(/[\s:：]/g,"")!=="姓名"||cn(_,e.nameEnabled,e.name)});let p=Kr(e.avatar),s=e.avatarEnabled&&!!p;r.querySelectorAll("#navbar img.nav-user-photo, #urppp-mobile-user img.nav-user-photo, img#avatar, .profile-picture img").forEach(g=>{let b=g.getAttribute("src")||"";b&&b!==g.__urpppAppliedCustomSrc&&(g.__urpppOriginalSrc=b),s?(g.__urpppOriginalSrc==null&&(g.__urpppOriginalSrc=b),b!==p&&g.setAttribute("src",p),g.__urpppAppliedCustomSrc=p):g.__urpppAppliedCustomSrc!=null&&(g.__urpppOriginalSrc&&g.setAttribute("src",g.__urpppOriginalSrc),delete g.__urpppAppliedCustomSrc)})}function xs(t,r){t.querySelectorAll(".profile-info-row").forEach(e=>{let a=e.querySelector(".profile-info-name, th, label"),i=e.querySelector(".profile-info-value, td:last-child");if(!a||!i||a===i)return;let p=Ne(a.textContent),s=Ar(r,p);s&&pe(i,s)})}function ys(t,r){t.querySelectorAll("table").forEach(e=>{let a=Array.from(e.querySelectorAll("thead th, thead td, tr:first-child th, tr:first-child td"));if(!a.length)return;let i=a.map(p=>{let s=Ne(p.textContent);return["grade","gpa","credit"].includes(s)?s:""});i.some(Boolean)&&e.querySelectorAll("tbody tr").forEach(p=>{let s=p.querySelectorAll("td");i.forEach((g,b)=>{let _=Ar(r,g);g&&_&&pe(s[b],_)})})})}function vs(t){let r=t&&t.querySelectorAll?t:document,e=xr();if(e.mode==="off")return;let a=Ar(e,"name"),i=Ar(e,"avatar"),p=Ar(e,"schedule"),s=a?pn(r):r.querySelector?.(".urppp-user-name-value");a&&pe(s,a),[["#courseNum, #coursePas, #xy_kcms","other"],["#gpa","gpa"],["#bottom","organization"]].forEach(([_,M])=>{let D=Ar(e,M);D&&r.querySelectorAll(_).forEach(P=>pe(P,D))}),ys(r,e);let b=e.mode==="custom"&&e.directEdit.enabled;if(r.querySelectorAll("[data-urppp-private]").forEach(_=>{let M=_.getAttribute("data-urppp-private"),D=_.getAttribute("data-urppp-edit-key"),B=(b&&D?String(e.directEdit.values[D]||"").trim():"")||Ar(e,M);!["avatar","schedule"].includes(M)&&B&&pe(_,B),b&&D&&bs(_,D)}),b&&hs(),xs(r,e),i&&(r.querySelectorAll('[data-urppp-private="avatar"]').forEach(_=>{let M=_.matches("img")?_:_.querySelector("img");M?sn(M,i):(_.classList.add("urppp-private-avatar-block"),_.setAttribute("data-urppp-private-mask",i))}),r.querySelectorAll("#navbar img.nav-user-photo, img#avatar, .profile-picture img, .uc-avatar img").forEach(_=>sn(_,i))),p){let _=Array.from(r.querySelectorAll('[data-urppp-private="schedule"], #main-calendar, #courseTable'));_.filter(M=>!_.some(D=>D!==M&&D.contains(M))).forEach(M=>ms(M,p))}}let $a=0,ir=[];function dn(){let t=xr(),r=Lr();return t.mode!=="off"||r.nameEnabled||r.avatarEnabled}function ws(){ir=ir.filter(({root:t})=>t&&t.isConnected),ir.forEach(({root:t,observer:r})=>r.observe(t,{childList:!0,subtree:!0}))}function Jt(t){let r=t||document;ir.forEach(({observer:e})=>e.disconnect());try{nn()}catch{}try{gs(r)}catch{}try{fs(r)}catch(e){console.warn("[URP++] custom identity",e)}try{vs(r)}catch(e){console.warn("[URP++] privacy",e)}dn()?(ws(),As()):(clearTimeout($a),ir=[])}function ks(t){clearTimeout($a),$a=setTimeout(()=>Jt(t||document),140)}function Ia(){try{at&&at.open&&Jr()}catch{}}function As(){if(!dn()){ir.forEach(({observer:t})=>t.disconnect()),ir=[];return}[document.getElementById("navbar"),document.getElementById("page-content-template"),document.getElementById("urppp-clean-root")].filter(Boolean).forEach(t=>{if(ir.some(e=>e.root===t))return;let r=new MutationObserver(()=>ks(document));ir.push({root:t,observer:r}),r.observe(t,{childList:!0,subtree:!0})})}function Ss(t){let r=Object.assign({},t||{}),e=Lr();e.nameEnabled&&e.name&&(r.name=e.name);let a=Kr(e.avatar);return e.avatarEnabled&&a&&(r.avatar=a),r}let un="/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback",_s="/student/courseSelect/thisSemesterCurriculum/callback",Es="/student/courseSelect/thisSemesterCurriculum/index";async function Cs(){let t=document.querySelector("#planCode, #zxjxjhh");if(t&&t.value&&t.value!=="no")return String(t.value);try{let r=new URLSearchParams(location.search),e=r.get("planCode")||r.get("zxjxjhh");if(e)return e}catch{}if(at&&at.schedule&&at.schedule.exportData){let r=at.schedule.exportData.semester&&at.schedule.exportData.semester.planCode;if(r)return r}if(/\/student\/courseSelect\/courseSelectResult\//.test(location.pathname))try{let r=await Gt(_s),e=JSON.parse(r),a=Xr(e);if(a)return a}catch{}return""}async function mn(t){let r=await Cs(),e=r?{method:"POST",data:"planCode="+encodeURIComponent(r),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}:null,a=await Gt(un,e),i;try{i=JSON.parse(a)}catch{throw new Error("课表接口返回了非 JSON 内容，请刷新教务页面后重试")}r||(r=Xr(i)),(!i.jcsjbs||!i.jcsjbs.length)&&r&&(i=JSON.parse(await Gt(un,{method:"POST",data:"planCode="+encodeURIComponent(r),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}})));let p=hn(i,r,t);if(!p.courses.length)throw new Error("没有读取到可导出的课表数据");return p}function Na(t){return String(t||"学生课表").replace(/[\\/:*?"<>|]+/g,"-").replace(/\s+/g,"").slice(0,80)||"学生课表"}function Ba(t,r){let e=URL.createObjectURL(t),a=document.createElement("a");a.href=e,a.download=r,a.style.display="none",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(e),1200)}function Ps(t){let r=Ue(t),e=Se(),a=e.enabled?Ge(r,e.mapping):We(r),i=JSON.stringify(a,null,2)+`
`;return Ba(new Blob([i],{type:"application/json;charset=utf-8"}),Na(t.semester.label)+".json"),Object.assign({customFormat:e.enabled},r.stats)}function bn(t){let e=(Array.from(document.querySelectorAll(".span_bbzx")).map(s=>s.textContent||"").join(" ")+" "+(document.querySelector("#navbar")?.textContent||"")).replace(/\s+/g," ").match(/(\d{4})-(\d{4})\s*(春|秋).*?第\s*(\d{1,2})\s*周/);if(!e)return"";let a=e[3]==="秋"?"1":"2";if(t&&!String(t).startsWith(e[1]+"-"+e[2]+"-"+a))return"";let i=Number(e[4]);if(i<1||i>30)return"";let p=Qa(new Date);return p.setDate(p.getDate()-(i-1)*7),fe(p)}function hn(t,r,e){let a=r||Xr(t),i=bn(a)||sa()[a]||"";return ep(t,a,e,{firstMonday:i})}function zs(t){let r=t.semester.planCode,e=sa()[r],a=bn(r);return a?(co(r,a),Promise.resolve(a)):Qr(e)?Promise.resolve(e):new Promise((i,p)=>{document.querySelector('.urppp-dialog-mask[data-dialog="schedule-date"]')?.remove();let s=document.createElement("div");s.className="urppp-dialog-mask",s.dataset.dialog="schedule-date",s.innerHTML=`<div class="urppp-dialog" role="dialog" aria-modal="true"><h3>确认第一教学周周一</h3><p>${it(t.semester.label)}没有可可靠推导的起始日期。该日期决定 ICS 中每节课的实际日历时间；预填值仅为估算，请对照校历核对。</p><input type="date" value="${it(e||Xn(r))}"><div class="urppp-dialog-actions"><button type="button" class="urppp-set-btn ghost" data-action="cancel">取消</button><button type="button" class="urppp-set-btn" data-action="ok">确认并导出</button></div></div>`,document.documentElement.appendChild(s);let g=(b,_)=>{s.remove(),b?p(b):i(_)};s.querySelector('[data-action="cancel"]').addEventListener("click",()=>g(new Error("已取消导出"))),s.querySelector('[data-action="ok"]').addEventListener("click",()=>{let b=s.querySelector("input").value;Qr(b)&&(co(r,b),g(null,b))}),s.addEventListener("click",b=>{b.target===s&&g(new Error("已取消导出"))})})}async function Ls(t){let r=await zs(t),e=Zn(t,r);return Ba(new Blob([e],{type:"text/calendar;charset=utf-8"}),Na(t.semester.label)+".ics"),tp(t)}let qs={apple:"类 Apple",flat:"极简扁平",organic:"自然有机",brutal:"新野兽派",editorial:"编辑杂志",neu:"新拟物"};function sr(t,r,e){if(typeof document>"u")return Ut(r)||"#000000";let a=document.createElement("span");a.style.cssText="position:fixed;left:-9999px;visibility:hidden;color:var("+t+","+r+")",(document.body||document.documentElement).appendChild(a);let i=getComputedStyle(a).color;a.remove();let p=String(i||"").match(/[\d.]+/g)?.map(Number)||[];if(p.length>=3){let s=me(p[0],p[1],p[2]),g=p.length>3?Math.max(0,Math.min(1,p[3])):1;return g<1?It(e||r,s,g):s}return Ut(i)||Ut(r)||"#000000"}function gn(){let t=Yt(),r=or(),e=t==="dark",a=e?{bg:"#000000",surface:"#1C1C1E",input:"#2C2C2E",text:"#F5F5F7",secondary:"#A1A1A6",muted:"#8E8E93",border:"#38383A",primary:"#0A84FF"}:{bg:"#F5F5F7",surface:"#FFFFFF",input:"#F5F5F7",text:"#1D1D1F",secondary:"#6E6E73",muted:"#86868B",border:"#D2D2D7",primary:"#0071E3"},i={bg:sr("--bg",a.bg),surface:sr(r==="neu"?"--neu-base":"--surface",a.surface),input:sr("--input-bg",a.input),text:sr("--text",a.text),secondary:sr("--text-secondary",a.secondary),muted:sr("--text-muted",a.muted),border:sr("--border",a.border,sr(r==="neu"?"--neu-base":"--surface",a.surface)),primary:sr("--primary",a.primary)},p={apple:{frameRadius:24,headerRadius:13,gridRadius:10,cardRadius:12,frameStroke:1,cardStroke:1,shadow:"soft"},flat:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:2,cardStroke:2,shadow:"none"},organic:{frameRadius:30,headerRadius:18,gridRadius:14,cardRadius:18,frameStroke:1,cardStroke:1,shadow:"warm"},brutal:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:3,cardStroke:3,shadow:"hard"},editorial:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:1,cardStroke:1,shadow:"none",serif:!0},neu:{frameRadius:22,headerRadius:14,gridRadius:10,cardRadius:14,frameStroke:0,cardStroke:0,shadow:"neu"}};return{id:t,skin:r,dark:e,label:(qs[r]||r)+" · "+(_t[t]&&_t[t].name||t),colors:i,shape:p[r]||p.apple}}function fn(t,r){return dp(t,r||gn())}function Ts(t){return new Promise((r,e)=>{let a=new Blob([t.svg],{type:"image/svg+xml;charset=utf-8"}),i=URL.createObjectURL(a),p=new Image;p.onload=()=>{try{let g=Math.min(2,Math.sqrt(15e6/(t.width*t.height))),b=document.createElement("canvas");b.width=Math.floor(t.width*g),b.height=Math.floor(t.height*g);let _=b.getContext("2d");_.scale(b.width/t.width,b.height/t.height),_.fillStyle=t.background||"#F8FAFC",_.fillRect(0,0,t.width,t.height),_.drawImage(p,0,0,t.width,t.height),b.toBlob(M=>M?r(M):e(new Error("无法生成课表图片")),"image/png")}catch(s){e(s)}finally{URL.revokeObjectURL(i)}},p.onerror=()=>{URL.revokeObjectURL(i),e(new Error("课表图片渲染失败"))},p.src=i})}async function Ms(t){let r=await Ts(fn(t));Ba(r,Na(t.semester.label)+".png")}function Fa(t,r){document.getElementById("urppp-feature-toast")?.remove();let e=document.createElement("div");e.id="urppp-feature-toast",e.textContent=String(t||""),e.className=r?"error":"",document.documentElement.appendChild(e),requestAnimationFrame(()=>e.classList.add("open")),setTimeout(()=>{e.classList.remove("open"),setTimeout(()=>e.remove(),220)},r?4200:2400)}let Da=up({document,window,ensureStyles:ls,loadData:mn,exportJson:Ps,exportIcs:Ls,exportPng:Ms,showToast:Fa,nativePageUrl:Es,navigate:t=>{location.href=t},logger:console});function $s(t,r,e,a){return Da.run(t,r,e,a)}function Is(t){return Da.createMenu(t)}function Ns(t){if(t){try{t.stage.remove()}catch{}try{document.getElementById("urppp-pdf-reset-style")?.remove()}catch{}}}function Bs(){window.__urpppPdfDiagnose||(window.__urpppPdfDiagnose=async()=>{let t={time:new Date().toISOString()},r=document.getElementById("mycoursetable"),e=document.getElementById("page-content-template");t.host=!!r,t.pageSource=!!e,t.hostCards=r?r.querySelectorAll("div.class_div").length:-1,t.hostHasCourseTable=r?!!r.querySelector("#courseTable"):!1,t.hostHasCourseTableBody=r?!!r.querySelector("#courseTableBody"):!1,t.hostTableId=r&&r.querySelector("table")?r.querySelector("table").id:"none";try{let i=Tp(r);t.stage="ok",t.stageCards=i.target.querySelectorAll(".urppp-pdf-card").length,t.stageTableId=i.target.querySelector("table")?i.target.querySelector("table").id:"none",Ns(i)}catch(i){t.stage="failed",t.stageError=i&&i.message||String(i)}let a=typeof unsafeWindow<"u"?unsafeWindow:window;return t.deps={dollar:typeof a.$,loadFileList:typeof(a.Import&&a.Import.LoadFileList),back:typeof a.back,html2canvas:typeof a.html2canvas,originalDivBuild:typeof a.__urpppOriginalDivBuild},t})}function Fs(t){return t?(Bs(),async()=>{let r=document.getElementById("urppp-settings-panel"),e=document.getElementById("urppp-settings-mask");r&&r.classList.contains("open")&&r.classList.remove("open"),e&&e.classList.contains("open")&&e.classList.remove("open");try{await Ip(t,{document,page:typeof unsafeWindow<"u"?unsafeWindow:window,onAfterRestore:oe})}catch(a){console.warn("[URP++] isolated native PDF export failed",a),Fa("原生 PDF 隔离导出失败："+(a&&a.message||String(a))+"，请重试",!0)}}):null}function ja(t=location){return/\/(?:student\/courseSelect\/(?:thisSemesterCurriculum|courseSelectResult|calendarSemesterCurriculum)|student\/personalSenate\/giveLessonInfo\/thisSemesterSchedule)\//.test(t.pathname)}function Ds(t=location){return/\/student\/integratedQuery\/scoreQuery\/[^/]+\/index$/.test(t.pathname)}function Oa(){if(!ja())return;let t=document.querySelector("#h4_id1")?.closest("h4")||document.querySelector("h4.header"),r=t?.querySelector(".right_top_oper")||document.querySelector("#mainDIV .right_top_oper, .page-content .right_top_oper"),e=Array.from((r||document).querySelectorAll("button, a")),a=s=>[s.textContent,s.getAttribute("title"),s.getAttribute("onclick")].filter(Boolean).join(" ").replace(/\s+/g," ");if(e.forEach(s=>{/打印.*课表|\bdy\s*\(/i.test(a(s))&&s.setAttribute("data-urppp-native-print-source","1")}),document.getElementById("urppp-native-schedule-export"))return;let i=e.find(s=>/导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(a(s))),p=Is({source:"native",pdfHandler:Fs(i)});if(p.id="urppp-native-schedule-export",i&&i.parentElement){i.__urpppNativeExportState||(i.__urpppNativeExportState={display:i.style.getPropertyValue("display"),displayPriority:i.style.getPropertyPriority("display"),ariaHidden:i.getAttribute("aria-hidden"),tabIndex:i.getAttribute("tabindex")}),i.setAttribute("data-urppp-native-export-source","1"),i.style.setProperty("display","none","important"),i.setAttribute("aria-hidden","true"),i.setAttribute("tabindex","-1"),i.parentElement.insertBefore(p,i.nextSibling);return}if(r)r.appendChild(p);else if(t)t.appendChild(p);else{let s=document.getElementById("page-content-template")||document.querySelector(".page-content");if(s){let g=document.createElement("div");g.className="urppp-export-fallback",g.appendChild(p),s.prepend(g)}}}let Hr=null,Fe=0;function Ha(){clearTimeout(Fe),Fe=0,Hr&&Hr.observer.disconnect(),Hr=null}function js(){if(!ja()){Ha();return}let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;if(!t||Hr&&Hr.root===t&&t.isConnected)return;Ha();let r=new MutationObserver(()=>{clearTimeout(Fe),Fe=setTimeout(()=>Oa(),80)});r.observe(t,{childList:!0,subtree:!0}),Hr={root:t,observer:r}}function xn(t,r,e){e===null?t.removeAttribute(r):t.setAttribute(r,e)}function Os(t=document){let r=t&&t.querySelectorAll?t:document,e=r.matches?.("#urppp-native-schedule-export")?r:r.querySelector("#urppp-native-schedule-export");if(e){let a=e.closest(".urppp-export-fallback");e.remove(),a&&!a.children.length&&a.remove()}r.querySelectorAll("[data-urppp-native-export-source]").forEach(a=>{let i=a.__urpppNativeExportState;i&&(i.display?a.style.setProperty("display",i.display,i.displayPriority):a.style.removeProperty("display"),xn(a,"aria-hidden",i.ariaHidden),xn(a,"tabindex",i.tabIndex)),a.removeAttribute("data-urppp-native-export-source");try{delete a.__urpppNativeExportState}catch{}}),r.querySelectorAll("[data-urppp-native-print-source]").forEach(a=>{a.removeAttribute("data-urppp-native-print-source")})}let yn=gi({deps:{styles:Wp,loadScores:Mn,loadProfile:vn,scoreToNumber:Or,scoreToGpa:jr,getInsertHost:()=>document.querySelector(".page-content")||document.getElementById("page-content-template")||null,shouldAutoExpand:()=>{let t=/[?&]urppp=sa(?:&|$)/.test(window.location.search);if(t)try{history.replaceState(null,"",window.location.pathname+window.location.hash)}catch{}return t}}}),Hs=Un([He({id:"schedule-export",matches:t=>ja(t.location),mount:()=>{Oa(),js()},unmount:t=>{Ha(),Os(t?.lifecycleKey)}}),He({id:"score-analysis",matches:t=>Ds(t.location),mount:()=>{try{yn.mount()}catch(t){console.warn("[URP++] score analysis mount",t)}},unmount:()=>{try{yn.unmount()}catch{}}})]);function De(){let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;return Hs.refresh({document,location,window,lifecycleKey:t})}function Rs(t){Da.bindHosts(t)}function ie(t){return String(t||"").replace(/\u00a0/g," ").replace(/\s+/g," ").replace(/^[\s:：]+|[\s:：]+$/g,"").trim()}function je(t,r){if(!t||!t.querySelectorAll)return"";let e=(r||[]).map(i=>ie(i).replace(/[：:]/g,"")),a=t.querySelectorAll(".profile-info-row, tr");for(let i=0;i<a.length;i++){let p=a[i],s=p.querySelector(".profile-info-name, th, label"),g=p.querySelector(".profile-info-value, td:last-child");if(!s||!g||s===g)continue;let b=ie(s.textContent).replace(/[：:]/g,"");if(!e.some(M=>b===M||b.endsWith(M)))continue;let _=ie(g.textContent);if(_&&_!=="—"&&_!=="-")return _}return""}function Rr(t){return ie(t).replace(/^主修为\s*/,"").replace(/培养方案概况.*$/,"").replace(/…+/g,"").split(/主修必修GPA|GPA算法|已修读|尚不及格|本学期/)[0].trim()}function Us(t){let r={majorPlan:"",majorGpa:""};return!t||!t.querySelectorAll||t.querySelectorAll(".infobox, .widget-box, .urppp-stat-card").forEach(e=>{let a=(e.innerText||e.textContent||"").trim(),i=ie(a);if(/主修必修GPA/.test(i)){let p=i.match(/(-?\d+(?:\.\d+)?)\s*主修必修GPA/)||i.match(/主修必修GPA[^\d-]{0,20}(-?\d+(?:\.\d+)?)/);if(p){let s=Number(p[1]),g=Number(r.majorGpa);Number.isFinite(s)&&s>=0&&s<=5&&(!r.majorGpa||g===0||s>0)&&(r.majorGpa=p[1])}}if(/主修为|培养方案/.test(i)){let p=i.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·+\-]{2,60}(?:培养方案|教学计划))/)||i.match(/^(.{2,60}?)\s*主修为/)||i.match(/主修为\s*(.{2,60})$/),s=Rr(p&&p[1]);if(s&&!/GPA|已修读|尚不及格|本学期/.test(s)){let g=/培养方案|教学计划/.test(s);(!r.majorPlan||g)&&(r.majorPlan=s)}}}),r}async function vn(){let t={name:"",avatar:"",majorPlan:"",majorGpa:"",studentId:""};try{let e=document.querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(e){let p=e.querySelector(".urppp-user-name-value"),s=p&&p.__urpppOriginalText;s&&(t.name=String(s).trim());let g=(e.innerText||e.textContent||"").replace(/\s+/g," ").trim(),b=t.name?null:g.match(/欢迎您[，,]\s*([\u4e00-\u9fa5·]{2,12})/);if(!t.name&&!b){let _=e.cloneNode(!0);_.querySelectorAll("small, i, img, b, .badge").forEach(D=>D.remove());let M=(_.textContent||"").replace(/\s+/g," ").trim();M=M.replace(/^欢迎您[，,]\s*/g,"").replace(/\d{8,}/g,"").trim(),b=M.match(/([\u4e00-\u9fa5·]{2,12})/)}b&&b[1]&&!/欢迎|同学|首页|反馈|密码|注销/.test(b[1])&&(t.name=b[1])}let a=document.querySelector("#navbar img.nav-user-photo, .ace-nav img.nav-user-photo");a&&(t.avatar=a.__urpppOriginalSrc||a.src||a.getAttribute("src")||"");let i=Us(document);t.majorPlan=i.majorPlan,t.majorGpa=i.majorGpa}catch{}try{let e=await Gt("/student/rollManagement/rollInfo/index"),a=Ie(e),i=a.body&&(a.body.innerText||a.body.textContent)||"";if(!t.name&&(t.name=je(a,["姓名"]),!t.name)){let b=i.match(/姓名\s*[：:]?\s*([\u4e00-\u9fa5·]{2,20})/);b&&(t.name=b[1].trim())}let p=je(a,["主修方案名称"]),s=je(a,["专业"]);t.studentId=je(a,["学号"]),p?t.majorPlan=Rr(p):!t.majorPlan&&s&&(t.majorPlan=Rr(s));let g=a.querySelector('.profile-picture img, img#avatar, img[src*="photo" i], img[src*="Photo"]');if(g&&g.getAttribute("src")&&!t.avatar){let b=g.getAttribute("src");t.avatar=/^https?:/i.test(b)?b:Ma(b)}}catch{}let r=Number(t.majorGpa);return t.name||(t.name="同学"),t.majorPlan||(t.majorPlan="主修方案"),(!Number.isFinite(r)||r<=0||r>5)&&(t.majorGpa="—"),t}let wn=["周日","周一","周二","周三","周四","周五","周六"];function Ra(t){let r=[],e=t.querySelector("#courseTableBody")||t.querySelector("#courseTable tbody");if(!e)return r;e.querySelectorAll("td[id]").forEach(i=>{let p=String(i.id||"").match(/^(\d+)_(\d+)$/);if(!p)return;let s=parseInt(p[1],10),g=parseInt(p[2],10),b=s===7?0:s,_=i.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"]'),M=_.length?_:[];if(!M.length&&(i.textContent||"").trim()){let D=(i.textContent||"").replace(/\s+/g," ").trim();D&&r.push({name:D.slice(0,40),teacher:"",place:"",week:"",day:b,section:g});return}M.forEach(D=>{let P=Array.from(D.querySelectorAll("p")).map(X=>(X.textContent||"").trim()).filter(Boolean),B=(D.querySelector(".p-kcm-1, .p-kcm")||{}).textContent||P[0]||"",G=(D.querySelector('.p-jxl-1, [class*="jxl"]')||{}).textContent||"",F=P.find((X,dt)=>dt>0&&!/周|节/.test(X)&&X!==G)||"",H=P.find(X=>/周/.test(X))||"",N=String(B).replace(/_\d+\s*$/,"").trim();!N||N.length<2||r.push({name:N,teacher:String(F).trim(),place:String(G||"").trim(),week:String(H).trim(),day:b,section:g})})});let a=new Set;return r.filter(i=>{let p=[i.day,i.section,i.name,i.place].join("|");return a.has(p)?!1:(a.add(p),!0)})}let kn="urppp_term_week_v1";function Ur(t){let r=Number(t)||0;if(r<1||r>30)return 0;at._termWeek=r,at._termWeekResolved=!0;try{GM_setValue(kn,r)}catch{}return r}function se(){if(at&&at._termWeek>=1)return at._termWeekResolved=!0,at._termWeek;try{let t=Number(GM_getValue(kn,0))||0;if(t>=1&&t<=30)return Ur(t)}catch{}return 0}function le(t){let r=String(t||"").replace(/\s+/g," ");if(!r)return 0;let e=[/(?:\d{4}\s*[-–]\s*\d{4}).{0,40}?第\s*(\d{1,2})\s*周/,/20\d{2}.{0,40}?第\s*(\d{1,2})\s*周/,/(?:春|秋|夏|冬)\s*第\s*(\d{1,2})\s*周/,/第\s*(\d{1,2})\s*周\s*(?:星期|周[一二三四五六日天])/];for(let a=0;a<e.length;a++){let i=r.match(e[a]);if(i){let p=parseInt(i[1],10);if(p>=1&&p<=30)return p}}return 0}function Sr(){if(at._termWeekResolved&&at._termWeek>=1&&at._termWeek<=30)return at._termWeek;try{let t=[document.querySelector("#navbar"),document.querySelector(".navbar-fixed-top"),document.querySelector(".navbar"),document.querySelector("#navbar .navbar-header"),document.querySelector("#navbar .navbar-buttons"),document.querySelector(".ace-nav"),document.querySelector("#breadcrumbs"),document.querySelector("#page-content-header"),document.querySelector(".page-header"),document.querySelector("header")].filter(Boolean);for(let s=0;s<t.length;s++){let g=t[s],b=le(g.innerText||g.textContent||"")||le(g.innerHTML||"");if(b)return Ur(b)}let r=document.documentElement&&document.documentElement.innerHTML||"",e=le(r);if(e)return Ur(e);let a=document.body&&document.body.innerText||"",i=le(a);if(i)return Ur(i);let p=se();if(p)return p}catch{}return 0}let Wr=null;function Ws(){let t=new Date,r=e=>String(e).padStart(2,"0");return`${t.getFullYear()}-${r(t.getMonth()+1)}-${r(t.getDate())}`}function Gs(t,r){let e=new Date(`${t}T00:00:00`);e.setDate(e.getDate()+r);let a=i=>String(i).padStart(2,"0");return`${e.getFullYear()}-${a(e.getMonth()+1)}-${a(e.getDate())}`}function ce(t){if(Wr)return Wr;let r=t||Ws();return r>="2027-02-06"&&r<=Gs("2027-02-06",6)?"springfestival":r>="2027-01-18"&&r<"2027-03-01"?"winter":r>="2027-07-04"&&r<"2027-08-31"||r>="2026-07-04"&&r<"2026-08-31"?"summer":"term"}function Js(){let t='<svg viewBox="0 0 52 190"><path d="M26 0v16" stroke="#c8102e" stroke-width="3"/><rect x="16" y="16" width="20" height="8" rx="4" fill="#c8102e"/><ellipse cx="26" cy="62" rx="22" ry="30" fill="#e63946"/><path d="M26 26v72M14 34q12 12 0 24M38 34q-12 12 0 24" stroke="#ffd75e" stroke-width="1.4" fill="none"/><path d="M14 92h24M17 98h18M20 104h12" stroke="#ffd75e" stroke-width="2.4" stroke-linecap="round"/></svg>';return`<div id="urppp-festive-decor" aria-hidden="true"><div class="ufd ufd-left">${t}</div><div class="ufd ufd-right">${t}</div></div>`}function An(){let t=typeof document<"u"?document:null;if(!t)return;let r=ce()==="springfestival",e=t.getElementById("urppp-festive-decor");r&&!e?t.documentElement.insertAdjacentHTML("beforeend",Js()):!r&&e&&e.remove()}function Sn(t){Wr=t==="summer"||t==="winter"||t==="springfestival"||t==="term"?t:null,Wr&&Wr!=="term"&&(at.weekLocked=!1,at.viewWeek=0);try{An()}catch{}try{typeof Jr=="function"&&Jr()}catch{}return Wr}function Vs(){return ce()}function _n(){if(ce()!=="term")return at.weekLocked?(!at.viewWeek||at.viewWeek<0)&&(at.viewWeek=0):at.viewWeek=0,at.viewWeek;let t=Sr()||se()||0;return at.weekLocked?(!at.viewWeek||at.viewWeek<1)&&(at.viewWeek=t>=1?t:1):t>=1?at.viewWeek=t:(!at.viewWeek||at.viewWeek<1)&&(at.viewWeek=1),!at.weekLocked&&t>1&&at.viewWeek===1&&(at.viewWeek=t),at.viewWeek}async function Ys(){let t=Sr();if(t>=1)return t;try{let r=await Gt("/index");if(t=le(r),t)return Ur(t)}catch{}try{let r=new Date,e=r.getFullYear()+"-"+String(r.getMonth()+1).padStart(2,"0")+"-"+String(r.getDate()).padStart(2,"0"),a="xqh=03&jxlh=302&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(e),i=await Gt("/student/teachingResources/classroomUseStatus/jasInfo",{method:"POST",data:a,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),p=JSON.parse(i),s=Number(p&&p.jxzc);if(s>=1&&s<=30)return Ur(s)}catch{}return se()||0}function Qs(t){let r=Sr()||20;return(t||[]).forEach(e=>{let a=String(e.classWeek||"");a.length>r&&(r=a.length);let i=String(e.week||"").match(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/);i&&(r=Math.max(r,parseInt(i[2],10)||0));let p=String(e.week||"").match(/\d{1,2}/g);p&&p.forEach(s=>{r=Math.max(r,parseInt(s,10)||0)})}),Math.min(Math.max(r,1),30)}function En(t,r){if(!r||!t)return!1;let e=String(t);return e.length>=r?e.charAt(r-1)==="1":!1}let Cn=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#EC4899","#84CC16","#F97316","#6366F1"];function Pn(t){let r=0,e=String(t||"");for(let a=0;a<e.length;a++)r=r*31+e.charCodeAt(a)>>>0;return Cn[r%Cn.length]}function Xs(t){let r=[],e=Sr();(t&&t.xkxx||[]).forEach(p=>{Object.keys(p||{}).forEach(s=>{let g=p[s];if(!g)return;let b=g.courseName||g.englishCourseName||s,_=g.attendClassTeacher||"";(g.timeAndPlaceList||[]).forEach(D=>{let P=Number(D.classDay)||0,B=P===7?0:P,G=Number(D.classSessions)||1,F=Math.max(1,Number(D.continuingSession)||1),H=[D.campusName,D.teachingBuildingName,D.classroomName].filter(Boolean).join(""),N=D.weekDescription||g.skzcs||"",X=En(D.classWeek,e)||e&&N.indexOf(String(e))>=0;r.push({name:String(b).trim(),teacher:String(_).trim(),place:String(H).trim(),week:String(N).trim(),classWeek:String(D.classWeek||""),day:B,section:G,span:F,thisWeek:!!X,color:Pn(b)})})})});let i=new Set;return r.filter(p=>{let s=[p.day,p.section,p.span,p.name,p.place,p.week].join("|");return i.has(s)?!1:(i.add(s),!0)})}async function Ks(){try{let t=await Gt("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),r=[],e=null;try{e=JSON.parse(t);let i=Number(e&&(e.jxzc||e.zc||e.currentWeek));i>=1&&i<=30&&(at._termWeek=Math.max(at._termWeek||0,i),at.weekLocked||(at.viewWeek=at._termWeek)),r=Xs(e)}catch{r=Ra(Ie(t))}r.length||(r=Ra(document));let a=e?hn(e,Xr(e),"clean"):null;return{courses:r,exportData:a,rawOk:r.length>0,error:r.length?"":"课表 JSON 无 timeAndPlaceList"}}catch(t){try{let r=Ra(document);if(r.length)return{courses:r,rawOk:!0,error:""}}catch{}return{courses:[],rawOk:!1,error:String(t&&t.message||t)}}}function Zs(t,r){let e=String(t||""),a=new RegExp(`url\\s*=\\s*["']([^"']*`+r+`[^"']*)["']`,"i"),i=e.match(a);if(i&&i[1])return i[1];let p=new RegExp(`(\\/student\\/integratedQuery\\/scoreQuery\\/[^"'\\s]+`+r+")","i"),s=e.match(p);return s?s[1]:""}function tl(t){let r=[];return(t&&t.lnList||[]).forEach(a=>{let i=a.cjlx||a.cjbh||a.famc||a.zxjxjhh||"成绩",p=[];(a.cjList||[]).forEach(s=>{let g=s.courseName||s.englishCourseName||"";if(!g)return;let b=s.cj!=null&&s.cj!==""?String(s.cj):"";!b&&s.courseScore!=null&&(b=String(s.courseScore)),!b&&s.gradeName&&(b=String(s.gradeName)),!b&&s.zscj!=null&&(b=String(s.zscj));let _=s.courseAttributeName||s.xkcsxmc||"",M=parseFloat(s.credit)||0,D=s.id&&(s.id.courseNumber||s.id.kch_zj)||"",P=s.id&&(s.id.coureSequenceNumber||s.id.courseSequenceNumber||s.id.kxh)||s.classNo||"",B=s.gradePointScore!=null?Number(s.gradePointScore):null,G=pr(b)||pr(s.gradeName)||B!=null&&B<0,F=G?"未评估":b;p.push({code:D,seq:String(P||""),name:g,attr:_,credit:M,score:F,unevaluated:G,required:on(_),officialGpa:Me(B)?B:null,evalUrl:""})}),p.length&&r.push({title:String(i).slice(0,100),courses:p,summary:Zt(p),meta:{zxf:a.zxf,tgms:a.tgms,zms:a.zms,famc:a.famc}})}),r}async function zn(t,r){let e=await Gt(t),a=Ln(Ie(e));if(a.length)return a;let i=Zs(e,r);if(!i)return[];let p=await Gt(i);try{let s=JSON.parse(p);a=tl(s).map(g=>(g.summary=Zt(g.courses),g))}catch{a=Ln(Ie(p))}return a}function Ln(t){let r=[];return t.querySelectorAll("table").forEach(e=>{let a=Array.from(e.tHead&&e.tHead.rows[0]?e.tHead.rows[0].cells:e.rows[0]&&e.rows[0].cells||[]).map(M=>(M.textContent||"").replace(/\s+/g,""));if(!a.length)return;let i=a.join("|");if(!/课程名/.test(i)||!/成绩/.test(i))return;let p={code:a.findIndex(M=>M==="课程号"),name:a.findIndex(M=>M==="课程名"),attr:a.findIndex(M=>/课程属性|属性/.test(M)),credit:a.findIndex(M=>M==="学分"),score:a.findIndex(M=>M==="成绩")};if(p.name<0||p.score<0)return;let s="成绩",g=e.previousElementSibling;for(let M=0;M<8&&g;M++,g=g.previousElementSibling)if(/^H[1-4]$/.test(g.tagName)||g.classList&&g.classList.contains("header")){s=(g.textContent||"").replace(/\s+/g," ").trim();break}let b=[],_=e.tBodies.length?e.tBodies[0].rows:Array.from(e.rows).slice(1);Array.from(_).forEach(M=>{let D=Array.from(M.cells||M.querySelectorAll("td"));if(D.length<4)return;let P=N=>N>=0&&D[N]?(D[N].textContent||"").replace(/\s+/g," ").trim():"",B=P(p.name),G=P(p.score);if(!B||!G||/课程名|序号/.test(B))return;let F=P(p.attr),H=pr(G);b.push({code:P(p.code),name:B,attr:F,credit:parseFloat(P(p.credit))||0,score:H?"未评估":G,unevaluated:H,required:on(F),officialGpa:null,evalUrl:""})}),b.length&&r.push({title:s.slice(0,100),courses:b,summary:Zt(b)})}),r}function de(t){return Rr(t&&t.meta&&t.meta.famc||t&&t.title||"")}function qn(t,r){if(!t||!t.length)return 0;let e=Rr(r),a=t.findIndex(s=>{let g=de(s);return/培养方案/.test(g)&&!/微专业|辅修|双学位/.test(g)});if(a>=0&&(!e||de(t[a]).includes(e.slice(0,4)))||e&&(a=t.findIndex(s=>{let g=de(s);return g.includes(e.replace(/培养方案.*/,"培养方案"))||e.includes(g.slice(0,4))||g.includes(e.slice(0,4))}),a>=0))return a;let i=0,p=-1;return t.forEach((s,g)=>{if(/微专业|辅修/.test(de(s)))return;let b=(s.courses||[]).length;b>p&&(p=b,i=g)}),i}async function rl(){let t={};try{let r=await Gt("/student/teachingAssessment/evaluation/queryAll",{method:"POST",data:"pageNum=1&pageSize=200&flag=kt",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),e;try{e=JSON.parse(r)}catch{e=null}(e&&e.data&&e.data.records||[]).forEach(i=>{let p=String(i.KCH||"").trim();if(!p)return;let s=String(i.SFPG)==="1",g=String(i.KTID||"").trim();if(!t[p]){t[p]={ktid:g,kxh:String(i.KXH||""),kcm:i.KCM||"",done:s,pending:s?0:1,total:1,url:!s&&g?"/student/teachingEvaluation/newEvaluation/evaluation/"+g:"/student/teachingEvaluation/newEvaluation/index"};return}t[p].total+=1,s||(t[p].pending+=1,t[p].done=!1,g&&(t[p].ktid=g,t[p].url="/student/teachingEvaluation/newEvaluation/evaluation/"+g))}),Object.keys(t).forEach(i=>{let p=t[i];p.done=!(p.pending>0)})}catch(r){console.warn("[URP++] evaluation map",r)}return t}function el(t){if(!t)return!1;if(t.officialGpa!=null&&Me(t.officialGpa))return!0;let r=t.score;return r==null||r===""||pr(r)?!1:Or(r)!=null||jr(r)!=null?!0:!/未评估|未评教|待评估|待评教/.test(String(r))}function al(t,r){if(!t||!r)return t;let e=a=>(a||[]).forEach(i=>{if(!i||!i.code)return;let p=r[i.code];if(p){if(el(i)){i.unevaluated=!1,p.done?i.evalUrl=i.evalUrl||"":i.evalUrl=p.url||"/student/teachingEvaluation/newEvaluation/index";return}p.done||(i.unevaluated=!0,i.evalUrl=p.url||"/student/teachingEvaluation/newEvaluation/index",(!i.score||i.score===""||pr(i.score))&&(i.score="未评估"))}});return(t.passing||[]).forEach(a=>e(a.courses)),(t.schemes||[]).forEach(a=>e(a.courses)),t}function Tn(t){return t&&(t.passing&&t.passing[0]&&(t.passing[0].summary=Zt(t.passing[0].courses)),t.schemes=(t.schemes||[]).map(r=>(r.summary=Zt(r.courses),r)),t)}async function ol(t){if(!t||t.evaluationLoading)return t;t.evaluationLoading=!0;try{let r=await rl();return al(t,r),t.evalMap=r,t.evaluationReady=!0,Tn(t)}finally{t.evaluationLoading=!1}}function nl(){if(!at.scores||!at.scores.schemes)return;let t=at.scores.schemes,r=at.profile&&at.profile.majorPlan,e=qn(t,r);at.scores.majorIdx=e,at._schemeUserSelected||(at.activeSchemeIdx=e,at._schemeInited=!0);let a=t[e];if(!a||!at.profile)return;let i=de(a),p=Rr(at.profile.majorPlan);/培养方案|教学计划/.test(i)&&(!/培养方案|教学计划/.test(p)||p==="主修方案")&&(at.profile.majorPlan=i);let s=a.summary||{},g=Number(s.requiredCredit),b=Number(s.requiredGpa),_=Number(at.profile.majorGpa);g>0&&Number.isFinite(b)&&b>=0&&b<=5&&(!Number.isFinite(_)||_<=0)&&(at.profile.majorGpa=String(kr(b)))}let Gr=null;async function Mn(t){return t&&(Gr=null),Gr&&!Gr.error||(Gr=await pl()),Gr}async function pl(){let t={passing:[],schemes:[],error:"",majorIdx:0,evaluationReady:!1,evaluationLoading:!1};try{let[r,e]=await Promise.all([zn("/student/integratedQuery/scoreQuery/allPassingScores/index","allPassingScores/callback"),zn("/student/integratedQuery/scoreQuery/schemeScores/index","schemeScores/callback")]),a=[];r.forEach(i=>i.courses.forEach(p=>{a.push(Object.assign({term:i.title},p))})),t.passing=[{title:"全部及格成绩",courses:a,summary:Zt(a),groups:r}],t.schemes=e,!t.schemes.length&&a.length&&(t.schemes=[{title:"方案成绩",courses:a,summary:Zt(a)}]),Tn(t),t.majorIdx=qn(t.schemes,at.profile&&at.profile.majorPlan),!a.length&&!t.schemes.length&&(t.error="成绩 callback 无数据")}catch(r){t.error=String(r&&r.message||r)}return t}function _r(t){if(!t)return[];let r=String(t).trim();if(!r)return[];r=r.replace(/^['"]|['"]$/g,"");try{return JSON.parse(r)}catch{}try{return JSON.parse(r.replace(/&quot;/g,'"').replace(/&#34;/g,'"'))}catch{}return[]}function $n(t,r){let e=t.indexOf(r);if(e<0)return"";let a=t.indexOf("[",e);if(a<0)return"";let i=0;for(let p=a;p<t.length&&p<a+3e5;p++){let s=t[p];if(s==="[")i++;else if(s==="]"&&(i--,i===0))return t.slice(a,p+1)}return""}async function il(){let t=await Gt("/student/teachingResources/classroomUseStatus/index");if(/欢迎登录|name=["']j_username["']|loginEn/i.test(t)&&!/jxlList|teachingBuildingName|classroomUseStatus/i.test(t))throw new Error("登录已失效，请刷新页面后重试");let r=[],e=[];try{let p=(t.match(/id=["']xqList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']xqList["'][^>]*value=["']([^"']*)["']/i)||[])[1],s=(t.match(/id=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||[])[1];if(p&&(r=_r(p)),s&&(e=_r(s)),!r.length){let g=t.match(/(?:var\s+)?xqList\s*=\s*(\[[\s\S]*?\])\s*;/);g&&(r=_r(g[1]))}if(!e.length){let g=t.match(/(?:var\s+)?jxlList\s*=\s*(\[[\s\S]*?\])\s*;/);g&&(e=_r(g[1]))}if(!e.length){let g=$n(t,"teachingBuildingName");g&&(e=_r(g))}if(!r.length){let g=$n(t,"campusName");g&&(r=_r(g))}}catch(p){console.warn("[URP++] classroom json parse",p)}if(!e.length){let p=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}];r=p;let s=[];for(let g of p)try{let b=await Gt("/student/teachingResources/classroomCurriculum/"+g.campusNumber+"/teachingBuildingJson");_r(b).forEach(M=>{s.push({id:{campusNumber:g.campusNumber,teachingBuildingNumber:String(M.id&&M.id.teachingBuildingNumber||M.teachingBuildingNumber||"")},teachingBuildingName:M.teachingBuildingName||M.name||""})})}catch(b){console.warn("[URP++] building json",g.campusNumber,b)}e=s}r.length||(r=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}]);let a=r.map(p=>({campus:p.campusName||p.campusNumber,campusNumber:String(p.campusNumber||p.id&&p.id.campusNumber||""),buildings:[]}));e.forEach(p=>{let s=String(p.id&&p.id.campusNumber||p.campusNumber||""),g=String(p.id&&p.id.teachingBuildingNumber||p.teachingBuildingNumber||""),b=p.teachingBuildingName||p.name||g;if(!s||!g||!b)return;let _=a.find(D=>D.campusNumber===s);_||(_={campus:s,campusNumber:s,buildings:[]},a.push(_));let M="/student/teachingResources/classroomUseStatus/"+s+"/"+g+"/"+encodeURI(encodeURI(_.campus||s))+"/"+encodeURI(encodeURI(b));_.buildings.push({name:b,path:M,campusNumber:s,buildingNumber:g})});let i=a.filter(p=>p.buildings.length);if(!i.length)throw new Error("未解析到教学楼，请刷新后重试");return i}function ue(t){let r=String(t&&t.occupancymoduleId||""),e={"06":"有课","07":"考试",14:"实验",room:"借用"};if(e[r])return e[r];if(t&&t.remark){let a=String(t.remark).trim();if(a)return a}return"占用"}function sl(t){if(t&&t.contentName)return String(t.contentName).trim();if(t&&t.remark){let r=String(t.remark).trim();if(r)return r}return ue(t)}async function ll(t,r,e,a){let i=new URLSearchParams({planNumber:String(t||""),campusNumber:String(r||""),teachingBuildingNumber:String(e||""),classroomNumber:String(a||"")}),p=await Gt("/student/teachingResources/classroomCurriculum/searchCurriculum/callback?"+i.toString());try{let s=JSON.parse(p);return Array.isArray(s)?s.length&&Array.isArray(s[0])?s[0]:s.filter(g=>g&&typeof g=="object"&&(g.kcm||g.id&&g.id.kch)):s&&Array.isArray(s.list)?s.list:[]}catch{return[]}}function cl(t,r,e){let a=t||[],i=Number(r.xq)||0,p=Number(r.start)||0,s=Number(e)||0,g=[];return a.forEach(b=>{let _=b.id||{},M=Number(_.skxq!=null?_.skxq:b.skxq)||0,D=Number(_.skjc!=null?_.skjc:b.skjc)||0,P=Math.max(1,Number(b.cxjc)||1),B=_.skzc||b.skzc||"";i&&M&&i!==M||p&&(p<D||p>=D+P)||s&&B&&!Ta(B,s)||g.push(b)}),g.length?(g.sort((b,_)=>{let M=Ta(b.id&&b.id.skzc||b.skzc,s)?0:1,D=Ta(_.id&&_.id.skzc||_.skzc,s)?0:1;return M-D}),g[0]):null}async function dl(t,r,e){if(!t||!t.rooms||!t.rooms.length)return t;let a=String(r.campusNumber||""),i=String(r.buildingNumber||""),p=e||t.planNumber||"";if(!a||!i||!p)return t;let s=t.rooms.filter(P=>(P.slots||[]).some(B=>B.busy)),g={},b=async P=>{if(g[P])return g[P];try{g[P]=await ll(p,a,i,P)}catch{g[P]=[]}return g[P]},_=4,M=0,D=new Array(Math.min(_,Math.max(s.length,1))).fill(0).map(async()=>{for(;M<s.length;){let P=M++,B=s[P],G=await b(B.name);(B.slots||[]).forEach(F=>{if(!F.busy)return;let H={xq:F.detail&&F.detail.xq||F.xq||0,start:F.section,week:t.jxzc};F.detail&&F.detail.xq!=null&&(H.xq=F.detail.xq);let N=cl(G,H,t.jxzc);if(N&&N.kcm){let X=String(N.kcm).trim();F.contentName=X,F.reason=X,F.displayChar=$e(X),F.detail&&(F.detail.contentName=X,F.detail.reason=X,F.detail.teacher=N.jsm||"",F.detail.weeks=N.zcsm||"",F.detail.courseNo=N.id&&N.id.kch||"",F.detail.typeLabel=ue({occupancymoduleId:F.module}))}else F.displayChar=$e(F.reason||"占用"),F.detail&&(F.detail.typeLabel=ue({occupancymoduleId:F.module}))})}});return await Promise.all(D),t}function ul(t){return t==="有课"?"kind-course":t==="考试"?"kind-exam":t==="实验"?"kind-lab":t==="借用"?"kind-borrow":"kind-busy"}async function ml(t){let r="",e="",a="",i="";if(t&&typeof t=="object")r=String(t.campusNumber||""),e=String(t.buildingNumber||""),a=t.name||"",i=t.path||"";else{i=String(t||"");let N=i.match(/classroomUseStatus\/(\d+)\/(\d+)\//);N&&(r=N[1],e=N[2])}if(!r||!e)throw new Error("缺少校区/楼栋编号");let p=Number(t&&t.dateOffset!=null?t.dateOffset:at.roomDateOffset)||0,s=bl(In(new Date,p)),g="xqh="+encodeURIComponent(r)+"&jxlh="+encodeURIComponent(e)+"&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(s),b=await new Promise((N,X)=>{let dt=Ma("/student/teachingResources/classroomUseStatus/jasInfo");typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest({method:"POST",url:dt,data:g,withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},onload:yt=>yt.status>=200&&yt.status<400?N(yt.responseText||""):X(new Error("HTTP "+yt.status)),onerror:()=>X(new Error("network"))}):fetch(dt,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:g}).then(yt=>yt.text()).then(N).catch(X)}),_;try{_=JSON.parse(b)}catch{throw new Error("jasInfo 非 JSON")}let M=(_.classrooms||[]).map(N=>{let X=N.classroomName||N.id&&N.id.classroomNumber||"",dt=N.placeNum||"",yt=N.remark||"",St=[];for(let Pt=1;Pt<=12;Pt++)St.push({section:Pt,busy:!1});return{name:X,seats:dt,type:yt,slots:St,map:{}}}),D={};M.forEach(N=>{D[N.name]=N}),(_.classroomTime||[]).forEach(N=>{let X=N.id||{},dt=X.classroomNumber||"",yt=Number(X.sessionstart)||1,St=Math.max(1,Number(N.continuingsession)||1),Pt=D[dt];if(!Pt)return;let zt=ue(N),Dt=sl(N);for(let jt=yt;jt<yt+St&&jt<=12;jt++){let qt=Pt.slots.find(tr=>tr.section===jt);qt&&(qt.busy=!0,qt.kind=N.timestatenumber||N.occupancymoduleId||"",qt.module=N.occupancymoduleId||"",qt.reason=Dt,qt.typeLabel=zt,qt.displayChar=$e(Dt),qt.xq=X.xq,qt.weekBitmap=X.week||"",qt.detail={room:dt,section:jt,start:yt,span:St,reason:Dt,typeLabel:zt,week:X.week||"",xq:X.xq||"",state:N.timestatenumber||"",module:N.occupancymoduleId||""})}});let P="";try{let N=_.jhZxjxjhb;typeof N=="string"&&/\d{4}-\d{4}-\d-\d/.test(N)?P=N:N&&typeof N=="object"&&(P=String(N.zxjxjhh||N.jhxnxq||N.executiveEducationPlanNumber||N.planNumber||""))}catch{}if(!P&&_.classrooms&&_.classrooms[0]&&_.classrooms[0].id&&(P=_.classrooms[0].id.executiveEducationPlanNumber||""),_.jxzc!=null&&Number(_.jxzc)>=1){let N=Number(_.jxzc);at._termWeek=Math.max(at._termWeek||0,N),at.weekLocked||(at.viewWeek=at._termWeek)}let B=["日","一","二","三","四","五","六"],G=hl(_.date||s)||In(new Date,p),F=_.week!=null?Number(_.week):G.getDay(),H=p===1?"明天":p===2?"后天":"今天";return{rooms:M,dateLabel:(_.date||s)+"（周"+(B[F]||F)+" · "+H+"）",jxzc:_.jxzc,planNumber:P,week:_.week!=null?_.week:F,searchDate:_.date||s,dateOffset:p}}function In(t,r){let e=new Date(t.getFullYear(),t.getMonth(),t.getDate());return e.setDate(e.getDate()+(Number(r)||0)),e}function bl(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}function hl(t){let r=String(t||"").match(/(\d{4})-(\d{1,2})-(\d{1,2})/);return r?new Date(Number(r[1]),Number(r[2])-1,Number(r[3])):null}let Nn={clean:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h11M4 17h14"/></svg>',exit:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M14 12H8"/><path d="m14 8 4 4-4 4"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',schedule:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/></svg>',score:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h10v17H7z"/><path d="M10 8h4M10 12h4M10 16h3"/></svg>',room:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-7h6v7"/><path d="M9 10h.01M15 10h.01"/></svg>',eval:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 7h11M8 12h11M8 17h8"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg>',plan:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h8l3 3V20.5H7z"/><path d="M15 3.5V7h3M10 12h5M10 16h5"/></svg>',apply:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',home:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 11 8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/></svg>',more:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',close:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'};function Bn(t){return Nn[t]||Nn.more}let at=Jp();function gl(){if(document.getElementById("urppp-clean-style"))return;let t=document.createElement("style");t.id="urppp-clean-style",t.textContent=Rp,(document.head||document.documentElement).appendChild(t)}let fl=Ze({deps:{scoreToNumber:Or,scoreToGpa:jr}}),{metricHtml:xl,occupancyHtml:yl,render:Jr,renderScheduleBoard:mc,roomPickerHtml:vl,scheduleRender:wl}=ni({state:at,deps:{DIRECT_EDIT_LABELS:R,DAY_NAMES:wn,analyzeScores:t=>fl.analyzeScores(t),applyPersonalDisplay:Jt,bandsChartSvg:ra,bindUI:t=>Al(t),classifyPrivacyLabel:Ne,courseColor:Pn,ensureRoot:()=>Dn(),escapeHtml:it,firstContentChar:$e,getViewWeekNumber:_n,ico:Bn,isCleanAnalysisDirect:na,occupancyKindClass:ul,occupancyTypeLabel:ue,personalizedProfile:Ss,scoreChartLayout:()=>{try{return window.matchMedia&&window.matchMedia("(max-width: 900px)").matches?{variant:"mobile"}:null}catch{return null}},scoreToNumber:Or,summarizeCourses:Zt,trendChartSvg:ta,weekBitActive:En,calVacation:ce,setCalendarPhase:Sn}}),{ensureRoomCatalogLoaded:Fn,loadAll:kl}=Yp({state:at,deps:{ensureTermWeekResolved:Ys,enrichScoresWithEvaluation:ol,getCurrentWeekNumber:Sr,loadClassroomCatalog:il,loadProfile:vn,loadSchedule:Ks,loadScores:Mn,readRememberedTermWeek:se,reconcileProfileAndScores:nl,render:Jr,scheduleRender:wl}}),{bindUI:Al,closeModal:Sl,getRoomHost:bc,openModal:hc,openRoomModal:gc,openScoreModal:fc,showBuilding:xc}=pi({state:at,deps:{DAY_NAMES:wn,applyPersonalDisplay:Jt,bindScheduleExportHosts:Rs,closeCleanMode:()=>El(),ensureRoomCatalogLoaded:Fn,enrichOccupancyWithCurriculum:dl,ensureRoot:()=>Dn(),escapeHtml:it,fetchText:Gt,getCurrentWeekNumber:Sr,getViewWeekNumber:_n,inferMaxWeek:Qs,isUnevaluatedScore:pr,isValidOfficialGpa:Me,loadBuildingOccupancy:ml,metricHtml:xl,occupancyHtml:yl,render:Jr,rootEl:()=>Cl(),roomPickerHtml:vl,scoreToGpa:jr,scoreToNumber:Or,summarizeCourses:Zt,summarizeCoursesPreferOfficial:Zt}}),{cleanModeApi:_l,closeCleanMode:El,ensureRoot:Dn,injectCleanEntry:yc,openCleanMode:vc,rootEl:Cl}=ii({state:at,deps:{CLEAN_FLAG:ss,applySkinAttr:nr,closeModal:Sl,ensureRoomCatalogLoaded:Fn,ensureStyle:gl,getCurrentWeekNumber:Sr,getSkin:or,handleThemeDotClick:lt,ico:Bn,injectCleanSidebarSections:t=>{try{window.__urpppInjectCleanSidebarSections?.(t)}catch{}},refreshMobileNavbar:()=>{try{window.__urpppRefreshMobileNavbar?.()}catch{}},setDrawerOpen:(t,r,e)=>{try{window.__urpppSetDrawerOpen?.(t,r,e)}catch{}},stopDrawerAnimation:t=>{try{window.__urpppStopDrawerAnimation?.(t)}catch{}},isHomePage:mo,loadAll:kl,openSettingsPanel:Oo,readRememberedTermWeek:se,refreshCleanPersonalDisplay:Ia,render:Jr,scoreToGpa:jr,summarizeCourses:Zt,syncNavbarThemeUI:gt,syncSettingsPanelUI:Rt,syncThemeDotGroup:K}});window.__urpppCleanMode=_l;function Ua(){if(!document.body){setTimeout(Ua,10);return}if(Wt(Yt()),document.addEventListener("focusin",r=>{let e=r.target;if(!e||!e.matches||!e.matches(".chosen-search input"))return;let a=[],i=e.parentElement;for(;i;){let p=i.scrollTop,s=i.scrollLeft;(p||s||i.scrollHeight>i.clientHeight||i.scrollWidth>i.clientWidth)&&a.push({el:i,top:p,left:s}),i=i.parentElement}requestAnimationFrame(()=>{a.forEach(p=>{p.el.scrollTop=p.top,p.el.scrollLeft=p.left})})},!0),!!document.getElementById("formContent")&&!!document.querySelector(".form-signin"))yo();else{Fi();try{nn()}catch{}try{De()}catch(r){console.warn("[URP++] route feature refresh",r)}try{Jt(document)}catch{}try{An()}catch{}[350,900,1800].forEach(r=>setTimeout(()=>{try{De()}catch{}try{Jt(document)}catch{}},r));try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}[400,1200,2500].forEach(r=>setTimeout(()=>{try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}},r));try{oa()&&mo()&&window.__urpppCleanMode&&setTimeout(()=>{try{window.__urpppCleanMode.open(!1)}catch{}},700)}catch{}}}if(!window.__urpppSidebarSyncBound){window.__urpppSidebarSyncBound=!0,window.addEventListener("resize",()=>{clearTimeout(window.__urpppSidebarSyncTimer),window.__urpppSidebarSyncTimer=setTimeout(wr,50)}),window.addEventListener("load",()=>{wr(),Dr(),setTimeout(wr,100),setTimeout(wr,400)}),document.addEventListener("click",r=>{r.target&&r.target.closest&&r.target.closest("#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse")&&(setTimeout(Dr,0),setTimeout(Dr,50),setTimeout(Dr,200))},!0);let t=document.getElementById("sidebar");t&&!t.__urpppMarginObs&&(t.__urpppMarginObs=new MutationObserver(()=>{clearTimeout(window.__urpppMarginObsTimer),window.__urpppMarginObsTimer=setTimeout(Dr,30)}),t.__urpppMarginObs.observe(t,{attributes:!0,attributeFilter:["class","style"]}))}function jn(){if(window.__urpppRouteWatchBound)return;window.__urpppRouteWatchBound=!0;let t=0,r=()=>{try{let i=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches),p=!!(document.getElementById("urppp-clean-root")&&document.getElementById("urppp-clean-root").classList.contains("open"));i&&!p&&window.__urpppCloseMobileDrawer&&window.__urpppCloseMobileDrawer()}catch{}clearTimeout(t),t=setTimeout(()=>{if(at._termWeekResolved=!1,!!document.getElementById("sidebar")){wr(),an(),pt(),wr();try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}ct(),[250,700].forEach(p=>setTimeout(()=>{try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}},p)),ga(),Bo(),Fo(),zo(),Do(),No(),qo(),document.querySelectorAll(".page-content, #page-content-template").forEach(p=>{let s=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches);p.style.setProperty("padding",s?"8px 8px 24px":"16px 64px 40px","important"),p.style.setProperty("box-sizing","border-box","important")}),Ce(),Le(),Ir(),setTimeout(Ir,300),setTimeout(Ir,1e3),Ao(),ur(),ee(),Eo(),setTimeout(ee,300),ae(),setTimeout(()=>ae(),500),Ee(),_o();try{De()}catch{}try{Jt(document)}catch{}setTimeout(()=>{try{De()}catch{}try{Jt(document)}catch{}},500)}},100)};window.addEventListener("popstate",r),window.addEventListener("hashchange",r);let e=history.pushState,a=history.replaceState;history.pushState=function(...i){let p=e.apply(this,i);return r(),p},history.replaceState=function(...i){let p=a.apply(this,i);return r(),p}}let Vr=typeof unsafeWindow<"u"?unsafeWindow:window;Vr.__urpppDebug=Vr.__urpppDebug||{},Vr.__urpppDebug.setCalendarPhase=t=>Sn(t),Vr.__urpppDebug.getCalendarPhase=()=>Vs(),Vr.__urpppDebug.calVacation=t=>ce(t),Vr.urppp={version:n,showLogo(t){let r=document.querySelector("#urppp-brand .ub-logo");r&&r.classList.toggle("show",t)},theme:{apply:t=>{Wt(t)},setAccent:vi,getAccent:Vt,getCurrent:Yt,list:()=>Object.entries(_t).map(([t,r])=>({name:t,displayName:r.name,current:t===Yt()}))},update:{check:La,auto:za,showToast:Pa},privacy:{get:xr,set(t){return ia(t),Jt(document),xr()},apply:()=>Jt(document),identity:{get:Lr,set(t){return lo(t),Jt(document),Ia(),Lr()}}},scheduleExport:{load:()=>mn("api"),run:t=>$s(t,"api",null,null),patch:Oa,image:{theme:gn,build:(t,r)=>fn(t,r)},jsonFormat:{get:Se,set:uo,validate:Cr,build(t,r){let e=Ue(t);if(r)return Ge(e,Cr(r));let a=Se();return a.enabled?Ge(e,a.mapping):We(e)},buildDefault(t){return We(Ue(t))}}}};function On(){setTimeout(()=>{try{za()}catch{}},1800)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Ua(),jn(),On()}):(Ua(),jn(),On())})();})();
