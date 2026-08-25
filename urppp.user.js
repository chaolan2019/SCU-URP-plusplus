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

(()=>{var Ns=Object.defineProperty;var e=(n,o)=>Ns(n,"name",{value:o,configurable:!0});function Wr(n){let o=String(n).replace("#","").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return o?{r:parseInt(o[1],16),g:parseInt(o[2],16),b:parseInt(o[3],16)}:{r:30,g:58,b:95}}e(Wr,"hexToRgb");function se(n,o,l){return"#"+[n,o,l].map(d=>Math.max(0,Math.min(255,Math.round(d))).toString(16).padStart(2,"0")).join("")}e(se,"rgbToHex");function Rt(n){let o=String(n||"").trim();return o?(o[0]!=="#"&&(o="#"+o),/^#[0-9a-fA-F]{6}$/.test(o)?o.toUpperCase():""):""}e(Rt,"normalizeHexColor");function za(n,o){let{r:l,g:d,b:u}=Wr(n),y=1-o;return se(l*y,d*y,u*y)}e(za,"darken");function hr(n,o){let{r:l,g:d,b:u}=Wr(n);return`rgba(${l},${d},${u},${o})`}e(hr,"alpha");function Nt(n,o,l){let d=Wr(Rt(n)||"#FFFFFF"),u=Wr(Rt(o)||"#FFFFFF"),y=Math.max(0,Math.min(1,Number(l)||0));return se(d.r+(u.r-d.r)*y,d.g+(u.g-d.g)*y,d.b+(u.b-d.b)*y)}e(Nt,"mixHex");function La(n,o){if(typeof n!="function")throw new TypeError(`${o} must be a function`)}e(La,"assertFunction");function Ne(n){if(!n||typeof n!="object")throw new TypeError("feature definition must be an object");let o=String(n.id||"").trim();if(!o)throw new TypeError("feature id is required");return La(n.matches,`${o}.matches`),La(n.mount,`${o}.mount`),La(n.unmount,`${o}.unmount`),Object.freeze({id:o,matches:n.matches,mount:n.mount,unmount:n.unmount})}e(Ne,"defineFeature");function fn(n){if(!Array.isArray(n))throw new TypeError("features must be an array");let o=n.map(Ne),l=new Set;o.forEach(C=>{if(l.has(C.id))throw new Error(`duplicate feature id: ${C.id}`);l.add(C.id)});let d=null,u=null;function y(){if(!d)return;let C=d,x=u;d=null,u=null,C.unmount(x)}e(y,"unmount");function P(C={}){let x=o.find(f=>f.matches(C));if(x&&d===x&&C.lifecycleKey!==void 0&&u?.lifecycleKey===C.lifecycleKey)try{return x.mount(C),u=C,x.id}catch(f){throw y(),f}if(y(),!x)return null;try{return x.mount(C),d=x,u=C,x.id}catch(f){try{x.unmount(C)}catch{}throw f}}return e(P,"refresh"),Object.freeze({refresh:P,unmount:y,getActiveFeatureId:e(()=>d?.id||null,"getActiveFeatureId"),listFeatureIds:e(()=>o.map(C=>C.id),"listFeatureIds")})}e(fn,"createFeatureRuntime");function At(n){return String(n||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}e(At,"escapeHtml");var ce={base:{},coursesPath:"courses",schedulePath:"schedule",courseFields:{name:"name",teacher:"teacher",position:"position",day:"day",sections:"sections",weeks:"weeks"},scheduleFields:{morningNum:"morningNum",afternoonNum:"afternoonNum",nightNum:"nightNum",sections:"sections"}},Bs=["name","teacher","position","day","sections","weeks","code","sequence","englishName","attribute","category","credit","status","campus","building","classroom","startSection","endSection","weekList"],Fs=["morningNum","afternoonNum","nightNum","sections","sectionList"];function Ta(n){return JSON.parse(JSON.stringify(n))}e(Ta,"cloneJsonValue");function wn(n,o){return n===o||n.startsWith(`${o}.`)||o.startsWith(`${n}.`)}e(wn,"scheduleJsonPathsOverlap");function Be(n,o){let l=String(n??"").trim();if(!l){if(o)return"";throw new Error("课程数组输出路径不能为空")}if(l.length>120)throw new Error("JSON 输出路径不能超过 120 个字符");let d=l.split("."),u=new Set(["__proto__","prototype","constructor"]);if(d.some(P=>!P||/^\d+$/.test(P)||/[\[\]\x00-\x1f]/.test(P)||u.has(P)))throw new Error(`JSON 输出路径包含无效片段：${l}`);return d.join(".")}e(Be,"validateScheduleJsonPath");function Ds(n,o){for(let l=0;l<n.length;l+=1)for(let d=l+1;d<n.length;d+=1)if(wn(n[l],n[d]))throw new Error(`${o}目标路径不能重叠：${n[l]} / ${n[d]}`)}e(Ds,"validateScheduleJsonTargetPaths");function xn(n,o,l){let d=o.split("."),u=n;for(let y=0;y<d.length;y+=1){let P=d[y];if(!Object.prototype.hasOwnProperty.call(u,P))return;if(y===d.length-1)throw new Error(`${l}输出路径与 base 字段重叠：${o}`);if(u=u[P],!u||typeof u!="object"||Array.isArray(u)){let C=d.slice(0,y+1).join(".");throw new Error(`${l}输出路径无法穿过 base 中的非对象字段：${C}`)}}}e(xn,"validateScheduleJsonBasePath");function yn(n,o,l){if(!n||typeof n!="object"||Array.isArray(n))throw new Error(`${l}字段映射必须是对象`);let d={};return Object.entries(n).forEach(([u,y])=>{if(!o.includes(u))throw new Error(`${l}不支持源字段：${u}`);let P=Be(y,!0);P&&(d[u]=P)}),Ds(Object.values(d),`${l}字段`),d}e(yn,"validateScheduleJsonFieldMap");function _r(n){if(!n||typeof n!="object"||Array.isArray(n))throw new Error("自定义 JSON 映射必须是对象");let o=n.base==null?{}:n.base;if(!o||typeof o!="object"||Array.isArray(o))throw new Error("base 必须是 JSON 对象");let l={base:Ta(o),coursesPath:Be(n.coursesPath,!1),schedulePath:Be(n.schedulePath,!0),courseFields:yn(n.courseFields,Bs,"课程"),scheduleFields:yn(n.scheduleFields||{},Fs,"时间表")};if(!Object.keys(l.courseFields).length)throw new Error("至少保留一个课程字段映射");if(l.schedulePath&&wn(l.schedulePath,l.coursesPath))throw new Error("课程与时间表输出路径不能重叠");return xn(l.base,l.coursesPath,"课程"),l.schedulePath&&xn(l.base,l.schedulePath,"时间表"),l}e(_r,"validateScheduleJsonMapping");function le(n){let o=String(n||"").replace(/\D/g,"").padStart(4,"0").slice(-4),l=`${o.slice(0,2)}:${o.slice(2)}`;return/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(l)?l:""}e(le,"normalizeSectionTime");function qa(n,o,l){let d=Be(o,!1).split("."),u=n;d.forEach((y,P)=>{if(P===d.length-1){u[y]=l;return}(!u[y]||typeof u[y]!="object"||Array.isArray(u[y]))&&(u[y]={}),u=u[y]})}e(qa,"setScheduleJsonPath");function vn(n,o){let l={};return Object.entries(o||{}).forEach(([d,u])=>{!Object.prototype.hasOwnProperty.call(n,d)||n[d]===void 0||qa(l,u,Ta(n[d]))}),l}e(vn,"mappedScheduleJsonObject");function js(n){return[n.campus,n.building,n.classroom].map(o=>String(o||"").trim()).filter(Boolean).join(" ")}e(js,"scheduleJsonPosition");function Os(n){let o=Number(n.startSection)||0,l=Number(n.endSection)||o;return o<1||l<o?"":Array.from({length:l-o+1},(d,u)=>o+u).join(",")}e(Os,"scheduleJsonSectionString");function Hs(n,o){let l=Number(o.day)||0,d=Os(o),u=Array.from(new Set((o.weeks||[]).map(Number).filter(y=>Number.isInteger(y)&&y>=1&&y<=60))).sort((y,P)=>y-P);return l<1||l>7||!d?{error:"invalid"}:u.length?{value:{name:n.name,teacher:n.teacher,position:js(o),day:l,sections:d,weeks:u.join(","),code:n.code,sequence:n.sequence,englishName:n.englishName,attribute:n.attribute,category:n.category,credit:n.credit,status:n.status,campus:o.campus,building:o.building,classroom:o.classroom,startSection:o.startSection,endSection:o.endSection,weekList:u}}:{error:"weeks"}}e(Hs,"scheduleJsonCourseRecord");function Rs(n,o){let l=[];return n.courses.forEach(d=>{if(!d.arrangements.length){o.unscheduledCourses+=1;return}d.arrangements.forEach(u=>{let y=Hs(d,u);y.error==="weeks"?o.missingWeeks+=1:y.error?o.invalidArrangements+=1:l.push(y.value)})}),l}e(Rs,"buildScheduleJsonCourses");function Ws(n){let o=new Map;return(n||[]).forEach(l=>{let d=Number(l.section),u=le(l.start),y=le(l.end);!Number.isInteger(d)||d<1||d>20||!u||!y||o.set(d,{i:d,s:u,e:y})}),Array.from(o.values()).sort((l,d)=>l.i-d.i)}e(Ws,"buildScheduleJsonSections");function Us(n){let o=Ws(n);if(!o.length)return{};let l={sections:JSON.stringify(o),sectionList:o};if(!o.every((u,y)=>u.i===y+1))return l;let d={morningNum:0,afternoonNum:0,nightNum:0};return o.forEach(u=>{let[y,P]=u.s.split(":").map(Number),C=y*60+P;C<720?d.morningNum+=1:C>=1080?d.nightNum+=1:d.afternoonNum+=1}),d.morningNum&&d.afternoonNum&&d.nightNum?Object.assign(l,d):l}e(Us,"buildScheduleJsonSchedule");function Fe(n){let o={unscheduledCourses:0,missingWeeks:0,invalidArrangements:0},l=Rs(n,o);if(!l.length)throw new Error("没有符合导入格式的已排课课程");return{courses:l,schedule:Us(n.sections),stats:o}}e(Fe,"buildScheduleJsonSource");function De(n){let o={courses:n.courses.map(d=>({name:d.name,teacher:d.teacher,position:d.position,day:d.day,sections:d.sections,weeks:d.weeks}))},l={};return["morningNum","afternoonNum","nightNum","sections"].forEach(d=>{Object.prototype.hasOwnProperty.call(n.schedule,d)&&(l[d]=n.schedule[d])}),Object.keys(l).length&&(o.schedule=l),o}e(De,"buildXiaoAiScheduleJson");function je(n,o){let l=Ta(o.base||{}),d=n.courses.map(u=>vn(u,o.courseFields));if(qa(l,o.coursesPath,d),o.schedulePath&&Object.keys(n.schedule).length){let u=vn(n.schedule,o.scheduleFields);Object.keys(u).length&&qa(l,o.schedulePath,u)}return l}e(je,"buildCustomScheduleJson");function de(n){return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0")}e(de,"localDateIso");function Ur(n){let o=String(n||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!o)return null;let l=new Date(Number(o[1]),Number(o[2])-1,Number(o[3]));return Number.isNaN(l.getTime())||de(l)!==String(n)?null:l}e(Ur,"parseLocalIsoDate");function Ma(n){let o=new Date(n.getFullYear(),n.getMonth(),n.getDate()),l=o.getDay();return o.setDate(o.getDate()-(l===0?6:l-1)),o}e(Ma,"mondayOfDate");function An(n){let o=String(n||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!o)return de(Ma(new Date));let l=o[3]==="1"?Number(o[1]):Number(o[2]),d=o[3]==="1"?8:2,u=new Date(l,d,1);for(;u.getDay()!==1;)u.setDate(u.getDate()+1);return de(u)}e(An,"defaultSemesterMonday");function kn(n){return n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0")+"T"+String(n.getHours()).padStart(2,"0")+String(n.getMinutes()).padStart(2,"0")+"00"}e(kn,"formatIcsLocal");function Oe(n){return String(n||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}e(Oe,"escapeIcsText");function Gs(n){if(typeof TextEncoder!="function")return n;let o=new TextEncoder,l=[],d="",u=73;for(let y of String(n))o.encode(d+y).length>u&&d?(l.push(d),d=" "+y,u=74):d+=y;return d&&l.push(d),l.join(`\r
`)}e(Gs,"foldIcsLine");function Js(n){let o=2166136261,l=String(n||"");for(let d=0;d<l.length;d+=1)o=Math.imul(o^l.charCodeAt(d),16777619);return(o>>>0).toString(16)+"@scu-urppp"}e(Js,"scheduleUid");function Sn(n){let o=new Map;return n.sections.forEach(l=>o.set(l.section,l)),o}e(Sn,"scheduleSectionMap");function Vs(n){return n.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}e(Vs,"formatTimestamp");function _n(n,o,l={}){let d=Ur(o);if(!d)throw new Error("第一教学周日期无效");let u=Sn(n);if(!u.size)throw new Error("教务接口没有返回节次时间，无法生成 ICS");let y=Vs(l.now instanceof Date?l.now:new Date),P=0,C=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SCU URP++//Schedule Export//CN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:"+Oe(n.semester.label+"课表"),"X-WR-TIMEZONE:Asia/Shanghai","BEGIN:VTIMEZONE","TZID:Asia/Shanghai","X-LIC-LOCATION:Asia/Shanghai","BEGIN:STANDARD","TZOFFSETFROM:+0800","TZOFFSETTO:+0800","TZNAME:CST","DTSTART:19700101T000000","END:STANDARD","END:VTIMEZONE"];if(n.courses.forEach(x=>x.arrangements.forEach(A=>{let f=u.get(A.startSection),v=u.get(A.endSection);!f||!v||A.weeks.forEach(T=>{let S=new Date(d);S.setDate(d.getDate()+(T-1)*7+A.day-1);let b=new Date(S),m=new Date(S),k=f.start.split(":").map(Number),g=v.end.split(":").map(Number);b.setHours(k[0],k[1],0,0),m.setHours(g[0],g[1],0,0);let _=[A.campus,A.building,A.classroom].filter(Boolean).join(" "),q=["教师："+x.teacher,"周次："+A.weekDescription,"课程号："+x.code+(x.sequence?"_"+x.sequence:""),"学分："+x.credit,"课程属性："+x.attribute].filter(z=>!/[：:]$/.test(z)).join(`
`),N=[n.semester.planCode,x.code,x.sequence,A.day,A.startSection,A.endSection,T,A.campus,A.building,A.classroom].join("|");P+=1,C.push("BEGIN:VEVENT","UID:"+Js(N),"DTSTAMP:"+y,"SUMMARY:"+Oe(x.name),"LOCATION:"+Oe(_),"DESCRIPTION:"+Oe(q),"DTSTART;TZID=Asia/Shanghai:"+kn(b),"DTEND;TZID=Asia/Shanghai:"+kn(m),"END:VEVENT")})})),!P)throw new Error("课表中没有已安排时间的课程，无法生成 ICS");return C.push("END:VCALENDAR"),C.map(Gs).join(`\r
`)+`\r
`}e(_n,"buildScheduleIcs");function En(n){let o=Sn(n),l=0,d=0;return n.courses.forEach(u=>u.arrangements.forEach(y=>{y.weeks.length||(l+=1),(!o.has(y.startSection)||!o.has(y.endSection))&&(d+=1)})),{missingWeeks:l,missingTimes:d}}e(En,"scheduleIcsOmissionStats");function Ys(n){let o=String(n||"").replace(/[—–]/g,"-"),l=/单周|单数周|[（(]单[）)]/.test(o)?1:/双周|双数周|[（(]双[）)]/.test(o)?0:-1,d=new Set,u=e(y=>{let P=Number(y);P>=1&&P<=30&&(l<0||P%2===l)&&d.add(P)},"add");return o.replace(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/g,(y,P,C)=>{let x=Math.min(Number(P),Number(C)),A=Math.max(Number(P),Number(C));for(let f=x;f<=A;f+=1)u(f);return y}),(o.match(/\d{1,2}/g)||[]).forEach(u),Array.from(d).sort((y,P)=>y-P)}e(Ys,"scheduleWeeksFromDescription");function Cn(n,o){let l=String(n||"").trim();if(/^[01]+$/.test(l)){let d=[];for(let u=0;u<l.length;u+=1)l.charAt(u)==="1"&&d.push(u+1);return d}return Ys(o||l)}e(Cn,"scheduleWeeks");function Qs(n){let o=n&&Array.isArray(n.xkxx)?n.xkxx:[];for(let l of o){let d=Object.values(l||{});if(d.length)return d[0]}return null}e(Qs,"firstScheduleCourse");function Gr(n){let o=Qs(n);if(!o)return"";let l=Array.isArray(o.timeAndPlaceList)?o.timeAndPlaceList[0]:null;return String(o.zxjxjhh||o.executiveEducationPlanNumber||o.id&&(o.id.zxjxjhh||o.id.executiveEducationPlanNumber)||l&&(l.zxjxjhh||l.executiveEducationPlanNumber)||"").trim()}e(Gr,"schedulePlanCodeFromData");function Xs(n){let o=String(n||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!o)return"学生课表";let l=o[3]==="1"?"秋季学期":o[3]==="2"?"春季学期":"学期";return o[1]+"-"+o[2]+"学年"+l}e(Xs,"semesterLabelFromPlanCode");function Pn(n,o,l,d={}){let u=o||Gr(n),y=(Array.isArray(n&&n.jcsjbs)?n.jcsjbs:[]).map(x=>({section:Number(x.jc)||0,start:le(x.kssj),end:le(x.jssj)})).filter(x=>x.section>=1&&x.section<=20&&x.start&&x.end).sort((x,A)=>x.section-A.section),P=[];(Array.isArray(n&&n.xkxx)?n.xkxx:[]).forEach(x=>{Object.keys(x||{}).forEach(A=>{let f=x[A];if(!f)return;let v=f.id||{},T=(f.timeAndPlaceList||[]).map(S=>({day:Number(S.classDay)||0,startSection:Number(S.classSessions)||1,endSection:Math.min(12,(Number(S.classSessions)||1)+Math.max(1,Number(S.continuingSession)||1)-1),weeks:Cn(S.classWeek,S.weekDescription||f.skzcs),weekDescription:String(S.weekDescription||f.skzcs||"").trim(),campus:String(S.campusName||"").trim(),building:String(S.teachingBuildingName||"").trim(),classroom:String(S.classroomName||"").trim()})).filter(S=>S.day>=1&&S.day<=7&&S.startSection>=1&&S.startSection<=12);P.push({code:String(v.coureNumber||f.zkch||"").trim(),sequence:String(v.coureSequenceNumber||f.zkxh||"").trim(),name:String(f.courseName||f.englishCourseName||A).trim(),englishName:String(f.englishCourseName||"").trim(),teacher:String(f.attendClassTeacher||"").trim(),attribute:String(f.coursePropertiesName||"").trim(),category:String(f.courseCategoryName||"").trim(),credit:Number(f.unit)||0,status:String(f.selectCourseStatusName||"").trim(),arrangements:T})})});let C=String(d.firstMonday||"").trim();return{schemaVersion:1,exportedAt:(d.now instanceof Date?d.now:new Date).toISOString(),source:l||"SCU URP++",semester:{planCode:u,label:Xs(u),firstMonday:Ur(C)?C:""},sections:y,courses:P}}e(Pn,"normalizeScheduleExportData");function zn(n,o,l,d=0){let u=Math.max(0,Number(n)||0),y=Math.max(1,Math.floor(Number(o)||1)),P=Math.max(0,Math.min(y-1,Math.floor(Number(l)||0))),C=-Math.max(0,Number(d)||0),x=C+u*P/y,A=C+u*(P+1)/y;return{left:x,width:Math.max(0,A-x)}}e(zn,"scheduleCardLaneGeometry");function He(n,o,l){let d=[],u=String(n||""),y=Math.max(4,Number(o)||4);for(;u;)d.push({text:u.slice(0,y),kind:l}),u=u.slice(y);return d}e(He,"wrapField");function Re(n,o){let l=n.slice(0,Math.max(0,o)).map(d=>({...d}));if(l.length&&l.length<n.length){let d=l[l.length-1];d.text=d.text.length>1?d.text.slice(0,-1)+"…":"…"}return l}e(Re,"takeLines");var Ln=["#2563EB","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#DB2777","#4D7C0F","#EA580C","#4F46E5"];function Tn(n){let o=0,l=String(n||"");for(let d=0;d<l.length;d+=1)o=o*31+l.charCodeAt(d)>>>0;return Ln[o%Ln.length]}e(Tn,"exportCourseColor");function qn(n){let o=[];n.forEach(l=>{let d=o.findIndex(u=>u<l.startSection);d<0&&(d=o.length,o.push(0)),o[d]=l.endSection,l.lane=d}),n.forEach(l=>{l.laneCount=Math.max(1,o.length)})}e(qn,"assignScheduleLanes");function Mn(n){let o=n.slice().sort((u,y)=>u.startSection-y.startSection||u.endSection-y.endSection||u.course.name.localeCompare(y.course.name)),l=[],d=0;return o.forEach(u=>{l.length&&u.startSection>d&&(qn(l),l=[],d=0),l.push(u),d=Math.max(d,u.endSection)}),l.length&&qn(l),o}e(Mn,"layoutScheduleDay");function In(n){let o=[];return n.courses.forEach(l=>l.arrangements.forEach(d=>{o.push({course:l,arrangement:d,startSection:d.startSection,endSection:d.endSection,day:d.day})})),o}e(In,"scheduleExportEvents");function $n(n,o){let l=[],d=String(n||"");for(;d;)l.push(d.slice(0,o)),d=d.slice(o);return l}e($n,"wrapScheduleFooter");function Nn(n,o,l){let d=n.startSection===n.endSection?n.startSection+"节":n.startSection+"-"+n.endSection+"节",u=He(n.name,Math.max(5,o),"title"),y=He(n.teacher,Math.max(6,o+2),"teacher"),P=He([n.weekDescription,d].filter(Boolean).join(" · "),Math.max(6,o+2),"schedule"),C=He([n.campus,n.building,n.classroom].filter(Boolean).join(" "),Math.max(6,o+2),"location"),x=Math.max(1,Number(l)||1),A=C.length&&x>=2?Math.min(2,C.length):0,f=P.length&&x>=3?1:0,v=y.length&&x>=4?1:0,T=Math.max(1,x-A-f-v),S=Re(u,T),b=x-S.length,m=Math.min(y.length,Math.max(0,b-f-A));S.push(...Re(y,m)),b=x-S.length;let k=Math.min(P.length,Math.max(0,b-A));return S.push(...Re(P,k)),b=x-S.length,S.push(...Re(C,b)),S.slice(0,x)}e(Nn,"scheduleImageTextLines");function Ks(n,o){let l=Tn(o),d=n.colors,u=n.skin;return u==="brutal"?{fill:Nt(d.surface,l,.48),stroke:"#000000",text:"#111111",secondary:"#242424",stripe:l}:u==="flat"?{fill:Nt(d.surface,l,n.dark?.24:.16),stroke:d.text,text:d.text,secondary:d.secondary,stripe:l}:u==="editorial"?{fill:Nt(d.surface,l,n.dark?.16:.08),stroke:d.border,text:d.text,secondary:d.secondary,stripe:l}:{fill:Nt(d.surface,l,n.dark?.28:u==="organic"?.2:.14),stroke:Nt(d.border,l,n.dark?.52:.42),text:d.text,secondary:d.secondary,stripe:l}}e(Ks,"scheduleImageCourseStyle");function Bn(n,o,l={}){if(!o||!o.colors||!o.shape)throw new Error("课表图片主题未解析");let d=o.colors,u=o.shape,y=l.now instanceof Date?l.now:new Date,P=1960,C=40,x=136,A=P-C*2,f=C+24,v=64,T=8,S=f+v+12,b=C+A-24,m=(b-S-T*6)/7,k=x+88,g=108,_=102,N=k+g*12-x+24,z=n.courses.filter(nt=>!nt.arrangements.length).map(nt=>nt.name),H=$n(z.join("、"),92),F=H.length?74+H.length*27:44,G=x+N+F,Z=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],W=u.serif?"Georgia,Noto Serif SC,Songti SC,STSong,SimSun,serif":"Microsoft YaHei,Segoe UI,sans-serif",et="Microsoft YaHei,Segoe UI,sans-serif",it=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-frame-shadow)"':"",ft=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-card-shadow)"':"",V=[`<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${G}" viewBox="0 0 ${P} ${G}">`,"<defs>",`<filter id="schedule-frame-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${o.dark?10:7}" stdDeviation="${o.dark?16:11}" flood-color="${o.dark?"#000000":d.text}" flood-opacity="${o.dark?.48:.1}"/></filter>`,`<filter id="schedule-card-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${o.dark?"#000000":d.text}" flood-opacity="${o.dark?.34:.1}"/></filter>`,"</defs>",`<rect width="100%" height="100%" fill="${d.bg}"/>`,`<rect x="${C}" y="32" width="142" height="36" rx="${u.headerRadius}" fill="${d.primary}"/>`,`<text x="${C+71}" y="56" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="700" font-family="${et}">SCU URP++</text>`,`<text x="${C}" y="106" fill="${d.text}" font-size="36" font-weight="700" font-family="${W}">${At(n.semester.label)}课表</text>`,`<text x="${P-C}" y="54" text-anchor="end" fill="${d.secondary}" font-size="16" font-family="${et}">${At(o.label)}</text>`,`<text x="${P-C}" y="83" text-anchor="end" fill="${d.muted}" font-size="14" font-family="${et}">${At(y.toLocaleString("zh-CN",{hour12:!1}))}</text>`];u.shadow==="hard"&&V.push(`<rect x="${C+8}" y="${x+8}" width="${A}" height="${N}" fill="#000000"/>`),V.push(`<rect x="${C}" y="${x}" width="${A}" height="${N}" rx="${u.frameRadius}" fill="${d.surface}" stroke="${u.shadow==="hard"?"#000000":d.border}" stroke-width="${u.frameStroke}"${it}/>`),Z.forEach((nt,Q)=>{let ct=S+Q*(m+T);V.push(`<rect x="${ct}" y="${x+22}" width="${m}" height="48" rx="${u.headerRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${ct+m/2}" y="${x+53}" text-anchor="middle" fill="${d.secondary}" font-size="17" font-weight="600" font-family="${et}">${nt}</text>`)});for(let nt=1;nt<=12;nt+=1){let Q=k+(nt-1)*g;V.push(`<rect x="${f}" y="${Q}" width="${v}" height="${_}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${f+v/2}" y="${Q+_/2+6}" text-anchor="middle" fill="${d.muted}" font-size="16" font-weight="600" font-family="${et}">${nt}</text>`),Z.forEach((ct,tt)=>{let ut=S+tt*(m+T);V.push(`<rect x="${ut}" y="${Q}" width="${m}" height="${_}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`)})}[4,9].forEach(nt=>{let Q=k+nt*g-3;V.push(`<line x1="${S}" y1="${Q}" x2="${b}" y2="${Q}" stroke="${d.primary}" stroke-opacity=".42" stroke-width="2" stroke-dasharray="10 9"/>`)});for(let nt=1;nt<=7;nt+=1)Mn(In(n).filter(ct=>ct.day===nt)).forEach((ct,tt)=>{let ut=m/ct.laneCount,ht=S+(nt-1)*(m+T)+ct.lane*ut,X=k+(ct.startSection-1)*g,st=ut,wt=Math.max(_,(ct.endSection-ct.startSection)*g+_),vt=Ks(o,ct.course.name),Et="course-clip-"+nt+"-"+tt,I=Math.max(1,Math.floor((wt-18)/23)),U=Nn({name:ct.course.name,teacher:ct.course.teacher,weekDescription:ct.arrangement.weekDescription,startSection:ct.startSection,endSection:ct.endSection,campus:ct.arrangement.campus,building:ct.arrangement.building,classroom:ct.arrangement.classroom},Math.floor((st-22)/16),I);V.push(`<clipPath id="${Et}"><rect x="${ht+11}" y="${X+8}" width="${Math.max(10,st-22)}" height="${Math.max(18,wt-16)}" rx="${Math.max(0,u.cardRadius-5)}"/></clipPath>`,`<rect data-course-card="1" data-day="${nt}" data-start="${ct.startSection}" data-end="${ct.endSection}" x="${ht}" y="${X}" width="${st}" height="${wt}" rx="${u.cardRadius}" fill="${vt.fill}" stroke="${vt.stroke}" stroke-width="${u.cardStroke}"${ft}/>`),o.skin==="brutal"&&V.push(`<path d="M ${ht+st-4} ${X+4} V ${X+wt-4} H ${ht+4}" fill="none" stroke="#000000" stroke-opacity=".28" stroke-width="5"/>`),o.skin==="editorial"&&V.push(`<rect x="${ht}" y="${X}" width="6" height="${wt}" fill="${vt.stripe}"/>`),o.skin==="neu"&&V.push(`<path d="M ${ht+u.cardRadius} ${X+1} H ${ht+st-u.cardRadius}" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2"/>`),V.push('<g clip-path="url(#'+Et+')">'),U.forEach((K,mt)=>{let dt=K.kind==="title";V.push(`<text data-kind="${K.kind}" x="${ht+14}" y="${X+28+mt*23}" fill="${dt?vt.text:vt.secondary}" font-size="${dt?16:13}" font-weight="${dt?700:500}" font-family="${dt&&u.serif?W:et}">${At(K.text)}</text>`)}),V.push("</g>")});let rt=x+N+30;return H.length?(V.push(`<text x="${C}" y="${rt}" fill="${d.secondary}" font-size="15" font-weight="700" font-family="${et}">未排定时间的课程</text>`),H.forEach((nt,Q)=>V.push(`<text x="${C}" y="${rt+29+Q*27}" fill="${d.muted}" font-size="14" font-family="${et}">${At(nt)}</text>`))):V.push(`<text x="${C}" y="${rt}" fill="${d.muted}" font-size="14" font-family="${et}">由 SCU URP++ 基于结构化课表数据生成</text>`),V.push("</svg>"),{svg:V.join(""),width:P,height:G,background:d.bg,theme:o}}e(Bn,"buildScheduleSvg");function Zs(n,o,l={}){let d=[],u=l.json||null,y=l.ics||null,P=n==="ics"?o.courses.filter(C=>!C.arrangements.length).length:0;return P&&d.push(P+" 门未排定时间的课程未写入日历"),u&&u.unscheduledCourses&&d.push(u.unscheduledCourses+" 门未排定时间的课程未写入 JSON"),u&&u.missingWeeks&&d.push(u.missingWeeks+" 个上课安排缺少周次"),u&&u.invalidArrangements&&d.push(u.invalidArrangements+" 个上课安排缺少日期或节次"),y&&y.missingWeeks&&d.push(y.missingWeeks+" 个上课安排缺少周次"),y&&y.missingTimes&&d.push(y.missingTimes+" 个上课安排缺少节次时间"),d}e(Zs,"scheduleExportCompletionNotes");function We(n,o,l,d,u){return`<button type="button" class="urppp-export-option" role="menuitem" data-export-type="${n}"${u?" disabled":""}><i class="fa ${o}" aria-hidden="true"></i><span><strong>${l}</strong><small>${d}</small></span></button>`}e(We,"exportOptionHtml");function Fn(n){let{document:o,window:l,ensureStyles:d,loadData:u,exportJson:y,exportIcs:P,exportPng:C,showToast:x,nativePageUrl:A,navigate:f,logger:v=console}=n;function T(g){g&&(g.classList.remove("open"),g.querySelector(".urppp-export-trigger")?.setAttribute("aria-expanded","false"))}e(T,"closeMenu");function S(){l.__urpppExportDismissBound||(l.__urpppExportDismissBound=!0,o.addEventListener("click",g=>{o.querySelectorAll(".urppp-export-wrap.open").forEach(_=>{_.contains(g.target)||T(_)})},!0),o.addEventListener("keydown",g=>{g.key==="Escape"&&o.querySelectorAll(".urppp-export-wrap.open").forEach(T)}))}e(S,"bindDismiss");async function b(g,_,q,N){if(N&&N.disabled)return;let z=N&&N.innerHTML;try{if(N&&(N.disabled=!0,N.innerHTML='<i class="fa fa-spinner fa-spin"></i> 准备中'),g==="pdf"){if(typeof q!="function")throw new Error("当前页面不提供原生 PDF 导出");await q();return}let H=await u(_),F={};if(g==="json")F.json=await y(H);else if(g==="ics")F.ics=await P(H);else if(g==="png")await C(H);else throw new Error("未知导出格式");let G=Zs(g,H,F);x("课表已导出："+g.toUpperCase()+(G.length?"；"+G.join("，"):""))}catch(H){if(H&&H.message==="已取消导出")return;v.warn("[URP++] schedule export",H),x(H&&H.message||String(H),!0)}finally{N&&(N.disabled=!1,N.innerHTML=z)}}e(b,"run");function m(g={}){d();let _=g.source||"native",q=g.pdfHandler,N=typeof q=="function",z=o.createElement("span"),H=_==="native"?"导出课表":"导出";z.className="urppp-export-wrap",z.innerHTML=`<button type="button" class="urppp-export-trigger" aria-haspopup="menu" aria-expanded="false" title="导出课表"><i class="fa fa-cloud-download" aria-hidden="true"></i><span>${H}</span><i class="fa fa-angle-down" aria-hidden="true"></i></button><div class="urppp-export-menu" role="menu">${We("ics","fa-calendar","ICS 日历","导入系统日历或日历应用",!1)}${We("json","fa-code","JSON 数据","兼容小爱课程导入，可自定义格式",!1)}${We("png","fa-image","PNG 图片","完整学期课表高清图片",!1)}${We("pdf","fa-file-pdf-o","PDF",N?"使用教务系统原生导出":"仅原教务课表页面可用",!N)}${N?"":'<div class="urppp-export-guide">PDF 依赖原教务课表页面。<button type="button" data-export-native="1">前往本学期课表</button></div>'}</div>`;let F=z.querySelector(".urppp-export-trigger");F.addEventListener("click",Z=>{Z.preventDefault(),Z.stopPropagation();let W=!z.classList.contains("open");o.querySelectorAll(".urppp-export-wrap.open").forEach(T),z.classList.toggle("open",W),F.setAttribute("aria-expanded",W?"true":"false")}),z.querySelectorAll("[data-export-type]:not(:disabled)").forEach(Z=>{Z.addEventListener("click",()=>{T(z),b(Z.getAttribute("data-export-type"),_,q,F)})});let G=z.querySelector("[data-export-native]");return G&&G.addEventListener("click",()=>f(A)),S(),z}e(m,"createMenu");function k(g){(g&&g.querySelectorAll?g:o).querySelectorAll("[data-schedule-export-host]").forEach(q=>{q.querySelector(".urppp-export-wrap")||q.appendChild(m({source:q.getAttribute("data-schedule-export-host")||"clean"}))})}return e(k,"bindHosts"),{bindHosts:k,closeMenu:T,createMenu:m,run:b}}e(Fn,"createScheduleExportUi");function Dn(n){let o=e(l=>{n.querySelectorAll(".urppp-set-tab").forEach(d=>{let u=d.dataset.tab===l;d.classList.toggle("ac",u),d.setAttribute("aria-selected",u?"true":"false")}),n.querySelectorAll(".urppp-set-pane").forEach(d=>{d.classList.toggle("ac",d.dataset.pane===l)});try{let d=n.querySelector(".urppp-set-body");d&&(d.scrollTop=0)}catch{}},"switchTab");return n.querySelectorAll(".urppp-set-tab").forEach(l=>{l.addEventListener("click",()=>o(l.dataset.tab))}),n.__urpppSwitchTab=o,o}e(Dn,"bindSettingsTabs");function jn(n){let{document:o,ensurePanel:l,syncPanel:d,refreshUpdateStatus:u,defaultTab:y="theme"}=n;function P(){l();let x=o.getElementById("urppp-settings-panel"),A=o.getElementById("urppp-settings-mask");if(!x||!A)return!1;d();try{u()}catch{}try{x.__urpppSwitchTab&&x.__urpppSwitchTab(y)}catch{}A.classList.remove("open"),x.classList.remove("open"),x.offsetWidth,A.classList.add("open"),x.classList.add("open");try{let f=x.querySelector(".urppp-set-body");f&&(f.scrollTop=0)}catch{}return!0}e(P,"open");function C(){let x=o.getElementById("urppp-settings-panel"),A=o.getElementById("urppp-settings-mask");x&&x.classList.remove("open"),A&&A.classList.remove("open")}return e(C,"close"),{close:C,open:P}}e(jn,"createSettingsPanelController");function On(n){let{logoData:o,repositoryUrl:l,version:d}=n;return['<div class="urppp-set-head">','  <div class="urppp-set-title">设置</div>','  <button type="button" class="urppp-set-close" id="urppp-set-close" aria-label="关闭">×</button>',"</div>",'<div class="urppp-set-tabs" role="tablist">','  <button type="button" class="urppp-set-tab ac" data-tab="theme" role="tab" aria-selected="true">主题设置</button>','  <button type="button" class="urppp-set-tab" data-tab="skin" role="tab" aria-selected="false">主题选择</button>','  <button type="button" class="urppp-set-tab" data-tab="system" role="tab" aria-selected="false">系统设置</button>','  <button type="button" class="urppp-set-tab" data-tab="about" role="tab" aria-selected="false">关于</button>',"</div>",'<div class="urppp-set-body">','  <div class="urppp-set-pane ac" data-pane="theme">','    <section class="urppp-set-sec">',"      <h3>主题模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-modes">','        <button type="button" class="urppp-set-mode" data-theme="default">简约白</button>','        <button type="button" class="urppp-set-mode" data-theme="dark">深邃暗</button>','        <button type="button" class="urppp-set-mode" data-theme="scu-red">动态配色</button>',"      </div>",'      <div class="urppp-set-follow-row">','        <button type="button" class="urppp-set-follow" id="urppp-set-follow" aria-pressed="false">跟随系统：关</button>','        <button type="button" class="urppp-set-follow" id="urppp-set-follow-dynamic" aria-pressed="false">浅色用动态配色：关</button>',"      </div>",'      <button type="button" class="urppp-set-follow" id="urppp-set-clean-default" aria-pressed="false" style="margin-top:12px;width:100%">默认进入清爽模式：关</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-clean-analysis" aria-pressed="false" style="margin-top:12px;width:100%">清爽成绩分析展示：选项卡</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-apple-edge" aria-pressed="true" style="margin-top:12px;width:100%">类Apple边缘线条：开</button>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-dynamic">',"      <h3>种子色</h3>",'      <p class="urppp-set-tip">选一个颜色，自动生成背景、卡片、强调色等多套方案</p>','      <div class="urppp-set-presets" id="urppp-set-presets"></div>','      <div class="urppp-set-custom">','        <input type="color" id="urppp-set-color" value="#B53434" />','        <input type="text" id="urppp-set-hex" maxlength="7" value="#B53434" spellcheck="false" />','        <button type="button" class="urppp-set-btn" id="urppp-set-gen">生成方案</button>','        <button type="button" class="urppp-set-btn ghost" id="urppp-set-save">存为预设</button>',"      </div>",'      <h3 style="margin-top:16px">配色方案</h3>','      <div class="urppp-set-schemes" id="urppp-set-schemes"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-brutal" style="display:none">',"      <h3>高对比配色</h3>",'      <p class="urppp-set-tip">默认圆点使用高能粉；选择一种备用配色后，可由左上第三个圆点快速切换。</p>','      <div class="urppp-set-schemes" id="urppp-set-brutal-palettes"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="skin">','    <section class="urppp-set-sec">',"      <h3>界面风格</h3>",'      <p class="urppp-set-tip">在同一布局上切换视觉气质。因适配规模较大，仅保证清爽模式的完整适配，如有影响请使用默认类Apple风格并选择性开启边缘线条。</p>','      <div class="urppp-theme-store-bar"><button type="button" class="urppp-set-btn ghost" id="urppp-theme-store">主题商店</button></div>','      <div id="urppp-theme-store-inline" class="urppp-store-inline" style="display:none"></div>','      <div class="urppp-skin-list" id="urppp-skin-list"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="system">','    <section class="urppp-set-sec" id="urppp-set-privacy">',"      <h3>隐私模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-privacy-modes">','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="off">关闭</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="one">一键隐私</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="custom">自定义</button>',"      </div>",'      <div class="urppp-privacy-groups" id="urppp-set-privacy-custom">','        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">身份信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-identity" type="checkbox" data-privacy-field="identity" aria-label="隐藏学号和证件"><label for="urppp-privacy-identity">学号/证件</label><input class="urppp-feature-input" data-privacy-value="identity" maxlength="40" aria-label="学号和证件替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-organization" type="checkbox" data-privacy-field="organization" aria-label="隐藏学院和专业"><label for="urppp-privacy-organization">学院/专业</label><input class="urppp-feature-input" data-privacy-value="organization" maxlength="40" aria-label="学院和专业替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-contact" type="checkbox" data-privacy-field="contact" aria-label="隐藏联系和个人信息"><label for="urppp-privacy-contact">联系/个人信息</label><input class="urppp-feature-input" data-privacy-value="contact" maxlength="40" aria-label="联系和个人信息替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">学业信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-grade" type="checkbox" data-privacy-field="grade" aria-label="隐藏成绩"><label for="urppp-privacy-grade">成绩</label><input class="urppp-feature-input" data-privacy-value="grade" maxlength="40" aria-label="成绩替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-gpa" type="checkbox" data-privacy-field="gpa" aria-label="隐藏绩点"><label for="urppp-privacy-gpa">绩点</label><input class="urppp-feature-input" data-privacy-value="gpa" maxlength="40" aria-label="绩点替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-credit" type="checkbox" data-privacy-field="credit" aria-label="隐藏学分"><label for="urppp-privacy-credit">学分</label><input class="urppp-feature-input" data-privacy-value="credit" maxlength="40" aria-label="学分替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">页面内容</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-other" type="checkbox" data-privacy-field="other" aria-label="隐藏其他数据"><label for="urppp-privacy-other">其他数据</label><input class="urppp-feature-input" data-privacy-value="other" maxlength="40" aria-label="其他数据替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-schedule" type="checkbox" data-privacy-field="schedule" aria-label="隐藏课表"><label for="urppp-privacy-schedule">课表</label><input class="urppp-feature-input" data-privacy-value="schedule" maxlength="40" aria-label="课表替换内容"></div>','            <div class="urppp-privacy-field urppp-privacy-field-static"><input id="urppp-privacy-avatar" type="checkbox" data-privacy-field="avatar" aria-label="隐藏头像"><label for="urppp-privacy-avatar">头像</label><span class="urppp-privacy-note">使用统一遮罩</span></div>',"          </div>","        </div>","      </div>",'      <div class="urppp-direct-edit-control">',"        <div><strong>自由修改显示数据</strong><span>开启后，直接点击首页或清爽模式中带标记的数据进行修改</span></div>",'        <button type="button" class="urppp-set-follow" id="urppp-set-direct-edit-toggle" aria-pressed="false">页面内修改：关</button>',"      </div>","    </section>",'    <section class="urppp-set-sec" id="urppp-set-identity">',"      <h3>自定义姓名与头像</h3>",'      <div class="urppp-identity-editor">','        <div class="urppp-identity-fields">','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-name-enabled"> 自定义姓名</label><input class="urppp-feature-input" id="urppp-set-custom-name" maxlength="40" placeholder="输入显示姓名"></div>','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-avatar-enabled"> 自定义头像</label><input class="urppp-feature-input" id="urppp-set-custom-avatar-url" placeholder="https://... 图片地址"></div>','          <div class="urppp-feature-row"><label for="urppp-set-custom-avatar-file">本地图片</label><input class="urppp-feature-input" type="file" id="urppp-set-custom-avatar-file" accept="image/png,image/jpeg,image/webp,image/gif"></div>',"        </div>",'        <div class="urppp-identity-preview">','          <span class="urppp-identity-preview-label">头像预览</span>','          <div class="urppp-avatar-preview-shell"><span>未设置</span><img class="urppp-avatar-preview" id="urppp-set-avatar-preview" alt="自定义头像预览"></div>',"        </div>","      </div>",'      <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-privacy-save">保存隐私与显示设置</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-avatar-clear">清除自定义头像</button></div>','      <div class="urppp-set-tip" id="urppp-set-privacy-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-json-export">',"      <h3>JSON 导出格式</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-json-custom" aria-pressed="false" style="width:100%">自定义 JSON：关</button>','      <div class="urppp-json-mapping-editor" id="urppp-set-json-editor">','        <label for="urppp-set-json-mapping">字段映射</label>','        <textarea id="urppp-set-json-mapping" spellcheck="false" aria-label="自定义 JSON 字段映射"></textarea>','        <p class="urppp-set-tip">源字段包括 name、teacher、position、day、sections、weeks、code、credit、campus、building、classroom、weekList 等；目标值支持 data.courses 形式的嵌套路径。</p>','        <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-json-save">保存映射</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-json-reset">恢复默认映射</button></div>',"      </div>",'      <div class="urppp-set-tip" id="urppp-set-json-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-update">',"      <h3>更新</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-auto-update" aria-pressed="false" style="width:100%">自动检测更新：关</button>','      <button type="button" class="urppp-set-btn" id="urppp-set-check-update" style="margin-top:12px;width:100%">检查更新</button>','      <div id="urppp-set-update-status" class="urppp-set-tip" style="margin-top:8px"></div>',"    </section>",'    <div id="urppp-set-assist-slot"></div>',"  </div>",'  <div class="urppp-set-pane" data-pane="about">','    <div class="urppp-about">','      <img class="urppp-about-logo" id="urppp-about-logo" src="'+o+'" alt="SCU URP++" referrerpolicy="no-referrer" />','      <a class="urppp-about-ver" id="urppp-about-ver" href="'+l+'" target="_blank" rel="noopener noreferrer">SCU URP++ v'+d+"</a>",'      <p class="urppp-about-author">作者：Chao_Lan · Hanako</p>','      <p class="urppp-about-contact">QQ：2718748334</p>',`      <p class="urppp-about-msg">有任何问题欢迎及时反馈！
半夜Vibe有点爽怎么回事。</p>`,"    </div>","  </div>","</div>"].join("")}e(On,"buildSettingsPanelHtml");var Xt="urppp_plugin_",tl="1.0.0";function Ia({GM:n,doc:o,hostInfo:l,uiDeps:d}){let{getValue:u=e(()=>null,"getValue"),setValue:y=e(()=>{},"setValue"),xmlHttp:P,addStyle:C}=n||{},x=(typeof d=="function"?d:d&&d.openSubpanel)||null,A=new Map,f=new Map,v=new Map,T=[],S=null;function b(I,U){let K=v.get(I);K&&K.forEach(mt=>{try{mt(U)}catch{}})}e(b,"emit");function m(I,U){return v.has(I)||v.set(I,new Set),v.get(I).add(U),()=>v.get(I).delete(U)}e(m,"on");function k(I,U){return u(`${Xt}${I}_${U}`)}e(k,"storageGet");function g(I,U,K){y(`${Xt}${I}_${U}`,K)}e(g,"storageSet");function _(){return I=>({get:e(U=>k(I,U),"get"),set:e((U,K)=>g(I,U,K),"set"),remove:e(U=>y(`${Xt}${I}_${U}`,void 0),"remove")})}e(_,"storage");function q(I,U={}){return new Promise((K,mt)=>{if(typeof P!="function"){mt(new Error("GM_xmlhttpRequest 不可用（未授权跨域？）"));return}P({method:U.method||"GET",url:I,headers:U.headers||{},data:U.data,timeout:U.timeout||8e3,onload:e(dt=>dt.status>=200&&dt.status<300?K(dt.responseText):mt(new Error(`HTTP ${dt.status}`)),"onload"),onerror:e(()=>mt(new Error("网络错误")),"onerror"),ontimeout:e(()=>mt(new Error("超时(8s)")),"ontimeout")})})}e(q,"request");async function N(I,U){let K=Array.isArray(I)?I:[I],mt=[];for(let dt=0;dt<K.length;dt+=1){let Pt=K[dt];U&&U({stage:"downloading",index:dt+1,total:K.length,url:Pt});try{let xt=await q(Pt);return U&&U({stage:"downloaded",url:Pt,size:xt.length}),xt}catch(xt){mt.push(`源${dt+1}(${z(Pt)})失败: ${xt&&xt.message?xt.message:xt}`),U&&U({stage:"source_failed",index:dt+1,total:K.length,error:xt&&xt.message?xt.message:xt})}}throw new Error("所有下载源失败 → "+mt.join(" ｜ "))}e(N,"fetchWithFallback");function z(I){try{return new URL(I).host}catch{return I}}e(z,"shortHost");function H(I){let U=String(I||"").match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);return U?I.replace(U[0],""):I}e(H,"stripMetadata");function F(I,U){try{let K=H(I),mt=["GM_getValue","GM_setValue","GM_xmlhttpRequest","GM_registerMenuCommand","GM_addStyle","unsafeWindow"],dt=[typeof GM_getValue=="function"?GM_getValue:void 0,typeof GM_setValue=="function"?GM_setValue:void 0,typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:void 0,typeof GM_registerMenuCommand=="function"?GM_registerMenuCommand:void 0,typeof GM_addStyle=="function"?GM_addStyle:void 0,typeof unsafeWindow<"u"?unsafeWindow:null];return new Function(...mt,K)(...dt),!0}catch(K){return console.warn("[URP++ plugin] 注入失败",U,K),!1}}e(F,"inject");function G(I,U){let K=f.get(I);return K?(K.enabled=!!U,y(`${Xt}${I}_enabled`,K.enabled),b(U?"enabled":"disabled",I),!0):!1}e(G,"setEnabled");function Z(I){let U=f.get(I);return!!U&&U.enabled}e(Z,"isEnabled");function W(I){if(!I||!I.id)return!1;if(A.has(I.id)&&A.get(I.id).__urpppRegistered)return!0;let U=Object.assign({type:"plugin"},I);U.__urpppRegistered=!0,A.set(I.id,U);let K=f.get(I.id)||{loaded:!1,enabled:!1,version:I.version||""};return K.version=U.version||K.version,f.set(I.id,K),b("registered",U.id),!0}e(W,"register");function et(I){return A.get(I)||null}e(et,"get");function it(I){let U=[];for(let K of A.values())(!I||K.type===I)&&U.push(K);return U}e(it,"list");function ft(I){let U=f.get(I);return!!U&&U.loaded}e(ft,"loaded");async function V(I,U,K){K&&K({stage:"start",id:I});let mt=Array.isArray(U)?U:U?[U]:tt(I),dt=await N(mt,K);y(`${Xt}${I}_code`,dt),K&&K({stage:"injecting",id:I});let Pt=F(dt,I),xt=f.get(I)||{loaded:!1,enabled:!1,version:""};return xt.loaded=Pt,xt.enabled=Pt,xt.code=dt,xt.version=xt.version||rt(dt),f.set(I,xt),y(`${Xt}${I}_enabled`,Pt),b("loaded",I),Pt}e(V,"install");function rt(I){let U=String(I||"").match(/@version\s+(\S+)/);return U?U[1]:""}e(rt,"detectVersion");async function nt(I,U,K){let mt=Array.isArray(U)?U:U?[U]:tt(I),dt=await N(mt,K);y(`${Xt}${I}_code`,dt);let Pt=rt(dt),xt=f.get(I)||{loaded:!1,enabled:!1,version:""};return xt.version=Pt||xt.version,xt.code=dt,f.set(I,xt),b("updated",I),{ok:!0,version:Pt||xt.version}}e(nt,"update");function Q(I){let U=u(`${Xt}${I}_code`);if(!U)return!1;let K=f.get(I);if(K&&K.loaded)return!0;let mt=F(U,I),dt=f.get(I)||{loaded:!1,enabled:!1,version:rt(U)};return dt.loaded=mt,dt.enabled=mt&&u(`${Xt}${I}_enabled`)!==!1,dt.code=U,f.set(I,dt),b("loaded",I),mt}e(Q,"bootFromCache");function ct(I){let U=A.get(I);return A.delete(I),f.delete(I),y(`${Xt}${I}_enabled`,!1),b("unregistered",I),!!U}e(ct,"unregister");function tt(I){return I==="assist"?["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/plugins/urpppp.plugin.js","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js"]:[]}e(tt,"pluginSource");let ut={protocolVersion:tl,register:W,unregister:ct,get:et,list:it,loaded:ft,isEnabled:Z,enable:e((I,U=!0)=>G(I,U),"enable"),disable:e(I=>G(I,!1),"disable"),install:V,update:nt,bootFromCache:Q,storage:e(()=>u&&{get:e(I=>u(I),"get"),set:e((I,U)=>y(I,U),"set")},"storage"),pluginStorage:e(I=>_()(I),"pluginStorage"),request:q,addStyle:e(I=>{try{C&&C(I)}catch{}},"addStyle"),log:e((...I)=>{console.log("[URP++ plugin]",...I)},"log"),on:m,emit:b,hostInfo:Object.assign({name:"SCU URP++"},l||{}),getSubpanel:e(()=>x,"getSubpanel")};try{window.__urpppPlugin=ut}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppPlugin=ut)}catch{}function ht(I){if(!I||!o||I.querySelector(".urppp-plugin-sec, .urpppp-entry-sec"))return;let U=o.createElement("section");U.className="urppp-set-sec urppp-plugin-sec",U.id="urppp-plugin-sec",U.innerHTML=`
      <h3>辅助插件</h3>
      <div class="urppp-plugin-status" id="urppp-plugin-status">检查中…</div>
      <div class="urppp-plugin-actions">
        <button type="button" class="urppp-set-btn" id="urppp-plugin-install">装载辅助插件</button>
        <button type="button" class="urppp-set-btn ghost" id="urppp-plugin-store">插件商店</button>
      </div>
      <div id="urppp-plugin-panels" style="margin-top:10px"></div>
      <div id="urppp-store-inline" class="urppp-store-inline" style="display:none"></div>
      <p class="urppp-set-tip" id="urppp-plugin-tip" style="margin-top:8px"></p>
    `,I.appendChild(U);let K=U.querySelector("#urppp-plugin-status"),mt=U.querySelector("#urppp-plugin-install"),dt=U.querySelector("#urppp-plugin-store"),Pt=U.querySelector("#urppp-plugin-panels"),xt=U.querySelector("#urppp-plugin-tip");function Bt(){let Ct=f.get("assist"),It=A.has("assist");Ct&&Ct.loaded||It?(K.textContent=`辅助插件 v${Ct&&Ct.version?Ct.version:et("assist")&&et("assist").version||""} 已装载`,K.className="urppp-plugin-status ok",mt.textContent="重新装载",mt.dataset.state="loaded",xt.textContent="已装载。下方为扩展入口。"):(K.textContent=S||"未装载",K.className=S?"urppp-plugin-status err":"urppp-plugin-status",mt.textContent="装载辅助插件",mt.dataset.state="notloaded",xt.textContent=S?"装载失败，可就近重试或放回本地安装。下方为装载/商店入口。":"点击装载后，主插件会下载并注入辅助插件（登录助手/评教/会话保持/2FA），无需再单独安装。"),Pt.innerHTML="";let Yt=Et();if(Yt&&Object.keys(Yt).length){let Er=o.createElement("div");Er.className="urppp-plugin-sub",Object.keys(Yt).forEach(cr=>{let Jt=o.createElement("button");Jt.type="button",Jt.className="urppp-set-btn ghost",Jt.textContent=Yt[cr].label||cr,Jt.addEventListener("click",()=>{try{Yt[cr]&&typeof Yt[cr].open=="function"?Yt[cr].open():x&&x(cr)}catch{}}),Er.appendChild(Jt)}),Pt.appendChild(Er)}}e(Bt,"refresh"),mt.addEventListener("click",async()=>{mt.disabled=!0,mt.textContent="装载中…",K.className="urppp-plugin-status",K.textContent="正在开始装载…";try{if(await V("assist",null,It=>{try{It.stage==="downloading"?K.textContent=`下载中… 源${It.index}/${It.total}（${z(It.url)}）`:It.stage==="downloaded"?K.textContent=`已下载（${It.size} 字节），注入中…`:It.stage==="source_failed"?K.textContent=`源${It.index}失败（${It.error||""}），切换下一源…`:It.stage==="injecting"?K.textContent="注入中…":It.stage==="start"&&(K.textContent="正在开始装载…"),console.log("[URP++ plugin] assist 装载进度",It)}catch{}}))S=null,K.textContent="辅助插件已装载 v"+(et("assist")&&et("assist").version||""),console.log("[URP++ plugin] assist 装载成功");else throw new Error("注入失败")}catch(Ct){S="装载失败："+(Ct&&Ct.message?Ct.message:Ct),K.textContent=S,K.className="urppp-plugin-status err",console.warn("[URP++ plugin] assist 装载失败",Ct)}finally{mt.disabled=!1,Bt()}}),dt.addEventListener("click",()=>{x&&x("plugin-store")}),m("loaded",Ct=>{Ct==="assist"&&Bt()}),m("registered",Ct=>{Ct==="assist"&&Bt()}),m("unregistered",Ct=>{Ct==="assist"&&Bt()}),Bt()}e(ht,"renderAssistUi");function X(I){return String(I??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}e(X,"escapeHtml");function st(I){if(I){if(wt(),I.dataset.rendered==="1"){I.style.display=I.style.display==="none"?"":"none";return}I.dataset.rendered="1",I.innerHTML=`
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
      </div>`,I.querySelectorAll(".urppp-store-tab").forEach(U=>{U.addEventListener("click",()=>{I.querySelectorAll(".urppp-store-tab").forEach(mt=>mt.className="urppp-store-tab"),U.className="urppp-store-tab ac",I.querySelectorAll(".urppp-store-pane").forEach(mt=>mt.style.display="none");let K=I.querySelector('.urppp-store-pane[data-pane="'+U.dataset.tab+'"]');K&&(K.style.display="")})}),vt(I.querySelector("#urppp-store-manage-list")),I.style.display=""}}e(st,"togglePluginStore");function wt(){if(o.getElementById("urppp-store-style"))return;let I=o.createElement("style");I.id="urppp-store-style",I.textContent=`
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
    `,(o.head||o.documentElement).appendChild(I)}e(wt,"ensureStoreStyle");function vt(I){if(!I)return;I.innerHTML="";let U=Array.from(A.values());if(!U.length){I.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}U.forEach(K=>{let mt=f.get(K.id)||{},dt=o.createElement("div");dt.className="urppp-store-item";let Pt=o.createElement("div");Pt.className="urppp-store-info",Pt.innerHTML="<strong>"+X(K.name||K.id)+'</strong><span class="urppp-store-ver">'+(K.version?"v"+X(K.version):"")+'</span><span class="urppp-store-state'+(mt.loaded?" ok":"")+'">'+(mt.loaded?"已装载":"未装载")+"</span>";let xt=o.createElement("div");xt.className="urppp-store-ops";let Bt=o.createElement("button");Bt.type="button",Bt.textContent="重新装载",Bt.addEventListener("click",async()=>{Bt.disabled=!0,Bt.textContent="装载中…";try{let It=await V(K.id,null);Bt.textContent=It?"已装载":"装载失败",b("loaded",K.id)}catch{Bt.textContent="装载失败"}setTimeout(()=>{Bt.disabled=!1,Bt.textContent="重新装载"},1400)});let Ct=o.createElement("button");Ct.type="button",Ct.className="danger",Ct.textContent="卸载",Ct.addEventListener("click",()=>{ct(K.id),y(`${Xt}${K.id}_code`,""),y(`${Xt}${K.id}_enabled`,!1),b("unregistered",K.id),vt(I)}),xt.appendChild(Bt),xt.appendChild(Ct),dt.appendChild(Pt),dt.appendChild(xt),I.appendChild(dt)})}e(vt,"renderStoreManage");function Et(){let I={};return A.forEach(U=>{if(U.subpanels&&typeof U.subpanels=="function"){let K=U.subpanels();Object.keys(K||{}).forEach(mt=>{I[mt]=K[mt]})}else U.subpanels&&typeof U.subpanels=="object"&&Object.keys(U.subpanels).forEach(K=>{I[K]=U.subpanels[K]})}),I}return e(Et,"collectSubpanels"),{api:ut,install:V,update:nt,renderAssistUi:ht,openPluginStore:st,bootFromCache:Q,register:W}}e(Ia,"createPluginManager");function Hn(n){let{document:o,getSettings:l,setSettings:d,validateMapping:u,defaultMapping:y,getRecoveryMessage:P=e(()=>"","getRecoveryMessage")}=n;function C(f,v,T){let S=f&&f.querySelector("#urppp-set-json-status");S&&(S.textContent=v||"",S.classList.toggle("urppp-status-error",!!T),S.style.color=T?"var(--danger,#b91c1c)":"var(--text-muted)")}e(C,"setStatus");function x(f,v){if(!f)return;let T=l(),S=f.querySelector("#urppp-set-json-custom"),b=f.querySelector("#urppp-set-json-editor"),m=f.querySelector("#urppp-set-json-mapping");S&&(S.classList.toggle("ac",T.enabled),S.setAttribute("aria-pressed",T.enabled?"true":"false"),S.textContent="自定义 JSON："+(T.enabled?"开":"关")),b&&(b.style.display=T.enabled?"grid":"none"),m&&(v||!f.__urpppJsonMappingDirty&&o.activeElement!==m)&&(m.value=JSON.stringify(T.mapping,null,2),f.__urpppJsonMappingDirty=!1);let k=P();k&&C(f,k,!0)}e(x,"sync");function A(f){if(!f||f.__urpppJsonSettingsBound)return;f.__urpppJsonSettingsBound=!0;let v=f.querySelector("#urppp-set-json-custom"),T=f.querySelector("#urppp-set-json-mapping"),S=f.querySelector("#urppp-set-json-save"),b=f.querySelector("#urppp-set-json-reset");T&&T.addEventListener("input",()=>{f.__urpppJsonMappingDirty=!0}),v&&v.addEventListener("click",()=>{let m=l();m.enabled=!m.enabled;let k=!!f.__urpppJsonMappingDirty;d(m),x(f,!1);let g=m.enabled?"已启用自定义 JSON 格式":"已恢复小爱课程兼容格式";C(f,k?g+"；未保存草稿已保留":g)}),S&&S.addEventListener("click",()=>{try{let m=JSON.parse(String(T&&T.value||"").trim()),k=l();k.mapping=u(m),d(k),f.__urpppJsonMappingDirty=!1,x(f,!0),C(f,"自定义 JSON 映射已保存")}catch(m){C(f,m&&m.message||String(m),!0)}}),b&&b.addEventListener("click",()=>{let m=l();m.mapping=u(y),d(m),f.__urpppJsonMappingDirty=!1,x(f,!0),C(f,"已恢复默认字段映射")})}return e(A,"bind"),{bind:A,setStatus:C,sync:x}}e(Hn,"createJsonSettingsController");var ue="••••";var Rn={name:{enabled:!1,replacement:"同学"},identity:{enabled:!0,replacement:"已隐藏"},organization:{enabled:!0,replacement:"已隐藏"},contact:{enabled:!0,replacement:"已隐藏"},grade:{enabled:!0,replacement:"已隐藏"},gpa:{enabled:!0,replacement:"••••"},credit:{enabled:!0,replacement:"••••"},other:{enabled:!0,replacement:"已隐藏"},avatar:{enabled:!0,replacement:""},schedule:{enabled:!1,replacement:"课表已隐藏"}},rl=["completedCourses","failedCourses","majorGpa","majorPlan","remainingCourses","passingTotalCredit","passingAvgScore","passingAvgGpa","passingRequiredCredit","passingRequiredAvg","passingRequiredGpa","schemeTotalCredit","schemeAvgScore","schemeAvgGpa","schemeRequiredCredit","schemeRequiredAvg","schemeRequiredGpa"];function $a(n){let o=n&&typeof n=="object"?n:{},l=["off","one","custom"].includes(o.mode)?o.mode:"off",d={},u=o.fields&&typeof o.fields=="object"?o.fields:{},y=u.score&&typeof u.score=="object"?u.score:null;Object.keys(Rn).forEach(f=>{let v=Rn[f],T=["grade","gpa","credit"].includes(f)?y:null,S=f==="other"&&u.grade&&typeof u.grade=="object"?u.grade:null,b=u[f]&&typeof u[f]=="object"?u[f]:T||S||{};d[f]={enabled:f==="name"?!1:b.enabled==null?v.enabled:!!b.enabled,replacement:String(b.replacement==null?v.replacement:b.replacement).slice(0,80)}});let P=o.homepage&&typeof o.homepage=="object"?o.homepage:{},C=o.directEdit&&typeof o.directEdit=="object"?o.directEdit:P,x=C.values&&typeof C.values=="object"?C.values:{},A={};return rl.forEach(f=>{A[f]=String(x[f]==null?"":x[f]).trim().slice(0,80)}),{mode:l,mask:ue,fields:d,directEdit:{enabled:!!C.enabled,values:A}}}e($a,"normalizePrivacySettings");function me(n){let o=n&&typeof n=="object"?n:{},l=String(o.avatar||"").trim();return{nameEnabled:!!o.nameEnabled,name:String(o.name||"").trim().slice(0,40),avatarEnabled:!!o.avatarEnabled,avatar:l.length<=3145728?l:"",avatarName:String(o.avatarName||"").trim().slice(0,120)}}e(me,"normalizeCustomIdentity");function Jr(n){let o=String(n||"").trim();return o.length>3145728?"":/^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(o)?o:""}e(Jr,"validCustomAvatar");function el(n,o=globalThis.FileReader){return new Promise((l,d)=>{if(!n||!/^image\/(png|jpeg|webp|gif)$/i.test(n.type||"")){d(new Error("请选择 PNG、JPG、WebP 或 GIF 图片"));return}if(n.size>2*1024*1024){d(new Error("本地头像不能超过 2MB"));return}let u=new o;u.onload=()=>l(String(u.result||"")),u.onerror=()=>d(new Error("读取头像失败")),u.readAsDataURL(n)})}e(el,"readAvatarFile");function Wn(n){let{getPrivacySettings:o,setPrivacySettings:l,getCustomIdentity:d,setCustomIdentity:u,applyDisplay:y,refreshCleanDisplay:P,finishActiveDirectEdit:C,readAvatar:x=el}=n;function A(b,m){let k=m.mode==="custom",g=b.querySelector(".urppp-direct-edit-control"),_=b.querySelector("#urppp-set-direct-edit-toggle");g&&(g.style.display=k?"flex":"none"),_&&(_.dataset.enabled=m.directEdit.enabled?"1":"0",_.classList.toggle("ac",m.directEdit.enabled),_.setAttribute("aria-pressed",m.directEdit.enabled?"true":"false"),_.textContent="页面内修改："+(m.directEdit.enabled?"开":"关"))}e(A,"syncDirectEdit");function f(b){if(!b)return;let m=o();b.querySelectorAll("[data-privacy-mode]").forEach(F=>{let G=F.getAttribute("data-privacy-mode")===m.mode;F.classList.toggle("ac",G),F.setAttribute("aria-pressed",G?"true":"false")});let k=b.querySelector("#urppp-set-privacy-custom");k&&(k.style.display=m.mode==="custom"?"grid":"none"),Object.keys(m.fields).forEach(F=>{let G=m.fields[F],Z=b.querySelector('[data-privacy-field="'+F+'"]'),W=b.querySelector('[data-privacy-value="'+F+'"]');Z&&(Z.checked=!!G.enabled),W&&(W.value=G.replacement||"",W.disabled=!G.enabled)}),A(b,m);let g=d(),_=b.querySelector("#urppp-set-name-enabled"),q=b.querySelector("#urppp-set-custom-name"),N=b.querySelector("#urppp-set-avatar-enabled"),z=b.querySelector("#urppp-set-custom-avatar-url"),H=b.querySelector("#urppp-set-avatar-preview");if(_&&(_.checked=g.nameEnabled),q&&(q.value=g.name,q.disabled=!g.nameEnabled),N&&(N.checked=g.avatarEnabled),z&&(z.value=/^data:image\//i.test(g.avatar)?"":g.avatar,z.disabled=!g.avatarEnabled),b.__urpppAvatarSource=g.avatar,H){let F=Jr(g.avatar);H.style.display=F?"block":"none",F?H.src=F:H.removeAttribute("src")}}e(f,"sync");function v(b){let m=o();Object.keys(m.fields).forEach(g=>{let _=b.querySelector('[data-privacy-field="'+g+'"]'),q=b.querySelector('[data-privacy-value="'+g+'"]');_&&(m.fields[g].enabled=!!_.checked),q&&(m.fields[g].replacement=String(q.value||"").trim().slice(0,80))});let k=b.querySelector("#urppp-set-direct-edit-toggle");return m.directEdit.enabled=!!(k&&k.dataset.enabled==="1"),m}e(v,"collect");function T(b,m,k){let g=b&&b.querySelector("#urppp-set-privacy-status");g&&(g.textContent=m||"",g.style.color=k?"#b91c1c":"var(--text-muted)")}e(T,"setStatus");function S(b){if(!b||b.__urpppPrivacyBound)return;b.__urpppPrivacyBound=!0,b.querySelectorAll("[data-privacy-mode]").forEach(z=>{z.addEventListener("click",()=>{let H=o();H.mode=z.getAttribute("data-privacy-mode")||"off",l(H),f(b),y()})}),b.querySelectorAll("[data-privacy-field]").forEach(z=>{z.addEventListener("change",()=>{let H=z.getAttribute("data-privacy-field"),F=b.querySelector('[data-privacy-value="'+H+'"]');F&&(F.disabled=!z.checked)})});let m=b.querySelector("#urppp-set-direct-edit-toggle");m&&m.addEventListener("click",()=>{let z=m.dataset.enabled!=="1";m.dataset.enabled=z?"1":"0",m.classList.toggle("ac",z),m.setAttribute("aria-pressed",z?"true":"false"),m.textContent="页面内修改："+(z?"开":"关")});let k=b.querySelector("#urppp-set-name-enabled"),g=b.querySelector("#urppp-set-avatar-enabled");k&&k.addEventListener("change",()=>{let z=b.querySelector("#urppp-set-custom-name");z&&(z.disabled=!k.checked)}),g&&g.addEventListener("change",()=>{let z=b.querySelector("#urppp-set-custom-avatar-url");z&&(z.disabled=!g.checked)});let _=b.querySelector("#urppp-set-custom-avatar-file");_&&_.addEventListener("change",async()=>{try{let z=await x(_.files&&_.files[0]);b.__urpppAvatarSource=z;let H=b.querySelector("#urppp-set-avatar-preview");H&&(H.src=z,H.style.display="block"),g&&(g.checked=!0),T(b,"本地头像已读取，点击保存后生效")}catch(z){T(b,z&&z.message||String(z),!0)}});let q=b.querySelector("#urppp-set-avatar-clear");q&&q.addEventListener("click",()=>{try{let z=d();z.avatarEnabled=!1,z.avatar="",z.avatarName="",u(z),b.__urpppAvatarSource="",f(b),y(),P(),T(b,"已清除自定义头像")}catch(z){T(b,z&&z.message||"清除自定义头像失败",!0)}});let N=b.querySelector("#urppp-set-privacy-save");N&&N.addEventListener("click",()=>{let z=o(),H=d();try{let F=v(b),G=b.querySelector("#urppp-set-custom-avatar-url"),W=String(G&&G.value||"").trim()||b.__urpppAvatarSource||"",et=me({nameEnabled:!!(k&&k.checked),name:String(b.querySelector("#urppp-set-custom-name")?.value||"").trim(),avatarEnabled:!!(g&&g.checked),avatar:W,avatarName:H.avatarName});if(et.avatarEnabled&&!Jr(et.avatar))throw new Error("头像地址必须是 http(s) 图片或已选择的本地图片");z.directEdit.enabled&&!F.directEdit.enabled&&C(!0);try{u(et),l(F)}catch(it){try{u(H),l(z)}catch{}throw it}y(),P(),f(b),T(b,"隐私与显示设置已保存")}catch(F){T(b,F&&F.message||String(F),!0)}})}return e(S,"bind"),{bind:S,collect:v,setStatus:T,sync:f}}e(Wn,"createPrivacySettingsController");function Un(n){let{document:o,theme:l,preferences:d,accent:u,syncPanel:y}=n;function P(){l.getFollowSystem()?l.apply(l.resolveFollowTheme(),{system:!0}):l.apply("scu-red",{manual:!0})}e(P,"applyAccentTheme");function C(A,f){let v=A.querySelector("#urppp-set-schemes");if(!v)return;let T=u.getScheme();v.innerHTML="",u.listSchemePreviews(f).forEach(S=>{let b=o.createElement("button");b.type="button",b.className="urppp-set-scheme"+(S.id===T?" ac":""),b.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+S.bg+'"></span>','  <span style="background:'+S.surface+";border-color:"+S.border+'"></span>','  <span style="background:'+S.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+S.name+"</strong>","  <em>"+S.desc+"</em>","</div>"].join(""),b.addEventListener("click",()=>{u.setAccent(f),u.setScheme(S.id),P(),y()}),v.appendChild(b)})}e(C,"renderSchemeChoices");function x(A){A.querySelectorAll(".urppp-set-mode").forEach(z=>{z.addEventListener("click",()=>{l.isModeAvailable(z.dataset.theme)&&(l.apply(z.dataset.theme,{manual:!0}),y())})});let f=A.querySelector("#urppp-set-follow");f&&f.addEventListener("click",()=>{if(!l.supportsDark())return;let z=!l.getFollowSystem();l.setFollowSystem(z),z?l.apply(l.resolveFollowTheme(),{system:!0}):l.apply(l.getCurrent(),{manual:!0}),y(),l.syncNavbar()});let v=A.querySelector("#urppp-set-follow-dynamic");v&&v.addEventListener("click",()=>{l.supportsDynamic()&&(l.getFollowSystem()?l.setFollowDynamic(!l.getFollowDynamic()):(l.setFollowSystem(!0),l.setFollowDynamic(!0)),l.apply(l.resolveFollowTheme(),{system:!0}),y(),l.syncNavbar())});let T=A.querySelector("#urppp-set-clean-default");T&&T.addEventListener("click",()=>{d.setCleanDefault(!d.getCleanDefault()),y()});let S=A.querySelector("#urppp-set-clean-analysis");S&&S.addEventListener("click",()=>{let z=d.getCleanAnalysis()==="direct";d.setCleanAnalysis(z?"tab":"direct"),y()});let b=A.querySelector("#urppp-set-apple-edge");b&&b.addEventListener("click",()=>{d.setAppleEdge(!d.getAppleEdge());try{d.applySkin()}catch{}y()});let m=A.querySelector("#urppp-set-auto-update");m&&m.addEventListener("click",()=>{d.setAutoUpdate(!d.getAutoUpdate()),y()});let k=A.querySelector("#urppp-set-check-update");k&&!k.__urpppBound&&(k.__urpppBound=!0,k.addEventListener("click",()=>{d.checkUpdates()}));let g=A.querySelector("#urppp-set-color"),_=A.querySelector("#urppp-set-hex");if(!g||!_)return;g.addEventListener("input",()=>{_.value=g.value.toUpperCase()}),_.addEventListener("change",()=>{let z=u.normalize(_.value);z&&(_.value=z,g.value=z)});let q=A.querySelector("#urppp-set-gen");q&&q.addEventListener("click",()=>{let z=u.normalize(_.value)||g.value;z&&(u.setAccent(u.normalize(z)),P(),y())});let N=A.querySelector("#urppp-set-save");N&&N.addEventListener("click",()=>{let z=u.normalize(_.value)||g.value;z&&(u.savePreset(z),u.setAccent(u.normalize(z)),P(),y())}),g.addEventListener("change",()=>{let z=u.normalize(g.value);z&&(_.value=z,C(A,z))})}return e(x,"bind"),{bind:x,renderSchemeChoices:C}}e(Un,"createThemeSettingsController");function Gn(n,o){let{seed:l,currentTheme:d,followSystem:u,skinId:y,darkSupported:P,dynamicSupported:C,fixedPalettes:x,followUseDynamic:A,cleanDefault:f,cleanAnalysis:v,appleEdge:T,autoUpdate:S,modeAvailability:b}=o,m=n.querySelector("#urppp-set-color"),k=n.querySelector("#urppp-set-hex");m&&(m.value=l),k&&(k.value=l),n.querySelectorAll(".urppp-set-mode").forEach(W=>{let et=W.dataset.theme,it=b[et]!==!1,ft=!u&&et===d&&it;W.disabled=!it,W.classList.toggle("ac",ft),W.classList.toggle("urppp-dyn-disabled",!it),W.setAttribute("aria-disabled",it?"false":"true"),it?W.removeAttribute("title"):W.title=et==="dark"?"当前界面风格不支持暗色模式":"当前界面风格不支持动态配色"});let g=n.querySelector("#urppp-set-follow");g&&(g.disabled=!P,g.classList.toggle("ac",u&&P),g.classList.toggle("urppp-dyn-disabled",!P),g.setAttribute("aria-pressed",u&&P?"true":"false"),g.textContent=u&&P?"跟随系统：开":"跟随系统：关",g.title=P?"":"当前界面风格不支持暗色模式");let _=n.querySelector("#urppp-set-follow-dynamic");_&&(_.classList.toggle("ac",A&&C),_.setAttribute("aria-pressed",A&&C?"true":"false"),_.textContent=A?"浅色用动态配色：开":"浅色用动态配色：关",_.disabled=!u||!C,_.classList.toggle("urppp-dyn-disabled",!C),_.style.opacity=C&&u?"1":"0.5",_.title=C?"":"当前界面风格不支持动态配色");let q=n.querySelector("#urppp-set-dynamic");q&&(q.style.display=C?"":"none",q.style.opacity="1",q.classList.toggle("urppp-dyn-disabled",!1),q.querySelectorAll("button, input, .urppp-set-scheme, .urppp-set-swatch").forEach(W=>{W.disabled=!1,W.classList.toggle("urppp-dyn-disabled",!1)}),q.querySelectorAll("h3, .urppp-set-tip, label").forEach(W=>{W.classList.toggle("urppp-dyn-disabled",!1)}));let N=n.querySelector("#urppp-set-brutal");N&&(N.style.display=x?"":"none");let z=n.querySelector("#urppp-set-clean-default");z&&(z.classList.toggle("ac",f),z.setAttribute("aria-pressed",f?"true":"false"),z.textContent=f?"默认进入清爽模式：开":"默认进入清爽模式：关");let H=n.querySelector("#urppp-set-clean-analysis");if(H){let W=v==="direct";H.classList.toggle("ac",W),H.setAttribute("aria-pressed",W?"true":"false"),H.textContent=W?"清爽成绩分析展示：直接显示":"清爽成绩分析展示：选项卡"}let F=n.querySelector("#urppp-set-apple-edge"),G=n.querySelector("#urppp-set-apple-edge-tip");if(F){let W=y==="apple";F.style.display=W?"":"none",G&&(G.style.display=W?"":"none"),W&&(F.classList.toggle("ac",T),F.setAttribute("aria-pressed",T?"true":"false"),F.textContent=T?"类Apple边缘线条：开":"类Apple边缘线条：关")}let Z=n.querySelector("#urppp-set-auto-update");Z&&(Z.classList.toggle("ac",S),Z.setAttribute("aria-pressed",S?"true":"false"),Z.textContent=S?"自动检测更新：开":"自动检测更新：关")}e(Gn,"syncThemeSettingsControls");function Na(n){let o=String(n||"").replace(/\s+/g,"");return/^[•·●○▪◆★\-–]$/.test(o)||/^\d{1,4}$/.test(o)}e(Na,"isNoticeBulletText");function al(n){return/\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(n||""))}e(al,"isNoticeDateText");function Jn({pathname:n="",href:o="",title:l="",headingText:d=""}={}){return/courseSelectNotice|evaluationNotice|notice\/index/i.test(`${n} ${o}`)?!0:/评估公告|通知公告|选课公告|公告|通知/.test(`${l} ${d}`)}e(Jn,"isNoticePageContext");function Ba(n,{noticePage:o=!1}={}){if(!n)return!1;let d=(n.querySelector("thead")?.textContent||"").replace(/\s+/g,"");if(/标题/.test(d)&&/发布时间|发布日期|日期|时间/.test(d)||o&&/标题|公告|通知/.test(d)&&!/教室|教学楼|课程号|成绩|学号|座位数/.test(d))return!0;let u=n.querySelectorAll("tbody tr, tr"),y=0;if(u.forEach(C=>{let x=C.querySelectorAll("td");x.length<2||x.length>4||Na(x[0].textContent)&&C.querySelector("a")&&al(C.textContent)&&(y+=1)}),y<1)return!1;if(o||y===u.length)return!0;let P=n.getAttribute("style")||"";return/dashed/i.test(P)||n.classList.contains("no-border-top")||!!n.getAttribute("width")}e(Ba,"isNoticeListTable");function Vn(n,{noticePage:o=!1}={}){if(!n)return!0;if(n.classList?.contains("urppp-notice-table")||Ba(n,{noticePage:o}))return!1;let l=`${n.id||""} ${n.getAttribute("class")||""}`;if(/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(l)||n.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]'))return!0;let d=n.querySelector("tbody tr, tr");if(d&&d.querySelectorAll("td,th").length>=5)return!0;let y=(n.querySelector("thead")?.textContent||"").replace(/\s+/g,"");return!!(y&&(/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(y)||/序号/.test(y)&&!/标题|公告|通知|发布时间/.test(y))||n.querySelector("a")&&/课表|教室信息|查看/.test(n.textContent||"")&&!o&&/座位数|教学楼|教室号|校区名/.test(n.textContent||""))}e(Vn,"isBusinessDataTable");function Yn({isNativePdfIsolationActive:n,isBusinessDataTable:o,documentRef:l=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,getComputedStyleRef:y=getComputedStyle}){function P(){n()||l.querySelectorAll("table.table, table.table-bordered, table.dataTable").forEach(x=>{if(!x||x.closest(".urppp-table-wrap")||x.id==="courseTable"||x.closest(".modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal")||x.classList.contains("urppp-wrs-table")||x.classList.contains("urppp-notice-table"))return;o(x);let A=x.parentElement;if(!A)return;let f=A.style?.overflow||y(A).overflow;if(A.id?.endsWith("_scroll")||f==="auto"||f==="scroll"){A.classList.add("urppp-scroll-table-host");return}let T=l.createElement("div");T.className="urppp-table-wrap",A.insertBefore(T,x),T.appendChild(x)})}e(P,"wrapTables");function C(){let x=l.getElementById("page-content-template")||l.querySelector(".page-content")||l.body;if(!x)return;let A=d.__urpppTableObsRoot;if(d.__urpppTableObs&&A===x&&x.isConnected)return;d.__urpppTableObs&&d.__urpppTableObs.disconnect();let f=0,v=new u(()=>{clearTimeout(f),f=setTimeout(P,80)});v.observe(x,{childList:!0,subtree:!0}),d.__urpppTableObs=v,d.__urpppTableObsRoot=x}return e(C,"bindTableWrapObserver"),{bindTableWrapObserver:C,wrapTables:P}}e(Yn,"createTableWrapper");function Qn(n){let o=String(n||"").trim().toLowerCase();if(!o||o==="transparent"||o==="inherit"||o==="initial")return!1;if(/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(o))return!0;let l=o.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);if(!l)return!1;let d=Number(l[1]),u=Number(l[2]),y=Number(l[3]);return(d+u+y)/3>=200}e(Qn,"isLightInlineColor");function ol(n){if(!n?.style)return;let o=n.getAttribute("style")||"";if(!o||!/background/i.test(o))return;let l=n.style.backgroundColor||n.style.background||"";(Qn(l)||/background(-color|-image)?\s*:/i.test(o))&&(n.style.removeProperty("background"),n.style.removeProperty("background-color"),n.style.removeProperty("background-image")),["borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"].forEach(d=>{let u=n.style[d];!u||!Qn(u)||n.style.removeProperty(d.replace(/[A-Z]/g,y=>`-${y.toLowerCase()}`))}),/border(-color)?\s*:/i.test(o)&&/#e6e6e6|#eee|#ddd|#ccc/i.test(o)&&(n.style.removeProperty("border-color"),n.style.removeProperty("border-top-color"),n.style.removeProperty("border-right-color"),n.style.removeProperty("border-bottom-color"),n.style.removeProperty("border-left-color"))}e(ol,"scrubLightInlineBackground");function Xn({isNativePdfIsolationActive:n,documentRef:o=document,windowRef:l=window,MutationObserverRef:d=MutationObserver}){function u(){if(!n())try{let P=o.documentElement.classList.contains("urppp-theme-dark"),C=o.body?.classList.contains("urppp-dark");if(!P&&!C)return;o.querySelectorAll("table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th").forEach(ol)}catch{}}e(u,"scrubTableHeaderInlineBg");function y(){[0,200,800,1600].forEach(P=>setTimeout(()=>{try{u()}catch{}},P));try{let P=o.querySelector(".page-content, #page-content-template, .main-content")||o.body;if(!P)return;let C=l.__urpppTableScrubObs;if(C&&C.root===P&&P.isConnected)return;C?.observer&&C.observer.disconnect();let x=new d(()=>{clearTimeout(l.__urpppTableScrubTimer),l.__urpppTableScrubTimer=setTimeout(()=>{try{u()}catch{}},120)});x.observe(P,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),l.__urpppTableScrubObs={root:P,observer:x}}catch{}}return e(y,"scheduleScrubTableInlineBg"),{scheduleScrubTableInlineBg:y,scrubTableHeaderInlineBg:u}}e(Xn,"createTableInlineStyleScrubber");function Kn({beautifyPagebar:n,documentRef:o=document,windowRef:l=window,MutationObserverRef:d=MutationObserver,setTimeoutRef:u=setTimeout,clearTimeoutRef:y=clearTimeout}){function P(){n(),o.querySelectorAll("#urppagebar").forEach(x=>{if(x.__urpppPagebarObs)return;x.__urpppPagebarObs=!0,new d(()=>{y(l.__urpppPagebarTimer),l.__urpppPagebarTimer=u(()=>n(x.parentElement||o),150)}).observe(x,{childList:!0,subtree:!0})})}e(P,"run");function C(){if(l.__urpppPagebarBound){u(P,0);return}l.__urpppPagebarBound=!0,[0,300,1e3,2500].forEach(x=>u(P,x))}return e(C,"scheduleBeautifyPagebar"),{scheduleBeautifyPagebar:C}}e(Kn,"createPagebarLifecycle");function Zn({destroyPagebarChosen:n,documentRef:o=document,logger:l=console}){function d(u){try{(u?.querySelectorAll?u.querySelectorAll("#urppagebar"):o.querySelectorAll("#urppagebar")).forEach(P=>{if(!P)return;P.classList.add("urppp-pagebar"),P.style.setProperty("display","block","important"),P.style.setProperty("width","100%","important"),P.style.setProperty("line-height","1.5","important");let C=P.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]')||P,x=Array.from(P.querySelectorAll('[id^="span_page_txt_"]')).map(b=>String(b.textContent||"").trim()).join(""),A=P.querySelector('select[id^="pagination_pageSize_"]'),f=A?String(A.value||""):"",v=P.querySelector('[id^="turnpageto_"]'),T=!!(v&&(v.readOnly||v.hasAttribute("readonly")));if(!(x.includes("转到")&&!T&&!f.includes("_"))){P.classList.add("urppp-pagebar-scroll"),P.classList.remove("urppp-pagebar-jump"),P.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach(b=>{b.style.setProperty("display","none","important")}),P.querySelectorAll("select").forEach(b=>{n(b),b.style.setProperty("width","128px","important"),b.style.setProperty("min-width","128px","important"),b.style.setProperty("max-width","128px","important")}),P.querySelectorAll(".chosen-container").forEach(b=>{try{b.style.setProperty("display","none","important")}catch{}});return}P.classList.add("urppp-pagebar-jump"),P.classList.remove("urppp-pagebar-scroll"),C.style.setProperty("display","flex","important"),C.style.setProperty("align-items","center","important"),C.style.setProperty("flex-wrap","wrap","important"),C.style.setProperty("gap","8px","important"),C.style.setProperty("position","relative","important"),C.style.setProperty("line-height","1.5","important"),P.querySelectorAll("ul.pagination").forEach(b=>{b.classList.add("urppp-pagination"),b.style.cssText=["display:inline-flex !important","align-items:center !important","flex-wrap:wrap !important","gap:4px !important","margin:0 !important","padding:0 !important","list-style:none !important","float:none !important","position:static !important"].join(";")}),P.querySelectorAll("ul.pagination > li").forEach(b=>{let m=b.classList.contains("active"),k=b.classList.contains("disabled"),g=b.classList.contains("previous")||/previous/i.test(b.getAttribute("name")||""),_=b.classList.contains("next")||/next/i.test(b.getAttribute("name")||"");b.classList.add("urppp-page-li"),m&&b.classList.add("urppp-page-li-active"),k&&b.classList.add("urppp-page-li-disabled"),g&&b.classList.add("urppp-page-li-prev"),_&&b.classList.add("urppp-page-li-next"),b.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","float:none !important","position:static !important","margin:0 !important","padding:0 !important","list-style:none !important","border:none !important","background:transparent !important","height:auto !important","min-height:0 !important"].join(";");let q=b.querySelector(":scope > span, :scope > a")||b.firstElementChild;if(!q)return;q.classList.add("urppp-page-chip"),m&&q.classList.add("urppp-page-chip-active"),k&&q.classList.add("urppp-page-chip-disabled"),(g||_)&&q.classList.add("urppp-page-chip-nav");let N=g||_?"72px":"40px",z=m?"var(--pagination-active-bg, var(--primary))":"var(--surface)",H=m?"var(--pagination-active-border, var(--primary))":"var(--border)",F=m?"var(--pagination-active-foreground, var(--primary-foreground, #fff))":k?"var(--text-muted)":"var(--text)";q.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","box-sizing:border-box !important","float:none !important","position:static !important","width:auto !important",`min-width:${N} !important`,"height:36px !important","min-height:36px !important","max-height:36px !important","padding:0 12px !important","margin:0 !important","line-height:36px !important","font-size:14px !important","font-weight:600 !important","border-radius:8px !important",`border:1px solid ${H} !important`,`background:${z} !important`,`color:${F} !important`,"box-shadow:none !important","text-decoration:none !important",`cursor:${k?"default":"pointer"} !important`,"white-space:nowrap !important","overflow:hidden !important"].join(";")}),P.querySelectorAll('[id^="btn_turnpageto_"]').forEach(b=>{b.classList.add("urppp-page-confirm"),b.style.setProperty("position","static","important"),b.style.setProperty("left","auto","important"),b.style.setProperty("top","auto","important"),b.style.setProperty("float","none","important"),b.style.setProperty("height","32px","important"),b.style.setProperty("min-width","52px","important"),b.style.setProperty("padding","0 12px","important"),b.style.setProperty("margin","0 4px","important"),b.style.setProperty("font-size","13px","important"),b.style.setProperty("line-height","1","important"),b.style.setProperty("vertical-align","middle","important")}),P.querySelectorAll('[id^="turnpageto_"]').forEach(b=>{b.classList.add("urppp-page-goto"),b.style.setProperty("position","static","important"),b.style.setProperty("display","inline-block","important"),b.style.setProperty("height","32px","important"),b.style.setProperty("width","48px","important"),b.style.setProperty("margin","0 4px","important"),b.style.setProperty("padding","4px 8px","important"),b.style.setProperty("font-size","14px","important"),b.style.setProperty("line-height","1.2","important"),b.style.setProperty("box-sizing","border-box","important"),b.style.setProperty("vertical-align","middle","important");let m=b.parentElement;m?.tagName==="SPAN"&&(m.style.setProperty("position","static","important"),m.style.setProperty("display","inline-flex","important"),m.style.setProperty("align-items","center","important"),m.style.setProperty("width","auto","important"),m.style.setProperty("height","auto","important"),m.style.setProperty("min-height","0","important"),m.style.setProperty("vertical-align","middle","important"))}),P.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach(b=>{b.style.setProperty("display","inline","important"),b.style.setProperty("border","none","important"),b.style.setProperty("background","transparent","important"),b.style.setProperty("padding","0","important"),b.style.setProperty("margin","0","important"),b.style.setProperty("height","auto","important"),b.style.setProperty("line-height","1.5","important"),b.style.setProperty("font-size","13px","important"),b.style.setProperty("color","var(--text-secondary, var(--text-muted))","important")})})}catch(y){l.warn("[URP++] pagebar beautify failed",y)}}return e(d,"beautifyPagebar"),{beautifyPagebar:d}}e(Zn,"createPagebarBeautifier");function tp({beautifyNoticeTables:n,pinNoticeRowSurface:o,documentRef:l=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,requestAnimationFrameRef:y=requestAnimationFrame,setTimeoutRef:P=setTimeout,clearTimeoutRef:C=clearTimeout}){function x(){d.__urpppNoticeHoverScrub||(d.__urpppNoticeHoverScrub=!0,l.addEventListener("mouseout",f=>{let v=f.target?.closest?f.target.closest("table.urppp-notice-table tr.urppp-notice-row"):null;v&&y(()=>o(v))},!0))}e(x,"bindNoticeHoverScrub");function A(){[0,400,1500].forEach(f=>P(()=>{try{n()}catch{}},f));try{let f=l.getElementById("page-content-template")||l.querySelector(".page-content, .main-content")||l.body;if(!f)return;let v=d.__urpppNoticeObs;if(v&&v.root===f&&f.isConnected)return;v?.observer&&v.observer.disconnect();let T=new u(()=>{C(d.__urpppNoticeTimer),d.__urpppNoticeTimer=P(()=>{try{n()}catch{}},180)});T.observe(f,{childList:!0,subtree:!0}),d.__urpppNoticeObs={root:f,observer:T}}catch{}}return e(A,"scheduleBeautifyNoticeTables"),{bindNoticeHoverScrub:x,scheduleBeautifyNoticeTables:A}}e(tp,"createNoticeTableLifecycle");function rp({getCurrentTheme:n,documentRef:o=document,getComputedStyleRef:l=getComputedStyle}){function d(){try{return l(o.documentElement).getPropertyValue("--surface").trim()||(n()==="dark"?"#151A24":"#FFFFFF")}catch{return n()==="dark"?"#151A24":"#FFFFFF"}}e(d,"noticeSurfaceColor");function u(x){if(!x?.classList?.contains("urppp-notice-row"))return;let A=d();x.classList.remove("hover"),x.style.setProperty("background",A,"important"),x.style.setProperty("background-color",A,"important"),x.querySelectorAll("td, th").forEach(f=>{f.classList.remove("hover"),f.style.setProperty("background","transparent","important"),f.style.setProperty("background-color","transparent","important")})}e(u,"pinNoticeRowSurface");function y(x){try{let A=x||o;if(A.matches?.("tr.urppp-notice-row")){u(A);return}A.querySelectorAll("table.urppp-notice-table tr.urppp-notice-row").forEach(u)}catch{}}e(y,"scrubNoticeInlineBg");function P(x){x&&(x.classList.remove("table-hover","table-striped"),x.classList.add("urppp-notice-nohover"),x.querySelectorAll("tr.urppp-notice-row").forEach(A=>{A.classList.remove("hover"),u(A)}))}e(P,"disarmNoticeTableHover");function C(x){if(!x)return;x.classList.remove("urppp-notice-table"),delete x.dataset.urpppNoticeScan,x.style.removeProperty("border"),x.style.removeProperty("border-left"),x.style.removeProperty("background");let A=x.closest(".urppp-table-wrap.urppp-notice-wrap");A&&(A.classList.remove("urppp-notice-wrap"),A.style.removeProperty("border"),A.style.removeProperty("background"),A.style.removeProperty("box-shadow"),A.style.removeProperty("overflow"),A.style.removeProperty("border-radius")),x.querySelectorAll("tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card").forEach(f=>{f.classList.remove("urppp-notice-row","urppp-notice-title-cell","urppp-notice-date-cell","urppp-notice-bullet-cell","urppp-notice-link","urppp-notice-time","urppp-notice-card","urppp-notice-card-row","urppp-notice-main","urppp-notice-meta","urppp-notice-title","urppp-notice-body"),(f.tagName==="TR"||f.tagName==="TD")&&["display","border","background","padding","margin","width","box-shadow","border-radius","float","position"].forEach(v=>{f.style.getPropertyPriority(v)==="important"&&f.style.removeProperty(v)}),delete f.dataset.urpppNoticeDone})}return e(C,"stripMistakenNoticeTable"),{disarmNoticeTableHover:P,pinNoticeRowSurface:u,scrubNoticeInlineBg:y,stripMistakenNoticeTable:C}}e(rp,"createNoticeTableSurface");function ep({isNativePdfIsolationActive:n,bindNoticeHoverScrub:o,scrubNoticeInlineBg:l,stripMistakenNoticeTable:d,disarmNoticeTableHover:u,pinNoticeRowSurface:y,isBusinessDataTable:P,isNoticeListTable:C,isNoticePageContext:x,isNoticeBulletText:A,documentRef:f=document,windowRef:v=window,logger:T=console}){function S(){if(!n())try{o(),l(),f.querySelectorAll("table.urppp-notice-table, table.table").forEach(m=>{P(m)&&(m.classList.contains("urppp-notice-table")||m.querySelector(".urppp-notice-row, .urppp-notice-title-cell"))&&d(m)});let b=new Set(f.querySelectorAll('.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'));x()?f.querySelectorAll("table").forEach(m=>b.add(m)):f.querySelectorAll("table").forEach(m=>{C(m)&&b.add(m)}),Array.from(b).forEach(m=>{if(!m||P(m))return;if(m.querySelector("thead th")&&m.querySelectorAll("thead th").length>=3){let z=m.querySelector("thead")?.textContent||"";if(!C(m)&&/序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(z)&&!/标题|公告|通知/.test(z))return}let k=Array.from(m.querySelectorAll("tbody > tr, tr")).filter(z=>z.querySelector("td"));if(!k.length)return;let g=0;k.slice(0,12).forEach(z=>{let H=Array.from(z.children).filter(et=>et.tagName==="TD"||et.tagName==="TH");if(H.length>=5)return;let F=(z.textContent||"").replace(/\s+/g," ").trim(),G=!!z.querySelector("a[href], a[onclick], a"),Z=/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(F),W=H.some(et=>A(et.textContent));(G&&Z||W&&G||W&&Z)&&(g+=1)});let _=m.classList.contains("no-border-top")||/dashed|border-left-style/.test(m.getAttribute("style")||""),q=x();if(g<1){if(q){if(k.slice(0,8).filter(H=>{let F=Array.from(H.children).filter(Z=>Z.tagName==="TD"||Z.tagName==="TH");if(F.length<1||F.length>4)return!1;let G=(H.textContent||"").replace(/\s+/g," ").trim();return!!H.querySelector("a")||/\d{4}/.test(G)}).length<1&&!_)return}else if(!(_&&/公告|通知/.test(f.title||"")))return}if(P(m))return;m.classList.add("urppp-notice-table"),m.dataset.urpppNoticeScan="1",u(m),m.style.setProperty("border","none","important"),m.style.setProperty("border-left","none","important"),m.style.setProperty("background","transparent","important"),m.style.setProperty("width","100%","important");let N=m.closest(".urppp-table-wrap");N&&(N.classList.add("urppp-notice-wrap"),N.style.setProperty("border","none","important"),N.style.setProperty("background","transparent","important"),N.style.setProperty("box-shadow","none","important"),N.style.setProperty("overflow","visible","important"),N.style.setProperty("border-radius","0","important")),k.forEach(z=>{if(z.dataset.urpppNoticeDone==="1")return;let H=Array.from(z.children).filter(V=>V.tagName==="TD"||V.tagName==="TH");if(!H.length)return;let F=e(V=>(V||"").replace(/\u00AD/g,"").replace(/\u200B/g,"").replace(/\s+/g," ").trim(),"clean");if(H.length>=2){let V=null,rt=null,nt=null;if(H.forEach((Q,ct)=>{let tt=F(Q.textContent),ut=!!Q.querySelector("a");if(!V&&A(tt)&&(ct===0||H.length>=2)){V=Q;return}if(!nt&&(/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(tt)||/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(tt)||/text-align\s*:\s*right/i.test(Q.getAttribute("style")||"")||ct===H.length-1&&tt.length<=28&&/\d{4}/.test(tt))&&/\d{4}/.test(tt)&&tt.length<=32){nt=Q;return}!rt&&(ut||tt.length>4)&&(rt=Q)}),rt||(rt=H.find(Q=>Q!==V&&Q!==nt)||H[0]),!nt&&H.length>=2){let Q=H[H.length-1];Q!==rt&&Q!==V&&(nt=Q)}if(z.classList.add("urppp-notice-row"),y(z),z.removeAttribute("width"),z.style.setProperty("flex-wrap","nowrap","important"),H.forEach(Q=>{Q.removeAttribute("width"),Q.removeAttribute("height"),Q.removeAttribute("align"),Q.style.setProperty("border","none","important"),Q.style.setProperty("background","transparent","important"),Q.style.setProperty("vertical-align","middle","important"),Q.style.removeProperty("width"),Q.style.setProperty("width","auto","important")}),V&&(V.classList.add("urppp-notice-bullet-cell"),V.style.setProperty("display","none","important"),V.style.setProperty("width","0","important"),V.style.setProperty("padding","0","important")),rt){rt.classList.add("urppp-notice-title-cell"),rt.removeAttribute("width"),rt.style.setProperty("width","auto","important"),rt.style.setProperty("max-width","100%","important"),rt.style.setProperty("min-width","0","important"),rt.style.setProperty("flex","1 1 0%","important"),rt.style.setProperty("overflow","hidden","important"),rt.style.setProperty("padding","0","important"),rt.style.setProperty("pointer-events","auto","important"),rt.style.setProperty("white-space","nowrap","important");let Q=rt.querySelector("a[href], a[onclick], a");if(Q||(Q=z.querySelector("a[href], a[onclick], a")),Q){rt.contains(Q)||(rt.innerHTML="",rt.appendChild(Q)),Q.classList.add("urppp-notice-link");let ct=Q.getAttribute("href"),tt=Q.getAttribute("onclick"),ut=Q.getAttribute("target"),ht=F(Q.textContent);Q.textContent=ht,ct!=null&&Q.setAttribute("href",ct),tt!=null&&Q.setAttribute("onclick",tt),ut!=null&&Q.setAttribute("target",ut),Q.style.setProperty("color","var(--text)","important"),Q.style.setProperty("text-decoration","none","important"),Q.style.setProperty("font-size","14px","important"),Q.style.setProperty("font-weight","500","important"),Q.style.setProperty("line-height","1.5","important"),Q.style.setProperty("pointer-events","auto","important"),Q.style.setProperty("cursor","pointer","important"),Q.style.setProperty("position","relative","important"),Q.style.setProperty("z-index","2","important"),Q.style.setProperty("display","block","important"),Q.style.setProperty("white-space","nowrap","important"),Q.style.setProperty("overflow","hidden","important"),Q.style.setProperty("text-overflow","ellipsis","important"),z.dataset.urpppNoticeClickBound!=="1"&&(z.dataset.urpppNoticeClickBound="1",z.style.setProperty("cursor","pointer","important"),z.addEventListener("click",X=>{if(X.target&&X.target.closest&&X.target.closest("a,button,input,select,textarea,label"))return;if(Q.getAttribute("onclick")){Q.click();return}let st=Q.getAttribute("href");if(!st||st==="#"||st.indexOf("javascript:")===0){Q.click();return}Q.target==="_blank"?v.open(st,"_blank"):v.location.href=st}))}else{let ct=F(rt.textContent);ct&&!rt.querySelector("button, input, select")&&(!rt.querySelector("*")||rt.children.length===0)&&(rt.textContent=ct)}}if(nt){nt.classList.add("urppp-notice-date-cell"),nt.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-end !important","flex:0 0 auto !important","width:auto !important","max-width:none !important","white-space:nowrap !important","text-align:right !important","padding:0 !important","margin:0 0 0 auto !important","border:none !important","background:transparent !important","float:none !important","position:static !important","right:auto !important","left:auto !important","top:auto !important"].join(";");let Q=F(nt.textContent);nt.innerHTML="";let ct=f.createElement("span");ct.className="urppp-notice-time",ct.textContent=Q,nt.appendChild(ct)}rt&&(rt.style.setProperty("flex","1 1 auto","important"),rt.style.setProperty("min-width","0","important"),rt.style.setProperty("margin","0","important"),rt.style.setProperty("float","none","important"),rt.style.setProperty("position","static","important")),z.style.setProperty("display","flex","important"),z.style.setProperty("align-items","center","important"),z.style.setProperty("justify-content","space-between","important"),z.style.setProperty("gap","16px","important"),z.style.setProperty("max-width","100%","important"),z.style.setProperty("box-sizing","border-box","important"),z.style.setProperty("overflow","hidden","important"),z.dataset.urpppNoticeDone="1";return}let G=H[0],Z=Array.from(G.querySelectorAll(":scope > span"));if(Z.length<2){let V=G.querySelector("a"),rt=F(G.textContent),nt=rt.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);if(V||nt){z.classList.add("urppp-notice-row");let Q=f.createElement("div");Q.className="urppp-notice-card urppp-notice-card-row";let ct=f.createElement("div");if(ct.className="urppp-notice-main",V){V.classList.add("urppp-notice-link");let tt=V.getAttribute("href"),ut=V.getAttribute("onclick"),ht=F(V.textContent);V.textContent=ht,tt!=null&&V.setAttribute("href",tt),ut!=null&&V.setAttribute("onclick",ut),V.style.setProperty("pointer-events","auto","important"),V.style.setProperty("cursor","pointer","important"),ct.appendChild(V),z.dataset.urpppNoticeClickBound!=="1"&&(z.dataset.urpppNoticeClickBound="1",z.style.setProperty("cursor","pointer","important"),z.addEventListener("click",X=>{if(!(X.target&&X.target.closest&&X.target.closest("a,button,input,select"))){if(V.getAttribute("onclick")||!V.getAttribute("href")||V.getAttribute("href")==="#"){V.click();return}v.location.href=V.getAttribute("href")}}))}else{let tt=f.createElement("div");tt.className="urppp-notice-title",tt.textContent=nt?rt.replace(nt[0],"").trim():rt,ct.appendChild(tt)}if(Q.appendChild(ct),nt){let tt=f.createElement("div");tt.className="urppp-notice-meta";let ut=f.createElement("span");ut.className="urppp-notice-time",ut.textContent=nt[1],tt.appendChild(ut),Q.appendChild(tt)}G.innerHTML="",G.appendChild(Q),G.dataset.urpppNoticeDone="1",z.dataset.urpppNoticeDone="1"}return}let W=null,et=null,it=[];if(Z.forEach(V=>{let rt=(V.getAttribute("style")||"")+" "+(V.style.cssText||""),nt=F(V.textContent);if(nt){if(/font-size\s*:\s*18/i.test(rt)||!W&&/font-size\s*:\s*1[6-9]/i.test(rt)){W=V;return}if(/font-size\s*:\s*12/i.test(rt)||/float\s*:\s*right/i.test(rt)||/^\d{4}-\d{2}-\d{2}/.test(nt)){et=V;return}it.push(V)}}),W||(W=Z[0]),!et){let V=Z[Z.length-1];V!==W&&(et=V)}let ft=f.createElement("div");if(ft.className="urppp-notice-card",W){let V=f.createElement("div");V.className="urppp-notice-title",V.textContent=F(W.textContent),ft.appendChild(V)}if((it.length?it:Z.filter(V=>V!==W&&V!==et)).forEach(V=>{let rt=f.createElement("div");rt.className="urppp-notice-body",rt.textContent=F(V.textContent),rt.textContent&&ft.appendChild(rt)}),et){let V=f.createElement("div");V.className="urppp-notice-meta";let rt=f.createElement("span");rt.className="urppp-notice-time",rt.textContent=F(et.textContent),V.appendChild(rt),ft.appendChild(V)}G.innerHTML="",G.appendChild(ft),G.dataset.urpppNoticeDone="1",z.dataset.urpppNoticeDone="1",z.classList.add("urppp-notice-row")})})}catch(b){T.warn("[URP++] notice table beautify failed",b)}}return e(S,"beautifyNoticeTables"),{beautifyNoticeTables:S}}e(ep,"createNoticeTableBeautifier");var ap={"page-content-template":"urppp-pdf-page",mycoursetable:"urppp-pdf-mycoursetable",courseTable:"urppp-pdf-courseTable",courseTableBody:"urppp-pdf-courseTableBody",h4_id1:"urppp-pdf-h4-1",h4_id2:"urppp-pdf-h4-2",infoTable:"urppp-pdf-info-table","rwskxxbg-course":"urppp-pdf-rwskxxbg","other-course":"urppp-pdf-other-course",temp_title:"urppp-pdf-temp-title",temp_subtitle:"urppp-pdf-temp-subtitle"};function nl(n){return n.querySelectorAll('script, iframe, object, embed, [id^="urppp-"], [data-urppp]').forEach(o=>o.remove()),[n,...n.querySelectorAll("*")].forEach(o=>{Array.from(o.classList||[]).forEach(l=>{/^urppp(?:-|$)/.test(l)&&o.classList.remove(l)}),Array.from(o.attributes||[]).forEach(l=>{/^data-urppp(?:-|$)/.test(l.name)&&o.removeAttribute(l.name)}),o.style&&Array.from(o.style).forEach(l=>{o.style.getPropertyPriority(l)==="important"&&o.style.removeProperty(l)})}),n}e(nl,"sanitizeNativePdfClone");function pl(n){return[n,...n.querySelectorAll("*")].forEach(o=>{o.id&&ap[o.id]&&(o.id=ap[o.id]),o.classList.contains("class_div")&&(o.classList.remove("class_div"),o.classList.remove("box_font"),o.classList.add("urppp-pdf-card")),o.classList.contains("course")&&(o.classList.remove("course"),o.classList.add("urppp-pdf-course"))}),n}e(pl,"renameNativePdfClone");function il(){let n=[];document.querySelectorAll('style[id^="urppp-"]').forEach(d=>{d.sheet&&!d.sheet.disabled&&(n.push(d),d.sheet.disabled=!0)});let o=0,l=document.getElementById("mycoursetable");return l&&(o=l.getBoundingClientRect().width),n.forEach(d=>{d.sheet.disabled=!1}),o}e(il,"measureNativeScheduleWidth");var sl=`
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
`;function ll(n){n.querySelectorAll("td, th").forEach(o=>{o.style.removeProperty("background"),o.style.removeProperty("background-color")}),n.querySelectorAll("th[rowspan]").forEach(o=>{o.style.removeProperty("width"),o.style.setProperty("white-space","nowrap"),o.style.setProperty("text-align","center")}),n.querySelectorAll("table").forEach(o=>{o.style.setProperty("background","#ffffff","important"),o.style.setProperty("background-color","#ffffff","important"),o.style.setProperty("border","none","important"),o.style.setProperty("color","#000000","important")}),n.querySelectorAll("th").forEach(o=>{if(o.style.setProperty("color","#000000","important"),o.style.setProperty("border","1px solid #dddddd","important"),o.style.setProperty("font-weight","normal","important"),o.childNodes.length===1&&o.firstChild&&o.firstChild.nodeType===3){let l=document.createElement("span");l.textContent=o.textContent,o.textContent="",o.appendChild(l)}}),n.querySelectorAll("thead th").forEach(o=>{o.style.setProperty("background","#dddddd","important"),o.style.setProperty("background-color","#dddddd","important")}),n.querySelectorAll("tbody th").forEach(o=>{o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important")}),n.querySelectorAll("td").forEach(o=>{o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important"),o.style.setProperty("color","#000000","important"),o.style.setProperty("border","1px solid #dddddd","important")})}e(ll,"normalizeNativePdfStage");function op(n){let o=il(),l=document.createElement("div");l.id="urppp-pdf-stage",l.style.cssText="position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;width:"+(o||window.innerWidth||1440)+"px;";let d=document.createElement("div");d.id="urppp-pdf-page",d.style.cssText="position:relative;width:100%;box-sizing:border-box;";let u=n.cloneNode(!0);nl(u),pl(u),d.appendChild(u),l.appendChild(d),ll(u);let y=document.createElement("style");y.id="urppp-pdf-reset-style",y.textContent=sl,document.head.appendChild(y),document.body.appendChild(l);let P=l.querySelector("#urppp-pdf-mycoursetable"),C=l.querySelector("#urppp-pdf-page")||l;if(!P)throw l.remove(),new Error("无法建立原生课表捕获节点");return{stage:l,target:P,page:C,sourceHost:n}}e(op,"cloneNativePdfStage");var Ue=0;function lr(){return Ue>0}e(lr,"isNativePdfIsolationActive");function cl(n){return!n||n.tagName!=="STYLE"?!1:/^urppp(?:-|$)/.test(n.id||"")||n.hasAttribute("data-urppp-style")?!0:(n.textContent||"").includes("urppp-")}e(cl,"isUrpppOwnedStyle");function np(){try{if(typeof unsafeWindow<"u"&&unsafeWindow)return unsafeWindow}catch{}return typeof window<"u"?window:null}e(np,"defaultPage");function pp(n,o){let l=n&&typeof n.requestAnimationFrame=="function"?n.requestAnimationFrame.bind(n):typeof requestAnimationFrame=="function"?requestAnimationFrame:null;return l?l(o):setTimeout(o,0)}e(pp,"scheduleFrame");function dl(n={}){let o=n.document||(typeof document<"u"?document:null),l=n.page||np();if(!o)throw new Error("原生 PDF 隔离缺少 document");let d=o.getElementById("mycoursetable");if(!d)throw new Error("当前页面没有课表节点");Ue+=1;let u=[d,...d.querySelectorAll("*")],y=[],P=o.getElementById("soliderbox");P&&y.push(P);let C=d.parentElement;for(;C&&C!==o.documentElement;){let g=C.classList;(C.id==="page-content-template"||g&&(g.contains("page-content")||g.contains("profile-info-row")||g.contains("profile-info-value")))&&y.push(C),C=C.parentElement}let x=o.getElementById("page-content-template")||o.querySelector(".page-content");x&&!y.includes(x)&&y.push(x);let A=[...u,...y],f=A.map(g=>({element:g,style:g.getAttribute("style")})),v=Array.from(o.querySelectorAll("style")).filter(cl).map(g=>({style:g,disabled:g.sheet?g.sheet.disabled:!1,media:g.getAttribute("media")})),T=Array.from(d.querySelectorAll('[id^="urppp-"], [data-urppp]')),S=l&&l.divBuild,b=l&&l.__urpppOriginalDivBuild,m=!1,k=e(()=>{m||(m=!0,l&&l.divBuild===b&&typeof S=="function"&&(l.divBuild=S),f.forEach(({element:g,style:_})=>{g.isConnected&&(_===null?g.removeAttribute("style"):g.setAttribute("style",_))}),T.forEach(g=>g.removeAttribute("data-urppp-pdf-hidden")),v.forEach(({style:g,disabled:_,media:q})=>{try{q===null?g.removeAttribute("media"):g.setAttribute("media",q),g.sheet&&(g.sheet.disabled=_)}catch{}}),Ue=Math.max(0,Ue-1),pp(l,()=>{try{typeof n.onAfterRestore=="function"&&n.onAfterRestore()}catch{}}))},"restore");try{return v.forEach(({style:g})=>{try{g.setAttribute("media","not all"),g.sheet&&(g.sheet.disabled=!0)}catch{}}),A.forEach(g=>{!g.style||!g.style.length||Array.from(g.style).forEach(_=>{g.style.getPropertyPriority(_)==="important"&&(_==="height"&&g.matches("td, th")||g.style.removeProperty(_))})}),d.querySelectorAll("td").forEach(g=>{g.style.removeProperty("background"),g.style.removeProperty("background-color")}),x&&x.style.setProperty("position","relative","important"),d.style.setProperty("position","static","important"),d.querySelectorAll("td").forEach(g=>{g.style.setProperty("position","static","important")}),T.forEach(g=>{g.setAttribute("data-urppp-pdf-hidden","1"),g.style.setProperty("display","none","important")}),l&&typeof b=="function"&&(l.divBuild=b),k}catch(g){throw k(),g}}e(dl,"isolateScheduleForNativeExport");function ip(n,o={}){return new Promise((l,d)=>{let u=o.page||np(),y=u&&u.back,P=u&&u.html2canvas;if(!n||typeof y!="function"){d(new Error("教务原生导出依赖未就绪"));return}let C=null;try{C=dl(o)}catch(b){d(b);return}let x=0,A=!1,f=null,v=null,T=e(b=>{if(!A){A=!0,x&&clearTimeout(x),u&&f&&u.back===f&&(u.back=y),v&&u.html2canvas===v&&(u.html2canvas=P);try{C&&C()}catch{}b?d(b):l()}},"settle"),S=e(b=>T(b instanceof Error?b:new Error(String(b))),"fail");typeof P=="function"&&(v=e(function(){let b=P.apply(this,arguments);return b&&typeof b.catch=="function"&&b.catch(S),b},"scopedCanvas"),u.html2canvas=v),f=e(function(){try{return y.apply(this,arguments)}finally{setTimeout(()=>T(),0)}},"wrappedBack"),u.back=f,x=setTimeout(()=>{try{y.call(u)}catch{}S(new Error("原生 PDF 生成超时"))},o.timeoutMs||60*1e3),pp(u,()=>{try{n.click()}catch(b){S(b)}})})}e(ip,"exportNativePdfIsolated");var sp=`.urppp-private-value{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;font-style:inherit!important;line-height:inherit!important;letter-spacing:0!important;color:inherit!important}
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
`;var lp=`      /* 全局 */
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
`;var cp=`/* Personal and resource schedule course cards. Keep table cells and table surfaces untouched. */
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
`;var dp=`.urppp-export-wrap{position:relative!important;display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;margin-left:7px!important;font-weight:400!important;vertical-align:middle!important;white-space:nowrap!important}
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
`;var up=`/* Settings panel shell */
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
#urppp-settings-panel .urppp-store-author{font-size:11px;color:var(--text-secondary,#5b5f69)}
#urppp-settings-panel .urppp-store-repo{background:transparent;border:none;color:var(--primary,#2563eb);font-size:11px;cursor:pointer;padding:0;text-decoration:none}
#urppp-settings-panel .urppp-store-repo:hover{text-decoration:underline}
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

/* 仓库/删除按钮复用 apply 样式后的定位（覆盖 apply 默认 right:12px） */
#urppp-settings-panel .urppp-skin-card > .urppp-skin-apply.urppp-store-repo { right:auto!important; left:12px!important; }
#urppp-settings-panel .urppp-skin-card > .urppp-skin-apply.urppp-store-del { right:78px!important; }

/* 类Apple风格暗色卡兜底（最后声明，确保暗色下深卡，不再白卡） */
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="apple"] {
  background: #1d1d1f !important; color: #f5f5f7 !important; border-color: rgba(255,255,255,.14) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,.5), 0 2px 6px rgba(0,0,0,.3) !important;
}
`;var mp=`      /* 表格美化：业务表格、分页、公告卡片（table-beautify） */
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
`;var bp=`      /* 导航：顶栏、侧栏、面包屑（navigation） */
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
`;var hp=`/* ===== 插件弹窗统一进入动画：淡入+缩放 + 内容逐条浮现 ===== */
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
`;var gp=`      /* 首页重构仪表板（dashboard） */
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
`;var fp=`      /* 成绩分析面板（score-analysis） */
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
`;var xp=`      /* ============================================================
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
`;function yp(){return{open:!1,mobileTab:"home",scoreAnalysisTab:"overview",profile:null,schedule:null,scores:null,catalog:null,occupancy:null,currentBuilding:null,loading:{profile:!1,schedule:!1,scores:!1,room:!1},roomError:"",roomDateOffset:0,selected:{passing:new Set,scheme:new Set},activeSchemeIdx:0,_schemeUserSelected:!1,viewWeek:0,weekLocked:!1,_termWeek:0,_termWeekResolved:!1,uiReady:!1}}e(yp,"createCleanModeState");function vp(n){n.profile=null,n.schedule=null,n.scores=null,n.catalog=null,n.occupancy=null,n._termWeekResolved=!1,n._schemeUserSelected=!1,n._schemeInited=!1}e(vp,"resetCleanModeData");function wp({state:n,deps:o}){async function l(u){if(!u&&n.catalog&&n.catalog.length||n.loading.room)return n.catalog;n.loading.room=!0;try{o.render()}catch{}try{n.catalog=await o.loadClassroomCatalog(),n.roomError=""}catch(y){n.catalog=n.catalog||[],n.roomError=String(y&&y.message||y),console.warn("[URP++] room catalog",y)}finally{n.loading.room=!1;try{o.scheduleRender()}catch{}}return n.catalog}e(l,"ensureRoomCatalogLoaded");async function d(u){u&&vp(n),n.loading.profile=n.loading.schedule=n.loading.scores=!0;try{let y=await o.ensureTermWeekResolved();!n.weekLocked&&y>=1&&(n.viewWeek=y)}catch{}if(o.render(),await Promise.all([(async()=>{try{n.profile&&!u||(n.profile=await o.loadProfile()),o.reconcileProfileAndScores()}catch(y){n.profile={name:"同学",majorPlan:"主修方案",majorGpa:"—",avatar:""},console.warn(y)}finally{n.loading.profile=!1,o.scheduleRender()}})(),(async()=>{try{n.schedule&&!u||(n.schedule=await o.loadSchedule())}catch(y){n.schedule={courses:[],error:String(y&&y.message||y)}}finally{if(n.loading.schedule=!1,!n.weekLocked){let y=o.getCurrentWeekNumber()||o.readRememberedTermWeek();y>=1&&(n.viewWeek=y)}o.scheduleRender()}})(),(async()=>{let y=null;try{n.scores&&!u||(n.scores=await o.loadScores(u)),y=n.scores,o.reconcileProfileAndScores(),y&&!y.error&&!y.evaluationReady&&o.enrichScoresWithEvaluation(y).then(()=>{n.scores===y&&(o.reconcileProfileAndScores(),o.scheduleRender())}).catch(P=>{console.warn("[URP++] attach evaluation",P)})}catch(P){n.scores={passing:[],schemes:[],error:String(P&&P.message||P)}}finally{n.loading.scores=!1,o.scheduleRender()}})()]),o.reconcileProfileAndScores(),!n.weekLocked){let y=o.getCurrentWeekNumber()||o.readRememberedTermWeek();y>=1&&(n.viewWeek=y)}o.scheduleRender()}return e(d,"loadAll"),{ensureRoomCatalogLoaded:l,loadAll:d}}e(wp,"createCleanModeDataLoader");var Vr={autumn:{name:"秋季学期",weeks:20,start:"2026-08-31",end:"2027-02-20",events:[{t:"reg",name:"本科生新生报到",start:"2026-08-24",end:"2026-08-25"},{t:"reg",name:"在校生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"研究生新生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"在校本科补缓考",start:"2026-08-28",end:"2026-08-30"},{t:"term",name:"本科生开学典礼",start:"2026-09-01"},{t:"term",name:"研究生开学典礼",start:"2026-09-04"},{t:"term",name:"在校生正式行课",start:"2026-08-31",end:"2026-09-06"},{t:"holiday",name:"中秋节",start:"2026-09-25"},{t:"holiday",name:"国庆节假期",start:"2026-10-01",end:"2026-10-07"},{t:"sport",name:"校秋季田径运动会",start:"2026-10-23",end:"2026-10-24"},{t:"exam",name:"本科生期末集中考试周",start:"2027-01-04",end:"2027-01-15"},{t:"holiday",name:"寒假",start:"2027-01-18",end:"2027-02-20"},{t:"holiday",name:"春节",start:"2027-02-06"}]},spring:{name:"春季学期",weeks:18,start:"2027-03-01",end:"2027-07-03",events:[{t:"reg",name:"在校生报到",start:"2027-02-25",end:"2027-02-26"},{t:"term",name:"正式行课",start:"2027-03-01",end:"2027-03-07"},{t:"holiday",name:"清明节",start:"2027-04-05"},{t:"holiday",name:"劳动节假期",start:"2027-05-01",end:"2027-05-05"},{t:"holiday",name:"端午节",start:"2027-06-09"},{t:"exam",name:"期末集中考试",start:"2027-06-21",end:"2027-06-27"},{t:"term",name:"毕业典礼",start:"2027-06-25"},{t:"holiday",name:"暑假开始",start:"2027-07-04"}]}},ul={"2026-08-24":"农历七月十二","2026-08-25":"农历七月十三","2026-08-27":"农历七月十五","2026-08-28":"农历七月十六","2026-08-30":"农历七月十八","2026-08-31":"农历七月十九","2026-09-01":"农历七月二十","2026-09-04":"农历七月廿三","2026-09-25":"农历八月十五","2026-10-01":"农历八月廿一","2026-10-07":"农历八月廿七","2026-10-23":"农历九月十四","2026-10-24":"农历九月十五","2027-01-04":"农历冬月廿七","2027-01-15":"农历腊月初八","2027-01-18":"农历腊月十一","2027-02-06":"农历正月初一","2027-02-20":"农历正月十五","2027-02-25":"农历正月二十","2027-02-26":"农历正月廿一","2027-03-01":"农历正月廿四","2027-04-05":"农历二月廿九","2027-05-01":"农历三月廿五","2027-05-05":"农历三月廿九","2027-06-09":"农历五月初五","2027-06-21":"农历五月十七","2027-06-25":"农历五月廿一","2027-06-27":"农历五月廿三","2027-07-03":"农历五月廿九","2027-07-04":"农历六月初一"},be={term:{color:"#44616f",label:"教学/开学"},reg:{color:"#8a74bd",label:"报到"},exam:{color:"#c08a3f",label:"考试周"},holiday:{color:"#d0716a",label:"假期"},sport:{color:"#778e63",label:"运动会"}};function Sp(){let n=new Date,o=e(l=>String(l).padStart(2,"0"),"p");return`${n.getFullYear()}-${o(n.getMonth()+1)}-${o(n.getDate())}`}e(Sp,"calToday");function ja(n,o){return Math.round((Date.parse(o)-Date.parse(n))/864e5)}e(ja,"calDayDiff");function Oa(n,o){let l=ja(Vr[n].start,o);return l<0?0:Math.floor(l/7)+1}e(Oa,"calWeekNo");function Fa(n){return ul[n]||""}e(Fa,"calLunar");function kp(n){return String(n||"").slice(5)}e(kp,"calYY");function ml(n){let o=n||Sp(),[l,d]=o.split("-").map(Number);return d===8&&o>="2026-08-15"||d>=9||d<=2?"autumn":"spring"}e(ml,"calActiveTerm");function Ha(n,o){let l=n&&Vr[n]?n:"autumn",d=Vr[l],u=o||Sp(),y=d.events.map(f=>({e:f,d:ja(u,f.start)})).filter(f=>f.d>=-0).sort((f,v)=>f.d-v.d)[0],P=y?ja(u,y.e.start):null,C=Oa(l,u),x=Math.max(0,Math.min(100,C/d.weeks*100)),A=u>=d.start;return{term:d,termId:l,next:y,daysLeft:P,weekNo:C,progress:x,started:A,today:u}}e(Ha,"calStatus");function _p(n,o){let l=Ha(n,o),d=l.next?be[l.next.e.t].color:"#c9cdd4",u=l.term;return`<button type="button" class="uc-cal-summary" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-s-left">
      <span class="cal-s-count">${l.daysLeft==null?"—":l.daysLeft}</span>
      <span class="cal-s-unit">天后</span>
    </span>
    <span class="cal-s-right">
      <span class="cal-s-wk">${l.started?`第 ${l.weekNo} 周`:"尚未开学"} · ${l.term.name}</span>
      <span class="cal-s-ev"><i style="background:${d}"></i>${l.next?l.next.e.name:"学期已结束"}</span>
      <span class="cal-s-date">${l.next?l.next.e.start+(l.next.e.end&&l.next.e.end!==l.next.e.start?"~"+l.next.e.end.slice(5):""):""}</span>
      <span class="cal-s-prog"><span>本学期进度</span><span>${Math.min(l.weekNo,u.weeks)}/${u.weeks} 周</span></span>
      <span class="cal-s-bar"><i style="width:${l.progress}%"></i></span>
    </span>
  </button>`}e(_p,"calendarSummaryHtml");function Ep(n,o){let l=Ha(n,o);return`<button type="button" class="uc-cal-summary uc-cal-summary-compact" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-c-dot" style="background:${l.next?be[l.next.e.t].color:"#c9cdd4"}"></span>
    <span class="cal-c-count"><b>${l.daysLeft==null?"—":l.daysLeft}</b><em>天后</em></span>
    <span class="cal-c-info">
      <span class="cal-c-name">${l.next?l.next.e.name:"学期已结束"}</span>
      <span class="cal-c-sub">${l.started?`第 ${l.weekNo} 周`:"尚未开学"} · ${l.term.name}</span>
    </span>
    <span class="cal-c-prog"><span class="cal-c-bar"><i style="width:${l.progress}%"></i></span><span class="cal-c-week">本学期进度 ${Math.min(l.weekNo,l.term.weeks)}/${l.term.weeks} 周</span></span>
  </button>`}e(Ep,"calendarSummaryCompactHtml");function Ap(n,o){let l=Ha(n,o),d=l.next?be[l.next.e.t].color:"#c9cdd4",u=l.term,y=Object.keys(Vr).map(v=>`<button type="button" class="cal-term${v===l.termId?" ac":""}" data-cal-term="${v}">${Vr[v].name}</button>`).join(""),P=`<div class="cal-widget">
    <div class="cal-w-left">
      <div class="cal-w-label">下一个事件</div>
      <div class="cal-w-ev"><i style="background:${d}"></i><b>${l.next?l.next.e.name:"学期已结束"}</b></div>
      <div class="cal-w-sub">${l.next?l.next.e.start+(l.next.e.end&&l.next.e.end!==l.next.e.start?" ~ "+l.next.e.end:""):""}${l.next&&Fa(l.next.e.start)?" · "+Fa(l.next.e.start):""}</div>
    </div>
    <div class="cal-w-mid">
      <span class="cal-w-num">${l.daysLeft==null?"—":l.daysLeft}</span><span class="cal-w-unit">天</span>
    </div>
    <div class="cal-w-right">
      <div class="cal-w-wk">${l.started?`第 ${l.weekNo} 周`:"尚未开学"}</div>
      <div class="cal-w-prog">
        <div class="cal-w-prog-lbl"><span>本学期进度</span><span>${Math.min(l.weekNo,u.weeks)} / ${u.weeks} 周</span></div>
        <div class="cal-w-prog-bar"><i style="width:${l.progress}%"></i></div>
      </div>
    </div>
  </div>`,C=u.events.slice().sort((v,T)=>v.start<T.start?-1:1),x={};C.forEach(v=>{(x[v.start.slice(0,7)]=x[v.start.slice(0,7)]||[]).push(v)});let A=e(v=>v===l.today?" cal-today":"","todayFlag"),f=Object.keys(x).map(v=>{let[,T]=v.split("-");return`<div class="cal-mon">
      <div class="cal-mon-label">${Number(T)} 月</div>
      <div class="cal-mon-items">${x[v].map(S=>{let b=be[S.t].color,m=S.end&&S.end!==S.start?"~"+kp(S.end):"",k=Oa(l.termId,S.start)>0?`第 ${Oa(l.termId,S.start)} 周`:"开学前";return`<div class="cal-ev${A(S.start)}">
          <span class="cal-ev-dot" style="background:${b}"></span>
          <span class="cal-ev-date">${kp(S.start)}${m||""}<em>${Fa(S.start)||"&nbsp;"}</em></span>
          <span class="cal-ev-name">${S.name}</span>
          <span class="cal-ev-tag" style="color:${b};background:${b}1a">${be[S.t].label}</span>
          <span class="cal-ev-wk">${k}</span>
        </div>`}).join("")}</div>
    </div>`}).join("");return`<div class="cal-modal-wrap">
    <div class="cal-modal-top">
      <span class="cal-modal-title">校历时间线</span>
      <span class="cal-right"><span class="cal-term-pills">${y}</span><button type="button" class="cal-close" aria-label="关闭">✕</button></span>
    </div>
    ${P}
    <div class="cal-timeline">${f}</div>
  </div>`}e(Ap,"calendarModalHtml");function Cp(n,o){let l=typeof document<"u"?document:null;if(!l)return;Da();let d=n&&Vr[n]?n:ml(o),u=l.createElement("div");u.id="urppp-cal-modal",u.innerHTML=`<div class="cal-overlay"></div>
    <div class="cal-dialog"><div class="cal-body">${Ap(d,o)}</div></div>`,l.documentElement.appendChild(u),setTimeout(()=>u.classList.add("open"),20),u.querySelector(".cal-overlay").addEventListener("click",()=>Da()),u.addEventListener("click",y=>{let P=y.target;if(P&&P.closest&&P.closest(".cal-close")){Da();return}let C=P&&P.closest?P.closest("[data-cal-term]"):null;if(C){let x=u.querySelector(".cal-body");x&&(x.innerHTML=Ap(C.dataset.calTerm,o)),u.querySelectorAll("[data-cal-term]").forEach(A=>A.classList.toggle("ac",A.dataset.calTerm===C.dataset.calTerm))}})}e(Cp,"openCalendarModal");function Da(){let n=typeof document<"u"?document:null;if(!n)return;let o=n.getElementById("urppp-cal-modal");o&&(o.classList.remove("open"),o.classList.add("closing"),setTimeout(()=>{o.remove()},200))}e(Da,"closeCalendarModal");function Pp(n,o){let l=n||(typeof document<"u"?document:null);l&&l.addEventListener("click",d=>{let u=d.target;u&&u.closest&&u.closest("[data-urppp-cal-open]")&&(d.preventDefault(),d.stopPropagation(),Cp())})}e(Pp,"bindCalendarOpen");var Ge=!1;function Ra(){let n=typeof document<"u"?document:null;if(!n||Ge)return Ge;try{let o=n.createElement("style");if(o&&o.id!==void 0){o.id="urppp-cal-style",o.textContent=`
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
  `,o.id="urppp-cal-style";let l=n.head||n.documentElement;l&&l.appendChild(o),Ge=!0}}catch{}return Ge}e(Ra,"ensureCalendarStyle");function zp(){let n=typeof document<"u"?document:null;if(!n)return;let o=n.getElementById("urppp-nav-theme")||n.querySelector("#navbar .navbar-header")||n.getElementById("navbar"),l=n.getElementById("urppp-nav-clean"),d=n.getElementById("urppp-nav-cal");if(!o&&!l)return;let u=l&&l.parentElement||o;d&&d.parentElement===u||(d&&d.remove(),d=n.createElement("button"),d.type="button",d.id="urppp-nav-cal",d.title="校历时间线",d.setAttribute("aria-label","校历时间线"),d.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg><span>校历</span>',Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none",margin:"0 0 0 8px","vertical-align":"middle"}).forEach(([y,P])=>d.style.setProperty(y,P,"important")),d.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),Cp()}),l&&l.parentElement?l.after(d):u&&u.appendChild(d))}e(zp,"mountCalendarButton");function Lp(){let n=typeof document<"u"?document:null;if(!n)return;let o=n.getElementById("urppp-nav-cal");o&&o.remove()}e(Lp,"removeCalendarButton");function qp({state:n,deps:o}){let l=0,d={gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)"};function u(g,_){let q=g||o.summarizeCourses([]);return`<div class="uc-metrics">${[["TotalCredit","总学分",q.totalCredit],["AvgScore","平均成绩",q.avgScore],["AvgGpa","平均绩点",q.avgGpa],["RequiredCredit","必修学分",q.requiredCredit],["RequiredAvg","必修平均",q.requiredAvg],["RequiredGpa","必修绩点",q.requiredGpa]].map(([z,H,F])=>{let G=o.classifyPrivacyLabel(H)||"grade",Z=_&&o.DIRECT_EDIT_LABELS[_+z]?` data-urppp-edit-key="${_+z}"`:"";return`<div class="uc-metric"><em>${H}</em><b data-urppp-private="${G}"${Z}>${F}</b></div>`}).join("")}</div>`}e(u,"metricHtml");function y(){let g=n.scores;if(!g||g.error)return`<div class="uc-sa-empty">${o.escapeHtml(g&&g.error||"暂无成绩数据")}</div>`;let _=null;try{_=o.analyzeScores({scorePack:g,profile:n.profile})}catch{}if(!_||_.empty)return'<div class="uc-sa-empty">暂无可用成绩数据，请先查询成绩后再试。</div>';let q=typeof o.scoreChartLayout=="function"?o.scoreChartLayout():null;return`<div class="uc-sa-charts">
      <div class="uc-sa-chart-card"><h5>学期趋势</h5><div class="uc-sa-chart-scroll">${o.trendChartSvg({trend:_.trend,palette:o.scoreChartPalette||d,layout:q})}</div></div>
      <div class="uc-sa-chart-card"><h5>成绩分段分布</h5><div class="uc-sa-chart-scroll">${o.bandsChartSvg({bands:_.bands,palette:o.scoreChartPalette||d,layout:q})}</div></div>
    </div>
    <div class="uc-sa-more-row"><a class="uc-sa-more" data-href="/student/integratedQuery/scoreQuery/allPassingScores/index?urppp=sa">点击此处跳转到详细分析界面 →</a></div>`}e(y,"analysisHtml");function P(g){let _=!!o.isCleanAnalysisDirect(),q=n.scoreAnalysisTab==="analysis";return _?`<div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
  <div class="uc-bd">
    <div class="uc-sa-pane">${g}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis">${y()}</div>
  </div>`:`<div class="uc-hd uc-hd-tabs" role="tablist">
    <button type="button" class="uc-sa-tab${q?"":" ac"}" data-sa-tab="overview">成绩总览</button>
    <button type="button" class="uc-sa-tab${q?" ac":""}" data-sa-tab="analysis">成绩分析</button>
  </div>
  <div class="uc-bd">
    <div class="uc-sa-pane"${q?" hidden":""}>${g}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis"${q?"":" hidden"}>${y()}</div>
  </div>`}e(P,"scoreSectionHtml");function C(){try{if(window.matchMedia&&window.matchMedia("(max-width:900px)").matches)return 40}catch{}return 56}e(C,"getScheduleRowHeight");function x(g){let _=o.getViewWeekNumber(),q=C(),N=Math.max(q-4,28),z=(g||[]).map(G=>Object.assign({},G,{thisWeek:o.weekBitActive(G.classWeek,_)||!G.classWeek&&String(G.week||"").indexOf(String(_))>=0,span:Math.max(1,G.span||1),color:G.color||o.courseColor(G.name)})),H={};z.forEach(G=>{let Z=G.day+"_"+G.section;(H[Z]||(H[Z]=[])).push(G)});let F=`<div class="uc-week" data-urppp-private="schedule" data-week="${_}" data-row="${q}">`;F+='<div class="uc-week-head"><div class="h"></div>';for(let G=0;G<7;G++)F+=`<div class="h">${o.DAY_NAMES[G]}</div>`;F+='</div><div class="uc-week-body">',F+='<div class="uc-sec-col">';for(let G=1;G<=12;G++)F+=`<div class="s" style="height:${q}px">${G}</div>`;F+="</div>";for(let G=0;G<7;G++){F+=`<div class="uc-day-col" data-day="${G}" style="height:${q*12}px">`;for(let Z=1;Z<=12;Z++)F+=`<div class="uc-grid-cell" data-sec="${Z}" style="top:${(Z-1)*q}px;height:${N}px"></div>`;F+=`<div class="uc-part-line" style="top:${4*q-2}px"></div>`,F+=`<div class="uc-part-line" style="top:${9*q-2}px"></div>`;for(let Z=1;Z<=12;Z++){let W=(H[G+"_"+Z]||[]).slice().sort((ht,X)=>ht.thisWeek!==X.thisWeek?(X.thisWeek?1:0)-(ht.thisWeek?1:0):(X.span||1)-(ht.span||1));if(!W.length)continue;let it=W.filter(ht=>ht.thisWeek)[0]||W[0],ft=W.filter(ht=>ht!==it),V=it.span,rt=(Z-1)*q+1,nt=V*q-6,Q=it.thisWeek?8:2,ct=it.thisWeek?`--uc-course-color:${it.color};top:${rt}px;height:${nt}px;z-index:${Q};background:${it.color}26;border-color:${it.color}80`:`--uc-course-color:${it.color};top:${rt}px;height:${nt}px;z-index:${Q};background:color-mix(in srgb,${it.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`,tt=ft.length?`<span class="uc-badge">+${ft.length}</span>`:"",ut=o.escapeHtml(JSON.stringify({name:it.name,teacher:it.teacher,place:it.place,week:it.week,day:it.day,section:it.section,span:it.span,thisWeek:it.thisWeek,others:ft.map(ht=>({name:ht.name,teacher:ht.teacher,place:ht.place,week:ht.week,thisWeek:ht.thisWeek,section:ht.section,span:ht.span}))}));F+=`<div class="uc-lesson${it.thisWeek?"":" is-fade"}" style="${ct}" data-course='${ut}'>
          <b>${o.escapeHtml(it.name)}</b>
          <i>${o.escapeHtml([it.place,it.week].filter(Boolean).join(" · "))}</i>
          ${tt}
        </div>`}F+="</div>"}return F+="</div></div>",F}e(x,"renderScheduleBoard");function A(){try{if(n.loading&&n.loading.schedule)return"";let g=o.calVacation?o.calVacation():"term";if(g==="term"||o.getViewWeekNumber()!==0)return"";let _={summer:{title:"放暑假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'},winter:{title:"放寒假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>'},springfestival:{title:"春节快乐！",sub:"",svg:'<svg viewBox="0 0 72 72"><rect x="16" y="16" width="40" height="40" rx="7" fill="#b71c1c" stroke="#f5b301" stroke-width="2.4" transform="rotate(45 36 36)"/><path d="M36 16v40M16 36h40" stroke="#f5b301" stroke-width="1" opacity=".5"/><path d="M24 24l24 24M48 24L24 48" stroke="#f5b301" stroke-width="1" opacity=".35"/><text x="36" y="47" text-anchor="middle" font-size="30" font-weight="900" fill="#ffd54f" font-family="Noto Serif SC,STKaiti,KaiTi,serif" transform="rotate(180 36 36)">福</text></svg>',couplet:{scroll:"万象纳祥",right:"望江听雨华西看杏海纳百川享人间烟火",left:"江安漫步眉山泛舟有容乃大过锦绣新年"}}}[g];if(!_)return"";if(g==="springfestival"&&_.couplet){let N=_.couplet;return`<div class="uc-schedule-mask uc-mask-springfestival">
          <span class="uc-mask-scroll">${N.scroll}</span>
          <span class="uc-mask-cl uc-mask-cl-r">${N.right}</span>
          <span class="uc-mask-cl uc-mask-cl-l">${N.left}</span>
          <span class="uc-mask-ico">${_.svg}</span>
          <span class="uc-mask-txt"><b>${_.title}</b></span>
        </div>`}let q=_.sub?`<i>${_.sub}</i>`:"";return`<div class="uc-schedule-mask uc-mask-${g}"><span class="uc-mask-ico">${_.svg}</span><span class="uc-mask-txt"><b>${_.title}</b>${q}</span></div>`}catch{return""}}e(A,"vacationMark");function f(){return`<div class="uc-services">${[{t:"空闲教室",i:"room",a:"room"},{t:"教学评估",i:"eval",h:"/student/teachingEvaluation/newEvaluation/index"},{t:"培养方案",i:"plan",h:"/student/integratedQuery/planCompletion/index"},{t:"补办学生证",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082"},{t:"免修申请",i:"apply",h:"/student/personalManagement/individualApplication/exemptionApplication/index"},{t:"替代课申请",i:"apply",h:"/student/personalManagement/personalApplication/curriculumReplacement/index"},{t:"火车票优惠卡",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083"}].map(_=>`
      <button type="button" class="uc-svc" data-action="${_.a||""}" data-href="${_.h||""}">
        ${o.ico(_.i)}<strong>${_.t}</strong>
      </button>`).join("")}</div>`}e(f,"servicesHtml");function v(){let g=o.personalizedProfile(n.profile||{}),_=n.schedule&&n.schedule.courses||[],q=n.scores&&n.scores.passing&&n.scores.passing[0]||{summary:o.summarizeCourses([])},N=n.scores&&n.scores.schemes||[];n.scores&&n.scores.majorIdx!=null&&n._schemeInited!==!0&&(n.activeSchemeIdx=n.scores.majorIdx||0,n._schemeInited=!0);let z=N[n.activeSchemeIdx]||N[0]||{summary:o.summarizeCourses([]),title:"方案成绩"},H=g.avatar?`<img src="${o.escapeHtml(g.avatar)}" alt="">`:`<span>${o.escapeHtml((g.name||"同")[0])}</span>`,F=n.loading.scores?'<div class="uc-loading">成绩加载中</div>':n.scores&&n.scores.error?`<div class="uc-empty">${o.escapeHtml(n.scores.error)}</div>`:`<div class="uc-score-grid">
            <div class="uc-score-pane" data-score="passing"><h5>全部及格成绩</h5>${u(q.summary,"passing")}</div>
            <div class="uc-score-pane" data-score="scheme"><h5>${o.escapeHtml((z.title||"方案成绩").split(/通过|获得|不通过/)[0].trim()||"方案成绩")}</h5>${u(z.summary,"scheme")}</div>
          </div>`,G=P(F);return`<div class="uc-desktop">
      <div class="uc-col">
        <div class="uc-card uc-profile-card"><div class="uc-bd"><div class="uc-profile">
          <div class="uc-avatar" data-urppp-private="avatar">${H}</div>
          <div>
            <div class="uc-name" data-urppp-private="name">${o.escapeHtml(g.name||"同学")}</div>
            <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${o.escapeHtml(g.majorPlan||"—")}</span></div>
            <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${o.escapeHtml(String(g.majorGpa||"—"))}</span></div>
          </div>
        </div>${(()=>{try{return _p()}catch{return""}})()}</div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${o.getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${_.length?_.length+" 课次":n.schedule&&n.schedule.error||""}</span>
            </div>
          </div>
          <div class="uc-bd"><div class="uc-schedule-wrap">${n.loading.schedule?'<div class="uc-loading">课表加载中</div>':_.length?x(_):`<div class="uc-empty">${o.escapeHtml(n.schedule&&n.schedule.error||"暂无课表数据")}</div>`}${A()}</div></div>
        </div>
      </div>
      <div class="uc-col">
        <div class="uc-card">
          ${G}
        </div>
        <div class="uc-card services">
          <div class="uc-hd">服务</div>
          <div class="uc-bd">${f()}</div>
        </div>
      </div>
    </div>`}e(v,"renderDesktop");function T(){let g=o.personalizedProfile(n.profile||{}),_=n.schedule&&n.schedule.courses||[],q=n.scores&&n.scores.passing&&n.scores.passing[0]||{summary:o.summarizeCourses([])},N=(n.scores&&n.scores.schemes||[])[n.activeSchemeIdx]||{summary:o.summarizeCourses([])},z=g.avatar?`<img src="${o.escapeHtml(g.avatar)}" alt="">`:`<span>${o.escapeHtml((g.name||"同")[0])}</span>`;if(n.mobileTab==="scores"){let H=`<div class="uc-score-grid uc-score-grid-mobile">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${u(q.summary,"passing")}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${u(N.summary,"scheme")}</div>
      </div>`;return`<div class="uc-mobile"><div class="uc-card">${P(H)}</div></div>`}return n.mobileTab==="room"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${S()}</div></div></div>`:n.mobileTab==="more"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${f()}</div></div></div>`:`<div class="uc-mobile">
      <div class="uc-card uc-profile-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${z}</div>
        <div><div class="uc-name" data-urppp-private="name">${o.escapeHtml(g.name||"同学")}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${o.escapeHtml(g.majorPlan||"—")}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${o.escapeHtml(String(g.majorGpa||"—"))}</span></div></div>
      </div>${(()=>{try{return Ep()}catch{return""}})()}</div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${o.getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd"><div class="uc-schedule-wrap">${n.loading.schedule?'<div class="uc-loading">课表加载中</div>':_.length?x(_):`<div class="uc-empty">${o.escapeHtml(n.schedule&&n.schedule.error||"暂无课表数据")}</div>`}${A()}</div></div></div>
    </div>`}e(T,"renderMobile");function S(){if(n.loading.room)return'<div class="uc-loading">教学楼加载中</div>';let g=n.catalog||[];return g.length?g.slice().sort((q,N)=>(/江安/.test(q.campus)?-1:0)-(/江安/.test(N.campus)?-1:0)).map(q=>`
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${o.escapeHtml(q.campus)}</div>
        <div class="uc-build-grid">
          ${q.buildings.map(N=>`<button type="button" data-build-path="${o.escapeHtml(N.path)}" data-cn="${o.escapeHtml(N.campusNumber||"")}" data-bn="${o.escapeHtml(N.buildingNumber||"")}">${o.escapeHtml(N.name)}</button>`).join("")}
        </div>
      </div>`).join(""):`<div class="uc-empty">${o.escapeHtml(n.roomError||"未读到教学楼列表")}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`}e(S,"roomPickerHtml");function b(g,_){if(!g||!g.rooms||!g.rooms.length)return'<div class="uc-empty">该楼暂无教室占用数据</div>';let q='<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';for(let F=1;F<=12;F++)q+=`<th class="sec">${F}</th>`;q+="</tr>";let N=g.rooms.map(F=>{let G=`<tr><th class="sticky">${o.escapeHtml(F.name)}</th><th class="sticky2">${o.escapeHtml(F.seats)}</th>`;for(let Z=1;Z<=12;Z++){let W=(F.slots||[]).find(et=>et.section===Z)||{busy:!1};if(W.busy){let et=W.reason||W.typeLabel||"占用",it=W.typeLabel||o.occupancyTypeLabel({occupancymoduleId:W.module}),ft=W.displayChar||o.firstContentChar(et)||o.firstContentChar(it)||"占",V=Object.assign({},W.detail||{room:F.name,section:Z,reason:et},{reason:et,typeLabel:it,contentName:W.contentName||W.detail&&W.detail.contentName||""}),rt=o.escapeHtml(JSON.stringify(V));G+=`<td><button type="button" class="uc-slot busy ${o.occupancyKindClass(it)}" data-occ='${rt}' title="${o.escapeHtml(F.name)} 第${Z}节 · ${o.escapeHtml(et)}">${o.escapeHtml(ft)}</button></td>`}else G+=`<td><div class="uc-slot free" title="${o.escapeHtml(F.name)} 第${Z}节 · 空闲"></div></td>`}return G+"</tr>"}).join(""),z=Number(g.dateOffset!=null?g.dateOffset:n.roomDateOffset)||0,H=e((F,G)=>`<button type="button" class="uc-btn${z===F?" primary":""}" data-room-day="${F}">${G}</button>`,"dayBtn");return`
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${o.escapeHtml(_||"")}</div>
          <div class="uc-sub">${o.escapeHtml(g.dateLabel||"")}${g.jxzc?" · 教学第"+g.jxzc+"周":""}</div>
          <div class="uc-room-days">
            ${H(0,"今天")}
            ${H(1,"明天")}
            ${H(2,"后天")}
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
      <div class="uc-occ"><table class="uc-occ-table">${q}${N}</table></div>`}e(b,"occupancyHtml");function m(){let g=o.ensureRoot(),_=g.querySelector("#uc-body");o.getViewWeekNumber();let q=typeof window<"u"&&window.matchMedia?window.matchMedia:null,N=q&&q("(max-width:900px)").matches,z=!n.uiReady;_.innerHTML=N?T():v(),z?(n.uiReady=!0,g.classList.remove("uc-settled"),clearTimeout(g.__ucSettleTimer),g.__ucSettleTimer=setTimeout(()=>{n.open&&g.classList.add("uc-settled")},480)):g.classList.add("uc-settled"),o.bindUI(_),o.applyPersonalDisplay(_)}e(m,"render");function k(){if(!n.open||l)return;let g=e(()=>{l=0,n.open&&m()},"run"),_=typeof requestAnimationFrame=="function"?requestAnimationFrame:null;l=_?_(g):setTimeout(g,0)}return e(k,"scheduleRender"),{analysisHtml:y,metricHtml:u,occupancyHtml:b,render:m,renderScheduleBoard:x,roomPickerHtml:S,scheduleRender:k,scoreSectionHtml:P}}e(qp,"createCleanModeRenderer");function Tp({state:n,deps:o}){function l(v,T){return!v||(v.__urpppCleanUiBindings||(v.__urpppCleanUiBindings=new Set),v.__urpppCleanUiBindings.has(T))?!1:(v.__urpppCleanUiBindings.add(T),!0)}e(l,"markCleanUiBound");function d(v){if(!v)return;try{o.bindScheduleExportHosts(v)}catch(S){console.warn("[URP++] schedule export menu",S)}v.querySelectorAll("[data-score]").forEach(S=>{l(S,"score")&&S.addEventListener("click",()=>C(S.getAttribute("data-score")))}),v.querySelectorAll("[data-sa-tab]").forEach(S=>{l(S,"saTab")&&S.addEventListener("click",()=>{n.scoreAnalysisTab=S.getAttribute("data-sa-tab")==="analysis"?"analysis":"overview",o.render()})}),v.querySelectorAll("[data-href]").forEach(S=>{l(S,"href")&&S.addEventListener("click",b=>{let m=S.getAttribute("data-href");m&&(b.preventDefault(),o.closeCleanMode(),location.href=m)})}),v.querySelectorAll("[data-eval-url]").forEach(S=>{l(S,"eval")&&S.addEventListener("click",b=>{let m=S.getAttribute("data-eval-url");m&&(b.preventDefault(),b.stopPropagation(),o.closeCleanMode(),location.href=m)})}),v.querySelectorAll('[data-action="room"]').forEach(S=>{l(S,"room")&&S.addEventListener("click",()=>x())}),v.querySelectorAll("[data-room-reload]").forEach(S=>{l(S,"roomReload")&&S.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),o.ensureRoomCatalogLoaded(!0)})}),v.querySelectorAll("[data-build-path]").forEach(S=>{l(S,"building")&&S.addEventListener("click",async()=>{let b=S.getAttribute("data-build-path"),m=(S.textContent||"").trim(),k=S.getAttribute("data-cn")||"",g=S.getAttribute("data-bn")||"",_=S.closest("#uc-room-panel")||S.closest("#uc-modal-body")||null;n.roomDateOffset=0,await f({path:b,name:m,campusNumber:k,buildingNumber:g,dateOffset:0},m,_)})}),v.querySelectorAll("[data-room-day]").forEach(S=>{l(S,"roomDay")&&S.addEventListener("click",async b=>{b.preventDefault(),b.stopPropagation();let m=parseInt(S.getAttribute("data-room-day")||"0",10)||0;if(!n.currentBuilding)return;n.roomDateOffset=m;let k=Object.assign({},n.currentBuilding,{dateOffset:m}),g=S.closest("#uc-room-panel")||S.closest("#uc-modal-body")||null;await f(k,k.name||"",g)})});let T=v.querySelector("#uc-room-back");T&&(T.onclick=()=>{n.occupancy=null,n.currentBuilding=null;let S=T.closest("#uc-room-panel")||document.querySelector("#uc-room-panel")||document.querySelector("#uc-modal-body");S&&S.id==="uc-modal-body"||S&&S.id==="uc-room-panel"?(S.innerHTML=o.roomPickerHtml(),d(S)):o.render()}),v.querySelectorAll(".uc-slot.busy[data-occ]").forEach(S=>{l(S,"occupancy")&&S.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();try{let m=JSON.parse(S.getAttribute("data-occ")||"{}");y("占用详情",`
            <div class="uc-occ-detail">
              <div class="uc-name">${o.escapeHtml(m.room||"")}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${o.escapeHtml(String(m.section||m.start||""))}${m.span>1?"-"+(Number(m.start||m.section)+Number(m.span)-1):""}节</div>
              <div class="uc-sub">占用类型：${o.escapeHtml(m.typeLabel||m.reason||"占用")}</div>
              <div class="uc-sub">具体内容：${o.escapeHtml(m.contentName||m.reason||"—")}</div>
              ${m.teacher?`<div class="uc-sub">教师：${o.escapeHtml(m.teacher)}</div>`:""}
              ${m.weeks?`<div class="uc-sub">周次：${o.escapeHtml(m.weeks)}</div>`:""}
              ${m.courseNo?`<div class="uc-sub">课程号：${o.escapeHtml(m.courseNo)}</div>`:""}
            </div>
          `,"",{stack:!0})}catch{}})}),v.querySelectorAll(".uc-lesson[data-course]").forEach(S=>{l(S,"course")&&S.addEventListener("click",b=>{b.stopPropagation();try{let m=JSON.parse(S.getAttribute("data-course")||"{}"),k=`第${m.section||"?"}${m.span>1?"-"+(Number(m.section)+Number(m.span)-1):""}节`,g=(m.others||[]).map(_=>`<div class="uc-course-sub ${_.thisWeek?"":"is-fade"}">
              <div class="uc-cd-name">${o.escapeHtml(_.name||"")}</div>
              <div class="uc-cd-meta">${o.escapeHtml([_.place,_.week,_.teacher].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${_.thisWeek?"当前周有课":"当前周无课"}</div>
            </div>`).join("");y("课程详情",`
            <div class="uc-course-detail">
              <div class="uc-cd-name">${o.escapeHtml(m.name||"")}</div>
              <div class="uc-cd-meta">${o.escapeHtml([m.place,m.teacher,m.week].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${m.thisWeek?"当前周有课":"当前周无课"} · ${o.escapeHtml(k)} · ${o.escapeHtml(o.DAY_NAMES[m.day]||"")}</div>
            </div>
            ${g?'<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>'+g:""}
          `,"")}catch{}})}),v.querySelectorAll("[data-week-delta]").forEach(S=>{l(S,"weekDelta")&&S.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();let m=parseInt(S.getAttribute("data-week-delta")||"0",10)||0,k=n.schedule&&n.schedule.courses||[],g=o.inferMaxWeek(k),_=o.getViewWeekNumber();n.weekLocked=!0,n.viewWeek=Math.min(g,Math.max(1,_+m)),o.render();let q=document.querySelector("#urppp-clean-root .uc-week-label");q&&(q.classList.remove("uc-pop"),q.offsetWidth,q.classList.add("uc-pop"))})}),v.querySelectorAll("[data-week-reset]").forEach(S=>{l(S,"weekReset")&&S.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),n.weekLocked=!1;let m=o.getCurrentWeekNumber()||n._termWeek||1;n.viewWeek=m,o.render();let k=document.querySelector("#urppp-clean-root .uc-week-label");k&&(k.classList.remove("uc-pop"),k.offsetWidth,k.classList.add("uc-pop"))})})}e(d,"bindUI");let u=[];function y(v,T,S,b){b=b||{};let m=o.ensureRoot(),k=m.querySelector("#uc-mask"),g=m.querySelector("#uc-modal");b.stack&&g.classList.contains("open")?u.push({title:m.querySelector("#uc-modal-title").textContent,body:m.querySelector("#uc-modal-body").innerHTML,ft:m.querySelector("#uc-modal-ft").innerHTML}):b.stack||(u.length=0),k.classList.add("open"),g.classList.add("open"),m.querySelector("#uc-modal-title").textContent=v,m.querySelector("#uc-modal-body").innerHTML=T,m.querySelector("#uc-modal-ft").innerHTML=S||"",d(m.querySelector("#uc-modal-body")),d(m.querySelector("#uc-modal-ft")),o.applyPersonalDisplay(m.querySelector("#uc-modal"))}e(y,"openModal");function P(){let v=o.rootEl();if(v){if(u.length){let T=u.pop();v.querySelector("#uc-modal-title").textContent=T.title,v.querySelector("#uc-modal-body").innerHTML=T.body,v.querySelector("#uc-modal-ft").innerHTML=T.ft||"",d(v.querySelector("#uc-modal-body")),d(v.querySelector("#uc-modal-ft"));return}v.querySelector("#uc-mask").classList.remove("open"),v.querySelector("#uc-modal").classList.remove("open")}}e(P,"closeModal");function C(v){let T=n.scores&&n.scores.passing&&n.scores.passing[0]||{courses:[],summary:o.summarizeCourses([])},S=n.scores&&n.scores.schemes||[];v==="scheme"&&n.scores&&n.scores.majorIdx!=null&&n._schemeInited!==!0&&(n.activeSchemeIdx=n.scores.majorIdx||0,n._schemeInited=!0);let b=S[n.activeSchemeIdx]||S[0]||{courses:[],summary:o.summarizeCourses([]),title:"方案成绩"},m=v==="scheme"?b:T,k=v==="scheme"?"scheme":"passing";n.selected[k]||(n.selected[k]=new Set);let g=v==="scheme"&&S.length>1?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${S.map((X,st)=>`<button type="button" class="uc-btn ${st===n.activeSchemeIdx?"primary":""}" data-scheme-idx="${st}"><span data-urppp-private="organization">${o.escapeHtml((X.title||"方案").slice(0,28))}</span></button>`).join("")}</div>`:"",_=e(X=>{let st=!!(X&&(X.unevaluated||o.isUnevaluatedScore(X.score))),wt=o.scoreToNumber(X&&X.score),vt="";st?vt=wt!=null&&wt<60?"uneval-fail":"uneval":wt!=null?vt=wt>=60?"pass":"fail":/不及格|不合格|不通过/.test(String(X&&X.score||""))?vt="fail":X&&X.score&&(vt="pass");let Et=o.escapeHtml(X&&X.score||"—"),I=st?X.evalUrl||"/student/teachingEvaluation/newEvaluation/index":"";return I?`<span class="uc-score-cell ${vt}" data-eval-url="${o.escapeHtml(I)}" title="未评教，点击前往评教">${Et}</span>`:`<span class="uc-score-cell ${vt}">${Et}</span>`},"scoreCellHtml"),q=(m.courses||[]).map((X,st)=>{let wt=n.selected[k].has(st),vt=o.isValidOfficialGpa(X.officialGpa)?X.officialGpa:o.scoreToGpa(X.score),Et=!!(X.unevaluated||o.isUnevaluatedScore(X.score));return`<tr class="${wt?"is-on":""}${Et?" is-uneval":""}" data-idx="${st}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${wt?"✓":""}</span><span class="uc-cname">${o.escapeHtml(X.name)}</span></td>
        <td><span class="uc-attr-pill">${o.escapeHtml(X.attr||"—")}</span></td>
        <td data-urppp-private="credit">${X.credit}</td>
        <td data-urppp-private="grade">${_(X)}</td>
        <td data-urppp-private="gpa">${Et||vt==null?"—":vt}</td>
      </tr>`}).join("");y(v==="scheme"?"方案成绩 · "+(b.title||""):"全部及格成绩",`
      ${g}${o.metricHtml(m.summary,v==="scheme"?"scheme":"passing")}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${q||'<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`,'<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>');let N=document.querySelector("#uc-modal-title");N&&(v==="scheme"?N.setAttribute("data-urppp-private","organization"):N.removeAttribute("data-urppp-private"),o.applyPersonalDisplay(N.parentElement||N));let z=document.querySelector("#uc-modal-body"),H=document.getElementById("uc-calc"),F=document.getElementById("uc-score-table"),G=document.getElementById("uc-score-wrap"),Z=document.getElementById("uc-select-box"),W=e(()=>{F.querySelectorAll("tbody tr[data-idx]").forEach(wt=>{let vt=parseInt(wt.getAttribute("data-idx"),10),Et=n.selected[k].has(vt);wt.classList.toggle("is-on",Et);let I=wt.querySelector(".uc-selmark");I&&(I.textContent=Et?"✓":"")});let X=[];n.selected[k].forEach(wt=>{m.courses[wt]&&X.push(m.courses[wt])});let st=o.summarizeCoursesPreferOfficial(X);H&&(H.className="uc-calc",H.innerHTML=X.length?`已选 <b>${X.length}</b> 门 · 学分 <b data-urppp-private="credit">${st.totalCredit}</b> · 均分 <b data-urppp-private="grade">${st.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${st.avgGpa}</b>`:"已选 0 门")},"paint"),et=e((X,st)=>{st===!0?n.selected[k].add(X):st===!1||n.selected[k].has(X)?n.selected[k].delete(X):n.selected[k].add(X)},"toggleIdx"),it=!1;F.querySelectorAll("tbody tr[data-idx]").forEach(X=>{X.addEventListener("click",st=>{if(it){it=!1;return}let wt=parseInt(X.getAttribute("data-idx"),10);et(wt),W()})});let ft=!1,V=0,rt=0,nt=null,Q=e(()=>Array.from(F.querySelectorAll("tbody tr[data-idx]")),"rowsEls"),ct=e((X,st)=>{if(!Z||!G)return{left:0,top:0,right:0,bottom:0,w:0,h:0};let wt=G.getBoundingClientRect(),vt=Math.min(V,X),Et=Math.min(rt,st),I=Math.max(V,X),U=Math.max(rt,st),K=I-vt,mt=U-Et,dt=vt-wt.left+G.scrollLeft,Pt=Et-wt.top+G.scrollTop;return Z.style.display=K>3||mt>3?"block":"none",Z.style.left=dt+"px",Z.style.top=Pt+"px",Z.style.width=K+"px",Z.style.height=mt+"px",{left:vt,top:Et,right:I,bottom:U,w:K,h:mt}},"placeBox"),tt=e(X=>{if(!ft)return;X.preventDefault();let st=ct(X.clientX,X.clientY);st.w<=3&&st.h<=3||(n.selected[k]=new Set(nt),Q().forEach(wt=>{let vt=wt.getBoundingClientRect();if(!!(vt.right<st.left||vt.left>st.right||vt.bottom<st.top||vt.top>st.bottom))return;let I=parseInt(wt.getAttribute("data-idx"),10);nt.has(I)?n.selected[k].delete(I):n.selected[k].add(I)}),W())},"onMoveSel"),ut=e(X=>{let st=Math.abs(X.clientX-V)>3||Math.abs(X.clientY-rt)>3;ft=!1,Z&&(Z.style.display="none"),document.removeEventListener("mousemove",tt,!0),document.removeEventListener("mouseup",ut,!0),st&&(it=!0),W()},"onUpSel");G.addEventListener("mousedown",X=>{X.button===0&&(ft=!0,V=X.clientX,rt=X.clientY,nt=new Set(n.selected[k]),ct(V,rt),document.addEventListener("mousemove",tt,!0),document.addEventListener("mouseup",ut,!0))}),z.querySelectorAll("[data-scheme-idx]").forEach(X=>X.addEventListener("click",()=>{n.activeSchemeIdx=parseInt(X.getAttribute("data-scheme-idx"),10)||0,n._schemeUserSelected=!0,C("scheme")}));let ht=document.getElementById("uc-clear");ht&&(ht.onclick=()=>{n.selected[k]=new Set,W()}),W()}e(C,"openScoreModal");async function x(){y("空闲教室",'<div class="uc-loading">加载教学楼</div>',"");try{await o.ensureRoomCatalogLoaded(!1),y("空闲教室",o.roomPickerHtml(),'<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>')}catch(v){y("空闲教室",`<div class="uc-empty">${o.escapeHtml(v&&v.message||v)}</div>`,"")}}e(x,"openRoomModal");function A(v){if(v&&v.isConnected)return v;let T=document.querySelector("#uc-room-panel");if(T&&T.offsetParent!==null||T&&n.mobileTab==="room")return T;let S=document.querySelector("#uc-modal-body"),b=document.querySelector("#uc-modal");return b&&b.classList.contains("open")&&S?S:T||S||null}e(A,"getRoomHost");async function f(v,T,S){let b=A(S);if(!b){console.warn("[URP++] no room host");return}b.innerHTML='<div class="uc-loading">加载占用网格</div>';try{let m=await o.loadBuildingOccupancy(v);b.innerHTML='<div class="uc-loading">匹配课程名称</div>';let k=m.planNumber||"";if(!k)try{let q=await o.fetchText("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),N=JSON.parse(q);if(k=N&&(N.zxjxjhh||N.xnxq||N.dateList&&N.dateList[0]&&N.dateList[0].zxjxjhh)||"",!k&&N&&N.xkxx&&N.xkxx[0]){let z=Object.keys(N.xkxx[0]||{}),H=z.length?N.xkxx[0][z[0]]:null;k=H&&(H.zxjxjhh||H.executiveEducationPlanNumber)||""}}catch{}k||(k="2025-2026-2-1"),m.planNumber=k;try{m=await o.enrichOccupancyWithCurriculum(m,typeof v=="object"?v:{},k)}catch(q){console.warn("[URP++] enrich occupancy",q)}n.occupancy=m,n.roomDateOffset=Number(m.dateOffset!=null?m.dateOffset:n.roomDateOffset)||0;let g=typeof v=="object"?v:{path:v,name:T};n.currentBuilding=Object.assign({},g,{name:T||g.name||"",dateOffset:n.roomDateOffset}),T=T||v&&v.name||"";let _=A(b)||b;_.innerHTML=o.occupancyHtml(m,T),d(_)}catch(m){let k=A(b)||b;k&&(k.innerHTML=`<div class="uc-empty">${o.escapeHtml(m&&m.message||m)}</div>`)}}return e(f,"showBuilding"),{bindUI:d,closeModal:P,getRoomHost:A,openModal:y,openRoomModal:x,openScoreModal:C,showBuilding:f}}e(Tp,"createCleanModeUI");function Mp({state:n,deps:o}){function l(){return document.getElementById("urppp-clean-root")}e(l,"rootEl");function d(){o.ensureStyle();let x=l();if(x)return x;x=document.createElement("div"),x.id="urppp-clean-root",x.innerHTML=`
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
      </div>`,document.documentElement.appendChild(x),x.querySelector("#uc-exit").onclick=y,x.querySelector("#uc-refresh").onclick=()=>u(!0),x.querySelector("#uc-mask").onclick=o.closeModal,x.querySelector("#uc-modal-close").onclick=o.closeModal;let A=e(()=>{o.syncThemeDotGroup(x.querySelector("#uc-top-theme"))},"syncCleanThemeDots");x.querySelectorAll("#uc-top-theme .urppp-nav-dot[data-theme]").forEach(k=>{k.addEventListener("click",()=>{o.handleThemeDotClick(k.dataset.theme),A();try{o.syncNavbarThemeUI()}catch{}try{o.syncSettingsPanelUI()}catch{}})});let f=x.querySelector("#uc-settings");f&&f.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();try{o.openSettingsPanel()}catch{}});let v=x.querySelector("#uc-menu-toggle"),T=e(k=>{k.classList.remove("urppp-clean-sidebar");let g=k.__urpppCleanInline;if(g){let q=k.style,N=e((z,H)=>{let F=g[H];F&&F.v?q.setProperty(z,F.v,F.p||""):q.removeProperty(z)},"restore");N("top","top"),N("height","height"),N("z-index","z"),N("position","pos"),N("transform","transform"),N("visibility","vis"),N("pointer-events","pe"),N("transition","transition"),delete k.__urpppCleanInline}let _=k.__urpppCleanOrigin;_&&_.parent&&k.parentElement!==_.parent&&(_.next&&_.next.parentElement===_.parent?_.parent.insertBefore(k,_.next):_.parent.appendChild(k)),delete k.__urpppCleanOrigin},"restoreCleanSidebarInline"),S=e(()=>{let k=document.getElementById("sidebar");if(k)if(n.open){if(k.classList.add("urppp-clean-sidebar"),!k.__urpppCleanInline){let H=k.style,F=e(G=>({v:H.getPropertyValue(G),p:H.getPropertyPriority(G)}),"grab");k.__urpppCleanInline={top:F("top"),height:F("height"),z:F("z-index"),pos:F("position"),transform:F("transform"),vis:F("visibility"),pe:F("pointer-events"),transition:F("transition")},k.__urpppCleanOrigin={parent:k.parentElement,next:k.nextSibling}}if(k.parentElement!==x){let H=x.querySelector(".uc-shell");x.insertBefore(k,H||null)}let g=x.getBoundingClientRect(),_=x.querySelector(".uc-top"),q=_?_.getBoundingClientRect():null,N=Math.max(44,Math.round(q?q.bottom-g.top:60)),z=Math.max(0,Math.round(g.height-N));k.style.setProperty("top",N+"px","important"),k.style.setProperty("height",z+"px","important"),k.style.setProperty("z-index","12030","important"),k.style.setProperty("position","fixed","important")}else T(k)},"syncCleanSidebarZ"),b=e(()=>{let k=document.getElementById("sidebar");if(!k)return;try{o.stopDrawerAnimation(k)}catch{}k.classList.remove("display","urppp-drawer-closing"),T(k),v&&(v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label","打开菜单"));let g=document.getElementById("urppp-mobile-menu-button");g&&(g.setAttribute("aria-expanded","false"),g.setAttribute("aria-label","打开菜单"))},"closeCleanSidebar");v&&v.addEventListener("click",k=>{k.preventDefault(),k.stopImmediatePropagation();let g=document.getElementById("sidebar");if(!g)return;g.__urpppCleanMenuBound||(g.__urpppCleanMenuBound=!0,g.addEventListener("click",N=>{if(!n.open)return;let z=N.target&&N.target.closest?N.target.closest("a[href]"):null;if(!z||z.closest("#urppp-mobile-search-panel"))return;let H=String(z.getAttribute("href")||"").trim();if(z.closest("#urppp-mobile-quick, #urppp-mobile-user")){if(!H||H==="#"||H.startsWith("javascript")||z.target==="_blank"||/^https?:\/\//i.test(H))return;y();return}!H||H==="#"||H.startsWith("javascript")||z.target==="_blank"||/^https?:\/\//i.test(H)||y()},!0));let _=!g.classList.contains("display");S(),o.setDrawerOpen(g,v,_);let q=document.getElementById("urppp-mobile-menu-button");q&&(q.setAttribute("aria-expanded",_?"true":"false"),q.setAttribute("aria-label",_?"关闭菜单":"打开菜单"))}),x.__closeCleanDrawer=b,x.__syncCleanSidebarZ=S,x.__syncCleanThemeDots=A;let m=globalThis.ResizeObserver;if(typeof m=="function"){let k=new m(()=>{n.open&&S()});k.observe(x);let g=x.querySelector(".uc-top");g&&k.observe(g),x.__cleanSidebarResizeObserver=k}try{let k=window.matchMedia&&window.matchMedia("(max-width: 900px)");if(k){let g=e(()=>{n.open&&(S(),o.render())},"onLayoutChange");typeof k.addEventListener=="function"?k.addEventListener("change",g):typeof k.addListener=="function"&&k.addListener(g),x.__scoreLayoutMedia=k,x.__scoreLayoutChange=g}}catch{}try{o.applySkinAttr()}catch{}return A(),x.querySelectorAll("#uc-tabbar button").forEach(k=>{k.onclick=()=>{n.mobileTab=k.dataset.tab,x.querySelectorAll("#uc-tabbar button").forEach(g=>g.classList.toggle("ac",g===k)),o.render(),n.mobileTab==="room"&&o.ensureRoomCatalogLoaded()}}),Ra(),Pp(x),x}e(d,"ensureRoot");function u(x){d();let A=n.open;n.open=!0,n.uiReady=!1,n.weekLocked=!1;let f=o.getCurrentWeekNumber()||o.readRememberedTermWeek();n.viewWeek=f>=1?f:n.viewWeek>=1?n.viewWeek:0,document.documentElement.classList.add("urppp-clean-lock",o.CLEAN_FLAG);let v=l();v.classList.remove("closing"),A||(v.classList.remove("uc-settled","open"),v.offsetWidth,v.classList.add("open"));try{o.stopDrawerAnimation(document.getElementById("sidebar"))}catch{}try{v.__syncCleanThemeDots&&v.__syncCleanThemeDots()}catch{}try{v.__syncCleanSidebarZ&&v.__syncCleanSidebarZ()}catch{}try{o.injectCleanSidebarSections(document.getElementById("sidebar"))}catch{}o.loadAll(!!x);try{o.ensureRoomCatalogLoaded()}catch{}}e(u,"openCleanMode");function y(){n.open=!1,n.uiReady=!1,o.closeModal(),document.documentElement.classList.remove("urppp-clean-lock",o.CLEAN_FLAG);let x=l();if(x){x.classList.remove("open","uc-settled","uc-drawer-open"),x.classList.add("closing"),clearTimeout(x.__ucSettleTimer);try{x.__closeCleanDrawer&&x.__closeCleanDrawer()}catch{}setTimeout(()=>{x.classList.remove("closing")},360)}try{o.refreshMobileNavbar()}catch{}}e(y,"closeCleanMode");function P(){try{o.ensureStyle();let x=document.getElementById("urppp-nav-clean");if(!o.isHomePage()){x&&x.remove(),Lp();return}let A=document.getElementById("urppp-nav-theme")||document.querySelector("#navbar .navbar-header")||document.querySelector("#navbar");if(!A)return;x||(x=document.createElement("button"),x.type="button",x.id="urppp-nav-clean",x.title="清爽模式",x.innerHTML=`${o.ico("clean")}<span>清爽</span>`,x.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),u(!1)}),A.appendChild(x)),Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none"}).forEach(([f,v])=>x.style.setProperty(f,v,"important")),Ra();try{zp()}catch{}}catch(x){console.warn("[URP++] clean entry",x)}}return e(P,"injectCleanEntry"),{cleanModeApi:{open:u,close:y,inject:P,refresh:o.refreshCleanPersonalDisplay,refreshRender:e(()=>{try{o.render()}catch{}},"refreshRender"),scoreToGpa:o.scoreToGpa,summarizeCourses:o.summarizeCourses},closeCleanMode:y,ensureRoot:d,injectCleanEntry:P,openCleanMode:u,rootEl:l}}e(Mp,"createCleanModeController");function gr(n){return Math.round((Number(n)||0)*100)/100}e(gr,"round2");var bl=[{key:"a",level:"A",range:"90-100",gpa:4,min:90,max:100},{key:"am",level:"A-",range:"85-89",gpa:3.7,min:85,max:89.999},{key:"bp",level:"B+",range:"82-84",gpa:3.3,min:82,max:84.999},{key:"b",level:"B",range:"78-81",gpa:3,min:78,max:81.999},{key:"bm",level:"B-",range:"75-77",gpa:2.7,min:75,max:77.999},{key:"cp",level:"C+",range:"72-74",gpa:2.3,min:72,max:74.999},{key:"c",level:"C",range:"68-71",gpa:2,min:68,max:71.999},{key:"cm",level:"C-",range:"64-67",gpa:1.7,min:64,max:67.999},{key:"dp",level:"D+",range:"60-63",gpa:1.3,min:60,max:63.999},{key:"d",level:"D",range:"60-62",gpa:1,min:60,max:62.999},{key:"f",level:"F",range:"<60",gpa:0,min:0,max:59.999}],Ip={优秀:95,"A+":98,A:95,"A-":87,良好:85,"B+":83,B:79,"B-":76,中等:73,"C+":73,C:69,"C-":65,及格:62,"D+":62,D:60,不及格:50,F:50},hl=[{key:"required",label:"必修",test:e(n=>/必修/.test(n),"test")},{key:"elective",label:"任选",test:e(n=>/任选/.test(n),"test")},{key:"optional",label:"选修",test:e(n=>/选修/.test(n),"test")},{key:"other",label:"其他",test:e(()=>!0,"test")}];function $p(n){let o=String(n||"").match(/^(\d{4})-(\d{4})-(\d+)/);return o?`${o[1].slice(2)}-${o[2].slice(2)}-${o[3]}`:String(n||"")}e($p,"shortTerm");function Je({deps:n}){let o=n.scoreToNumber,l=n.scoreToGpa;function d(b){let m=o(b);if(m!=null)return m;let k=String(b||"").trim().toUpperCase();return Ip[k]!=null?Ip[k]:null}e(d,"scoreToNumberWithLevels");function u(b){return!b||b.unevaluated?!1:d(b.score)!=null}e(u,"hasScore");function y(b){let m=String(b||"").match(/^(\d{4})-(\d{4})-(\d+)/);return m?[Number(m[1]),Number(m[3])]:[9999,9999]}e(y,"termOrderKey");function P(b){let m=b&&b.passing&&b.passing[0];return m&&m.courses||[]}e(P,"allCourses");function C(b){let m=b&&b.officialGpa,k=Number(m);return m!=null&&Number.isFinite(k)&&k>=0&&k<=5?k:null}e(C,"officialGpa");function x(b){let m=C(b);return m??l(b.score)}e(x,"courseGpa");function A({scorePack:b,profile:m}){let k=P(b),g=m&&m.majorGpa?String(m.majorGpa).trim():"",_=0,q=0,N=0,z=0,H=0,F=0;return k.forEach(G=>{if(!u(G))return;let Z=Number(G.credit)||0,W=d(G.score);if(W==null||Z<=0)return;_+=Z,q+=W*Z;let et=x(G);et!=null&&(N+=et*Z,z+=Z,G.required&&(H+=et*Z,F+=Z))}),{majorGpa:g,requiredGpa:gr(F?H/F:0),avgGpa:gr(z?N/z:0),avgScore:gr(_?q/_:0),totalCredit:gr(_),courseCount:k.length}}e(A,"computeMetrics");function f(b){let m=new Map;return(b||[]).forEach(k=>{if(!u(k))return;let g=k.term||"未分组",_=m.get(g);_||(_={term:g,count:0,credit:0,scoreW:0,gpaW:0,gpaCredit:0},m.set(g,_));let q=Number(k.credit)||0,N=d(k.score);if(N==null||(_.count+=1,q<=0))return;_.credit+=q,_.scoreW+=N*q;let z=x(k);z!=null&&(_.gpaW+=z*q,_.gpaCredit+=q)}),Array.from(m.values()).map(k=>({term:k.term,label:$p(k.term),count:k.count,credit:gr(k.credit),avgScore:gr(k.credit?k.scoreW/k.credit:0),avgGpa:gr(k.gpaCredit?k.gpaW/k.gpaCredit:0)})).sort((k,g)=>{let _=y(k.term),q=y(g.term);return _[0]-q[0]||_[1]-q[1]})}e(f,"computeTrend");function v(b){let m=bl.map(g=>({...g,count:0,credit:0}));(b||[]).forEach(g=>{if(!u(g))return;let _=d(g.score);if(_==null)return;let q=m.find(N=>_>=N.min&&_<=N.max);q&&(q.count+=1,q.credit+=Number(g.credit)||0)});let k=m.reduce((g,_)=>Math.max(g,_.count),1);return m.map(g=>({...g,ratio:Math.round(g.count/k*100)}))}e(v,"computeBands");function T(b){let m=hl.map(q=>({...q,credit:0,count:0}));(b||[]).forEach(q=>{if(!u(q))return;let N=String(q.attr||""),z=m.find(H=>H.test(N));z&&(z.credit+=Number(q.credit)||0,z.count+=1)});let k=m.reduce((q,N)=>q+N.credit,0)||1,g=m.filter(q=>q.count>0).map(q=>({key:q.key,label:q.label,credit:gr(q.credit),count:q.count,ratio:Math.round(q.credit/k*100)})),_=g.find(q=>q.key==="required");return{items:g,requiredCredit:_?_.credit:0,requiredRatio:_?_.ratio:0}}e(T,"computeShare");function S({scorePack:b,profile:m}){let k=P(b);return{metrics:A({scorePack:b,profile:m}),trend:f(k),bands:v(k),share:T(k),empty:k.length===0}}return e(S,"analyzeScores"),{analyzeScores:S,hasScore:u,officialGpa:C,scoreToNumberWithLevels:d,shortTerm:$p}}e(Je,"createScoreAnalysisData");var ar="var(--text-secondary)",Ua="var(--border)";function or(n){return At(String(n??""))}e(or,"escapeLabel");function Np(n,o,l){let d=!!(n&&n.variant==="mobile");if(o==="trend"){if(!d)return{mobile:d,width:920,height:330,pad:{top:36,right:30,bottom:46,left:30}};let P={top:58,right:20,bottom:44,left:20},C=Math.max(56,Number(n&&n.slotWidth)||72);return{mobile:d,width:Math.max(300,P.left+P.right+Math.max(1,l)*C),height:286,pad:P}}if(!d)return{mobile:d,width:660,height:236,pad:{top:28,right:14,bottom:44,left:14}};let u={top:28,right:14,bottom:44,left:14},y=Math.max(44,Number(n&&n.slotWidth)||48);return{mobile:d,width:Math.max(320,u.left+u.right+Math.max(1,l)*y),height:236,pad:u}}e(Np,"resolveChartLayout");function Wa({width:n,height:o,mobile:l,kind:d,label:u}){let y=l?` data-urppp-chart-layout="mobile" style="width:max(100%,${n}px);max-width:none;height:auto"`:"";return`<svg viewBox="0 0 ${n} ${o}" class="urppp-sa-chart" role="img" aria-label="${u}" data-urppp-chart-kind="${d}"${y}>`}e(Wa,"openSvg");function Ve({trend:n,palette:o,layout:l}){let d=(n||[]).filter(tt=>tt&&tt.avgScore!=null),u=Np(l,"trend",d.length),{width:y,height:P,pad:C,mobile:x}=u,A=y-C.left-C.right,f=P-C.top-C.bottom;if(!d.length)return`${Wa({...u,kind:"trend",label:"学期成绩趋势"})}</svg>`;let v=d.length,T=e(tt=>C.left+(tt+.5)*(A/v),"xAt"),S=d.map(tt=>Number(tt.avgGpa)||0),b=d.map(tt=>Number(tt.avgScore)||0),m=d.map(tt=>Number(tt.credit)||0),k=Math.max(0,Math.min(...S)-.2),g=Math.min(5,Math.max(...S)+.2),_=Math.max(0,Math.min(...b)-4),q=Math.min(100,Math.max(...b)+4),N=Math.max(1,...m),z=g-k||1,H=q-_||1,F=e(tt=>C.top+f-(tt-k)/z*f,"yGpa"),G=e(tt=>C.top+f-(tt-_)/H*f,"yScore"),Z=e(tt=>C.top+f-tt/N*f*.9,"yCredit"),W=d.map((tt,ut)=>`${T(ut)},${F(tt.avgGpa)}`).join(" "),et=d.map((tt,ut)=>`${T(ut)},${G(tt.avgScore)}`).join(" "),it=[0,.25,.5,.75,1].map(tt=>{let ut=C.top+f-tt*f;return`<line x1="${C.left}" y1="${ut.toFixed(1)}" x2="${y-C.right}" y2="${ut.toFixed(1)}" stroke="${Ua}" stroke-width="1" stroke-dasharray="3 4"/>`}).join(""),ft=d.map((tt,ut)=>{let ht=T(ut),X=x?Math.min(30,A/v*.42):Math.min(26,A/v*.32),st=Z(tt.credit);return`<rect x="${(ht-X/2).toFixed(1)}" y="${st.toFixed(1)}" width="${X.toFixed(1)}" height="${(C.top+f-st).toFixed(1)}" rx="3" fill="${o.credit}" opacity="0.55"/>
<text x="${ht.toFixed(1)}" y="${(st-4).toFixed(1)}" text-anchor="middle" font-size="12" fill="${ar}">${or(tt.credit)}</text>`}).join(""),V=d.map((tt,ut)=>`<text x="${T(ut).toFixed(1)}" y="${P-16}" text-anchor="middle" font-size="12" fill="${ar}">${or(tt.label)}</text>`).join(""),rt=d.map((tt,ut)=>{let ht=A/v,X=T(ut)-ht/2,st=[`学期 ${tt.label}`,`课程 ${tt.count} 门`,`修读学分 ${tt.credit}`,`加权均分 ${tt.avgScore}`,`平均绩点 ${tt.avgGpa}`].join(`
`);return`<rect class="urppp-sa-hover" x="${X.toFixed(1)}" y="${C.top}" width="${ht.toFixed(1)}" height="${f.toFixed(1)}" fill="transparent"><title>${or(st)}</title></rect>`}).join(""),nt=d.map((tt,ut)=>`<circle cx="${T(ut).toFixed(1)}" cy="${F(tt.avgGpa).toFixed(1)}" r="3.5" fill="${o.gpaLine}"/><text x="${T(ut).toFixed(1)}" y="${(F(tt.avgGpa)-9).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${o.gpaLine}">${or(tt.avgGpa)}</text>`).join(""),Q=d.map((tt,ut)=>`<circle cx="${T(ut).toFixed(1)}" cy="${G(tt.avgScore).toFixed(1)}" r="3" fill="${o.scoreLine}"/><text x="${T(ut).toFixed(1)}" y="${(G(tt.avgScore)+17).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="${o.scoreLine}">${or(tt.avgScore)}</text>`).join(""),ct=x?`<g font-size="12">
  <rect x="${C.left}" y="30" width="12" height="12" rx="3" fill="${o.gpaLine}"/><text x="${C.left+18}" y="40" fill="${ar}">学期平均绩点</text>
  <rect x="${C.left+132}" y="30" width="12" height="12" rx="3" fill="${o.scoreLine}"/><text x="${C.left+150}" y="40" fill="${ar}">加权均分</text>
</g>`:`<g font-size="12">
  <rect x="${y-C.right-176}" y="8" width="12" height="12" rx="3" fill="${o.gpaLine}"/><text x="${y-C.right-158}" y="18" fill="${ar}">学期平均绩点</text>
  <rect x="${y-C.right-82}" y="8" width="12" height="12" rx="3" fill="${o.scoreLine}"/><text x="${y-C.right-64}" y="18" fill="${ar}">加权均分</text>
</g>`;return`${Wa({...u,kind:"trend",label:"学期成绩趋势"})}
${it}
${ft}
<g>${rt}</g>
<text x="${C.left}" y="18" font-size="12" fill="${ar}">每学期修读学分（柱）</text>
<g stroke="${o.gpaLine}" stroke-width="2.2" fill="none"><polyline points="${W}"/></g>
<g stroke="${o.scoreLine}" stroke-width="1.8" stroke-dasharray="5 4" fill="none"><polyline points="${et}"/></g>
<g>${nt}</g>
<g>${Q}</g>
<g>${V}</g>
${ct}
</svg>`}e(Ve,"trendChartSvg");function Ye({bands:n,palette:o,layout:l}){let d=n||[],u=Np(l,"bands",d.length),{width:y,height:P,pad:C,mobile:x}=u,A=y-C.left-C.right,f=P-C.top-C.bottom,v=d.length||1,T=Math.max(1,...d.map(m=>m.count)),S=x?Math.min(32,A/v*.62):Math.min(40,A/v*.52),b=d.map((m,k)=>{let g=C.left+(k+.5)*(A/v),_=m.count?Math.max(8,m.count/T*f):0,q=C.top+f-_,N=(.4+(1-k/(v-1))*.6).toFixed(2),z=m.range||(m.min===0?"<60":`${m.min}-${m.max===100?"100":m.max}`),H=[`${m.level||""}（绩点 ${m.gpa}）`,`百分制 ${z}`,`课程 ${m.count} 门`].join(`
`);return`<rect class="urppp-sa-band" x="${(g-S/2).toFixed(1)}" y="${q.toFixed(1)}" width="${S.toFixed(1)}" height="${_.toFixed(1)}" rx="4" fill="${o.primary}" opacity="${N}"><title>${or(H)}</title></rect>
<text x="${g.toFixed(1)}" y="${(q-6).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)">${or(m.count)}</text>
<text x="${g.toFixed(1)}" y="${P-26}" text-anchor="middle" font-size="11" font-weight="600" fill="${ar}">${or(z)}</text>
<text x="${g.toFixed(1)}" y="${P-12}" text-anchor="middle" font-size="12" fill="${ar}">${or(m.gpa)}</text>`}).join("");return`${Wa({...u,kind:"bands",label:"成绩分段分布"})}
<line x1="${C.left}" y1="${(C.top+f).toFixed(1)}" x2="${y-C.right}" y2="${(C.top+f).toFixed(1)}" stroke="${Ua}" stroke-width="1"/>
${b}
</svg>`}e(Ye,"bandsChartSvg");function Bp({items:n,requiredRatio:o,palette:l}){let C=2*Math.PI*56,x=(n||[]).filter(T=>T&&T.ratio>0),A=Math.max(0,Math.min(100,Math.round(Number(o)||0)));if(!x.length)return'<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成"></svg>';let f=-90,v=x.map(T=>{let S=T.ratio/100*C,m=`<circle cx="75" cy="75" r="56" fill="none" stroke="${l.share&&l.share[T.key]||l.required}" stroke-width="24"
  stroke-dasharray="${S.toFixed(2)} ${C.toFixed(2)}"
  stroke-linecap="butt" transform="rotate(${f.toFixed(2)} 75 75)"/>`;return f+=T.ratio/100*360,m}).join("");return`<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成">
<circle cx="75" cy="75" r="56" fill="none" stroke="${Ua}" stroke-width="24"/>
${v}
<text x="75" y="69" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${or(A)}%</text>
<text x="75" y="91" text-anchor="middle" font-size="11.5" fill="${ar}">必修学分占比</text>
</svg>`}e(Bp,"donutSvg");var gl=Object.freeze({gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)",share:Object.freeze({required:"var(--primary)",elective:"var(--text-muted)",optional:"var(--text-secondary)",other:"var(--border)"})}),fl='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>',xl='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';function Fp({deps:n}){let o=n&&n.palette||gl;function l(){return`<div id="urppp-score-analysis" class="urppp-sa" data-urppp-sa-state="collapsed">
  <button type="button" class="urppp-sa-toggle" aria-expanded="false">
    <span class="urppp-sa-icon">${fl}</span>
    <span class="urppp-sa-title">成绩分析</span>
    <span class="urppp-sa-summary" data-urppp-sa-summary>点击展开，查看成绩指标与学期变化</span>
    <span class="urppp-sa-chevron">${xl}</span>
  </button>
  <div class="urppp-sa-body" data-urppp-sa-body hidden>
    <div class="urppp-sa-content" data-urppp-sa-content></div>
  </div>
</div>`}e(l,"panelShellHtml");function d(){return'<div class="urppp-sa-loading"><span class="urppp-sa-spinner"></span><span>正在计算成绩分析…</span></div>'}e(d,"loadingHtml");function u(A){return`<div class="urppp-sa-error">${At(String(A||"成绩数据加载失败"))}
  <button type="button" class="urppp-sa-retry" data-urppp-sa-retry>重试</button></div>`}e(u,"errorHtml");function y(A){return[{label:"主修必修绩点",value:A.requiredGpa>0?String(A.requiredGpa):"—",hint:"必修课程加权"},{label:"平均绩点",value:A.avgGpa!=null?String(A.avgGpa):"—",hint:"全部及格加权"},{label:"加权均分",value:A.avgScore!=null?String(A.avgScore):"—",hint:"学分加权"},{label:"已修学分",value:A.totalCredit!=null?String(A.totalCredit):"—",hint:"及格课程学分"},{label:"已修课程",value:String(A.courseCount||0),hint:"含未评估"}].map(v=>`<div class="urppp-sa-metric">
  <div class="urppp-sa-metric-value">${At(v.value)}</div>
  <div class="urppp-sa-metric-label">${At(v.label)}</div>
  <div class="urppp-sa-metric-hint">${At(v.hint)}</div>
</div>`).join("")}e(y,"metricCards");function P(A){return`<table class="urppp-sa-table">
<thead><tr><th>学期</th><th>课程</th><th>学分</th><th>加权均分</th><th>平均绩点</th></tr></thead>
<tbody>${(A||[]).map(v=>`<tr><td>${At(v.label)}</td><td>${At(v.count)}</td><td>${At(v.credit)}</td><td>${At(v.avgScore)}</td><td>${At(v.avgGpa)}</td></tr>`).join("")}</tbody></table>`}e(P,"detailTable");function C(A){return(A||[]).map(f=>`<div class="urppp-sa-legend-item"><i class="urppp-sa-legend-dot" style="background:${o.share&&o.share[f.key]||o.primary}"></i>${At(f.label)} ${At(f.credit)} 学分 · ${At(f.count)} 门</div>`).join("")}e(C,"shareLegend");function x(A,f={}){if(!A||A.empty)return'<div class="urppp-sa-empty">暂无可用成绩数据，请先在教务系统查询成绩后再试。</div>';let v=A.share||{items:[],requiredRatio:0},T=f.chartLayout||null;return`<div class="urppp-sa-metrics">${y(A.metrics)}</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-trend">
    <h5 class="urppp-sa-card-title">学期趋势</h5>
    <div class="urppp-sa-chart-scroll">${Ve({trend:A.trend,palette:o,layout:T})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-share">
    <h5 class="urppp-sa-card-title">课程类型构成</h5>
    <div class="urppp-sa-share-body">
      <div class="urppp-sa-donut">${Bp({items:v.items,requiredRatio:v.requiredRatio,palette:o})}</div>
      <div class="urppp-sa-legend">${C(v.items)}</div>
    </div>
  </section>
</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-bands">
    <h5 class="urppp-sa-card-title">成绩分段分布</h5>
    <div class="urppp-sa-chart-scroll">${Ye({bands:A.bands,palette:o,layout:T})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-detail">
    <h5 class="urppp-sa-card-title">各学期明细</h5>
    ${P(A.trend)}
  </section>
</div>`}return e(x,"analysisHtml"),{panelShellHtml:l,loadingHtml:d,errorHtml:u,analysisHtml:x,palette:o}}e(Fp,"createScoreAnalysisRenderer");function Dp(){function n(o,l){let d=o.querySelector(".urppp-sa-toggle"),u=o.querySelector("[data-urppp-sa-body]");if(!d||!u)return{isExpanded:e(()=>!1,"isExpanded"),setExpanded:e(()=>{},"setExpanded"),syncShareLayout:e(()=>{},"syncShareLayout")};let y=e(C=>{let x=C?"expanded":"collapsed";o.dataset.urpppSaState=x,d.setAttribute("aria-expanded",String(C)),u.hidden=!C,C&&typeof l.onExpand=="function"&&l.onExpand()},"setExpanded");d.addEventListener("click",()=>{let C=d.getAttribute("aria-expanded")==="true";y(!C)}),u.addEventListener("click",C=>{let x=C.target;x&&x.closest&&x.closest("[data-urppp-sa-retry]")&&typeof l.onRetry=="function"&&l.onRetry()});function P(){let C=o.querySelector(".urppp-sa-donut"),x=o.querySelector(".urppp-sa-legend"),A=!!(C&&x&&x.getBoundingClientRect().top>=C.getBoundingClientRect().bottom);o.classList.toggle("urppp-sa-share-stacked",A)}return e(P,"syncShareLayout"),{setExpanded:y,syncShareLayout:P,isExpanded:e(()=>d.getAttribute("aria-expanded")==="true","isExpanded")}}return e(n,"bindPanel"),{bindPanel:n}}e(Dp,"createScoreAnalysisUI");var jp="urppp-score-analysis";function Op({deps:n}){let o=Je({deps:n}),l=Fp({deps:n}),d=Dp(),u=null,y="idle",P=null,C=null,x=null,A=!1,f=0,v="desktop";function T(){if(!n.styles||document.getElementById("urppp-score-analysis-style"))return;let W=document.createElement("style");W.id="urppp-score-analysis-style",W.textContent=n.styles,(document.head||document.documentElement).appendChild(W)}e(T,"ensureStyle");function S(){if(typeof n.getInsertHost=="function"){let W=n.getInsertHost();if(W)return W}return document.querySelector(".page-content")||document.getElementById("page-content-template")||document.body}e(S,"findHost");function b(){return u&&u.querySelector("[data-urppp-sa-content]")}e(b,"contentEl");function m(){return P||(y="loading",P=(async()=>{try{let[W,et]=await Promise.all([n.loadScores(),n.loadProfile()]);if(W&&W.error)throw new Error(W.error);let it=o.analyzeScores({scorePack:W,profile:et});return C=it,y="ready",it}catch(W){throw y="error",W}finally{P=null}})(),P)}e(m,"startLoad");function k(){y==="idle"&&m().catch(()=>{})}e(k,"warmup");function g(){if(x&&typeof x.syncShareLayout=="function")try{x.syncShareLayout()}catch{}}e(g,"syncShareLayout");function _(){try{if(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches)return{variant:"mobile"}}catch{}return null}e(_,"currentChartLayout");function q(){let W=b();if(!W||!C)return;let et=_();v=et?et.variant:"desktop",W.innerHTML=l.analysisHtml(C,{chartLayout:et}),g()}e(q,"renderReadyAnalysis");function N(){clearTimeout(f),f=setTimeout(()=>{if(g(),!C||!x||!x.isExpanded())return;let W=_();(W?W.variant:"desktop")!==v&&q()},120)}e(N,"handleResize");function z(){A||(A=!0,window.addEventListener("resize",N))}e(z,"bindResize");function H(){A&&(A=!1,clearTimeout(f),f=0,window.removeEventListener("resize",N))}e(H,"unbindResize");async function F(){let W=b();if(W){if(y==="ready"&&C){q();return}W.innerHTML=l.loadingHtml();try{await m(),q()}catch(et){W.innerHTML=l.errorHtml(et&&et.message||String(et))}}}e(F,"handleExpand");function G(){if(T(),u&&u.isConnected)return u;if(document.getElementById(jp))return document.getElementById(jp);let W=S();if(!W)return null;let et=document.createElement("div");return et.innerHTML=l.panelShellHtml(),u=et.firstElementChild,W.insertBefore(u,W.firstChild),x=d.bindPanel(u,{onExpand:F,onRetry:F}),z(),k(),n.shouldAutoExpand&&n.shouldAutoExpand()&&(typeof requestAnimationFrame=="function"?requestAnimationFrame:ft=>setTimeout(ft,0))(()=>{try{x.setExpanded(!0)}catch{}}),u}e(G,"mount");function Z(){H(),u&&u.isConnected&&u.remove(),u=null,x=null,y="idle",P=null,C=null,v="desktop"}return e(Z,"unmount"),{mount:G,unmount:Z,getPanel:e(()=>u,"getPanel"),reset:Z}}e(Op,"createScoreAnalysisController");function Hp({documentRef:n=document,locationRef:o=location,windowRef:l=window}){function d(A){return String(A||"").replace(/[\u00a0\s]+/g," ").replace(/^[>\u25b8\u203a·•\u00bb]+/,"").replace(/^\s*[\u25b8>]\s*/,"").trim()}e(d,"cleanMenuLabel");function u(A){if(!A)return"";let f=A.querySelector(":scope > a");if(!f)return"";let v=f.querySelector(".menu-text, .urppp-nav-text");if(v)return d(v.textContent);let T=f.cloneNode(!0);return T.querySelectorAll("i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow").forEach(S=>S.remove()),d(T.textContent)}e(u,"getMenuLiLabel");function y(A){let f=[],v=A,T=n.getElementById("menus")||n.getElementById("urppp-menus");for(;v&&v!==T;){if(v.tagName==="LI"){let S=u(v);S&&!/^(首页|一级菜单|二级菜单|三级菜单)$/.test(S)&&f.unshift(S)}v=v.parentElement}return f.filter((S,b)=>S&&S!==f[b-1])}e(y,"walkMenuAncestors");function P(){let A=o.pathname.replace(/\/+$/,"")||"/",f=o.search||"",v=[];return[n.getElementById("menus"),n.getElementById("urppp-menus")].filter(Boolean).forEach(S=>{S.querySelectorAll("a[href]").forEach(b=>{let m=b.getAttribute("href")||"";if(!(!m||m==="#"||m.startsWith("javascript")))try{let k=new URL(m,o.origin),g=k.pathname.replace(/\/+$/,"")||"/";if(g==="/"&&A!=="/")return;let _=0;A===g?_=1e3+g.length:A.startsWith(g+"/")?_=500+g.length:A.includes(g)&&g.length>8&&(_=200+g.length),_&&f&&k.search&&f.indexOf(k.search.slice(1))>=0&&(_+=50),_>0&&v.push({score:_,li:b.closest("li")})}catch{}})}),v.sort((S,b)=>b.score-S.score),v.length?v[0].li:null}e(P,"findMenuLiByPath");function C(){let A=P();if(A){let m=y(A);if(m.length)return m}let f="";try{let m=n.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);m&&(f=decodeURIComponent(m[1]))}catch{}if(f&&f!=="0"){let m=n.getElementById(f);if(m){let k=y(m);if(k.length)return k}}let v=null,T=Array.from(n.querySelectorAll("#menus li.active"));if(T.length){v=T[T.length-1];for(let m=T.length-1;m>=0;m--)if(!T[m].querySelector("li.active")){v=T[m];break}}if(!v){let m=Array.from(n.querySelectorAll("#urppp-menus .urppp-nav-item.active"));if(m.length){v=m[m.length-1];for(let k=m.length-1;k>=0;k--)if(!m[k].querySelector(".urppp-nav-item.active")){v=m[k];break}}}if(v){let m=y(v);if(m.length)return m}let S=n.getElementById("breadcrumbs")||n.querySelector(".breadcrumbs"),b=S&&(S.querySelector("ul.breadcrumb")||S.querySelector(".breadcrumb"));if(b){let m=[];if(Array.from(b.children).forEach((k,g)=>{if(g===0)return;let _=d(k.textContent);!_||/^(首页|一级菜单|二级菜单|三级菜单)$/.test(_)||m[m.length-1]!==_&&m.push(_)}),m.length)return m}return[]}e(C,"getBreadcrumbTrail");function x(){let A=n.getElementById("breadcrumbs")||n.querySelector(".breadcrumbs");if(!A)return;A.classList.remove("hide"),A.style.removeProperty("display"),A.style.setProperty("display","flex","important");let f=A.querySelector("ul.breadcrumb")||A.querySelector(".breadcrumb");f||(f=n.createElement("ul"),f.className="breadcrumb",A.appendChild(f));let v=C();if(!v.length&&Array.from(f.children).map(m=>d(m.textContent)).filter(Boolean).some(m=>m!=="首页"&&!/^(一级菜单|二级菜单|三级菜单)$/.test(m)))return;f.innerHTML="";let T=n.createElement("li");T.style.cursor="pointer",T.innerHTML='<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>',T.addEventListener("click",()=>{l.location.href="/"}),f.appendChild(T),v.forEach((S,b)=>{let m=n.createElement("li");b===v.length-1&&m.classList.add("active");let k=n.createElement("span");k.className="urppp-bc-label",k.textContent=S,m.appendChild(k),f.appendChild(m)})}return e(x,"beautifyBreadcrumbs"),{beautifyBreadcrumbs:x}}e(Hp,"createBreadcrumbController");function Rp({theme:n,settings:o,documentRef:l=document,windowRef:d=window}){function u(A){if(!A)return;let f=n.getSkin(),v=n.skinSupportsFixedPalettes(f),T=n.getCurrent(),S=v?n.getBrutalActivePalette():null,b=v?n.getBrutalSelectedPalette():null;A.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(m=>{let k=m.dataset.theme,g=k==="dark",_=k==="scu-red",q=g&&!n.skinSupportsDark(f)||_&&!n.skinSupportsDynamic(f)&&!v,N=k===T;if(v&&(N=k==="default"&&S.id===n.BRUTAL_DEFAULT_PALETTE||_&&S.id!==n.BRUTAL_DEFAULT_PALETTE),m.disabled=q,m.classList.toggle("urppp-theme-disabled",q),m.classList.toggle("ac",N&&!q),m.setAttribute("aria-disabled",q?"true":"false"),k==="default")m.style.background=v?n.getBrutalPaletteById(n.BRUTAL_DEFAULT_PALETTE).accent:"#F1F3F5",m.title=v?"默认高能粉":"简约白";else if(g)m.style.background=q?"#A7A7A7":"#0B0F14",m.title=q?"当前界面风格不支持暗色模式":"深邃暗";else if(_)if(q)m.style.background="#A7A7A7",m.title="当前界面风格不支持动态配色";else if(v)m.style.background=b.accent,m.title="高对比配色："+b.name;else{let z=n.getAccent()||n.DEFAULT_SEED;try{let H=n.buildSchemePreview(z,n.getScheme());m.style.background="linear-gradient(135deg, "+H.primary+" 0 55%, "+H.surface+" 55% 100%)"}catch{m.style.background=z}m.title="动态配色"}})}e(u,"syncThemeDotGroup");function y(A){let f=n.getSkin();if(n.skinSupportsFixedPalettes(f)){if(A==="dark")return;n.getCurrent()!=="default"&&n.applyTheme("default",{manual:!0}),A==="default"&&n.setBrutalPalette(n.BRUTAL_DEFAULT_PALETTE),A==="scu-red"&&n.setBrutalPalette(n.getBrutalSelectedPalette().id);return}n.isThemeModeAvailable(A,f)&&n.applyTheme(A,{manual:!0})}e(y,"handleThemeDotClick");function P(){u(l.getElementById("urppp-nav-theme"))}e(P,"syncNavbarThemeUI");function C(){try{let A=l.getElementById("navbar")||l.querySelector(".navbar");if(!A)return;if(l.getElementById("urppp-nav-theme")){P();return}let f=A.querySelector(".navbar-header .navbar-brand")||A.querySelector(".navbar-brand")||A.querySelector(".navbar-header");if(!f)return;let v=l.createElement("div");v.id="urppp-nav-theme",v.innerHTML=['<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>','<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>','<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>','<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">','  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">','    <circle cx="12" cy="12" r="3"></circle>','    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',"  </svg>","</button>"].join(""),f.parentElement?(f.parentElement.style.setProperty("display","flex","important"),f.parentElement.style.setProperty("align-items","center","important"),f.nextSibling?f.parentElement.insertBefore(v,f.nextSibling):f.parentElement.appendChild(v)):f.appendChild(v),v.style.setProperty("display","inline-flex","important"),v.style.setProperty("align-items","center","important"),v.style.setProperty("height","36px","important"),v.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(T=>{T.addEventListener("click",()=>{y(T.dataset.theme),P();try{o.syncSettingsPanelUI()}catch{}})}),v.querySelector("#urppp-nav-settings").addEventListener("click",T=>{T.preventDefault(),T.stopPropagation(),o.openSettingsPanel()}),o.ensureSettingsPanel(),P();try{d.__urpppCleanMode&&d.__urpppCleanMode.inject()}catch{}}catch(A){console.warn("[URP++] navbar theme switch inject failed",A)}}e(C,"injectNavbarThemeSwitch");function x(){let f=l.getElementById("navbar")?.querySelector(".ace-nav");try{C()}catch{}if(!f)return;function v(_,q){Object.entries(q).forEach(([N,z])=>_.style.setProperty(N,z,"important"))}e(v,"force"),Array.from(f.childNodes).forEach(_=>{_.nodeType===Node.TEXT_NODE&&!_.textContent.trim()&&_.remove()}),f.querySelectorAll(":scope > li").forEach(_=>{v(_,{display:"inline-flex","align-items":"center","vertical-align":"middle",margin:"0",padding:"0","text-align":"left"})}),f.querySelectorAll(":scope > li > a").forEach(_=>{v(_,{display:"inline-flex","align-items":"center","justify-content":"center",height:"36px",padding:"0 4px","flex-wrap":"nowrap","vertical-align":"middle","text-decoration":"none"}),_.style.lineHeight="1"}),f.querySelectorAll(":scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa").forEach(_=>{v(_,{top:"auto","vertical-align":"middle","line-height":"1","margin-top":"0"})});let T=f.querySelector(':scope > li > a[href*="customerServiceCenter"]');T&&(v(T,{width:"28px","justify-content":"center"}),T.style.padding="0 4px");let S=l.getElementById("clickdiv"),b=l.getElementById("form-search"),m=l.getElementById("search-input"),k=l.getElementById("intellegenceUDiv");if(k&&(k.style.setProperty("position","relative","important"),k.style.setProperty("z-index","30","important"),k.style.setProperty("display","inline-flex","important"),k.style.setProperty("align-items","center","important"),k.style.setProperty("justify-content","center","important"),k.style.setProperty("width","32px","important"),k.style.setProperty("height","36px","important"),k.style.setProperty("vertical-align","middle","important"),k.style.setProperty("margin","0","important"),k.style.setProperty("padding","0","important")),S&&b){S.removeAttribute("onclick"),v(S,{"background-color":"transparent",position:"relative",display:"inline-flex","align-items":"center","justify-content":"center",width:"32px",height:"32px","border-radius":"8px","line-height":"1","z-index":"30"});let _=l.getElementById("clicki");_&&v(_,{color:"var(--text-secondary)","margin-top":"0"}),S.__urpppNavbarClickBound||(S.__urpppNavbarClickBound=!0,S.addEventListener("mouseenter",()=>S.style.setProperty("background-color","var(--input-bg)","important")),S.addEventListener("mouseleave",()=>S.style.setProperty("background-color","transparent","important")),S.addEventListener("click",z=>{z.preventDefault(),z.stopPropagation(),b.dataset.open==="1"?(b.style.width="0px",b.style.opacity="0",b.dataset.open="0"):(b.style.width="180px",b.style.opacity="1",b.dataset.open="1",m&&setTimeout(()=>m.focus(),50))})),d.__urpppNavbarOutsideClickBound||(d.__urpppNavbarOutsideClickBound=!0,l.addEventListener("click",z=>{let H=l.getElementById("clickdiv"),F=l.getElementById("form-search");!H||!F||F.dataset.open!=="1"||!H.contains(z.target)&&!F.contains(z.target)&&(F.style.width="0px",F.style.opacity="0",F.dataset.open="0")})),v(b,{position:"absolute",right:"34px",top:"50%",transform:"translateY(-50%)",left:"auto",margin:"0","z-index":"10",background:"transparent",border:"none","box-shadow":"none",overflow:"hidden",padding:"0",transition:"width .2s ease, opacity .2s ease"});let q=b.dataset.open==="1"?"160px":"0px";b.style.width!==q&&(b.style.width=q,b.style.opacity=b.dataset.open==="1"?"1":"0"),m&&v(m,{"background-color":"var(--input-bg)",border:"1px solid var(--border)",color:"var(--text)","border-radius":"8px",height:"32px",padding:"0 12px","line-height":"32px",width:"100%"});let N=b.querySelector(".input-icon > .ace-icon.fa-search");N&&(N.style.display="none")}let g=f.querySelector(":scope > li.light-blue > a");if(g){v(g,{display:"inline-flex","align-items":"center",gap:"6px"});let _=g.querySelector(".user-info");_&&(v(_,{display:"inline-flex","align-items":"center",gap:"4px","max-width":"none","white-space":"nowrap","vertical-align":"middle","line-height":"1","margin-top":"-12px"}),Array.from(_.childNodes).forEach(N=>{N.nodeType===Node.TEXT_NODE&&(N.textContent=N.textContent.replace(/\s+/g,"").trim())}),Array.from(_.children).forEach(N=>{v(N,{display:"inline","white-space":"nowrap","vertical-align":"middle","line-height":"1",margin:"0",padding:"0"}),N.tagName==="SMALL"&&N.style.setProperty("font-size","inherit","important")}));let q=g.querySelector(".nav-user-photo");q&&(q.alt=(q.alt||"").replace(/\s+/g,"").trim(),v(q,{"vertical-align":"middle",display:"inline-block",width:"30px",height:"30px"}))}}return e(x,"rebuildNavbar"),{handleThemeDotClick:y,injectNavbarThemeSwitch:C,rebuildNavbar:x,syncNavbarThemeUI:P,syncThemeDotGroup:u}}e(Rp,"createNavbarController");(function(){"use strict";try{let t=typeof navigator<"u"&&navigator.userAgent||"";if(/Android|iPhone|iPad|iPod|Mobile/i.test(t)){document.documentElement&&document.documentElement.classList.add("urppp-mobile");let r=document.querySelector('meta[name="viewport"]');r||(r=document.createElement("meta"),r.name="viewport",r.content="width=device-width, initial-scale=1",(document.head||document.documentElement||document).appendChild(r))}}catch{}let n="1.9.4";if(/^id\./i.test(String(location.hostname||""))){try{let t=Ia({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:n},uiDeps:{openSubpanel:e(()=>{},"openSubpanel")}}),r=e(()=>{try{t.bootFromCache("assist")}catch{}},"boot");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r()}catch{}return}let o={mainRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js",assistRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",changelogPage:"https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md",greasySearch:"https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B",versionJson:"version.json",sourceUrls:e(t=>[`https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`,`https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/${t}`,`https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`],"sourceUrls")},l="urppp_auto_update_check_v1",d="urppp_skin_v1",u=[{id:"apple",name:"类Apple风格",desc:"系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。",ready:!0,dark:!0,dynamic:!0,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"editorial",name:"编辑杂志",desc:"衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"flat",name:"极简扁平",desc:"无阴影、硬边与纯色层次，冷硬清晰。",ready:!0,dark:!0,dynamic:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"organic",name:"自然有机",desc:"奶油底与大地色，温暖圆角。不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"brutal",name:"新野兽派",desc:"高对比画布、粗边框与硬阴影。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,palettes:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"neu",name:"新拟物",desc:"同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}}],y=GM_addStyle(`
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
  `);y&&(y.id="urppp-early-style");let P=`
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
  `;function C(t){let r=document.createElement("div");return r.className="urppp-inline-loader",r.innerHTML=P+(t?`<div>${t}</div>`:""),r}e(C,"makeInlineLoader");function x(t){return!t||!t.closest?!1:!!t.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]')}e(x,"isPageLoadingOverlay");function A(t){try{(t&&t.querySelectorAll?t:document).querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach(a=>{a.querySelectorAll(".urppp-inline-loader").forEach(p=>{try{p.remove()}catch{}}),a.classList.remove("urppp-loading-active")})}catch{}}e(A,"cleanupPageLoadingOverlays");function f(t){try{let r=t&&t.querySelectorAll?t:document;A(r),r.querySelectorAll("img").forEach(a=>{try{if(!a||a.dataset.urpppReplaced==="1"||x(a))return;let p=(a.getAttribute("src")||a.src||"").toLowerCase();if(!p||!(p.includes("pageloading")||p.includes("page-loading")||p.includes("loading.gif")||p.includes("loading-0")||p.includes("loading-1"))||p.includes("/loading")&&!p.includes("pageloading")&&!p.includes("loading.gif")&&!p.includes("loading-0"))return;a.dataset.urpppReplaced="1";let s=C("");s.style.minHeight="0",s.style.padding="0",a.parentElement&&a.parentElement.replaceChild(s,a)}catch{}}),r.querySelectorAll(".layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content").forEach(a=>{try{if(!a||a.dataset.urpppReplaced==="1")return;if(a.dataset.urpppReplaced="1",a.style.setProperty("background","transparent","important"),a.style.setProperty("background-image","none","important"),!a.querySelector(".urppp-inline-loader")){let p=C("");p.style.minHeight="0",p.style.padding="0",a.appendChild(p)}}catch{}})}catch{}}if(e(f,"replaceNativeLoaders"),!window.__urpppLoaderObs){window.__urpppLoaderObs=!0;let t=!1,r=e(()=>{if(!t){t=!0;try{f(document)}catch{}t=!1}},"run");document.body&&setTimeout(r,0),document.addEventListener("DOMContentLoaded",()=>setTimeout(r,0),{once:!0});let a=e(()=>{new MutationObserver(()=>{clearTimeout(window.__urpppLoaderTimer),window.__urpppLoaderTimer=setTimeout(r,200)}).observe(document.documentElement,{childList:!0,subtree:!0})},"startObs");document.body?a():document.addEventListener("DOMContentLoaded",a,{once:!0})}let v="urppp_theme_v3",T="urppp_accent_v1",S="urppp_accent_presets_v1",b="urppp_scheme_v1",m="urppp_theme_follow_system_v1",k="urppp_clean_default_v1",g="urppp_clean_analysis_v1",_="urppp_apple_edge_line_v1",q="urppp_follow_use_dynamic_v1",N="urppp_brutal_palette_v1",z="urppp_brutal_active_palette_v1",H="urppp_privacy_v1",F="urppp_custom_identity_v1",G="urppp_schedule_first_monday_v1",Z="urppp_schedule_json_format_v1",W={completedCourses:"已修课程",failedCourses:"未及格课程",majorGpa:"主修绩点",majorPlan:"主修方案",remainingCourses:"待修课程",passingTotalCredit:"全部及格总学分",passingAvgScore:"全部及格平均成绩",passingAvgGpa:"全部及格平均绩点",passingRequiredCredit:"全部及格必修学分",passingRequiredAvg:"全部及格必修平均",passingRequiredGpa:"全部及格必修绩点",schemeTotalCredit:"方案总学分",schemeAvgScore:"方案平均成绩",schemeAvgGpa:"方案平均绩点",schemeRequiredCredit:"方案必修学分",schemeRequiredAvg:"方案必修平均",schemeRequiredGpa:"方案必修绩点"},et="",it=["#1E3A5F","#B53434","#0F766E","#7C3AED","#C2410C","#0369A1","#BE185D","#365314"],ft="#B53434",V="pink",rt=[{id:"pink",name:"高能粉",desc:"默认配色，热粉强调与酸性绿辅助",accent:"#FF006E",secondary:"#CCFF00",info:"#00D9FF",warning:"#FF9500"},{id:"acid",name:"酸性绿",desc:"酸性绿强调与热粉辅助",accent:"#CCFF00",secondary:"#FF006E",info:"#00D9FF",warning:"#FF9500"},{id:"cyan",name:"电子蓝",desc:"电子蓝强调与亮橙辅助",accent:"#00D9FF",secondary:"#FF9500",info:"#CCFF00",warning:"#FF006E"},{id:"orange",name:"亮橙",desc:"亮橙强调与电子蓝辅助",accent:"#FF9500",secondary:"#00D9FF",info:"#CCFF00",warning:"#FF006E"}],nt="tonal",Q=[{id:"paper",name:"纯白卡片",desc:"卡片保持白，仅强调色跟种子"},{id:"tonal",name:"色调点缀",desc:"背景轻染，卡片带同色相浅底"},{id:"soft",name:"柔和粉彩",desc:"卡片明显粉彩/浅色，低对比"},{id:"vibrant",name:"鲜艳",desc:"背景与卡片都更有色，主色更饱和"},{id:"expressive",name:"表现力",desc:"双色拼色：卡片跟主色，背景走协调次色"}],{handleThemeDotClick:ct,injectNavbarThemeSwitch:tt,rebuildNavbar:ut,syncNavbarThemeUI:ht,syncThemeDotGroup:X}=Rp({theme:{BRUTAL_DEFAULT_PALETTE:V,DEFAULT_SEED:ft,applyTheme:Wt,buildSchemePreview:Yt,getAccent:Jt,getBrutalActivePalette:ro,getBrutalPaletteById:Qr,getBrutalSelectedPalette:to,getCurrent:Vt,getScheme:Cr,getSkin:dr,isThemeModeAvailable:Yr,setBrutalPalette:eo,skinSupportsDark:zr,skinSupportsDynamic:Lr,skinSupportsFixedPalettes:Za},settings:{ensureSettingsPanel:Lo,openSettingsPanel:Co,syncSettingsPanelUI:Kt}});function st(){try{if(!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches))return;let r=document.getElementById("navbar"),a=r?.querySelector(".ace-nav");if(!r||!a)return;let p=document.getElementById("intellegenceUDiv"),s=document.getElementById("clickdiv"),i=document.getElementById("form-search");if(!p){let B=document.createElement("li");B.className="green urppp-search-item",p=document.createElement("div"),p.id="intellegenceUDiv",B.appendChild(p),a.appendChild(B)}let c=p.closest("li")||p.parentElement,h=Array.from(a.children).find(B=>{let O=B.querySelector(":scope > a");if(!O)return!1;let $=O.getAttribute("href")||"",Y=(O.getAttribute("title")||"")+" "+(O.textContent||"");return $.includes("customerServiceCenter")||/help|service|support/i.test($)||!!O.querySelector(".glyphicon-headphones, .fa-headphones, .fa-question-circle, .fa-life-ring")||/帮助|客服|服务|帮助中心/i.test(Y)}),w=Array.from(a.children).find(B=>B.classList.contains("light-blue")),E=h||w||null;E&&c&&E!==c&&((c.compareDocumentPosition(E)&Node.DOCUMENT_POSITION_FOLLOWING)!==0||a.insertBefore(c,E)),c&&!c.classList.contains("urppp-search-item")&&c.classList.add("urppp-search-item");let M=c;s?(s.removeAttribute("onclick"),s.setAttribute("role","button"),s.setAttribute("aria-label","搜索功能")):(s=document.createElement("button"),s.type="button",s.id="clickdiv",s.setAttribute("aria-label","搜索功能"),s.innerHTML='<i class="fa fa-search" id="clicki" aria-hidden="true"></i>',p.appendChild(s)),s.style.setProperty("left","8px","important"),s.style.setProperty("position","relative","important"),s.style.setProperty("z-index","31","important"),i||(i=document.createElement("div"),i.id="form-search",i.className="nav-search",i.innerHTML='<form class="form-search"><span class="input-icon"><input type="text" placeholder="查找功能..." class="nav-search-input" id="search-input" autocomplete="off"><i class="ace-icon fa fa-search" aria-hidden="true"></i></span></form>'),M&&i.parentElement!==M&&M.appendChild(i),M&&M.style.setProperty("position","relative","important"),i.classList.add("urppp-desktop-search"),i.style.setProperty("position","absolute","important"),i.style.setProperty("top","50%","important"),i.style.setProperty("right","24px","important"),i.style.setProperty("left","auto","important"),i.style.setProperty("transform","translateY(-50%)","important"),i.style.setProperty("width",i.dataset.open==="1"?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("max-width","calc(100vw - 24px)","important"),i.style.setProperty("opacity",i.dataset.open==="1"?"1":"0","important"),i.style.setProperty("pointer-events",i.dataset.open==="1"?"auto":"none","important"),i.style.setProperty("z-index","1200","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("background","transparent","important"),i.style.setProperty("border","0 solid transparent","important"),i.style.setProperty("box-shadow","none","important"),i.style.setProperty("overflow","visible","important"),i.style.setProperty("transition","width .2s ease, opacity .2s ease","important");let j=i.querySelector("#search-input"),L=i.querySelector("form");if(!j||!L)return;L.style.setProperty("display","block","important"),L.style.setProperty("margin","0","important"),L.style.setProperty("padding","10px","important");let D=i.querySelector(".input-icon");D&&(D.style.setProperty("display","block","important"),D.style.setProperty("position","relative","important")),j.style.setProperty("display","block","important"),j.style.setProperty("width","100%","important"),j.style.setProperty("height","36px","important"),j.style.setProperty("box-sizing","border-box","important"),j.style.setProperty("padding","0 12px","important"),j.style.setProperty("border","1px solid var(--border)","important"),j.style.setProperty("border-radius","var(--radius-sm)","important"),j.style.setProperty("background","var(--input-bg)","important"),j.style.setProperty("color","var(--text)","important");let J=e(B=>{i.dataset.open=B?"1":"0",i.style.setProperty("width",B?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("opacity",B?"1":"0","important"),i.style.setProperty("pointer-events",B?"auto":"none","important"),s.setAttribute("aria-expanded",B?"true":"false"),B&&setTimeout(()=>j.focus(),30)},"setOpen");s.__urpppSearchBound||(s.__urpppSearchBound=!0,s.addEventListener("click",B=>{B.preventDefault(),B.stopImmediatePropagation(),J(i.dataset.open!=="1")},!0)),document.__urpppDesktopSearchOutsideBound||(document.__urpppDesktopSearchOutsideBound=!0,document.addEventListener("click",B=>{let O=document.getElementById("form-search"),$=document.getElementById("clickdiv");!O||O.dataset.open!=="1"||O.classList.contains("urppp-mobile-form-search")||O.closest("#urppp-mobile-search-panel")||O.contains(B.target)||$?.contains(B.target)||J(!1)},!0))}catch(t){console.warn("[URP++] desktop search bind failed",t)}}e(st,"bindDesktopNavbarSearch");function wt(){if(document.getElementById("urppp-boot-loader"))return;let t=document.createElement("div");t.id="urppp-boot-loader",t.setAttribute("aria-busy","true"),t.innerHTML=`
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
    `;let r=document.documentElement||document.body;r&&r.appendChild(t)}e(wt,"ensureBootLoader");function vt(){try{document.documentElement.classList.add("urppp-ready"),document.body&&(document.body.classList.add("urppp-ready"),document.body.style.removeProperty("opacity"));let t=document.getElementById("urppp-boot-loader");if(!t)return;t.classList.add("urppp-boot-hide"),setTimeout(()=>{try{t.remove()}catch{}},280)}catch{}}e(vt,"hideBootLoader");try{wt()}catch{}window.__urpppBootSafety||(window.__urpppBootSafety=setTimeout(()=>{try{vt()}catch{}},2500));let Et={default:{name:"简约白",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"#0071E3","--input-bg":"#F5F5F7","--primary":"#0071E3","--primary-hover":"#0077ED","--ring":"rgba(0,113,227,0.28)","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px","--border-w":"0px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},dark:{name:"深邃暗",vars:{"--bg":"#000000","--surface":"#1C1C1E","--text":"#F5F5F7","--text-secondary":"#A1A1A6","--text-muted":"#8E8E93","--border":"#38383A","--border-focus":"#0A84FF","--input-bg":"#2C2C2E","--primary":"#0A84FF","--primary-hover":"#409CFF","--ring":"rgba(10,132,255,0.32)","--shadow":"0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},"scu-red":{name:"动态配色",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"var(--urppp-accent, #B53434)","--input-bg":"#F5F5F7","--primary":"var(--urppp-accent, #B53434)","--primary-hover":"var(--urppp-accent-hover, #962929)","--ring":"var(--urppp-accent-ring, rgba(181,52,52,0.18))","--shadow":"0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'}};function I(t,r,a){t/=255,r/=255,a/=255;let p=Math.max(t,r,a),s=Math.min(t,r,a),i=0,c=0,h=(p+s)/2;if(p!==s){let w=p-s;switch(c=h>.5?w/(2-p-s):w/(p+s),p){case t:i=(r-a)/w+(r<a?6:0);break;case r:i=(a-t)/w+2;break;default:i=(t-r)/w+4;break}i/=6}return{h:i*360,s:c,l:h}}e(I,"rgbToHsl");function U(t,r,a){t=(t%360+360)%360,r=Math.max(0,Math.min(1,r)),a=Math.max(0,Math.min(1,a));let p=(1-Math.abs(2*a-1))*r,s=p*(1-Math.abs(t/60%2-1)),i=a-p/2,c=0,h=0,w=0;return t<60?(c=p,h=s):t<120?(c=s,h=p):t<180?(h=p,w=s):t<240?(h=s,w=p):t<300?(c=s,w=p):(c=p,w=s),{r:Math.round((c+i)*255),g:Math.round((h+i)*255),b:Math.round((w+i)*255)}}e(U,"hslToRgb");function K(t,r,a){let{r:p,g:s,b:i}=U(t,r,a);return se(p,s,i)}e(K,"hslHex");function mt(t){let{r,g:a,b:p}=Wr(Rt(t)||ft),s=I(r,a,p);return s.s<.12&&(s.s=.18),s}e(mt,"seedHsl");function dt(t,r,a){let p=Math.max(0,Math.min(100,a))/100,s=Math.max(0,Math.min(.95,r));return K(t,s,p)}e(dt,"tone");function Pt(t){switch(t){case"paper":case"neutral":return{chroma:1,secShift:0,primaryTone:38,whiteCard:!0,bgSeed:.05,surfaceSeed:0,borderSeed:.08};case"soft":return{chroma:1,secShift:10,primaryTone:42,bgSeed:.14,surfaceSeed:.16,borderSeed:.18};case"vibrant":return{chroma:1.15,secShift:14,primaryTone:36,bgSeed:.2,surfaceSeed:.22,borderSeed:.26};case"expressive":return{chroma:1.08,secShift:0,primaryTone:36,duo:!0,bgSeed:.12,surfaceSeed:.15,borderSeed:.18};default:return{chroma:1,secShift:18,primaryTone:40,bgSeed:.12,surfaceSeed:.13,borderSeed:.16}}}e(Pt,"schemeProfile");function xt(t,r){let a=Rt(t)||ft,p=Math.max(0,Math.min(.45,Number(r)||0));return p<=.001?"#FFFFFF":Nt("#FFFFFF",a,p)}e(xt,"tintFromHex");function Bt(t){return t<25||t>=345?(t+28)%360:t<55?(t+22)%360:t<90?(t+160)%360:t<160?(t+40)%360:t<210?(t+35)%360:t<265?(t+48)%360:t<310?(t+40)%360:(t+24)%360}e(Bt,"companionHue");function Ct(t){let r=Rt(t)||ft,{h:a,s:p}=mt(r),s=Bt(a),i=Math.min(.72,Math.max(.28,p*.78));return dt(s,i,42)}e(Ct,"companionColor");function It(t,r){let a=Rt(t)||ft,{h:p,s}=mt(a),c=Pt(r||nt),h=Math.min(.92,Math.max(.35,s*c.chroma)),w=Ct(a),{h:E}=mt(w),M=dt(p,h,c.primaryTone),j=dt(p,h,Math.max(24,c.primaryTone-10)),L=Nt("#FFFFFF",a,.18),D,J,B;c.whiteCard?(D=Nt("#F1F5F9",Nt("#FFFFFF",a,.08),.5),J="#FFFFFF",B="#E5E7EB"):c.duo?(D=Nt(xt(w,c.bgSeed+.04),"#EEF1F4",.1),J=Nt(xt(a,c.surfaceSeed),"#FFFFFF",.1),B=Nt("#E5E7EB",w,.16)):(D=Nt(xt(a,c.bgSeed),"#E8EBEF",.12),J=Nt(xt(a,c.surfaceSeed),"#FFFFFF",.12),B=Nt("#E5E7EB",a,Math.max(.08,c.borderSeed*.7)));let O=c.whiteCard?"#F8FAFC":Nt(J,xt(c.duo?w:a,Math.max(.05,(c.surfaceSeed||.1)*.55)),.35),$=dt(p,Math.min(.45,h*.55),14),Y=hr(dt(p,h*.3,34),.88),lt=hr(dt(p,h*.22,46),.76),yt=hr(M,.18),_t="0 4px 12px "+hr(M,.1)+", 0 1px 2px "+hr(M,.05);return{"--bg":D,"--surface":J,"--text":$,"--text-secondary":Y,"--text-muted":lt,"--border":B,"--border-focus":M,"--input-bg":O,"--primary":M,"--primary-hover":j,"--ring":yt,"--shadow":_t,"--radius":"18px","--radius-sm":"12px","--primary-container":L,"--secondary":w}}e(It,"buildMaterialSchemeVars");function Yt(t,r){let a=It(t,r);return{id:r,primary:a["--primary"],bg:a["--bg"],surface:a["--surface"],border:a["--border"],text:a["--text"]}}e(Yt,"buildSchemePreview");function Er(t){let r=Rt(t)||Jt()||ft;return Q.map(a=>Object.assign({},a,Yt(r,a.id)))}e(Er,"listSchemePreviews");function cr(){let t=document.documentElement;["--primary","--primary-hover","--border-focus","--ring","--bg","--surface","--text","--text-secondary","--text-muted","--border","--input-bg","--shadow","--primary-container","--secondary"].forEach(r=>t.style.removeProperty(r))}e(cr,"clearInlinePrimaryOverrides");function Jt(){return Rt(GM_getValue(T,""))||""}e(Jt,"getAccent");function Cr(){let t=String(GM_getValue(b,nt)||nt);return Q.some(r=>r.id===t)?t:nt}e(Cr,"getScheme");function Qe(t){let r=Q.some(a=>a.id===t)?t:nt;return GM_setValue(b,r),r}e(Qe,"setScheme");function Wp(t,r){if(!t)return;let a=Rt(t);if(a){if(GM_setValue(T,a),r&&r.scheme&&Qe(r.scheme),r&&r.skipTheme){let p=za(a,.15),s=hr(a,.15);document.documentElement.style.setProperty("--urppp-accent",a),document.documentElement.style.setProperty("--urppp-accent-hover",p),document.documentElement.style.setProperty("--urppp-accent-ring",s);try{ht()}catch{}try{Kt()}catch{}return}Wt("scu-red");try{ht()}catch{}try{Kt()}catch{}}}e(Wp,"applyAccent");function Xe(){try{let t=GM_getValue(S,"");if(!t)return it.slice();let r=JSON.parse(t);return Array.isArray(r)?r.filter(a=>typeof a=="string"&&/^#?[0-9a-fA-F]{6}$/i.test(a.replace("#",""))).map(a=>a.startsWith("#")?a.toUpperCase():"#"+a.toUpperCase()):it.slice()}catch{return it.slice()}}e(Xe,"getAccentPresets");function Up(t){let r=Rt(t||Jt()||ft);if(!r)return Xe();let a=Xe();return a=[r].concat(a.filter(p=>p.toLowerCase()!==r.toLowerCase())),a=a.slice(0,12),GM_setValue(S,JSON.stringify(a)),a}e(Up,"saveAccentPreset");function Qt(){try{return!!GM_getValue(m,!1)}catch{return!1}}e(Qt,"isThemeFollowSystem");function he(t){return GM_setValue(m,!!t),!!t}e(he,"setThemeFollowSystem");function Ke(){try{return!!GM_getValue(k,!1)}catch{return!1}}e(Ke,"isCleanDefault");function Gp(t){return GM_setValue(k,!!t),!!t}e(Gp,"setCleanDefault");function Ze(){try{return GM_getValue(g,"tab")==="direct"}catch{return!1}}e(Ze,"isCleanAnalysisDirect");function Jp(t){return GM_setValue(g,t==="direct"?"direct":"tab"),t==="direct"?"direct":"tab"}e(Jp,"setCleanAnalysis");function fr(){try{let t=GM_getValue(_,!0);return t!==!1&&t!==0&&t!=="0"}catch{return!0}}e(fr,"isAppleEdgeLine");function Vp(t){return GM_setValue(_,!!t),!!t}e(Vp,"setAppleEdgeLine");function Ga(){try{return!!GM_getValue(l,!1)}catch{return!1}}e(Ga,"isAutoUpdateCheck");function Yp(t){return GM_setValue(l,!!t),!!t}e(Yp,"setAutoUpdateCheck");function ge(t,r){try{let a=GM_getValue(t,"");if(a&&typeof a=="object")return a;if(typeof a=="string"&&a.trim())return JSON.parse(a)}catch{}return r}e(ge,"readJsonSetting");function fe(t,r){return GM_setValue(t,JSON.stringify(r)),r}e(fe,"writeJsonSetting");function xr(){return $a(ge(H,null))}e(xr,"getPrivacySettings");function ta(t){return fe(H,$a(t))}e(ta,"setPrivacySettings");function Pr(){return me(ge(F,null))}e(Pr,"getCustomIdentity");function Ja(t){return fe(F,me(t))}e(Ja,"setCustomIdentity");function ra(){let t=ge(G,{});return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}e(ra,"getScheduleFirstMondayMap");function Va(t,r){if(!t||!/^\d{4}-\d{2}-\d{2}$/.test(String(r||"")))return;let a=ra();a[String(t)]=String(r),fe(G,a)}e(Va,"rememberScheduleFirstMonday");function xe(){let t="";try{t=GM_getValue(Z,"")}catch{}let r=!!(t&&(typeof t!="string"||t.trim())),a=ge(Z,null);try{if(r&&(!a||typeof a!="object"||Array.isArray(a)))throw new Error("配置不是 JSON 对象");let p=a&&typeof a=="object"?a:{},s={enabled:!!p.enabled,mapping:_r(p.mapping||ce)};return et="",s}catch{return et=r?"JSON 映射配置损坏，已回退小爱课程兼容格式":"",{enabled:!1,mapping:_r(ce)}}}e(xe,"getScheduleJsonFormatSettings");function Ya(t){let r=t&&typeof t=="object"?t:{},a={enabled:!!r.enabled,mapping:_r(r.mapping||ce)};return et="",fe(Z,a)}e(Ya,"setScheduleJsonFormatSettings");function Qa(){try{let t=String(location.pathname||"").replace(/\/+$/,"")||"/";return t==="/"||t==="/index"||/\/index\.html?$/i.test(t)}catch{return!1}}e(Qa,"isHomePage");function ye(){try{return!!GM_getValue(q,!1)}catch{return!1}}e(ye,"isFollowUseDynamic");function ea(t){return GM_setValue(q,!!t),!!t}e(ea,"setFollowUseDynamic");function Qp(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch{return!1}}e(Qp,"systemPrefersDark");function yr(){return Qp()&&zr()?"dark":ye()&&Lr()?"scu-red":"default"}e(yr,"resolveFollowThemeName");function Yr(t,r){return t==="dark"?zr(r):t==="scu-red"?Lr(r):t==="default"}e(Yr,"isThemeModeAvailable");function Wt(t,r){r=r||{},!zr()&&Qt()&&he(!1),!Lr()&&ye()&&ea(!1),r.manual&&he(!1);let a;r.system||Qt()&&!r.manual?a=yr():(a=Et[t]?t:Vt()||"default",Et[a]||(a="default")),Yr(a)||(a="default");let p=Et[a]||Et.default;r.skipPersist||GM_setValue(v,a),cr();let s=document.getElementById("urppp-theme-vars")||(()=>{let E=document.createElement("style");return E.id="urppp-theme-vars",(document.head||document.documentElement).appendChild(E),E})(),i=Jt(),c=Object.assign({},p.vars);if(a==="scu-red"){let E=i||ft,M=Cr();c=Object.assign(c,It(E,M));let j=c["--primary"]||E,L=c["--primary-hover"]||za(j,.12);document.documentElement.style.setProperty("--urppp-accent",j),document.documentElement.style.setProperty("--urppp-accent-hover",L),document.documentElement.style.setProperty("--urppp-accent-ring",c["--ring"]||hr(j,.15)),document.documentElement.style.setProperty("--urppp-seed",E),document.documentElement.style.setProperty("--urppp-scheme",M)}else a==="default"?(document.documentElement.style.setProperty("--urppp-accent","#0071E3"),document.documentElement.style.setProperty("--urppp-accent-hover","#0077ED"),document.documentElement.style.setProperty("--urppp-accent-ring","rgba(0,113,227,0.28)"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme")):(document.documentElement.style.removeProperty("--urppp-accent"),document.documentElement.style.removeProperty("--urppp-accent-hover"),document.documentElement.style.removeProperty("--urppp-accent-ring"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme"));let h=":root {";for(let[E,M]of Object.entries(c))h+=`${E}:${M};`;h+="}",s.textContent=h,document.body&&(document.body.style.fontFamily=p.font);try{let E=document.documentElement;E.dataset.urpppTheme=a,E.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),E.classList.add("urppp-theme-"+a),E.classList.toggle("urppp-theme-follow",Qt()),document.body&&(document.body.dataset.urpppTheme=a,document.body.classList.toggle("urppp-dark",a==="dark"),document.body.classList.toggle("urppp-theme-follow",Qt()))}catch{}try{er()}catch{}try{ht()}catch{}try{Kt()}catch{}try{xo()}catch{}try{oi()}catch{}let w=document.getElementById("urppp-boot-loader");w&&(w.style.fontFamily=p.font)}e(Wt,"applyTheme");function Vt(){return GM_getValue(v,"default")}e(Vt,"getCurrent");function Xa(t){try{return!!GM_getValue("urppp_theme_css_"+t,"")}catch{return!1}}e(Xa,"themeDownloaded");function Xp(t){let r=document.getElementById("urppp-store-theme-"+t);return r||(r=document.createElement("style"),r.id="urppp-store-theme-"+t,r.dataset.urpppStoreTheme=t,(document.head||document.documentElement).appendChild(r)),r}e(Xp,"storeThemeStyleEl");function yl(t){let r=document.getElementById("urppp-store-theme-"+t);r&&r.remove()}e(yl,"removeStoreThemeStyle");function Ka(){u.forEach(t=>{let r="urppp_theme_css_"+t.id,a="";try{a=GM_getValue(r,"")||""}catch{}a&&(Xp(t.id).textContent=a)});try{er()}catch{}}e(Ka,"injectAllStoreThemeStyles");function dr(){let t=GM_getValue(d,"apple"),r=u.find(a=>a.id===t);return r&&r.ready&&(r.installed!==!1||Xa(r.id))?t:"apple"}e(dr,"getSkin");function aa(t,r){let a=t||dr(),p=u.find(s=>s.id===a);return!!(p&&p[r])}e(aa,"getSkinCapability");function zr(t){return aa(t,"dark")}e(zr,"skinSupportsDark");function Lr(t){return aa(t,"dynamic")}e(Lr,"skinSupportsDynamic");function Za(t){return aa(t,"palettes")}e(Za,"skinSupportsFixedPalettes");function Qr(t){return rt.find(r=>r.id===t)||rt[0]}e(Qr,"getBrutalPaletteById");function to(){let t=String(GM_getValue(N,"acid")||"acid"),r=Qr(t);return r.id===V?Qr("acid"):r}e(to,"getBrutalSelectedPalette");function ro(){let t=String(GM_getValue(z,V)||V);return Qr(t)}e(ro,"getBrutalActivePalette");function eo(t,r){let a=r||{},p=Qr(t);a.select&&p.id!==V&&GM_setValue(N,p.id),GM_setValue(z,p.id);try{er()}catch{}try{ht()}catch{}try{Kt()}catch{}try{let s=document.getElementById("urppp-clean-root");s&&typeof s.__syncCleanThemeDots=="function"&&s.__syncCleanThemeDots()}catch{}}e(eo,"setBrutalPalette");function Kp(t){let r=t||dr();return r==="flat"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"2px","--urppp-card-border":"2px solid var(--text)","--urppp-input-border":"2px solid var(--text)","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:r==="organic"?{"--radius":"22px","--radius-sm":"14px","--shadow":"0 2px 10px rgba(92,64,51,0.06)","--border-w":"1px","--urppp-card-border":"1px solid #E7E0D6","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"1px solid var(--border)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--input-bg)","--urppp-action-color":"var(--primary)","--urppp-menu-radius":"14px","--urppp-menu-border":"1px solid var(--border)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}:r==="editorial"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"none","--urppp-action-radius":"0px","--urppp-action-border":"none","--urppp-action-shadow":"none","--urppp-action-bg":"transparent","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"1px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"transparent","--urppp-menu-color":"var(--text)"}:r==="brutal"?{"--radius":"0px","--radius-sm":"0px","--shadow":"6px 6px 0 #000","--border-w":"3px","--urppp-card-border":"3px solid #000","--urppp-input-border":"2px solid #000","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"3px 3px 0 var(--text)","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"3px 3px 0 var(--text)","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:r==="neu"?{"--radius":"16px","--radius-sm":"12px","--shadow":"5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"1px solid rgba(38,49,66,.16)","--urppp-input-shadow":"inset 2px 2px 4px rgba(38,49,66,.16), inset -2px -2px 4px rgba(255,255,255,.72)","--urppp-action-radius":"12px","--urppp-action-border":"none","--urppp-action-shadow":"var(--shadow)","--urppp-action-bg":"var(--bg)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"12px","--urppp-menu-border":"none","--urppp-menu-shadow":"var(--shadow)","--urppp-menu-bg":"var(--bg)","--urppp-menu-color":"var(--text)"}:{"--radius":"18px","--radius-sm":"12px","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--border-w":"0px","--urppp-card-border":r==="apple"&&fr()?"1px solid rgba(0,0,0,0.08)":"none","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"none","--urppp-action-shadow":"0 2px 6px var(--ring)","--urppp-action-bg":"var(--primary)","--urppp-action-color":"var(--surface)","--urppp-menu-radius":"12px","--urppp-menu-border":r==="apple"&&fr()?"1px solid var(--border)":"none","--urppp-menu-shadow":"0 1px 3px rgba(0,0,0,.08)","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}}e(Kp,"getSkinShapeOverrides");function qr(){try{let t=dr();if(t==="apple")return fr()?"1px solid rgba(0,0,0,0.08)":"none";if(t==="flat")return"2px solid var(--text)";if(t==="organic")return"1px solid #E7E0D6";if(t==="brutal")return"3px solid var(--text)";if(t==="editorial"||t==="neu")return"none"}catch{}return"1px solid var(--border)"}e(qr,"urpppCardBorderValue");function er(){let t=dr();try{document.documentElement.setAttribute("data-urppp-skin",t)}catch{}try{document.body&&document.body.setAttribute("data-urppp-skin",t)}catch{}try{let r=t==="apple"&&fr();document.documentElement.setAttribute("data-urppp-apple-edge",r?"1":"0"),document.body&&document.body.setAttribute("data-urppp-apple-edge",r?"1":"0")}catch{}try{let r=document.getElementById("urppp-skin-vars")||(()=>{let i=document.createElement("style");return i.id="urppp-skin-vars",(document.head||document.documentElement).appendChild(i),i})(),a=Kp(t),p=":root, html[data-urppp-skin] {";if(Object.keys(a).forEach(i=>{p+=i+":"+a[i]+";"}),p+="}",p+=".urppp-nav-dot.urppp-theme-disabled{opacity:.42!important;cursor:not-allowed!important;box-shadow:none!important;filter:grayscale(1)!important;transform:none!important;}",t==="flat"||t==="organic"||t==="brutal"||t==="neu"){if(t==="brutal"){let i=ro();p+='html[data-urppp-skin="brutal"]{--brutal-accent:'+i.accent+";--brutal-secondary:"+i.secondary+";--brutal-info:"+i.info+";--brutal-warning:"+i.warning+";}"}r.textContent=p;return}if(t==="apple"){let i=fr(),c=i?"1px solid rgba(0,0,0,0.08)":"none",h=i?"1px solid rgba(255,255,255,0.10)":"none",w=i?"1px solid rgba(0,0,0,0.06)":"none";p+=['html[data-urppp-skin="apple"]{--shadow:0 6px 20px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);--border:'+(i?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.04)")+";}",'html[data-urppp-skin="apple"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="apple"]{--shadow:0 10px 28px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.04);--border:'+(i?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)")+";}",'html[data-urppp-skin="apple"] .widget-box,html[data-urppp-skin="apple"] .widget-box.transparent,html[data-urppp-skin="apple"] .panel,html[data-urppp-skin="apple"] .panel-default,html[data-urppp-skin="apple"] .well,html[data-urppp-skin="apple"] .thumbnail,html[data-urppp-skin="apple"] .infobox,html[data-urppp-skin="apple"] .profile-user-info,html[data-urppp-skin="apple"] .profile-user-info-striped,html[data-urppp-skin="apple"] .modal-content,html[data-urppp-skin="apple"] fieldset,html[data-urppp-skin="apple"] .urppp-stat-card,html[data-urppp-skin="apple"] .urppp-db-card,html[data-urppp-skin="apple"] .urppp-db-panel,html[data-urppp-skin="apple"] #urppp-dashboard .widget-box,html[data-urppp-skin="apple"] #urppp-root .uc,html[data-urppp-skin="apple"] #urppp-clean-root .uc-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-modal,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top,html[data-urppp-skin="apple"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="apple"] .urppp-card,html[data-urppp-skin="apple"] #urppp-dashboard .urppp-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+c+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"].urppp-theme-dark .widget-box,html[data-urppp-skin="apple"].urppp-theme-dark .panel,html[data-urppp-skin="apple"].urppp-theme-dark .profile-user-info,html[data-urppp-skin="apple"].urppp-theme-dark .modal-content,html[data-urppp-skin="apple"].urppp-theme-dark .urppp-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-root .uc{border:'+h+"!important;}",'html[data-urppp-skin="apple"] .page-content .widget-box,html[data-urppp-skin="apple"] #page-content-template .widget-box,html[data-urppp-skin="apple"] html body .page-content .profile-user-info.setLabelWidth{border:'+c+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"] .btn,html[data-urppp-skin="apple"] .btn-default,html[data-urppp-skin="apple"] .btn-white,html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] .btn-success,html[data-urppp-skin="apple"] .btn-warning,html[data-urppp-skin="apple"] .btn-danger,html[data-urppp-skin="apple"] a.btn,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn{border-color:transparent!important;box-shadow:0 1px 2px rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn.primary{border:none!important;}','html[data-urppp-skin="apple"] .table,html[data-urppp-skin="apple"] table,html[data-urppp-skin="apple"] .table-bordered,html[data-urppp-skin="apple"] .table-bordered>thead>tr>th,html[data-urppp-skin="apple"] .table-bordered>tbody>tr>td{border-color:rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"].urppp-theme-dark .table,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>thead>tr>th,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>tbody>tr>td{border-color:rgba(255,255,255,.06)!important;}','html[data-urppp-skin="apple"] .nav-tabs>li>a,html[data-urppp-skin="apple"] .nav-tabs{border-color:transparent!important;}','html[data-urppp-skin="apple"] .urppp-nav-link{border:none!important;}','html[data-urppp-skin="apple"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="apple"] #urppp-clean-root .uc-grid-cell{border-color:'+(i?"rgba(0,0,0,0.06)":"transparent")+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+w+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-dots span{border-radius:50%!important;border:2px solid var(--border)!important;box-shadow:none!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important;background-clip:padding-box!important;flex:0 0 auto!important;}','html[data-urppp-skin="apple"] .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary)!important;box-shadow:0 0 0 3px var(--ring)!important;}','html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-dots span[data-theme="scu-red"]{border-radius:50%!important;border:2px solid var(--border)!important;}'].join("")}else t==="editorial"&&(p+=`
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
        `);r.textContent=p;let s=document.head||document.documentElement;r.parentNode===s&&s.lastElementChild!==r&&s.appendChild(r)}catch(r){try{console.warn("[URP++] applySkinAttr",r)}catch{}}setTimeout(()=>{try{Gt(document)}catch{}},0)}e(er,"applySkinAttr");function vl(t){let r=u.find(a=>a.id===t&&a.ready&&(a.installed!==!1||Xa(a.id)));if(!r)return!1;GM_setValue(d,r.id);try{r.dynamic||ea(!1),!r.dark&&Qt()&&he(!1);let a=Qt(),p=a?yr():Vt(),s=Yr(p,r.id)?p:"default";er(),Wt(s,{system:a})}catch{try{er()}catch{}}try{Kt()}catch{}try{ht()}catch{}try{let a=document.getElementById("urppp-clean-root");a&&typeof a.__syncCleanThemeDots=="function"&&a.__syncCleanThemeDots()}catch{}return!0}e(vl,"setSkin");function Zp(){if(!window.__urpppSystemThemeBound&&window.matchMedia){window.__urpppSystemThemeBound=!0;try{let t=window.matchMedia("(prefers-color-scheme: dark)"),r=e(()=>{if(Qt())try{Wt(yr(),{system:!0})}catch{}},"onChange");t.addEventListener?t.addEventListener("change",r):t.addListener&&t.addListener(r)}catch{}}}e(Zp,"bindSystemThemeListener");try{Qt()?Wt(yr(),{system:!0}):Wt(Vt())}catch{}try{er()}catch{}try{Zp()}catch{}function ti(t){let r=String(document.body&&document.body.innerText||t&&t.innerText||"").replace(/\s+/g," ").trim(),a=[/token\s*校验失败[！!]?/i,/令牌\s*校验失败[！!]?/i,/验证码.{0,12}(?:错误|失败|过期)[！!]?/i,/(?:用户名|账号|学号).{0,12}(?:密码).{0,12}(?:错误|失败)[！!]?/i,/登录.{0,12}(?:错误|失败)[！!]?/i];for(let p of a){let s=r.match(p);if(s)return s[0].trim()}return""}e(ti,"extractLoginErrorMessage");function ao(){let t=location.pathname,r=document.getElementById("formContent"),a=document.querySelector(".form-signin");if(!r||!a){setTimeout(ao,50);return}if(r.querySelector(":scope > #urppp-root"))return;let p=ti(r),s=a.querySelector('a[onclick*="toModifyPwd"]'),i=(()=>{let O=r.querySelector(".fadeIn.first svg");return O?O.outerHTML:""})(),c=(()=>{let O=document.querySelector("#tocas a");return O?O.href:"https://id.scu.edu.cn/"})();for(let O of r.children)O.style.display="none";r.style.cssText="max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;";let h=location.pathname==="/loginEn",w=e((O,$)=>h?$:O,"t");r.insertAdjacentHTML("afterbegin",`
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
          <h1>${w("四川大学教务管理系统","SCU Academic System")}</h1>
          <p>${w("学生端 · 欢迎登录","Student Portal · Welcome")}</p>
        </div>

        <div class="ut" id="urppp-tabs">
          <button class="ac" data-mode="account">${w("账号登录","Account")}</button>
          <button data-mode="sso">${w("统一认证","SSO")}</button>
        </div>

        ${p?`<div class="urppp-login-error" role="alert">${At(p)}</div>`:""}

        <div class="ufb" id="urppp-form">
          <div class="ufg">
            <label class="ufl" for="urppp-user">${w("学号","Student ID")}</label>
            <input class="ui" id="urppp-user" type="text" placeholder="${w("请输入学号","Enter student ID")}" autocomplete="username">
          </div>
          <div class="ufg">
            <label class="ufl" for="urppp-pass">${w("密码","Password")}</label>
            <input class="ui" id="urppp-pass" type="password" placeholder="${w("请输入密码","Enter password")}" autocomplete="current-password">
          </div>
          <div class="ucr">
            <div class="ufg ufg-cap">
              <label class="ufl" for="urppp-cap">${w("验证码","Captcha")}</label>
              <div class="ucap-input-wrap">
                <input class="ui" id="urppp-cap" type="text" placeholder="${w("请输入","Enter")}" maxlength="4" autocomplete="off">
                <div class="uci-wrap" id="urppp-capwrap" title="${w("点击刷新","Refresh")}">
                  <img class="uci" id="urppp-capimg" src="" alt="Captcha">
                </div>
              </div>
            </div>
          </div>
          <button class="ubtn" id="urppp-submit">${w("登 录","Sign In")}</button>
        </div>

        <div class="uft">
          <a href="javascript:void(0)" id="urppp-forgot">${w("忘记密码？","Forgot password?")}</a>
          <a href="${h?"/login":"/loginEn"}">${h?"中文":"EN"}</a>
        </div>

        <div class="us" id="urppp-dots">
          <span data-theme="default" title="简约白" style="background:#F5F5F7;box-shadow:inset 0 0 0 1px #D2D2D7"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="动态配色" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);let E=r.querySelector("#urppp-root");[["#urppp-user","#input_username"],["#urppp-pass","#input_password"],["#urppp-cap","#input_checkcode"]].forEach(([O,$])=>{let Y=E.querySelector(O),lt=document.querySelector($);Y&&lt&&(lt.value&&(Y.value=lt.value),Y.addEventListener("input",()=>{lt.value=Y.value}))});let M=E.querySelector("#urppp-capimg"),j=E.querySelector("#urppp-capwrap"),L=document.querySelector(".form-signin img");if(M&&L){M.src=L.src;let O=e(()=>{let $=L.src.replace(/\?.*/,"")+"?"+Date.now();L.src=$,M.src=$},"refreshCap");j?j.addEventListener("click",O):M.addEventListener("click",O)}E.querySelectorAll(".ut button").forEach(O=>{O.addEventListener("click",()=>{if(O.dataset.mode==="sso"){location.href=c;return}E.querySelectorAll(".ut button").forEach(lt=>lt.classList.remove("ac")),O.classList.add("ac");let $=E.querySelector("#urppp-form"),Y=E.querySelector("#urppp-sso");$&&($.style.display="block"),Y&&(Y.style.display="none")})});let D=E.querySelector("#urppp-submit");D.addEventListener("click",()=>{if(D.dataset.submitting==="1")return;D.dataset.submitting="1",D.disabled=!0;let O=document.getElementById("loginButton");O?O.click():typeof a.requestSubmit=="function"?a.requestSubmit():a.submit(),setTimeout(()=>{D.dataset.submitting="0",D.disabled=!1},1500)}),E.querySelectorAll(".ui").forEach(O=>{O.addEventListener("keydown",$=>{$.key==="Enter"&&D.click()})}),E.querySelector("#urppp-forgot").addEventListener("click",O=>{O.preventDefault(),s&&s.click()});let J=E.querySelector("#urppp-dots"),B=e(()=>{if(!J)return;let O=Vt();J.querySelectorAll("span").forEach(Y=>{Y.classList.toggle("ac",Y.dataset.theme===O)});let $=J.querySelector('span[data-theme="scu-red"]');if($){let Y=Jt()||ft;try{let lt=Yt(Y,Cr());$.style.background="linear-gradient(135deg, "+lt.primary+" 0 55%, "+lt.surface+" 55% 100%)"}catch{$.style.background=Y}}},"syncLoginDots");J&&(J.querySelectorAll("span").forEach(O=>{O.addEventListener("click",()=>{Wt(O.dataset.theme,{manual:!0}),B()})}),B()),console.log("[URP++] 登录界面已重建"),setTimeout(()=>{document.body.classList.add("urppp-ready"),vt()},100)}e(ao,"rebuild");let{beautifyBreadcrumbs:ve}=Hp({});function oa(){try{document.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(t=>{if(t.classList.contains("setLabelWidth")||t.classList.contains("urppp-query-form")||t.querySelector(".urppp-query-pair"))return;let r=Array.from(t.querySelectorAll(":scope > .profile-info-row, .profile-info-row"));!r.length||r.some(p=>Array.from(p.children).filter(s=>s.classList&&s.classList.contains("profile-info-name")).length>=2)||(t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("display","block","important"),Ae(t),r.forEach(p=>{p.classList.remove("urppp-query-row","urppp-dual-pair"),delete p.dataset.urpppQueryDone,delete p.dataset.urpppQueryCols;let s=Array.from(p.querySelectorAll(":scope > .urppp-query-pair"));if(s.length){let i=[];for(s.forEach(c=>Array.from(c.children).forEach(h=>i.push(h)));p.firstChild;)p.removeChild(p.firstChild);i.forEach(c=>p.appendChild(c))}p.style.setProperty("display","grid","important"),p.style.setProperty("grid-template-columns","140px minmax(0,1fr)","important"),p.style.setProperty("align-items","stretch","important"),p.style.setProperty("width","100%","important"),Array.from(p.children).forEach(i=>{i.classList&&(i.style.setProperty("float","none","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("box-sizing","border-box","important"))})}))})}catch(t){console.warn("[URP++] single pair profile fix failed",t)}}e(oa,"fixSinglePairProfileForms");function we(){let t=document.querySelector(".page-content")||document.getElementById("page-content-template");t&&(t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(r=>{if(!r.querySelector(".setLabelWidth"))return;let a=r.querySelector(".setLabelWidth");a&&(r.querySelectorAll("h4.header, h3.header, .header.smaller, .header").forEach(p=>{a.contains(p)||p.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_FOLLOWING&&(p.classList.add("urppp-section-label"),["background","background-color","background-image","border","box-shadow","border-radius","padding","margin","min-height"].forEach(s=>{p.style.removeProperty(s)}),p.style.setProperty("background","transparent","important"),p.style.setProperty("background-color","transparent","important"),p.style.setProperty("background-image","none","important"),p.style.setProperty("border","0 none transparent","important"),p.style.setProperty("box-shadow","none","important"),p.style.setProperty("border-radius","0","important"),p.style.setProperty("padding","4px 2px 10px","important"),p.style.setProperty("margin","0 0 8px 0","important"),p.style.setProperty("min-height","0","important"))}),a.classList.remove("urppp-query-form"),a.style.setProperty("padding","0","important"),a.style.setProperty("overflow","hidden","important"),a.style.setProperty("background","var(--surface)","important"),a.style.setProperty("border",qr(),"important"),a.style.setProperty("border-radius","12px","important"),a.style.setProperty("box-shadow","none","important"))}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(r=>{r.classList.remove("urppp-query-form"),r.querySelectorAll(".profile-info-row").forEach(a=>{a.classList.remove("urppp-query-row"),delete a.dataset.urpppQueryDone,delete a.dataset.urpppQueryCols;let p=Array.from(a.querySelectorAll(":scope > .urppp-query-pair"));if(p.length){let s=[];for(p.forEach(i=>{Array.from(i.children).forEach(c=>s.push(c))});a.firstChild;)a.removeChild(a.firstChild);s.forEach(i=>a.appendChild(i))}})}),t.querySelectorAll(".setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row").forEach(r=>{let a=Array.from(r.querySelectorAll(":scope > .urppp-query-pair"));if(a.length){let i=[];for(a.forEach(c=>{Array.from(c.children).forEach(h=>i.push(h))});r.firstChild;)r.removeChild(r.firstChild);i.forEach(c=>r.appendChild(c))}r.classList.remove("urppp-query-row"),delete r.dataset.urpppQueryDone,delete r.dataset.urpppQueryCols;let p=Array.from(r.children).filter(i=>i.classList&&(i.classList.contains("profile-info-name")||i.classList.contains("profile-info-value")));p.filter(i=>i.classList.contains("profile-info-name")).length>=2?(r.classList.add("urppp-dual-pair"),r.style.setProperty("display","grid","important"),r.style.setProperty("grid-template-columns","112px minmax(140px,1fr) 112px minmax(140px,1fr)","important"),r.style.setProperty("align-items","stretch","important"),r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("float","none","important"),p.forEach(i=>{i.style.setProperty("float","none","important"),i.style.setProperty("clear","none","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("min-width","0","important"),i.style.setProperty("box-sizing","border-box","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.classList.contains("profile-info-value")?(i.style.removeProperty("width"),i.style.setProperty("width","auto","important"),i.style.setProperty("justify-content","flex-start","important"),i.style.setProperty("white-space","normal","important"),i.style.setProperty("word-break","normal","important")):(i.style.setProperty("justify-content","flex-end","important"),i.style.setProperty("white-space","nowrap","important"))})):r.classList.remove("urppp-dual-pair")}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(r=>{r.classList.remove("urppp-query-form"),r.style.cssText=(r.getAttribute("style")||"").replace(/padding\s*:[^;]+;?/gi,""),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("overflow","hidden","important"),r.style.setProperty("border",qr(),"important"),r.style.setProperty("box-shadow","none","important"),r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("box-sizing","border-box","important"),r.style.setProperty("margin","0 0 16px 0","important"),r.style.setProperty("padding","0","important");let a=r.closest(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8")||r.parentElement;a&&Array.from(a.querySelectorAll("h4.header, h3.header, .header.smaller")).forEach(p=>{r.contains(p)||p.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING&&(p.classList.add("urppp-section-label"),p.style.setProperty("background","transparent","important"),p.style.setProperty("background-color","transparent","important"),p.style.setProperty("background-image","none","important"),p.style.setProperty("border","0 none transparent","important"),p.style.setProperty("box-shadow","none","important"),p.style.setProperty("border-radius","0","important"),p.style.setProperty("padding","4px 2px 10px","important"),p.style.setProperty("margin","0 0 8px 0","important"),p.style.setProperty("min-height","0","important"))})}),t.querySelectorAll(".urppp-col-row").forEach(r=>{r.classList.remove("urppp-col-row"),["display","flex-wrap","gap","align-items","width","box-sizing"].forEach(a=>r.style.removeProperty(a))}),t.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach(r=>{["float","flex","width","max-width","padding-left","padding-right","box-sizing"].forEach(a=>{r.style.getPropertyPriority(a)==="important"&&r.style.removeProperty(a)}),r.style.setProperty("padding-left","0","important"),r.style.setProperty("box-sizing","border-box","important")}),t.querySelectorAll(".col-xs-4, .col-sm-4, .col-md-4").forEach(r=>{r.style.setProperty("padding-right","16px","important")}),t.querySelectorAll(".col-xs-8, .col-sm-8, .col-md-8").forEach(r=>{r.style.setProperty("padding-left","0","important"),r.style.setProperty("padding-right","0","important")}),t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(r=>{r.querySelector(".setLabelWidth")&&r.querySelectorAll(":scope > h4.header, :scope > .header, :scope > .header.smaller").forEach(a=>{a.style.cssText+=";background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;border-radius:0!important;padding:4px 2px 10px!important;margin:0 0 8px 0!important;min-height:0!important;"})}),t.querySelectorAll(".urppp-section-title-wrap").forEach(r=>{let a=r.querySelector("h4.header, h3.header, h5.header, .header.smaller");if(!a){r.remove();return}let p=r.nextElementSibling;for(;p&&!p.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]');)p=p.nextElementSibling;let s=p&&(p.querySelector(".col-xs-4, .col-sm-4, .col-md-4")||Array.from(p.children).find(i=>/col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(i.className||"")));s&&(s.insertBefore(a,s.firstChild),delete a.dataset.urpppHoisted,a.style.removeProperty("width"),a.style.removeProperty("max-width"),a.style.removeProperty("margin-left"),a.style.removeProperty("margin-right"),a.style.removeProperty("box-sizing"),a.style.removeProperty("position"),a.style.removeProperty("left")),r.remove()}))}e(we,"alignRollInfoLayout");function ke(){let t=typeof unsafeWindow<"u"?unsafeWindow:window;return t.jQuery||t.$||window.jQuery||window.$||null}e(ke,"pageJQuery");function ri(t){return t?t.id&&String(t.id).indexOf("pagination_pageSize_")===0?!0:!!(t.closest&&t.closest('#urppagebar, .urppagebreak, .dataTables_paginate, [id^="sample-table-2_paginate_"]')):!1}e(ri,"isPagebarSelect");function oo(t){if(t){try{let r=ke();r&&r.fn&&r(t).data("chosen")&&r(t).chosen("destroy")}catch{}try{if(t.parentElement&&t.parentElement.querySelectorAll(":scope > .chosen-container").forEach(r=>{try{r.remove()}catch{}}),t.nextElementSibling&&t.nextElementSibling.classList.contains("chosen-container"))try{t.nextElementSibling.remove()}catch{}}catch{}t.classList.remove("urppp-chosen-hidden","chzn-done","chosen");try{delete t.dataset.urpppChosen}catch{}t.style.setProperty("display","inline-block","important")}}e(oo,"destroyPagebarChosen");let no=0,po=!1;function ei(){if(po)return;po=!0;let t=e(r=>{if(Date.now()<no){try{r.preventDefault()}catch{}try{r.stopPropagation()}catch{}}},"guard");document.addEventListener("mousedown",t,!0),document.addEventListener("mouseup",t,!0),document.addEventListener("click",t,!0)}e(ei,"bindChosenPickGuard");function na(t){if(!t||t.__urpppChosenNoPierce)return;t.__urpppChosenNoPierce=!0,ei();let r=t.querySelector(".chosen-drop"),a=e(p=>{let s=p.target;!s||!s.closest||!s.closest(".chosen-results li")||(no=Date.now()+350)},"onPick");t.addEventListener("mouseup",a,!1),t.addEventListener("touchend",a,!1),r&&(r.addEventListener("mouseup",a,!1),r.addEventListener("touchend",a,!1))}e(na,"bindChosenNoPierce");function pa(t=document){try{t.querySelectorAll(".chosen-container").forEach(na)}catch{}}e(pa,"bindAllChosenNoPierce");function ur(){try{let t=ke();if(!t||!t.fn||typeof t.fn.chosen!="function")return!1;let r=document.querySelectorAll(".profile-user-info, .urppp-query-form, .profile-info-row, form"),a=new Set,p=[];if(r.forEach(s=>{s.querySelectorAll("select").forEach(i=>{a.has(i)||(a.add(i),p.push(i))})}),document.querySelectorAll("select.value_element, .profile-info-value > select").forEach(s=>{a.has(s)||(a.add(s),p.push(s))}),p.forEach(s=>{if(!s||s.multiple||s.disabled||s.size&&s.size>1)return;if(ri(s)){oo(s);return}let i=t(s);if(!!i.data("chosen")||s.classList.contains("chzn-done")||!!(s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container"))||!!(s.parentElement&&s.parentElement.querySelector(":scope > .chosen-container"))){s.dataset.urpppChosen="1",s.classList.add("urppp-chosen-hidden"),s.style.setProperty("display","none","important");let h=s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container")?s.nextElementSibling:s.parentElement&&s.parentElement.querySelector(":scope > .chosen-container");h&&na(h);return}try{s.classList.contains("select")||s.classList.add("select");try{i.data("chosen")&&i.chosen("destroy")}catch{}i.chosen({allow_single_deselect:!0,search_contains:!0,width:"100%",no_results_text:"无匹配项",disable_search_threshold:0}),s.dataset.urpppChosen="1",s.classList.add("urppp-chosen-hidden"),s.style.setProperty("display","none","important");let h=s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container")?s.nextElementSibling:s.parentElement&&s.parentElement.querySelector(".chosen-container");h&&(h.style.setProperty("width","100%","important"),h.style.setProperty("min-width","0","important"),h.style.setProperty("display","block","important")),h&&na(h)}catch(h){console.warn("[URP++] chosen init failed",s,h)}}),!window.__urpppChosenHtmlPatch){window.__urpppChosenHtmlPatch=!0;let s=t.fn.html;t.fn.html=function(){let i=s.apply(this,arguments);if(arguments.length)try{this.filter("select").add(this.find("select")).each(function(){let c=t(this);if(c.data("chosen")||c.next(".chosen-container").length)try{c.trigger("chosen:updated")}catch{}})}catch{}return i}}return!0}catch(t){return console.warn("[URP++] ensureQueryChosen failed",t),!1}}e(ur,"ensureQueryChosen");function io(){if(window.__urpppChosenScheduleBound)return;window.__urpppChosenScheduleBound=!0,[0,200,600,1500,3e3].forEach(p=>setTimeout(()=>{ur(),pa()},p));let r=0,a=setInterval(()=>{r+=1;let p=ur();pa(),(p&&r>3||r>15)&&clearInterval(a)},500)}e(io,"scheduleEnsureQueryChosen");let{beautifyPagebar:so}=Zn({destroyPagebarChosen:oo}),{scheduleBeautifyPagebar:lo}=Kn({beautifyPagebar:so});function ia(){try{document.querySelectorAll("#drag-ul, ul#drag-ul").forEach(t=>{if(!t)return;let r=Array.from(t.children).filter(a=>a.tagName==="LI");if(!r.length){t.classList.add("urppp-empty"),t.style.setProperty("display","none","important");let a=t.closest("#xq-section, .widget-main, .widget-body");a&&!a.querySelector("li")&&(a.classList.add("urppp-empty"),a.style.setProperty("display","none","important"));return}t.classList.remove("urppp-empty"),t.classList.add("urppp-drag-ul"),t.style.removeProperty("display"),t.style.setProperty("height","auto","important"),t.style.setProperty("min-height","0","important"),r.forEach(a=>{let p=(a.textContent||"").replace(/\s+/g," ").trim(),s=(a.getAttribute("onclick")||"").includes("goDetail")||a.classList.contains("ui-selectee")||a.classList.contains("jc-future")||!!a.querySelector("a");!s&&/校区/.test(p)&&p.length<=12?(a.classList.add("xq-section"),a.classList.remove("ui-selectee","jc-future","urppp-building-active")):s&&!a.classList.contains("jc-future")&&a.classList.add("ui-selectee")})}),window.__urpppBuildingActiveBound||(window.__urpppBuildingActiveBound=!0,document.addEventListener("click",t=>{let r=t.target&&t.target.closest?t.target.closest("#drag-ul > li"):null;if(!r||r.classList.contains("xq-section")||r.classList.contains("jc-future"))return;let a=r.parentElement;a&&(a.querySelectorAll("li.urppp-building-active, li.ui-selected").forEach(p=>{p.classList.remove("urppp-building-active","ui-selected")}),r.classList.add("urppp-building-active","ui-selected"))},!0))}catch(t){console.warn("[URP++] free classroom list beautify failed",t)}}e(ia,"beautifyFreeClassroomList");function Ae(t){if(!t||!t.style)return;if(t.classList.contains("setLabelWidth")){t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",qr(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 16px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important");return}let r=!!(t.closest&&t.closest(".widget-box, .widget-main, .widget-body, .panel"));t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("min-width","0","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("clear","both","important");let a=t.parentElement&&t.parentElement.tagName==="FORM"?t.parentElement:null;a&&(a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("display","block","important"),a.style.setProperty("float","none","important"),a.style.setProperty("box-sizing","border-box","important"),a.style.setProperty("margin","0","important"));let p=t.closest&&t.closest(".tab-pane, .tab-content");if(p&&(p.style.setProperty("width","100%","important"),p.style.setProperty("max-width","100%","important"),p.style.setProperty("box-sizing","border-box","important")),r){t.style.setProperty("background","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("margin","0","important"),t.style.setProperty("box-shadow","none","important");return}t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",qr(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 18px 0","important"),!t.classList.contains("setLabelWidth")&&(t.classList.contains("urppp-query-form")||!!t.querySelector(".urppp-query-pair, .chosen-container"))?(t.style.setProperty("padding","14px 16px","important"),t.style.setProperty("overflow","visible","important")):(t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important"))}e(Ae,"ensureProfileCardShell");function Xr(){try{ur(),document.querySelectorAll(".page-content .profile-user-info, #page-content-template .profile-user-info").forEach(p=>{Ae(p)});let t=e(p=>{let s=p.closest(".profile-user-info, .urppp-query-form")||p.parentElement;if(!s)return Math.min(Math.max(p.querySelectorAll(":scope > .urppp-query-pair").length,1),4);let i=0;return s.querySelectorAll(":scope > .profile-info-row, .profile-info-row").forEach(c=>{let h=c.querySelectorAll(":scope > .urppp-query-pair").length;h>i&&(i=h)}),Math.min(Math.max(i,1),4)},"getFormQueryCols"),r=e(p=>{let s=Array.from(p.querySelectorAll(":scope > .urppp-query-pair")),i=t(p);p.classList.add("urppp-query-row"),p.style.setProperty("display","grid","important"),p.style.removeProperty("grid-template-columns"),p.style.setProperty("column-gap","14px","important"),p.style.setProperty("row-gap","10px","important"),p.style.setProperty("align-items","center","important"),p.style.setProperty("width","100%","important"),p.style.setProperty("max-width","100%","important"),p.style.setProperty("box-sizing","border-box","important"),p.dataset.urpppQueryCols=String(i),s.forEach(c=>{c.style.removeProperty("grid-column")}),s.forEach(c=>{c.style.setProperty("display","flex","important"),c.style.setProperty("align-items","center","important"),c.style.setProperty("width","100%","important"),c.style.setProperty("min-width","0","important"),c.style.setProperty("max-width","100%","important"),c.style.setProperty("box-sizing","border-box","important"),c.style.removeProperty("flex");let h=c.querySelector(".profile-info-name"),w=c.querySelector(".profile-info-value");h&&(h.style.setProperty("float","none","important"),h.style.setProperty("display","flex","important"),h.style.setProperty("align-items","center","important"),h.style.setProperty("justify-content","flex-end","important"),h.style.setProperty("flex","0 0 var(--urppp-qlabel, 84px)","important"),h.style.setProperty("width","var(--urppp-qlabel, 84px)","important"),h.style.setProperty("min-width","var(--urppp-qlabel, 84px)","important"),h.style.setProperty("max-width","var(--urppp-qlabel-max, 96px)","important"),h.style.setProperty("margin","0","important"),h.style.setProperty("margin-left","0","important"),h.style.setProperty("padding","0 8px 0 0","important"),h.style.setProperty("background","transparent","important"),h.style.setProperty("border","none","important"),h.style.setProperty("border-right","none","important")),w&&(w.style.setProperty("float","none","important"),w.style.setProperty("display","flex","important"),w.style.setProperty("align-items","center","important"),w.style.setProperty("flex","1 1 auto","important"),w.style.setProperty("width","auto","important"),w.style.setProperty("min-width","0","important"),w.style.setProperty("max-width","none","important"),w.style.setProperty("margin","0","important"),w.style.setProperty("margin-left","0","important"),w.style.setProperty("padding","0","important"),w.style.setProperty("background","transparent","important"),w.style.setProperty("border","none","important"),w.querySelectorAll("input, select, .chosen-container, .form-control").forEach(E=>{E.style.setProperty("width","100%","important"),E.style.setProperty("min-width","0","important"),E.style.setProperty("max-width","none","important")})),c.querySelectorAll(".chosen-container").forEach(E=>{let M=E.previousElementSibling;M&&M.tagName==="SELECT"&&(M.style.setProperty("display","none","important"),M.classList.add("urppp-chosen-hidden"));let j=E.parentElement&&E.parentElement.querySelector("select");j&&(j.style.setProperty("display","none","important"),j.classList.add("urppp-chosen-hidden")),E.style.setProperty("width","100%","important"),E.style.setProperty("min-width","0","important"),E.style.setProperty("max-width","none","important");let L=E.querySelector(".chosen-single");if(L){L.style.setProperty("width","100%","important"),L.style.setProperty("max-width","none","important"),L.style.setProperty("display","flex","important"),L.style.setProperty("align-items","center","important"),L.style.setProperty("height","34px","important"),L.style.setProperty("line-height","normal","important");let D=L.querySelector(":scope > span, span");D&&(D.style.setProperty("line-height","normal","important"),D.style.setProperty("height","auto","important"),D.style.setProperty("margin-top","0","important"),D.style.setProperty("padding-top","0","important"));let J=L.querySelector("div");if(J){J.style.setProperty("display","flex","important"),J.style.setProperty("align-items","center","important"),J.style.setProperty("justify-content","center","important"),J.style.setProperty("top","0","important"),J.style.setProperty("bottom","0","important"),J.style.setProperty("height","auto","important");let B=J.querySelector("b");B&&(B.style.setProperty("margin","0","important"),B.style.setProperty("background-position","center center","important"),B.style.setProperty("background-size","12px 12px","important"),B.style.setProperty("width","14px","important"),B.style.setProperty("height","14px","important"))}}})})},"applyRowLayout");document.querySelectorAll(".profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)").forEach(p=>{if(p.classList.contains("setLabelWidth")||p.closest&&p.closest("#curriculumInfo-divcon, #curriculumInfo-divcon1, #curriculumInfo-divcon2, #fajh, #xnxq, #kz, #kc, #kcfa"))return;let s=Array.from(p.querySelectorAll(".profile-info-row")).some(c=>Array.from(c.children).filter(h=>h.classList&&h.classList.contains("profile-info-name")).length>=2),i=!!p.querySelector("select.chosen, select.select, .chosen-container");if(!s&&!i){p.classList.remove("urppp-query-form");return}p.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')&&(p.classList.add("urppp-query-form"),Ae(p),p.querySelectorAll(".profile-info-row").forEach(c=>{if(c.dataset.urpppQueryDone==="1"){c.querySelector(":scope > .urppp-query-pair")&&r(c);return}let h=Array.from(c.children).filter(j=>j.classList&&(j.classList.contains("profile-info-name")||j.classList.contains("profile-info-value"))),w=[];for(let j=0;j<h.length;){let L=h[j],D=h[j+1];L&&D&&L.classList.contains("profile-info-name")&&D.classList.contains("profile-info-value")?(w.push([L,D]),j+=2):j+=1}if(!w.length){c.dataset.urpppQueryDone="1";return}let E=document.createDocumentFragment(),M=new Set;for(w.forEach(([j,L])=>{let D=document.createElement("div");D.className="urppp-query-pair",D.appendChild(j),D.appendChild(L),M.add(j),M.add(L),E.appendChild(D)}),h.forEach(j=>{M.has(j)||E.appendChild(j)});c.firstChild;)c.removeChild(c.firstChild);c.appendChild(E),c.dataset.urpppQueryDone="1",r(c)}))}),ur()}catch(t){console.warn("[URP++] query form beautify failed",t)}}e(Xr,"beautifyQueryForms");function co(){if(window.__urpppChosenAlignBound)return;window.__urpppChosenAlignBound=!0;let t=!1,r=e(a=>{if(!t){t=!0;try{let p=a&&a.querySelectorAll?a:document,s=document.getElementById("urppp-chosen-li-style");s||(s=document.createElement("style"),s.id="urppp-chosen-li-style",document.documentElement.appendChild(s)),s.textContent=[".self div.profile-info-value a.chosen-single > span,","body .self div.profile-info-value a.chosen-single > span {","  line-height: normal !important;","  height: auto !important;","  margin-top: 0 !important;","  padding-top: 0 !important;","}",".self div.profile-info-value a.chosen-single,","body .self div.profile-info-value a.chosen-single {","  display: flex !important;","  align-items: center !important;","  height: 34px !important;","  line-height: normal !important;","}","body .chosen-container .chosen-results li,","body .chosen-with-drop .chosen-results li,","html body .chosen-container .chosen-results li.active-result {","  display:flex !important;","  align-items:center !important;","  justify-content:flex-start !important;","  height:36px !important;","  min-height:36px !important;","  max-height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","  margin:0 !important;","  box-sizing:border-box !important;","}","body .chosen-container .chosen-results li.highlighted,","body .chosen-container .chosen-results li.result-selected {","  display:flex !important;","  align-items:center !important;","  height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","}"].join(""),p.querySelectorAll(".chosen-results li").forEach(i=>{i.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-start !important","height:36px !important","min-height:36px !important","max-height:36px !important","line-height:1 !important","padding:0 12px !important","margin:0 !important","box-sizing:border-box !important"].join(";")}),p.querySelectorAll("a.chosen-single").forEach(i=>{i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("height","34px","important"),i.style.setProperty("min-height","34px","important"),i.style.setProperty("line-height","normal","important"),i.style.setProperty("padding-top","0","important"),i.style.setProperty("padding-bottom","0","important");let c=i.querySelector(":scope > span");c&&(c.style.setProperty("line-height","normal","important"),c.style.setProperty("height","auto","important"),c.style.setProperty("margin-top","0","important"),c.style.setProperty("margin-bottom","0","important"),c.style.setProperty("padding-top","0","important"),c.style.setProperty("padding-bottom","0","important"))}),p.querySelectorAll(".chosen-search").forEach(i=>{if(!i.querySelector(".urppp-chosen-search-icon")){let c=document.createElement("i");c.className="fa fa-search urppp-chosen-search-icon",c.setAttribute("aria-hidden","true"),i.appendChild(c)}})}finally{setTimeout(()=>{t=!1},0)}}},"apply");document.addEventListener("mousedown",a=>{let p=a.target&&a.target.closest?a.target.closest(".chosen-container"):null;p&&(setTimeout(()=>r(p),0),setTimeout(()=>r(p),30),setTimeout(()=>r(p),100),setTimeout(()=>r(p),200))},!0);try{let a=window.jQuery||window.$;a&&a.fn&&a(document).off("chosen:showing_dropdown.urppp chosen:updated.urppp").on("chosen:showing_dropdown.urppp chosen:updated.urppp",p=>{let s=p.target&&p.target.parentElement?p.target.parentElement:document;setTimeout(()=>r(s),0),setTimeout(()=>r(s),60)})}catch{}}e(co,"patchChosenDropdownAlign");function sa(){try{let t=document.getElementById("work_rest_schedule_modal");if(!t)return;(t.classList.contains("in")||t.classList.contains("show"))&&t.style.setProperty("display","block","important");let r=t.querySelector(".modal-body")||t,a=Array.from(r.querySelectorAll("table"));if(!a.length)return;let p=e(c=>(c||"").replace(/\s+/g," ").trim(),"norm"),s=e(c=>String(c??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),"esc");if(r.dataset.urpppWrsDone==="1")return;r.dataset.urpppWrsDone="1",a.forEach(c=>{let h=c.closest(".urppp-table-wrap");h&&t.contains(h)&&h.parentElement&&(h.parentElement.insertBefore(c,h),h.remove()),c.classList.add("urppp-wrs-table"),c.style.setProperty("width","100%","important");let w=Array.from(c.rows||[]);if(!w.length)return;let E=0;w.forEach(M=>{let j=p(M.textContent);if(!/\d{1,2}:\d{2}/.test(j))return;let L=0;Array.from(M.cells||[]).forEach(D=>{L+=D.colSpan||1}),L>E&&(E=L)}),E<4&&w.forEach(M=>{let j=0;Array.from(M.cells||[]).forEach(L=>{j+=L.colSpan||1}),j>E&&(E=j)}),E<1&&(E=1),Array.from(c.rows||[]).forEach(M=>{let j=Array.from(M.cells||[]);if(!j.length)return;let L=p(M.textContent);if(!/\d{1,2}:\d{2}/.test(L)&&(/作息时间|学年/.test(L)||/(望江|华西|江安)/.test(L)&&/校区|时间|安排|作息/.test(L))){let B=L;M.className="urppp-wrs-title-row",M.innerHTML='<td class="urppp-wrs-title" colspan="'+E+'" align="center">'+s(B)+"</td>";return}j.forEach(B=>{["border","borderTop","borderRight","borderBottom","borderLeft","textAlign","verticalAlign","width"].forEach($=>{try{B.style[$]=""}catch{}}),B.classList.remove("urppp-wrs-title","urppp-wrs-period","urppp-wrs-time","urppp-wrs-head");let O=p(B.textContent);O&&(/^(上午|下午|晚上|中午)$/.test(O)||(B.rowSpan||1)>1&&/上午|下午|晚上|中午/.test(O)?B.classList.add("urppp-wrs-period"):/节次|大节|时间|校区/.test(O)&&!/\d{1,2}:\d{2}/.test(O)&&!/第\d/.test(O)?/节次|时间|大节|校区/.test(L)&&!/\d{1,2}:\d{2}/.test(L)&&B.classList.add("urppp-wrs-head"):/\d{1,2}:\d{2}/.test(O)&&B.classList.add("urppp-wrs-time"),B.style.setProperty("text-align","center","important"),B.style.setProperty("vertical-align","middle","important"))})})});let i=t.querySelector(".modal-title");i&&(i.style.setProperty("text-align","center","important"),i.style.setProperty("width","100%","important")),r.dataset.urpppWrsDone="1"}catch{}}e(sa,"beautifyWorkRestSchedule");let uo="https://jwc.scu.edu.cn/cdxl.htm";function la(){let t=['a[onclick*="jwc.scu.edu.cn/article/206"]','a[href*="jwc.scu.edu.cn/article/206"]',".cdsj a",".ace-nav a"],r=new Set;t.forEach(a=>{document.querySelectorAll(a).forEach(p=>{if(r.has(p))return;r.add(p);let s=(p.textContent||"").replace(/\s+/g,""),i=p.getAttribute("onclick")||"",c=p.getAttribute("href")||"";(s.includes("学校校历")||i.includes("article/206")||c.includes("article/206")||i.includes("jwc.scu.edu.cn")&&s.includes("校历"))&&(p.setAttribute("href",uo),p.setAttribute("target","_blank"),p.setAttribute("rel","noopener noreferrer"),p.setAttribute("onclick",`window.open('${uo}');return false;`))})})}e(la,"patchSchoolCalendarLink");function Se(){document.querySelectorAll("#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static").forEach(t=>{if(!t.querySelector(".nav-tabs"))return;["background","background-color","background-image","border","border-radius","box-shadow"].forEach(p=>{t.style.setProperty(p,p.startsWith("background")||p==="box-shadow"?p==="box-shadow"?"none":"transparent":p==="border"?"none":"0","important")}),t.style.setProperty("background","transparent","important"),t.style.setProperty("background-color","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("width","100%","important"),t.style.setProperty("margin","0 0 14px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("min-height","0","important"),t.style.setProperty("box-sizing","border-box","important");let r=t.querySelector(".navbar-inner");r&&(r.style.setProperty("background","transparent","important"),r.style.setProperty("border","none","important"),r.style.setProperty("box-shadow","none","important"),r.style.setProperty("padding","0","important"),r.style.setProperty("min-height","0","important"),r.style.setProperty("filter","none","important"),r.style.setProperty("width","100%","important")),t.querySelectorAll(".container, .container-fluid").forEach(p=>{p.style.setProperty("width","100%","important"),p.style.setProperty("max-width","100%","important"),p.style.setProperty("margin","0","important"),p.style.setProperty("margin-left","0","important"),p.style.setProperty("padding","0","important"),p.style.setProperty("background","transparent","important"),p.style.setProperty("box-sizing","border-box","important")});let a=t.querySelector(".nav-tabs");a&&(a.style.setProperty("width","100%","important"),a.style.setProperty("margin","0","important"),a.style.setProperty("padding","8px 10px","important"),a.style.setProperty("background","var(--surface)","important"),a.style.setProperty("background-color","var(--surface)","important"),a.style.setProperty("border",qr(),"important"),a.style.setProperty("border-radius","12px","important"),a.style.setProperty("box-sizing","border-box","important"))})}e(Se,"patchAceTabNavbars");function Tr(){let t=e(r=>{let a=NaN,p=[r.getAttribute("data-percent"),r.querySelector("[data-percent]")?.getAttribute("data-percent"),r.querySelector(".percent")?.textContent,r.querySelector(".urppp-pct-text")?.textContent];for(let s of p){if(s==null||s==="")continue;let i=parseFloat(String(s).replace(/[^\d.]/g,""));if(!Number.isNaN(i)){a=i;break}}if(Number.isNaN(a)){let s=(r.textContent||"").match(/(\d+(?:\.\d+)?)\s*%/);s&&(a=parseFloat(s[1]))}if(Number.isNaN(a)){let s=r.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');if(s){let i=String(s.style.width||"").match(/([\d.]+)%/);i&&(a=parseFloat(i[1]))}}return Number.isNaN(a)?null:Math.max(0,Math.min(100,a))},"readPct");document.querySelectorAll(".infobox").forEach(r=>{let a=t(r);if(a==null)return;r.querySelectorAll("canvas").forEach(c=>c.remove()),r.querySelectorAll(".easy-pie-chart, .percentage, .infobox-progress").forEach(c=>{c.classList.contains("urppp-pct-bar")||c.remove()}),r.querySelectorAll(".urppp-pct-text, .urppp-pct-bar").forEach(c=>c.remove());let p=r.querySelector(".infobox-data")||r,s=document.createElement("div");s.className="urppp-pct-text",s.textContent=Math.round(a)+"%";let i=document.createElement("div");if(i.className="urppp-pct-bar"+(a<=0?" is-empty":""),a>0){let c=document.createElement("span");c.className="urppp-pct-fill",c.style.width=a+"%",i.appendChild(c)}p.insertBefore(i,p.firstChild),p.insertBefore(s,p.firstChild),r.dataset.urpppPctDone="1"})}e(Tr,"restyleInfoboxPercentages");function Kr(t){let r=document.getElementById("treeDemo");if(!r)return;let a=!!(t&&t.force);if(r.dataset.urpppBusy==="1"&&!(t&&t.ignoreBusy))return;let p=r.closest('div[style*="border"]')||r.closest("#tree_div")?.parentElement||r.parentElement;p&&p.classList.add("urppp-plan-tree-shell"),r.classList.add("urppp-ztree");let s=typeof unsafeWindow<"u"?unsafeWindow:window,i=e(()=>{try{return(s.jQuery||s.$||window.jQuery||window.$)?.fn?.zTree?.getZTreeObj?.("treeDemo")||null}catch{return null}},"getZTree"),c=e(()=>{let O=Array.from(r.querySelectorAll('span.button.switch[class*="_open"]')).filter($=>!/_docu\b/.test($.className));return O.reverse().forEach($=>{try{$.click()}catch{}}),O.length>0},"collapseAllDom"),h=e(()=>{let O=i();if(O)try{O.expandAll(!1)}catch{}return r.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')&&c(),!0},"collapseAll");if(!window.__urpppExpandKzPatched){window.__urpppExpandKzPatched=!0;let O=e(()=>{let $=typeof unsafeWindow<"u"?unsafeWindow:window;try{$.expandKzByRule=function(){r.dataset.urpppUserExpanded||h()}}catch{}},"patch");O(),setTimeout(O,0),setTimeout(O,200)}r.dataset.urpppCollapsedOnce||(r.dataset.urpppCollapsedOnce="1",[0,80,200,500,1e3].forEach(O=>setTimeout(()=>{r.dataset.urpppUserExpanded||h()},O)));let w=document.querySelector("#two h4.header, #two .header");if(w&&!w.dataset.urpppLegendDone){let O=w.querySelector("font");if(O){let $=document.createElement("div");$.className="urppp-plan-legend",$.innerHTML=['<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>','<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>','<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>','<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>','<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>'].join(""),O.replaceWith($)}w.classList.add("urppp-plan-header"),w.dataset.urpppLegendDone="1"}let E=e(()=>{if(r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}},"pauseObs"),M=e(()=>{r.dataset.urpppBusy="0";let O=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&O)try{window.__urpppPlanTreeObs.observe(O,{childList:!0,subtree:!0})}catch{}},"resumeObs"),j=e(O=>{let $=O;return $=$.replace(/\((最低修读学分:[^)]+)\)/g,(Y,lt)=>{let yt=lt.split(",").map(Lt=>Lt.trim()).filter(Boolean),_t=[];return yt.forEach(Lt=>{/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(Lt)&&_t.push(Lt)}),`<span class="urppp-sub">${(_t.length?_t:yt).map(Lt=>{let Dt=Lt.match(/^([^:：]+)[:：]\s*(.+)$/);if(!Dt)return Lt;let jt=Dt[1].trim(),Tt=Dt[2].trim(),tr="neutral";return/通过|已及格/.test(jt)?tr="ok":/未修读|未及格/.test(jt)?tr=Number(Tt)>0?"warn":"muted":/最低/.test(jt)&&(tr="req"),`<span class="urppp-kv ${tr}"><em>${jt}</em><b>${Tt}</b></span>`}).join("")}</span>`}),$=$.replace(/\[(\d{6,})\]/g,'<span class="urppp-code">$1</span>'),$=$.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g,'<span class="urppp-meta">$1</span>'),$=$.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g,(Y,lt,yt)=>{let _t=String(yt).trim(),zt=_t.match(/^(.+?)(?:\((\d{6,8})\))?$/),Lt=(zt?zt[1]:_t).trim(),Dt=zt&&zt[2]?zt[2]:"",jt=parseFloat(Lt),Tt=!1;Number.isNaN(jt)?/不及格|未通过|不通过/.test(Lt)?Tt=!1:(/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(Lt),Tt=!0):Tt=jt>=60;let tr=Dt?`<i>${Dt}</i>`:"";return`<span class="urppp-score ${Tt?"pass":"fail"}"><b>${lt}</b><em>${Lt}</em>${tr}</span>`}),$=$.replace(/(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,'$1<span class="urppp-title">$2</span>'),$=$.replace(/(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,'$1 <span class="urppp-gname">$2</span>'),$=$.replace(/(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,"$1 "),$},"formatNodeHtml"),L=e(O=>{let $=O.querySelector("i.fa, i.ace-icon"),Y=O.closest("li");Y&&(Y.classList.remove("urppp-node-done","urppp-node-todo","urppp-node-pass","urppp-node-fail","urppp-node-pending"),$&&($.classList.contains("fa-check-square-o")?Y.classList.add("urppp-node-done"):$.classList.contains("fa-smile-o")?Y.classList.add("urppp-node-pass"):$.classList.contains("fa-frown-o")?Y.classList.add("urppp-node-fail"):$.classList.contains("fa-meh-o")?Y.classList.add("urppp-node-pending"):$.classList.contains("fa-kz")&&Y.classList.add("urppp-node-todo")))},"markStatus"),D=e(O=>{if(!O||!a&&O.dataset.urpppNodeDone==="1")return!1;L(O);let $=O.querySelector("span.node_name")||O;if(!$)return!1;if(!a&&$.querySelector(".urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname"))O.dataset.urpppNodeDone="1";else{let lt=$.dataset.urpppRaw;lt||($.querySelector(".urppp-score, .urppp-code, .urppp-sub")?(O.dataset.urpppNodeDone="1",lt=null):(lt=$.innerHTML,lt&&($.dataset.urpppRaw=lt))),lt&&($.innerHTML=j(lt),O.dataset.urpppNodeDone="1")}let Y=O.parentElement&&O.parentElement.querySelector(":scope > span.button.switch");return Y&&(Y.dataset.urpppSw||(Y.dataset.urpppSw="1",/_docu\b/.test(Y.className)&&(Y.classList.add("urppp-switch-leaf"),Y.style.setProperty("display","none","important"))),/_docu\b/.test(Y.className)||Y.classList.contains("urppp-switch-leaf")?O.classList.remove("urppp-expandable"):O.classList.add("urppp-expandable")),!0},"paintOne"),J=e((O,$)=>{let Y=Array.from(O||[]),lt=0,yt=e(()=>{let _t=Math.min(lt+48,Y.length);for(;lt<_t;lt++)D(Y[lt]);lt<Y.length?window.requestIdleCallback?requestIdleCallback(yt,{timeout:120}):setTimeout(yt,0):$&&$()},"step");yt()},"paintList"),B=e(O=>{let $=O||r;$.querySelectorAll("span.button.switch:not([data-urppp-sw])").forEach(Y=>{Y.dataset.urpppSw="1",/_docu\b/.test(Y.className)&&(Y.classList.add("urppp-switch-leaf"),Y.style.setProperty("display","none","important"))}),$.querySelectorAll("li > a").forEach(Y=>D(Y))},"paintScopeSync");E();try{B(r),r.dataset.urpppExpandClick||(r.dataset.urpppExpandClick="1",r.addEventListener("click",$=>{if($.target.closest&&$.target.closest("span.button.switch")){let zt=$.target.closest("span.button.switch"),Lt=zt&&zt.parentElement;if(!Lt||/_docu\b/.test(zt.className))return;if(r.dataset.urpppUserExpanded="1",r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}setTimeout(()=>{B(Lt),r.dataset.urpppBusy="0";let Dt=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&Dt)try{window.__urpppPlanTreeObs.observe(Dt,{childList:!0,subtree:!0})}catch{}},0);return}let Y=$.target&&$.target.closest?$.target.closest("li > a"):null;if(!Y||!r.contains(Y))return;let lt=Y.parentElement;if(!lt)return;let yt=lt.querySelector(":scope > span.button.switch");if(!yt||/_docu\b/.test(yt.className)||yt.classList.contains("urppp-switch-leaf")||!Y.classList.contains("urppp-expandable")&&!/_open|_close/.test(yt.className))return;if($.preventDefault(),$.stopImmediatePropagation(),r.dataset.urpppUserExpanded="1",r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}yt.click(),B(lt),r.dataset.urpppBusy="0";let _t=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&_t)try{window.__urpppPlanTreeObs.observe(_t,{childList:!0,subtree:!0})}catch{}},!0));let O=e(($,Y)=>{let lt=document.getElementById($);return!lt||lt.dataset.urpppBound==="1"?!1:(lt.dataset.urpppBound="1",lt.addEventListener("click",yt=>{yt.preventDefault(),yt.stopImmediatePropagation(),r.dataset.urpppUserExpanded="1",E();try{let _t=i();if(Y){_t?_t.expandAll(!0):r.querySelectorAll('span.button.switch[class*="_close"]').forEach(Lt=>{/_docu\b/.test(Lt.className)||Lt.click()});let zt=r.querySelectorAll('li > a:not([data-urppp-node-done="1"])');J(zt,M)}else{if(_t)try{_t.expandAll(!1)}catch{}c(),setTimeout(()=>{r.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')&&c(),M()},0)}}catch{Y||c(),M()}},!0),!0)},"bindAll");O("expandAllBtn",!0),O("collapseAllBtn",!1),r.dataset.urpppAllBtnsRetry||(r.dataset.urpppAllBtnsRetry="1",setTimeout(()=>{O("expandAllBtn",!0),O("collapseAllBtn",!1)},300),setTimeout(()=>{O("expandAllBtn",!0),O("collapseAllBtn",!1)},1e3))}finally{requestAnimationFrame(()=>{requestAnimationFrame(M)})}}e(Kr,"beautifyPlanTree");function Zr(){if(!lr())try{let t=document.getElementById("soliderbox");if(t){t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","720px","important"),t.style.setProperty("min-width","0","important"),t.classList.remove("container");let s=t.closest(".profile-info-row");s&&(s.style.setProperty("display","flex","important"),s.style.setProperty("align-items","center","important"),s.style.setProperty("width","100%","important"),s.style.setProperty("max-width","100%","important"));let i=t.closest(".profile-info-value");i&&(i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","100%","important"),i.style.setProperty("flex","1 1 auto","important"),i.style.setProperty("min-width","0","important"))}let r=document.getElementById("mycoursetable");if(!r)return;let a=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches);r.classList.toggle("urppp-mobile-schedule-scroll",a),r.style.setProperty("position","relative","important"),r.style.setProperty("width","100%","important");let p=72;a||r.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(s=>{let i=s.offsetHeight||0;i>p&&(p=i)}),p<56&&(p=72),r.querySelectorAll("div.class_div").forEach(s=>{let i=parseInt(s.getAttribute("classNum")||"1",10)||1,c=s.scrollHeight||0;if(c>0){let h=Math.ceil(c/i);p=a?Math.max(p,Math.min(h,88)):Math.max(p,h)}}),a?p=Math.min(Math.max(p,72),88):(p<64&&(p=72),p>160&&(p=120)),r.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(s=>{s.style.setProperty("height",p+"px","important")}),r.querySelectorAll("td").forEach(s=>{let i=Array.from(s.querySelectorAll(":scope > div.class_div"));if(!i.length)return;s.style.setProperty("position","relative","important"),s.style.setProperty("vertical-align","top","important"),s.style.setProperty("overflow","visible","important");let c=s.getBoundingClientRect().width||s.offsetWidth||s.clientWidth||0,h=getComputedStyle(s),w=s.closest("table"),E=w?getComputedStyle(w):null,M=parseFloat(h.borderLeftWidth)||0,j=E&&E.borderCollapse==="collapse"?M/2:M,L=Math.max(1,i.length);i.forEach((D,J)=>{let B=parseInt(D.getAttribute("classNum")||"1",10)||1,O=zn(c,L,J,j),$=O.left,Y=O.width;D.style.setProperty("position","absolute","important"),D.style.setProperty("top","0px","important"),D.style.setProperty("left",$+"px","important"),D.style.setProperty("right","auto","important"),D.style.setProperty("bottom","auto","important"),D.style.setProperty("transform","none","important"),D.style.setProperty("width",Y+"px","important"),D.style.setProperty("max-width","none","important"),D.style.setProperty("height",p*B+"px","important"),D.style.setProperty("margin","0","important"),D.style.setProperty("box-sizing","border-box","important"),D.style.setProperty("z-index","2","important"),D.style.setProperty("overflow","hidden","important")})})}catch(t){console.warn("[URP++] week schedule fix failed",t)}}e(Zr,"fixWeekScheduleLayout");function ca(){try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;if(!t||t.__urpppDivBuildPatched||typeof t.divBuild!="function")return;t.__urpppDivBuildPatched=!0;let r=t.divBuild;t.__urpppOriginalDivBuild=r,t.divBuild=function(){try{Zr()}catch{try{return r.apply(this,arguments)}catch{}}};try{t.divBuild._urppp=!0}catch{}}catch(t){console.warn("[URP++] patch divBuild failed",t)}}e(ca,"patchSiteDivBuild");let Mr=null,mo=!1;function bo(){let t=document.getElementById("mycoursetable")||document.getElementById("page-content-template")||document.body;if(Mr&&Mr.root===t&&t?.isConnected){Zr();return}Mr&&Mr.disconnect(),Mr=null;let r=!mo;mo=!0;let a=!1,p=e(()=>{if(!(a||lr())&&!(!document.getElementById("soliderbox")&&!document.getElementById("mycoursetable"))){a=!0;try{ca(),Zr()}finally{setTimeout(()=>{a=!1},40)}}},"run");ca(),[0,50,150,400,1e3,2e3].forEach(c=>setTimeout(()=>{ca(),p()},c)),r&&window.addEventListener("resize",()=>{clearTimeout(window.__urpppWeekSchedResize),window.__urpppWeekSchedResize=setTimeout(p,120)});let s=e(c=>{if(!c||lr())return;let h=[];c.nodeType===1&&(c.matches&&c.matches("div.class_div")&&h.push(c),c.querySelectorAll&&c.querySelectorAll("div.class_div").forEach(w=>h.push(w))),h.forEach(w=>{let E=w.parentElement;E&&E.tagName==="TD"&&E.style.setProperty("position","relative","important"),w.style.setProperty("position","absolute","important"),w.style.setProperty("top","0px","important"),w.style.setProperty("left","0px","important"),w.style.setProperty("right","auto","important"),w.style.setProperty("transform","none","important"),w.style.setProperty("width","100%","important"),w.style.setProperty("margin","0","important"),w.style.setProperty("box-sizing","border-box","important")})},"pinNew"),i=new MutationObserver(c=>{if(lr())return;let h=!1;c.forEach(w=>{if(w.type==="childList"&&w.addedNodes.forEach(E=>{s(E),h=!0}),w.type==="attributes"&&w.attributeName==="style"&&w.target&&w.target.classList&&w.target.classList.contains("class_div")){let E=w.target,M=E.style.left||"",j=parseFloat(M);(!M||M==="auto"||Number.isFinite(j)&&j>200)&&(E.style.setProperty("left","0px","important"),E.style.setProperty("top","0px","important"),E.style.setProperty("position","absolute","important")),h=!0}}),h&&(clearTimeout(window.__urpppWeekSchedMut),window.__urpppWeekSchedMut=setTimeout(()=>{requestAnimationFrame(p)},16))});if(t){i.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]});let c=null,h=0,w=0;if(t.id==="mycoursetable"&&typeof window.ResizeObserver=="function"){let E=t.getBoundingClientRect().width||0;c=new window.ResizeObserver(M=>{let j=M[0]?.contentRect?.width||t.getBoundingClientRect().width||0;!j||Math.abs(j-E)<.5||(E=j,h||(h=requestAnimationFrame(()=>{h=0,p()})),clearTimeout(w),w=setTimeout(p,80))}),c.observe(t)}Mr={root:t,observer:i,disconnect(){i.disconnect(),c&&c.disconnect(),h&&cancelAnimationFrame(h),clearTimeout(w)}}}r&&document.addEventListener("mouseup",()=>{document.getElementById("soliderbox")&&(setTimeout(p,200),setTimeout(p,500))},!0)}e(bo,"scheduleWeekScheduleFix");function ho(){try{let t=document.getElementById("curriculumInfo-divcon2");if(!t)return;let r=parseFloat(t.style.width||getComputedStyle(t).width||"0");if(!r||r<40)return;t.classList.add("urppp-curriculum-drawer");let a=t.querySelector(".modal-body");if(!a)return;let p=a.querySelector(":scope > .col-xs-12 > .row")||a.querySelector(".col-xs-12 > .row")||a.querySelector(".row");if(!p)return;p.classList.add("urppp-drawer-layout");let s=p.querySelector(":scope > .urppp-drawer-toolbar, :scope > p");s&&s.tagName==="P"&&s.classList.add("urppp-drawer-toolbar");let i=p.querySelector(":scope > .urppp-drawer-body"),c=p.querySelector(".urppp-drawer-left"),h=p.querySelector(".urppp-drawer-right");i||(i=document.createElement("div"),i.className="urppp-drawer-body"),c||(c=document.createElement("div"),c.className="urppp-drawer-left"),h||(h=document.createElement("div"),h.className="urppp-drawer-right"),i.contains(c)||i.appendChild(c),i.contains(h)||i.appendChild(h),i.parentElement!==p&&(s&&s.parentElement===p?p.insertBefore(i,s.nextSibling):p.appendChild(i)),s&&p.firstElementChild!==s&&p.insertBefore(s,p.firstElementChild);let w=p.querySelector("#treeDemo, .ztree")||t.querySelector("#treeDemo, .ztree"),E=null;if(w){E=w.closest(".col-xs-6, .col-sm-6, .widget-box")||w.parentElement;let J=w.closest(".col-xs-6, .col-sm-6");J&&(E=J)}let M=["fajh","xnxq","kz","kc","kcfa"],j=M.map(J=>document.getElementById(J)).filter(J=>J&&t.contains(J));E&&E.parentElement!==c&&c.appendChild(E),Array.from(c.children).forEach(J=>{(M.includes(J.id)||J.id&&M.includes(J.id)||J!==E&&J.querySelector&&!J.querySelector("#treeDemo, .ztree")&&J.classList&&J.classList.contains("col-xs-6"))&&h.appendChild(J)}),M.forEach(J=>{let B=document.getElementById(J);!B||!t.contains(B)||(B.parentElement!==h&&h.appendChild(B),B.style.setProperty("width","100%","important"),B.style.setProperty("max-width","100%","important"),B.style.setProperty("float","none","important"),B.style.setProperty("margin","0","important"),B.style.setProperty("padding","0","important"),B.style.setProperty("box-sizing","border-box","important"),B.style.display!=="none"&&getComputedStyle(B).display!=="none"&&B.style.setProperty("display","block","important"))});let L=document.getElementById("fajh");L&&t.contains(L)&&(L.parentElement!==h&&h.appendChild(L),(!L.innerHTML||!L.innerHTML.trim())&&!L.querySelector(".urppp-drawer-skeleton, .profile-user-info, .widget-box")&&(L.innerHTML=["<div class='widget-box transparent urppp-drawer-skeleton'>","  <div class='widget-header widget-header-small'>","    <h4 class='widget-title smaller grey'>方案计划信息</h4>","  </div>","</div>","<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>","  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>","</div>"].join(""),L.style.setProperty("display","block","important"),L.dataset.urpppSkeleton="1"),L.dataset.urpppSkeleton==="1"&&L.querySelector(".profile-info-value")&&/方案名称|计划名称|年级|院系/.test(L.textContent||"")&&(delete L.dataset.urpppSkeleton,L.querySelectorAll(".urppp-drawer-skeleton, .urppp-drawer-skeleton-card").forEach(B=>B.remove())),L.innerHTML&&L.innerHTML.trim()&&L.style.display==="none"&&(L.dataset.urpppSkeleton==="1"||L.querySelector(".profile-user-info"))&&L.style.setProperty("display","block","important")),h.style.setProperty("min-height","240px","important"),c.style.setProperty("min-height","240px","important"),E&&(E.style.setProperty("width","100%","important"),E.style.setProperty("max-width","100%","important"),E.style.setProperty("float","none","important"),E.style.setProperty("margin","0","important"),E.style.setProperty("padding","0","important"),E.style.setProperty("border","none","important"),E.style.setProperty("box-sizing","border-box","important"));let D=c.querySelector(".widget-box");D&&(D.style.setProperty("width","100%","important"),D.style.setProperty("margin","0","important"),D.style.setProperty("border",qr(),"important"),D.style.setProperty("border-radius","12px","important"),D.style.setProperty("overflow","hidden","important"),D.style.setProperty("background","var(--surface)","important")),t.querySelectorAll(".profile-info-row").forEach(J=>{J.classList.remove("urppp-query-row","urppp-dual-pair"),J.style.setProperty("display","grid","important"),J.style.setProperty("grid-template-columns","112px minmax(0,1fr)","important"),J.style.setProperty("width","100%","important"),Array.from(J.children).forEach(B=>{B.classList&&(B.style.setProperty("float","none","important"),B.style.setProperty("margin-left","0","important"),B.style.setProperty("width","auto","important"),B.style.setProperty("max-width","none","important"))})}),t.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(J=>{J.classList.remove("urppp-query-form");try{Ae(J)}catch{}J.querySelectorAll(".profile-info-value, .profile-info-value span, span.editable").forEach(B=>{B.style.setProperty("color","var(--text)","important"),B.style.setProperty("opacity","1","important"),B.style.setProperty("visibility","visible","important")}),J.style.setProperty("border-radius","12px","important"),J.style.setProperty("overflow","hidden","important"),J.style.setProperty("width","100%","important"),J.style.setProperty("max-width","100%","important"),J.style.setProperty("display","block","important"),J.style.setProperty("box-sizing","border-box","important")})}catch(t){console.warn("[URP++] curriculum drawer beautify failed",t)}}e(ho,"beautifyCurriculumDrawer");function ai(){if(window.__urpppCurriculumDrawerBound)return;window.__urpppCurriculumDrawerBound=!0;let t=e(()=>ho(),"run");[0,50,150,350,800,1600].forEach(p=>setTimeout(t,p));let r=new MutationObserver(p=>{p.some(i=>!!(i.type==="childList"||i.type==="attributes"&&i.target&&(i.target.id==="curriculumInfo-divcon2"||i.target.id==="fajh")))&&(clearTimeout(window.__urpppCurriculumDrawerTimer),window.__urpppCurriculumDrawerTimer=setTimeout(()=>requestAnimationFrame(t),16))}),a=document.getElementById("curriculumInfo-divcon2");a&&r.observe(a,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),document.addEventListener("click",p=>{if(!document.getElementById("curriculumInfo-divcon2"))return;let s=p.target&&p.target.closest?p.target.closest("a,button,span,div"):null,i=(s&&s.textContent||"").replace(/\s+/g,"");(/培养方案|与我相关|方案计划|自动化培养/.test(i)||s&&s.closest&&s.closest("#curriculumInfo-divcon2"))&&(setTimeout(t,0),setTimeout(t,50),setTimeout(t,150),setTimeout(t,400))},!0)}e(ai,"scheduleCurriculumDrawerBeautify");let{scheduleScrubTableInlineBg:go,scrubTableHeaderInlineBg:oi}=Xn({isNativePdfIsolationActive:lr}),{disarmNoticeTableHover:ni,pinNoticeRowSurface:fo,scrubNoticeInlineBg:xo,stripMistakenNoticeTable:yo}=rp({getCurrentTheme:Vt});function da(){try{let t=document.querySelector("h4.header, h3.header, h4, h3, .breadcrumb, .page-header");return Jn({pathname:location.pathname,href:location.href,title:document.title,headingText:t?.textContent||""})}catch{return!1}}e(da,"isNoticePageContext");function pi(t){return Ba(t,{noticePage:da()})}e(pi,"isNoticeListTable");function ua(t){return Vn(t,{noticePage:da()})}e(ua,"isBusinessDataTable");let vo,{bindNoticeHoverScrub:ii,scheduleBeautifyNoticeTables:wo}=tp({beautifyNoticeTables:e(t=>vo(t),"beautifyNoticeTables"),pinNoticeRowSurface:fo});({beautifyNoticeTables:vo}=ep({isNativePdfIsolationActive:lr,bindNoticeHoverScrub:ii,scrubNoticeInlineBg:xo,stripMistakenNoticeTable:yo,disarmNoticeTableHover:ni,pinNoticeRowSurface:fo,isBusinessDataTable:ua,isNoticeListTable:pi,isNoticePageContext:da,isNoticeBulletText:Na}));let{wrapTables:ko,bindTableWrapObserver:Ao}=Yn({isNativePdfIsolationActive:lr,isBusinessDataTable:ua});function te(){try{document.querySelectorAll(".modal").forEach(r=>{if(!r||!r.style)return;r.style.getPropertyPriority("display")==="important"&&r.style.removeProperty("display"),r.classList.contains("in")||r.classList.contains("show")?r.style.display==="none"&&r.style.removeProperty("display"):(r.style.display==="block"||getComputedStyle(r).display!=="none")&&(r.style.setProperty("display","none","important"),setTimeout(()=>{try{!r.classList.contains("in")&&!r.classList.contains("show")&&(r.style.getPropertyPriority("display")==="important"&&r.style.removeProperty("display"),r.style.display="none")}catch{}},0))}),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(r=>{try{r.parentElement&&r.parentElement.removeChild(r)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right")))}catch{}}e(te,"cleanupStuckModals");function si(){if(window.__urpppModalOpenPatched)return;window.__urpppModalOpenPatched=!0;let t=e(i=>{!i||!i.style||(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.getPropertyPriority("opacity")==="important"&&i.style.removeProperty("opacity"),i.style.getPropertyPriority("pointer-events")==="important"&&i.style.removeProperty("pointer-events"),i.style.getPropertyPriority("visibility")==="important"&&i.style.removeProperty("visibility"))},"unlock"),r=e(i=>{if(!(!i||!i.classList))try{i.classList.remove("in","show"),i.setAttribute("aria-hidden","true"),i.style.removeProperty("display"),i.style.setProperty("display","none","important"),setTimeout(()=>{try{!i.classList.contains("in")&&!i.classList.contains("show")&&(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.display="none")}catch{}},30)}catch{}},"forceHide"),a=e(()=>{document.querySelectorAll(".modal-backdrop").forEach(i=>{try{i.parentElement&&i.parentElement.removeChild(i)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"),document.body.style.removeProperty("overflow"))},"clearBackdrops"),p=e(i=>{if(i){if(i.classList&&i.classList.contains("modal-backdrop")&&(i=document.querySelector(".modal.in, .modal.show")||i),!i||!i.classList||!i.classList.contains("modal")){a();return}t(i),r(i),a();try{let c=typeof ke=="function"&&ke()||typeof unsafeWindow<"u"&&(unsafeWindow.jQuery||unsafeWindow.$)||window.jQuery||window.$;if(c&&c.fn&&typeof c.fn.modal=="function"){try{c(i).trigger("hide.bs.modal")}catch{}try{c(i).modal("hide")}catch{}try{c(i).trigger("hidden.bs.modal")}catch{}}}catch{}setTimeout(()=>{r(i),document.querySelector(".modal.in, .modal.show")||a();try{te()}catch{}},0)}},"hideModalEl");document.addEventListener("show.bs.modal",i=>{let c=i.target;if(!(!c||!c.classList||!c.classList.contains("modal"))){t(c),c.style.display==="none"&&c.style.removeProperty("display");try{c.getAttribute("data-backdrop")==="static"&&c.setAttribute("data-backdrop","true"),c.dataset&&(c.dataset.backdrop="true")}catch{}}},!0),document.addEventListener("hide.bs.modal",i=>{let c=i.target;!c||!c.classList||!c.classList.contains("modal")||t(c)},!0),document.addEventListener("hidden.bs.modal",i=>{let c=i.target;!c||!c.classList||!c.classList.contains("modal")||(r(c),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(h=>{try{h.parentElement&&h.parentElement.removeChild(h)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"))))},!0);let s=e(i=>{let c=i.target;if(!c||!c.closest||c.closest(".modal-dialog, .modal-content, .modal-header, .modal-body, .modal-footer")&&!c.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return;if(c.classList&&c.classList.contains("modal-backdrop")){let M=document.querySelector(".modal.in, .modal.show")||document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"]');M?(i.preventDefault(),i.stopPropagation(),p(M)):(i.preventDefault(),a(),te());return}let h=null;if(c.classList&&c.classList.contains("modal")?h=c:h=c.closest(".modal.in, .modal.show, .modal"),!h||!h.classList.contains("modal")||!(h.classList.contains("in")||h.classList.contains("show")||getComputedStyle(h).display!=="none"))return;let E=h.querySelector(".modal-dialog");if(E){let M=E.getBoundingClientRect(),j=i.clientX,L=i.clientY;if(j>=M.left&&j<=M.right&&L>=M.top&&L<=M.bottom&&!c.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return}else if(c.closest(".modal-content"))return;i.preventDefault(),i.stopPropagation(),p(h)},"onBlankClose");document.addEventListener("pointerdown",s,!0),document.addEventListener("mousedown",s,!0),document.addEventListener("click",s,!0),document.addEventListener("click",i=>{let c=i.target&&i.target.closest?i.target.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'):null;if(!c)return;let h=c.closest(".modal");h&&(i.preventDefault(),i.stopPropagation(),p(h)),setTimeout(()=>{try{te()}catch{}},50),setTimeout(()=>{try{te()}catch{}},220)},!0),document.addEventListener("click",i=>{let c=i.target&&i.target.closest?i.target.closest("a,button,td,span,div,i"):null;if(!c)return;["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon","billContainer"].forEach(w=>{let E=document.getElementById(w);E&&(t(E),E.style.opacity==="0"&&E.style.removeProperty("opacity"),E.style.pointerEvents==="none"&&E.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(w=>t(w));let h=c.getAttribute&&(c.getAttribute("data-target")||c.getAttribute("href")||"");if(h&&h.charAt(0)==="#"){let w=document.querySelector(h);w&&t(w)}},!0)}e(si,"patchModalOpenPath");let Ir=null,ma=0;function ba(){if(lr())return;let t=document.getElementById("courseTable");t&&t.querySelectorAll("td").forEach(r=>{let a=r.style.backgroundColor;if(!a||!a.includes("rgba"))return;let p=a.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);p&&(r.style.backgroundColor=`rgba(${p[1]},${p[2]},${p[3]},0.5)`)})}e(ba,"applyCourseTableOpacity");function So(){let t=document.getElementById("mycoursetable")||document.getElementById("courseTable");if(Ir&&Ir.root===t&&t?.isConnected){ba();return}if(clearTimeout(ma),Ir&&Ir.observer.disconnect(),Ir=null,!t)return;let r=new MutationObserver(()=>{clearTimeout(ma),ma=setTimeout(ba,60)});r.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style"]}),Ir={root:t,observer:r},ba()}e(So,"bindCourseTableOpacityObserver");function li(){try{let L=Vt();document.documentElement.dataset.urpppTheme=L,document.documentElement.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),document.documentElement.classList.add("urppp-theme-"+L),document.body&&(document.body.dataset.urpppTheme=L,document.body.classList.toggle("urppp-dark",L==="dark"))}catch{}let t=document.getElementById("urppp-internal-style");t||(t=document.createElement("style"),t.id="urppp-internal-style",document.head.appendChild(t));{let L=t;L.textContent=lp}let r=document.getElementById("urppp-table-beautify-style");r||(r=document.createElement("style"),r.id="urppp-table-beautify-style",document.head.appendChild(r)),r.textContent=mp;let a=document.getElementById("urppp-navigation-style");a||(a=document.createElement("style"),a.id="urppp-navigation-style",document.head.appendChild(a)),a.textContent=bp;let p=document.getElementById("urppp-dashboard-style");p||(p=document.createElement("style"),p.id="urppp-dashboard-style",document.head.appendChild(p)),p.textContent=gp;let s=document.getElementById("urppp-schedule-card-style");s||(s=document.createElement("style"),s.id="urppp-schedule-card-style",document.head.appendChild(s)),s.textContent=cp;let i=document.getElementById("urppp-mobile-style");i||(i=document.createElement("style"),i.id="urppp-mobile-style",document.head.appendChild(i)),i.textContent=xp;try{er()}catch{}te(),si(),["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon"].forEach(L=>{let D=document.getElementById(L);!D||!D.style||(["display","opacity","pointer-events","visibility"].forEach(J=>{D.style.getPropertyPriority(J)==="important"&&D.style.removeProperty(J)}),D.style.opacity==="0"&&D.style.removeProperty("opacity"),D.style.pointerEvents==="none"&&D.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(L=>{L.style&&L.style.getPropertyPriority("display")==="important"&&L.style.removeProperty("display")}),ko(),wo(),go(),setTimeout(()=>document.querySelectorAll("table").forEach(L=>{ua(L)&&yo(L)}),500),bo(),Zr(),ai(),ho(),Ao();let c=document.querySelector(".page-content");c&&c.querySelectorAll(".widget-box").length>=4&&setTimeout(rebuildDashboard,500),rebuildSidebarCompletely(),syncSidebarUnderNavbar(),w();function w(){let L="(max-width: 640px)",D=e(()=>!!(window.matchMedia&&window.matchMedia(L).matches),"isNarrow"),J=e((R,ot)=>{if(!(!R||!document.body)){if(ot){Object.hasOwn(R.dataset,"urpppDesktopSidebarMin")||(R.dataset.urpppDesktopSidebarMin=R.classList.contains("menu-min")?"1":"0",R.dataset.urpppDesktopBodyMin=document.body.classList.contains("menu-min")?"1":"0"),R.classList.remove("menu-min"),document.body.classList.remove("menu-min");return}Object.hasOwn(R.dataset,"urpppDesktopSidebarMin")&&(R.classList.toggle("menu-min",R.dataset.urpppDesktopSidebarMin==="1"),document.body.classList.toggle("menu-min",R.dataset.urpppDesktopBodyMin==="1"),delete R.dataset.urpppDesktopSidebarMin,delete R.dataset.urpppDesktopBodyMin)}},"syncMobileSidebarMode"),B=new WeakMap,O=e(R=>{let ot=B.get(R);ot&&cancelAnimationFrame(ot),B.delete(R)},"stopDrawerAnimation"),$=e((R,ot)=>{O(R);let pt=R.getBoundingClientRect(),gt=Math.max(pt.width,R.offsetWidth||0,260),bt=Math.max(-gt,Math.min(0,pt.left)),St=ot?0:-gt,qt=Math.abs(St-bt),Ft=Math.max(140,Math.round(260*qt/gt)),sr=performance.now(),Ot=R.classList.contains("urppp-clean-sidebar"),rr=Ot?"12030":"1200",$t=Ot?"12030":"1030";R.style.setProperty("display","block","important"),R.style.setProperty("transition","none","important"),R.style.setProperty("visibility","visible","important"),R.style.setProperty("pointer-events",ot?"auto":"none","important"),R.style.setProperty("z-index",rr,"important"),R.style.setProperty("transform",`translate3d(${bt}px, 0, 0)`,"important"),R.classList.toggle("urppp-drawer-closing",!ot),R.classList.add("display");let kt=e(()=>{R.style.setProperty("transform",`translate3d(${St}px, 0, 0)`,"important"),ot?(R.classList.remove("urppp-drawer-closing"),R.style.setProperty("pointer-events","auto","important")):(R.classList.remove("display","urppp-drawer-closing"),R.style.setProperty("visibility","hidden","important"),R.style.setProperty("z-index",$t,"important")),B.delete(R)},"finish");if(qt<1){kt();return}let br=e(Mt=>{if(!R.isConnected){B.delete(R);return}let Ht=Math.min(1,(Mt-sr)/Ft),gn=Ht<.5?4*Ht*Ht*Ht:1-Math.pow(-2*Ht+2,3)/2,$e=bt+(St-bt)*gn;if(R.style.setProperty("transform",`translate3d(${$e}px, 0, 0)`,"important"),Ht>=1){kt();return}B.set(R,requestAnimationFrame(br))},"step");B.set(R,requestAnimationFrame(br))},"animateDrawer"),Y=e((R,ot,pt)=>{if(R){$(R,pt),ot&&(ot.setAttribute("aria-expanded",pt?"true":"false"),ot.setAttribute("aria-label",pt?"关闭菜单":"打开菜单"));try{syncMobileContentOffset()}catch{}}},"setDrawerOpen"),lt=e(()=>{Y(document.getElementById("sidebar"),document.getElementById("urppp-mobile-menu-button"),!1)},"closeDrawer"),yt=e(()=>{let ot=document.getElementById("urppp-mobile-search-panel")?.querySelector("#form-search");if(!ot)return;Object.entries({position:"relative",right:"auto",top:"auto",left:"auto",transform:"none",width:"100%","min-width":"0","max-width":"none",height:"36px",opacity:"1",margin:"0",overflow:"visible","z-index":"1"}).forEach(([gt,bt])=>ot.style.setProperty(gt,bt,"important")),[ot.querySelector("form"),ot.querySelector(".input-icon")].forEach(gt=>{gt&&Object.entries({display:"block",position:"relative",width:"100%","min-width":"0","max-width":"none",height:"36px",margin:"0",padding:"0","box-sizing":"border-box"}).forEach(([bt,St])=>gt.style.setProperty(bt,St,"important"))});let pt=ot.querySelector("#search-input");pt&&(pt.style.setProperty("display","block","important"),pt.style.setProperty("width","100%","important"),pt.style.setProperty("min-width","0","important"),pt.style.setProperty("max-width","none","important"),pt.style.setProperty("height","36px","important"),pt.style.setProperty("box-sizing","border-box","important"))},"syncMobileSearchLayout"),_t=e(()=>{let R=document.getElementById("form-search");if(!R||!R.__urpppMobileParent)return;let ot=R.__urpppMobileParent,pt=R.__urpppMobileNext;ot.isConnected&&(pt&&pt.parentElement===ot?ot.insertBefore(R,pt):ot.appendChild(R)),R.classList.remove("urppp-mobile-form-search"),R.dataset.open="0",R.removeAttribute("style"),delete R.__urpppMobileParent,delete R.__urpppMobileNext;try{st()}catch{}},"restoreMobileSearch"),zt=e(()=>{let R=document.querySelector("#navbar .menu-toggler");!R||R.dataset.urpppMobileHidden!=="1"||(R.style.removeProperty("display"),R.removeAttribute("aria-hidden"),R.dataset.urpppPreviousTabindex?R.setAttribute("tabindex",R.dataset.urpppPreviousTabindex):R.removeAttribute("tabindex"),delete R.dataset.urpppPreviousTabindex,delete R.dataset.urpppMobileHidden)},"restoreNativeMenuToggler"),Lt=e(()=>{let R=document.getElementById("urppp-mobile-menu-button");if(!D())return R?.remove(),zt(),null;if(R)return R;let ot=document.getElementById("navbar"),pt=document.getElementById("sidebar");if(!ot||!pt)return null;let gt=ot.querySelector(".menu-toggler");gt&&(gt.dataset.urpppMobileHidden="1",gt.dataset.urpppPreviousTabindex=gt.getAttribute("tabindex")||"",gt.style.setProperty("display","none","important"),gt.setAttribute("aria-hidden","true"),gt.setAttribute("tabindex","-1"));let bt=document.createElement("button");bt.type="button",bt.id="urppp-mobile-menu-button",bt.className="urppp-mobile-menu-button",bt.setAttribute("aria-label","打开菜单"),bt.setAttribute("aria-expanded","false");let St=ot.querySelector(".navbar-container")||ot;return St.insertBefore(bt,St.firstChild),bt},"ensureMenuToggler"),Dt=e(R=>{!R||R.dataset.urpppIconReady||(R.dataset.urpppIconReady="1",R.innerHTML=['<span class="urppp-menu-icon" aria-hidden="true">','<svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false">','<path d="M5 8h14"></path><path d="M5 16h10"></path>',"</svg>",'<svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false">','<path d="M7 7l10 10"></path><path d="M17 7 7 17"></path>',"</svg>","</span>"].join(""))},"ensureMenuButtonIcon"),jt=e(()=>{let R=Lt(),ot=document.getElementById("sidebar");R&&Dt(R),R&&ot&&!R.__urpppToggleHandler&&(R.setAttribute("aria-label","打开菜单"),R.setAttribute("aria-expanded",ot.classList.contains("display")?"true":"false"),R.__urpppToggleHandler=pt=>{pt.preventDefault(),pt.stopImmediatePropagation(),D()&&J(ot,!0);let gt=R.getAttribute("aria-expanded")!=="true";Y(ot,R,gt)},R.addEventListener("click",R.__urpppToggleHandler,!0)),document.__urpppMobileDrawerOutsideBound||(document.__urpppMobileDrawerOutsideBound=!0,document.addEventListener("click",pt=>{if(!D()||!pt.target.closest)return;let gt=document.getElementById("sidebar");if(!gt||!gt.classList.contains("display"))return;let bt=document.getElementById("urppp-clean-root");bt&&bt.classList.contains("open")||pt.target.closest("#sidebar, #urppp-mobile-menu-button")||lt()},!0)),document.__urpppMobileRouteCloseBound||(document.__urpppMobileRouteCloseBound=!0,document.addEventListener("click",pt=>{if(!D()||!pt.target.closest)return;let gt=document.getElementById("urppp-clean-root");if(gt&&gt.classList.contains("open"))return;let bt=pt.target.closest("#sidebar a[href]");if(!bt)return;let St=String(bt.getAttribute("href")||"").trim();!St||St==="#"||St.startsWith("javascript")||lt()}))},"bindDrawerControls"),Tt=e((R,ot)=>{let pt=R?R.cloneNode(!0):document.createElement("a");return pt.className="urppp-mobile-user-action",pt.removeAttribute("style"),pt.removeAttribute("id"),!R&&ot&&(pt.href=ot.href,ot.onclick&&pt.setAttribute("onclick",ot.onclick),pt.innerHTML='<i class="ace-icon fa '+ot.icon+'" aria-hidden="true"></i><span>'+ot.label+"</span>"),pt},"createActionLink"),tr=e((R,ot)=>{if(document.getElementById("urppp-mobile-user"))return;let pt=R.querySelector(":scope > li.light-blue")||Array.from(R.children).find(Ht=>Ht.querySelector&&Ht.querySelector(".nav-user-photo, .user-menu, .dropdown-menu")),gt=document.createElement("section");gt.id="urppp-mobile-user",gt.className="urppp-mobile-user";let bt=document.createElement("div");bt.className="urppp-mobile-user-identity";let St=pt?.querySelector(".nav-user-photo")||document.querySelector("#navbar .nav-user-photo"),qt=St?St.cloneNode(!0):document.createElement("img");qt.className="nav-user-photo",qt.removeAttribute("style"),qt.getAttribute("src")||qt.setAttribute("src","/main/queryStudent/img"),qt.setAttribute("data-urppp-private","avatar"),qt.alt=St?.alt?.replace(/\s+/g," ").trim()||"用户头像";let Ft=pt?.querySelector(".user-info")||document.querySelector("#navbar .user-info"),sr=document.createElement("span");sr.className="urppp-mobile-user-copy";let Ot=document.createElement("small");Ot.className="urppp-mobile-user-welcome",Ot.textContent="欢迎您，";let rr=document.createElement("span");rr.className="user-info urppp-user-name-value",rr.setAttribute("data-urppp-private","name"),rr.textContent=Ft?.textContent?.replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim()||St?.alt?.replace(/\s+/g," ").trim()||"我的账户",sr.append(Ot,rr),bt.append(qt,sr),gt.appendChild(bt);let $t=document.createElement("div");$t.className="urppp-mobile-user-actions";let kt=pt?Array.from(pt.querySelectorAll(".user-menu a, .dropdown-menu a")):[],br=[{label:"首页",href:"/",icon:"fa-home"},{label:"在线反馈",href:"/main/systemQuestion/index",icon:"fa-question-circle"},{label:"修改密码",href:"javascript:changePassword('/student/rollManagement/personalInfoUpdate/updatePassword')",icon:"fa-user"},{label:"注销",href:"/logout",icon:"fa-power-off"}];kt.length?kt.forEach(Ht=>$t.appendChild(Tt(Ht))):br.forEach(Ht=>$t.appendChild(Tt(null,Ht))),gt.appendChild($t);let Mt=ot.querySelector(".urppp-sidebar-header");Mt&&Mt.nextSibling?ot.insertBefore(gt,Mt.nextSibling):Mt?ot.appendChild(gt):ot.insertBefore(gt,ot.firstChild);try{Gt(gt)}catch{}},"ensureMobileUser"),hn=e((R,ot,pt,gt={})=>{if(!pt||document.getElementById("urppp-mobile-quick"))return;let bt=document.createElement("section");bt.id="urppp-mobile-quick",bt.className="urppp-mobile-quick",bt.innerHTML='<div class="urppp-mobile-quick-title">快捷功能</div>';let St=document.createElement("div");St.className="urppp-mobile-tool-row";let qt=R.querySelector(':scope > li > a[href*="customerServiceCenter"]'),Ft=qt?qt.cloneNode(!0):document.createElement("a");Ft.className="urppp-mobile-tool-button urppp-mobile-help-button",Ft.removeAttribute("style"),Ft.removeAttribute("onclick"),Ft.removeAttribute("data-toggle"),Ft.removeAttribute("target"),Ft.querySelectorAll("[style]").forEach(kt=>kt.removeAttribute("style"));let sr=String(Ft.getAttribute("href")||"").trim();(!sr||sr==="#"||sr.startsWith("javascript"))&&(Ft.href="/main/customerServiceCenter"),Ft.querySelector("i")||(Ft.innerHTML='<i class="ace-icon glyphicon glyphicon-headphones" aria-hidden="true"></i>'),Ft.querySelectorAll("span").forEach(kt=>kt.remove()),Ft.insertAdjacentHTML("beforeend","<span>帮助</span>"),St.appendChild(Ft);let Ot=document.createElement("button");Ot.type="button",Ot.id="urppp-mobile-search-button",Ot.className="urppp-mobile-tool-button",Ot.setAttribute("aria-expanded","false"),Ot.innerHTML='<i class="ace-icon fa fa-search" aria-hidden="true"></i><span>搜索</span>',St.appendChild(Ot),bt.appendChild(St);let rr=document.createElement("div");rr.className="urppp-mobile-quick-links",Array.from(R.querySelectorAll(":scope > li > a")).forEach(kt=>{let br=kt.closest("li");if(br?.classList.contains("light-blue")||br?.querySelector("#intellegenceUDiv, #form-search")||kt===qt||kt.classList.contains("dropdown-toggle")||!kt.getAttribute("href")&&!kt.getAttribute("onclick"))return;let Mt=kt.cloneNode(!0);Mt.className="urppp-mobile-quick-link",Mt.removeAttribute("style");let Ht=String(kt.getAttribute("onclick")||"");if(/openWorkRestSchedule|open\w*Schedule/i.test(Ht)||Mt.removeAttribute("onclick"),gt.cleanMode){let $e=String(kt.getAttribute("href")||"");($e==="/holiday"||/holiday/i.test($e)||/假期/.test(kt.textContent||""))&&(Mt.removeAttribute("href"),Mt.removeAttribute("target"),Mt.style.cursor="default",Mt.style.pointerEvents="none")}rr.appendChild(Mt)});let $t=document.createElement("div");$t.id="urppp-mobile-search-panel",$t.className="urppp-mobile-search-panel",$t.hidden=!0;{let kt=document.getElementById("form-search");kt&&(kt.__urpppMobileParent||(kt.__urpppMobileParent=kt.parentElement,kt.__urpppMobileNext=kt.nextSibling),kt.classList.add("urppp-mobile-form-search"),kt.dataset.open="0",$t.appendChild(kt),yt())}bt.appendChild($t),rr.children.length&&bt.appendChild(rr),Ot.addEventListener("click",kt=>{if(kt.preventDefault(),kt.stopPropagation(),$t.hidden){yt();let Mt=$t.querySelector("#form-search");Mt&&(Mt.dataset.open="0",Mt.style.setProperty("pointer-events","auto","important"),Mt.style.setProperty("opacity","1","important"),Mt.style.setProperty("width","100%","important"),Mt.style.setProperty("min-width","0","important")),$t.hidden=!1,$t.classList.add("open"),setTimeout(()=>$t.querySelector("#search-input")?.focus(),30),Ot.setAttribute("aria-expanded","true")}else $t.hidden=!0,$t.classList.remove("open"),Ot.setAttribute("aria-expanded","false")}),ot.insertBefore(bt,pt)},"ensureMobileQuick"),Sr=e(()=>{let R=D(),ot=document.querySelector("#navbar .navbar-buttons .ace-nav"),pt=document.getElementById("sidebar"),gt=document.getElementById("urppp-menus");if(pt&&J(pt,R),jt(),!R){let bt=document.documentElement.classList.contains("urppp-clean-open");bt||_t(),bt||(document.getElementById("urppp-mobile-quick")?.remove(),document.getElementById("urppp-mobile-user")?.remove());let St=document.getElementById("urppp-nav-clean"),qt=document.getElementById("urppp-nav-theme");St&&qt&&St.parentElement!==qt&&qt.appendChild(St),qt&&qt.style.setProperty("display","inline-flex","important");return}if(!(!ot||!pt)){try{let bt=document.getElementById("urppp-nav-clean"),St=document.querySelector("#navbar .navbar-header"),qt=document.getElementById("urppp-nav-theme");bt&&St&&bt.parentElement!==St&&St.appendChild(bt),qt&&qt.style.setProperty("display","inline-flex","important"),document.getElementById("urppp-nav-cal")?.remove()}catch{}tr(ot,pt),hn(ot,pt,gt),yt()}},"apply");window.__urpppRefreshMobileNavbar=Sr,window.__urpppCloseMobileDrawer=lt,window.__urpppSetDrawerOpen=(R,ot,pt)=>{Y(R,ot,pt)},window.__urpppStopDrawerAnimation=R=>{R&&O(R)},window.__urpppInjectCleanSidebarSections=R=>{let ot=document.querySelector("#navbar .navbar-buttons .ace-nav")||document.querySelector("#navbar .ace-nav"),pt=document.getElementById("urppp-menus");if(!ot||!R)return;try{tr(ot,R)}catch{}let gt=document.getElementById("urppp-mobile-quick");if(gt){let bt=gt.querySelector("#urppp-mobile-search-panel");if(bt&&bt.querySelector("#form-search"))try{_t()}catch{}gt.remove()}try{hn(ot,R,pt,{cleanMode:!0})}catch{}};try{Sr()}catch{}if(setTimeout(Sr,300),setTimeout(Sr,900),setTimeout(Sr,1800),window.matchMedia){let R=window.matchMedia(L),ot=e(()=>Sr(),"onChange");typeof R.addEventListener=="function"?R.addEventListener("change",ot):typeof R.addListener=="function"&&R.addListener(ot)}try{window.__urpppMobileNavbarObserver&&window.__urpppMobileNavbarObserver.disconnect();let R=0,ot=new MutationObserver(()=>{clearTimeout(R),R=setTimeout(()=>{try{Sr()}catch{}},40)}),pt=document.getElementById("navbar"),gt=document.getElementById("sidebar");pt&&ot.observe(pt,{childList:!0,subtree:!0}),gt&&ot.observe(gt,{childList:!0}),window.__urpppMobileNavbarObserver=ot}catch{}}e(w,"setupMobileNavbar");let M=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches)?"8px 8px 24px":"16px 64px 40px";if(document.querySelectorAll(".page-content, #page-content-template").forEach(L=>{L.style.setProperty("padding",M,"important"),L.style.setProperty("box-sizing","border-box","important")}),we(),oa(),Se(),Tr(),ia(),setTimeout(()=>{Tr(),ia()},300),setTimeout(()=>{Tr(),ia()},1e3),lo(),so(),io(),ur(),pa(),Xr(),co(),setTimeout(()=>{ur(),Xr()},200),setTimeout(()=>{ur(),Xr()},800),setTimeout(oa,350),setTimeout(oa,1e3),Kr(),setTimeout(()=>Kr(),400),!window.__urpppPlanTreeObs){let L=0;window.__urpppPlanTreeObs=new MutationObserver(()=>{let J=document.getElementById("treeDemo");!J||J.dataset.urpppBusy==="1"||J.querySelector('li > a:not([data-urppp-node-done="1"])')&&(clearTimeout(L),L=setTimeout(()=>Kr(),220))});let D=document.getElementById("tree_div")||document.getElementById("treeDemo");D&&window.__urpppPlanTreeObs.observe(D,{childList:!0,subtree:!0})}window.__urpppWrsBound||(window.__urpppWrsBound=!0,document.addEventListener("shown.bs.modal",L=>{L.target&&(L.target.id==="work_rest_schedule_modal"||L.target.querySelector?.("#work_rest_schedule_modal"))&&setTimeout(sa,30)},!0),document.addEventListener("click",L=>{let D=L.target&&L.target.closest?L.target.closest("a,button"):null;if(!D)return;let J=D.getAttribute("onclick")||"",B=(D.textContent||"").trim();(J.includes("openWorkRestSchedule")||B.includes("作息时间表"))&&(setTimeout(sa,80),setTimeout(sa,300))},!0)),ve(),ut(),st(),la();let j=e(()=>{we(),Se(),ve()},"layoutWave");setTimeout(j,200),setTimeout(j,800),window.__urpppLoadBound||(window.__urpppLoadBound=!0,window.addEventListener("load",()=>{ut(),st(),tt(),la(),ve(),we(),Se()})),setTimeout(()=>{document.body.classList.add("urppp-ready"),vt()},600),console.log("[URP++] style applied apple-leaning");try{bindScheduleHoverNearCursor()}catch{}So()}e(li,"beautifyInternal");function ci(t){if(!t)return;let r=t.querySelector("#urppp-set-brutal-palettes");if(!r)return;let a=to();r.innerHTML="",rt.filter(p=>p.id!==V).forEach(p=>{let s=document.createElement("button");s.type="button",s.className="urppp-set-scheme"+(p.id===a.id?" ac":""),s.dataset.palette=p.id,s.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:#000"></span>','  <span style="background:'+p.accent+'"></span>','  <span style="background:'+p.secondary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+p.name+"</strong>","  <em>"+p.desc+"</em>","</div>"].join(""),s.addEventListener("click",()=>eo(p.id,{select:!0})),r.appendChild(s)})}e(ci,"renderBrutalPaletteCards");let _e=Wn({getPrivacySettings:xr,setPrivacySettings:ta,getCustomIdentity:Pr,setCustomIdentity:Ja,applyDisplay:e(()=>Gt(document),"applyDisplay"),refreshCleanDisplay:ya,finishActiveDirectEdit:e(t=>{mr?.__finish&&mr.__finish(t)},"finishActiveDirectEdit")}),di=_e.sync,wl=_e.collect,kl=_e.setStatus,ui=_e.bind,ha=Hn({document,getSettings:xe,setSettings:Ya,validateMapping:_r,defaultMapping:ce,getRecoveryMessage:e(()=>et,"getRecoveryMessage")}),Al=ha.setStatus,mi=ha.sync,bi=ha.bind;function Kt(){let t=document.getElementById("urppp-settings-panel");if(!t)return;let r=Jt()||ft,a=Cr(),p=Vt(),s=Qt(),i=dr(),c=zr(i),h=Lr(i),w=Za(i),E={};t.querySelectorAll(".urppp-set-mode").forEach(L=>{E[L.dataset.theme]=Yr(L.dataset.theme,i)}),Gn(t,{seed:r,currentTheme:p,followSystem:s,skinId:i,darkSupported:c,dynamicSupported:h,fixedPalettes:w,followUseDynamic:ye(),cleanDefault:Ke(),cleanAnalysis:Ze()?"direct":"tab",appleEdge:fr(),autoUpdate:Ga(),modeAvailability:E}),w&&ci(t);try{di(t)}catch{}try{mi(t)}catch{}try{window.__urpppCleanMode&&typeof window.__urpppCleanMode.refreshRender=="function"&&window.__urpppCleanMode.refreshRender()}catch{}let M=t.querySelector("#urppp-set-presets");M&&(M.innerHTML="",Xe().forEach(L=>{let D=document.createElement("button");D.type="button",D.className="urppp-set-swatch"+(L.toLowerCase()===r.toLowerCase()?" ac":""),D.title=L,D.style.background=L,D.addEventListener("click",()=>{GM_setValue(T,L),Qt()?Wt(yr(),{system:!0}):Wt("scu-red",{manual:!0}),Kt()}),M.appendChild(D)}));let j=t.querySelector("#urppp-set-schemes");j&&(j.innerHTML="",Er(r).forEach(L=>{let D=document.createElement("button");D.type="button",D.className="urppp-set-scheme"+(L.id===a?" ac":""),D.dataset.scheme=L.id,D.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+L.bg+'"></span>','  <span style="background:'+L.surface+";border-color:"+L.border+'"></span>','  <span style="background:'+L.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+L.name+"</strong>","  <em>"+L.desc+"</em>","</div>"].join(""),D.addEventListener("click",()=>{Qe(L.id),GM_setValue(T,r),Qt()?Wt(yr(),{system:!0}):Wt("scu-red",{manual:!0}),Kt()}),j.appendChild(D)}));try{renderSkinCards(t)}catch(L){try{console.warn("[URP++] renderSkinCards",L)}catch{}}try{let L=t.querySelector(".urppp-about-ver, #urppp-about-ver");L&&(L.textContent="SCU URP++ v"+n,L.tagName==="A"&&(L.setAttribute("href",o.repo),L.setAttribute("target","_blank"),L.setAttribute("rel","noopener noreferrer")))}catch{}try{zo(t)}catch{}}e(Kt,"syncSettingsPanelUI");let _o=jn({document,ensurePanel:Lo,syncPanel:Kt,refreshUpdateStatus:refreshUpdateStatusHint}),hi=Un({document,theme:{isModeAvailable:Yr,apply:Wt,supportsDark:zr,supportsDynamic:Lr,getFollowSystem:Qt,setFollowSystem:he,resolveFollowTheme:yr,getCurrent:Vt,getFollowDynamic:ye,setFollowDynamic:ea,syncNavbar:ht},preferences:{getCleanDefault:Ke,setCleanDefault:Gp,getCleanAnalysis:e(()=>Ze()?"direct":"tab","getCleanAnalysis"),setCleanAnalysis:Jp,getAppleEdge:fr,setAppleEdge:Vp,applySkin:er,getAutoUpdate:Ga,setAutoUpdate:Yp,checkUpdates:checkForUpdates},accent:{normalize:Rt,setAccent:e(t=>GM_setValue(T,t),"setAccent"),savePreset:Up,getScheme:Cr,setScheme:Qe,listSchemePreviews:Er},syncPanel:Kt}),Eo=Ia({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:n},uiDeps:{openSubpanel:e(t=>{t==="plugin-store"&&gi("plugin")},"openSubpanel")}});e((function(){let r=e(()=>{try{Eo.bootFromCache("assist")}catch{}},"run");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r()}),"bootstrapPlugins")();function Co(){return _o.open()}e(Co,"openSettingsPanel");function Po(){_o.close()}e(Po,"closeSettingsPanel");let Ee="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=";function zo(t){let r=t&&t.querySelector?t.querySelector("#urppp-about-logo"):document.getElementById("urppp-about-logo");r&&(r.getAttribute("src")!==Ee&&r.setAttribute("src",Ee),r.removeAttribute("referrerpolicy"),r.alt="SCU URP++",r.style.maxWidth="100%",r.style.height="auto",r.style.display="block")}e(zo,"ensureAboutLogo");function Lo(){if(document.getElementById("urppp-settings-panel"))return;yi();try{er()}catch{}let t=document.createElement("div");t.id="urppp-settings-mask",t.addEventListener("click",Po);let r=document.createElement("div");r.id="urppp-settings-panel",r.setAttribute("role","dialog"),r.setAttribute("aria-label","URP++ 设置");let a=Ee;r.innerHTML=On({logoData:Ee,repositoryUrl:o.repo,version:n}),document.documentElement.appendChild(t),document.documentElement.appendChild(r),Dn(r),r.querySelector("#urppp-set-close").addEventListener("click",Po);try{ui(r)}catch(s){console.warn("[URP++] privacy settings",s)}try{bi(r)}catch(s){console.warn("[URP++] JSON settings",s)}try{zo(r)}catch{}let p=r.querySelector("#urppp-about-logo");p&&!p.__urpppFallback&&(p.__urpppFallback=!0,p.addEventListener("error",()=>{p.dataset.fallback!=="1"&&(p.dataset.fallback="1",p.src=a)})),hi.bind(r);try{Eo.renderAssistUi(r.querySelector("#urppp-set-assist-slot"))}catch(s){console.warn("[URP++] plugin manager",s)}}e(Lo,"ensureSettingsPanel");function gi(t){let r=document.getElementById("urppp-settings-panel");if(!r)return;let a=document.getElementById("urppp-store-subpanel");a||(a=document.createElement("div"),a.id="urppp-store-subpanel",a.className="urppp-store-subpanel",a.innerHTML=`
        <div class="urppp-store-sub-head">
          <button type="button" class="urppp-store-sub-back" id="urppp-store-sub-back" aria-label="返回">←</button>
          <div class="urppp-store-sub-title" id="urppp-store-sub-title"></div>
        </div>
        <div class="urppp-store-sub-body" id="urppp-store-sub-body"></div>`,r.appendChild(a),a.querySelector("#urppp-store-sub-back").onclick=fi);let p=a.querySelector("#urppp-store-sub-title"),s=a.querySelector("#urppp-store-sub-body");p.textContent=t==="theme"?"主题商店":"插件商店",s.innerHTML="",t==="theme"?renderThemeStoreBody(s):renderPluginStoreBody(s),a.classList.add("open")}e(gi,"openStoreSubPanel");function fi(){let t=document.getElementById("urppp-store-subpanel");if(!t)return;t.classList.remove("open");let r=t.querySelector("#urppp-store-sub-body");r&&(r.innerHTML="")}e(fi,"closeStoreSubPanel");function Sl(t){t.querySelectorAll(".urppp-store-tab").forEach(r=>{r.addEventListener("click",()=>{t.querySelectorAll(".urppp-store-tab").forEach(p=>p.className="urppp-store-tab"),r.className="urppp-store-tab ac",t.querySelectorAll(".urppp-store-pane").forEach(p=>p.style.display="none");let a=t.querySelector('.urppp-store-pane[data-pane="'+r.dataset.tab+'"]');a&&(a.style.display="")})})}e(Sl,"bindStoreTabs");function nr(t){if(t==null||t==="")return!1;let r=String(t).trim();if(!r)return!1;if(/未评估|未评教|待评估|待评教/.test(r))return!0;let a=Number(r);return!Number.isNaN(a)&&a<0}e(nr,"isUnevaluatedScore");function Ce(t){if(t==null||t==="")return!1;let r=Number(t);return!Number.isNaN(r)&&r>=0&&r<=5}e(Ce,"isValidOfficialGpa");function Pe(t){let r=String(t||"").trim();if(!r)return"";let a=r.match(/[\u4e00-\u9fffA-Za-z0-9]/);return a?a[0]:r.charAt(0)}e(Pe,"firstContentChar");function ga(t,r){let a=String(t||""),p=Number(r)||0;return!a||p<=0||p>a.length?!1:a.charAt(p-1)==="1"}e(ga,"weekBitmapActive");function $r(t){if(t==null||t==="")return null;let r=String(t).trim();if(!r||nr(r)||/^免修$|^通过$|^取消$|^缓考$|^旷考$|^缺考$/.test(r))return null;if(/^A\+$/i.test(r)||/^A$/i.test(r))return 4;if(/^A-$/i.test(r))return 3.7;if(/^B\+$/i.test(r))return 3.3;if(/^B$/i.test(r))return 3;if(/^B-$/i.test(r))return 2.7;if(/^C\+$/i.test(r))return 2.3;if(/^C$/i.test(r))return 2;if(/^C-$/i.test(r))return 1.7;if(/^D$/i.test(r))return 1.3;if(/^F$/i.test(r))return 0;if(/优秀/.test(r))return 4;if(/良好/.test(r))return 3;if(/中等/.test(r))return 2;if(/及格/.test(r)&&!/不及格/.test(r))return 1;if(/不及格|不合格|不通过/.test(r))return 0;if(/合格/.test(r))return 1;let a=parseFloat(r.replace(/[^\d.]/g,""));if(Number.isNaN(a)||a<0)return null;let p=Math.round(a);return p<60?0:p>100?4:SCU_SCORE_GPA_TABLE[p]!=null?SCU_SCORE_GPA_TABLE[p]:SCU_SCORE_GPA_TABLE[Math.max(60,Math.min(100,Math.floor(a)))]||0}e($r,"scoreToGpa");function Nr(t){let r=String(t||"").trim();if(!r||nr(r))return null;if(/优秀/.test(r))return 95;if(/良好/.test(r))return 85;if(/中等/.test(r))return 75;if(/及格/.test(r)&&!/不及格/.test(r))return 65;if(/不及格|不合格|不通过/.test(r))return 0;if(/合格/.test(r))return 70;if(/^A/i.test(r))return 95;if(/^B/i.test(r))return 85;if(/^C/i.test(r))return 75;if(/^D/i.test(r))return 65;if(/^F/i.test(r))return 0;let a=parseFloat(r.replace(/[^\d.]/g,""));return Number.isNaN(a)||a<0?null:a}e(Nr,"scoreToNumber");function vr(t){return Math.round((Number(t)||0)*100)/100}e(vr,"round2");function qo(t){return/必修/.test(String(t||""))}e(qo,"isRequiredAttr");function Zt(t){let r=0,a=0,p=0,s=0,i=0,c=0,h=0,w=0;return(t||[]).forEach(E=>{if(E&&(E.unevaluated||nr(E.score)))return;let M=Number(E.credit)||0,j=Nr(E.score),L=Ce(E.officialGpa)?Number(E.officialGpa):$r(E.score);j==null||M<=0||(r+=M,a+=j*M,L!=null&&(p+=L*M,s+=M),E.required&&(i+=M,c+=j*M,L!=null&&(h+=L*M,w+=M)))}),{totalCredit:vr(r),avgScore:vr(r?a/r:0),avgGpa:vr(s?p/s:0),requiredCredit:vr(i),requiredGpa:vr(w?h/w:0),requiredAvg:vr(i?c/i:0),count:(t||[]).length}}e(Zt,"summarizeCourses");function fa(t){let r=String(t||"");return/^https?:\/\//i.test(r)?r:r.startsWith("//")?location.protocol+r:r.startsWith("/")?location.origin+r:location.origin+"/"+r.replace(/^\.\//,"")}e(fa,"absUrl");function Ut(t,r){let a=fa(t),p=r&&r.method||"GET",s=r&&r.data||null;return new Promise((i,c)=>{let h=e((w,E)=>w?i(E):c(new Error(E||"fetch failed")),"done");try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:p,url:a,data:s||void 0,headers:r&&r.headers?r.headers:{},withCredentials:!0,onload:e(w=>{w.status>=200&&w.status<400?h(!0,w.responseText||""):h(!1,"HTTP "+w.status)},"onload"),onerror:e(()=>h(!1,"network error"),"onerror")});return}}catch{}fetch(a,{method:p,credentials:"include",cache:"no-store",headers:r&&r.headers?r.headers:{},body:s||void 0}).then(w=>{if(!w.ok)throw new Error("HTTP "+w.status);return w.text()}).then(w=>h(!0,w)).catch(w=>h(!1,w&&w.message))})}e(Ut,"fetchText");function ze(t){return new DOMParser().parseFromString(String(t||""),"text/html")}e(ze,"parseHtml");function To(){if(document.getElementById("urppp-feature-style"))return;let t=document.createElement("style");t.id="urppp-feature-style",t.textContent=sp,(document.head||document.documentElement).appendChild(t)}e(To,"ensureFeatureStyles");function xi(){if(document.getElementById("urppp-schedule-export-style"))return;let t=document.createElement("style");t.id="urppp-schedule-export-style",t.textContent=dp,(document.head||document.documentElement).appendChild(t)}e(xi,"ensureScheduleExportStyles");function yi(){if(document.getElementById("urppp-settings-style"))return;let t=document.createElement("style");t.id="urppp-settings-style",t.textContent=up,(document.head||document.documentElement).appendChild(t)}e(yi,"ensureSettingsStyles");function Mo(t){let a=(t&&t.querySelector?t:document).querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(!a)return null;let p=a.querySelector(".urppp-user-name-value");if(p)return p;let s=a.cloneNode(!0);s.querySelectorAll("small, i, img, b, .badge").forEach(h=>h.remove());let i=(s.textContent||"").replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim();Array.from(a.childNodes).forEach(h=>{h.nodeType===Node.TEXT_NODE&&h.textContent.trim()&&h.remove()});let c=document.createElement("span");return c.className="urppp-user-name-value",c.textContent=i||"同学",c.__urpppOriginalText=c.textContent,a.appendChild(c),c}e(Mo,"ensureNavNameTarget");function Le(t){let r=String(t||"").replace(/[\s:：]/g,"");return r?/姓名|英文姓名|姓名拼音/.test(r)?"name":/学号|证件|身份证|护照|证书编号|考生号|录取号|学籍号/.test(r)?"identity":/学院|院系|专业|班级|年级|主修方案|培养方案|专业方向|分流方向|毕业中学/.test(r)?"organization":/电话|手机|电子邮件|邮箱|QQ|地址|家长|个人主页|出生日期|入学日期|乘车区间|性别|籍贯|民族|政治面貌|国籍|户口|户籍|生源|出生地|健康|宗教|血型|婚姻|联系人|家庭/.test(r)?"contact":/绩点|GPA/.test(r)?"gpa":/学分/.test(r)?"credit":/成绩|分数|高考总分|均分|平均分|必修平均|课程门数|及格课程|不及格课程|待修读课程|已修读课程/.test(r)?"grade":/课表|日程安排/.test(r)?"schedule":"":""}e(Le,"classifyPrivacyLabel");function vi(t,r){let a=String(t||"")+" "+String(r||"");return/绩点|GPA/.test(a)?"majorGpa":/主修为|培养方案|方案/.test(a)?"majorPlan":/尚不及格|未及格/.test(a)?"failedCourses":/待修读课程/.test(a)?"remainingCourses":/已修读课程/.test(a)?"completedCourses":""}e(vi,"classifyHomeDataKey");function qe(t,r,a){let p=r?` data-urppp-edit-key="${r}"`:"";return`<span class="urppp-private-value" data-urppp-private="${t}"${p}>${a}</span>`}e(qe,"homePrivateValueSpan");function _l(t,r){let a=At(t),p=At(r),s=vi(t,r),c={completedCourses:"other",failedCourses:"other",majorGpa:"gpa",majorPlan:"organization",remainingCourses:"other"}[s]||Le(String(t||"")+" "+String(r||""));if(c==="organization")return r?{valueHtml:a,labelHtml:qe("organization",s,p)}:{valueHtml:qe("organization",s,a),labelHtml:p};if(!["grade","gpa","credit","other"].includes(c))return{valueHtml:a,labelHtml:p};let h=String(r||"").match(/-?\d+(?:\.\d+)?/);if(!(/^-?\d+(?:\.\d+)?$/.test(String(t||"").trim())||/^(优秀|良好|中等|及格|不及格|合格|不合格)$/.test(String(t||"").trim()))&&h){let E=h.index||0,M=String(r).slice(0,E),j=String(r).slice(E+h[0].length);return{valueHtml:a,labelHtml:`${At(M)}${qe(c,s,At(h[0]))}${At(j)}`}}return{valueHtml:qe(c,s,a),labelHtml:p}}e(_l,"statCardPrivacyMarkup");function wr(t,r){if(!t||t.mode==="off")return"";if(t.mode==="one")return t.mask||ue;if(r==="name")return"";let a=t.fields&&t.fields[r];return!a||!a.enabled?"":String(a.replacement||t.mask||ue)}e(wr,"privacyReplacement");function re(t,r){if(!(!t||!r)&&!(t.querySelector&&t.querySelector("input,select,textarea,button"))){if(!t.classList.contains("urppp-private-text")){let a=getComputedStyle(t).fontSize;a&&a!=="0px"&&t.style.setProperty("--urppp-private-font-size",a)}t.classList.add("urppp-private-text"),t.setAttribute("data-urppp-private-mask",r)}}e(re,"markPrivateText");function Io(t,r){if(!t||!t.parentElement)return;let a=t.parentElement;t.classList.add("urppp-private-avatar"),a.classList.add("urppp-private-avatar-host"),a.setAttribute("data-urppp-private-mask",r||ue);let p=t.getBoundingClientRect();a.style.setProperty("--urppp-avatar-left",t.offsetLeft+"px"),a.style.setProperty("--urppp-avatar-top",t.offsetTop+"px"),a.style.setProperty("--urppp-avatar-width",Math.max(1,p.width)+"px"),a.style.setProperty("--urppp-avatar-height",Math.max(1,p.height)+"px"),a.style.setProperty("--urppp-avatar-radius",getComputedStyle(t).borderRadius||"50%")}e(Io,"markPrivateAvatar");function wi(t,r){if(!t||!r)return;let a=t.matches("table")&&t.closest(".table-responsive, .urppp-table-wrap")||t;a.classList.add("urppp-private-block"),a.setAttribute("data-urppp-private-mask",r)}e(wi,"markPrivateBlock");function ki(t,r){if(!(!t||!W[r])){if(!t.hasAttribute("data-urppp-direct-tabindex")){let a=t.getAttribute("tabindex");t.setAttribute("data-urppp-direct-tabindex",a??"__none__"),t.__urpppDirectTitle=t.getAttribute("title"),t.__urpppDirectAriaLabel=t.getAttribute("aria-label")}t.classList.add("urppp-direct-editable"),t.setAttribute("tabindex","0"),t.setAttribute("data-urppp-edit-key",r),t.setAttribute("aria-label","修改"+W[r]+"显示值"),t.title="点击修改显示值"}}e(ki,"markDirectEditable");let mr=null;function $o(t){let r=t&&t.getAttribute("data-urppp-edit-key");if(!r||!W[r])return;mr&&mr.__finish&&mr.__finish(!1);let a=xr();if(a.mode!=="custom"||!a.directEdit.enabled)return;let s=String(a.directEdit.values[r]||"")||t.getAttribute("data-urppp-private-mask")||String(t.textContent||"").trim(),i=t.getBoundingClientRect(),c=t.parentElement?.getBoundingClientRect(),h=i.height>=8||!c?i:{left:i.left,top:c.top,width:Math.max(i.width,40),height:c.height},w=document.createElement("input"),E=getComputedStyle(t),M=Math.min(Math.max(h.width+64,140),Math.max(140,window.innerWidth-24)),j=Math.min(Math.max(12,h.left),Math.max(12,window.innerWidth-M-12)),L=Math.min(Math.max(12,h.top+(h.height-36)/2),Math.max(12,window.innerHeight-48));w.type="text",w.maxLength=80,w.className="urppp-direct-edit-input",w.value=s,w.setAttribute("aria-label","修改"+W[r]+"显示值"),w.style.left=j+"px",w.style.top=L+"px",w.style.setProperty("--urppp-direct-edit-width",M+"px"),w.style.fontFamily=E.fontFamily,w.style.fontSize=(window.innerWidth<=520?16:Math.min(18,Math.max(13,parseFloat(E.fontSize)||14)))+"px";let D=!1,J=e(B=>{if(D||(D=!0,w.remove(),mr===w&&(mr=null),B))return;let O=xr();O.mode!=="custom"||!O.directEdit.enabled||(O.directEdit.values[r]=String(w.value||"").trim().slice(0,80),ta(O),Gt(document),ka(O.directEdit.values[r]?"显示值已更新":"已恢复分类设置"))},"finish");w.__finish=J,w.addEventListener("click",B=>B.stopPropagation()),w.addEventListener("blur",()=>J(!1)),w.addEventListener("keydown",B=>{B.key==="Enter"&&(B.preventDefault(),J(!1)),B.key==="Escape"&&(B.preventDefault(),J(!0))}),document.documentElement.appendChild(w),mr=w,w.focus(),w.select()}e($o,"openDirectEditInput");function Ai(){document.__urpppDirectEditBound||(document.__urpppDirectEditBound=!0,document.addEventListener("click",t=>{let r=t.target?.closest?.(".urppp-direct-editable");r&&(t.preventDefault(),t.stopPropagation(),$o(r))},!0),document.addEventListener("keydown",t=>{if(!["Enter"," "].includes(t.key))return;let r=t.target?.closest?.(".urppp-direct-editable");r&&(t.preventDefault(),t.stopPropagation(),$o(r))},!0))}e(Ai,"bindDirectEditInteraction");function Si(t){let r=t&&t.querySelectorAll?t:document;r.querySelectorAll(".urppp-direct-editable").forEach(a=>{let p=a.getAttribute("data-urppp-direct-tabindex");a.classList.remove("urppp-direct-editable"),a.removeAttribute("data-urppp-direct-tabindex"),p==="__none__"?a.removeAttribute("tabindex"):p!=null&&a.setAttribute("tabindex",p),a.__urpppDirectTitle==null?a.removeAttribute("title"):a.setAttribute("title",a.__urpppDirectTitle),a.__urpppDirectAriaLabel==null?a.removeAttribute("aria-label"):a.setAttribute("aria-label",a.__urpppDirectAriaLabel),delete a.__urpppDirectTitle,delete a.__urpppDirectAriaLabel}),r.querySelectorAll(".urppp-private-text").forEach(a=>{a.classList.remove("urppp-private-text"),a.removeAttribute("data-urppp-private-mask"),a.style.removeProperty("--urppp-private-font-size")}),r.querySelectorAll(".urppp-private-avatar").forEach(a=>a.classList.remove("urppp-private-avatar")),r.querySelectorAll(".urppp-private-avatar-host").forEach(a=>{a.classList.remove("urppp-private-avatar-host"),a.removeAttribute("data-urppp-private-mask"),["--urppp-avatar-left","--urppp-avatar-top","--urppp-avatar-width","--urppp-avatar-height","--urppp-avatar-radius"].forEach(p=>a.style.removeProperty(p))}),r.querySelectorAll(".urppp-private-avatar-block").forEach(a=>{a.classList.remove("urppp-private-avatar-block"),a.removeAttribute("data-urppp-private-mask")}),r.querySelectorAll(".urppp-private-block").forEach(a=>{a.classList.remove("urppp-private-block"),a.removeAttribute("data-urppp-private-mask")})}e(Si,"clearPrivacyDisplay");function No(t,r,a){if(!t||t.matches?.("input,select,textarea,button")||t.querySelector?.("input,select,textarea,button"))return;if(t.__urpppOriginalText==null){if(!r)return;t.__urpppOriginalText=t.textContent||""}let p=r&&a?a:t.__urpppOriginalText;t.textContent!==p&&(t.textContent=p)}e(No,"applyCustomText");function _i(t){let r=t&&t.querySelectorAll?t:document,a=Pr(),s=r.querySelector?.(".urppp-user-name-value")||(a.nameEnabled?Mo(r):null);No(s,a.nameEnabled,a.name),r.querySelectorAll(".profile-info-row").forEach(h=>{let w=h.querySelector(".profile-info-name"),E=h.querySelector(".profile-info-value");!w||!E||String(w.textContent||"").replace(/[\s:：]/g,"")!=="姓名"||No(E,a.nameEnabled,a.name)});let i=Jr(a.avatar),c=a.avatarEnabled&&!!i;r.querySelectorAll("#navbar img.nav-user-photo, #urppp-mobile-user img.nav-user-photo, img#avatar, .profile-picture img").forEach(h=>{let w=h.getAttribute("src")||"";w&&w!==h.__urpppAppliedCustomSrc&&(h.__urpppOriginalSrc=w),c?(h.__urpppOriginalSrc==null&&(h.__urpppOriginalSrc=w),w!==i&&h.setAttribute("src",i),h.__urpppAppliedCustomSrc=i):h.__urpppAppliedCustomSrc!=null&&(h.__urpppOriginalSrc&&h.setAttribute("src",h.__urpppOriginalSrc),delete h.__urpppAppliedCustomSrc)})}e(_i,"applyCustomIdentityDisplay");function Ei(t,r){t.querySelectorAll(".profile-info-row").forEach(a=>{let p=a.querySelector(".profile-info-name, th, label"),s=a.querySelector(".profile-info-value, td:last-child");if(!p||!s||p===s)return;let i=Le(p.textContent),c=wr(r,i);c&&re(s,c)})}e(Ei,"applyProfilePrivacy");function Ci(t,r){t.querySelectorAll("table").forEach(a=>{let p=Array.from(a.querySelectorAll("thead th, thead td, tr:first-child th, tr:first-child td"));if(!p.length)return;let s=p.map(i=>{let c=Le(i.textContent);return["grade","gpa","credit"].includes(c)?c:""});s.some(Boolean)&&a.querySelectorAll("tbody tr").forEach(i=>{let c=i.querySelectorAll("td");s.forEach((h,w)=>{let E=wr(r,h);h&&E&&re(c[w],E)})})})}e(Ci,"applyScoreTablePrivacy");function Pi(t){let r=t&&t.querySelectorAll?t:document,a=xr();if(a.mode==="off")return;let p=wr(a,"name"),s=wr(a,"avatar"),i=wr(a,"schedule"),c=p?Mo(r):r.querySelector?.(".urppp-user-name-value");p&&re(c,p),[["#courseNum, #coursePas, #xy_kcms","other"],["#gpa","gpa"],["#bottom","organization"]].forEach(([E,M])=>{let j=wr(a,M);j&&r.querySelectorAll(E).forEach(L=>re(L,j))}),Ci(r,a);let w=a.mode==="custom"&&a.directEdit.enabled;if(r.querySelectorAll("[data-urppp-private]").forEach(E=>{let M=E.getAttribute("data-urppp-private"),j=E.getAttribute("data-urppp-edit-key"),D=(w&&j?String(a.directEdit.values[j]||"").trim():"")||wr(a,M);!["avatar","schedule"].includes(M)&&D&&re(E,D),w&&j&&ki(E,j)}),w&&Ai(),Ei(r,a),s&&(r.querySelectorAll('[data-urppp-private="avatar"]').forEach(E=>{let M=E.matches("img")?E:E.querySelector("img");M?Io(M,s):(E.classList.add("urppp-private-avatar-block"),E.setAttribute("data-urppp-private-mask",s))}),r.querySelectorAll("#navbar img.nav-user-photo, img#avatar, .profile-picture img, .uc-avatar img").forEach(E=>Io(E,s))),i){let E=Array.from(r.querySelectorAll('[data-urppp-private="schedule"], #main-calendar, #courseTable'));E.filter(M=>!E.some(j=>j!==M&&j.contains(M))).forEach(M=>wi(M,i))}}e(Pi,"applyPrivacyDisplay");let xa=0,pr=[];function Bo(){let t=xr(),r=Pr();return t.mode!=="off"||r.nameEnabled||r.avatarEnabled}e(Bo,"personalDisplayIsEnabled");function zi(){pr=pr.filter(({root:t})=>t&&t.isConnected),pr.forEach(({root:t,observer:r})=>r.observe(t,{childList:!0,subtree:!0}))}e(zi,"resumePersonalDisplayObservers");function Gt(t){let r=t||document;pr.forEach(({observer:a})=>a.disconnect());try{To()}catch{}try{Si(r)}catch{}try{_i(r)}catch(a){console.warn("[URP++] custom identity",a)}try{Pi(r)}catch(a){console.warn("[URP++] privacy",a)}Bo()?(zi(),qi()):(clearTimeout(xa),pr=[])}e(Gt,"applyPersonalDisplay");function Li(t){clearTimeout(xa),xa=setTimeout(()=>Gt(t||document),140)}e(Li,"schedulePersonalDisplay");function ya(){try{at&&at.open&&Hr()}catch{}}e(ya,"refreshCleanPersonalDisplay");function qi(){if(!Bo()){pr.forEach(({observer:t})=>t.disconnect()),pr=[];return}[document.getElementById("navbar"),document.getElementById("page-content-template"),document.getElementById("urppp-clean-root")].filter(Boolean).forEach(t=>{if(pr.some(a=>a.root===t))return;let r=new MutationObserver(()=>Li(document));pr.push({root:t,observer:r}),r.observe(t,{childList:!0,subtree:!0})})}e(qi,"bindPersonalDisplayObservers");function Ti(t){let r=Object.assign({},t||{}),a=Pr();a.nameEnabled&&a.name&&(r.name=a.name);let p=Jr(a.avatar);return a.avatarEnabled&&p&&(r.avatar=p),r}e(Ti,"personalizedProfile");let Fo="/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback",Mi="/student/courseSelect/thisSemesterCurriculum/callback",Ii="/student/courseSelect/thisSemesterCurriculum/index";async function $i(){let t=document.querySelector("#planCode, #zxjxjhh");if(t&&t.value&&t.value!=="no")return String(t.value);try{let r=new URLSearchParams(location.search),a=r.get("planCode")||r.get("zxjxjhh");if(a)return a}catch{}if(at&&at.schedule&&at.schedule.exportData){let r=at.schedule.exportData.semester&&at.schedule.exportData.semester.planCode;if(r)return r}if(/\/student\/courseSelect\/courseSelectResult\//.test(location.pathname))try{let r=await Ut(Mi),a=JSON.parse(r),p=Gr(a);if(p)return p}catch{}return""}e($i,"resolveSchedulePlanCode");async function Do(t){let r=await $i(),a=r?{method:"POST",data:"planCode="+encodeURIComponent(r),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}:null,p=await Ut(Fo,a),s;try{s=JSON.parse(p)}catch{throw new Error("课表接口返回了非 JSON 内容，请刷新教务页面后重试")}r||(r=Gr(s)),(!s.jcsjbs||!s.jcsjbs.length)&&r&&(s=JSON.parse(await Ut(Fo,{method:"POST",data:"planCode="+encodeURIComponent(r),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}})));let i=Oo(s,r,t);if(!i.courses.length)throw new Error("没有读取到可导出的课表数据");return i}e(Do,"loadScheduleExportData");function va(t){return String(t||"学生课表").replace(/[\\/:*?"<>|]+/g,"-").replace(/\s+/g,"").slice(0,80)||"学生课表"}e(va,"safeScheduleFilename");function wa(t,r){let a=URL.createObjectURL(t),p=document.createElement("a");p.href=a,p.download=r,p.style.display="none",document.body.appendChild(p),p.click(),p.remove(),setTimeout(()=>URL.revokeObjectURL(a),1200)}e(wa,"downloadBlob");function Ni(t){let r=Fe(t),a=xe(),p=a.enabled?je(r,a.mapping):De(r),s=JSON.stringify(p,null,2)+`
`;return wa(new Blob([s],{type:"application/json;charset=utf-8"}),va(t.semester.label)+".json"),Object.assign({customFormat:a.enabled},r.stats)}e(Ni,"exportScheduleJson");function jo(t){let a=(Array.from(document.querySelectorAll(".span_bbzx")).map(c=>c.textContent||"").join(" ")+" "+(document.querySelector("#navbar")?.textContent||"")).replace(/\s+/g," ").match(/(\d{4})-(\d{4})\s*(春|秋).*?第\s*(\d{1,2})\s*周/);if(!a)return"";let p=a[3]==="秋"?"1":"2";if(t&&!String(t).startsWith(a[1]+"-"+a[2]+"-"+p))return"";let s=Number(a[4]);if(s<1||s>30)return"";let i=Ma(new Date);return i.setDate(i.getDate()-(s-1)*7),de(i)}e(jo,"deriveCurrentSemesterMonday");function Oo(t,r,a){let p=r||Gr(t),s=jo(p)||ra()[p]||"";return Pn(t,p,a,{firstMonday:s})}e(Oo,"normalizeScheduleDataForPage");function Bi(t){let r=t.semester.planCode,a=ra()[r],p=jo(r);return p?(Va(r,p),Promise.resolve(p)):Ur(a)?Promise.resolve(a):new Promise((s,i)=>{document.querySelector('.urppp-dialog-mask[data-dialog="schedule-date"]')?.remove();let c=document.createElement("div");c.className="urppp-dialog-mask",c.dataset.dialog="schedule-date",c.innerHTML=`<div class="urppp-dialog" role="dialog" aria-modal="true"><h3>确认第一教学周周一</h3><p>${At(t.semester.label)}没有可可靠推导的起始日期。该日期决定 ICS 中每节课的实际日历时间；预填值仅为估算，请对照校历核对。</p><input type="date" value="${At(a||An(r))}"><div class="urppp-dialog-actions"><button type="button" class="urppp-set-btn ghost" data-action="cancel">取消</button><button type="button" class="urppp-set-btn" data-action="ok">确认并导出</button></div></div>`,document.documentElement.appendChild(c);let h=e((w,E)=>{c.remove(),w?i(w):s(E)},"close");c.querySelector('[data-action="cancel"]').addEventListener("click",()=>h(new Error("已取消导出"))),c.querySelector('[data-action="ok"]').addEventListener("click",()=>{let w=c.querySelector("input").value;Ur(w)&&(Va(r,w),h(null,w))}),c.addEventListener("click",w=>{w.target===c&&h(new Error("已取消导出"))})})}e(Bi,"requestScheduleFirstMonday");async function Fi(t){let r=await Bi(t),a=_n(t,r);return wa(new Blob([a],{type:"text/calendar;charset=utf-8"}),va(t.semester.label)+".ics"),En(t)}e(Fi,"exportScheduleIcs");let Di={apple:"类 Apple",flat:"极简扁平",organic:"自然有机",brutal:"新野兽派",editorial:"编辑杂志",neu:"新拟物"};function ir(t,r,a){if(typeof document>"u")return Rt(r)||"#000000";let p=document.createElement("span");p.style.cssText="position:fixed;left:-9999px;visibility:hidden;color:var("+t+","+r+")",(document.body||document.documentElement).appendChild(p);let s=getComputedStyle(p).color;p.remove();let i=String(s||"").match(/[\d.]+/g)?.map(Number)||[];if(i.length>=3){let c=se(i[0],i[1],i[2]),h=i.length>3?Math.max(0,Math.min(1,i[3])):1;return h<1?Nt(a||r,c,h):c}return Rt(s)||Rt(r)||"#000000"}e(ir,"resolvedScheduleImageColor");function Ho(){let t=Vt(),r=dr(),a=t==="dark",p=a?{bg:"#000000",surface:"#1C1C1E",input:"#2C2C2E",text:"#F5F5F7",secondary:"#A1A1A6",muted:"#8E8E93",border:"#38383A",primary:"#0A84FF"}:{bg:"#F5F5F7",surface:"#FFFFFF",input:"#F5F5F7",text:"#1D1D1F",secondary:"#6E6E73",muted:"#86868B",border:"#D2D2D7",primary:"#0071E3"},s={bg:ir("--bg",p.bg),surface:ir(r==="neu"?"--neu-base":"--surface",p.surface),input:ir("--input-bg",p.input),text:ir("--text",p.text),secondary:ir("--text-secondary",p.secondary),muted:ir("--text-muted",p.muted),border:ir("--border",p.border,ir(r==="neu"?"--neu-base":"--surface",p.surface)),primary:ir("--primary",p.primary)},i={apple:{frameRadius:24,headerRadius:13,gridRadius:10,cardRadius:12,frameStroke:1,cardStroke:1,shadow:"soft"},flat:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:2,cardStroke:2,shadow:"none"},organic:{frameRadius:30,headerRadius:18,gridRadius:14,cardRadius:18,frameStroke:1,cardStroke:1,shadow:"warm"},brutal:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:3,cardStroke:3,shadow:"hard"},editorial:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:1,cardStroke:1,shadow:"none",serif:!0},neu:{frameRadius:22,headerRadius:14,gridRadius:10,cardRadius:14,frameStroke:0,cardStroke:0,shadow:"neu"}};return{id:t,skin:r,dark:a,label:(Di[r]||r)+" · "+(Et[t]&&Et[t].name||t),colors:s,shape:i[r]||i.apple}}e(Ho,"currentScheduleImageTheme");function Ro(t,r){return Bn(t,r||Ho())}e(Ro,"buildScheduleSvg");function ji(t){return new Promise((r,a)=>{let p=new Blob([t.svg],{type:"image/svg+xml;charset=utf-8"}),s=URL.createObjectURL(p),i=new Image;i.onload=()=>{try{let h=Math.min(2,Math.sqrt(15e6/(t.width*t.height))),w=document.createElement("canvas");w.width=Math.floor(t.width*h),w.height=Math.floor(t.height*h);let E=w.getContext("2d");E.scale(w.width/t.width,w.height/t.height),E.fillStyle=t.background||"#F8FAFC",E.fillRect(0,0,t.width,t.height),E.drawImage(i,0,0,t.width,t.height),w.toBlob(M=>M?r(M):a(new Error("无法生成课表图片")),"image/png")}catch(c){a(c)}finally{URL.revokeObjectURL(s)}},i.onerror=()=>{URL.revokeObjectURL(s),a(new Error("课表图片渲染失败"))},i.src=s})}e(ji,"svgToPngBlob");async function Oi(t){let r=await ji(Ro(t));wa(r,va(t.semester.label)+".png")}e(Oi,"exportSchedulePng");function ka(t,r){document.getElementById("urppp-feature-toast")?.remove();let a=document.createElement("div");a.id="urppp-feature-toast",a.textContent=String(t||""),a.className=r?"error":"",document.documentElement.appendChild(a),requestAnimationFrame(()=>a.classList.add("open")),setTimeout(()=>{a.classList.remove("open"),setTimeout(()=>a.remove(),220)},r?4200:2400)}e(ka,"showFeatureToast");let Aa=Fn({document,window,ensureStyles:xi,loadData:Do,exportJson:Ni,exportIcs:Fi,exportPng:Oi,showToast:ka,nativePageUrl:Ii,navigate:e(t=>{location.href=t},"navigate"),logger:console});function Hi(t,r,a,p){return Aa.run(t,r,a,p)}e(Hi,"runScheduleExport");function Ri(t){return Aa.createMenu(t)}e(Ri,"createScheduleExportMenu");function Wi(t){if(t){try{t.stage.remove()}catch{}try{document.getElementById("urppp-pdf-reset-style")?.remove()}catch{}}}e(Wi,"disposeNativePdfCapture");function Ui(){window.__urpppPdfDiagnose||(window.__urpppPdfDiagnose=async()=>{let t={time:new Date().toISOString()},r=document.getElementById("mycoursetable"),a=document.getElementById("page-content-template");t.host=!!r,t.pageSource=!!a,t.hostCards=r?r.querySelectorAll("div.class_div").length:-1,t.hostHasCourseTable=r?!!r.querySelector("#courseTable"):!1,t.hostHasCourseTableBody=r?!!r.querySelector("#courseTableBody"):!1,t.hostTableId=r&&r.querySelector("table")?r.querySelector("table").id:"none";try{let s=op(r);t.stage="ok",t.stageCards=s.target.querySelectorAll(".urppp-pdf-card").length,t.stageTableId=s.target.querySelector("table")?s.target.querySelector("table").id:"none",Wi(s)}catch(s){t.stage="failed",t.stageError=s&&s.message||String(s)}let p=typeof unsafeWindow<"u"?unsafeWindow:window;return t.deps={dollar:typeof p.$,loadFileList:typeof(p.Import&&p.Import.LoadFileList),back:typeof p.back,html2canvas:typeof p.html2canvas,originalDivBuild:typeof p.__urpppOriginalDivBuild},t})}e(Ui,"bindNativePdfDiagnose");function Gi(t){return t?(Ui(),async()=>{let r=document.getElementById("urppp-settings-panel"),a=document.getElementById("urppp-settings-mask");r&&r.classList.contains("open")&&r.classList.remove("open"),a&&a.classList.contains("open")&&a.classList.remove("open");try{await ip(t,{document,page:typeof unsafeWindow<"u"?unsafeWindow:window,onAfterRestore:Zr})}catch(p){console.warn("[URP++] isolated native PDF export failed",p),ka("原生 PDF 隔离导出失败："+(p&&p.message||String(p))+"，请重试",!0)}}):null}e(Gi,"pagePdfExportHandler");function Sa(t=location){return/\/(?:student\/courseSelect\/(?:thisSemesterCurriculum|courseSelectResult|calendarSemesterCurriculum)|student\/personalSenate\/giveLessonInfo\/thisSemesterSchedule)\//.test(t.pathname)}e(Sa,"isPersonalSchedulePage");function Ji(t=location){return/\/student\/integratedQuery\/scoreQuery\/[^/]+\/index$/.test(t.pathname)}e(Ji,"isScoreQueryPage");function _a(){if(!Sa())return;let t=document.querySelector("#h4_id1")?.closest("h4")||document.querySelector("h4.header"),r=t?.querySelector(".right_top_oper")||document.querySelector("#mainDIV .right_top_oper, .page-content .right_top_oper"),a=Array.from((r||document).querySelectorAll("button, a")),p=e(c=>[c.textContent,c.getAttribute("title"),c.getAttribute("onclick")].filter(Boolean).join(" ").replace(/\s+/g," "),"signatureOf");if(a.forEach(c=>{/打印.*课表|\bdy\s*\(/i.test(p(c))&&c.setAttribute("data-urppp-native-print-source","1")}),document.getElementById("urppp-native-schedule-export"))return;let s=a.find(c=>/导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(p(c))),i=Ri({source:"native",pdfHandler:Gi(s)});if(i.id="urppp-native-schedule-export",s&&s.parentElement){s.__urpppNativeExportState||(s.__urpppNativeExportState={display:s.style.getPropertyValue("display"),displayPriority:s.style.getPropertyPriority("display"),ariaHidden:s.getAttribute("aria-hidden"),tabIndex:s.getAttribute("tabindex")}),s.setAttribute("data-urppp-native-export-source","1"),s.style.setProperty("display","none","important"),s.setAttribute("aria-hidden","true"),s.setAttribute("tabindex","-1"),s.parentElement.insertBefore(i,s.nextSibling);return}if(r)r.appendChild(i);else if(t)t.appendChild(i);else{let c=document.getElementById("page-content-template")||document.querySelector(".page-content");if(c){let h=document.createElement("div");h.className="urppp-export-fallback",h.appendChild(i),c.prepend(h)}}}e(_a,"patchNativeScheduleExport");let Br=null,Te=0;function Ea(){clearTimeout(Te),Te=0,Br&&Br.observer.disconnect(),Br=null}e(Ea,"disconnectNativeScheduleExportObserver");function Vi(){if(!Sa()){Ea();return}let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;if(!t||Br&&Br.root===t&&t.isConnected)return;Ea();let r=new MutationObserver(()=>{clearTimeout(Te),Te=setTimeout(()=>_a(),80)});r.observe(t,{childList:!0,subtree:!0}),Br={root:t,observer:r}}e(Vi,"bindNativeScheduleExportObserver");function Wo(t,r,a){a===null?t.removeAttribute(r):t.setAttribute(r,a)}e(Wo,"restoreOptionalAttribute");function Yi(t=document){let r=t&&t.querySelectorAll?t:document,a=r.matches?.("#urppp-native-schedule-export")?r:r.querySelector("#urppp-native-schedule-export");if(a){let p=a.closest(".urppp-export-fallback");a.remove(),p&&!p.children.length&&p.remove()}r.querySelectorAll("[data-urppp-native-export-source]").forEach(p=>{let s=p.__urpppNativeExportState;s&&(s.display?p.style.setProperty("display",s.display,s.displayPriority):p.style.removeProperty("display"),Wo(p,"aria-hidden",s.ariaHidden),Wo(p,"tabindex",s.tabIndex)),p.removeAttribute("data-urppp-native-export-source");try{delete p.__urpppNativeExportState}catch{}}),r.querySelectorAll("[data-urppp-native-print-source]").forEach(p=>{p.removeAttribute("data-urppp-native-print-source")})}e(Yi,"removeNativeScheduleExport");let Uo=Op({deps:{styles:fp,loadScores:nn,loadProfile:Go,scoreToNumber:Nr,scoreToGpa:$r,getInsertHost:e(()=>document.querySelector(".page-content")||document.getElementById("page-content-template")||null,"getInsertHost"),shouldAutoExpand:e(()=>{let t=/[?&]urppp=sa(?:&|$)/.test(window.location.search);if(t)try{history.replaceState(null,"",window.location.pathname+window.location.hash)}catch{}return t},"shouldAutoExpand")}}),Qi=fn([Ne({id:"schedule-export",matches:e(t=>Sa(t.location),"matches"),mount:e(()=>{_a(),Vi()},"mount"),unmount:e(t=>{Ea(),Yi(t?.lifecycleKey)},"unmount")}),Ne({id:"score-analysis",matches:e(t=>Ji(t.location),"matches"),mount:e(()=>{try{Uo.mount()}catch(t){console.warn("[URP++] score analysis mount",t)}},"mount"),unmount:e(()=>{try{Uo.unmount()}catch{}},"unmount")})]);function Me(){let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;return Qi.refresh({document,location,window,lifecycleKey:t})}e(Me,"refreshRouteFeatures");function Xi(t){Aa.bindHosts(t)}e(Xi,"bindScheduleExportHosts");function ee(t){return String(t||"").replace(/\u00a0/g," ").replace(/\s+/g," ").replace(/^[\s:：]+|[\s:：]+$/g,"").trim()}e(ee,"normalizeProfileValue");function Ie(t,r){if(!t||!t.querySelectorAll)return"";let a=(r||[]).map(s=>ee(s).replace(/[：:]/g,"")),p=t.querySelectorAll(".profile-info-row, tr");for(let s=0;s<p.length;s++){let i=p[s],c=i.querySelector(".profile-info-name, th, label"),h=i.querySelector(".profile-info-value, td:last-child");if(!c||!h||c===h)continue;let w=ee(c.textContent).replace(/[：:]/g,"");if(!a.some(M=>w===M||w.endsWith(M)))continue;let E=ee(h.textContent);if(E&&E!=="—"&&E!=="-")return E}return""}e(Ie,"readLabeledProfileValue");function Fr(t){return ee(t).replace(/^主修为\s*/,"").replace(/培养方案概况.*$/,"").replace(/…+/g,"").split(/主修必修GPA|GPA算法|已修读|尚不及格|本学期/)[0].trim()}e(Fr,"cleanMajorPlanName");function Ki(t){let r={majorPlan:"",majorGpa:""};return!t||!t.querySelectorAll||t.querySelectorAll(".infobox, .widget-box, .urppp-stat-card").forEach(a=>{let p=(a.innerText||a.textContent||"").trim(),s=ee(p);if(/主修必修GPA/.test(s)){let i=s.match(/(-?\d+(?:\.\d+)?)\s*主修必修GPA/)||s.match(/主修必修GPA[^\d-]{0,20}(-?\d+(?:\.\d+)?)/);if(i){let c=Number(i[1]),h=Number(r.majorGpa);Number.isFinite(c)&&c>=0&&c<=5&&(!r.majorGpa||h===0||c>0)&&(r.majorGpa=i[1])}}if(/主修为|培养方案/.test(s)){let i=s.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·+\-]{2,60}(?:培养方案|教学计划))/)||s.match(/^(.{2,60}?)\s*主修为/)||s.match(/主修为\s*(.{2,60})$/),c=Fr(i&&i[1]);if(c&&!/GPA|已修读|尚不及格|本学期/.test(c)){let h=/培养方案|教学计划/.test(c);(!r.majorPlan||h)&&(r.majorPlan=c)}}}),r}e(Ki,"extractAcademicOverview");async function Go(){let t={name:"",avatar:"",majorPlan:"",majorGpa:"",studentId:""};try{let a=document.querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(a){let i=a.querySelector(".urppp-user-name-value"),c=i&&i.__urpppOriginalText;c&&(t.name=String(c).trim());let h=(a.innerText||a.textContent||"").replace(/\s+/g," ").trim(),w=t.name?null:h.match(/欢迎您[，,]\s*([\u4e00-\u9fa5·]{2,12})/);if(!t.name&&!w){let E=a.cloneNode(!0);E.querySelectorAll("small, i, img, b, .badge").forEach(j=>j.remove());let M=(E.textContent||"").replace(/\s+/g," ").trim();M=M.replace(/^欢迎您[，,]\s*/g,"").replace(/\d{8,}/g,"").trim(),w=M.match(/([\u4e00-\u9fa5·]{2,12})/)}w&&w[1]&&!/欢迎|同学|首页|反馈|密码|注销/.test(w[1])&&(t.name=w[1])}let p=document.querySelector("#navbar img.nav-user-photo, .ace-nav img.nav-user-photo");p&&(t.avatar=p.__urpppOriginalSrc||p.src||p.getAttribute("src")||"");let s=Ki(document);t.majorPlan=s.majorPlan,t.majorGpa=s.majorGpa}catch{}try{let a=await Ut("/student/rollManagement/rollInfo/index"),p=ze(a),s=p.body&&(p.body.innerText||p.body.textContent)||"";if(!t.name&&(t.name=Ie(p,["姓名"]),!t.name)){let w=s.match(/姓名\s*[：:]?\s*([\u4e00-\u9fa5·]{2,20})/);w&&(t.name=w[1].trim())}let i=Ie(p,["主修方案名称"]),c=Ie(p,["专业"]);t.studentId=Ie(p,["学号"]),i?t.majorPlan=Fr(i):!t.majorPlan&&c&&(t.majorPlan=Fr(c));let h=p.querySelector('.profile-picture img, img#avatar, img[src*="photo" i], img[src*="Photo"]');if(h&&h.getAttribute("src")&&!t.avatar){let w=h.getAttribute("src");t.avatar=/^https?:/i.test(w)?w:fa(w)}}catch{}let r=Number(t.majorGpa);return t.name||(t.name="同学"),t.majorPlan||(t.majorPlan="主修方案"),(!Number.isFinite(r)||r<=0||r>5)&&(t.majorGpa="—"),t}e(Go,"loadProfile");let Jo=["周日","周一","周二","周三","周四","周五","周六"];function Ca(t){let r=[],a=t.querySelector("#courseTableBody")||t.querySelector("#courseTable tbody");if(!a)return r;a.querySelectorAll("td[id]").forEach(s=>{let i=String(s.id||"").match(/^(\d+)_(\d+)$/);if(!i)return;let c=parseInt(i[1],10),h=parseInt(i[2],10),w=c===7?0:c,E=s.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"]'),M=E.length?E:[];if(!M.length&&(s.textContent||"").trim()){let j=(s.textContent||"").replace(/\s+/g," ").trim();j&&r.push({name:j.slice(0,40),teacher:"",place:"",week:"",day:w,section:h});return}M.forEach(j=>{let L=Array.from(j.querySelectorAll("p")).map(Y=>(Y.textContent||"").trim()).filter(Boolean),D=(j.querySelector(".p-kcm-1, .p-kcm")||{}).textContent||L[0]||"",J=(j.querySelector('.p-jxl-1, [class*="jxl"]')||{}).textContent||"",B=L.find((Y,lt)=>lt>0&&!/周|节/.test(Y)&&Y!==J)||"",O=L.find(Y=>/周/.test(Y))||"",$=String(D).replace(/_\d+\s*$/,"").trim();!$||$.length<2||r.push({name:$,teacher:String(B).trim(),place:String(J||"").trim(),week:String(O).trim(),day:w,section:h})})});let p=new Set;return r.filter(s=>{let i=[s.day,s.section,s.name,s.place].join("|");return p.has(i)?!1:(p.add(i),!0)})}e(Ca,"parseScheduleFromDoc");let Vo="urppp_term_week_v1";function Dr(t){let r=Number(t)||0;if(r<1||r>30)return 0;at._termWeek=r,at._termWeekResolved=!0;try{GM_setValue(Vo,r)}catch{}return r}e(Dr,"rememberTermWeek");function ae(){if(at&&at._termWeek>=1)return at._termWeekResolved=!0,at._termWeek;try{let t=Number(GM_getValue(Vo,0))||0;if(t>=1&&t<=30)return Dr(t)}catch{}return 0}e(ae,"readRememberedTermWeek");function oe(t){let r=String(t||"").replace(/\s+/g," ");if(!r)return 0;let a=[/(?:\d{4}\s*[-–]\s*\d{4}).{0,40}?第\s*(\d{1,2})\s*周/,/20\d{2}.{0,40}?第\s*(\d{1,2})\s*周/,/(?:春|秋|夏|冬)\s*第\s*(\d{1,2})\s*周/,/第\s*(\d{1,2})\s*周\s*(?:星期|周[一二三四五六日天])/];for(let p=0;p<a.length;p++){let s=r.match(a[p]);if(s){let i=parseInt(s[1],10);if(i>=1&&i<=30)return i}}return 0}e(oe,"extractTermWeekFromText");function kr(){if(at._termWeekResolved&&at._termWeek>=1&&at._termWeek<=30)return at._termWeek;try{let t=[document.querySelector("#navbar"),document.querySelector(".navbar-fixed-top"),document.querySelector(".navbar"),document.querySelector("#navbar .navbar-header"),document.querySelector("#navbar .navbar-buttons"),document.querySelector(".ace-nav"),document.querySelector("#breadcrumbs"),document.querySelector("#page-content-header"),document.querySelector(".page-header"),document.querySelector("header")].filter(Boolean);for(let c=0;c<t.length;c++){let h=t[c],w=oe(h.innerText||h.textContent||"")||oe(h.innerHTML||"");if(w)return Dr(w)}let r=document.documentElement&&document.documentElement.innerHTML||"",a=oe(r);if(a)return Dr(a);let p=document.body&&document.body.innerText||"",s=oe(p);if(s)return Dr(s);let i=ae();if(i)return i}catch{}return 0}e(kr,"getCurrentWeekNumber");let jr=null;function Zi(){let t=new Date,r=e(a=>String(a).padStart(2,"0"),"p");return`${t.getFullYear()}-${r(t.getMonth()+1)}-${r(t.getDate())}`}e(Zi,"calTodayStr");function ts(t,r){let a=new Date(`${t}T00:00:00`);a.setDate(a.getDate()+r);let p=e(s=>String(s).padStart(2,"0"),"p");return`${a.getFullYear()}-${p(a.getMonth()+1)}-${p(a.getDate())}`}e(ts,"calAddDays");function ne(t){if(jr)return jr;let r=t||Zi();return r>="2027-02-06"&&r<=ts("2027-02-06",6)?"springfestival":r>="2027-01-18"&&r<"2027-03-01"?"winter":r>="2027-07-04"&&r<"2027-08-31"||r>="2026-07-04"&&r<"2026-08-31"?"summer":"term"}e(ne,"calVacation");function rs(){let t='<svg viewBox="0 0 52 190"><path d="M26 0v16" stroke="#c8102e" stroke-width="3"/><rect x="16" y="16" width="20" height="8" rx="4" fill="#c8102e"/><ellipse cx="26" cy="62" rx="22" ry="30" fill="#e63946"/><path d="M26 26v72M14 34q12 12 0 24M38 34q-12 12 0 24" stroke="#ffd75e" stroke-width="1.4" fill="none"/><path d="M14 92h24M17 98h18M20 104h12" stroke="#ffd75e" stroke-width="2.4" stroke-linecap="round"/></svg>';return`<div id="urppp-festive-decor" aria-hidden="true"><div class="ufd ufd-left">${t}</div><div class="ufd ufd-right">${t}</div></div>`}e(rs,"festiveDecorHtml");function Yo(){let t=typeof document<"u"?document:null;if(!t)return;let r=ne()==="springfestival",a=t.getElementById("urppp-festive-decor");r&&!a?t.documentElement.insertAdjacentHTML("beforeend",rs()):!r&&a&&a.remove()}e(Yo,"syncFestiveDecor");function Qo(t){jr=t==="summer"||t==="winter"||t==="springfestival"||t==="term"?t:null,jr&&jr!=="term"&&(at.weekLocked=!1,at.viewWeek=0);try{Yo()}catch{}try{typeof Hr=="function"&&Hr()}catch{}return jr}e(Qo,"setCalendarPhase");function es(){return ne()}e(es,"getCalendarPhase");function Xo(){if(ne()!=="term")return at.weekLocked?(!at.viewWeek||at.viewWeek<0)&&(at.viewWeek=0):at.viewWeek=0,at.viewWeek;let t=kr()||ae()||0;return at.weekLocked?(!at.viewWeek||at.viewWeek<1)&&(at.viewWeek=t>=1?t:1):t>=1?at.viewWeek=t:(!at.viewWeek||at.viewWeek<1)&&(at.viewWeek=1),!at.weekLocked&&t>1&&at.viewWeek===1&&(at.viewWeek=t),at.viewWeek}e(Xo,"getViewWeekNumber");async function as(){let t=kr();if(t>=1)return t;try{let r=await Ut("/index");if(t=oe(r),t)return Dr(t)}catch{}try{let r=new Date,a=r.getFullYear()+"-"+String(r.getMonth()+1).padStart(2,"0")+"-"+String(r.getDate()).padStart(2,"0"),p="xqh=03&jxlh=302&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(a),s=await Ut("/student/teachingResources/classroomUseStatus/jasInfo",{method:"POST",data:p,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),i=JSON.parse(s),c=Number(i&&i.jxzc);if(c>=1&&c<=30)return Dr(c)}catch{}return ae()||0}e(as,"ensureTermWeekResolved");function os(t){let r=kr()||20;return(t||[]).forEach(a=>{let p=String(a.classWeek||"");p.length>r&&(r=p.length);let s=String(a.week||"").match(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/);s&&(r=Math.max(r,parseInt(s[2],10)||0));let i=String(a.week||"").match(/\d{1,2}/g);i&&i.forEach(c=>{r=Math.max(r,parseInt(c,10)||0)})}),Math.min(Math.max(r,1),30)}e(os,"inferMaxWeek");function Ko(t,r){if(!r||!t)return!1;let a=String(t);return a.length>=r?a.charAt(r-1)==="1":!1}e(Ko,"weekBitActive");let Zo=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#EC4899","#84CC16","#F97316","#6366F1"];function tn(t){let r=0,a=String(t||"");for(let p=0;p<a.length;p++)r=r*31+a.charCodeAt(p)>>>0;return Zo[r%Zo.length]}e(tn,"courseColor");function ns(t){let r=[],a=kr();(t&&t.xkxx||[]).forEach(i=>{Object.keys(i||{}).forEach(c=>{let h=i[c];if(!h)return;let w=h.courseName||h.englishCourseName||c,E=h.attendClassTeacher||"";(h.timeAndPlaceList||[]).forEach(j=>{let L=Number(j.classDay)||0,D=L===7?0:L,J=Number(j.classSessions)||1,B=Math.max(1,Number(j.continuingSession)||1),O=[j.campusName,j.teachingBuildingName,j.classroomName].filter(Boolean).join(""),$=j.weekDescription||h.skzcs||"",Y=Ko(j.classWeek,a)||a&&$.indexOf(String(a))>=0;r.push({name:String(w).trim(),teacher:String(E).trim(),place:String(O).trim(),week:String($).trim(),classWeek:String(j.classWeek||""),day:D,section:J,span:B,thisWeek:!!Y,color:tn(w)})})})});let s=new Set;return r.filter(i=>{let c=[i.day,i.section,i.span,i.name,i.place,i.week].join("|");return s.has(c)?!1:(s.add(c),!0)})}e(ns,"parseScheduleFromJson");async function ps(){try{let t=await Ut("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),r=[],a=null;try{a=JSON.parse(t);let s=Number(a&&(a.jxzc||a.zc||a.currentWeek));s>=1&&s<=30&&(at._termWeek=Math.max(at._termWeek||0,s),at.weekLocked||(at.viewWeek=at._termWeek)),r=ns(a)}catch{r=Ca(ze(t))}r.length||(r=Ca(document));let p=a?Oo(a,Gr(a),"clean"):null;return{courses:r,exportData:p,rawOk:r.length>0,error:r.length?"":"课表 JSON 无 timeAndPlaceList"}}catch(t){try{let r=Ca(document);if(r.length)return{courses:r,rawOk:!0,error:""}}catch{}return{courses:[],rawOk:!1,error:String(t&&t.message||t)}}}e(ps,"loadSchedule");function is(t,r){let a=String(t||""),p=new RegExp(`url\\s*=\\s*["']([^"']*`+r+`[^"']*)["']`,"i"),s=a.match(p);if(s&&s[1])return s[1];let i=new RegExp(`(\\/student\\/integratedQuery\\/scoreQuery\\/[^"'\\s]+`+r+")","i"),c=a.match(i);return c?c[1]:""}e(is,"extractScoreCallback");function ss(t){let r=[];return(t&&t.lnList||[]).forEach(p=>{let s=p.cjlx||p.cjbh||p.famc||p.zxjxjhh||"成绩",i=[];(p.cjList||[]).forEach(c=>{let h=c.courseName||c.englishCourseName||"";if(!h)return;let w=c.cj!=null&&c.cj!==""?String(c.cj):"";!w&&c.courseScore!=null&&(w=String(c.courseScore)),!w&&c.gradeName&&(w=String(c.gradeName)),!w&&c.zscj!=null&&(w=String(c.zscj));let E=c.courseAttributeName||c.xkcsxmc||"",M=parseFloat(c.credit)||0,j=c.id&&(c.id.courseNumber||c.id.kch_zj)||"",L=c.id&&(c.id.coureSequenceNumber||c.id.courseSequenceNumber||c.id.kxh)||c.classNo||"",D=c.gradePointScore!=null?Number(c.gradePointScore):null,J=nr(w)||nr(c.gradeName)||D!=null&&D<0,B=J?"未评估":w;i.push({code:j,seq:String(L||""),name:h,attr:E,credit:M,score:B,unevaluated:J,required:qo(E),officialGpa:Ce(D)?D:null,evalUrl:""})}),i.length&&r.push({title:String(s).slice(0,100),courses:i,summary:Zt(i),meta:{zxf:p.zxf,tgms:p.tgms,zms:p.zms,famc:p.famc}})}),r}e(ss,"parseScoreJson");async function rn(t,r){let a=await Ut(t),p=en(ze(a));if(p.length)return p;let s=is(a,r);if(!s)return[];let i=await Ut(s);try{let c=JSON.parse(i);p=ss(c).map(h=>(h.summary=Zt(h.courses),h))}catch{p=en(ze(i))}return p}e(rn,"loadScoreByIndex");function en(t){let r=[];return t.querySelectorAll("table").forEach(a=>{let p=Array.from(a.tHead&&a.tHead.rows[0]?a.tHead.rows[0].cells:a.rows[0]&&a.rows[0].cells||[]).map(M=>(M.textContent||"").replace(/\s+/g,""));if(!p.length)return;let s=p.join("|");if(!/课程名/.test(s)||!/成绩/.test(s))return;let i={code:p.findIndex(M=>M==="课程号"),name:p.findIndex(M=>M==="课程名"),attr:p.findIndex(M=>/课程属性|属性/.test(M)),credit:p.findIndex(M=>M==="学分"),score:p.findIndex(M=>M==="成绩")};if(i.name<0||i.score<0)return;let c="成绩",h=a.previousElementSibling;for(let M=0;M<8&&h;M++,h=h.previousElementSibling)if(/^H[1-4]$/.test(h.tagName)||h.classList&&h.classList.contains("header")){c=(h.textContent||"").replace(/\s+/g," ").trim();break}let w=[],E=a.tBodies.length?a.tBodies[0].rows:Array.from(a.rows).slice(1);Array.from(E).forEach(M=>{let j=Array.from(M.cells||M.querySelectorAll("td"));if(j.length<4)return;let L=e($=>$>=0&&j[$]?(j[$].textContent||"").replace(/\s+/g," ").trim():"","get"),D=L(i.name),J=L(i.score);if(!D||!J||/课程名|序号/.test(D))return;let B=L(i.attr),O=nr(J);w.push({code:L(i.code),name:D,attr:B,credit:parseFloat(L(i.credit))||0,score:O?"未评估":J,unevaluated:O,required:qo(B),officialGpa:null,evalUrl:""})}),w.length&&r.push({title:c.slice(0,100),courses:w,summary:Zt(w)})}),r}e(en,"parseScoreTables");function pe(t){return Fr(t&&t.meta&&t.meta.famc||t&&t.title||"")}e(pe,"schemePlanName");function an(t,r){if(!t||!t.length)return 0;let a=Fr(r),p=t.findIndex(c=>{let h=pe(c);return/培养方案/.test(h)&&!/微专业|辅修|双学位/.test(h)});if(p>=0&&(!a||pe(t[p]).includes(a.slice(0,4)))||a&&(p=t.findIndex(c=>{let h=pe(c);return h.includes(a.replace(/培养方案.*/,"培养方案"))||a.includes(h.slice(0,4))||h.includes(a.slice(0,4))}),p>=0))return p;let s=0,i=-1;return t.forEach((c,h)=>{if(/微专业|辅修/.test(pe(c)))return;let w=(c.courses||[]).length;w>i&&(i=w,s=h)}),s}e(an,"pickMajorSchemeIndex");async function ls(){let t={};try{let r=await Ut("/student/teachingAssessment/evaluation/queryAll",{method:"POST",data:"pageNum=1&pageSize=200&flag=kt",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),a;try{a=JSON.parse(r)}catch{a=null}(a&&a.data&&a.data.records||[]).forEach(s=>{let i=String(s.KCH||"").trim();if(!i)return;let c=String(s.SFPG)==="1",h=String(s.KTID||"").trim();if(!t[i]){t[i]={ktid:h,kxh:String(s.KXH||""),kcm:s.KCM||"",done:c,pending:c?0:1,total:1,url:!c&&h?"/student/teachingEvaluation/newEvaluation/evaluation/"+h:"/student/teachingEvaluation/newEvaluation/index"};return}t[i].total+=1,c||(t[i].pending+=1,t[i].done=!1,h&&(t[i].ktid=h,t[i].url="/student/teachingEvaluation/newEvaluation/evaluation/"+h))}),Object.keys(t).forEach(s=>{let i=t[s];i.done=!(i.pending>0)})}catch(r){console.warn("[URP++] evaluation map",r)}return t}e(ls,"loadEvaluationMap");function cs(t){if(!t)return!1;if(t.officialGpa!=null&&Ce(t.officialGpa))return!0;let r=t.score;return r==null||r===""||nr(r)?!1:Nr(r)!=null||$r(r)!=null?!0:!/未评估|未评教|待评估|待评教/.test(String(r))}e(cs,"hasDisplayableScore");function ds(t,r){if(!t||!r)return t;let a=e(p=>(p||[]).forEach(s=>{if(!s||!s.code)return;let i=r[s.code];if(i){if(cs(s)){s.unevaluated=!1,i.done?s.evalUrl=s.evalUrl||"":s.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index";return}i.done||(s.unevaluated=!0,s.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index",(!s.score||s.score===""||nr(s.score))&&(s.score="未评估"))}}),"apply");return(t.passing||[]).forEach(p=>a(p.courses)),(t.schemes||[]).forEach(p=>a(p.courses)),t}e(ds,"attachEvaluationLinks");function on(t){return t&&(t.passing&&t.passing[0]&&(t.passing[0].summary=Zt(t.passing[0].courses)),t.schemes=(t.schemes||[]).map(r=>(r.summary=Zt(r.courses),r)),t)}e(on,"refreshScoreSummaries");async function us(t){if(!t||t.evaluationLoading)return t;t.evaluationLoading=!0;try{let r=await ls();return ds(t,r),t.evalMap=r,t.evaluationReady=!0,on(t)}finally{t.evaluationLoading=!1}}e(us,"enrichScoresWithEvaluation");function ms(){if(!at.scores||!at.scores.schemes)return;let t=at.scores.schemes,r=at.profile&&at.profile.majorPlan,a=an(t,r);at.scores.majorIdx=a,at._schemeUserSelected||(at.activeSchemeIdx=a,at._schemeInited=!0);let p=t[a];if(!p||!at.profile)return;let s=pe(p),i=Fr(at.profile.majorPlan);/培养方案|教学计划/.test(s)&&(!/培养方案|教学计划/.test(i)||i==="主修方案")&&(at.profile.majorPlan=s);let c=p.summary||{},h=Number(c.requiredCredit),w=Number(c.requiredGpa),E=Number(at.profile.majorGpa);h>0&&Number.isFinite(w)&&w>=0&&w<=5&&(!Number.isFinite(E)||E<=0)&&(at.profile.majorGpa=String(vr(w)))}e(ms,"reconcileProfileAndScores");let Or=null;async function nn(t){return t&&(Or=null),Or&&!Or.error||(Or=await bs()),Or}e(nn,"loadScores");async function bs(){let t={passing:[],schemes:[],error:"",majorIdx:0,evaluationReady:!1,evaluationLoading:!1};try{let[r,a]=await Promise.all([rn("/student/integratedQuery/scoreQuery/allPassingScores/index","allPassingScores/callback"),rn("/student/integratedQuery/scoreQuery/schemeScores/index","schemeScores/callback")]),p=[];r.forEach(s=>s.courses.forEach(i=>{p.push(Object.assign({term:s.title},i))})),t.passing=[{title:"全部及格成绩",courses:p,summary:Zt(p),groups:r}],t.schemes=a,!t.schemes.length&&p.length&&(t.schemes=[{title:"方案成绩",courses:p,summary:Zt(p)}]),on(t),t.majorIdx=an(t.schemes,at.profile&&at.profile.majorPlan),!p.length&&!t.schemes.length&&(t.error="成绩 callback 无数据")}catch(r){t.error=String(r&&r.message||r)}return t}e(bs,"loadScoresImpl");function Ar(t){if(!t)return[];let r=String(t).trim();if(!r)return[];r=r.replace(/^['"]|['"]$/g,"");try{return JSON.parse(r)}catch{}try{return JSON.parse(r.replace(/&quot;/g,'"').replace(/&#34;/g,'"'))}catch{}return[]}e(Ar,"parseJsonArrayLoose");function pn(t,r){let a=t.indexOf(r);if(a<0)return"";let p=t.indexOf("[",a);if(p<0)return"";let s=0;for(let i=p;i<t.length&&i<p+3e5;i++){let c=t[i];if(c==="[")s++;else if(c==="]"&&(s--,s===0))return t.slice(p,i+1)}return""}e(pn,"extractBalancedArray");async function hs(){let t=await Ut("/student/teachingResources/classroomUseStatus/index");if(/欢迎登录|name=["']j_username["']|loginEn/i.test(t)&&!/jxlList|teachingBuildingName|classroomUseStatus/i.test(t))throw new Error("登录已失效，请刷新页面后重试");let r=[],a=[];try{let i=(t.match(/id=["']xqList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']xqList["'][^>]*value=["']([^"']*)["']/i)||[])[1],c=(t.match(/id=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||[])[1];if(i&&(r=Ar(i)),c&&(a=Ar(c)),!r.length){let h=t.match(/(?:var\s+)?xqList\s*=\s*(\[[\s\S]*?\])\s*;/);h&&(r=Ar(h[1]))}if(!a.length){let h=t.match(/(?:var\s+)?jxlList\s*=\s*(\[[\s\S]*?\])\s*;/);h&&(a=Ar(h[1]))}if(!a.length){let h=pn(t,"teachingBuildingName");h&&(a=Ar(h))}if(!r.length){let h=pn(t,"campusName");h&&(r=Ar(h))}}catch(i){console.warn("[URP++] classroom json parse",i)}if(!a.length){let i=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}];r=i;let c=[];for(let h of i)try{let w=await Ut("/student/teachingResources/classroomCurriculum/"+h.campusNumber+"/teachingBuildingJson");Ar(w).forEach(M=>{c.push({id:{campusNumber:h.campusNumber,teachingBuildingNumber:String(M.id&&M.id.teachingBuildingNumber||M.teachingBuildingNumber||"")},teachingBuildingName:M.teachingBuildingName||M.name||""})})}catch(w){console.warn("[URP++] building json",h.campusNumber,w)}a=c}r.length||(r=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}]);let p=r.map(i=>({campus:i.campusName||i.campusNumber,campusNumber:String(i.campusNumber||i.id&&i.id.campusNumber||""),buildings:[]}));a.forEach(i=>{let c=String(i.id&&i.id.campusNumber||i.campusNumber||""),h=String(i.id&&i.id.teachingBuildingNumber||i.teachingBuildingNumber||""),w=i.teachingBuildingName||i.name||h;if(!c||!h||!w)return;let E=p.find(j=>j.campusNumber===c);E||(E={campus:c,campusNumber:c,buildings:[]},p.push(E));let M="/student/teachingResources/classroomUseStatus/"+c+"/"+h+"/"+encodeURI(encodeURI(E.campus||c))+"/"+encodeURI(encodeURI(w));E.buildings.push({name:w,path:M,campusNumber:c,buildingNumber:h})});let s=p.filter(i=>i.buildings.length);if(!s.length)throw new Error("未解析到教学楼，请刷新后重试");return s}e(hs,"loadClassroomCatalog");function ie(t){let r=String(t&&t.occupancymoduleId||""),a={"06":"有课","07":"考试",14:"实验",room:"借用"};if(a[r])return a[r];if(t&&t.remark){let p=String(t.remark).trim();if(p)return p}return"占用"}e(ie,"occupancyTypeLabel");function gs(t){if(t&&t.contentName)return String(t.contentName).trim();if(t&&t.remark){let r=String(t.remark).trim();if(r)return r}return ie(t)}e(gs,"occupancyReason");async function fs(t,r,a,p){let s=new URLSearchParams({planNumber:String(t||""),campusNumber:String(r||""),teachingBuildingNumber:String(a||""),classroomNumber:String(p||"")}),i=await Ut("/student/teachingResources/classroomCurriculum/searchCurriculum/callback?"+s.toString());try{let c=JSON.parse(i);return Array.isArray(c)?c.length&&Array.isArray(c[0])?c[0]:c.filter(h=>h&&typeof h=="object"&&(h.kcm||h.id&&h.id.kch)):c&&Array.isArray(c.list)?c.list:[]}catch{return[]}}e(fs,"fetchClassroomCurriculum");function xs(t,r,a){let p=t||[],s=Number(r.xq)||0,i=Number(r.start)||0,c=Number(a)||0,h=[];return p.forEach(w=>{let E=w.id||{},M=Number(E.skxq!=null?E.skxq:w.skxq)||0,j=Number(E.skjc!=null?E.skjc:w.skjc)||0,L=Math.max(1,Number(w.cxjc)||1),D=E.skzc||w.skzc||"";s&&M&&s!==M||i&&(i<j||i>=j+L)||c&&D&&!ga(D,c)||h.push(w)}),h.length?(h.sort((w,E)=>{let M=ga(w.id&&w.id.skzc||w.skzc,c)?0:1,j=ga(E.id&&E.id.skzc||E.skzc,c)?0:1;return M-j}),h[0]):null}e(xs,"matchCurriculumCourse");async function ys(t,r,a){if(!t||!t.rooms||!t.rooms.length)return t;let p=String(r.campusNumber||""),s=String(r.buildingNumber||""),i=a||t.planNumber||"";if(!p||!s||!i)return t;let c=t.rooms.filter(L=>(L.slots||[]).some(D=>D.busy)),h={},w=e(async L=>{if(h[L])return h[L];try{h[L]=await fs(i,p,s,L)}catch{h[L]=[]}return h[L]},"queue"),E=4,M=0,j=new Array(Math.min(E,Math.max(c.length,1))).fill(0).map(async()=>{for(;M<c.length;){let L=M++,D=c[L],J=await w(D.name);(D.slots||[]).forEach(B=>{if(!B.busy)return;let O={xq:B.detail&&B.detail.xq||B.xq||0,start:B.section,week:t.jxzc};B.detail&&B.detail.xq!=null&&(O.xq=B.detail.xq);let $=xs(J,O,t.jxzc);if($&&$.kcm){let Y=String($.kcm).trim();B.contentName=Y,B.reason=Y,B.displayChar=Pe(Y),B.detail&&(B.detail.contentName=Y,B.detail.reason=Y,B.detail.teacher=$.jsm||"",B.detail.weeks=$.zcsm||"",B.detail.courseNo=$.id&&$.id.kch||"",B.detail.typeLabel=ie({occupancymoduleId:B.module}))}else B.displayChar=Pe(B.reason||"占用"),B.detail&&(B.detail.typeLabel=ie({occupancymoduleId:B.module}))})}});return await Promise.all(j),t}e(ys,"enrichOccupancyWithCurriculum");function vs(t){return t==="有课"?"kind-course":t==="考试"?"kind-exam":t==="实验"?"kind-lab":t==="借用"?"kind-borrow":"kind-busy"}e(vs,"occupancyKindClass");async function ws(t){let r="",a="",p="",s="";if(t&&typeof t=="object")r=String(t.campusNumber||""),a=String(t.buildingNumber||""),p=t.name||"",s=t.path||"";else{s=String(t||"");let $=s.match(/classroomUseStatus\/(\d+)\/(\d+)\//);$&&(r=$[1],a=$[2])}if(!r||!a)throw new Error("缺少校区/楼栋编号");let i=Number(t&&t.dateOffset!=null?t.dateOffset:at.roomDateOffset)||0,c=ks(sn(new Date,i)),h="xqh="+encodeURIComponent(r)+"&jxlh="+encodeURIComponent(a)+"&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(c),w=await new Promise(($,Y)=>{let lt=fa("/student/teachingResources/classroomUseStatus/jasInfo");typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest({method:"POST",url:lt,data:h,withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},onload:e(yt=>yt.status>=200&&yt.status<400?$(yt.responseText||""):Y(new Error("HTTP "+yt.status)),"onload"),onerror:e(()=>Y(new Error("network")),"onerror")}):fetch(lt,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:h}).then(yt=>yt.text()).then($).catch(Y)}),E;try{E=JSON.parse(w)}catch{throw new Error("jasInfo 非 JSON")}let M=(E.classrooms||[]).map($=>{let Y=$.classroomName||$.id&&$.id.classroomNumber||"",lt=$.placeNum||"",yt=$.remark||"",_t=[];for(let zt=1;zt<=12;zt++)_t.push({section:zt,busy:!1});return{name:Y,seats:lt,type:yt,slots:_t,map:{}}}),j={};M.forEach($=>{j[$.name]=$}),(E.classroomTime||[]).forEach($=>{let Y=$.id||{},lt=Y.classroomNumber||"",yt=Number(Y.sessionstart)||1,_t=Math.max(1,Number($.continuingsession)||1),zt=j[lt];if(!zt)return;let Lt=ie($),Dt=gs($);for(let jt=yt;jt<yt+_t&&jt<=12;jt++){let Tt=zt.slots.find(tr=>tr.section===jt);Tt&&(Tt.busy=!0,Tt.kind=$.timestatenumber||$.occupancymoduleId||"",Tt.module=$.occupancymoduleId||"",Tt.reason=Dt,Tt.typeLabel=Lt,Tt.displayChar=Pe(Dt),Tt.xq=Y.xq,Tt.weekBitmap=Y.week||"",Tt.detail={room:lt,section:jt,start:yt,span:_t,reason:Dt,typeLabel:Lt,week:Y.week||"",xq:Y.xq||"",state:$.timestatenumber||"",module:$.occupancymoduleId||""})}});let L="";try{let $=E.jhZxjxjhb;typeof $=="string"&&/\d{4}-\d{4}-\d-\d/.test($)?L=$:$&&typeof $=="object"&&(L=String($.zxjxjhh||$.jhxnxq||$.executiveEducationPlanNumber||$.planNumber||""))}catch{}if(!L&&E.classrooms&&E.classrooms[0]&&E.classrooms[0].id&&(L=E.classrooms[0].id.executiveEducationPlanNumber||""),E.jxzc!=null&&Number(E.jxzc)>=1){let $=Number(E.jxzc);at._termWeek=Math.max(at._termWeek||0,$),at.weekLocked||(at.viewWeek=at._termWeek)}let D=["日","一","二","三","四","五","六"],J=As(E.date||c)||sn(new Date,i),B=E.week!=null?Number(E.week):J.getDay(),O=i===1?"明天":i===2?"后天":"今天";return{rooms:M,dateLabel:(E.date||c)+"（周"+(D[B]||B)+" · "+O+"）",jxzc:E.jxzc,planNumber:L,week:E.week!=null?E.week:B,searchDate:E.date||c,dateOffset:i}}e(ws,"loadBuildingOccupancy");function sn(t,r){let a=new Date(t.getFullYear(),t.getMonth(),t.getDate());return a.setDate(a.getDate()+(Number(r)||0)),a}e(sn,"addDays");function ks(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}e(ks,"formatLocalDate");function As(t){let r=String(t||"").match(/(\d{4})-(\d{1,2})-(\d{1,2})/);return r?new Date(Number(r[1]),Number(r[2])-1,Number(r[3])):null}e(As,"parseLocalDate");let ln={clean:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h11M4 17h14"/></svg>',exit:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M14 12H8"/><path d="m14 8 4 4-4 4"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',schedule:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/></svg>',score:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h10v17H7z"/><path d="M10 8h4M10 12h4M10 16h3"/></svg>',room:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-7h6v7"/><path d="M9 10h.01M15 10h.01"/></svg>',eval:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 7h11M8 12h11M8 17h8"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg>',plan:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h8l3 3V20.5H7z"/><path d="M15 3.5V7h3M10 12h5M10 16h5"/></svg>',apply:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',home:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 11 8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/></svg>',more:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',close:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'};function cn(t){return ln[t]||ln.more}e(cn,"ico");let at=yp();function Ss(){if(document.getElementById("urppp-clean-style"))return;let t=document.createElement("style");t.id="urppp-clean-style",t.textContent=hp,(document.head||document.documentElement).appendChild(t)}e(Ss,"ensureStyle");let _s=Je({deps:{scoreToNumber:Nr,scoreToGpa:$r}}),{metricHtml:Es,occupancyHtml:Cs,render:Hr,renderScheduleBoard:El,roomPickerHtml:Ps,scheduleRender:zs}=qp({state:at,deps:{DIRECT_EDIT_LABELS:W,DAY_NAMES:Jo,analyzeScores:e(t=>_s.analyzeScores(t),"analyzeScores"),applyPersonalDisplay:Gt,bandsChartSvg:Ye,bindUI:e(t=>qs(t),"bindUI"),classifyPrivacyLabel:Le,courseColor:tn,ensureRoot:e(()=>un(),"ensureRoot"),escapeHtml:At,firstContentChar:Pe,getViewWeekNumber:Xo,ico:cn,isCleanAnalysisDirect:Ze,occupancyKindClass:vs,occupancyTypeLabel:ie,personalizedProfile:Ti,scoreChartLayout:e(()=>{try{return window.matchMedia&&window.matchMedia("(max-width: 900px)").matches?{variant:"mobile"}:null}catch{return null}},"scoreChartLayout"),scoreToNumber:Nr,summarizeCourses:Zt,trendChartSvg:Ve,weekBitActive:Ko,calVacation:ne,setCalendarPhase:Qo}}),{ensureRoomCatalogLoaded:dn,loadAll:Ls}=wp({state:at,deps:{ensureTermWeekResolved:as,enrichScoresWithEvaluation:us,getCurrentWeekNumber:kr,loadClassroomCatalog:hs,loadProfile:Go,loadSchedule:ps,loadScores:nn,readRememberedTermWeek:ae,reconcileProfileAndScores:ms,render:Hr,scheduleRender:zs}}),{bindUI:qs,closeModal:Ts,getRoomHost:Cl,openModal:Pl,openRoomModal:zl,openScoreModal:Ll,showBuilding:ql}=Tp({state:at,deps:{DAY_NAMES:Jo,applyPersonalDisplay:Gt,bindScheduleExportHosts:Xi,closeCleanMode:e(()=>Is(),"closeCleanMode"),ensureRoomCatalogLoaded:dn,enrichOccupancyWithCurriculum:ys,ensureRoot:e(()=>un(),"ensureRoot"),escapeHtml:At,fetchText:Ut,getCurrentWeekNumber:kr,getViewWeekNumber:Xo,inferMaxWeek:os,isUnevaluatedScore:nr,isValidOfficialGpa:Ce,loadBuildingOccupancy:ws,metricHtml:Es,occupancyHtml:Cs,render:Hr,rootEl:e(()=>$s(),"rootEl"),roomPickerHtml:Ps,scoreToGpa:$r,scoreToNumber:Nr,summarizeCourses:Zt,summarizeCoursesPreferOfficial:Zt}}),{cleanModeApi:Ms,closeCleanMode:Is,ensureRoot:un,injectCleanEntry:Tl,openCleanMode:Ml,rootEl:$s}=Mp({state:at,deps:{CLEAN_FLAG,applySkinAttr:er,closeModal:Ts,ensureRoomCatalogLoaded:dn,ensureStyle:Ss,getCurrentWeekNumber:kr,getSkin:dr,handleThemeDotClick:ct,ico:cn,injectCleanSidebarSections:e(t=>{try{window.__urpppInjectCleanSidebarSections?.(t)}catch{}},"injectCleanSidebarSections"),refreshMobileNavbar:e(()=>{try{window.__urpppRefreshMobileNavbar?.()}catch{}},"refreshMobileNavbar"),setDrawerOpen:e((t,r,a)=>{try{window.__urpppSetDrawerOpen?.(t,r,a)}catch{}},"setDrawerOpen"),stopDrawerAnimation:e(t=>{try{window.__urpppStopDrawerAnimation?.(t)}catch{}},"stopDrawerAnimation"),isHomePage:Qa,loadAll:Ls,openSettingsPanel:Co,readRememberedTermWeek:ae,refreshCleanPersonalDisplay:ya,render:Hr,scoreToGpa:$r,summarizeCourses:Zt,syncNavbarThemeUI:ht,syncSettingsPanelUI:Kt,syncThemeDotGroup:X}});window.__urpppCleanMode=Ms;function Pa(){if(!document.body){setTimeout(Pa,10);return}if(Ka(),Wt(Vt()),setTimeout(()=>{try{fetchCatalogList().then(r=>ensureStoreCardStyles(r))}catch{}},0),document.addEventListener("focusin",r=>{let a=r.target;if(!a||!a.matches||!a.matches(".chosen-search input"))return;let p=[],s=a.parentElement;for(;s;){let i=s.scrollTop,c=s.scrollLeft;(i||c||s.scrollHeight>s.clientHeight||s.scrollWidth>s.clientWidth)&&p.push({el:s,top:i,left:c}),s=s.parentElement}requestAnimationFrame(()=>{p.forEach(i=>{i.el.scrollTop=i.top,i.el.scrollLeft=i.left})})},!0),!!document.getElementById("formContent")&&!!document.querySelector(".form-signin"))ao();else{li();try{To()}catch{}try{Me()}catch(r){console.warn("[URP++] route feature refresh",r)}try{Gt(document)}catch{}try{Yo()}catch{}[350,900,1800].forEach(r=>setTimeout(()=>{try{Me()}catch{}try{Gt(document)}catch{}},r));try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}[400,1200,2500].forEach(r=>setTimeout(()=>{try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}},r));try{Ke()&&Qa()&&window.__urpppCleanMode&&setTimeout(()=>{try{window.__urpppCleanMode.open(!1)}catch{}},700)}catch{}}}if(e(Pa,"init"),!window.__urpppSidebarSyncBound){window.__urpppSidebarSyncBound=!0,window.addEventListener("resize",()=>{clearTimeout(window.__urpppSidebarSyncTimer),window.__urpppSidebarSyncTimer=setTimeout(syncSidebarUnderNavbar,50)}),window.addEventListener("load",()=>{syncSidebarUnderNavbar(),syncMobileContentOffset(),setTimeout(syncSidebarUnderNavbar,100),setTimeout(syncSidebarUnderNavbar,400)}),document.addEventListener("click",r=>{r.target&&r.target.closest&&r.target.closest("#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse")&&(setTimeout(syncMobileContentOffset,0),setTimeout(syncMobileContentOffset,50),setTimeout(syncMobileContentOffset,200))},!0);let t=document.getElementById("sidebar");t&&!t.__urpppMarginObs&&(t.__urpppMarginObs=new MutationObserver(()=>{clearTimeout(window.__urpppMarginObsTimer),window.__urpppMarginObsTimer=setTimeout(syncMobileContentOffset,30)}),t.__urpppMarginObs.observe(t,{attributes:!0,attributeFilter:["class","style"]}))}function mn(){if(window.__urpppRouteWatchBound)return;window.__urpppRouteWatchBound=!0;let t=0,r=e(()=>{try{let s=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches),i=!!(document.getElementById("urppp-clean-root")&&document.getElementById("urppp-clean-root").classList.contains("open"));s&&!i&&window.__urpppCloseMobileDrawer&&window.__urpppCloseMobileDrawer()}catch{}clearTimeout(t),t=setTimeout(()=>{if(at._termWeekResolved=!1,!!document.getElementById("sidebar")){syncSidebarUnderNavbar(),rebuildSidebarCompletely(),ut(),syncSidebarUnderNavbar();try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}st(),[250,700].forEach(i=>setTimeout(()=>{try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}},i)),la(),ko(),Ao(),bo(),So(),wo(),go(),document.querySelectorAll(".page-content, #page-content-template").forEach(i=>{let c=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches);i.style.setProperty("padding",c?"8px 8px 24px":"16px 64px 40px","important"),i.style.setProperty("box-sizing","border-box","important")}),we(),Se(),Tr(),setTimeout(Tr,300),setTimeout(Tr,1e3),io(),ur(),Xr(),co(),setTimeout(Xr,300),Kr(),setTimeout(()=>Kr(),500),ve(),lo();try{Me()}catch{}try{Gt(document)}catch{}setTimeout(()=>{try{Me()}catch{}try{Gt(document)}catch{}},500)}},100)},"run");window.addEventListener("popstate",r),window.addEventListener("hashchange",r);let a=history.pushState,p=history.replaceState;history.pushState=function(...s){let i=a.apply(this,s);return r(),i},history.replaceState=function(...s){let i=p.apply(this,s);return r(),i}}e(mn,"watchRouteChanges");let Rr=typeof unsafeWindow<"u"?unsafeWindow:window;Rr.__urpppDebug=Rr.__urpppDebug||{},Rr.__urpppDebug.setCalendarPhase=t=>Qo(t),Rr.__urpppDebug.getCalendarPhase=()=>es(),Rr.__urpppDebug.calVacation=t=>ne(t),Rr.urppp={version:n,showLogo(t){let r=document.querySelector("#urppp-brand .ub-logo");r&&r.classList.toggle("show",t)},theme:{apply:e(t=>{Wt(t)},"apply"),setAccent:Wp,getAccent:Jt,getCurrent:Vt,list:e(()=>Object.entries(Et).map(([t,r])=>({name:t,displayName:r.name,current:t===Vt()})),"list")},update:{check:checkForUpdates,auto:maybeAutoCheckUpdate,showToast:showUpdateToast},privacy:{get:xr,set(t){return ta(t),Gt(document),xr()},apply:e(()=>Gt(document),"apply"),identity:{get:Pr,set(t){return Ja(t),Gt(document),ya(),Pr()}}},scheduleExport:{load:e(()=>Do("api"),"load"),run:e(t=>Hi(t,"api",null,null),"run"),patch:_a,image:{theme:Ho,build:e((t,r)=>Ro(t,r),"build")},jsonFormat:{get:xe,set:Ya,validate:_r,build(t,r){let a=Fe(t);if(r)return je(a,_r(r));let p=xe();return p.enabled?je(a,p.mapping):De(a)},buildDefault(t){return De(Fe(t))}}}};function bn(){setTimeout(()=>{try{maybeAutoCheckUpdate()}catch{}},1800)}e(bn,"scheduleAutoUpdateCheck");try{Ka()}catch{}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Pa(),mn(),bn()}):(Pa(),mn(),bn())})();})();
