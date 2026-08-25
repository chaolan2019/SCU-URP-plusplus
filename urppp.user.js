// ==UserScript==
// @name         SCU URP++教务系统美化
// @namespace    https://github.com/chaolan2019/SCU-URP-plusplus
// @version      1.9.5
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

(()=>{var Hl=Object.defineProperty;var a=(p,n)=>Hl(p,"name",{value:n,configurable:!0});function Ze(p){let n=String(p).replace("#","").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return n?{r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16)}:{r:30,g:58,b:95}}a(Ze,"hexToRgb");function xr(p,n,c){return"#"+[p,n,c].map(d=>Math.max(0,Math.min(255,Math.round(d))).toString(16).padStart(2,"0")).join("")}a(xr,"rgbToHex");function Gt(p){let n=String(p||"").trim();return n?(n[0]!=="#"&&(n="#"+n),/^#[0-9a-fA-F]{6}$/.test(n)?n.toUpperCase():""):""}a(Gt,"normalizeHexColor");function Ka(p,n){let{r:c,g:d,b:u}=Ze(p),k=1-n;return xr(c*k,d*k,u*k)}a(Ka,"darken");function fe(p,n){let{r:c,g:d,b:u}=Ze(p);return`rgba(${c},${d},${u},${n})`}a(fe,"alpha");function Bt(p,n,c){let d=Ze(Gt(p)||"#FFFFFF"),u=Ze(Gt(n)||"#FFFFFF"),k=Math.max(0,Math.min(1,Number(c)||0));return xr(d.r+(u.r-d.r)*k,d.g+(u.g-d.g)*k,d.b+(u.b-d.b)*k)}a(Bt,"mixHex");function Za(p,n){if(typeof p!="function")throw new TypeError(`${n} must be a function`)}a(Za,"assertFunction");function Vr(p){if(!p||typeof p!="object")throw new TypeError("feature definition must be an object");let n=String(p.id||"").trim();if(!n)throw new TypeError("feature id is required");return Za(p.matches,`${n}.matches`),Za(p.mount,`${n}.mount`),Za(p.unmount,`${n}.unmount`),Object.freeze({id:n,matches:p.matches,mount:p.mount,unmount:p.unmount})}a(Vr,"defineFeature");function Xn(p){if(!Array.isArray(p))throw new TypeError("features must be an array");let n=p.map(Vr),c=new Set;n.forEach(S=>{if(c.has(S.id))throw new Error(`duplicate feature id: ${S.id}`);c.add(S.id)});let d=null,u=null;function k(){if(!d)return;let S=d,y=u;d=null,u=null,S.unmount(y)}a(k,"unmount");function P(S={}){let y=n.find(f=>f.matches(S));if(y&&d===y&&S.lifecycleKey!==void 0&&u?.lifecycleKey===S.lifecycleKey)try{return y.mount(S),u=S,y.id}catch(f){throw k(),f}if(k(),!y)return null;try{return y.mount(S),d=y,u=S,y.id}catch(f){try{y.unmount(S)}catch{}throw f}}return a(P,"refresh"),Object.freeze({refresh:P,unmount:k,getActiveFeatureId:a(()=>d?.id||null,"getActiveFeatureId"),listFeatureIds:a(()=>n.map(S=>S.id),"listFeatureIds")})}a(Xn,"createFeatureRuntime");function at(p){return String(p||"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}a(at,"escapeHtml");function to(p){let n=String(p||"").match(/@version\s+([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)/i);return n?n[1]:""}a(to,"parseUserscriptVersion");function Kn(p){return String(p||"0").replace(/^v/i,"").split(/[.+\-]/).filter(Boolean).map(n=>/^\d+$/.test(n)?parseInt(n,10):n)}a(Kn,"normalizeVersionParts");function yr(p,n){let c=Kn(p),d=Kn(n),u=Math.max(c.length,d.length);for(let k=0;k<u;k+=1){let P=c[k]==null?0:c[k],S=d[k]==null?0:d[k];if(typeof P=="number"&&typeof S=="number"){if(P>S)return 1;if(P<S)return-1;continue}let f=String(P),w=String(S);if(f>w)return 1;if(f<w)return-1}return 0}a(yr,"compareVersions");var wr={base:{},coursesPath:"courses",schedulePath:"schedule",courseFields:{name:"name",teacher:"teacher",position:"position",day:"day",sections:"sections",weeks:"weeks"},scheduleFields:{morningNum:"morningNum",afternoonNum:"afternoonNum",nightNum:"nightNum",sections:"sections"}},Rl=["name","teacher","position","day","sections","weeks","code","sequence","englishName","attribute","category","credit","status","campus","building","classroom","startSection","endSection","weekList"],Ul=["morningNum","afternoonNum","nightNum","sections","sectionList"];function ro(p){return JSON.parse(JSON.stringify(p))}a(ro,"cloneJsonValue");function rp(p,n){return p===n||p.startsWith(`${n}.`)||n.startsWith(`${p}.`)}a(rp,"scheduleJsonPathsOverlap");function Yr(p,n){let c=String(p??"").trim();if(!c){if(n)return"";throw new Error("课程数组输出路径不能为空")}if(c.length>120)throw new Error("JSON 输出路径不能超过 120 个字符");let d=c.split("."),u=new Set(["__proto__","prototype","constructor"]);if(d.some(P=>!P||/^\d+$/.test(P)||/[\[\]\x00-\x1f]/.test(P)||u.has(P)))throw new Error(`JSON 输出路径包含无效片段：${c}`);return d.join(".")}a(Yr,"validateScheduleJsonPath");function Wl(p,n){for(let c=0;c<p.length;c+=1)for(let d=c+1;d<p.length;d+=1)if(rp(p[c],p[d]))throw new Error(`${n}目标路径不能重叠：${p[c]} / ${p[d]}`)}a(Wl,"validateScheduleJsonTargetPaths");function Zn(p,n,c){let d=n.split("."),u=p;for(let k=0;k<d.length;k+=1){let P=d[k];if(!Object.prototype.hasOwnProperty.call(u,P))return;if(k===d.length-1)throw new Error(`${c}输出路径与 base 字段重叠：${n}`);if(u=u[P],!u||typeof u!="object"||Array.isArray(u)){let S=d.slice(0,k+1).join(".");throw new Error(`${c}输出路径无法穿过 base 中的非对象字段：${S}`)}}}a(Zn,"validateScheduleJsonBasePath");function tp(p,n,c){if(!p||typeof p!="object"||Array.isArray(p))throw new Error(`${c}字段映射必须是对象`);let d={};return Object.entries(p).forEach(([u,k])=>{if(!n.includes(u))throw new Error(`${c}不支持源字段：${u}`);let P=Yr(k,!0);P&&(d[u]=P)}),Wl(Object.values(d),`${c}字段`),d}a(tp,"validateScheduleJsonFieldMap");function qe(p){if(!p||typeof p!="object"||Array.isArray(p))throw new Error("自定义 JSON 映射必须是对象");let n=p.base==null?{}:p.base;if(!n||typeof n!="object"||Array.isArray(n))throw new Error("base 必须是 JSON 对象");let c={base:ro(n),coursesPath:Yr(p.coursesPath,!1),schedulePath:Yr(p.schedulePath,!0),courseFields:tp(p.courseFields,Rl,"课程"),scheduleFields:tp(p.scheduleFields||{},Ul,"时间表")};if(!Object.keys(c.courseFields).length)throw new Error("至少保留一个课程字段映射");if(c.schedulePath&&rp(c.schedulePath,c.coursesPath))throw new Error("课程与时间表输出路径不能重叠");return Zn(c.base,c.coursesPath,"课程"),c.schedulePath&&Zn(c.base,c.schedulePath,"时间表"),c}a(qe,"validateScheduleJsonMapping");function vr(p){let n=String(p||"").replace(/\D/g,"").padStart(4,"0").slice(-4),c=`${n.slice(0,2)}:${n.slice(2)}`;return/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(c)?c:""}a(vr,"normalizeSectionTime");function eo(p,n,c){let d=Yr(n,!1).split("."),u=p;d.forEach((k,P)=>{if(P===d.length-1){u[k]=c;return}(!u[k]||typeof u[k]!="object"||Array.isArray(u[k]))&&(u[k]={}),u=u[k]})}a(eo,"setScheduleJsonPath");function ep(p,n){let c={};return Object.entries(n||{}).forEach(([d,u])=>{!Object.prototype.hasOwnProperty.call(p,d)||p[d]===void 0||eo(c,u,ro(p[d]))}),c}a(ep,"mappedScheduleJsonObject");function Gl(p){return[p.campus,p.building,p.classroom].map(n=>String(n||"").trim()).filter(Boolean).join(" ")}a(Gl,"scheduleJsonPosition");function Jl(p){let n=Number(p.startSection)||0,c=Number(p.endSection)||n;return n<1||c<n?"":Array.from({length:c-n+1},(d,u)=>n+u).join(",")}a(Jl,"scheduleJsonSectionString");function Vl(p,n){let c=Number(n.day)||0,d=Jl(n),u=Array.from(new Set((n.weeks||[]).map(Number).filter(k=>Number.isInteger(k)&&k>=1&&k<=60))).sort((k,P)=>k-P);return c<1||c>7||!d?{error:"invalid"}:u.length?{value:{name:p.name,teacher:p.teacher,position:Gl(n),day:c,sections:d,weeks:u.join(","),code:p.code,sequence:p.sequence,englishName:p.englishName,attribute:p.attribute,category:p.category,credit:p.credit,status:p.status,campus:n.campus,building:n.building,classroom:n.classroom,startSection:n.startSection,endSection:n.endSection,weekList:u}}:{error:"weeks"}}a(Vl,"scheduleJsonCourseRecord");function Yl(p,n){let c=[];return p.courses.forEach(d=>{if(!d.arrangements.length){n.unscheduledCourses+=1;return}d.arrangements.forEach(u=>{let k=Vl(d,u);k.error==="weeks"?n.missingWeeks+=1:k.error?n.invalidArrangements+=1:c.push(k.value)})}),c}a(Yl,"buildScheduleJsonCourses");function Ql(p){let n=new Map;return(p||[]).forEach(c=>{let d=Number(c.section),u=vr(c.start),k=vr(c.end);!Number.isInteger(d)||d<1||d>20||!u||!k||n.set(d,{i:d,s:u,e:k})}),Array.from(n.values()).sort((c,d)=>c.i-d.i)}a(Ql,"buildScheduleJsonSections");function Xl(p){let n=Ql(p);if(!n.length)return{};let c={sections:JSON.stringify(n),sectionList:n};if(!n.every((u,k)=>u.i===k+1))return c;let d={morningNum:0,afternoonNum:0,nightNum:0};return n.forEach(u=>{let[k,P]=u.s.split(":").map(Number),S=k*60+P;S<720?d.morningNum+=1:S>=1080?d.nightNum+=1:d.afternoonNum+=1}),d.morningNum&&d.afternoonNum&&d.nightNum?Object.assign(c,d):c}a(Xl,"buildScheduleJsonSchedule");function Qr(p){let n={unscheduledCourses:0,missingWeeks:0,invalidArrangements:0},c=Yl(p,n);if(!c.length)throw new Error("没有符合导入格式的已排课课程");return{courses:c,schedule:Xl(p.sections),stats:n}}a(Qr,"buildScheduleJsonSource");function Xr(p){let n={courses:p.courses.map(d=>({name:d.name,teacher:d.teacher,position:d.position,day:d.day,sections:d.sections,weeks:d.weeks}))},c={};return["morningNum","afternoonNum","nightNum","sections"].forEach(d=>{Object.prototype.hasOwnProperty.call(p.schedule,d)&&(c[d]=p.schedule[d])}),Object.keys(c).length&&(n.schedule=c),n}a(Xr,"buildXiaoAiScheduleJson");function Kr(p,n){let c=ro(n.base||{}),d=p.courses.map(u=>ep(u,n.courseFields));if(eo(c,n.coursesPath,d),n.schedulePath&&Object.keys(p.schedule).length){let u=ep(p.schedule,n.scheduleFields);Object.keys(u).length&&eo(c,n.schedulePath,u)}return c}a(Kr,"buildCustomScheduleJson");function kr(p){return p.getFullYear()+"-"+String(p.getMonth()+1).padStart(2,"0")+"-"+String(p.getDate()).padStart(2,"0")}a(kr,"localDateIso");function tr(p){let n=String(p||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!n)return null;let c=new Date(Number(n[1]),Number(n[2])-1,Number(n[3]));return Number.isNaN(c.getTime())||kr(c)!==String(p)?null:c}a(tr,"parseLocalIsoDate");function ao(p){let n=new Date(p.getFullYear(),p.getMonth(),p.getDate()),c=n.getDay();return n.setDate(n.getDate()-(c===0?6:c-1)),n}a(ao,"mondayOfDate");function op(p){let n=String(p||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!n)return kr(ao(new Date));let c=n[3]==="1"?Number(n[1]):Number(n[2]),d=n[3]==="1"?8:2,u=new Date(c,d,1);for(;u.getDay()!==1;)u.setDate(u.getDate()+1);return kr(u)}a(op,"defaultSemesterMonday");function ap(p){return p.getFullYear()+String(p.getMonth()+1).padStart(2,"0")+String(p.getDate()).padStart(2,"0")+"T"+String(p.getHours()).padStart(2,"0")+String(p.getMinutes()).padStart(2,"0")+"00"}a(ap,"formatIcsLocal");function Zr(p){return String(p||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}a(Zr,"escapeIcsText");function Kl(p){if(typeof TextEncoder!="function")return p;let n=new TextEncoder,c=[],d="",u=73;for(let k of String(p))n.encode(d+k).length>u&&d?(c.push(d),d=" "+k,u=74):d+=k;return d&&c.push(d),c.join(`\r
`)}a(Kl,"foldIcsLine");function Zl(p){let n=2166136261,c=String(p||"");for(let d=0;d<c.length;d+=1)n=Math.imul(n^c.charCodeAt(d),16777619);return(n>>>0).toString(16)+"@scu-urppp"}a(Zl,"scheduleUid");function np(p){let n=new Map;return p.sections.forEach(c=>n.set(c.section,c)),n}a(np,"scheduleSectionMap");function tc(p){return p.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}a(tc,"formatTimestamp");function pp(p,n,c={}){let d=tr(n);if(!d)throw new Error("第一教学周日期无效");let u=np(p);if(!u.size)throw new Error("教务接口没有返回节次时间，无法生成 ICS");let k=tc(c.now instanceof Date?c.now:new Date),P=0,S=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SCU URP++//Schedule Export//CN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:"+Zr(p.semester.label+"课表"),"X-WR-TIMEZONE:Asia/Shanghai","BEGIN:VTIMEZONE","TZID:Asia/Shanghai","X-LIC-LOCATION:Asia/Shanghai","BEGIN:STANDARD","TZOFFSETFROM:+0800","TZOFFSETTO:+0800","TZNAME:CST","DTSTART:19700101T000000","END:STANDARD","END:VTIMEZONE"];if(p.courses.forEach(y=>y.arrangements.forEach(A=>{let f=u.get(A.startSection),w=u.get(A.endSection);!f||!w||A.weeks.forEach(T=>{let C=new Date(d);C.setDate(d.getDate()+(T-1)*7+A.day-1);let b=new Date(C),m=new Date(C),v=f.start.split(":").map(Number),x=w.end.split(":").map(Number);b.setHours(v[0],v[1],0,0),m.setHours(x[0],x[1],0,0);let E=[A.campus,A.building,A.classroom].filter(Boolean).join(" "),q=["教师："+y.teacher,"周次："+A.weekDescription,"课程号："+y.code+(y.sequence?"_"+y.sequence:""),"学分："+y.credit,"课程属性："+y.attribute].filter(L=>!/[：:]$/.test(L)).join(`
`),I=[p.semester.planCode,y.code,y.sequence,A.day,A.startSection,A.endSection,T,A.campus,A.building,A.classroom].join("|");P+=1,S.push("BEGIN:VEVENT","UID:"+Zl(I),"DTSTAMP:"+k,"SUMMARY:"+Zr(y.name),"LOCATION:"+Zr(E),"DESCRIPTION:"+Zr(q),"DTSTART;TZID=Asia/Shanghai:"+ap(b),"DTEND;TZID=Asia/Shanghai:"+ap(m),"END:VEVENT")})})),!P)throw new Error("课表中没有已安排时间的课程，无法生成 ICS");return S.push("END:VCALENDAR"),S.map(Kl).join(`\r
`)+`\r
`}a(pp,"buildScheduleIcs");function ip(p){let n=np(p),c=0,d=0;return p.courses.forEach(u=>u.arrangements.forEach(k=>{k.weeks.length||(c+=1),(!n.has(k.startSection)||!n.has(k.endSection))&&(d+=1)})),{missingWeeks:c,missingTimes:d}}a(ip,"scheduleIcsOmissionStats");function ec(p){let n=String(p||"").replace(/[—–]/g,"-"),c=/单周|单数周|[（(]单[）)]/.test(n)?1:/双周|双数周|[（(]双[）)]/.test(n)?0:-1,d=new Set,u=a(k=>{let P=Number(k);P>=1&&P<=30&&(c<0||P%2===c)&&d.add(P)},"add");return n.replace(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/g,(k,P,S)=>{let y=Math.min(Number(P),Number(S)),A=Math.max(Number(P),Number(S));for(let f=y;f<=A;f+=1)u(f);return k}),(n.match(/\d{1,2}/g)||[]).forEach(u),Array.from(d).sort((k,P)=>k-P)}a(ec,"scheduleWeeksFromDescription");function sp(p,n){let c=String(p||"").trim();if(/^[01]+$/.test(c)){let d=[];for(let u=0;u<c.length;u+=1)c.charAt(u)==="1"&&d.push(u+1);return d}return ec(n||c)}a(sp,"scheduleWeeks");function rc(p){let n=p&&Array.isArray(p.xkxx)?p.xkxx:[];for(let c of n){let d=Object.values(c||{});if(d.length)return d[0]}return null}a(rc,"firstScheduleCourse");function er(p){let n=rc(p);if(!n)return"";let c=Array.isArray(n.timeAndPlaceList)?n.timeAndPlaceList[0]:null;return String(n.zxjxjhh||n.executiveEducationPlanNumber||n.id&&(n.id.zxjxjhh||n.id.executiveEducationPlanNumber)||c&&(c.zxjxjhh||c.executiveEducationPlanNumber)||"").trim()}a(er,"schedulePlanCodeFromData");function ac(p){let n=String(p||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!n)return"学生课表";let c=n[3]==="1"?"秋季学期":n[3]==="2"?"春季学期":"学期";return n[1]+"-"+n[2]+"学年"+c}a(ac,"semesterLabelFromPlanCode");function lp(p,n,c,d={}){let u=n||er(p),k=(Array.isArray(p&&p.jcsjbs)?p.jcsjbs:[]).map(y=>({section:Number(y.jc)||0,start:vr(y.kssj),end:vr(y.jssj)})).filter(y=>y.section>=1&&y.section<=20&&y.start&&y.end).sort((y,A)=>y.section-A.section),P=[];(Array.isArray(p&&p.xkxx)?p.xkxx:[]).forEach(y=>{Object.keys(y||{}).forEach(A=>{let f=y[A];if(!f)return;let w=f.id||{},T=(f.timeAndPlaceList||[]).map(C=>({day:Number(C.classDay)||0,startSection:Number(C.classSessions)||1,endSection:Math.min(12,(Number(C.classSessions)||1)+Math.max(1,Number(C.continuingSession)||1)-1),weeks:sp(C.classWeek,C.weekDescription||f.skzcs),weekDescription:String(C.weekDescription||f.skzcs||"").trim(),campus:String(C.campusName||"").trim(),building:String(C.teachingBuildingName||"").trim(),classroom:String(C.classroomName||"").trim()})).filter(C=>C.day>=1&&C.day<=7&&C.startSection>=1&&C.startSection<=12);P.push({code:String(w.coureNumber||f.zkch||"").trim(),sequence:String(w.coureSequenceNumber||f.zkxh||"").trim(),name:String(f.courseName||f.englishCourseName||A).trim(),englishName:String(f.englishCourseName||"").trim(),teacher:String(f.attendClassTeacher||"").trim(),attribute:String(f.coursePropertiesName||"").trim(),category:String(f.courseCategoryName||"").trim(),credit:Number(f.unit)||0,status:String(f.selectCourseStatusName||"").trim(),arrangements:T})})});let S=String(d.firstMonday||"").trim();return{schemaVersion:1,exportedAt:(d.now instanceof Date?d.now:new Date).toISOString(),source:c||"SCU URP++",semester:{planCode:u,label:ac(u),firstMonday:tr(S)?S:""},sections:k,courses:P}}a(lp,"normalizeScheduleExportData");function cp(p,n,c,d=0){let u=Math.max(0,Number(p)||0),k=Math.max(1,Math.floor(Number(n)||1)),P=Math.max(0,Math.min(k-1,Math.floor(Number(c)||0))),S=-Math.max(0,Number(d)||0),y=S+u*P/k,A=S+u*(P+1)/k;return{left:y,width:Math.max(0,A-y)}}a(cp,"scheduleCardLaneGeometry");function ta(p,n,c){let d=[],u=String(p||""),k=Math.max(4,Number(n)||4);for(;u;)d.push({text:u.slice(0,k),kind:c}),u=u.slice(k);return d}a(ta,"wrapField");function ea(p,n){let c=p.slice(0,Math.max(0,n)).map(d=>({...d}));if(c.length&&c.length<p.length){let d=c[c.length-1];d.text=d.text.length>1?d.text.slice(0,-1)+"…":"…"}return c}a(ea,"takeLines");var dp=["#2563EB","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#DB2777","#4D7C0F","#EA580C","#4F46E5"];function mp(p){let n=0,c=String(p||"");for(let d=0;d<c.length;d+=1)n=n*31+c.charCodeAt(d)>>>0;return dp[n%dp.length]}a(mp,"exportCourseColor");function up(p){let n=[];p.forEach(c=>{let d=n.findIndex(u=>u<c.startSection);d<0&&(d=n.length,n.push(0)),n[d]=c.endSection,c.lane=d}),p.forEach(c=>{c.laneCount=Math.max(1,n.length)})}a(up,"assignScheduleLanes");function hp(p){let n=p.slice().sort((u,k)=>u.startSection-k.startSection||u.endSection-k.endSection||u.course.name.localeCompare(k.course.name)),c=[],d=0;return n.forEach(u=>{c.length&&u.startSection>d&&(up(c),c=[],d=0),c.push(u),d=Math.max(d,u.endSection)}),c.length&&up(c),n}a(hp,"layoutScheduleDay");function bp(p){let n=[];return p.courses.forEach(c=>c.arrangements.forEach(d=>{n.push({course:c,arrangement:d,startSection:d.startSection,endSection:d.endSection,day:d.day})})),n}a(bp,"scheduleExportEvents");function gp(p,n){let c=[],d=String(p||"");for(;d;)c.push(d.slice(0,n)),d=d.slice(n);return c}a(gp,"wrapScheduleFooter");function fp(p,n,c){let d=p.startSection===p.endSection?p.startSection+"节":p.startSection+"-"+p.endSection+"节",u=ta(p.name,Math.max(5,n),"title"),k=ta(p.teacher,Math.max(6,n+2),"teacher"),P=ta([p.weekDescription,d].filter(Boolean).join(" · "),Math.max(6,n+2),"schedule"),S=ta([p.campus,p.building,p.classroom].filter(Boolean).join(" "),Math.max(6,n+2),"location"),y=Math.max(1,Number(c)||1),A=S.length&&y>=2?Math.min(2,S.length):0,f=P.length&&y>=3?1:0,w=k.length&&y>=4?1:0,T=Math.max(1,y-A-f-w),C=ea(u,T),b=y-C.length,m=Math.min(k.length,Math.max(0,b-f-A));C.push(...ea(k,m)),b=y-C.length;let v=Math.min(P.length,Math.max(0,b-A));return C.push(...ea(P,v)),b=y-C.length,C.push(...ea(S,b)),C.slice(0,y)}a(fp,"scheduleImageTextLines");function oc(p,n){let c=mp(n),d=p.colors,u=p.skin;return u==="brutal"?{fill:Bt(d.surface,c,.48),stroke:"#000000",text:"#111111",secondary:"#242424",stripe:c}:u==="flat"?{fill:Bt(d.surface,c,p.dark?.24:.16),stroke:d.text,text:d.text,secondary:d.secondary,stripe:c}:u==="editorial"?{fill:Bt(d.surface,c,p.dark?.16:.08),stroke:d.border,text:d.text,secondary:d.secondary,stripe:c}:{fill:Bt(d.surface,c,p.dark?.28:u==="organic"?.2:.14),stroke:Bt(d.border,c,p.dark?.52:.42),text:d.text,secondary:d.secondary,stripe:c}}a(oc,"scheduleImageCourseStyle");function xp(p,n,c={}){if(!n||!n.colors||!n.shape)throw new Error("课表图片主题未解析");let d=n.colors,u=n.shape,k=c.now instanceof Date?c.now:new Date,P=1960,S=40,y=136,A=P-S*2,f=S+24,w=64,T=8,C=f+w+12,b=S+A-24,m=(b-C-T*6)/7,v=y+88,x=108,E=102,I=v+x*12-y+24,L=p.courses.filter(ot=>!ot.arrangements.length).map(ot=>ot.name),O=gp(L.join("、"),92),M=O.length?74+O.length*27:44,H=y+I+M,G=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],U=u.serif?"Georgia,Noto Serif SC,Songti SC,STSong,SimSun,serif":"Microsoft YaHei,Segoe UI,sans-serif",et="Microsoft YaHei,Segoe UI,sans-serif",it=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-frame-shadow)"':"",mt=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-card-shadow)"':"",V=[`<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${H}" viewBox="0 0 ${P} ${H}">`,"<defs>",`<filter id="schedule-frame-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${n.dark?10:7}" stdDeviation="${n.dark?16:11}" flood-color="${n.dark?"#000000":d.text}" flood-opacity="${n.dark?.48:.1}"/></filter>`,`<filter id="schedule-card-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${n.dark?"#000000":d.text}" flood-opacity="${n.dark?.34:.1}"/></filter>`,"</defs>",`<rect width="100%" height="100%" fill="${d.bg}"/>`,`<rect x="${S}" y="32" width="142" height="36" rx="${u.headerRadius}" fill="${d.primary}"/>`,`<text x="${S+71}" y="56" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="700" font-family="${et}">SCU URP++</text>`,`<text x="${S}" y="106" fill="${d.text}" font-size="36" font-weight="700" font-family="${U}">${at(p.semester.label)}课表</text>`,`<text x="${P-S}" y="54" text-anchor="end" fill="${d.secondary}" font-size="16" font-family="${et}">${at(n.label)}</text>`,`<text x="${P-S}" y="83" text-anchor="end" fill="${d.muted}" font-size="14" font-family="${et}">${at(k.toLocaleString("zh-CN",{hour12:!1}))}</text>`];u.shadow==="hard"&&V.push(`<rect x="${S+8}" y="${y+8}" width="${A}" height="${I}" fill="#000000"/>`),V.push(`<rect x="${S}" y="${y}" width="${A}" height="${I}" rx="${u.frameRadius}" fill="${d.surface}" stroke="${u.shadow==="hard"?"#000000":d.border}" stroke-width="${u.frameStroke}"${it}/>`),G.forEach((ot,X)=>{let ct=C+X*(m+T);V.push(`<rect x="${ct}" y="${y+22}" width="${m}" height="48" rx="${u.headerRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${ct+m/2}" y="${y+53}" text-anchor="middle" fill="${d.secondary}" font-size="17" font-weight="600" font-family="${et}">${ot}</text>`)});for(let ot=1;ot<=12;ot+=1){let X=v+(ot-1)*x;V.push(`<rect x="${f}" y="${X}" width="${w}" height="${E}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${f+w/2}" y="${X+E/2+6}" text-anchor="middle" fill="${d.muted}" font-size="16" font-weight="600" font-family="${et}">${ot}</text>`),G.forEach((ct,rt)=>{let st=C+rt*(m+T);V.push(`<rect x="${st}" y="${X}" width="${m}" height="${E}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`)})}[4,9].forEach(ot=>{let X=v+ot*x-3;V.push(`<line x1="${C}" y1="${X}" x2="${b}" y2="${X}" stroke="${d.primary}" stroke-opacity=".42" stroke-width="2" stroke-dasharray="10 9"/>`)});for(let ot=1;ot<=7;ot+=1)hp(bp(p).filter(ct=>ct.day===ot)).forEach((ct,rt)=>{let st=m/ct.laneCount,ft=C+(ot-1)*(m+T)+ct.lane*st,Z=v+(ct.startSection-1)*x,dt=st,kt=Math.max(E,(ct.endSection-ct.startSection)*x+E),wt=oc(n,ct.course.name),Ct="course-clip-"+ot+"-"+rt,N=Math.max(1,Math.floor((kt-18)/23)),Y=fp({name:ct.course.name,teacher:ct.course.teacher,weekDescription:ct.arrangement.weekDescription,startSection:ct.startSection,endSection:ct.endSection,campus:ct.arrangement.campus,building:ct.arrangement.building,classroom:ct.arrangement.classroom},Math.floor((dt-22)/16),N);V.push(`<clipPath id="${Ct}"><rect x="${ft+11}" y="${Z+8}" width="${Math.max(10,dt-22)}" height="${Math.max(18,kt-16)}" rx="${Math.max(0,u.cardRadius-5)}"/></clipPath>`,`<rect data-course-card="1" data-day="${ot}" data-start="${ct.startSection}" data-end="${ct.endSection}" x="${ft}" y="${Z}" width="${dt}" height="${kt}" rx="${u.cardRadius}" fill="${wt.fill}" stroke="${wt.stroke}" stroke-width="${u.cardStroke}"${mt}/>`),n.skin==="brutal"&&V.push(`<path d="M ${ft+dt-4} ${Z+4} V ${Z+kt-4} H ${ft+4}" fill="none" stroke="#000000" stroke-opacity=".28" stroke-width="5"/>`),n.skin==="editorial"&&V.push(`<rect x="${ft}" y="${Z}" width="6" height="${kt}" fill="${wt.stripe}"/>`),n.skin==="neu"&&V.push(`<path d="M ${ft+u.cardRadius} ${Z+1} H ${ft+dt-u.cardRadius}" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2"/>`),V.push('<g clip-path="url(#'+Ct+')">'),Y.forEach((tt,bt)=>{let ht=tt.kind==="title";V.push(`<text data-kind="${tt.kind}" x="${ft+14}" y="${Z+28+bt*23}" fill="${ht?wt.text:wt.secondary}" font-size="${ht?16:13}" font-weight="${ht?700:500}" font-family="${ht&&u.serif?U:et}">${at(tt.text)}</text>`)}),V.push("</g>")});let Q=y+I+30;return O.length?(V.push(`<text x="${S}" y="${Q}" fill="${d.secondary}" font-size="15" font-weight="700" font-family="${et}">未排定时间的课程</text>`),O.forEach((ot,X)=>V.push(`<text x="${S}" y="${Q+29+X*27}" fill="${d.muted}" font-size="14" font-family="${et}">${at(ot)}</text>`))):V.push(`<text x="${S}" y="${Q}" fill="${d.muted}" font-size="14" font-family="${et}">由 SCU URP++ 基于结构化课表数据生成</text>`),V.push("</svg>"),{svg:V.join(""),width:P,height:H,background:d.bg,theme:n}}a(xp,"buildScheduleSvg");function nc(p,n,c={}){let d=[],u=c.json||null,k=c.ics||null,P=p==="ics"?n.courses.filter(S=>!S.arrangements.length).length:0;return P&&d.push(P+" 门未排定时间的课程未写入日历"),u&&u.unscheduledCourses&&d.push(u.unscheduledCourses+" 门未排定时间的课程未写入 JSON"),u&&u.missingWeeks&&d.push(u.missingWeeks+" 个上课安排缺少周次"),u&&u.invalidArrangements&&d.push(u.invalidArrangements+" 个上课安排缺少日期或节次"),k&&k.missingWeeks&&d.push(k.missingWeeks+" 个上课安排缺少周次"),k&&k.missingTimes&&d.push(k.missingTimes+" 个上课安排缺少节次时间"),d}a(nc,"scheduleExportCompletionNotes");function ra(p,n,c,d,u){return`<button type="button" class="urppp-export-option" role="menuitem" data-export-type="${p}"${u?" disabled":""}><i class="fa ${n}" aria-hidden="true"></i><span><strong>${c}</strong><small>${d}</small></span></button>`}a(ra,"exportOptionHtml");function yp(p){let{document:n,window:c,ensureStyles:d,loadData:u,exportJson:k,exportIcs:P,exportPng:S,showToast:y,nativePageUrl:A,navigate:f,logger:w=console}=p;function T(x){x&&(x.classList.remove("open"),x.querySelector(".urppp-export-trigger")?.setAttribute("aria-expanded","false"))}a(T,"closeMenu");function C(){c.__urpppExportDismissBound||(c.__urpppExportDismissBound=!0,n.addEventListener("click",x=>{n.querySelectorAll(".urppp-export-wrap.open").forEach(E=>{E.contains(x.target)||T(E)})},!0),n.addEventListener("keydown",x=>{x.key==="Escape"&&n.querySelectorAll(".urppp-export-wrap.open").forEach(T)}))}a(C,"bindDismiss");async function b(x,E,q,I){if(I&&I.disabled)return;let L=I&&I.innerHTML;try{if(I&&(I.disabled=!0,I.innerHTML='<i class="fa fa-spinner fa-spin"></i> 准备中'),x==="pdf"){if(typeof q!="function")throw new Error("当前页面不提供原生 PDF 导出");await q();return}let O=await u(E),M={};if(x==="json")M.json=await k(O);else if(x==="ics")M.ics=await P(O);else if(x==="png")await S(O);else throw new Error("未知导出格式");let H=nc(x,O,M);y("课表已导出："+x.toUpperCase()+(H.length?"；"+H.join("，"):""))}catch(O){if(O&&O.message==="已取消导出")return;w.warn("[URP++] schedule export",O),y(O&&O.message||String(O),!0)}finally{I&&(I.disabled=!1,I.innerHTML=L)}}a(b,"run");function m(x={}){d();let E=x.source||"native",q=x.pdfHandler,I=typeof q=="function",L=n.createElement("span"),O=E==="native"?"导出课表":"导出";L.className="urppp-export-wrap",L.innerHTML=`<button type="button" class="urppp-export-trigger" aria-haspopup="menu" aria-expanded="false" title="导出课表"><i class="fa fa-cloud-download" aria-hidden="true"></i><span>${O}</span><i class="fa fa-angle-down" aria-hidden="true"></i></button><div class="urppp-export-menu" role="menu">${ra("ics","fa-calendar","ICS 日历","导入系统日历或日历应用",!1)}${ra("json","fa-code","JSON 数据","兼容小爱课程导入，可自定义格式",!1)}${ra("png","fa-image","PNG 图片","完整学期课表高清图片",!1)}${ra("pdf","fa-file-pdf-o","PDF",I?"使用教务系统原生导出":"仅原教务课表页面可用",!I)}${I?"":'<div class="urppp-export-guide">PDF 依赖原教务课表页面。<button type="button" data-export-native="1">前往本学期课表</button></div>'}</div>`;let M=L.querySelector(".urppp-export-trigger");M.addEventListener("click",G=>{G.preventDefault(),G.stopPropagation();let U=!L.classList.contains("open");n.querySelectorAll(".urppp-export-wrap.open").forEach(T),L.classList.toggle("open",U),M.setAttribute("aria-expanded",U?"true":"false")}),L.querySelectorAll("[data-export-type]:not(:disabled)").forEach(G=>{G.addEventListener("click",()=>{T(L),b(G.getAttribute("data-export-type"),E,q,M)})});let H=L.querySelector("[data-export-native]");return H&&H.addEventListener("click",()=>f(A)),C(),L}a(m,"createMenu");function v(x){(x&&x.querySelectorAll?x:n).querySelectorAll("[data-schedule-export-host]").forEach(q=>{q.querySelector(".urppp-export-wrap")||q.appendChild(m({source:q.getAttribute("data-schedule-export-host")||"clean"}))})}return a(v,"bindHosts"),{bindHosts:v,closeMenu:T,createMenu:m,run:b}}a(yp,"createScheduleExportUi");function vp(p){let n=a(c=>{p.querySelectorAll(".urppp-set-tab").forEach(d=>{let u=d.dataset.tab===c;d.classList.toggle("ac",u),d.setAttribute("aria-selected",u?"true":"false")}),p.querySelectorAll(".urppp-set-pane").forEach(d=>{d.classList.toggle("ac",d.dataset.pane===c)});try{let d=p.querySelector(".urppp-set-body");d&&(d.scrollTop=0)}catch{}},"switchTab");return p.querySelectorAll(".urppp-set-tab").forEach(c=>{c.addEventListener("click",()=>n(c.dataset.tab))}),p.__urpppSwitchTab=n,n}a(vp,"bindSettingsTabs");function wp(p){let{document:n,ensurePanel:c,syncPanel:d,refreshUpdateStatus:u,defaultTab:k="theme"}=p;function P(){c();let y=n.getElementById("urppp-settings-panel"),A=n.getElementById("urppp-settings-mask");if(!y||!A)return!1;d();try{u()}catch{}try{y.__urpppSwitchTab&&y.__urpppSwitchTab(k)}catch{}A.classList.remove("open"),y.classList.remove("open"),y.offsetWidth,A.classList.add("open"),y.classList.add("open");try{let f=y.querySelector(".urppp-set-body");f&&(f.scrollTop=0)}catch{}return!0}a(P,"open");function S(){let y=n.getElementById("urppp-settings-panel"),A=n.getElementById("urppp-settings-mask");y&&y.classList.remove("open"),A&&A.classList.remove("open")}return a(S,"close"),{close:S,open:P}}a(wp,"createSettingsPanelController");function kp(p){let{logoData:n,repositoryUrl:c,version:d}=p;return['<div class="urppp-set-head">','  <div class="urppp-set-title">设置</div>','  <button type="button" class="urppp-set-close" id="urppp-set-close" aria-label="关闭">×</button>',"</div>",'<div class="urppp-set-tabs" role="tablist">','  <button type="button" class="urppp-set-tab ac" data-tab="theme" role="tab" aria-selected="true">主题设置</button>','  <button type="button" class="urppp-set-tab" data-tab="skin" role="tab" aria-selected="false">主题选择</button>','  <button type="button" class="urppp-set-tab" data-tab="system" role="tab" aria-selected="false">系统设置</button>','  <button type="button" class="urppp-set-tab" data-tab="about" role="tab" aria-selected="false">关于</button>',"</div>",'<div class="urppp-set-body">','  <div class="urppp-set-pane ac" data-pane="theme">','    <section class="urppp-set-sec">',"      <h3>主题模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-modes">','        <button type="button" class="urppp-set-mode" data-theme="default">简约白</button>','        <button type="button" class="urppp-set-mode" data-theme="dark">深邃暗</button>','        <button type="button" class="urppp-set-mode" data-theme="scu-red">动态配色</button>',"      </div>",'      <div class="urppp-set-follow-row">','        <button type="button" class="urppp-set-follow" id="urppp-set-follow" aria-pressed="false">跟随系统：关</button>','        <button type="button" class="urppp-set-follow" id="urppp-set-follow-dynamic" aria-pressed="false">浅色用动态配色：关</button>',"      </div>",'      <button type="button" class="urppp-set-follow" id="urppp-set-clean-default" aria-pressed="false" style="margin-top:12px;width:100%">默认进入清爽模式：关</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-clean-analysis" aria-pressed="false" style="margin-top:12px;width:100%">清爽成绩分析展示：选项卡</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-apple-edge" aria-pressed="true" style="margin-top:12px;width:100%">类Apple边缘线条：开</button>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-dynamic">',"      <h3>种子色</h3>",'      <p class="urppp-set-tip">选一个颜色，自动生成背景、卡片、强调色等多套方案</p>','      <div class="urppp-set-presets" id="urppp-set-presets"></div>','      <div class="urppp-set-custom">','        <input type="color" id="urppp-set-color" value="#B53434" />','        <input type="text" id="urppp-set-hex" maxlength="7" value="#B53434" spellcheck="false" />','        <button type="button" class="urppp-set-btn" id="urppp-set-gen">生成方案</button>','        <button type="button" class="urppp-set-btn ghost" id="urppp-set-save">存为预设</button>',"      </div>",'      <h3 style="margin-top:16px">配色方案</h3>','      <div class="urppp-set-schemes" id="urppp-set-schemes"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-brutal" style="display:none">',"      <h3>高对比配色</h3>",'      <p class="urppp-set-tip">默认圆点使用高能粉；选择一种备用配色后，可由左上第三个圆点快速切换。</p>','      <div class="urppp-set-schemes" id="urppp-set-brutal-palettes"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="skin">','    <section class="urppp-set-sec">',"      <h3>界面风格</h3>",'      <p class="urppp-set-tip">在同一布局上切换视觉气质。因适配规模较大，仅保证清爽模式的完整适配，如有影响请使用默认类Apple风格并选择性开启边缘线条。</p>','      <div class="urppp-theme-store-bar"><button type="button" class="urppp-set-btn ghost" id="urppp-theme-store">主题商店</button></div>','      <div id="urppp-theme-store-inline" class="urppp-store-inline" style="display:none"></div>','      <div class="urppp-skin-list" id="urppp-skin-list"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="system">','    <section class="urppp-set-sec" id="urppp-set-privacy">',"      <h3>隐私模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-privacy-modes">','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="off">关闭</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="one">一键隐私</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="custom">自定义</button>',"      </div>",'      <div class="urppp-privacy-groups" id="urppp-set-privacy-custom">','        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">身份信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-identity" type="checkbox" data-privacy-field="identity" aria-label="隐藏学号和证件"><label for="urppp-privacy-identity">学号/证件</label><input class="urppp-feature-input" data-privacy-value="identity" maxlength="40" aria-label="学号和证件替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-organization" type="checkbox" data-privacy-field="organization" aria-label="隐藏学院和专业"><label for="urppp-privacy-organization">学院/专业</label><input class="urppp-feature-input" data-privacy-value="organization" maxlength="40" aria-label="学院和专业替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-contact" type="checkbox" data-privacy-field="contact" aria-label="隐藏联系和个人信息"><label for="urppp-privacy-contact">联系/个人信息</label><input class="urppp-feature-input" data-privacy-value="contact" maxlength="40" aria-label="联系和个人信息替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">学业信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-grade" type="checkbox" data-privacy-field="grade" aria-label="隐藏成绩"><label for="urppp-privacy-grade">成绩</label><input class="urppp-feature-input" data-privacy-value="grade" maxlength="40" aria-label="成绩替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-gpa" type="checkbox" data-privacy-field="gpa" aria-label="隐藏绩点"><label for="urppp-privacy-gpa">绩点</label><input class="urppp-feature-input" data-privacy-value="gpa" maxlength="40" aria-label="绩点替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-credit" type="checkbox" data-privacy-field="credit" aria-label="隐藏学分"><label for="urppp-privacy-credit">学分</label><input class="urppp-feature-input" data-privacy-value="credit" maxlength="40" aria-label="学分替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">页面内容</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-other" type="checkbox" data-privacy-field="other" aria-label="隐藏其他数据"><label for="urppp-privacy-other">其他数据</label><input class="urppp-feature-input" data-privacy-value="other" maxlength="40" aria-label="其他数据替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-schedule" type="checkbox" data-privacy-field="schedule" aria-label="隐藏课表"><label for="urppp-privacy-schedule">课表</label><input class="urppp-feature-input" data-privacy-value="schedule" maxlength="40" aria-label="课表替换内容"></div>','            <div class="urppp-privacy-field urppp-privacy-field-static"><input id="urppp-privacy-avatar" type="checkbox" data-privacy-field="avatar" aria-label="隐藏头像"><label for="urppp-privacy-avatar">头像</label><span class="urppp-privacy-note">使用统一遮罩</span></div>',"          </div>","        </div>","      </div>",'      <div class="urppp-direct-edit-control">',"        <div><strong>自由修改显示数据</strong><span>开启后，直接点击首页或清爽模式中带标记的数据进行修改</span></div>",'        <button type="button" class="urppp-set-follow" id="urppp-set-direct-edit-toggle" aria-pressed="false">页面内修改：关</button>',"      </div>","    </section>",'    <section class="urppp-set-sec" id="urppp-set-identity">',"      <h3>自定义姓名与头像</h3>",'      <div class="urppp-identity-editor">','        <div class="urppp-identity-fields">','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-name-enabled"> 自定义姓名</label><input class="urppp-feature-input" id="urppp-set-custom-name" maxlength="40" placeholder="输入显示姓名"></div>','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-avatar-enabled"> 自定义头像</label><input class="urppp-feature-input" id="urppp-set-custom-avatar-url" placeholder="https://... 图片地址"></div>','          <div class="urppp-feature-row"><label for="urppp-set-custom-avatar-file">本地图片</label><input class="urppp-feature-input" type="file" id="urppp-set-custom-avatar-file" accept="image/png,image/jpeg,image/webp,image/gif"></div>',"        </div>",'        <div class="urppp-identity-preview">','          <span class="urppp-identity-preview-label">头像预览</span>','          <div class="urppp-avatar-preview-shell"><span>未设置</span><img class="urppp-avatar-preview" id="urppp-set-avatar-preview" alt="自定义头像预览"></div>',"        </div>","      </div>",'      <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-privacy-save">保存隐私与显示设置</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-avatar-clear">清除自定义头像</button></div>','      <div class="urppp-set-tip" id="urppp-set-privacy-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-json-export">',"      <h3>JSON 导出格式</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-json-custom" aria-pressed="false" style="width:100%">自定义 JSON：关</button>','      <div class="urppp-json-mapping-editor" id="urppp-set-json-editor">','        <label for="urppp-set-json-mapping">字段映射</label>','        <textarea id="urppp-set-json-mapping" spellcheck="false" aria-label="自定义 JSON 字段映射"></textarea>','        <p class="urppp-set-tip">源字段包括 name、teacher、position、day、sections、weeks、code、credit、campus、building、classroom、weekList 等；目标值支持 data.courses 形式的嵌套路径。</p>','        <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-json-save">保存映射</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-json-reset">恢复默认映射</button></div>',"      </div>",'      <div class="urppp-set-tip" id="urppp-set-json-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-update">',"      <h3>更新</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-auto-update" aria-pressed="false" style="width:100%">自动检测更新：关</button>','      <button type="button" class="urppp-set-btn" id="urppp-set-check-update" style="margin-top:12px;width:100%">检查更新</button>','      <div id="urppp-set-update-status" class="urppp-set-tip" style="margin-top:8px"></div>',"    </section>",'    <div id="urppp-set-assist-slot"></div>',"  </div>",'  <div class="urppp-set-pane" data-pane="about">','    <div class="urppp-about">','      <img class="urppp-about-logo" id="urppp-about-logo" src="'+n+'" alt="SCU URP++" referrerpolicy="no-referrer" />','      <a class="urppp-about-ver" id="urppp-about-ver" href="'+c+'" target="_blank" rel="noopener noreferrer">SCU URP++ v'+d+"</a>",'      <p class="urppp-about-author">作者：Chao_Lan · Hanako</p>','      <p class="urppp-about-contact">QQ：2718748334</p>',`      <p class="urppp-about-msg">有任何问题欢迎及时反馈！
半夜Vibe有点爽怎么回事。</p>`,"    </div>","  </div>","</div>"].join("")}a(kp,"buildSettingsPanelHtml");var te="urppp_plugin_",pc="1.0.0";function oo({GM:p,doc:n,hostInfo:c,uiDeps:d}){let{getValue:u=a(()=>null,"getValue"),setValue:k=a(()=>{},"setValue"),xmlHttp:P,addStyle:S}=p||{},y=(typeof d=="function"?d:d&&d.openSubpanel)||null,A=new Map,f=new Map,w=new Map,T=[],C=null;function b(N,Y){let tt=w.get(N);tt&&tt.forEach(bt=>{try{bt(Y)}catch{}})}a(b,"emit");function m(N,Y){return w.has(N)||w.set(N,new Set),w.get(N).add(Y),()=>w.get(N).delete(Y)}a(m,"on");function v(N,Y){return u(`${te}${N}_${Y}`)}a(v,"storageGet");function x(N,Y,tt){k(`${te}${N}_${Y}`,tt)}a(x,"storageSet");function E(){return N=>({get:a(Y=>v(N,Y),"get"),set:a((Y,tt)=>x(N,Y,tt),"set"),remove:a(Y=>k(`${te}${N}_${Y}`,void 0),"remove")})}a(E,"storage");function q(N,Y={}){return new Promise((tt,bt)=>{if(typeof P!="function"){bt(new Error("GM_xmlhttpRequest 不可用（未授权跨域？）"));return}P({method:Y.method||"GET",url:N,headers:Y.headers||{},data:Y.data,timeout:Y.timeout||8e3,onload:a(ht=>ht.status>=200&&ht.status<300?tt(ht.responseText):bt(new Error(`HTTP ${ht.status}`)),"onload"),onerror:a(()=>bt(new Error("网络错误")),"onerror"),ontimeout:a(()=>bt(new Error("超时(8s)")),"ontimeout")})})}a(q,"request");async function I(N,Y){let tt=Array.isArray(N)?N:[N],bt=[];for(let ht=0;ht<tt.length;ht+=1){let zt=tt[ht];Y&&Y({stage:"downloading",index:ht+1,total:tt.length,url:zt});try{let yt=await q(zt);return Y&&Y({stage:"downloaded",url:zt,size:yt.length}),yt}catch(yt){bt.push(`源${ht+1}(${L(zt)})失败: ${yt&&yt.message?yt.message:yt}`),Y&&Y({stage:"source_failed",index:ht+1,total:tt.length,error:yt&&yt.message?yt.message:yt})}}throw new Error("所有下载源失败 → "+bt.join(" ｜ "))}a(I,"fetchWithFallback");function L(N){try{return new URL(N).host}catch{return N}}a(L,"shortHost");function O(N){let Y=String(N||"").match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);return Y?N.replace(Y[0],""):N}a(O,"stripMetadata");function M(N,Y){try{let tt=O(N),bt=["GM_getValue","GM_setValue","GM_xmlhttpRequest","GM_registerMenuCommand","GM_addStyle","unsafeWindow"],ht=[typeof GM_getValue=="function"?GM_getValue:void 0,typeof GM_setValue=="function"?GM_setValue:void 0,typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:void 0,typeof GM_registerMenuCommand=="function"?GM_registerMenuCommand:void 0,typeof GM_addStyle=="function"?GM_addStyle:void 0,typeof unsafeWindow<"u"?unsafeWindow:null];return new Function(...bt,tt)(...ht),!0}catch(tt){return console.warn("[URP++ plugin] 注入失败",Y,tt),!1}}a(M,"inject");function H(N,Y){let tt=f.get(N);return tt?(tt.enabled=!!Y,k(`${te}${N}_enabled`,tt.enabled),b(Y?"enabled":"disabled",N),!0):!1}a(H,"setEnabled");function G(N){let Y=f.get(N);return!!Y&&Y.enabled}a(G,"isEnabled");function U(N){if(!N||!N.id)return!1;if(A.has(N.id)&&A.get(N.id).__urpppRegistered)return!0;let Y=Object.assign({type:"plugin"},N);Y.__urpppRegistered=!0,A.set(N.id,Y);let tt=f.get(N.id)||{loaded:!1,enabled:!1,version:N.version||""};return tt.version=Y.version||tt.version,f.set(N.id,tt),b("registered",Y.id),!0}a(U,"register");function et(N){return A.get(N)||null}a(et,"get");function it(N){let Y=[];for(let tt of A.values())(!N||tt.type===N)&&Y.push(tt);return Y}a(it,"list");function mt(N){let Y=f.get(N);return!!Y&&Y.loaded}a(mt,"loaded");async function V(N,Y,tt){tt&&tt({stage:"start",id:N});let bt=Array.isArray(Y)?Y:Y?[Y]:rt(N),ht=await I(bt,tt);k(`${te}${N}_code`,ht),tt&&tt({stage:"injecting",id:N});let zt=M(ht,N),yt=f.get(N)||{loaded:!1,enabled:!1,version:""};return yt.loaded=zt,yt.enabled=zt,yt.code=ht,yt.version=yt.version||Q(ht),f.set(N,yt),k(`${te}${N}_enabled`,zt),b("loaded",N),zt}a(V,"install");function Q(N){let Y=String(N||"").match(/@version\s+(\S+)/);return Y?Y[1]:""}a(Q,"detectVersion");async function ot(N,Y,tt){let bt=Array.isArray(Y)?Y:Y?[Y]:rt(N),ht=await I(bt,tt);k(`${te}${N}_code`,ht);let zt=Q(ht),yt=f.get(N)||{loaded:!1,enabled:!1,version:""};return yt.version=zt||yt.version,yt.code=ht,f.set(N,yt),b("updated",N),{ok:!0,version:zt||yt.version}}a(ot,"update");function X(N){let Y=u(`${te}${N}_code`);if(!Y)return!1;let tt=f.get(N);if(tt&&tt.loaded)return!0;let bt=M(Y,N),ht=f.get(N)||{loaded:!1,enabled:!1,version:Q(Y)};return ht.loaded=bt,ht.enabled=bt&&u(`${te}${N}_enabled`)!==!1,ht.code=Y,f.set(N,ht),b("loaded",N),bt}a(X,"bootFromCache");function ct(N){let Y=A.get(N);return A.delete(N),f.delete(N),k(`${te}${N}_enabled`,!1),b("unregistered",N),!!Y}a(ct,"unregister");function rt(N){return N==="assist"?["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/plugins/urpppp.plugin.js","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js"]:[]}a(rt,"pluginSource");let st={protocolVersion:pc,register:U,unregister:ct,get:et,list:it,loaded:mt,isEnabled:G,enable:a((N,Y=!0)=>H(N,Y),"enable"),disable:a(N=>H(N,!1),"disable"),install:V,update:ot,bootFromCache:X,storage:a(()=>u&&{get:a(N=>u(N),"get"),set:a((N,Y)=>k(N,Y),"set")},"storage"),pluginStorage:a(N=>E()(N),"pluginStorage"),request:q,addStyle:a(N=>{try{S&&S(N)}catch{}},"addStyle"),log:a((...N)=>{console.log("[URP++ plugin]",...N)},"log"),on:m,emit:b,hostInfo:Object.assign({name:"SCU URP++"},c||{}),getSubpanel:a(()=>y,"getSubpanel")};try{window.__urpppPlugin=st}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppPlugin=st)}catch{}function ft(N){if(!N||!n||N.querySelector(".urppp-plugin-sec, .urpppp-entry-sec"))return;let Y=n.createElement("section");Y.className="urppp-set-sec urppp-plugin-sec",Y.id="urppp-plugin-sec",Y.innerHTML=`
      <h3>辅助插件</h3>
      <div class="urppp-plugin-status" id="urppp-plugin-status">检查中…</div>
      <div class="urppp-plugin-actions">
        <button type="button" class="urppp-set-btn" id="urppp-plugin-install">装载辅助插件</button>
        <button type="button" class="urppp-set-btn ghost" id="urppp-plugin-store">插件商店</button>
      </div>
      <div id="urppp-plugin-panels" style="margin-top:10px"></div>
      <div id="urppp-store-inline" class="urppp-store-inline" style="display:none"></div>
      <p class="urppp-set-tip" id="urppp-plugin-tip" style="margin-top:8px"></p>
    `,N.appendChild(Y);let tt=Y.querySelector("#urppp-plugin-status"),bt=Y.querySelector("#urppp-plugin-install"),ht=Y.querySelector("#urppp-plugin-store"),zt=Y.querySelector("#urppp-plugin-panels"),yt=Y.querySelector("#urppp-plugin-tip");function Ft(){let Pt=f.get("assist"),It=A.has("assist");Pt&&Pt.loaded||It?(tt.textContent=`辅助插件 v${Pt&&Pt.version?Pt.version:et("assist")&&et("assist").version||""} 已装载`,tt.className="urppp-plugin-status ok",bt.textContent="重新装载",bt.dataset.state="loaded",yt.textContent="已装载。下方为扩展入口。"):(tt.textContent=C||"未装载",tt.className=C?"urppp-plugin-status err":"urppp-plugin-status",bt.textContent="装载辅助插件",bt.dataset.state="notloaded",yt.textContent=C?"装载失败，可就近重试或放回本地安装。下方为装载/商店入口。":"点击装载后，主插件会下载并注入辅助插件（登录助手/评教/会话保持/2FA），无需再单独安装。"),zt.innerHTML="";let Xt=Ct();if(Xt&&Object.keys(Xt).length){let Te=n.createElement("div");Te.className="urppp-plugin-sub",Object.keys(Xt).forEach(ue=>{let Yt=n.createElement("button");Yt.type="button",Yt.className="urppp-set-btn ghost",Yt.textContent=Xt[ue].label||ue,Yt.addEventListener("click",()=>{try{Xt[ue]&&typeof Xt[ue].open=="function"?Xt[ue].open():y&&y(ue)}catch{}}),Te.appendChild(Yt)}),zt.appendChild(Te)}}a(Ft,"refresh"),bt.addEventListener("click",async()=>{bt.disabled=!0,bt.textContent="装载中…",tt.className="urppp-plugin-status",tt.textContent="正在开始装载…";try{if(await V("assist",null,It=>{try{It.stage==="downloading"?tt.textContent=`下载中… 源${It.index}/${It.total}（${L(It.url)}）`:It.stage==="downloaded"?tt.textContent=`已下载（${It.size} 字节），注入中…`:It.stage==="source_failed"?tt.textContent=`源${It.index}失败（${It.error||""}），切换下一源…`:It.stage==="injecting"?tt.textContent="注入中…":It.stage==="start"&&(tt.textContent="正在开始装载…"),console.log("[URP++ plugin] assist 装载进度",It)}catch{}}))C=null,tt.textContent="辅助插件已装载 v"+(et("assist")&&et("assist").version||""),console.log("[URP++ plugin] assist 装载成功");else throw new Error("注入失败")}catch(Pt){C="装载失败："+(Pt&&Pt.message?Pt.message:Pt),tt.textContent=C,tt.className="urppp-plugin-status err",console.warn("[URP++ plugin] assist 装载失败",Pt)}finally{bt.disabled=!1,Ft()}}),ht.addEventListener("click",()=>{y&&y("plugin-store")}),m("loaded",Pt=>{Pt==="assist"&&Ft()}),m("registered",Pt=>{Pt==="assist"&&Ft()}),m("unregistered",Pt=>{Pt==="assist"&&Ft()}),Ft()}a(ft,"renderAssistUi");function Z(N){return String(N??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}a(Z,"escapeHtml");function dt(N){if(N){if(kt(),N.dataset.rendered==="1"){N.style.display=N.style.display==="none"?"":"none";return}N.dataset.rendered="1",N.innerHTML=`
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
      </div>`,N.querySelectorAll(".urppp-store-tab").forEach(Y=>{Y.addEventListener("click",()=>{N.querySelectorAll(".urppp-store-tab").forEach(bt=>bt.className="urppp-store-tab"),Y.className="urppp-store-tab ac",N.querySelectorAll(".urppp-store-pane").forEach(bt=>bt.style.display="none");let tt=N.querySelector('.urppp-store-pane[data-pane="'+Y.dataset.tab+'"]');tt&&(tt.style.display="")})}),wt(N.querySelector("#urppp-store-manage-list")),N.style.display=""}}a(dt,"togglePluginStore");function kt(){if(n.getElementById("urppp-store-style"))return;let N=n.createElement("style");N.id="urppp-store-style",N.textContent=`
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
    `,(n.head||n.documentElement).appendChild(N)}a(kt,"ensureStoreStyle");function wt(N){if(!N)return;N.innerHTML="";let Y=Array.from(A.values());if(!Y.length){N.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}Y.forEach(tt=>{let bt=f.get(tt.id)||{},ht=n.createElement("div");ht.className="urppp-store-item";let zt=n.createElement("div");zt.className="urppp-store-info",zt.innerHTML="<strong>"+Z(tt.name||tt.id)+'</strong><span class="urppp-store-ver">'+(tt.version?"v"+Z(tt.version):"")+'</span><span class="urppp-store-state'+(bt.loaded?" ok":"")+'">'+(bt.loaded?"已装载":"未装载")+"</span>";let yt=n.createElement("div");yt.className="urppp-store-ops";let Ft=n.createElement("button");Ft.type="button",Ft.textContent="重新装载",Ft.addEventListener("click",async()=>{Ft.disabled=!0,Ft.textContent="装载中…";try{let It=await V(tt.id,null);Ft.textContent=It?"已装载":"装载失败",b("loaded",tt.id)}catch{Ft.textContent="装载失败"}setTimeout(()=>{Ft.disabled=!1,Ft.textContent="重新装载"},1400)});let Pt=n.createElement("button");Pt.type="button",Pt.className="danger",Pt.textContent="卸载",Pt.addEventListener("click",()=>{ct(tt.id),k(`${te}${tt.id}_code`,""),k(`${te}${tt.id}_enabled`,!1),b("unregistered",tt.id),wt(N)}),yt.appendChild(Ft),yt.appendChild(Pt),ht.appendChild(zt),ht.appendChild(yt),N.appendChild(ht)})}a(wt,"renderStoreManage");function Ct(){let N={};return A.forEach(Y=>{if(Y.subpanels&&typeof Y.subpanels=="function"){let tt=Y.subpanels();Object.keys(tt||{}).forEach(bt=>{N[bt]=tt[bt]})}else Y.subpanels&&typeof Y.subpanels=="object"&&Object.keys(Y.subpanels).forEach(tt=>{N[tt]=Y.subpanels[tt]})}),N}return a(Ct,"collectSubpanels"),{api:st,install:V,update:ot,renderAssistUi:ft,openPluginStore:dt,bootFromCache:X,register:U}}a(oo,"createPluginManager");function Ap(p){let{document:n,getSettings:c,setSettings:d,validateMapping:u,defaultMapping:k,getRecoveryMessage:P=a(()=>"","getRecoveryMessage")}=p;function S(f,w,T){let C=f&&f.querySelector("#urppp-set-json-status");C&&(C.textContent=w||"",C.classList.toggle("urppp-status-error",!!T),C.style.color=T?"var(--danger,#b91c1c)":"var(--text-muted)")}a(S,"setStatus");function y(f,w){if(!f)return;let T=c(),C=f.querySelector("#urppp-set-json-custom"),b=f.querySelector("#urppp-set-json-editor"),m=f.querySelector("#urppp-set-json-mapping");C&&(C.classList.toggle("ac",T.enabled),C.setAttribute("aria-pressed",T.enabled?"true":"false"),C.textContent="自定义 JSON："+(T.enabled?"开":"关")),b&&(b.style.display=T.enabled?"grid":"none"),m&&(w||!f.__urpppJsonMappingDirty&&n.activeElement!==m)&&(m.value=JSON.stringify(T.mapping,null,2),f.__urpppJsonMappingDirty=!1);let v=P();v&&S(f,v,!0)}a(y,"sync");function A(f){if(!f||f.__urpppJsonSettingsBound)return;f.__urpppJsonSettingsBound=!0;let w=f.querySelector("#urppp-set-json-custom"),T=f.querySelector("#urppp-set-json-mapping"),C=f.querySelector("#urppp-set-json-save"),b=f.querySelector("#urppp-set-json-reset");T&&T.addEventListener("input",()=>{f.__urpppJsonMappingDirty=!0}),w&&w.addEventListener("click",()=>{let m=c();m.enabled=!m.enabled;let v=!!f.__urpppJsonMappingDirty;d(m),y(f,!1);let x=m.enabled?"已启用自定义 JSON 格式":"已恢复小爱课程兼容格式";S(f,v?x+"；未保存草稿已保留":x)}),C&&C.addEventListener("click",()=>{try{let m=JSON.parse(String(T&&T.value||"").trim()),v=c();v.mapping=u(m),d(v),f.__urpppJsonMappingDirty=!1,y(f,!0),S(f,"自定义 JSON 映射已保存")}catch(m){S(f,m&&m.message||String(m),!0)}}),b&&b.addEventListener("click",()=>{let m=c();m.mapping=u(k),d(m),f.__urpppJsonMappingDirty=!1,y(f,!0),S(f,"已恢复默认字段映射")})}return a(A,"bind"),{bind:A,setStatus:S,sync:y}}a(Ap,"createJsonSettingsController");var Ar="••••";var Sp={name:{enabled:!1,replacement:"同学"},identity:{enabled:!0,replacement:"已隐藏"},organization:{enabled:!0,replacement:"已隐藏"},contact:{enabled:!0,replacement:"已隐藏"},grade:{enabled:!0,replacement:"已隐藏"},gpa:{enabled:!0,replacement:"••••"},credit:{enabled:!0,replacement:"••••"},other:{enabled:!0,replacement:"已隐藏"},avatar:{enabled:!0,replacement:""},schedule:{enabled:!1,replacement:"课表已隐藏"}},ic=["completedCourses","failedCourses","majorGpa","majorPlan","remainingCourses","passingTotalCredit","passingAvgScore","passingAvgGpa","passingRequiredCredit","passingRequiredAvg","passingRequiredGpa","schemeTotalCredit","schemeAvgScore","schemeAvgGpa","schemeRequiredCredit","schemeRequiredAvg","schemeRequiredGpa"];function no(p){let n=p&&typeof p=="object"?p:{},c=["off","one","custom"].includes(n.mode)?n.mode:"off",d={},u=n.fields&&typeof n.fields=="object"?n.fields:{},k=u.score&&typeof u.score=="object"?u.score:null;Object.keys(Sp).forEach(f=>{let w=Sp[f],T=["grade","gpa","credit"].includes(f)?k:null,C=f==="other"&&u.grade&&typeof u.grade=="object"?u.grade:null,b=u[f]&&typeof u[f]=="object"?u[f]:T||C||{};d[f]={enabled:f==="name"?!1:b.enabled==null?w.enabled:!!b.enabled,replacement:String(b.replacement==null?w.replacement:b.replacement).slice(0,80)}});let P=n.homepage&&typeof n.homepage=="object"?n.homepage:{},S=n.directEdit&&typeof n.directEdit=="object"?n.directEdit:P,y=S.values&&typeof S.values=="object"?S.values:{},A={};return ic.forEach(f=>{A[f]=String(y[f]==null?"":y[f]).trim().slice(0,80)}),{mode:c,mask:Ar,fields:d,directEdit:{enabled:!!S.enabled,values:A}}}a(no,"normalizePrivacySettings");function Sr(p){let n=p&&typeof p=="object"?p:{},c=String(n.avatar||"").trim();return{nameEnabled:!!n.nameEnabled,name:String(n.name||"").trim().slice(0,40),avatarEnabled:!!n.avatarEnabled,avatar:c.length<=3145728?c:"",avatarName:String(n.avatarName||"").trim().slice(0,120)}}a(Sr,"normalizeCustomIdentity");function rr(p){let n=String(p||"").trim();return n.length>3145728?"":/^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(n)?n:""}a(rr,"validCustomAvatar");function sc(p,n=globalThis.FileReader){return new Promise((c,d)=>{if(!p||!/^image\/(png|jpeg|webp|gif)$/i.test(p.type||"")){d(new Error("请选择 PNG、JPG、WebP 或 GIF 图片"));return}if(p.size>2*1024*1024){d(new Error("本地头像不能超过 2MB"));return}let u=new n;u.onload=()=>c(String(u.result||"")),u.onerror=()=>d(new Error("读取头像失败")),u.readAsDataURL(p)})}a(sc,"readAvatarFile");function _p(p){let{getPrivacySettings:n,setPrivacySettings:c,getCustomIdentity:d,setCustomIdentity:u,applyDisplay:k,refreshCleanDisplay:P,finishActiveDirectEdit:S,readAvatar:y=sc}=p;function A(b,m){let v=m.mode==="custom",x=b.querySelector(".urppp-direct-edit-control"),E=b.querySelector("#urppp-set-direct-edit-toggle");x&&(x.style.display=v?"flex":"none"),E&&(E.dataset.enabled=m.directEdit.enabled?"1":"0",E.classList.toggle("ac",m.directEdit.enabled),E.setAttribute("aria-pressed",m.directEdit.enabled?"true":"false"),E.textContent="页面内修改："+(m.directEdit.enabled?"开":"关"))}a(A,"syncDirectEdit");function f(b){if(!b)return;let m=n();b.querySelectorAll("[data-privacy-mode]").forEach(M=>{let H=M.getAttribute("data-privacy-mode")===m.mode;M.classList.toggle("ac",H),M.setAttribute("aria-pressed",H?"true":"false")});let v=b.querySelector("#urppp-set-privacy-custom");v&&(v.style.display=m.mode==="custom"?"grid":"none"),Object.keys(m.fields).forEach(M=>{let H=m.fields[M],G=b.querySelector('[data-privacy-field="'+M+'"]'),U=b.querySelector('[data-privacy-value="'+M+'"]');G&&(G.checked=!!H.enabled),U&&(U.value=H.replacement||"",U.disabled=!H.enabled)}),A(b,m);let x=d(),E=b.querySelector("#urppp-set-name-enabled"),q=b.querySelector("#urppp-set-custom-name"),I=b.querySelector("#urppp-set-avatar-enabled"),L=b.querySelector("#urppp-set-custom-avatar-url"),O=b.querySelector("#urppp-set-avatar-preview");if(E&&(E.checked=x.nameEnabled),q&&(q.value=x.name,q.disabled=!x.nameEnabled),I&&(I.checked=x.avatarEnabled),L&&(L.value=/^data:image\//i.test(x.avatar)?"":x.avatar,L.disabled=!x.avatarEnabled),b.__urpppAvatarSource=x.avatar,O){let M=rr(x.avatar);O.style.display=M?"block":"none",M?O.src=M:O.removeAttribute("src")}}a(f,"sync");function w(b){let m=n();Object.keys(m.fields).forEach(x=>{let E=b.querySelector('[data-privacy-field="'+x+'"]'),q=b.querySelector('[data-privacy-value="'+x+'"]');E&&(m.fields[x].enabled=!!E.checked),q&&(m.fields[x].replacement=String(q.value||"").trim().slice(0,80))});let v=b.querySelector("#urppp-set-direct-edit-toggle");return m.directEdit.enabled=!!(v&&v.dataset.enabled==="1"),m}a(w,"collect");function T(b,m,v){let x=b&&b.querySelector("#urppp-set-privacy-status");x&&(x.textContent=m||"",x.style.color=v?"#b91c1c":"var(--text-muted)")}a(T,"setStatus");function C(b){if(!b||b.__urpppPrivacyBound)return;b.__urpppPrivacyBound=!0,b.querySelectorAll("[data-privacy-mode]").forEach(L=>{L.addEventListener("click",()=>{let O=n();O.mode=L.getAttribute("data-privacy-mode")||"off",c(O),f(b),k()})}),b.querySelectorAll("[data-privacy-field]").forEach(L=>{L.addEventListener("change",()=>{let O=L.getAttribute("data-privacy-field"),M=b.querySelector('[data-privacy-value="'+O+'"]');M&&(M.disabled=!L.checked)})});let m=b.querySelector("#urppp-set-direct-edit-toggle");m&&m.addEventListener("click",()=>{let L=m.dataset.enabled!=="1";m.dataset.enabled=L?"1":"0",m.classList.toggle("ac",L),m.setAttribute("aria-pressed",L?"true":"false"),m.textContent="页面内修改："+(L?"开":"关")});let v=b.querySelector("#urppp-set-name-enabled"),x=b.querySelector("#urppp-set-avatar-enabled");v&&v.addEventListener("change",()=>{let L=b.querySelector("#urppp-set-custom-name");L&&(L.disabled=!v.checked)}),x&&x.addEventListener("change",()=>{let L=b.querySelector("#urppp-set-custom-avatar-url");L&&(L.disabled=!x.checked)});let E=b.querySelector("#urppp-set-custom-avatar-file");E&&E.addEventListener("change",async()=>{try{let L=await y(E.files&&E.files[0]);b.__urpppAvatarSource=L;let O=b.querySelector("#urppp-set-avatar-preview");O&&(O.src=L,O.style.display="block"),x&&(x.checked=!0),T(b,"本地头像已读取，点击保存后生效")}catch(L){T(b,L&&L.message||String(L),!0)}});let q=b.querySelector("#urppp-set-avatar-clear");q&&q.addEventListener("click",()=>{try{let L=d();L.avatarEnabled=!1,L.avatar="",L.avatarName="",u(L),b.__urpppAvatarSource="",f(b),k(),P(),T(b,"已清除自定义头像")}catch(L){T(b,L&&L.message||"清除自定义头像失败",!0)}});let I=b.querySelector("#urppp-set-privacy-save");I&&I.addEventListener("click",()=>{let L=n(),O=d();try{let M=w(b),H=b.querySelector("#urppp-set-custom-avatar-url"),U=String(H&&H.value||"").trim()||b.__urpppAvatarSource||"",et=Sr({nameEnabled:!!(v&&v.checked),name:String(b.querySelector("#urppp-set-custom-name")?.value||"").trim(),avatarEnabled:!!(x&&x.checked),avatar:U,avatarName:O.avatarName});if(et.avatarEnabled&&!rr(et.avatar))throw new Error("头像地址必须是 http(s) 图片或已选择的本地图片");L.directEdit.enabled&&!M.directEdit.enabled&&S(!0);try{u(et),c(M)}catch(it){try{u(O),c(L)}catch{}throw it}k(),P(),f(b),T(b,"隐私与显示设置已保存")}catch(M){T(b,M&&M.message||String(M),!0)}})}return a(C,"bind"),{bind:C,collect:w,setStatus:T,sync:f}}a(_p,"createPrivacySettingsController");function Ep(p){let{document:n,theme:c,preferences:d,accent:u,syncPanel:k}=p;function P(){c.getFollowSystem()?c.apply(c.resolveFollowTheme(),{system:!0}):c.apply("scu-red",{manual:!0})}a(P,"applyAccentTheme");function S(A,f){let w=A.querySelector("#urppp-set-schemes");if(!w)return;let T=u.getScheme();w.innerHTML="",u.listSchemePreviews(f).forEach(C=>{let b=n.createElement("button");b.type="button",b.className="urppp-set-scheme"+(C.id===T?" ac":""),b.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+C.bg+'"></span>','  <span style="background:'+C.surface+";border-color:"+C.border+'"></span>','  <span style="background:'+C.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+C.name+"</strong>","  <em>"+C.desc+"</em>","</div>"].join(""),b.addEventListener("click",()=>{u.setAccent(f),u.setScheme(C.id),P(),k()}),w.appendChild(b)})}a(S,"renderSchemeChoices");function y(A){A.querySelectorAll(".urppp-set-mode").forEach(L=>{L.addEventListener("click",()=>{c.isModeAvailable(L.dataset.theme)&&(c.apply(L.dataset.theme,{manual:!0}),k())})});let f=A.querySelector("#urppp-set-follow");f&&f.addEventListener("click",()=>{if(!c.supportsDark())return;let L=!c.getFollowSystem();c.setFollowSystem(L),L?c.apply(c.resolveFollowTheme(),{system:!0}):c.apply(c.getCurrent(),{manual:!0}),k(),c.syncNavbar()});let w=A.querySelector("#urppp-set-follow-dynamic");w&&w.addEventListener("click",()=>{c.supportsDynamic()&&(c.getFollowSystem()?c.setFollowDynamic(!c.getFollowDynamic()):(c.setFollowSystem(!0),c.setFollowDynamic(!0)),c.apply(c.resolveFollowTheme(),{system:!0}),k(),c.syncNavbar())});let T=A.querySelector("#urppp-set-clean-default");T&&T.addEventListener("click",()=>{d.setCleanDefault(!d.getCleanDefault()),k()});let C=A.querySelector("#urppp-set-clean-analysis");C&&C.addEventListener("click",()=>{let L=d.getCleanAnalysis()==="direct";d.setCleanAnalysis(L?"tab":"direct"),k()});let b=A.querySelector("#urppp-set-apple-edge");b&&b.addEventListener("click",()=>{d.setAppleEdge(!d.getAppleEdge());try{d.applySkin()}catch{}k()});let m=A.querySelector("#urppp-set-auto-update");m&&m.addEventListener("click",()=>{d.setAutoUpdate(!d.getAutoUpdate()),k()});let v=A.querySelector("#urppp-set-check-update");v&&!v.__urpppBound&&(v.__urpppBound=!0,v.addEventListener("click",()=>{d.checkUpdates()}));let x=A.querySelector("#urppp-set-color"),E=A.querySelector("#urppp-set-hex");if(!x||!E)return;x.addEventListener("input",()=>{E.value=x.value.toUpperCase()}),E.addEventListener("change",()=>{let L=u.normalize(E.value);L&&(E.value=L,x.value=L)});let q=A.querySelector("#urppp-set-gen");q&&q.addEventListener("click",()=>{let L=u.normalize(E.value)||x.value;L&&(u.setAccent(u.normalize(L)),P(),k())});let I=A.querySelector("#urppp-set-save");I&&I.addEventListener("click",()=>{let L=u.normalize(E.value)||x.value;L&&(u.savePreset(L),u.setAccent(u.normalize(L)),P(),k())}),x.addEventListener("change",()=>{let L=u.normalize(x.value);L&&(E.value=L,S(A,L))})}return a(y,"bind"),{bind:y,renderSchemeChoices:S}}a(Ep,"createThemeSettingsController");function Cp(p,n){let{seed:c,currentTheme:d,followSystem:u,skinId:k,darkSupported:P,dynamicSupported:S,fixedPalettes:y,followUseDynamic:A,cleanDefault:f,cleanAnalysis:w,appleEdge:T,autoUpdate:C,modeAvailability:b}=n,m=p.querySelector("#urppp-set-color"),v=p.querySelector("#urppp-set-hex");m&&(m.value=c),v&&(v.value=c),p.querySelectorAll(".urppp-set-mode").forEach(U=>{let et=U.dataset.theme,it=b[et]!==!1,mt=!u&&et===d&&it;U.disabled=!it,U.classList.toggle("ac",mt),U.classList.toggle("urppp-dyn-disabled",!it),U.setAttribute("aria-disabled",it?"false":"true"),it?U.removeAttribute("title"):U.title=et==="dark"?"当前界面风格不支持暗色模式":"当前界面风格不支持动态配色"});let x=p.querySelector("#urppp-set-follow");x&&(x.disabled=!P,x.classList.toggle("ac",u&&P),x.classList.toggle("urppp-dyn-disabled",!P),x.setAttribute("aria-pressed",u&&P?"true":"false"),x.textContent=u&&P?"跟随系统：开":"跟随系统：关",x.title=P?"":"当前界面风格不支持暗色模式");let E=p.querySelector("#urppp-set-follow-dynamic");E&&(E.classList.toggle("ac",A&&S),E.setAttribute("aria-pressed",A&&S?"true":"false"),E.textContent=A?"浅色用动态配色：开":"浅色用动态配色：关",E.disabled=!u||!S,E.classList.toggle("urppp-dyn-disabled",!S),E.style.opacity=S&&u?"1":"0.5",E.title=S?"":"当前界面风格不支持动态配色");let q=p.querySelector("#urppp-set-dynamic");q&&(q.style.display=S?"":"none",q.style.opacity="1",q.classList.toggle("urppp-dyn-disabled",!1),q.querySelectorAll("button, input, .urppp-set-scheme, .urppp-set-swatch").forEach(U=>{U.disabled=!1,U.classList.toggle("urppp-dyn-disabled",!1)}),q.querySelectorAll("h3, .urppp-set-tip, label").forEach(U=>{U.classList.toggle("urppp-dyn-disabled",!1)}));let I=p.querySelector("#urppp-set-brutal");I&&(I.style.display=y?"":"none");let L=p.querySelector("#urppp-set-clean-default");L&&(L.classList.toggle("ac",f),L.setAttribute("aria-pressed",f?"true":"false"),L.textContent=f?"默认进入清爽模式：开":"默认进入清爽模式：关");let O=p.querySelector("#urppp-set-clean-analysis");if(O){let U=w==="direct";O.classList.toggle("ac",U),O.setAttribute("aria-pressed",U?"true":"false"),O.textContent=U?"清爽成绩分析展示：直接显示":"清爽成绩分析展示：选项卡"}let M=p.querySelector("#urppp-set-apple-edge"),H=p.querySelector("#urppp-set-apple-edge-tip");if(M){let U=k==="apple";M.style.display=U?"":"none",H&&(H.style.display=U?"":"none"),U&&(M.classList.toggle("ac",T),M.setAttribute("aria-pressed",T?"true":"false"),M.textContent=T?"类Apple边缘线条：开":"类Apple边缘线条：关")}let G=p.querySelector("#urppp-set-auto-update");G&&(G.classList.toggle("ac",C),G.setAttribute("aria-pressed",C?"true":"false"),G.textContent=C?"自动检测更新：开":"自动检测更新：关")}a(Cp,"syncThemeSettingsControls");function po(p){let n=String(p||"").replace(/\s+/g,"");return/^[•·●○▪◆★\-–]$/.test(n)||/^\d{1,4}$/.test(n)}a(po,"isNoticeBulletText");function lc(p){return/\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(p||""))}a(lc,"isNoticeDateText");function Pp({pathname:p="",href:n="",title:c="",headingText:d=""}={}){return/courseSelectNotice|evaluationNotice|notice\/index/i.test(`${p} ${n}`)?!0:/评估公告|通知公告|选课公告|公告|通知/.test(`${c} ${d}`)}a(Pp,"isNoticePageContext");function io(p,{noticePage:n=!1}={}){if(!p)return!1;let d=(p.querySelector("thead")?.textContent||"").replace(/\s+/g,"");if(/标题/.test(d)&&/发布时间|发布日期|日期|时间/.test(d)||n&&/标题|公告|通知/.test(d)&&!/教室|教学楼|课程号|成绩|学号|座位数/.test(d))return!0;let u=p.querySelectorAll("tbody tr, tr"),k=0;if(u.forEach(S=>{let y=S.querySelectorAll("td");y.length<2||y.length>4||po(y[0].textContent)&&S.querySelector("a")&&lc(S.textContent)&&(k+=1)}),k<1)return!1;if(n||k===u.length)return!0;let P=p.getAttribute("style")||"";return/dashed/i.test(P)||p.classList.contains("no-border-top")||!!p.getAttribute("width")}a(io,"isNoticeListTable");function zp(p,{noticePage:n=!1}={}){if(!p)return!0;if(p.classList?.contains("urppp-notice-table")||io(p,{noticePage:n}))return!1;let c=`${p.id||""} ${p.getAttribute("class")||""}`;if(/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(c)||p.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]'))return!0;let d=p.querySelector("tbody tr, tr");if(d&&d.querySelectorAll("td,th").length>=5)return!0;let k=(p.querySelector("thead")?.textContent||"").replace(/\s+/g,"");return!!(k&&(/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(k)||/序号/.test(k)&&!/标题|公告|通知|发布时间/.test(k))||p.querySelector("a")&&/课表|教室信息|查看/.test(p.textContent||"")&&!n&&/座位数|教学楼|教室号|校区名/.test(p.textContent||""))}a(zp,"isBusinessDataTable");function Lp({isNativePdfIsolationActive:p,isBusinessDataTable:n,documentRef:c=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,getComputedStyleRef:k=getComputedStyle}){function P(){p()||c.querySelectorAll("table.table, table.table-bordered, table.dataTable").forEach(y=>{if(!y||y.closest(".urppp-table-wrap")||y.id==="courseTable"||y.closest(".modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal")||y.classList.contains("urppp-wrs-table")||y.classList.contains("urppp-notice-table"))return;n(y);let A=y.parentElement;if(!A)return;let f=A.style?.overflow||k(A).overflow;if(A.id?.endsWith("_scroll")||f==="auto"||f==="scroll"){A.classList.add("urppp-scroll-table-host");return}let T=c.createElement("div");T.className="urppp-table-wrap",A.insertBefore(T,y),T.appendChild(y)})}a(P,"wrapTables");function S(){let y=c.getElementById("page-content-template")||c.querySelector(".page-content")||c.body;if(!y)return;let A=d.__urpppTableObsRoot;if(d.__urpppTableObs&&A===y&&y.isConnected)return;d.__urpppTableObs&&d.__urpppTableObs.disconnect();let f=0,w=new u(()=>{clearTimeout(f),f=setTimeout(P,80)});w.observe(y,{childList:!0,subtree:!0}),d.__urpppTableObs=w,d.__urpppTableObsRoot=y}return a(S,"bindTableWrapObserver"),{bindTableWrapObserver:S,wrapTables:P}}a(Lp,"createTableWrapper");function qp(p){let n=String(p||"").trim().toLowerCase();if(!n||n==="transparent"||n==="inherit"||n==="initial")return!1;if(/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(n))return!0;let c=n.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);if(!c)return!1;let d=Number(c[1]),u=Number(c[2]),k=Number(c[3]);return(d+u+k)/3>=200}a(qp,"isLightInlineColor");function cc(p){if(!p?.style)return;let n=p.getAttribute("style")||"";if(!n||!/background/i.test(n))return;let c=p.style.backgroundColor||p.style.background||"";(qp(c)||/background(-color|-image)?\s*:/i.test(n))&&(p.style.removeProperty("background"),p.style.removeProperty("background-color"),p.style.removeProperty("background-image")),["borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"].forEach(d=>{let u=p.style[d];!u||!qp(u)||p.style.removeProperty(d.replace(/[A-Z]/g,k=>`-${k.toLowerCase()}`))}),/border(-color)?\s*:/i.test(n)&&/#e6e6e6|#eee|#ddd|#ccc/i.test(n)&&(p.style.removeProperty("border-color"),p.style.removeProperty("border-top-color"),p.style.removeProperty("border-right-color"),p.style.removeProperty("border-bottom-color"),p.style.removeProperty("border-left-color"))}a(cc,"scrubLightInlineBackground");function Tp({isNativePdfIsolationActive:p,documentRef:n=document,windowRef:c=window,MutationObserverRef:d=MutationObserver}){function u(){if(!p())try{let P=n.documentElement.classList.contains("urppp-theme-dark"),S=n.body?.classList.contains("urppp-dark");if(!P&&!S)return;n.querySelectorAll("table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th").forEach(cc)}catch{}}a(u,"scrubTableHeaderInlineBg");function k(){[0,200,800,1600].forEach(P=>setTimeout(()=>{try{u()}catch{}},P));try{let P=n.querySelector(".page-content, #page-content-template, .main-content")||n.body;if(!P)return;let S=c.__urpppTableScrubObs;if(S&&S.root===P&&P.isConnected)return;S?.observer&&S.observer.disconnect();let y=new d(()=>{clearTimeout(c.__urpppTableScrubTimer),c.__urpppTableScrubTimer=setTimeout(()=>{try{u()}catch{}},120)});y.observe(P,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),c.__urpppTableScrubObs={root:P,observer:y}}catch{}}return a(k,"scheduleScrubTableInlineBg"),{scheduleScrubTableInlineBg:k,scrubTableHeaderInlineBg:u}}a(Tp,"createTableInlineStyleScrubber");function Mp({beautifyPagebar:p,documentRef:n=document,windowRef:c=window,MutationObserverRef:d=MutationObserver,setTimeoutRef:u=setTimeout,clearTimeoutRef:k=clearTimeout}){function P(){p(),n.querySelectorAll("#urppagebar").forEach(y=>{if(y.__urpppPagebarObs)return;y.__urpppPagebarObs=!0,new d(()=>{k(c.__urpppPagebarTimer),c.__urpppPagebarTimer=u(()=>p(y.parentElement||n),150)}).observe(y,{childList:!0,subtree:!0})})}a(P,"run");function S(){if(c.__urpppPagebarBound){u(P,0);return}c.__urpppPagebarBound=!0,[0,300,1e3,2500].forEach(y=>u(P,y))}return a(S,"scheduleBeautifyPagebar"),{scheduleBeautifyPagebar:S}}a(Mp,"createPagebarLifecycle");function $p({destroyPagebarChosen:p,documentRef:n=document,logger:c=console}){function d(u){try{(u?.querySelectorAll?u.querySelectorAll("#urppagebar"):n.querySelectorAll("#urppagebar")).forEach(P=>{if(!P)return;P.classList.add("urppp-pagebar"),P.style.setProperty("display","block","important"),P.style.setProperty("width","100%","important"),P.style.setProperty("line-height","1.5","important");let S=P.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]')||P,y=Array.from(P.querySelectorAll('[id^="span_page_txt_"]')).map(b=>String(b.textContent||"").trim()).join(""),A=P.querySelector('select[id^="pagination_pageSize_"]'),f=A?String(A.value||""):"",w=P.querySelector('[id^="turnpageto_"]'),T=!!(w&&(w.readOnly||w.hasAttribute("readonly")));if(!(y.includes("转到")&&!T&&!f.includes("_"))){P.classList.add("urppp-pagebar-scroll"),P.classList.remove("urppp-pagebar-jump"),P.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach(b=>{b.style.setProperty("display","none","important")}),P.querySelectorAll("select").forEach(b=>{p(b),b.style.setProperty("width","128px","important"),b.style.setProperty("min-width","128px","important"),b.style.setProperty("max-width","128px","important")}),P.querySelectorAll(".chosen-container").forEach(b=>{try{b.style.setProperty("display","none","important")}catch{}});return}P.classList.add("urppp-pagebar-jump"),P.classList.remove("urppp-pagebar-scroll"),S.style.setProperty("display","flex","important"),S.style.setProperty("align-items","center","important"),S.style.setProperty("flex-wrap","wrap","important"),S.style.setProperty("gap","8px","important"),S.style.setProperty("position","relative","important"),S.style.setProperty("line-height","1.5","important"),P.querySelectorAll("ul.pagination").forEach(b=>{b.classList.add("urppp-pagination"),b.style.cssText=["display:inline-flex !important","align-items:center !important","flex-wrap:wrap !important","gap:4px !important","margin:0 !important","padding:0 !important","list-style:none !important","float:none !important","position:static !important"].join(";")}),P.querySelectorAll("ul.pagination > li").forEach(b=>{let m=b.classList.contains("active"),v=b.classList.contains("disabled"),x=b.classList.contains("previous")||/previous/i.test(b.getAttribute("name")||""),E=b.classList.contains("next")||/next/i.test(b.getAttribute("name")||"");b.classList.add("urppp-page-li"),m&&b.classList.add("urppp-page-li-active"),v&&b.classList.add("urppp-page-li-disabled"),x&&b.classList.add("urppp-page-li-prev"),E&&b.classList.add("urppp-page-li-next"),b.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","float:none !important","position:static !important","margin:0 !important","padding:0 !important","list-style:none !important","border:none !important","background:transparent !important","height:auto !important","min-height:0 !important"].join(";");let q=b.querySelector(":scope > span, :scope > a")||b.firstElementChild;if(!q)return;q.classList.add("urppp-page-chip"),m&&q.classList.add("urppp-page-chip-active"),v&&q.classList.add("urppp-page-chip-disabled"),(x||E)&&q.classList.add("urppp-page-chip-nav");let I=x||E?"72px":"40px",L=m?"var(--pagination-active-bg, var(--primary))":"var(--surface)",O=m?"var(--pagination-active-border, var(--primary))":"var(--border)",M=m?"var(--pagination-active-foreground, var(--primary-foreground, #fff))":v?"var(--text-muted)":"var(--text)";q.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","box-sizing:border-box !important","float:none !important","position:static !important","width:auto !important",`min-width:${I} !important`,"height:36px !important","min-height:36px !important","max-height:36px !important","padding:0 12px !important","margin:0 !important","line-height:36px !important","font-size:14px !important","font-weight:600 !important","border-radius:8px !important",`border:1px solid ${O} !important`,`background:${L} !important`,`color:${M} !important`,"box-shadow:none !important","text-decoration:none !important",`cursor:${v?"default":"pointer"} !important`,"white-space:nowrap !important","overflow:hidden !important"].join(";")}),P.querySelectorAll('[id^="btn_turnpageto_"]').forEach(b=>{b.classList.add("urppp-page-confirm"),b.style.setProperty("position","static","important"),b.style.setProperty("left","auto","important"),b.style.setProperty("top","auto","important"),b.style.setProperty("float","none","important"),b.style.setProperty("height","32px","important"),b.style.setProperty("min-width","52px","important"),b.style.setProperty("padding","0 12px","important"),b.style.setProperty("margin","0 4px","important"),b.style.setProperty("font-size","13px","important"),b.style.setProperty("line-height","1","important"),b.style.setProperty("vertical-align","middle","important")}),P.querySelectorAll('[id^="turnpageto_"]').forEach(b=>{b.classList.add("urppp-page-goto"),b.style.setProperty("position","static","important"),b.style.setProperty("display","inline-block","important"),b.style.setProperty("height","32px","important"),b.style.setProperty("width","48px","important"),b.style.setProperty("margin","0 4px","important"),b.style.setProperty("padding","4px 8px","important"),b.style.setProperty("font-size","14px","important"),b.style.setProperty("line-height","1.2","important"),b.style.setProperty("box-sizing","border-box","important"),b.style.setProperty("vertical-align","middle","important");let m=b.parentElement;m?.tagName==="SPAN"&&(m.style.setProperty("position","static","important"),m.style.setProperty("display","inline-flex","important"),m.style.setProperty("align-items","center","important"),m.style.setProperty("width","auto","important"),m.style.setProperty("height","auto","important"),m.style.setProperty("min-height","0","important"),m.style.setProperty("vertical-align","middle","important"))}),P.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach(b=>{b.style.setProperty("display","inline","important"),b.style.setProperty("border","none","important"),b.style.setProperty("background","transparent","important"),b.style.setProperty("padding","0","important"),b.style.setProperty("margin","0","important"),b.style.setProperty("height","auto","important"),b.style.setProperty("line-height","1.5","important"),b.style.setProperty("font-size","13px","important"),b.style.setProperty("color","var(--text-secondary, var(--text-muted))","important")})})}catch(k){c.warn("[URP++] pagebar beautify failed",k)}}return a(d,"beautifyPagebar"),{beautifyPagebar:d}}a($p,"createPagebarBeautifier");function Ip({beautifyNoticeTables:p,pinNoticeRowSurface:n,documentRef:c=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,requestAnimationFrameRef:k=requestAnimationFrame,setTimeoutRef:P=setTimeout,clearTimeoutRef:S=clearTimeout}){function y(){d.__urpppNoticeHoverScrub||(d.__urpppNoticeHoverScrub=!0,c.addEventListener("mouseout",f=>{let w=f.target?.closest?f.target.closest("table.urppp-notice-table tr.urppp-notice-row"):null;w&&k(()=>n(w))},!0))}a(y,"bindNoticeHoverScrub");function A(){[0,400,1500].forEach(f=>P(()=>{try{p()}catch{}},f));try{let f=c.getElementById("page-content-template")||c.querySelector(".page-content, .main-content")||c.body;if(!f)return;let w=d.__urpppNoticeObs;if(w&&w.root===f&&f.isConnected)return;w?.observer&&w.observer.disconnect();let T=new u(()=>{S(d.__urpppNoticeTimer),d.__urpppNoticeTimer=P(()=>{try{p()}catch{}},180)});T.observe(f,{childList:!0,subtree:!0}),d.__urpppNoticeObs={root:f,observer:T}}catch{}}return a(A,"scheduleBeautifyNoticeTables"),{bindNoticeHoverScrub:y,scheduleBeautifyNoticeTables:A}}a(Ip,"createNoticeTableLifecycle");function Np({getCurrentTheme:p,documentRef:n=document,getComputedStyleRef:c=getComputedStyle}){function d(){try{return c(n.documentElement).getPropertyValue("--surface").trim()||(p()==="dark"?"#151A24":"#FFFFFF")}catch{return p()==="dark"?"#151A24":"#FFFFFF"}}a(d,"noticeSurfaceColor");function u(y){if(!y?.classList?.contains("urppp-notice-row"))return;let A=d();y.classList.remove("hover"),y.style.setProperty("background",A,"important"),y.style.setProperty("background-color",A,"important"),y.querySelectorAll("td, th").forEach(f=>{f.classList.remove("hover"),f.style.setProperty("background","transparent","important"),f.style.setProperty("background-color","transparent","important")})}a(u,"pinNoticeRowSurface");function k(y){try{let A=y||n;if(A.matches?.("tr.urppp-notice-row")){u(A);return}A.querySelectorAll("table.urppp-notice-table tr.urppp-notice-row").forEach(u)}catch{}}a(k,"scrubNoticeInlineBg");function P(y){y&&(y.classList.remove("table-hover","table-striped"),y.classList.add("urppp-notice-nohover"),y.querySelectorAll("tr.urppp-notice-row").forEach(A=>{A.classList.remove("hover"),u(A)}))}a(P,"disarmNoticeTableHover");function S(y){if(!y)return;y.classList.remove("urppp-notice-table"),delete y.dataset.urpppNoticeScan,y.style.removeProperty("border"),y.style.removeProperty("border-left"),y.style.removeProperty("background");let A=y.closest(".urppp-table-wrap.urppp-notice-wrap");A&&(A.classList.remove("urppp-notice-wrap"),A.style.removeProperty("border"),A.style.removeProperty("background"),A.style.removeProperty("box-shadow"),A.style.removeProperty("overflow"),A.style.removeProperty("border-radius")),y.querySelectorAll("tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card").forEach(f=>{f.classList.remove("urppp-notice-row","urppp-notice-title-cell","urppp-notice-date-cell","urppp-notice-bullet-cell","urppp-notice-link","urppp-notice-time","urppp-notice-card","urppp-notice-card-row","urppp-notice-main","urppp-notice-meta","urppp-notice-title","urppp-notice-body"),(f.tagName==="TR"||f.tagName==="TD")&&["display","border","background","padding","margin","width","box-shadow","border-radius","float","position"].forEach(w=>{f.style.getPropertyPriority(w)==="important"&&f.style.removeProperty(w)}),delete f.dataset.urpppNoticeDone})}return a(S,"stripMistakenNoticeTable"),{disarmNoticeTableHover:P,pinNoticeRowSurface:u,scrubNoticeInlineBg:k,stripMistakenNoticeTable:S}}a(Np,"createNoticeTableSurface");function Bp({isNativePdfIsolationActive:p,bindNoticeHoverScrub:n,scrubNoticeInlineBg:c,stripMistakenNoticeTable:d,disarmNoticeTableHover:u,pinNoticeRowSurface:k,isBusinessDataTable:P,isNoticeListTable:S,isNoticePageContext:y,isNoticeBulletText:A,documentRef:f=document,windowRef:w=window,logger:T=console}){function C(){if(!p())try{n(),c(),f.querySelectorAll("table.urppp-notice-table, table.table").forEach(m=>{P(m)&&(m.classList.contains("urppp-notice-table")||m.querySelector(".urppp-notice-row, .urppp-notice-title-cell"))&&d(m)});let b=new Set(f.querySelectorAll('.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'));y()?f.querySelectorAll("table").forEach(m=>b.add(m)):f.querySelectorAll("table").forEach(m=>{S(m)&&b.add(m)}),Array.from(b).forEach(m=>{if(!m||P(m))return;if(m.querySelector("thead th")&&m.querySelectorAll("thead th").length>=3){let L=m.querySelector("thead")?.textContent||"";if(!S(m)&&/序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(L)&&!/标题|公告|通知/.test(L))return}let v=Array.from(m.querySelectorAll("tbody > tr, tr")).filter(L=>L.querySelector("td"));if(!v.length)return;let x=0;v.slice(0,12).forEach(L=>{let O=Array.from(L.children).filter(et=>et.tagName==="TD"||et.tagName==="TH");if(O.length>=5)return;let M=(L.textContent||"").replace(/\s+/g," ").trim(),H=!!L.querySelector("a[href], a[onclick], a"),G=/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(M),U=O.some(et=>A(et.textContent));(H&&G||U&&H||U&&G)&&(x+=1)});let E=m.classList.contains("no-border-top")||/dashed|border-left-style/.test(m.getAttribute("style")||""),q=y();if(x<1){if(q){if(v.slice(0,8).filter(O=>{let M=Array.from(O.children).filter(G=>G.tagName==="TD"||G.tagName==="TH");if(M.length<1||M.length>4)return!1;let H=(O.textContent||"").replace(/\s+/g," ").trim();return!!O.querySelector("a")||/\d{4}/.test(H)}).length<1&&!E)return}else if(!(E&&/公告|通知/.test(f.title||"")))return}if(P(m))return;m.classList.add("urppp-notice-table"),m.dataset.urpppNoticeScan="1",u(m),m.style.setProperty("border","none","important"),m.style.setProperty("border-left","none","important"),m.style.setProperty("background","transparent","important"),m.style.setProperty("width","100%","important");let I=m.closest(".urppp-table-wrap");I&&(I.classList.add("urppp-notice-wrap"),I.style.setProperty("border","none","important"),I.style.setProperty("background","transparent","important"),I.style.setProperty("box-shadow","none","important"),I.style.setProperty("overflow","visible","important"),I.style.setProperty("border-radius","0","important")),v.forEach(L=>{if(L.dataset.urpppNoticeDone==="1")return;let O=Array.from(L.children).filter(V=>V.tagName==="TD"||V.tagName==="TH");if(!O.length)return;let M=a(V=>(V||"").replace(/\u00AD/g,"").replace(/\u200B/g,"").replace(/\s+/g," ").trim(),"clean");if(O.length>=2){let V=null,Q=null,ot=null;if(O.forEach((X,ct)=>{let rt=M(X.textContent),st=!!X.querySelector("a");if(!V&&A(rt)&&(ct===0||O.length>=2)){V=X;return}if(!ot&&(/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(rt)||/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(rt)||/text-align\s*:\s*right/i.test(X.getAttribute("style")||"")||ct===O.length-1&&rt.length<=28&&/\d{4}/.test(rt))&&/\d{4}/.test(rt)&&rt.length<=32){ot=X;return}!Q&&(st||rt.length>4)&&(Q=X)}),Q||(Q=O.find(X=>X!==V&&X!==ot)||O[0]),!ot&&O.length>=2){let X=O[O.length-1];X!==Q&&X!==V&&(ot=X)}if(L.classList.add("urppp-notice-row"),k(L),L.removeAttribute("width"),L.style.setProperty("flex-wrap","nowrap","important"),O.forEach(X=>{X.removeAttribute("width"),X.removeAttribute("height"),X.removeAttribute("align"),X.style.setProperty("border","none","important"),X.style.setProperty("background","transparent","important"),X.style.setProperty("vertical-align","middle","important"),X.style.removeProperty("width"),X.style.setProperty("width","auto","important")}),V&&(V.classList.add("urppp-notice-bullet-cell"),V.style.setProperty("display","none","important"),V.style.setProperty("width","0","important"),V.style.setProperty("padding","0","important")),Q){Q.classList.add("urppp-notice-title-cell"),Q.removeAttribute("width"),Q.style.setProperty("width","auto","important"),Q.style.setProperty("max-width","100%","important"),Q.style.setProperty("min-width","0","important"),Q.style.setProperty("flex","1 1 0%","important"),Q.style.setProperty("overflow","hidden","important"),Q.style.setProperty("padding","0","important"),Q.style.setProperty("pointer-events","auto","important"),Q.style.setProperty("white-space","nowrap","important");let X=Q.querySelector("a[href], a[onclick], a");if(X||(X=L.querySelector("a[href], a[onclick], a")),X){Q.contains(X)||(Q.innerHTML="",Q.appendChild(X)),X.classList.add("urppp-notice-link");let ct=X.getAttribute("href"),rt=X.getAttribute("onclick"),st=X.getAttribute("target"),ft=M(X.textContent);X.textContent=ft,ct!=null&&X.setAttribute("href",ct),rt!=null&&X.setAttribute("onclick",rt),st!=null&&X.setAttribute("target",st),X.style.setProperty("color","var(--text)","important"),X.style.setProperty("text-decoration","none","important"),X.style.setProperty("font-size","14px","important"),X.style.setProperty("font-weight","500","important"),X.style.setProperty("line-height","1.5","important"),X.style.setProperty("pointer-events","auto","important"),X.style.setProperty("cursor","pointer","important"),X.style.setProperty("position","relative","important"),X.style.setProperty("z-index","2","important"),X.style.setProperty("display","block","important"),X.style.setProperty("white-space","nowrap","important"),X.style.setProperty("overflow","hidden","important"),X.style.setProperty("text-overflow","ellipsis","important"),L.dataset.urpppNoticeClickBound!=="1"&&(L.dataset.urpppNoticeClickBound="1",L.style.setProperty("cursor","pointer","important"),L.addEventListener("click",Z=>{if(Z.target&&Z.target.closest&&Z.target.closest("a,button,input,select,textarea,label"))return;if(X.getAttribute("onclick")){X.click();return}let dt=X.getAttribute("href");if(!dt||dt==="#"||dt.indexOf("javascript:")===0){X.click();return}X.target==="_blank"?w.open(dt,"_blank"):w.location.href=dt}))}else{let ct=M(Q.textContent);ct&&!Q.querySelector("button, input, select")&&(!Q.querySelector("*")||Q.children.length===0)&&(Q.textContent=ct)}}if(ot){ot.classList.add("urppp-notice-date-cell"),ot.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-end !important","flex:0 0 auto !important","width:auto !important","max-width:none !important","white-space:nowrap !important","text-align:right !important","padding:0 !important","margin:0 0 0 auto !important","border:none !important","background:transparent !important","float:none !important","position:static !important","right:auto !important","left:auto !important","top:auto !important"].join(";");let X=M(ot.textContent);ot.innerHTML="";let ct=f.createElement("span");ct.className="urppp-notice-time",ct.textContent=X,ot.appendChild(ct)}Q&&(Q.style.setProperty("flex","1 1 auto","important"),Q.style.setProperty("min-width","0","important"),Q.style.setProperty("margin","0","important"),Q.style.setProperty("float","none","important"),Q.style.setProperty("position","static","important")),L.style.setProperty("display","flex","important"),L.style.setProperty("align-items","center","important"),L.style.setProperty("justify-content","space-between","important"),L.style.setProperty("gap","16px","important"),L.style.setProperty("max-width","100%","important"),L.style.setProperty("box-sizing","border-box","important"),L.style.setProperty("overflow","hidden","important"),L.dataset.urpppNoticeDone="1";return}let H=O[0],G=Array.from(H.querySelectorAll(":scope > span"));if(G.length<2){let V=H.querySelector("a"),Q=M(H.textContent),ot=Q.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);if(V||ot){L.classList.add("urppp-notice-row");let X=f.createElement("div");X.className="urppp-notice-card urppp-notice-card-row";let ct=f.createElement("div");if(ct.className="urppp-notice-main",V){V.classList.add("urppp-notice-link");let rt=V.getAttribute("href"),st=V.getAttribute("onclick"),ft=M(V.textContent);V.textContent=ft,rt!=null&&V.setAttribute("href",rt),st!=null&&V.setAttribute("onclick",st),V.style.setProperty("pointer-events","auto","important"),V.style.setProperty("cursor","pointer","important"),ct.appendChild(V),L.dataset.urpppNoticeClickBound!=="1"&&(L.dataset.urpppNoticeClickBound="1",L.style.setProperty("cursor","pointer","important"),L.addEventListener("click",Z=>{if(!(Z.target&&Z.target.closest&&Z.target.closest("a,button,input,select"))){if(V.getAttribute("onclick")||!V.getAttribute("href")||V.getAttribute("href")==="#"){V.click();return}w.location.href=V.getAttribute("href")}}))}else{let rt=f.createElement("div");rt.className="urppp-notice-title",rt.textContent=ot?Q.replace(ot[0],"").trim():Q,ct.appendChild(rt)}if(X.appendChild(ct),ot){let rt=f.createElement("div");rt.className="urppp-notice-meta";let st=f.createElement("span");st.className="urppp-notice-time",st.textContent=ot[1],rt.appendChild(st),X.appendChild(rt)}H.innerHTML="",H.appendChild(X),H.dataset.urpppNoticeDone="1",L.dataset.urpppNoticeDone="1"}return}let U=null,et=null,it=[];if(G.forEach(V=>{let Q=(V.getAttribute("style")||"")+" "+(V.style.cssText||""),ot=M(V.textContent);if(ot){if(/font-size\s*:\s*18/i.test(Q)||!U&&/font-size\s*:\s*1[6-9]/i.test(Q)){U=V;return}if(/font-size\s*:\s*12/i.test(Q)||/float\s*:\s*right/i.test(Q)||/^\d{4}-\d{2}-\d{2}/.test(ot)){et=V;return}it.push(V)}}),U||(U=G[0]),!et){let V=G[G.length-1];V!==U&&(et=V)}let mt=f.createElement("div");if(mt.className="urppp-notice-card",U){let V=f.createElement("div");V.className="urppp-notice-title",V.textContent=M(U.textContent),mt.appendChild(V)}if((it.length?it:G.filter(V=>V!==U&&V!==et)).forEach(V=>{let Q=f.createElement("div");Q.className="urppp-notice-body",Q.textContent=M(V.textContent),Q.textContent&&mt.appendChild(Q)}),et){let V=f.createElement("div");V.className="urppp-notice-meta";let Q=f.createElement("span");Q.className="urppp-notice-time",Q.textContent=M(et.textContent),V.appendChild(Q),mt.appendChild(V)}H.innerHTML="",H.appendChild(mt),H.dataset.urpppNoticeDone="1",L.dataset.urpppNoticeDone="1",L.classList.add("urppp-notice-row")})})}catch(b){T.warn("[URP++] notice table beautify failed",b)}}return a(C,"beautifyNoticeTables"),{beautifyNoticeTables:C}}a(Bp,"createNoticeTableBeautifier");var Fp={"page-content-template":"urppp-pdf-page",mycoursetable:"urppp-pdf-mycoursetable",courseTable:"urppp-pdf-courseTable",courseTableBody:"urppp-pdf-courseTableBody",h4_id1:"urppp-pdf-h4-1",h4_id2:"urppp-pdf-h4-2",infoTable:"urppp-pdf-info-table","rwskxxbg-course":"urppp-pdf-rwskxxbg","other-course":"urppp-pdf-other-course",temp_title:"urppp-pdf-temp-title",temp_subtitle:"urppp-pdf-temp-subtitle"};function dc(p){return p.querySelectorAll('script, iframe, object, embed, [id^="urppp-"], [data-urppp]').forEach(n=>n.remove()),[p,...p.querySelectorAll("*")].forEach(n=>{Array.from(n.classList||[]).forEach(c=>{/^urppp(?:-|$)/.test(c)&&n.classList.remove(c)}),Array.from(n.attributes||[]).forEach(c=>{/^data-urppp(?:-|$)/.test(c.name)&&n.removeAttribute(c.name)}),n.style&&Array.from(n.style).forEach(c=>{n.style.getPropertyPriority(c)==="important"&&n.style.removeProperty(c)})}),p}a(dc,"sanitizeNativePdfClone");function uc(p){return[p,...p.querySelectorAll("*")].forEach(n=>{n.id&&Fp[n.id]&&(n.id=Fp[n.id]),n.classList.contains("class_div")&&(n.classList.remove("class_div"),n.classList.remove("box_font"),n.classList.add("urppp-pdf-card")),n.classList.contains("course")&&(n.classList.remove("course"),n.classList.add("urppp-pdf-course"))}),p}a(uc,"renameNativePdfClone");function mc(){let p=[];document.querySelectorAll('style[id^="urppp-"]').forEach(d=>{d.sheet&&!d.sheet.disabled&&(p.push(d),d.sheet.disabled=!0)});let n=0,c=document.getElementById("mycoursetable");return c&&(n=c.getBoundingClientRect().width),p.forEach(d=>{d.sheet.disabled=!1}),n}a(mc,"measureNativeScheduleWidth");var hc=`
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
`;function bc(p){p.querySelectorAll("td, th").forEach(n=>{n.style.removeProperty("background"),n.style.removeProperty("background-color")}),p.querySelectorAll("th[rowspan]").forEach(n=>{n.style.removeProperty("width"),n.style.setProperty("white-space","nowrap"),n.style.setProperty("text-align","center")}),p.querySelectorAll("table").forEach(n=>{n.style.setProperty("background","#ffffff","important"),n.style.setProperty("background-color","#ffffff","important"),n.style.setProperty("border","none","important"),n.style.setProperty("color","#000000","important")}),p.querySelectorAll("th").forEach(n=>{if(n.style.setProperty("color","#000000","important"),n.style.setProperty("border","1px solid #dddddd","important"),n.style.setProperty("font-weight","normal","important"),n.childNodes.length===1&&n.firstChild&&n.firstChild.nodeType===3){let c=document.createElement("span");c.textContent=n.textContent,n.textContent="",n.appendChild(c)}}),p.querySelectorAll("thead th").forEach(n=>{n.style.setProperty("background","#dddddd","important"),n.style.setProperty("background-color","#dddddd","important")}),p.querySelectorAll("tbody th").forEach(n=>{n.style.setProperty("background","transparent","important"),n.style.setProperty("background-color","transparent","important")}),p.querySelectorAll("td").forEach(n=>{n.style.setProperty("background","transparent","important"),n.style.setProperty("background-color","transparent","important"),n.style.setProperty("color","#000000","important"),n.style.setProperty("border","1px solid #dddddd","important")})}a(bc,"normalizeNativePdfStage");function Dp(p){let n=mc(),c=document.createElement("div");c.id="urppp-pdf-stage",c.style.cssText="position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;width:"+(n||window.innerWidth||1440)+"px;";let d=document.createElement("div");d.id="urppp-pdf-page",d.style.cssText="position:relative;width:100%;box-sizing:border-box;";let u=p.cloneNode(!0);dc(u),uc(u),d.appendChild(u),c.appendChild(d),bc(u);let k=document.createElement("style");k.id="urppp-pdf-reset-style",k.textContent=hc,document.head.appendChild(k),document.body.appendChild(c);let P=c.querySelector("#urppp-pdf-mycoursetable"),S=c.querySelector("#urppp-pdf-page")||c;if(!P)throw c.remove(),new Error("无法建立原生课表捕获节点");return{stage:c,target:P,page:S,sourceHost:p}}a(Dp,"cloneNativePdfStage");var aa=0;function de(){return aa>0}a(de,"isNativePdfIsolationActive");function gc(p){return!p||p.tagName!=="STYLE"?!1:/^urppp(?:-|$)/.test(p.id||"")||p.hasAttribute("data-urppp-style")?!0:(p.textContent||"").includes("urppp-")}a(gc,"isUrpppOwnedStyle");function jp(){try{if(typeof unsafeWindow<"u"&&unsafeWindow)return unsafeWindow}catch{}return typeof window<"u"?window:null}a(jp,"defaultPage");function Op(p,n){let c=p&&typeof p.requestAnimationFrame=="function"?p.requestAnimationFrame.bind(p):typeof requestAnimationFrame=="function"?requestAnimationFrame:null;return c?c(n):setTimeout(n,0)}a(Op,"scheduleFrame");function fc(p={}){let n=p.document||(typeof document<"u"?document:null),c=p.page||jp();if(!n)throw new Error("原生 PDF 隔离缺少 document");let d=n.getElementById("mycoursetable");if(!d)throw new Error("当前页面没有课表节点");aa+=1;let u=[d,...d.querySelectorAll("*")],k=[],P=n.getElementById("soliderbox");P&&k.push(P);let S=d.parentElement;for(;S&&S!==n.documentElement;){let x=S.classList;(S.id==="page-content-template"||x&&(x.contains("page-content")||x.contains("profile-info-row")||x.contains("profile-info-value")))&&k.push(S),S=S.parentElement}let y=n.getElementById("page-content-template")||n.querySelector(".page-content");y&&!k.includes(y)&&k.push(y);let A=[...u,...k],f=A.map(x=>({element:x,style:x.getAttribute("style")})),w=Array.from(n.querySelectorAll("style")).filter(gc).map(x=>({style:x,disabled:x.sheet?x.sheet.disabled:!1,media:x.getAttribute("media")})),T=Array.from(d.querySelectorAll('[id^="urppp-"], [data-urppp]')),C=c&&c.divBuild,b=c&&c.__urpppOriginalDivBuild,m=!1,v=a(()=>{m||(m=!0,c&&c.divBuild===b&&typeof C=="function"&&(c.divBuild=C),f.forEach(({element:x,style:E})=>{x.isConnected&&(E===null?x.removeAttribute("style"):x.setAttribute("style",E))}),T.forEach(x=>x.removeAttribute("data-urppp-pdf-hidden")),w.forEach(({style:x,disabled:E,media:q})=>{try{q===null?x.removeAttribute("media"):x.setAttribute("media",q),x.sheet&&(x.sheet.disabled=E)}catch{}}),aa=Math.max(0,aa-1),Op(c,()=>{try{typeof p.onAfterRestore=="function"&&p.onAfterRestore()}catch{}}))},"restore");try{return w.forEach(({style:x})=>{try{x.setAttribute("media","not all"),x.sheet&&(x.sheet.disabled=!0)}catch{}}),A.forEach(x=>{!x.style||!x.style.length||Array.from(x.style).forEach(E=>{x.style.getPropertyPriority(E)==="important"&&(E==="height"&&x.matches("td, th")||x.style.removeProperty(E))})}),d.querySelectorAll("td").forEach(x=>{x.style.removeProperty("background"),x.style.removeProperty("background-color")}),y&&y.style.setProperty("position","relative","important"),d.style.setProperty("position","static","important"),d.querySelectorAll("td").forEach(x=>{x.style.setProperty("position","static","important")}),T.forEach(x=>{x.setAttribute("data-urppp-pdf-hidden","1"),x.style.setProperty("display","none","important")}),c&&typeof b=="function"&&(c.divBuild=b),v}catch(x){throw v(),x}}a(fc,"isolateScheduleForNativeExport");function Hp(p,n={}){return new Promise((c,d)=>{let u=n.page||jp(),k=u&&u.back,P=u&&u.html2canvas;if(!p||typeof k!="function"){d(new Error("教务原生导出依赖未就绪"));return}let S=null;try{S=fc(n)}catch(b){d(b);return}let y=0,A=!1,f=null,w=null,T=a(b=>{if(!A){A=!0,y&&clearTimeout(y),u&&f&&u.back===f&&(u.back=k),w&&u.html2canvas===w&&(u.html2canvas=P);try{S&&S()}catch{}b?d(b):c()}},"settle"),C=a(b=>T(b instanceof Error?b:new Error(String(b))),"fail");typeof P=="function"&&(w=a(function(){let b=P.apply(this,arguments);return b&&typeof b.catch=="function"&&b.catch(C),b},"scopedCanvas"),u.html2canvas=w),f=a(function(){try{return k.apply(this,arguments)}finally{setTimeout(()=>T(),0)}},"wrappedBack"),u.back=f,y=setTimeout(()=>{try{k.call(u)}catch{}C(new Error("原生 PDF 生成超时"))},n.timeoutMs||60*1e3),Op(u,()=>{try{p.click()}catch(b){C(b)}})})}a(Hp,"exportNativePdfIsolated");var Rp=`.urppp-private-value{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;font-style:inherit!important;line-height:inherit!important;letter-spacing:0!important;color:inherit!important}
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
`;var Up=`      /* 全局 */
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
`;var Wp=`/* Personal and resource schedule course cards. Keep table cells and table surfaces untouched. */
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
`;var Gp=`.urppp-export-wrap{position:relative!important;display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;margin-left:7px!important;font-weight:400!important;vertical-align:middle!important;white-space:nowrap!important}
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
`;var Jp=`/* Settings panel shell */
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
`;var Vp=`      /* 表格美化：业务表格、分页、公告卡片（table-beautify） */
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
`;var Yp=`      /* 导航：顶栏、侧栏、面包屑（navigation） */
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
`;var Qp=`/* ===== 插件弹窗统一进入动画：淡入+缩放 + 内容逐条浮现 ===== */
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
`;var Xp=`      /* 首页重构仪表板（dashboard） */
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
`;var Kp=`      /* 成绩分析面板（score-analysis） */
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
`;var Zp=`      /* ============================================================
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
`;function ti(){return{open:!1,mobileTab:"home",scoreAnalysisTab:"overview",profile:null,schedule:null,scores:null,catalog:null,occupancy:null,currentBuilding:null,loading:{profile:!1,schedule:!1,scores:!1,room:!1},roomError:"",roomDateOffset:0,selected:{passing:new Set,scheme:new Set},activeSchemeIdx:0,_schemeUserSelected:!1,viewWeek:0,weekLocked:!1,_termWeek:0,_termWeekResolved:!1,uiReady:!1}}a(ti,"createCleanModeState");function ei(p){p.profile=null,p.schedule=null,p.scores=null,p.catalog=null,p.occupancy=null,p._termWeekResolved=!1,p._schemeUserSelected=!1,p._schemeInited=!1}a(ei,"resetCleanModeData");function ri({state:p,deps:n}){async function c(u){if(!u&&p.catalog&&p.catalog.length||p.loading.room)return p.catalog;p.loading.room=!0;try{n.render()}catch{}try{p.catalog=await n.loadClassroomCatalog(),p.roomError=""}catch(k){p.catalog=p.catalog||[],p.roomError=String(k&&k.message||k),console.warn("[URP++] room catalog",k)}finally{p.loading.room=!1;try{n.scheduleRender()}catch{}}return p.catalog}a(c,"ensureRoomCatalogLoaded");async function d(u){u&&ei(p),p.loading.profile=p.loading.schedule=p.loading.scores=!0;try{let k=await n.ensureTermWeekResolved();!p.weekLocked&&k>=1&&(p.viewWeek=k)}catch{}if(n.render(),await Promise.all([(async()=>{try{p.profile&&!u||(p.profile=await n.loadProfile()),n.reconcileProfileAndScores()}catch(k){p.profile={name:"同学",majorPlan:"主修方案",majorGpa:"—",avatar:""},console.warn(k)}finally{p.loading.profile=!1,n.scheduleRender()}})(),(async()=>{try{p.schedule&&!u||(p.schedule=await n.loadSchedule())}catch(k){p.schedule={courses:[],error:String(k&&k.message||k)}}finally{if(p.loading.schedule=!1,!p.weekLocked){let k=n.getCurrentWeekNumber()||n.readRememberedTermWeek();k>=1&&(p.viewWeek=k)}n.scheduleRender()}})(),(async()=>{let k=null;try{p.scores&&!u||(p.scores=await n.loadScores(u)),k=p.scores,n.reconcileProfileAndScores(),k&&!k.error&&!k.evaluationReady&&n.enrichScoresWithEvaluation(k).then(()=>{p.scores===k&&(n.reconcileProfileAndScores(),n.scheduleRender())}).catch(P=>{console.warn("[URP++] attach evaluation",P)})}catch(P){p.scores={passing:[],schemes:[],error:String(P&&P.message||P)}}finally{p.loading.scores=!1,n.scheduleRender()}})()]),n.reconcileProfileAndScores(),!p.weekLocked){let k=n.getCurrentWeekNumber()||n.readRememberedTermWeek();k>=1&&(p.viewWeek=k)}n.scheduleRender()}return a(d,"loadAll"),{ensureRoomCatalogLoaded:c,loadAll:d}}a(ri,"createCleanModeDataLoader");var ar={autumn:{name:"秋季学期",weeks:20,start:"2026-08-31",end:"2027-02-20",events:[{t:"reg",name:"本科生新生报到",start:"2026-08-24",end:"2026-08-25"},{t:"reg",name:"在校生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"研究生新生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"在校本科补缓考",start:"2026-08-28",end:"2026-08-30"},{t:"term",name:"本科生开学典礼",start:"2026-09-01"},{t:"term",name:"研究生开学典礼",start:"2026-09-04"},{t:"term",name:"在校生正式行课",start:"2026-08-31",end:"2026-09-06"},{t:"holiday",name:"中秋节",start:"2026-09-25"},{t:"holiday",name:"国庆节假期",start:"2026-10-01",end:"2026-10-07"},{t:"sport",name:"校秋季田径运动会",start:"2026-10-23",end:"2026-10-24"},{t:"exam",name:"本科生期末集中考试周",start:"2027-01-04",end:"2027-01-15"},{t:"holiday",name:"寒假",start:"2027-01-18",end:"2027-02-20"},{t:"holiday",name:"春节",start:"2027-02-06"}]},spring:{name:"春季学期",weeks:18,start:"2027-03-01",end:"2027-07-03",events:[{t:"reg",name:"在校生报到",start:"2027-02-25",end:"2027-02-26"},{t:"term",name:"正式行课",start:"2027-03-01",end:"2027-03-07"},{t:"holiday",name:"清明节",start:"2027-04-05"},{t:"holiday",name:"劳动节假期",start:"2027-05-01",end:"2027-05-05"},{t:"holiday",name:"端午节",start:"2027-06-09"},{t:"exam",name:"期末集中考试",start:"2027-06-21",end:"2027-06-27"},{t:"term",name:"毕业典礼",start:"2027-06-25"},{t:"holiday",name:"暑假开始",start:"2027-07-04"}]}},xc={"2026-08-24":"农历七月十二","2026-08-25":"农历七月十三","2026-08-27":"农历七月十五","2026-08-28":"农历七月十六","2026-08-30":"农历七月十八","2026-08-31":"农历七月十九","2026-09-01":"农历七月二十","2026-09-04":"农历七月廿三","2026-09-25":"农历八月十五","2026-10-01":"农历八月廿一","2026-10-07":"农历八月廿七","2026-10-23":"农历九月十四","2026-10-24":"农历九月十五","2027-01-04":"农历冬月廿七","2027-01-15":"农历腊月初八","2027-01-18":"农历腊月十一","2027-02-06":"农历正月初一","2027-02-20":"农历正月十五","2027-02-25":"农历正月二十","2027-02-26":"农历正月廿一","2027-03-01":"农历正月廿四","2027-04-05":"农历二月廿九","2027-05-01":"农历三月廿五","2027-05-05":"农历三月廿九","2027-06-09":"农历五月初五","2027-06-21":"农历五月十七","2027-06-25":"农历五月廿一","2027-06-27":"农历五月廿三","2027-07-03":"农历五月廿九","2027-07-04":"农历六月初一"},_r={term:{color:"#44616f",label:"教学/开学"},reg:{color:"#8a74bd",label:"报到"},exam:{color:"#c08a3f",label:"考试周"},holiday:{color:"#d0716a",label:"假期"},sport:{color:"#778e63",label:"运动会"}};function ni(){let p=new Date,n=a(c=>String(c).padStart(2,"0"),"p");return`${p.getFullYear()}-${n(p.getMonth()+1)}-${n(p.getDate())}`}a(ni,"calToday");function co(p,n){return Math.round((Date.parse(n)-Date.parse(p))/864e5)}a(co,"calDayDiff");function uo(p,n){let c=co(ar[p].start,n);return c<0?0:Math.floor(c/7)+1}a(uo,"calWeekNo");function so(p){return xc[p]||""}a(so,"calLunar");function ai(p){return String(p||"").slice(5)}a(ai,"calYY");function yc(p){let n=p||ni(),[c,d]=n.split("-").map(Number);return d===8&&n>="2026-08-15"||d>=9||d<=2?"autumn":"spring"}a(yc,"calActiveTerm");function mo(p,n){let c=p&&ar[p]?p:"autumn",d=ar[c],u=n||ni(),k=d.events.map(f=>({e:f,d:co(u,f.start)})).filter(f=>f.d>=-0).sort((f,w)=>f.d-w.d)[0],P=k?co(u,k.e.start):null,S=uo(c,u),y=Math.max(0,Math.min(100,S/d.weeks*100)),A=u>=d.start;return{term:d,termId:c,next:k,daysLeft:P,weekNo:S,progress:y,started:A,today:u}}a(mo,"calStatus");function pi(p,n){let c=mo(p,n),d=c.next?_r[c.next.e.t].color:"#c9cdd4",u=c.term;return`<button type="button" class="uc-cal-summary" data-urppp-cal-open aria-label="打开校历时间线">
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
  </button>`}a(pi,"calendarSummaryHtml");function ii(p,n){let c=mo(p,n);return`<button type="button" class="uc-cal-summary uc-cal-summary-compact" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-c-dot" style="background:${c.next?_r[c.next.e.t].color:"#c9cdd4"}"></span>
    <span class="cal-c-count"><b>${c.daysLeft==null?"—":c.daysLeft}</b><em>天后</em></span>
    <span class="cal-c-info">
      <span class="cal-c-name">${c.next?c.next.e.name:"学期已结束"}</span>
      <span class="cal-c-sub">${c.started?`第 ${c.weekNo} 周`:"尚未开学"} · ${c.term.name}</span>
    </span>
    <span class="cal-c-prog"><span class="cal-c-bar"><i style="width:${c.progress}%"></i></span><span class="cal-c-week">本学期进度 ${Math.min(c.weekNo,c.term.weeks)}/${c.term.weeks} 周</span></span>
  </button>`}a(ii,"calendarSummaryCompactHtml");function oi(p,n){let c=mo(p,n),d=c.next?_r[c.next.e.t].color:"#c9cdd4",u=c.term,k=Object.keys(ar).map(w=>`<button type="button" class="cal-term${w===c.termId?" ac":""}" data-cal-term="${w}">${ar[w].name}</button>`).join(""),P=`<div class="cal-widget">
    <div class="cal-w-left">
      <div class="cal-w-label">下一个事件</div>
      <div class="cal-w-ev"><i style="background:${d}"></i><b>${c.next?c.next.e.name:"学期已结束"}</b></div>
      <div class="cal-w-sub">${c.next?c.next.e.start+(c.next.e.end&&c.next.e.end!==c.next.e.start?" ~ "+c.next.e.end:""):""}${c.next&&so(c.next.e.start)?" · "+so(c.next.e.start):""}</div>
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
  </div>`,S=u.events.slice().sort((w,T)=>w.start<T.start?-1:1),y={};S.forEach(w=>{(y[w.start.slice(0,7)]=y[w.start.slice(0,7)]||[]).push(w)});let A=a(w=>w===c.today?" cal-today":"","todayFlag"),f=Object.keys(y).map(w=>{let[,T]=w.split("-");return`<div class="cal-mon">
      <div class="cal-mon-label">${Number(T)} 月</div>
      <div class="cal-mon-items">${y[w].map(C=>{let b=_r[C.t].color,m=C.end&&C.end!==C.start?"~"+ai(C.end):"",v=uo(c.termId,C.start)>0?`第 ${uo(c.termId,C.start)} 周`:"开学前";return`<div class="cal-ev${A(C.start)}">
          <span class="cal-ev-dot" style="background:${b}"></span>
          <span class="cal-ev-date">${ai(C.start)}${m||""}<em>${so(C.start)||"&nbsp;"}</em></span>
          <span class="cal-ev-name">${C.name}</span>
          <span class="cal-ev-tag" style="color:${b};background:${b}1a">${_r[C.t].label}</span>
          <span class="cal-ev-wk">${v}</span>
        </div>`}).join("")}</div>
    </div>`}).join("");return`<div class="cal-modal-wrap">
    <div class="cal-modal-top">
      <span class="cal-modal-title">校历时间线</span>
      <span class="cal-right"><span class="cal-term-pills">${k}</span><button type="button" class="cal-close" aria-label="关闭">✕</button></span>
    </div>
    ${P}
    <div class="cal-timeline">${f}</div>
  </div>`}a(oi,"calendarModalHtml");function si(p,n){let c=typeof document<"u"?document:null;if(!c)return;lo();let d=p&&ar[p]?p:yc(n),u=c.createElement("div");u.id="urppp-cal-modal",u.innerHTML=`<div class="cal-overlay"></div>
    <div class="cal-dialog"><div class="cal-body">${oi(d,n)}</div></div>`,c.documentElement.appendChild(u),setTimeout(()=>u.classList.add("open"),20),u.querySelector(".cal-overlay").addEventListener("click",()=>lo()),u.addEventListener("click",k=>{let P=k.target;if(P&&P.closest&&P.closest(".cal-close")){lo();return}let S=P&&P.closest?P.closest("[data-cal-term]"):null;if(S){let y=u.querySelector(".cal-body");y&&(y.innerHTML=oi(S.dataset.calTerm,n)),u.querySelectorAll("[data-cal-term]").forEach(A=>A.classList.toggle("ac",A.dataset.calTerm===S.dataset.calTerm))}})}a(si,"openCalendarModal");function lo(){let p=typeof document<"u"?document:null;if(!p)return;let n=p.getElementById("urppp-cal-modal");n&&(n.classList.remove("open"),n.classList.add("closing"),setTimeout(()=>{n.remove()},200))}a(lo,"closeCalendarModal");function li(p,n){let c=p||(typeof document<"u"?document:null);c&&c.addEventListener("click",d=>{let u=d.target;u&&u.closest&&u.closest("[data-urppp-cal-open]")&&(d.preventDefault(),d.stopPropagation(),si())})}a(li,"bindCalendarOpen");var oa=!1;function ho(){let p=typeof document<"u"?document:null;if(!p||oa)return oa;try{let n=p.createElement("style");if(n&&n.id!==void 0){n.id="urppp-cal-style",n.textContent=`
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
  `,n.id="urppp-cal-style";let c=p.head||p.documentElement;c&&c.appendChild(n),oa=!0}}catch{}return oa}a(ho,"ensureCalendarStyle");function ci(){let p=typeof document<"u"?document:null;if(!p)return;let n=p.getElementById("urppp-nav-theme")||p.querySelector("#navbar .navbar-header")||p.getElementById("navbar"),c=p.getElementById("urppp-nav-clean"),d=p.getElementById("urppp-nav-cal");if(!n&&!c)return;let u=c&&c.parentElement||n;d&&d.parentElement===u||(d&&d.remove(),d=p.createElement("button"),d.type="button",d.id="urppp-nav-cal",d.title="校历时间线",d.setAttribute("aria-label","校历时间线"),d.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg><span>校历</span>',Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none",margin:"0 0 0 8px","vertical-align":"middle"}).forEach(([k,P])=>d.style.setProperty(k,P,"important")),d.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation(),si()}),c&&c.parentElement?c.after(d):u&&u.appendChild(d))}a(ci,"mountCalendarButton");function di(){let p=typeof document<"u"?document:null;if(!p)return;let n=p.getElementById("urppp-nav-cal");n&&n.remove()}a(di,"removeCalendarButton");function ui({state:p,deps:n}){let c=0,d={gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)"};function u(x,E){let q=x||n.summarizeCourses([]);return`<div class="uc-metrics">${[["TotalCredit","总学分",q.totalCredit],["AvgScore","平均成绩",q.avgScore],["AvgGpa","平均绩点",q.avgGpa],["RequiredCredit","必修学分",q.requiredCredit],["RequiredAvg","必修平均",q.requiredAvg],["RequiredGpa","必修绩点",q.requiredGpa]].map(([L,O,M])=>{let H=n.classifyPrivacyLabel(O)||"grade",G=E&&n.DIRECT_EDIT_LABELS[E+L]?` data-urppp-edit-key="${E+L}"`:"";return`<div class="uc-metric"><em>${O}</em><b data-urppp-private="${H}"${G}>${M}</b></div>`}).join("")}</div>`}a(u,"metricHtml");function k(){let x=p.scores;if(!x||x.error)return`<div class="uc-sa-empty">${n.escapeHtml(x&&x.error||"暂无成绩数据")}</div>`;let E=null;try{E=n.analyzeScores({scorePack:x,profile:p.profile})}catch{}if(!E||E.empty)return'<div class="uc-sa-empty">暂无可用成绩数据，请先查询成绩后再试。</div>';let q=typeof n.scoreChartLayout=="function"?n.scoreChartLayout():null;return`<div class="uc-sa-charts">
      <div class="uc-sa-chart-card"><h5>学期趋势</h5><div class="uc-sa-chart-scroll">${n.trendChartSvg({trend:E.trend,palette:n.scoreChartPalette||d,layout:q})}</div></div>
      <div class="uc-sa-chart-card"><h5>成绩分段分布</h5><div class="uc-sa-chart-scroll">${n.bandsChartSvg({bands:E.bands,palette:n.scoreChartPalette||d,layout:q})}</div></div>
    </div>
    <div class="uc-sa-more-row"><a class="uc-sa-more" data-href="/student/integratedQuery/scoreQuery/allPassingScores/index?urppp=sa">点击此处跳转到详细分析界面 →</a></div>`}a(k,"analysisHtml");function P(x){let E=!!n.isCleanAnalysisDirect(),q=p.scoreAnalysisTab==="analysis";return E?`<div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
  <div class="uc-bd">
    <div class="uc-sa-pane">${x}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis">${k()}</div>
  </div>`:`<div class="uc-hd uc-hd-tabs" role="tablist">
    <button type="button" class="uc-sa-tab${q?"":" ac"}" data-sa-tab="overview">成绩总览</button>
    <button type="button" class="uc-sa-tab${q?" ac":""}" data-sa-tab="analysis">成绩分析</button>
  </div>
  <div class="uc-bd">
    <div class="uc-sa-pane"${q?" hidden":""}>${x}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis"${q?"":" hidden"}>${k()}</div>
  </div>`}a(P,"scoreSectionHtml");function S(){try{if(window.matchMedia&&window.matchMedia("(max-width:900px)").matches)return 40}catch{}return 56}a(S,"getScheduleRowHeight");function y(x){let E=n.getViewWeekNumber(),q=S(),I=Math.max(q-4,28),L=(x||[]).map(H=>Object.assign({},H,{thisWeek:n.weekBitActive(H.classWeek,E)||!H.classWeek&&String(H.week||"").indexOf(String(E))>=0,span:Math.max(1,H.span||1),color:H.color||n.courseColor(H.name)})),O={};L.forEach(H=>{let G=H.day+"_"+H.section;(O[G]||(O[G]=[])).push(H)});let M=`<div class="uc-week" data-urppp-private="schedule" data-week="${E}" data-row="${q}">`;M+='<div class="uc-week-head"><div class="h"></div>';for(let H=0;H<7;H++)M+=`<div class="h">${n.DAY_NAMES[H]}</div>`;M+='</div><div class="uc-week-body">',M+='<div class="uc-sec-col">';for(let H=1;H<=12;H++)M+=`<div class="s" style="height:${q}px">${H}</div>`;M+="</div>";for(let H=0;H<7;H++){M+=`<div class="uc-day-col" data-day="${H}" style="height:${q*12}px">`;for(let G=1;G<=12;G++)M+=`<div class="uc-grid-cell" data-sec="${G}" style="top:${(G-1)*q}px;height:${I}px"></div>`;M+=`<div class="uc-part-line" style="top:${4*q-2}px"></div>`,M+=`<div class="uc-part-line" style="top:${9*q-2}px"></div>`;for(let G=1;G<=12;G++){let U=(O[H+"_"+G]||[]).slice().sort((ft,Z)=>ft.thisWeek!==Z.thisWeek?(Z.thisWeek?1:0)-(ft.thisWeek?1:0):(Z.span||1)-(ft.span||1));if(!U.length)continue;let it=U.filter(ft=>ft.thisWeek)[0]||U[0],mt=U.filter(ft=>ft!==it),V=it.span,Q=(G-1)*q+1,ot=V*q-6,X=it.thisWeek?8:2,ct=it.thisWeek?`--uc-course-color:${it.color};top:${Q}px;height:${ot}px;z-index:${X};background:${it.color}26;border-color:${it.color}80`:`--uc-course-color:${it.color};top:${Q}px;height:${ot}px;z-index:${X};background:color-mix(in srgb,${it.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`,rt=mt.length?`<span class="uc-badge">+${mt.length}</span>`:"",st=n.escapeHtml(JSON.stringify({name:it.name,teacher:it.teacher,place:it.place,week:it.week,day:it.day,section:it.section,span:it.span,thisWeek:it.thisWeek,others:mt.map(ft=>({name:ft.name,teacher:ft.teacher,place:ft.place,week:ft.week,thisWeek:ft.thisWeek,section:ft.section,span:ft.span}))}));M+=`<div class="uc-lesson${it.thisWeek?"":" is-fade"}" style="${ct}" data-course='${st}'>
          <b>${n.escapeHtml(it.name)}</b>
          <i>${n.escapeHtml([it.place,it.week].filter(Boolean).join(" · "))}</i>
          ${rt}
        </div>`}M+="</div>"}return M+="</div></div>",M}a(y,"renderScheduleBoard");function A(){try{if(p.loading&&p.loading.schedule)return"";let x=n.calVacation?n.calVacation():"term";if(x==="term"||n.getViewWeekNumber()!==0)return"";let E={summer:{title:"放暑假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'},winter:{title:"放寒假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>'},springfestival:{title:"春节快乐！",sub:"",svg:'<svg viewBox="0 0 72 72"><rect x="16" y="16" width="40" height="40" rx="7" fill="#b71c1c" stroke="#f5b301" stroke-width="2.4" transform="rotate(45 36 36)"/><path d="M36 16v40M16 36h40" stroke="#f5b301" stroke-width="1" opacity=".5"/><path d="M24 24l24 24M48 24L24 48" stroke="#f5b301" stroke-width="1" opacity=".35"/><text x="36" y="47" text-anchor="middle" font-size="30" font-weight="900" fill="#ffd54f" font-family="Noto Serif SC,STKaiti,KaiTi,serif" transform="rotate(180 36 36)">福</text></svg>',couplet:{scroll:"万象纳祥",right:"望江听雨华西看杏海纳百川享人间烟火",left:"江安漫步眉山泛舟有容乃大过锦绣新年"}}}[x];if(!E)return"";if(x==="springfestival"&&E.couplet){let I=E.couplet;return`<div class="uc-schedule-mask uc-mask-springfestival">
          <span class="uc-mask-scroll">${I.scroll}</span>
          <span class="uc-mask-cl uc-mask-cl-r">${I.right}</span>
          <span class="uc-mask-cl uc-mask-cl-l">${I.left}</span>
          <span class="uc-mask-ico">${E.svg}</span>
          <span class="uc-mask-txt"><b>${E.title}</b></span>
        </div>`}let q=E.sub?`<i>${E.sub}</i>`:"";return`<div class="uc-schedule-mask uc-mask-${x}"><span class="uc-mask-ico">${E.svg}</span><span class="uc-mask-txt"><b>${E.title}</b>${q}</span></div>`}catch{return""}}a(A,"vacationMark");function f(){return`<div class="uc-services">${[{t:"空闲教室",i:"room",a:"room"},{t:"教学评估",i:"eval",h:"/student/teachingEvaluation/newEvaluation/index"},{t:"培养方案",i:"plan",h:"/student/integratedQuery/planCompletion/index"},{t:"补办学生证",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082"},{t:"免修申请",i:"apply",h:"/student/personalManagement/individualApplication/exemptionApplication/index"},{t:"替代课申请",i:"apply",h:"/student/personalManagement/personalApplication/curriculumReplacement/index"},{t:"火车票优惠卡",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083"}].map(E=>`
      <button type="button" class="uc-svc" data-action="${E.a||""}" data-href="${E.h||""}">
        ${n.ico(E.i)}<strong>${E.t}</strong>
      </button>`).join("")}</div>`}a(f,"servicesHtml");function w(){let x=n.personalizedProfile(p.profile||{}),E=p.schedule&&p.schedule.courses||[],q=p.scores&&p.scores.passing&&p.scores.passing[0]||{summary:n.summarizeCourses([])},I=p.scores&&p.scores.schemes||[];p.scores&&p.scores.majorIdx!=null&&p._schemeInited!==!0&&(p.activeSchemeIdx=p.scores.majorIdx||0,p._schemeInited=!0);let L=I[p.activeSchemeIdx]||I[0]||{summary:n.summarizeCourses([]),title:"方案成绩"},O=x.avatar?`<img src="${n.escapeHtml(x.avatar)}" alt="">`:`<span>${n.escapeHtml((x.name||"同")[0])}</span>`,M=p.loading.scores?'<div class="uc-loading">成绩加载中</div>':p.scores&&p.scores.error?`<div class="uc-empty">${n.escapeHtml(p.scores.error)}</div>`:`<div class="uc-score-grid">
            <div class="uc-score-pane" data-score="passing"><h5>全部及格成绩</h5>${u(q.summary,"passing")}</div>
            <div class="uc-score-pane" data-score="scheme"><h5>${n.escapeHtml((L.title||"方案成绩").split(/通过|获得|不通过/)[0].trim()||"方案成绩")}</h5>${u(L.summary,"scheme")}</div>
          </div>`,H=P(M);return`<div class="uc-desktop">
      <div class="uc-col">
        <div class="uc-card uc-profile-card"><div class="uc-bd"><div class="uc-profile">
          <div class="uc-avatar" data-urppp-private="avatar">${O}</div>
          <div>
            <div class="uc-name" data-urppp-private="name">${n.escapeHtml(x.name||"同学")}</div>
            <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${n.escapeHtml(x.majorPlan||"—")}</span></div>
            <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${n.escapeHtml(String(x.majorGpa||"—"))}</span></div>
          </div>
        </div>${(()=>{try{return pi()}catch{return""}})()}</div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${n.getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${E.length?E.length+" 课次":p.schedule&&p.schedule.error||""}</span>
            </div>
          </div>
          <div class="uc-bd"><div class="uc-schedule-wrap">${p.loading.schedule?'<div class="uc-loading">课表加载中</div>':E.length?y(E):`<div class="uc-empty">${n.escapeHtml(p.schedule&&p.schedule.error||"暂无课表数据")}</div>`}${A()}</div></div>
        </div>
      </div>
      <div class="uc-col">
        <div class="uc-card">
          ${H}
        </div>
        <div class="uc-card services">
          <div class="uc-hd">服务</div>
          <div class="uc-bd">${f()}</div>
        </div>
      </div>
    </div>`}a(w,"renderDesktop");function T(){let x=n.personalizedProfile(p.profile||{}),E=p.schedule&&p.schedule.courses||[],q=p.scores&&p.scores.passing&&p.scores.passing[0]||{summary:n.summarizeCourses([])},I=(p.scores&&p.scores.schemes||[])[p.activeSchemeIdx]||{summary:n.summarizeCourses([])},L=x.avatar?`<img src="${n.escapeHtml(x.avatar)}" alt="">`:`<span>${n.escapeHtml((x.name||"同")[0])}</span>`;if(p.mobileTab==="scores"){let O=`<div class="uc-score-grid uc-score-grid-mobile">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${u(q.summary,"passing")}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${u(I.summary,"scheme")}</div>
      </div>`;return`<div class="uc-mobile"><div class="uc-card">${P(O)}</div></div>`}return p.mobileTab==="room"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${C()}</div></div></div>`:p.mobileTab==="more"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${f()}</div></div></div>`:`<div class="uc-mobile">
      <div class="uc-card uc-profile-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${L}</div>
        <div><div class="uc-name" data-urppp-private="name">${n.escapeHtml(x.name||"同学")}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${n.escapeHtml(x.majorPlan||"—")}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${n.escapeHtml(String(x.majorGpa||"—"))}</span></div></div>
      </div>${(()=>{try{return ii()}catch{return""}})()}</div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${n.getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd"><div class="uc-schedule-wrap">${p.loading.schedule?'<div class="uc-loading">课表加载中</div>':E.length?y(E):`<div class="uc-empty">${n.escapeHtml(p.schedule&&p.schedule.error||"暂无课表数据")}</div>`}${A()}</div></div></div>
    </div>`}a(T,"renderMobile");function C(){if(p.loading.room)return'<div class="uc-loading">教学楼加载中</div>';let x=p.catalog||[];return x.length?x.slice().sort((q,I)=>(/江安/.test(q.campus)?-1:0)-(/江安/.test(I.campus)?-1:0)).map(q=>`
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${n.escapeHtml(q.campus)}</div>
        <div class="uc-build-grid">
          ${q.buildings.map(I=>`<button type="button" data-build-path="${n.escapeHtml(I.path)}" data-cn="${n.escapeHtml(I.campusNumber||"")}" data-bn="${n.escapeHtml(I.buildingNumber||"")}">${n.escapeHtml(I.name)}</button>`).join("")}
        </div>
      </div>`).join(""):`<div class="uc-empty">${n.escapeHtml(p.roomError||"未读到教学楼列表")}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`}a(C,"roomPickerHtml");function b(x,E){if(!x||!x.rooms||!x.rooms.length)return'<div class="uc-empty">该楼暂无教室占用数据</div>';let q='<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';for(let M=1;M<=12;M++)q+=`<th class="sec">${M}</th>`;q+="</tr>";let I=x.rooms.map(M=>{let H=`<tr><th class="sticky">${n.escapeHtml(M.name)}</th><th class="sticky2">${n.escapeHtml(M.seats)}</th>`;for(let G=1;G<=12;G++){let U=(M.slots||[]).find(et=>et.section===G)||{busy:!1};if(U.busy){let et=U.reason||U.typeLabel||"占用",it=U.typeLabel||n.occupancyTypeLabel({occupancymoduleId:U.module}),mt=U.displayChar||n.firstContentChar(et)||n.firstContentChar(it)||"占",V=Object.assign({},U.detail||{room:M.name,section:G,reason:et},{reason:et,typeLabel:it,contentName:U.contentName||U.detail&&U.detail.contentName||""}),Q=n.escapeHtml(JSON.stringify(V));H+=`<td><button type="button" class="uc-slot busy ${n.occupancyKindClass(it)}" data-occ='${Q}' title="${n.escapeHtml(M.name)} 第${G}节 · ${n.escapeHtml(et)}">${n.escapeHtml(mt)}</button></td>`}else H+=`<td><div class="uc-slot free" title="${n.escapeHtml(M.name)} 第${G}节 · 空闲"></div></td>`}return H+"</tr>"}).join(""),L=Number(x.dateOffset!=null?x.dateOffset:p.roomDateOffset)||0,O=a((M,H)=>`<button type="button" class="uc-btn${L===M?" primary":""}" data-room-day="${M}">${H}</button>`,"dayBtn");return`
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${n.escapeHtml(E||"")}</div>
          <div class="uc-sub">${n.escapeHtml(x.dateLabel||"")}${x.jxzc?" · 教学第"+x.jxzc+"周":""}</div>
          <div class="uc-room-days">
            ${O(0,"今天")}
            ${O(1,"明天")}
            ${O(2,"后天")}
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
      <div class="uc-occ"><table class="uc-occ-table">${q}${I}</table></div>`}a(b,"occupancyHtml");function m(){let x=n.ensureRoot(),E=x.querySelector("#uc-body");n.getViewWeekNumber();let q=typeof window<"u"&&window.matchMedia?window.matchMedia:null,I=q&&q("(max-width:900px)").matches,L=!p.uiReady;E.innerHTML=I?T():w(),L?(p.uiReady=!0,x.classList.remove("uc-settled"),clearTimeout(x.__ucSettleTimer),x.__ucSettleTimer=setTimeout(()=>{p.open&&x.classList.add("uc-settled")},480)):x.classList.add("uc-settled"),n.bindUI(E),n.applyPersonalDisplay(E)}a(m,"render");function v(){if(!p.open||c)return;let x=a(()=>{c=0,p.open&&m()},"run"),E=typeof requestAnimationFrame=="function"?requestAnimationFrame:null;c=E?E(x):setTimeout(x,0)}return a(v,"scheduleRender"),{analysisHtml:k,metricHtml:u,occupancyHtml:b,render:m,renderScheduleBoard:y,roomPickerHtml:C,scheduleRender:v,scoreSectionHtml:P}}a(ui,"createCleanModeRenderer");function mi({state:p,deps:n}){function c(w,T){return!w||(w.__urpppCleanUiBindings||(w.__urpppCleanUiBindings=new Set),w.__urpppCleanUiBindings.has(T))?!1:(w.__urpppCleanUiBindings.add(T),!0)}a(c,"markCleanUiBound");function d(w){if(!w)return;try{n.bindScheduleExportHosts(w)}catch(C){console.warn("[URP++] schedule export menu",C)}w.querySelectorAll("[data-score]").forEach(C=>{c(C,"score")&&C.addEventListener("click",()=>S(C.getAttribute("data-score")))}),w.querySelectorAll("[data-sa-tab]").forEach(C=>{c(C,"saTab")&&C.addEventListener("click",()=>{p.scoreAnalysisTab=C.getAttribute("data-sa-tab")==="analysis"?"analysis":"overview",n.render()})}),w.querySelectorAll("[data-href]").forEach(C=>{c(C,"href")&&C.addEventListener("click",b=>{let m=C.getAttribute("data-href");m&&(b.preventDefault(),n.closeCleanMode(),location.href=m)})}),w.querySelectorAll("[data-eval-url]").forEach(C=>{c(C,"eval")&&C.addEventListener("click",b=>{let m=C.getAttribute("data-eval-url");m&&(b.preventDefault(),b.stopPropagation(),n.closeCleanMode(),location.href=m)})}),w.querySelectorAll('[data-action="room"]').forEach(C=>{c(C,"room")&&C.addEventListener("click",()=>y())}),w.querySelectorAll("[data-room-reload]").forEach(C=>{c(C,"roomReload")&&C.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),n.ensureRoomCatalogLoaded(!0)})}),w.querySelectorAll("[data-build-path]").forEach(C=>{c(C,"building")&&C.addEventListener("click",async()=>{let b=C.getAttribute("data-build-path"),m=(C.textContent||"").trim(),v=C.getAttribute("data-cn")||"",x=C.getAttribute("data-bn")||"",E=C.closest("#uc-room-panel")||C.closest("#uc-modal-body")||null;p.roomDateOffset=0,await f({path:b,name:m,campusNumber:v,buildingNumber:x,dateOffset:0},m,E)})}),w.querySelectorAll("[data-room-day]").forEach(C=>{c(C,"roomDay")&&C.addEventListener("click",async b=>{b.preventDefault(),b.stopPropagation();let m=parseInt(C.getAttribute("data-room-day")||"0",10)||0;if(!p.currentBuilding)return;p.roomDateOffset=m;let v=Object.assign({},p.currentBuilding,{dateOffset:m}),x=C.closest("#uc-room-panel")||C.closest("#uc-modal-body")||null;await f(v,v.name||"",x)})});let T=w.querySelector("#uc-room-back");T&&(T.onclick=()=>{p.occupancy=null,p.currentBuilding=null;let C=T.closest("#uc-room-panel")||document.querySelector("#uc-room-panel")||document.querySelector("#uc-modal-body");C&&C.id==="uc-modal-body"||C&&C.id==="uc-room-panel"?(C.innerHTML=n.roomPickerHtml(),d(C)):n.render()}),w.querySelectorAll(".uc-slot.busy[data-occ]").forEach(C=>{c(C,"occupancy")&&C.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();try{let m=JSON.parse(C.getAttribute("data-occ")||"{}");k("占用详情",`
            <div class="uc-occ-detail">
              <div class="uc-name">${n.escapeHtml(m.room||"")}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${n.escapeHtml(String(m.section||m.start||""))}${m.span>1?"-"+(Number(m.start||m.section)+Number(m.span)-1):""}节</div>
              <div class="uc-sub">占用类型：${n.escapeHtml(m.typeLabel||m.reason||"占用")}</div>
              <div class="uc-sub">具体内容：${n.escapeHtml(m.contentName||m.reason||"—")}</div>
              ${m.teacher?`<div class="uc-sub">教师：${n.escapeHtml(m.teacher)}</div>`:""}
              ${m.weeks?`<div class="uc-sub">周次：${n.escapeHtml(m.weeks)}</div>`:""}
              ${m.courseNo?`<div class="uc-sub">课程号：${n.escapeHtml(m.courseNo)}</div>`:""}
            </div>
          `,"",{stack:!0})}catch{}})}),w.querySelectorAll(".uc-lesson[data-course]").forEach(C=>{c(C,"course")&&C.addEventListener("click",b=>{b.stopPropagation();try{let m=JSON.parse(C.getAttribute("data-course")||"{}"),v=`第${m.section||"?"}${m.span>1?"-"+(Number(m.section)+Number(m.span)-1):""}节`,x=(m.others||[]).map(E=>`<div class="uc-course-sub ${E.thisWeek?"":"is-fade"}">
              <div class="uc-cd-name">${n.escapeHtml(E.name||"")}</div>
              <div class="uc-cd-meta">${n.escapeHtml([E.place,E.week,E.teacher].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${E.thisWeek?"当前周有课":"当前周无课"}</div>
            </div>`).join("");k("课程详情",`
            <div class="uc-course-detail">
              <div class="uc-cd-name">${n.escapeHtml(m.name||"")}</div>
              <div class="uc-cd-meta">${n.escapeHtml([m.place,m.teacher,m.week].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${m.thisWeek?"当前周有课":"当前周无课"} · ${n.escapeHtml(v)} · ${n.escapeHtml(n.DAY_NAMES[m.day]||"")}</div>
            </div>
            ${x?'<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>'+x:""}
          `,"")}catch{}})}),w.querySelectorAll("[data-week-delta]").forEach(C=>{c(C,"weekDelta")&&C.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();let m=parseInt(C.getAttribute("data-week-delta")||"0",10)||0,v=p.schedule&&p.schedule.courses||[],x=n.inferMaxWeek(v),E=n.getViewWeekNumber();p.weekLocked=!0,p.viewWeek=Math.min(x,Math.max(1,E+m)),n.render();let q=document.querySelector("#urppp-clean-root .uc-week-label");q&&(q.classList.remove("uc-pop"),q.offsetWidth,q.classList.add("uc-pop"))})}),w.querySelectorAll("[data-week-reset]").forEach(C=>{c(C,"weekReset")&&C.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),p.weekLocked=!1;let m=n.getCurrentWeekNumber()||p._termWeek||1;p.viewWeek=m,n.render();let v=document.querySelector("#urppp-clean-root .uc-week-label");v&&(v.classList.remove("uc-pop"),v.offsetWidth,v.classList.add("uc-pop"))})})}a(d,"bindUI");let u=[];function k(w,T,C,b){b=b||{};let m=n.ensureRoot(),v=m.querySelector("#uc-mask"),x=m.querySelector("#uc-modal");b.stack&&x.classList.contains("open")?u.push({title:m.querySelector("#uc-modal-title").textContent,body:m.querySelector("#uc-modal-body").innerHTML,ft:m.querySelector("#uc-modal-ft").innerHTML}):b.stack||(u.length=0),v.classList.add("open"),x.classList.add("open"),m.querySelector("#uc-modal-title").textContent=w,m.querySelector("#uc-modal-body").innerHTML=T,m.querySelector("#uc-modal-ft").innerHTML=C||"",d(m.querySelector("#uc-modal-body")),d(m.querySelector("#uc-modal-ft")),n.applyPersonalDisplay(m.querySelector("#uc-modal"))}a(k,"openModal");function P(){let w=n.rootEl();if(w){if(u.length){let T=u.pop();w.querySelector("#uc-modal-title").textContent=T.title,w.querySelector("#uc-modal-body").innerHTML=T.body,w.querySelector("#uc-modal-ft").innerHTML=T.ft||"",d(w.querySelector("#uc-modal-body")),d(w.querySelector("#uc-modal-ft"));return}w.querySelector("#uc-mask").classList.remove("open"),w.querySelector("#uc-modal").classList.remove("open")}}a(P,"closeModal");function S(w){let T=p.scores&&p.scores.passing&&p.scores.passing[0]||{courses:[],summary:n.summarizeCourses([])},C=p.scores&&p.scores.schemes||[];w==="scheme"&&p.scores&&p.scores.majorIdx!=null&&p._schemeInited!==!0&&(p.activeSchemeIdx=p.scores.majorIdx||0,p._schemeInited=!0);let b=C[p.activeSchemeIdx]||C[0]||{courses:[],summary:n.summarizeCourses([]),title:"方案成绩"},m=w==="scheme"?b:T,v=w==="scheme"?"scheme":"passing";p.selected[v]||(p.selected[v]=new Set);let x=w==="scheme"&&C.length>1?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${C.map((Z,dt)=>`<button type="button" class="uc-btn ${dt===p.activeSchemeIdx?"primary":""}" data-scheme-idx="${dt}"><span data-urppp-private="organization">${n.escapeHtml((Z.title||"方案").slice(0,28))}</span></button>`).join("")}</div>`:"",E=a(Z=>{let dt=!!(Z&&(Z.unevaluated||n.isUnevaluatedScore(Z.score))),kt=n.scoreToNumber(Z&&Z.score),wt="";dt?wt=kt!=null&&kt<60?"uneval-fail":"uneval":kt!=null?wt=kt>=60?"pass":"fail":/不及格|不合格|不通过/.test(String(Z&&Z.score||""))?wt="fail":Z&&Z.score&&(wt="pass");let Ct=n.escapeHtml(Z&&Z.score||"—"),N=dt?Z.evalUrl||"/student/teachingEvaluation/newEvaluation/index":"";return N?`<span class="uc-score-cell ${wt}" data-eval-url="${n.escapeHtml(N)}" title="未评教，点击前往评教">${Ct}</span>`:`<span class="uc-score-cell ${wt}">${Ct}</span>`},"scoreCellHtml"),q=(m.courses||[]).map((Z,dt)=>{let kt=p.selected[v].has(dt),wt=n.isValidOfficialGpa(Z.officialGpa)?Z.officialGpa:n.scoreToGpa(Z.score),Ct=!!(Z.unevaluated||n.isUnevaluatedScore(Z.score));return`<tr class="${kt?"is-on":""}${Ct?" is-uneval":""}" data-idx="${dt}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${kt?"✓":""}</span><span class="uc-cname">${n.escapeHtml(Z.name)}</span></td>
        <td><span class="uc-attr-pill">${n.escapeHtml(Z.attr||"—")}</span></td>
        <td data-urppp-private="credit">${Z.credit}</td>
        <td data-urppp-private="grade">${E(Z)}</td>
        <td data-urppp-private="gpa">${Ct||wt==null?"—":wt}</td>
      </tr>`}).join("");k(w==="scheme"?"方案成绩 · "+(b.title||""):"全部及格成绩",`
      ${x}${n.metricHtml(m.summary,w==="scheme"?"scheme":"passing")}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${q||'<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`,'<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>');let I=document.querySelector("#uc-modal-title");I&&(w==="scheme"?I.setAttribute("data-urppp-private","organization"):I.removeAttribute("data-urppp-private"),n.applyPersonalDisplay(I.parentElement||I));let L=document.querySelector("#uc-modal-body"),O=document.getElementById("uc-calc"),M=document.getElementById("uc-score-table"),H=document.getElementById("uc-score-wrap"),G=document.getElementById("uc-select-box"),U=a(()=>{M.querySelectorAll("tbody tr[data-idx]").forEach(kt=>{let wt=parseInt(kt.getAttribute("data-idx"),10),Ct=p.selected[v].has(wt);kt.classList.toggle("is-on",Ct);let N=kt.querySelector(".uc-selmark");N&&(N.textContent=Ct?"✓":"")});let Z=[];p.selected[v].forEach(kt=>{m.courses[kt]&&Z.push(m.courses[kt])});let dt=n.summarizeCoursesPreferOfficial(Z);O&&(O.className="uc-calc",O.innerHTML=Z.length?`已选 <b>${Z.length}</b> 门 · 学分 <b data-urppp-private="credit">${dt.totalCredit}</b> · 均分 <b data-urppp-private="grade">${dt.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${dt.avgGpa}</b>`:"已选 0 门")},"paint"),et=a((Z,dt)=>{dt===!0?p.selected[v].add(Z):dt===!1||p.selected[v].has(Z)?p.selected[v].delete(Z):p.selected[v].add(Z)},"toggleIdx"),it=!1;M.querySelectorAll("tbody tr[data-idx]").forEach(Z=>{Z.addEventListener("click",dt=>{if(it){it=!1;return}let kt=parseInt(Z.getAttribute("data-idx"),10);et(kt),U()})});let mt=!1,V=0,Q=0,ot=null,X=a(()=>Array.from(M.querySelectorAll("tbody tr[data-idx]")),"rowsEls"),ct=a((Z,dt)=>{if(!G||!H)return{left:0,top:0,right:0,bottom:0,w:0,h:0};let kt=H.getBoundingClientRect(),wt=Math.min(V,Z),Ct=Math.min(Q,dt),N=Math.max(V,Z),Y=Math.max(Q,dt),tt=N-wt,bt=Y-Ct,ht=wt-kt.left+H.scrollLeft,zt=Ct-kt.top+H.scrollTop;return G.style.display=tt>3||bt>3?"block":"none",G.style.left=ht+"px",G.style.top=zt+"px",G.style.width=tt+"px",G.style.height=bt+"px",{left:wt,top:Ct,right:N,bottom:Y,w:tt,h:bt}},"placeBox"),rt=a(Z=>{if(!mt)return;Z.preventDefault();let dt=ct(Z.clientX,Z.clientY);dt.w<=3&&dt.h<=3||(p.selected[v]=new Set(ot),X().forEach(kt=>{let wt=kt.getBoundingClientRect();if(!!(wt.right<dt.left||wt.left>dt.right||wt.bottom<dt.top||wt.top>dt.bottom))return;let N=parseInt(kt.getAttribute("data-idx"),10);ot.has(N)?p.selected[v].delete(N):p.selected[v].add(N)}),U())},"onMoveSel"),st=a(Z=>{let dt=Math.abs(Z.clientX-V)>3||Math.abs(Z.clientY-Q)>3;mt=!1,G&&(G.style.display="none"),document.removeEventListener("mousemove",rt,!0),document.removeEventListener("mouseup",st,!0),dt&&(it=!0),U()},"onUpSel");H.addEventListener("mousedown",Z=>{Z.button===0&&(mt=!0,V=Z.clientX,Q=Z.clientY,ot=new Set(p.selected[v]),ct(V,Q),document.addEventListener("mousemove",rt,!0),document.addEventListener("mouseup",st,!0))}),L.querySelectorAll("[data-scheme-idx]").forEach(Z=>Z.addEventListener("click",()=>{p.activeSchemeIdx=parseInt(Z.getAttribute("data-scheme-idx"),10)||0,p._schemeUserSelected=!0,S("scheme")}));let ft=document.getElementById("uc-clear");ft&&(ft.onclick=()=>{p.selected[v]=new Set,U()}),U()}a(S,"openScoreModal");async function y(){k("空闲教室",'<div class="uc-loading">加载教学楼</div>',"");try{await n.ensureRoomCatalogLoaded(!1),k("空闲教室",n.roomPickerHtml(),'<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>')}catch(w){k("空闲教室",`<div class="uc-empty">${n.escapeHtml(w&&w.message||w)}</div>`,"")}}a(y,"openRoomModal");function A(w){if(w&&w.isConnected)return w;let T=document.querySelector("#uc-room-panel");if(T&&T.offsetParent!==null||T&&p.mobileTab==="room")return T;let C=document.querySelector("#uc-modal-body"),b=document.querySelector("#uc-modal");return b&&b.classList.contains("open")&&C?C:T||C||null}a(A,"getRoomHost");async function f(w,T,C){let b=A(C);if(!b){console.warn("[URP++] no room host");return}b.innerHTML='<div class="uc-loading">加载占用网格</div>';try{let m=await n.loadBuildingOccupancy(w);b.innerHTML='<div class="uc-loading">匹配课程名称</div>';let v=m.planNumber||"";if(!v)try{let q=await n.fetchText("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),I=JSON.parse(q);if(v=I&&(I.zxjxjhh||I.xnxq||I.dateList&&I.dateList[0]&&I.dateList[0].zxjxjhh)||"",!v&&I&&I.xkxx&&I.xkxx[0]){let L=Object.keys(I.xkxx[0]||{}),O=L.length?I.xkxx[0][L[0]]:null;v=O&&(O.zxjxjhh||O.executiveEducationPlanNumber)||""}}catch{}v||(v="2025-2026-2-1"),m.planNumber=v;try{m=await n.enrichOccupancyWithCurriculum(m,typeof w=="object"?w:{},v)}catch(q){console.warn("[URP++] enrich occupancy",q)}p.occupancy=m,p.roomDateOffset=Number(m.dateOffset!=null?m.dateOffset:p.roomDateOffset)||0;let x=typeof w=="object"?w:{path:w,name:T};p.currentBuilding=Object.assign({},x,{name:T||x.name||"",dateOffset:p.roomDateOffset}),T=T||w&&w.name||"";let E=A(b)||b;E.innerHTML=n.occupancyHtml(m,T),d(E)}catch(m){let v=A(b)||b;v&&(v.innerHTML=`<div class="uc-empty">${n.escapeHtml(m&&m.message||m)}</div>`)}}return a(f,"showBuilding"),{bindUI:d,closeModal:P,getRoomHost:A,openModal:k,openRoomModal:y,openScoreModal:S,showBuilding:f}}a(mi,"createCleanModeUI");function hi({state:p,deps:n}){function c(){return document.getElementById("urppp-clean-root")}a(c,"rootEl");function d(){n.ensureStyle();let y=c();if(y)return y;y=document.createElement("div"),y.id="urppp-clean-root",y.innerHTML=`
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
      </div>`,document.documentElement.appendChild(y),y.querySelector("#uc-exit").onclick=k,y.querySelector("#uc-refresh").onclick=()=>u(!0),y.querySelector("#uc-mask").onclick=n.closeModal,y.querySelector("#uc-modal-close").onclick=n.closeModal;let A=a(()=>{n.syncThemeDotGroup(y.querySelector("#uc-top-theme"))},"syncCleanThemeDots");y.querySelectorAll("#uc-top-theme .urppp-nav-dot[data-theme]").forEach(v=>{v.addEventListener("click",()=>{n.handleThemeDotClick(v.dataset.theme),A();try{n.syncNavbarThemeUI()}catch{}try{n.syncSettingsPanelUI()}catch{}})});let f=y.querySelector("#uc-settings");f&&f.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation();try{n.openSettingsPanel()}catch{}});let w=y.querySelector("#uc-menu-toggle"),T=a(v=>{v.classList.remove("urppp-clean-sidebar");let x=v.__urpppCleanInline;if(x){let q=v.style,I=a((L,O)=>{let M=x[O];M&&M.v?q.setProperty(L,M.v,M.p||""):q.removeProperty(L)},"restore");I("top","top"),I("height","height"),I("z-index","z"),I("position","pos"),I("transform","transform"),I("visibility","vis"),I("pointer-events","pe"),I("transition","transition"),delete v.__urpppCleanInline}let E=v.__urpppCleanOrigin;E&&E.parent&&v.parentElement!==E.parent&&(E.next&&E.next.parentElement===E.parent?E.parent.insertBefore(v,E.next):E.parent.appendChild(v)),delete v.__urpppCleanOrigin},"restoreCleanSidebarInline"),C=a(()=>{let v=document.getElementById("sidebar");if(v)if(p.open){if(v.classList.add("urppp-clean-sidebar"),!v.__urpppCleanInline){let O=v.style,M=a(H=>({v:O.getPropertyValue(H),p:O.getPropertyPriority(H)}),"grab");v.__urpppCleanInline={top:M("top"),height:M("height"),z:M("z-index"),pos:M("position"),transform:M("transform"),vis:M("visibility"),pe:M("pointer-events"),transition:M("transition")},v.__urpppCleanOrigin={parent:v.parentElement,next:v.nextSibling}}if(v.parentElement!==y){let O=y.querySelector(".uc-shell");y.insertBefore(v,O||null)}let x=y.getBoundingClientRect(),E=y.querySelector(".uc-top"),q=E?E.getBoundingClientRect():null,I=Math.max(44,Math.round(q?q.bottom-x.top:60)),L=Math.max(0,Math.round(x.height-I));v.style.setProperty("top",I+"px","important"),v.style.setProperty("height",L+"px","important"),v.style.setProperty("z-index","12030","important"),v.style.setProperty("position","fixed","important")}else T(v)},"syncCleanSidebarZ"),b=a(()=>{let v=document.getElementById("sidebar");if(!v)return;try{n.stopDrawerAnimation(v)}catch{}v.classList.remove("display","urppp-drawer-closing"),T(v),w&&(w.setAttribute("aria-expanded","false"),w.setAttribute("aria-label","打开菜单"));let x=document.getElementById("urppp-mobile-menu-button");x&&(x.setAttribute("aria-expanded","false"),x.setAttribute("aria-label","打开菜单"))},"closeCleanSidebar");w&&w.addEventListener("click",v=>{v.preventDefault(),v.stopImmediatePropagation();let x=document.getElementById("sidebar");if(!x)return;x.__urpppCleanMenuBound||(x.__urpppCleanMenuBound=!0,x.addEventListener("click",I=>{if(!p.open)return;let L=I.target&&I.target.closest?I.target.closest("a[href]"):null;if(!L||L.closest("#urppp-mobile-search-panel"))return;let O=String(L.getAttribute("href")||"").trim();if(L.closest("#urppp-mobile-quick, #urppp-mobile-user")){if(!O||O==="#"||O.startsWith("javascript")||L.target==="_blank"||/^https?:\/\//i.test(O))return;k();return}!O||O==="#"||O.startsWith("javascript")||L.target==="_blank"||/^https?:\/\//i.test(O)||k()},!0));let E=!x.classList.contains("display");C(),n.setDrawerOpen(x,w,E);let q=document.getElementById("urppp-mobile-menu-button");q&&(q.setAttribute("aria-expanded",E?"true":"false"),q.setAttribute("aria-label",E?"关闭菜单":"打开菜单"))}),y.__closeCleanDrawer=b,y.__syncCleanSidebarZ=C,y.__syncCleanThemeDots=A;let m=globalThis.ResizeObserver;if(typeof m=="function"){let v=new m(()=>{p.open&&C()});v.observe(y);let x=y.querySelector(".uc-top");x&&v.observe(x),y.__cleanSidebarResizeObserver=v}try{let v=window.matchMedia&&window.matchMedia("(max-width: 900px)");if(v){let x=a(()=>{p.open&&(C(),n.render())},"onLayoutChange");typeof v.addEventListener=="function"?v.addEventListener("change",x):typeof v.addListener=="function"&&v.addListener(x),y.__scoreLayoutMedia=v,y.__scoreLayoutChange=x}}catch{}try{n.applySkinAttr()}catch{}return A(),y.querySelectorAll("#uc-tabbar button").forEach(v=>{v.onclick=()=>{p.mobileTab=v.dataset.tab,y.querySelectorAll("#uc-tabbar button").forEach(x=>x.classList.toggle("ac",x===v)),n.render(),p.mobileTab==="room"&&n.ensureRoomCatalogLoaded()}}),ho(),li(y),y}a(d,"ensureRoot");function u(y){d();let A=p.open;p.open=!0,p.uiReady=!1,p.weekLocked=!1;let f=n.getCurrentWeekNumber()||n.readRememberedTermWeek();p.viewWeek=f>=1?f:p.viewWeek>=1?p.viewWeek:0,document.documentElement.classList.add("urppp-clean-lock",n.CLEAN_FLAG);let w=c();w.classList.remove("closing"),A||(w.classList.remove("uc-settled","open"),w.offsetWidth,w.classList.add("open"));try{n.stopDrawerAnimation(document.getElementById("sidebar"))}catch{}try{w.__syncCleanThemeDots&&w.__syncCleanThemeDots()}catch{}try{w.__syncCleanSidebarZ&&w.__syncCleanSidebarZ()}catch{}try{n.injectCleanSidebarSections(document.getElementById("sidebar"))}catch{}n.loadAll(!!y);try{n.ensureRoomCatalogLoaded()}catch{}}a(u,"openCleanMode");function k(){p.open=!1,p.uiReady=!1,n.closeModal(),document.documentElement.classList.remove("urppp-clean-lock",n.CLEAN_FLAG);let y=c();if(y){y.classList.remove("open","uc-settled","uc-drawer-open"),y.classList.add("closing"),clearTimeout(y.__ucSettleTimer);try{y.__closeCleanDrawer&&y.__closeCleanDrawer()}catch{}setTimeout(()=>{y.classList.remove("closing")},360)}try{n.refreshMobileNavbar()}catch{}}a(k,"closeCleanMode");function P(){try{n.ensureStyle();let y=document.getElementById("urppp-nav-clean");if(!n.isHomePage()){y&&y.remove(),di();return}let A=document.getElementById("urppp-nav-theme")||document.querySelector("#navbar .navbar-header")||document.querySelector("#navbar");if(!A)return;y||(y=document.createElement("button"),y.type="button",y.id="urppp-nav-clean",y.title="清爽模式",y.innerHTML=`${n.ico("clean")}<span>清爽</span>`,y.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),u(!1)}),A.appendChild(y)),Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none"}).forEach(([f,w])=>y.style.setProperty(f,w,"important")),ho();try{ci()}catch{}}catch(y){console.warn("[URP++] clean entry",y)}}return a(P,"injectCleanEntry"),{cleanModeApi:{open:u,close:k,inject:P,refresh:n.refreshCleanPersonalDisplay,refreshRender:a(()=>{try{n.render()}catch{}},"refreshRender"),scoreToGpa:n.scoreToGpa,summarizeCourses:n.summarizeCourses},closeCleanMode:k,ensureRoot:d,injectCleanEntry:P,openCleanMode:u,rootEl:c}}a(hi,"createCleanModeController");function bi({deps:p}){function n(){if(window.__urpppScheduleHoverNear)return;window.__urpppScheduleHoverNear=!0;let P=12,S=16,y=0,A=0,f=!1,w=0,T=a(()=>document.getElementById("schedule-hover"),"hoverEl"),C=a(v=>{if(!v||v.style&&v.style.display==="none")return!1;let x=window.getComputedStyle(v);return x.display!=="none"&&x.visibility!=="hidden"},"isShown"),b=a(()=>{let v=T();if(!v||!C(v)){f=!1;return}f=!0;let x=window.innerWidth||1200,E=window.innerHeight||800,q=y+P,I=A+S,L=Math.min(320,v.offsetWidth||280),O=Math.min(220,v.offsetHeight||160);q+L>x-8&&(q=x-L-8),I+O>E-8&&(I=E-O-8),q<8&&(q=8),I<8&&(I=8),v.style.setProperty("position","fixed","important"),v.style.setProperty("left",Math.round(q)+"px","important"),v.style.setProperty("top",Math.round(I)+"px","important"),v.style.setProperty("right","auto","important"),v.style.setProperty("bottom","auto","important"),v.style.setProperty("margin","0","important"),v.style.setProperty("z-index","3000","important"),v.style.setProperty("pointer-events","none","important")},"place"),m=a(()=>{w||(w=requestAnimationFrame(()=>{w=0,b()}))},"schedulePlace");document.addEventListener("mousemove",v=>{if(y=v.clientX,A=v.clientY,!f){let x=T();x&&x.style&&x.style.display&&x.style.display!=="none"&&(f=!0)}f&&m()},!0),document.addEventListener("mouseover",v=>{v.target&&v.target.closest&&v.target.closest(".fc-event, .fc-time-grid-event")&&(y=v.clientX,A=v.clientY,setTimeout(()=>{f=!0,b()},0),setTimeout(b,40))},!0),document.addEventListener("mouseout",v=>{v.target&&v.target.closest&&v.target.closest(".fc-event, .fc-time-grid-event")&&setTimeout(()=>{let E=T();C(E)||(f=!1)},50)},!0)}a(n,"bindScheduleHoverNearCursor");function c(P){try{let S=!!(P&&P.force),y=typeof unsafeWindow<"u"&&unsafeWindow.jQuery?unsafeWindow.jQuery:window.jQuery||null;if(!y||!y.fn||!y.fn.fullCalendar)return!1;let A=document.getElementById("main-calendar")||document.querySelector("#urppp-left .fc, #urppp-dashboard .fc");if(!A)return!1;if(!S&&A.dataset.urpppFcSized==="1")return!0;let f=y(A);if(!(f.data("fullCalendar")||f.hasClass("fc")))return!1;let T=Array.from(A.querySelectorAll(".fc-scroller")).map(b=>({el:b,top:b.scrollTop,left:b.scrollLeft}));if(S||A.dataset.urpppFcRendered!=="1"){try{f.fullCalendar("render")}catch{}A.dataset.urpppFcRendered="1"}else try{f.fullCalendar("updateSize")}catch{}return requestAnimationFrame(()=>{T.forEach(b=>{try{b.el.scrollTop=b.top,b.el.scrollLeft=b.left}catch{}})}),(A.getBoundingClientRect().height||0)>=300&&(A.dataset.urpppFcSized="1"),!0}catch(S){return console.warn("[URP++] fullCalendar refresh failed",S),!1}}a(c,"refreshHomeFullCalendar");function d(){window.__urpppFcRefreshBound||(window.__urpppFcRefreshBound=!0,setTimeout(()=>c({force:!0}),0),setTimeout(()=>c({force:!1}),300))}a(d,"scheduleHomeFullCalendarRefresh");function u(P,S,y){let A=P.querySelector(".widget-header"),f=A?A.querySelector(".widget-toolbar"):null,w=document.createElement("div");w.className="urppp-card",w.innerHTML=`
      <div class="urppp-card-header">
        <h4>${y}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `,f&&(f.style.display="inline-block",w.querySelector(".urppp-card-tools").appendChild(f)),w.querySelector(".urppp-card-body").appendChild(P),S.appendChild(w)}a(u,"wrapWidget");function k(){try{n()}catch{}if(document.getElementById("urppp-dashboard"))return;let P=document.querySelector(".page-content");if(!P)return;let S=Array.from(P.querySelectorAll(".widget-box"));if(S.length<6)return;let y=S[4],A=y?Array.from(y.querySelectorAll(".infobox")):[],f=document.createElement("div");f.id="urppp-dashboard",f.innerHTML=`
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `,P.appendChild(f);let w=P.querySelector("#warningInfo");w&&document.body.appendChild(w),S.forEach(x=>{let E=x.closest('.widget-container-col, [class*="col-"]');E&&(E.style.display="none")}),P.querySelectorAll(":scope > .row").forEach(x=>{x.style.display="none"});let T=f.querySelector("#urppp-stats"),C=Math.max(A.length,5);for(let x=0;x<C;x++){let E=document.createElement("div");E.className="urppp-stat-card urppp-stat-skeleton",E.innerHTML='<div class="value">-</div><div class="label">加载中</div>',T.appendChild(E)}function b(){let x=y?Array.from(y.querySelectorAll(".infobox")):[];x.length!==0&&(T.innerHTML="",x.forEach(E=>{let q=E.innerText.trim().split(/\n+/).map(et=>et.trim()).filter(et=>et),I=q[0]||"",L=q.slice(1).join(" ").replace(/更多\.\.\./g,"").trim(),M=/[\u4e00-\u9fa5]/.test(I)||I.length>5?"value urppp-stat-value-text":"value",H=E.closest("a"),G=document.createElement(H?"a":"div");H&&(G.href=H.href||"javascript:void(0)",G.onclick=H.onclick,G.style.textDecoration="none"),G.className="urppp-stat-card";let U=p.statCardPrivacyMarkup(I,L);G.innerHTML=`<div class="${M}">${U.valueHtml}</div><div class="label">${U.labelHtml}</div>`,T.appendChild(G)}))}if(a(b,"updateStats"),b(),y){let x=new MutationObserver(()=>b());x.observe(y,{childList:!0,subtree:!0}),setTimeout(()=>x.disconnect(),5e3)}let m=f.querySelector("#urppp-left"),v=f.querySelector("#urppp-right");u(S[5],m,"我的日程安排"),u(S[0],v,"通知公告"),u(S[1],v,"我的待办任务"),u(S[2],v,"可申请业务"),u(S[3],v,"常用下载"),y&&(y.style.display="none"),d(),console.log("[URP++] 首页仪表板已重构")}return a(k,"rebuildDashboard"),{rebuildDashboard:k,refreshHomeFullCalendar:c,scheduleHomeFullCalendarRefresh:d,wrapWidget:u}}a(bi,"createDashboardController");function xe(p){return Math.round((Number(p)||0)*100)/100}a(xe,"round2");var vc=[{key:"a",level:"A",range:"90-100",gpa:4,min:90,max:100},{key:"am",level:"A-",range:"85-89",gpa:3.7,min:85,max:89.999},{key:"bp",level:"B+",range:"82-84",gpa:3.3,min:82,max:84.999},{key:"b",level:"B",range:"78-81",gpa:3,min:78,max:81.999},{key:"bm",level:"B-",range:"75-77",gpa:2.7,min:75,max:77.999},{key:"cp",level:"C+",range:"72-74",gpa:2.3,min:72,max:74.999},{key:"c",level:"C",range:"68-71",gpa:2,min:68,max:71.999},{key:"cm",level:"C-",range:"64-67",gpa:1.7,min:64,max:67.999},{key:"dp",level:"D+",range:"60-63",gpa:1.3,min:60,max:63.999},{key:"d",level:"D",range:"60-62",gpa:1,min:60,max:62.999},{key:"f",level:"F",range:"<60",gpa:0,min:0,max:59.999}],gi={优秀:95,"A+":98,A:95,"A-":87,良好:85,"B+":83,B:79,"B-":76,中等:73,"C+":73,C:69,"C-":65,及格:62,"D+":62,D:60,不及格:50,F:50},wc=[{key:"required",label:"必修",test:a(p=>/必修/.test(p),"test")},{key:"elective",label:"任选",test:a(p=>/任选/.test(p),"test")},{key:"optional",label:"选修",test:a(p=>/选修/.test(p),"test")},{key:"other",label:"其他",test:a(()=>!0,"test")}];function fi(p){let n=String(p||"").match(/^(\d{4})-(\d{4})-(\d+)/);return n?`${n[1].slice(2)}-${n[2].slice(2)}-${n[3]}`:String(p||"")}a(fi,"shortTerm");function na({deps:p}){let n=p.scoreToNumber,c=p.scoreToGpa;function d(b){let m=n(b);if(m!=null)return m;let v=String(b||"").trim().toUpperCase();return gi[v]!=null?gi[v]:null}a(d,"scoreToNumberWithLevels");function u(b){return!b||b.unevaluated?!1:d(b.score)!=null}a(u,"hasScore");function k(b){let m=String(b||"").match(/^(\d{4})-(\d{4})-(\d+)/);return m?[Number(m[1]),Number(m[3])]:[9999,9999]}a(k,"termOrderKey");function P(b){let m=b&&b.passing&&b.passing[0];return m&&m.courses||[]}a(P,"allCourses");function S(b){let m=b&&b.officialGpa,v=Number(m);return m!=null&&Number.isFinite(v)&&v>=0&&v<=5?v:null}a(S,"officialGpa");function y(b){let m=S(b);return m??c(b.score)}a(y,"courseGpa");function A({scorePack:b,profile:m}){let v=P(b),x=m&&m.majorGpa?String(m.majorGpa).trim():"",E=0,q=0,I=0,L=0,O=0,M=0;return v.forEach(H=>{if(!u(H))return;let G=Number(H.credit)||0,U=d(H.score);if(U==null||G<=0)return;E+=G,q+=U*G;let et=y(H);et!=null&&(I+=et*G,L+=G,H.required&&(O+=et*G,M+=G))}),{majorGpa:x,requiredGpa:xe(M?O/M:0),avgGpa:xe(L?I/L:0),avgScore:xe(E?q/E:0),totalCredit:xe(E),courseCount:v.length}}a(A,"computeMetrics");function f(b){let m=new Map;return(b||[]).forEach(v=>{if(!u(v))return;let x=v.term||"未分组",E=m.get(x);E||(E={term:x,count:0,credit:0,scoreW:0,gpaW:0,gpaCredit:0},m.set(x,E));let q=Number(v.credit)||0,I=d(v.score);if(I==null||(E.count+=1,q<=0))return;E.credit+=q,E.scoreW+=I*q;let L=y(v);L!=null&&(E.gpaW+=L*q,E.gpaCredit+=q)}),Array.from(m.values()).map(v=>({term:v.term,label:fi(v.term),count:v.count,credit:xe(v.credit),avgScore:xe(v.credit?v.scoreW/v.credit:0),avgGpa:xe(v.gpaCredit?v.gpaW/v.gpaCredit:0)})).sort((v,x)=>{let E=k(v.term),q=k(x.term);return E[0]-q[0]||E[1]-q[1]})}a(f,"computeTrend");function w(b){let m=vc.map(x=>({...x,count:0,credit:0}));(b||[]).forEach(x=>{if(!u(x))return;let E=d(x.score);if(E==null)return;let q=m.find(I=>E>=I.min&&E<=I.max);q&&(q.count+=1,q.credit+=Number(x.credit)||0)});let v=m.reduce((x,E)=>Math.max(x,E.count),1);return m.map(x=>({...x,ratio:Math.round(x.count/v*100)}))}a(w,"computeBands");function T(b){let m=wc.map(q=>({...q,credit:0,count:0}));(b||[]).forEach(q=>{if(!u(q))return;let I=String(q.attr||""),L=m.find(O=>O.test(I));L&&(L.credit+=Number(q.credit)||0,L.count+=1)});let v=m.reduce((q,I)=>q+I.credit,0)||1,x=m.filter(q=>q.count>0).map(q=>({key:q.key,label:q.label,credit:xe(q.credit),count:q.count,ratio:Math.round(q.credit/v*100)})),E=x.find(q=>q.key==="required");return{items:x,requiredCredit:E?E.credit:0,requiredRatio:E?E.ratio:0}}a(T,"computeShare");function C({scorePack:b,profile:m}){let v=P(b);return{metrics:A({scorePack:b,profile:m}),trend:f(v),bands:w(v),share:T(v),empty:v.length===0}}return a(C,"analyzeScores"),{analyzeScores:C,hasScore:u,officialGpa:S,scoreToNumberWithLevels:d,shortTerm:fi}}a(na,"createScoreAnalysisData");var ne="var(--text-secondary)",go="var(--border)";function pe(p){return at(String(p??""))}a(pe,"escapeLabel");function xi(p,n,c){let d=!!(p&&p.variant==="mobile");if(n==="trend"){if(!d)return{mobile:d,width:920,height:330,pad:{top:36,right:30,bottom:46,left:30}};let P={top:58,right:20,bottom:44,left:20},S=Math.max(56,Number(p&&p.slotWidth)||72);return{mobile:d,width:Math.max(300,P.left+P.right+Math.max(1,c)*S),height:286,pad:P}}if(!d)return{mobile:d,width:660,height:236,pad:{top:28,right:14,bottom:44,left:14}};let u={top:28,right:14,bottom:44,left:14},k=Math.max(44,Number(p&&p.slotWidth)||48);return{mobile:d,width:Math.max(320,u.left+u.right+Math.max(1,c)*k),height:236,pad:u}}a(xi,"resolveChartLayout");function bo({width:p,height:n,mobile:c,kind:d,label:u}){let k=c?` data-urppp-chart-layout="mobile" style="width:max(100%,${p}px);max-width:none;height:auto"`:"";return`<svg viewBox="0 0 ${p} ${n}" class="urppp-sa-chart" role="img" aria-label="${u}" data-urppp-chart-kind="${d}"${k}>`}a(bo,"openSvg");function pa({trend:p,palette:n,layout:c}){let d=(p||[]).filter(rt=>rt&&rt.avgScore!=null),u=xi(c,"trend",d.length),{width:k,height:P,pad:S,mobile:y}=u,A=k-S.left-S.right,f=P-S.top-S.bottom;if(!d.length)return`${bo({...u,kind:"trend",label:"学期成绩趋势"})}</svg>`;let w=d.length,T=a(rt=>S.left+(rt+.5)*(A/w),"xAt"),C=d.map(rt=>Number(rt.avgGpa)||0),b=d.map(rt=>Number(rt.avgScore)||0),m=d.map(rt=>Number(rt.credit)||0),v=Math.max(0,Math.min(...C)-.2),x=Math.min(5,Math.max(...C)+.2),E=Math.max(0,Math.min(...b)-4),q=Math.min(100,Math.max(...b)+4),I=Math.max(1,...m),L=x-v||1,O=q-E||1,M=a(rt=>S.top+f-(rt-v)/L*f,"yGpa"),H=a(rt=>S.top+f-(rt-E)/O*f,"yScore"),G=a(rt=>S.top+f-rt/I*f*.9,"yCredit"),U=d.map((rt,st)=>`${T(st)},${M(rt.avgGpa)}`).join(" "),et=d.map((rt,st)=>`${T(st)},${H(rt.avgScore)}`).join(" "),it=[0,.25,.5,.75,1].map(rt=>{let st=S.top+f-rt*f;return`<line x1="${S.left}" y1="${st.toFixed(1)}" x2="${k-S.right}" y2="${st.toFixed(1)}" stroke="${go}" stroke-width="1" stroke-dasharray="3 4"/>`}).join(""),mt=d.map((rt,st)=>{let ft=T(st),Z=y?Math.min(30,A/w*.42):Math.min(26,A/w*.32),dt=G(rt.credit);return`<rect x="${(ft-Z/2).toFixed(1)}" y="${dt.toFixed(1)}" width="${Z.toFixed(1)}" height="${(S.top+f-dt).toFixed(1)}" rx="3" fill="${n.credit}" opacity="0.55"/>
<text x="${ft.toFixed(1)}" y="${(dt-4).toFixed(1)}" text-anchor="middle" font-size="12" fill="${ne}">${pe(rt.credit)}</text>`}).join(""),V=d.map((rt,st)=>`<text x="${T(st).toFixed(1)}" y="${P-16}" text-anchor="middle" font-size="12" fill="${ne}">${pe(rt.label)}</text>`).join(""),Q=d.map((rt,st)=>{let ft=A/w,Z=T(st)-ft/2,dt=[`学期 ${rt.label}`,`课程 ${rt.count} 门`,`修读学分 ${rt.credit}`,`加权均分 ${rt.avgScore}`,`平均绩点 ${rt.avgGpa}`].join(`
`);return`<rect class="urppp-sa-hover" x="${Z.toFixed(1)}" y="${S.top}" width="${ft.toFixed(1)}" height="${f.toFixed(1)}" fill="transparent"><title>${pe(dt)}</title></rect>`}).join(""),ot=d.map((rt,st)=>`<circle cx="${T(st).toFixed(1)}" cy="${M(rt.avgGpa).toFixed(1)}" r="3.5" fill="${n.gpaLine}"/><text x="${T(st).toFixed(1)}" y="${(M(rt.avgGpa)-9).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${n.gpaLine}">${pe(rt.avgGpa)}</text>`).join(""),X=d.map((rt,st)=>`<circle cx="${T(st).toFixed(1)}" cy="${H(rt.avgScore).toFixed(1)}" r="3" fill="${n.scoreLine}"/><text x="${T(st).toFixed(1)}" y="${(H(rt.avgScore)+17).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="${n.scoreLine}">${pe(rt.avgScore)}</text>`).join(""),ct=y?`<g font-size="12">
  <rect x="${S.left}" y="30" width="12" height="12" rx="3" fill="${n.gpaLine}"/><text x="${S.left+18}" y="40" fill="${ne}">学期平均绩点</text>
  <rect x="${S.left+132}" y="30" width="12" height="12" rx="3" fill="${n.scoreLine}"/><text x="${S.left+150}" y="40" fill="${ne}">加权均分</text>
</g>`:`<g font-size="12">
  <rect x="${k-S.right-176}" y="8" width="12" height="12" rx="3" fill="${n.gpaLine}"/><text x="${k-S.right-158}" y="18" fill="${ne}">学期平均绩点</text>
  <rect x="${k-S.right-82}" y="8" width="12" height="12" rx="3" fill="${n.scoreLine}"/><text x="${k-S.right-64}" y="18" fill="${ne}">加权均分</text>
</g>`;return`${bo({...u,kind:"trend",label:"学期成绩趋势"})}
${it}
${mt}
<g>${Q}</g>
<text x="${S.left}" y="18" font-size="12" fill="${ne}">每学期修读学分（柱）</text>
<g stroke="${n.gpaLine}" stroke-width="2.2" fill="none"><polyline points="${U}"/></g>
<g stroke="${n.scoreLine}" stroke-width="1.8" stroke-dasharray="5 4" fill="none"><polyline points="${et}"/></g>
<g>${ot}</g>
<g>${X}</g>
<g>${V}</g>
${ct}
</svg>`}a(pa,"trendChartSvg");function ia({bands:p,palette:n,layout:c}){let d=p||[],u=xi(c,"bands",d.length),{width:k,height:P,pad:S,mobile:y}=u,A=k-S.left-S.right,f=P-S.top-S.bottom,w=d.length||1,T=Math.max(1,...d.map(m=>m.count)),C=y?Math.min(32,A/w*.62):Math.min(40,A/w*.52),b=d.map((m,v)=>{let x=S.left+(v+.5)*(A/w),E=m.count?Math.max(8,m.count/T*f):0,q=S.top+f-E,I=(.4+(1-v/(w-1))*.6).toFixed(2),L=m.range||(m.min===0?"<60":`${m.min}-${m.max===100?"100":m.max}`),O=[`${m.level||""}（绩点 ${m.gpa}）`,`百分制 ${L}`,`课程 ${m.count} 门`].join(`
`);return`<rect class="urppp-sa-band" x="${(x-C/2).toFixed(1)}" y="${q.toFixed(1)}" width="${C.toFixed(1)}" height="${E.toFixed(1)}" rx="4" fill="${n.primary}" opacity="${I}"><title>${pe(O)}</title></rect>
<text x="${x.toFixed(1)}" y="${(q-6).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)">${pe(m.count)}</text>
<text x="${x.toFixed(1)}" y="${P-26}" text-anchor="middle" font-size="11" font-weight="600" fill="${ne}">${pe(L)}</text>
<text x="${x.toFixed(1)}" y="${P-12}" text-anchor="middle" font-size="12" fill="${ne}">${pe(m.gpa)}</text>`}).join("");return`${bo({...u,kind:"bands",label:"成绩分段分布"})}
<line x1="${S.left}" y1="${(S.top+f).toFixed(1)}" x2="${k-S.right}" y2="${(S.top+f).toFixed(1)}" stroke="${go}" stroke-width="1"/>
${b}
</svg>`}a(ia,"bandsChartSvg");function yi({items:p,requiredRatio:n,palette:c}){let S=2*Math.PI*56,y=(p||[]).filter(T=>T&&T.ratio>0),A=Math.max(0,Math.min(100,Math.round(Number(n)||0)));if(!y.length)return'<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成"></svg>';let f=-90,w=y.map(T=>{let C=T.ratio/100*S,m=`<circle cx="75" cy="75" r="56" fill="none" stroke="${c.share&&c.share[T.key]||c.required}" stroke-width="24"
  stroke-dasharray="${C.toFixed(2)} ${S.toFixed(2)}"
  stroke-linecap="butt" transform="rotate(${f.toFixed(2)} 75 75)"/>`;return f+=T.ratio/100*360,m}).join("");return`<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成">
<circle cx="75" cy="75" r="56" fill="none" stroke="${go}" stroke-width="24"/>
${w}
<text x="75" y="69" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${pe(A)}%</text>
<text x="75" y="91" text-anchor="middle" font-size="11.5" fill="${ne}">必修学分占比</text>
</svg>`}a(yi,"donutSvg");var kc=Object.freeze({gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)",share:Object.freeze({required:"var(--primary)",elective:"var(--text-muted)",optional:"var(--text-secondary)",other:"var(--border)"})}),Ac='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>',Sc='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';function vi({deps:p}){let n=p&&p.palette||kc;function c(){return`<div id="urppp-score-analysis" class="urppp-sa" data-urppp-sa-state="collapsed">
  <button type="button" class="urppp-sa-toggle" aria-expanded="false">
    <span class="urppp-sa-icon">${Ac}</span>
    <span class="urppp-sa-title">成绩分析</span>
    <span class="urppp-sa-summary" data-urppp-sa-summary>点击展开，查看成绩指标与学期变化</span>
    <span class="urppp-sa-chevron">${Sc}</span>
  </button>
  <div class="urppp-sa-body" data-urppp-sa-body hidden>
    <div class="urppp-sa-content" data-urppp-sa-content></div>
  </div>
</div>`}a(c,"panelShellHtml");function d(){return'<div class="urppp-sa-loading"><span class="urppp-sa-spinner"></span><span>正在计算成绩分析…</span></div>'}a(d,"loadingHtml");function u(A){return`<div class="urppp-sa-error">${at(String(A||"成绩数据加载失败"))}
  <button type="button" class="urppp-sa-retry" data-urppp-sa-retry>重试</button></div>`}a(u,"errorHtml");function k(A){return[{label:"主修必修绩点",value:A.requiredGpa>0?String(A.requiredGpa):"—",hint:"必修课程加权"},{label:"平均绩点",value:A.avgGpa!=null?String(A.avgGpa):"—",hint:"全部及格加权"},{label:"加权均分",value:A.avgScore!=null?String(A.avgScore):"—",hint:"学分加权"},{label:"已修学分",value:A.totalCredit!=null?String(A.totalCredit):"—",hint:"及格课程学分"},{label:"已修课程",value:String(A.courseCount||0),hint:"含未评估"}].map(w=>`<div class="urppp-sa-metric">
  <div class="urppp-sa-metric-value">${at(w.value)}</div>
  <div class="urppp-sa-metric-label">${at(w.label)}</div>
  <div class="urppp-sa-metric-hint">${at(w.hint)}</div>
</div>`).join("")}a(k,"metricCards");function P(A){return`<table class="urppp-sa-table">
<thead><tr><th>学期</th><th>课程</th><th>学分</th><th>加权均分</th><th>平均绩点</th></tr></thead>
<tbody>${(A||[]).map(w=>`<tr><td>${at(w.label)}</td><td>${at(w.count)}</td><td>${at(w.credit)}</td><td>${at(w.avgScore)}</td><td>${at(w.avgGpa)}</td></tr>`).join("")}</tbody></table>`}a(P,"detailTable");function S(A){return(A||[]).map(f=>`<div class="urppp-sa-legend-item"><i class="urppp-sa-legend-dot" style="background:${n.share&&n.share[f.key]||n.primary}"></i>${at(f.label)} ${at(f.credit)} 学分 · ${at(f.count)} 门</div>`).join("")}a(S,"shareLegend");function y(A,f={}){if(!A||A.empty)return'<div class="urppp-sa-empty">暂无可用成绩数据，请先在教务系统查询成绩后再试。</div>';let w=A.share||{items:[],requiredRatio:0},T=f.chartLayout||null;return`<div class="urppp-sa-metrics">${k(A.metrics)}</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-trend">
    <h5 class="urppp-sa-card-title">学期趋势</h5>
    <div class="urppp-sa-chart-scroll">${pa({trend:A.trend,palette:n,layout:T})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-share">
    <h5 class="urppp-sa-card-title">课程类型构成</h5>
    <div class="urppp-sa-share-body">
      <div class="urppp-sa-donut">${yi({items:w.items,requiredRatio:w.requiredRatio,palette:n})}</div>
      <div class="urppp-sa-legend">${S(w.items)}</div>
    </div>
  </section>
</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-bands">
    <h5 class="urppp-sa-card-title">成绩分段分布</h5>
    <div class="urppp-sa-chart-scroll">${ia({bands:A.bands,palette:n,layout:T})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-detail">
    <h5 class="urppp-sa-card-title">各学期明细</h5>
    ${P(A.trend)}
  </section>
</div>`}return a(y,"analysisHtml"),{panelShellHtml:c,loadingHtml:d,errorHtml:u,analysisHtml:y,palette:n}}a(vi,"createScoreAnalysisRenderer");function wi(){function p(n,c){let d=n.querySelector(".urppp-sa-toggle"),u=n.querySelector("[data-urppp-sa-body]");if(!d||!u)return{isExpanded:a(()=>!1,"isExpanded"),setExpanded:a(()=>{},"setExpanded"),syncShareLayout:a(()=>{},"syncShareLayout")};let k=a(S=>{let y=S?"expanded":"collapsed";n.dataset.urpppSaState=y,d.setAttribute("aria-expanded",String(S)),u.hidden=!S,S&&typeof c.onExpand=="function"&&c.onExpand()},"setExpanded");d.addEventListener("click",()=>{let S=d.getAttribute("aria-expanded")==="true";k(!S)}),u.addEventListener("click",S=>{let y=S.target;y&&y.closest&&y.closest("[data-urppp-sa-retry]")&&typeof c.onRetry=="function"&&c.onRetry()});function P(){let S=n.querySelector(".urppp-sa-donut"),y=n.querySelector(".urppp-sa-legend"),A=!!(S&&y&&y.getBoundingClientRect().top>=S.getBoundingClientRect().bottom);n.classList.toggle("urppp-sa-share-stacked",A)}return a(P,"syncShareLayout"),{setExpanded:k,syncShareLayout:P,isExpanded:a(()=>d.getAttribute("aria-expanded")==="true","isExpanded")}}return a(p,"bindPanel"),{bindPanel:p}}a(wi,"createScoreAnalysisUI");var ki="urppp-score-analysis";function Ai({deps:p}){let n=na({deps:p}),c=vi({deps:p}),d=wi(),u=null,k="idle",P=null,S=null,y=null,A=!1,f=0,w="desktop";function T(){if(!p.styles||document.getElementById("urppp-score-analysis-style"))return;let U=document.createElement("style");U.id="urppp-score-analysis-style",U.textContent=p.styles,(document.head||document.documentElement).appendChild(U)}a(T,"ensureStyle");function C(){if(typeof p.getInsertHost=="function"){let U=p.getInsertHost();if(U)return U}return document.querySelector(".page-content")||document.getElementById("page-content-template")||document.body}a(C,"findHost");function b(){return u&&u.querySelector("[data-urppp-sa-content]")}a(b,"contentEl");function m(){return P||(k="loading",P=(async()=>{try{let[U,et]=await Promise.all([p.loadScores(),p.loadProfile()]);if(U&&U.error)throw new Error(U.error);let it=n.analyzeScores({scorePack:U,profile:et});return S=it,k="ready",it}catch(U){throw k="error",U}finally{P=null}})(),P)}a(m,"startLoad");function v(){k==="idle"&&m().catch(()=>{})}a(v,"warmup");function x(){if(y&&typeof y.syncShareLayout=="function")try{y.syncShareLayout()}catch{}}a(x,"syncShareLayout");function E(){try{if(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches)return{variant:"mobile"}}catch{}return null}a(E,"currentChartLayout");function q(){let U=b();if(!U||!S)return;let et=E();w=et?et.variant:"desktop",U.innerHTML=c.analysisHtml(S,{chartLayout:et}),x()}a(q,"renderReadyAnalysis");function I(){clearTimeout(f),f=setTimeout(()=>{if(x(),!S||!y||!y.isExpanded())return;let U=E();(U?U.variant:"desktop")!==w&&q()},120)}a(I,"handleResize");function L(){A||(A=!0,window.addEventListener("resize",I))}a(L,"bindResize");function O(){A&&(A=!1,clearTimeout(f),f=0,window.removeEventListener("resize",I))}a(O,"unbindResize");async function M(){let U=b();if(U){if(k==="ready"&&S){q();return}U.innerHTML=c.loadingHtml();try{await m(),q()}catch(et){U.innerHTML=c.errorHtml(et&&et.message||String(et))}}}a(M,"handleExpand");function H(){if(T(),u&&u.isConnected)return u;if(document.getElementById(ki))return document.getElementById(ki);let U=C();if(!U)return null;let et=document.createElement("div");return et.innerHTML=c.panelShellHtml(),u=et.firstElementChild,U.insertBefore(u,U.firstChild),y=d.bindPanel(u,{onExpand:M,onRetry:M}),L(),v(),p.shouldAutoExpand&&p.shouldAutoExpand()&&(typeof requestAnimationFrame=="function"?requestAnimationFrame:mt=>setTimeout(mt,0))(()=>{try{y.setExpanded(!0)}catch{}}),u}a(H,"mount");function G(){O(),u&&u.isConnected&&u.remove(),u=null,y=null,k="idle",P=null,S=null,w="desktop"}return a(G,"unmount"),{mount:H,unmount:G,getPanel:a(()=>u,"getPanel"),reset:G}}a(Ai,"createScoreAnalysisController");function Si({documentRef:p=document,locationRef:n=location,windowRef:c=window}){function d(A){return String(A||"").replace(/[\u00a0\s]+/g," ").replace(/^[>\u25b8\u203a·•\u00bb]+/,"").replace(/^\s*[\u25b8>]\s*/,"").trim()}a(d,"cleanMenuLabel");function u(A){if(!A)return"";let f=A.querySelector(":scope > a");if(!f)return"";let w=f.querySelector(".menu-text, .urppp-nav-text");if(w)return d(w.textContent);let T=f.cloneNode(!0);return T.querySelectorAll("i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow").forEach(C=>C.remove()),d(T.textContent)}a(u,"getMenuLiLabel");function k(A){let f=[],w=A,T=p.getElementById("menus")||p.getElementById("urppp-menus");for(;w&&w!==T;){if(w.tagName==="LI"){let C=u(w);C&&!/^(首页|一级菜单|二级菜单|三级菜单)$/.test(C)&&f.unshift(C)}w=w.parentElement}return f.filter((C,b)=>C&&C!==f[b-1])}a(k,"walkMenuAncestors");function P(){let A=n.pathname.replace(/\/+$/,"")||"/",f=n.search||"",w=[];return[p.getElementById("menus"),p.getElementById("urppp-menus")].filter(Boolean).forEach(C=>{C.querySelectorAll("a[href]").forEach(b=>{let m=b.getAttribute("href")||"";if(!(!m||m==="#"||m.startsWith("javascript")))try{let v=new URL(m,n.origin),x=v.pathname.replace(/\/+$/,"")||"/";if(x==="/"&&A!=="/")return;let E=0;A===x?E=1e3+x.length:A.startsWith(x+"/")?E=500+x.length:A.includes(x)&&x.length>8&&(E=200+x.length),E&&f&&v.search&&f.indexOf(v.search.slice(1))>=0&&(E+=50),E>0&&w.push({score:E,li:b.closest("li")})}catch{}})}),w.sort((C,b)=>b.score-C.score),w.length?w[0].li:null}a(P,"findMenuLiByPath");function S(){let A=P();if(A){let m=k(A);if(m.length)return m}let f="";try{let m=p.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);m&&(f=decodeURIComponent(m[1]))}catch{}if(f&&f!=="0"){let m=p.getElementById(f);if(m){let v=k(m);if(v.length)return v}}let w=null,T=Array.from(p.querySelectorAll("#menus li.active"));if(T.length){w=T[T.length-1];for(let m=T.length-1;m>=0;m--)if(!T[m].querySelector("li.active")){w=T[m];break}}if(!w){let m=Array.from(p.querySelectorAll("#urppp-menus .urppp-nav-item.active"));if(m.length){w=m[m.length-1];for(let v=m.length-1;v>=0;v--)if(!m[v].querySelector(".urppp-nav-item.active")){w=m[v];break}}}if(w){let m=k(w);if(m.length)return m}let C=p.getElementById("breadcrumbs")||p.querySelector(".breadcrumbs"),b=C&&(C.querySelector("ul.breadcrumb")||C.querySelector(".breadcrumb"));if(b){let m=[];if(Array.from(b.children).forEach((v,x)=>{if(x===0)return;let E=d(v.textContent);!E||/^(首页|一级菜单|二级菜单|三级菜单)$/.test(E)||m[m.length-1]!==E&&m.push(E)}),m.length)return m}return[]}a(S,"getBreadcrumbTrail");function y(){let A=p.getElementById("breadcrumbs")||p.querySelector(".breadcrumbs");if(!A)return;A.classList.remove("hide"),A.style.removeProperty("display"),A.style.setProperty("display","flex","important");let f=A.querySelector("ul.breadcrumb")||A.querySelector(".breadcrumb");f||(f=p.createElement("ul"),f.className="breadcrumb",A.appendChild(f));let w=S();if(!w.length&&Array.from(f.children).map(m=>d(m.textContent)).filter(Boolean).some(m=>m!=="首页"&&!/^(一级菜单|二级菜单|三级菜单)$/.test(m)))return;f.innerHTML="";let T=p.createElement("li");T.style.cursor="pointer",T.innerHTML='<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>',T.addEventListener("click",()=>{c.location.href="/"}),f.appendChild(T),w.forEach((C,b)=>{let m=p.createElement("li");b===w.length-1&&m.classList.add("active");let v=p.createElement("span");v.className="urppp-bc-label",v.textContent=C,m.appendChild(v),f.appendChild(m)})}return a(y,"beautifyBreadcrumbs"),{beautifyBreadcrumbs:y}}a(Si,"createBreadcrumbController");function _i({documentRef:p=document,windowRef:n=window,MutationObserverRef:c=MutationObserver,nodeTypeRef:d=Node}){function u(){try{let S=p.getElementById("sidebar"),y=p.querySelectorAll(".main-content");if(!y.length)return;let A=n.matchMedia&&n.matchMedia("(max-width: 991px)").matches,f="260px";A?f="0px":S&&(f=S.classList.contains("menu-min")?"50px":"260px"),y.forEach(w=>w.style.setProperty("margin-left",f,"important"))}catch{}}a(u,"syncMobileContentOffset");function k(){try{let S=p.getElementById("sidebar"),y=p.querySelector("#navbar, .navbar.navbar-default, .navbar-fixed-top");if(!S||!y||S.classList.contains("urppp-clean-sidebar"))return;let A=y.getBoundingClientRect(),f=Math.max(45,Math.round(A.height||y.offsetHeight||45));p.documentElement.style.setProperty("--urppp-navbar-height",f+"px"),S.style.setProperty("top",f+"px","important"),S.style.setProperty("height","calc(100vh - "+f+"px)","important"),S.style.setProperty("margin-top","0","important"),y.style.setProperty("z-index","1100","important"),S.style.setProperty("z-index","1030","important"),u()}catch{}}a(k,"syncSidebarUnderNavbar");function P(){let S=p.getElementById("sidebar"),y=p.getElementById("menus");if(!S||!y)return;if(n.__urpppSidebarMenuObserver){try{n.__urpppSidebarMenuObserver.disconnect()}catch{}n.__urpppSidebarMenuObserver=null}let A=p.getElementById("urppp-menus"),f=S.querySelector(".urppp-sidebar-header");A&&A.remove(),f&&f.remove(),k();let w=new Set;y.querySelectorAll("li.active").forEach(M=>{M.id&&w.add(M.id)});function T(M){return Array.from(M.children).filter(H=>H.tagName==="LI").map(H=>{let G=H.querySelector(":scope > a"),U=G?.querySelector(".menu-text"),et=U?U.textContent.trim():G?Array.from(G.childNodes).filter(st=>st.nodeType===d.TEXT_NODE).map(st=>st.textContent).join("").trim():"",it=G?.querySelector(".menu-icon"),mt=it?Array.from(it.classList).filter(st=>st!=="menu-icon").join(" "):"",V=H.querySelector(":scope > .submenu"),Q=V?T(V):[];Q=Q.filter(st=>st.text&&(st.text.trim()||st.href&&st.href!=="#"));let ot=G?.getAttribute("href")||"#",X=G?.getAttribute("target")||"",ct=H.getAttribute("onclick")||G?.getAttribute("onclick")||"",rt=H.id;return ot!=="#"&&!ot.startsWith("javascript")?{id:rt,text:et,iconClass:mt,children:[],href:ot,target:X,onclick:ct}:Q.length===1&&Q[0].children.length===0?{id:rt||Q[0].id,text:et,iconClass:mt||Q[0].iconClass,children:[],href:Q[0].href||ot,target:Q[0].target||X,onclick:Q[0].onclick||ct}:{id:rt,text:et,iconClass:mt,children:Q,href:ot,target:X,onclick:ct}})}a(T,"parseMenu");let C=T(y);y.style.display="none";let b=p.createElement("div");b.className="urppp-sidebar-header",b.style.cssText="position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)";let m=p.createElement("button");m.type="button",m.className="urppp-sidebar-toggle",m.innerHTML='<i class="fa fa-angle-left" aria-hidden="true"></i>',m.title="收起侧边栏",typeof m.setAttribute=="function"&&m.setAttribute("aria-label","收起侧边栏");let v=a(()=>!!(n.matchMedia&&n.matchMedia("(max-width: 991px)").matches),"isNarrow"),x=a(M=>{if(M&&(M.preventDefault(),M.stopPropagation()),v()){S.classList.remove("display"),u();return}let H=p.getElementById("sidebar-collapse");H&&H.click()},"doToggle");m.addEventListener("click",x),b.appendChild(m);let E=a(()=>{let M=v(),H=p.body.classList.contains("menu-min")||S.classList.contains("menu-min"),G=M?"关闭菜单":H?"展开侧边栏":"收起侧边栏";m.innerHTML=M?'<i class="fa fa-times" aria-hidden="true"></i>':H?'<i class="fa fa-angle-right" aria-hidden="true"></i>':'<i class="fa fa-angle-left" aria-hidden="true"></i>',m.title=G,typeof m.setAttribute=="function"&&m.setAttribute("aria-label",G),!M&&H?(b.style.justifyContent="center",b.style.padding="12px 0"):(b.style.justifyContent="flex-end",b.style.padding="")},"syncToggle"),q=new c(E);q.observe(p.body,{attributes:!0,attributeFilter:["class"]}),q.observe(S,{attributes:!0,attributeFilter:["class"]}),n.__urpppSidebarMenuObserver=q,E();let I=p.createElement("ul");I.id="urppp-menus",I.style.cssText="margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)";function L(M){p.querySelectorAll("#urppp-menus .urppp-nav-item").forEach(G=>G.classList.remove("active"));let H=M;for(;H&&H.id!=="urppp-menus";)H.classList.contains("urppp-nav-item")&&H.classList.add("active"),H=H.parentElement}a(L,"setActiveBranch");function O(M,H){let G=p.createElement("li");G.className="urppp-nav-item",M.id&&(G.id=M.id);let U=M.children.length>0,et=M.href||"#",it=et!=="#"&&!et.startsWith("javascript"),mt=p.createElement("a");if(mt.className="urppp-nav-link",mt.href=it?et:"javascript:void(0)",M.target&&mt.setAttribute("target",M.target),M.iconClass){let Q=p.createElement("i");M.iconClass.split(" ").forEach(ot=>{ot&&Q.classList.add(ot)}),mt.appendChild(Q)}let V=p.createElement("span");if(V.className="urppp-nav-text",V.textContent=M.text,V.title=M.text,mt.appendChild(V),U){let Q=p.createElement("i");Q.className="urppp-nav-arrow fa fa-angle-down",Q.addEventListener("click",ot=>{ot.preventDefault(),ot.stopPropagation(),G.classList.toggle("open")}),mt.appendChild(Q)}if(G.appendChild(mt),mt.addEventListener("click",Q=>{if(L(G),!it&&U)Q.preventDefault(),G.classList.toggle("open");else if(it)return}),U){let Q=p.createElement("ul");Q.className="urppp-nav-submenu",M.children.forEach(ot=>O(ot,Q)),G.appendChild(Q)}M.id&&w.has(M.id)&&G.classList.add("active"),H.appendChild(G)}a(O,"buildItem"),C.forEach(M=>O(M,I)),I.querySelectorAll(".urppp-nav-item.open").forEach(M=>M.classList.remove("open")),S.insertBefore(b,S.firstChild),S.appendChild(I)}return a(P,"rebuildSidebarCompletely"),{rebuildSidebarCompletely:P,syncMobileContentOffset:u,syncSidebarUnderNavbar:k}}a(_i,"createSidebarController");function Ei({theme:p,settings:n,documentRef:c=document,windowRef:d=window}){function u(A){if(!A)return;let f=p.getSkin(),w=p.skinSupportsFixedPalettes(f),T=p.getCurrent(),C=w?p.getBrutalActivePalette():null,b=w?p.getBrutalSelectedPalette():null;A.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(m=>{let v=m.dataset.theme,x=v==="dark",E=v==="scu-red",q=x&&!p.skinSupportsDark(f)||E&&!p.skinSupportsDynamic(f)&&!w,I=v===T;if(w&&(I=v==="default"&&C.id===p.BRUTAL_DEFAULT_PALETTE||E&&C.id!==p.BRUTAL_DEFAULT_PALETTE),m.disabled=q,m.classList.toggle("urppp-theme-disabled",q),m.classList.toggle("ac",I&&!q),m.setAttribute("aria-disabled",q?"true":"false"),v==="default")m.style.background=w?p.getBrutalPaletteById(p.BRUTAL_DEFAULT_PALETTE).accent:"#F1F3F5",m.title=w?"默认高能粉":"简约白";else if(x)m.style.background=q?"#A7A7A7":"#0B0F14",m.title=q?"当前界面风格不支持暗色模式":"深邃暗";else if(E)if(q)m.style.background="#A7A7A7",m.title="当前界面风格不支持动态配色";else if(w)m.style.background=b.accent,m.title="高对比配色："+b.name;else{let L=p.getAccent()||p.DEFAULT_SEED;try{let O=p.buildSchemePreview(L,p.getScheme());m.style.background="linear-gradient(135deg, "+O.primary+" 0 55%, "+O.surface+" 55% 100%)"}catch{m.style.background=L}m.title="动态配色"}})}a(u,"syncThemeDotGroup");function k(A){let f=p.getSkin();if(p.skinSupportsFixedPalettes(f)){if(A==="dark")return;p.getCurrent()!=="default"&&p.applyTheme("default",{manual:!0}),A==="default"&&p.setBrutalPalette(p.BRUTAL_DEFAULT_PALETTE),A==="scu-red"&&p.setBrutalPalette(p.getBrutalSelectedPalette().id);return}p.isThemeModeAvailable(A,f)&&p.applyTheme(A,{manual:!0})}a(k,"handleThemeDotClick");function P(){u(c.getElementById("urppp-nav-theme"))}a(P,"syncNavbarThemeUI");function S(){try{let A=c.getElementById("navbar")||c.querySelector(".navbar");if(!A)return;if(c.getElementById("urppp-nav-theme")){P();return}let f=A.querySelector(".navbar-header .navbar-brand")||A.querySelector(".navbar-brand")||A.querySelector(".navbar-header");if(!f)return;let w=c.createElement("div");w.id="urppp-nav-theme",w.innerHTML=['<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>','<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>','<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>','<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">','  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">','    <circle cx="12" cy="12" r="3"></circle>','    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',"  </svg>","</button>"].join(""),f.parentElement?(f.parentElement.style.setProperty("display","flex","important"),f.parentElement.style.setProperty("align-items","center","important"),f.nextSibling?f.parentElement.insertBefore(w,f.nextSibling):f.parentElement.appendChild(w)):f.appendChild(w),w.style.setProperty("display","inline-flex","important"),w.style.setProperty("align-items","center","important"),w.style.setProperty("height","36px","important"),w.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(T=>{T.addEventListener("click",()=>{k(T.dataset.theme),P();try{n.syncSettingsPanelUI()}catch{}})}),w.querySelector("#urppp-nav-settings").addEventListener("click",T=>{T.preventDefault(),T.stopPropagation(),n.openSettingsPanel()}),n.ensureSettingsPanel(),P();try{d.__urpppCleanMode&&d.__urpppCleanMode.inject()}catch{}}catch(A){console.warn("[URP++] navbar theme switch inject failed",A)}}a(S,"injectNavbarThemeSwitch");function y(){let f=c.getElementById("navbar")?.querySelector(".ace-nav");try{S()}catch{}if(!f)return;function w(E,q){Object.entries(q).forEach(([I,L])=>E.style.setProperty(I,L,"important"))}a(w,"force"),Array.from(f.childNodes).forEach(E=>{E.nodeType===Node.TEXT_NODE&&!E.textContent.trim()&&E.remove()}),f.querySelectorAll(":scope > li").forEach(E=>{w(E,{display:"inline-flex","align-items":"center","vertical-align":"middle",margin:"0",padding:"0","text-align":"left"})}),f.querySelectorAll(":scope > li > a").forEach(E=>{w(E,{display:"inline-flex","align-items":"center","justify-content":"center",height:"36px",padding:"0 4px","flex-wrap":"nowrap","vertical-align":"middle","text-decoration":"none"}),E.style.lineHeight="1"}),f.querySelectorAll(":scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa").forEach(E=>{w(E,{top:"auto","vertical-align":"middle","line-height":"1","margin-top":"0"})});let T=f.querySelector(':scope > li > a[href*="customerServiceCenter"]');T&&(w(T,{width:"28px","justify-content":"center"}),T.style.padding="0 4px");let C=c.getElementById("clickdiv"),b=c.getElementById("form-search"),m=c.getElementById("search-input"),v=c.getElementById("intellegenceUDiv");if(v&&(v.style.setProperty("position","relative","important"),v.style.setProperty("z-index","30","important"),v.style.setProperty("display","inline-flex","important"),v.style.setProperty("align-items","center","important"),v.style.setProperty("justify-content","center","important"),v.style.setProperty("width","32px","important"),v.style.setProperty("height","36px","important"),v.style.setProperty("vertical-align","middle","important"),v.style.setProperty("margin","0","important"),v.style.setProperty("padding","0","important")),C&&b){C.removeAttribute("onclick"),w(C,{"background-color":"transparent",position:"relative",display:"inline-flex","align-items":"center","justify-content":"center",width:"32px",height:"32px","border-radius":"8px","line-height":"1","z-index":"30"});let E=c.getElementById("clicki");E&&w(E,{color:"var(--text-secondary)","margin-top":"0"}),C.__urpppNavbarClickBound||(C.__urpppNavbarClickBound=!0,C.addEventListener("mouseenter",()=>C.style.setProperty("background-color","var(--input-bg)","important")),C.addEventListener("mouseleave",()=>C.style.setProperty("background-color","transparent","important")),C.addEventListener("click",L=>{L.preventDefault(),L.stopPropagation(),b.dataset.open==="1"?(b.style.width="0px",b.style.opacity="0",b.dataset.open="0"):(b.style.width="180px",b.style.opacity="1",b.dataset.open="1",m&&setTimeout(()=>m.focus(),50))})),d.__urpppNavbarOutsideClickBound||(d.__urpppNavbarOutsideClickBound=!0,c.addEventListener("click",L=>{let O=c.getElementById("clickdiv"),M=c.getElementById("form-search");!O||!M||M.dataset.open!=="1"||!O.contains(L.target)&&!M.contains(L.target)&&(M.style.width="0px",M.style.opacity="0",M.dataset.open="0")})),w(b,{position:"absolute",right:"34px",top:"50%",transform:"translateY(-50%)",left:"auto",margin:"0","z-index":"10",background:"transparent",border:"none","box-shadow":"none",overflow:"hidden",padding:"0",transition:"width .2s ease, opacity .2s ease"});let q=b.dataset.open==="1"?"160px":"0px";b.style.width!==q&&(b.style.width=q,b.style.opacity=b.dataset.open==="1"?"1":"0"),m&&w(m,{"background-color":"var(--input-bg)",border:"1px solid var(--border)",color:"var(--text)","border-radius":"8px",height:"32px",padding:"0 12px","line-height":"32px",width:"100%"});let I=b.querySelector(".input-icon > .ace-icon.fa-search");I&&(I.style.display="none")}let x=f.querySelector(":scope > li.light-blue > a");if(x){w(x,{display:"inline-flex","align-items":"center",gap:"6px"});let E=x.querySelector(".user-info");E&&(w(E,{display:"inline-flex","align-items":"center",gap:"4px","max-width":"none","white-space":"nowrap","vertical-align":"middle","line-height":"1","margin-top":"-12px"}),Array.from(E.childNodes).forEach(I=>{I.nodeType===Node.TEXT_NODE&&(I.textContent=I.textContent.replace(/\s+/g,"").trim())}),Array.from(E.children).forEach(I=>{w(I,{display:"inline","white-space":"nowrap","vertical-align":"middle","line-height":"1",margin:"0",padding:"0"}),I.tagName==="SMALL"&&I.style.setProperty("font-size","inherit","important")}));let q=x.querySelector(".nav-user-photo");q&&(q.alt=(q.alt||"").replace(/\s+/g,"").trim(),w(q,{"vertical-align":"middle",display:"inline-block",width:"30px",height:"30px"}))}}return a(y,"rebuildNavbar"),{handleThemeDotClick:k,injectNavbarThemeSwitch:S,rebuildNavbar:y,syncNavbarThemeUI:P,syncThemeDotGroup:u}}a(Ei,"createNavbarController");(function(){"use strict";try{let t=typeof navigator<"u"&&navigator.userAgent||"";if(/Android|iPhone|iPad|iPod|Mobile/i.test(t)){document.documentElement&&document.documentElement.classList.add("urppp-mobile");let e=document.querySelector('meta[name="viewport"]');e||(e=document.createElement("meta"),e.name="viewport",e.content="width=device-width, initial-scale=1",(document.head||document.documentElement||document).appendChild(e))}}catch{}let p="1.9.5";if(/^id\./i.test(String(location.hostname||""))){try{let t=oo({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:p},uiDeps:{openSubpanel:a(()=>{},"openSubpanel")}}),e=a(()=>{try{t.bootFromCache("assist")}catch{}},"boot");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}catch{}return}let n={mainRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js",assistRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",changelogPage:"https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md",greasySearch:"https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B",versionJson:"version.json",sourceUrls:a(t=>[`https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`,`https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/${t}`,`https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`],"sourceUrls")},c="urppp_auto_update_check_v1",d="urppp_skin_v1",u=[{id:"apple",name:"类Apple风格",desc:"系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。",ready:!0,dark:!0,dynamic:!0,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"editorial",name:"编辑杂志",desc:"衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"flat",name:"极简扁平",desc:"无阴影、硬边与纯色层次，冷硬清晰。",ready:!0,dark:!0,dynamic:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"organic",name:"自然有机",desc:"奶油底与大地色，温暖圆角。不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"brutal",name:"新野兽派",desc:"高对比画布、粗边框与硬阴影。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,palettes:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"neu",name:"新拟物",desc:"同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}}],k=GM_addStyle(`
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
  `;function S(t){let e=document.createElement("div");return e.className="urppp-inline-loader",e.innerHTML=P+(t?`<div>${t}</div>`:""),e}a(S,"makeInlineLoader");function y(t){return!t||!t.closest?!1:!!t.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]')}a(y,"isPageLoadingOverlay");function A(t){try{(t&&t.querySelectorAll?t:document).querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach(r=>{r.querySelectorAll(".urppp-inline-loader").forEach(o=>{try{o.remove()}catch{}}),r.classList.remove("urppp-loading-active")})}catch{}}a(A,"cleanupPageLoadingOverlays");function f(t){try{let e=t&&t.querySelectorAll?t:document;A(e),e.querySelectorAll("img").forEach(r=>{try{if(!r||r.dataset.urpppReplaced==="1"||y(r))return;let o=(r.getAttribute("src")||r.src||"").toLowerCase();if(!o||!(o.includes("pageloading")||o.includes("page-loading")||o.includes("loading.gif")||o.includes("loading-0")||o.includes("loading-1"))||o.includes("/loading")&&!o.includes("pageloading")&&!o.includes("loading.gif")&&!o.includes("loading-0"))return;r.dataset.urpppReplaced="1";let s=S("");s.style.minHeight="0",s.style.padding="0",r.parentElement&&r.parentElement.replaceChild(s,r)}catch{}}),e.querySelectorAll(".layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content").forEach(r=>{try{if(!r||r.dataset.urpppReplaced==="1")return;if(r.dataset.urpppReplaced="1",r.style.setProperty("background","transparent","important"),r.style.setProperty("background-image","none","important"),!r.querySelector(".urppp-inline-loader")){let o=S("");o.style.minHeight="0",o.style.padding="0",r.appendChild(o)}}catch{}})}catch{}}if(a(f,"replaceNativeLoaders"),!window.__urpppLoaderObs){window.__urpppLoaderObs=!0;let t=!1,e=a(()=>{if(!t){t=!0;try{f(document)}catch{}t=!1}},"run");document.body&&setTimeout(e,0),document.addEventListener("DOMContentLoaded",()=>setTimeout(e,0),{once:!0});let r=a(()=>{new MutationObserver(()=>{clearTimeout(window.__urpppLoaderTimer),window.__urpppLoaderTimer=setTimeout(e,200)}).observe(document.documentElement,{childList:!0,subtree:!0})},"startObs");document.body?r():document.addEventListener("DOMContentLoaded",r,{once:!0})}let w="urppp_theme_v3",T="urppp_accent_v1",C="urppp_accent_presets_v1",b="urppp_scheme_v1",m="urppp_theme_follow_system_v1",v="urppp_clean_default_v1",x="urppp_clean_analysis_v1",E="urppp_apple_edge_line_v1",q="urppp_follow_use_dynamic_v1",I="urppp_brutal_palette_v1",L="urppp_brutal_active_palette_v1",O="urppp_privacy_v1",M="urppp_custom_identity_v1",H="urppp_schedule_first_monday_v1",G="urppp_schedule_json_format_v1",U={completedCourses:"已修课程",failedCourses:"未及格课程",majorGpa:"主修绩点",majorPlan:"主修方案",remainingCourses:"待修课程",passingTotalCredit:"全部及格总学分",passingAvgScore:"全部及格平均成绩",passingAvgGpa:"全部及格平均绩点",passingRequiredCredit:"全部及格必修学分",passingRequiredAvg:"全部及格必修平均",passingRequiredGpa:"全部及格必修绩点",schemeTotalCredit:"方案总学分",schemeAvgScore:"方案平均成绩",schemeAvgGpa:"方案平均绩点",schemeRequiredCredit:"方案必修学分",schemeRequiredAvg:"方案必修平均",schemeRequiredGpa:"方案必修绩点"},et="",it=["#1E3A5F","#B53434","#0F766E","#7C3AED","#C2410C","#0369A1","#BE185D","#365314"],mt="#B53434",V="pink",Q=[{id:"pink",name:"高能粉",desc:"默认配色，热粉强调与酸性绿辅助",accent:"#FF006E",secondary:"#CCFF00",info:"#00D9FF",warning:"#FF9500"},{id:"acid",name:"酸性绿",desc:"酸性绿强调与热粉辅助",accent:"#CCFF00",secondary:"#FF006E",info:"#00D9FF",warning:"#FF9500"},{id:"cyan",name:"电子蓝",desc:"电子蓝强调与亮橙辅助",accent:"#00D9FF",secondary:"#FF9500",info:"#CCFF00",warning:"#FF006E"},{id:"orange",name:"亮橙",desc:"亮橙强调与电子蓝辅助",accent:"#FF9500",secondary:"#00D9FF",info:"#CCFF00",warning:"#FF006E"}],ot="tonal",X=[{id:"paper",name:"纯白卡片",desc:"卡片保持白，仅强调色跟种子"},{id:"tonal",name:"色调点缀",desc:"背景轻染，卡片带同色相浅底"},{id:"soft",name:"柔和粉彩",desc:"卡片明显粉彩/浅色，低对比"},{id:"vibrant",name:"鲜艳",desc:"背景与卡片都更有色，主色更饱和"},{id:"expressive",name:"表现力",desc:"双色拼色：卡片跟主色，背景走协调次色"}],{handleThemeDotClick:ct,injectNavbarThemeSwitch:rt,rebuildNavbar:st,syncNavbarThemeUI:ft,syncThemeDotGroup:Z}=Ei({theme:{BRUTAL_DEFAULT_PALETTE:V,DEFAULT_SEED:mt,applyTheme:Wt,buildSchemePreview:Xt,getAccent:Yt,getBrutalActivePalette:So,getBrutalPaletteById:pr,getBrutalSelectedPalette:Ao,getCurrent:Qt,getScheme:Me,getSkin:Zt,isThemeModeAvailable:or,setBrutalPalette:_o,skinSupportsDark:Ie,skinSupportsDynamic:Ne,skinSupportsFixedPalettes:ko},settings:{ensureSettingsPanel:Ko,openSettingsPanel:Yo,syncSettingsPanelUI:Dt}});function dt(){try{if(!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches))return;let e=document.getElementById("navbar"),r=e?.querySelector(".ace-nav");if(!e||!r)return;let o=document.getElementById("intellegenceUDiv"),s=document.getElementById("clickdiv"),i=document.getElementById("form-search");if(!o){let D=document.createElement("li");D.className="green urppp-search-item",o=document.createElement("div"),o.id="intellegenceUDiv",D.appendChild(o),r.appendChild(D)}let l=o.closest("li")||o.parentElement,g=Array.from(r.children).find(D=>{let R=D.querySelector(":scope > a");if(!R)return!1;let B=R.getAttribute("href")||"",K=(R.getAttribute("title")||"")+" "+(R.textContent||"");return B.includes("customerServiceCenter")||/help|service|support/i.test(B)||!!R.querySelector(".glyphicon-headphones, .fa-headphones, .fa-question-circle, .fa-life-ring")||/帮助|客服|服务|帮助中心/i.test(K)}),h=Array.from(r.children).find(D=>D.classList.contains("light-blue")),_=g||h||null;_&&l&&_!==l&&((l.compareDocumentPosition(_)&Node.DOCUMENT_POSITION_FOLLOWING)!==0||r.insertBefore(l,_)),l&&!l.classList.contains("urppp-search-item")&&l.classList.add("urppp-search-item");let $=l;s?(s.removeAttribute("onclick"),s.setAttribute("role","button"),s.setAttribute("aria-label","搜索功能")):(s=document.createElement("button"),s.type="button",s.id="clickdiv",s.setAttribute("aria-label","搜索功能"),s.innerHTML='<i class="fa fa-search" id="clicki" aria-hidden="true"></i>',o.appendChild(s)),s.style.setProperty("left","8px","important"),s.style.setProperty("position","relative","important"),s.style.setProperty("z-index","31","important"),i||(i=document.createElement("div"),i.id="form-search",i.className="nav-search",i.innerHTML='<form class="form-search"><span class="input-icon"><input type="text" placeholder="查找功能..." class="nav-search-input" id="search-input" autocomplete="off"><i class="ace-icon fa fa-search" aria-hidden="true"></i></span></form>'),$&&i.parentElement!==$&&$.appendChild(i),$&&$.style.setProperty("position","relative","important"),i.classList.add("urppp-desktop-search"),i.style.setProperty("position","absolute","important"),i.style.setProperty("top","50%","important"),i.style.setProperty("right","24px","important"),i.style.setProperty("left","auto","important"),i.style.setProperty("transform","translateY(-50%)","important"),i.style.setProperty("width",i.dataset.open==="1"?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("max-width","calc(100vw - 24px)","important"),i.style.setProperty("opacity",i.dataset.open==="1"?"1":"0","important"),i.style.setProperty("pointer-events",i.dataset.open==="1"?"auto":"none","important"),i.style.setProperty("z-index","1200","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("background","transparent","important"),i.style.setProperty("border","0 solid transparent","important"),i.style.setProperty("box-shadow","none","important"),i.style.setProperty("overflow","visible","important"),i.style.setProperty("transition","width .2s ease, opacity .2s ease","important");let j=i.querySelector("#search-input"),z=i.querySelector("form");if(!j||!z)return;z.style.setProperty("display","block","important"),z.style.setProperty("margin","0","important"),z.style.setProperty("padding","10px","important");let F=i.querySelector(".input-icon");F&&(F.style.setProperty("display","block","important"),F.style.setProperty("position","relative","important")),j.style.setProperty("display","block","important"),j.style.setProperty("width","100%","important"),j.style.setProperty("height","36px","important"),j.style.setProperty("box-sizing","border-box","important"),j.style.setProperty("padding","0 12px","important"),j.style.setProperty("border","1px solid var(--border)","important"),j.style.setProperty("border-radius","var(--radius-sm)","important"),j.style.setProperty("background","var(--input-bg)","important"),j.style.setProperty("color","var(--text)","important");let J=a(D=>{i.dataset.open=D?"1":"0",i.style.setProperty("width",D?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("opacity",D?"1":"0","important"),i.style.setProperty("pointer-events",D?"auto":"none","important"),s.setAttribute("aria-expanded",D?"true":"false"),D&&setTimeout(()=>j.focus(),30)},"setOpen");s.__urpppSearchBound||(s.__urpppSearchBound=!0,s.addEventListener("click",D=>{D.preventDefault(),D.stopImmediatePropagation(),J(i.dataset.open!=="1")},!0)),document.__urpppDesktopSearchOutsideBound||(document.__urpppDesktopSearchOutsideBound=!0,document.addEventListener("click",D=>{let R=document.getElementById("form-search"),B=document.getElementById("clickdiv");!R||R.dataset.open!=="1"||R.classList.contains("urppp-mobile-form-search")||R.closest("#urppp-mobile-search-panel")||R.contains(D.target)||B?.contains(D.target)||J(!1)},!0))}catch(t){console.warn("[URP++] desktop search bind failed",t)}}a(dt,"bindDesktopNavbarSearch");function kt(){if(document.getElementById("urppp-boot-loader"))return;let t=document.createElement("div");t.id="urppp-boot-loader",t.setAttribute("aria-busy","true"),t.innerHTML=`
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
    `;let e=document.documentElement||document.body;e&&e.appendChild(t)}a(kt,"ensureBootLoader");function wt(){try{document.documentElement.classList.add("urppp-ready"),document.body&&(document.body.classList.add("urppp-ready"),document.body.style.removeProperty("opacity"));let t=document.getElementById("urppp-boot-loader");if(!t)return;t.classList.add("urppp-boot-hide"),setTimeout(()=>{try{t.remove()}catch{}},280)}catch{}}a(wt,"hideBootLoader");try{kt()}catch{}window.__urpppBootSafety||(window.__urpppBootSafety=setTimeout(()=>{try{wt()}catch{}},2500));let Ct={default:{name:"简约白",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"#0071E3","--input-bg":"#F5F5F7","--primary":"#0071E3","--primary-hover":"#0077ED","--ring":"rgba(0,113,227,0.28)","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px","--border-w":"0px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},dark:{name:"深邃暗",vars:{"--bg":"#000000","--surface":"#1C1C1E","--text":"#F5F5F7","--text-secondary":"#A1A1A6","--text-muted":"#8E8E93","--border":"#38383A","--border-focus":"#0A84FF","--input-bg":"#2C2C2E","--primary":"#0A84FF","--primary-hover":"#409CFF","--ring":"rgba(10,132,255,0.32)","--shadow":"0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},"scu-red":{name:"动态配色",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"var(--urppp-accent, #B53434)","--input-bg":"#F5F5F7","--primary":"var(--urppp-accent, #B53434)","--primary-hover":"var(--urppp-accent-hover, #962929)","--ring":"var(--urppp-accent-ring, rgba(181,52,52,0.18))","--shadow":"0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'}};function N(t,e,r){t/=255,e/=255,r/=255;let o=Math.max(t,e,r),s=Math.min(t,e,r),i=0,l=0,g=(o+s)/2;if(o!==s){let h=o-s;switch(l=g>.5?h/(2-o-s):h/(o+s),o){case t:i=(e-r)/h+(e<r?6:0);break;case e:i=(r-t)/h+2;break;default:i=(t-e)/h+4;break}i/=6}return{h:i*360,s:l,l:g}}a(N,"rgbToHsl");function Y(t,e,r){t=(t%360+360)%360,e=Math.max(0,Math.min(1,e)),r=Math.max(0,Math.min(1,r));let o=(1-Math.abs(2*r-1))*e,s=o*(1-Math.abs(t/60%2-1)),i=r-o/2,l=0,g=0,h=0;return t<60?(l=o,g=s):t<120?(l=s,g=o):t<180?(g=o,h=s):t<240?(g=s,h=o):t<300?(l=s,h=o):(l=o,h=s),{r:Math.round((l+i)*255),g:Math.round((g+i)*255),b:Math.round((h+i)*255)}}a(Y,"hslToRgb");function tt(t,e,r){let{r:o,g:s,b:i}=Y(t,e,r);return xr(o,s,i)}a(tt,"hslHex");function bt(t){let{r:e,g:r,b:o}=Ze(Gt(t)||mt),s=N(e,r,o);return s.s<.12&&(s.s=.18),s}a(bt,"seedHsl");function ht(t,e,r){let o=Math.max(0,Math.min(100,r))/100,s=Math.max(0,Math.min(.95,e));return tt(t,s,o)}a(ht,"tone");function zt(t){switch(t){case"paper":case"neutral":return{chroma:1,secShift:0,primaryTone:38,whiteCard:!0,bgSeed:.05,surfaceSeed:0,borderSeed:.08};case"soft":return{chroma:1,secShift:10,primaryTone:42,bgSeed:.14,surfaceSeed:.16,borderSeed:.18};case"vibrant":return{chroma:1.15,secShift:14,primaryTone:36,bgSeed:.2,surfaceSeed:.22,borderSeed:.26};case"expressive":return{chroma:1.08,secShift:0,primaryTone:36,duo:!0,bgSeed:.12,surfaceSeed:.15,borderSeed:.18};default:return{chroma:1,secShift:18,primaryTone:40,bgSeed:.12,surfaceSeed:.13,borderSeed:.16}}}a(zt,"schemeProfile");function yt(t,e){let r=Gt(t)||mt,o=Math.max(0,Math.min(.45,Number(e)||0));return o<=.001?"#FFFFFF":Bt("#FFFFFF",r,o)}a(yt,"tintFromHex");function Ft(t){return t<25||t>=345?(t+28)%360:t<55?(t+22)%360:t<90?(t+160)%360:t<160?(t+40)%360:t<210?(t+35)%360:t<265?(t+48)%360:t<310?(t+40)%360:(t+24)%360}a(Ft,"companionHue");function Pt(t){let e=Gt(t)||mt,{h:r,s:o}=bt(e),s=Ft(r),i=Math.min(.72,Math.max(.28,o*.78));return ht(s,i,42)}a(Pt,"companionColor");function It(t,e){let r=Gt(t)||mt,{h:o,s}=bt(r),l=zt(e||ot),g=Math.min(.92,Math.max(.35,s*l.chroma)),h=Pt(r),{h:_}=bt(h),$=ht(o,g,l.primaryTone),j=ht(o,g,Math.max(24,l.primaryTone-10)),z=Bt("#FFFFFF",r,.18),F,J,D;l.whiteCard?(F=Bt("#F1F5F9",Bt("#FFFFFF",r,.08),.5),J="#FFFFFF",D="#E5E7EB"):l.duo?(F=Bt(yt(h,l.bgSeed+.04),"#EEF1F4",.1),J=Bt(yt(r,l.surfaceSeed),"#FFFFFF",.1),D=Bt("#E5E7EB",h,.16)):(F=Bt(yt(r,l.bgSeed),"#E8EBEF",.12),J=Bt(yt(r,l.surfaceSeed),"#FFFFFF",.12),D=Bt("#E5E7EB",r,Math.max(.08,l.borderSeed*.7)));let R=l.whiteCard?"#F8FAFC":Bt(J,yt(l.duo?h:r,Math.max(.05,(l.surfaceSeed||.1)*.55)),.35),B=ht(o,Math.min(.45,g*.55),14),K=fe(ht(o,g*.3,34),.88),ut=fe(ht(o,g*.22,46),.76),vt=fe($,.18),Et="0 4px 12px "+fe($,.1)+", 0 1px 2px "+fe($,.05);return{"--bg":F,"--surface":J,"--text":B,"--text-secondary":K,"--text-muted":ut,"--border":D,"--border-focus":$,"--input-bg":R,"--primary":$,"--primary-hover":j,"--ring":vt,"--shadow":Et,"--radius":"18px","--radius-sm":"12px","--primary-container":z,"--secondary":h}}a(It,"buildMaterialSchemeVars");function Xt(t,e){let r=It(t,e);return{id:e,primary:r["--primary"],bg:r["--bg"],surface:r["--surface"],border:r["--border"],text:r["--text"]}}a(Xt,"buildSchemePreview");function Te(t){let e=Gt(t)||Yt()||mt;return X.map(r=>Object.assign({},r,Xt(e,r.id)))}a(Te,"listSchemePreviews");function ue(){let t=document.documentElement;["--primary","--primary-hover","--border-focus","--ring","--bg","--surface","--text","--text-secondary","--text-muted","--border","--input-bg","--shadow","--primary-container","--secondary"].forEach(e=>t.style.removeProperty(e))}a(ue,"clearInlinePrimaryOverrides");function Yt(){return Gt(GM_getValue(T,""))||""}a(Yt,"getAccent");function Me(){let t=String(GM_getValue(b,ot)||ot);return X.some(e=>e.id===t)?t:ot}a(Me,"getScheme");function sa(t){let e=X.some(r=>r.id===t)?t:ot;return GM_setValue(b,e),e}a(sa,"setScheme");function Ci(t,e){if(!t)return;let r=Gt(t);if(r){if(GM_setValue(T,r),e&&e.scheme&&sa(e.scheme),e&&e.skipTheme){let o=Ka(r,.15),s=fe(r,.15);document.documentElement.style.setProperty("--urppp-accent",r),document.documentElement.style.setProperty("--urppp-accent-hover",o),document.documentElement.style.setProperty("--urppp-accent-ring",s);try{ft()}catch{}try{Dt()}catch{}return}Wt("scu-red");try{ft()}catch{}try{Dt()}catch{}}}a(Ci,"applyAccent");function la(){try{let t=GM_getValue(C,"");if(!t)return it.slice();let e=JSON.parse(t);return Array.isArray(e)?e.filter(r=>typeof r=="string"&&/^#?[0-9a-fA-F]{6}$/i.test(r.replace("#",""))).map(r=>r.startsWith("#")?r.toUpperCase():"#"+r.toUpperCase()):it.slice()}catch{return it.slice()}}a(la,"getAccentPresets");function Pi(t){let e=Gt(t||Yt()||mt);if(!e)return la();let r=la();return r=[e].concat(r.filter(o=>o.toLowerCase()!==e.toLowerCase())),r=r.slice(0,12),GM_setValue(C,JSON.stringify(r)),r}a(Pi,"saveAccentPreset");function Kt(){try{return!!GM_getValue(m,!1)}catch{return!1}}a(Kt,"isThemeFollowSystem");function Er(t){return GM_setValue(m,!!t),!!t}a(Er,"setThemeFollowSystem");function ca(){try{return!!GM_getValue(v,!1)}catch{return!1}}a(ca,"isCleanDefault");function zi(t){return GM_setValue(v,!!t),!!t}a(zi,"setCleanDefault");function da(){try{return GM_getValue(x,"tab")==="direct"}catch{return!1}}a(da,"isCleanAnalysisDirect");function Li(t){return GM_setValue(x,t==="direct"?"direct":"tab"),t==="direct"?"direct":"tab"}a(Li,"setCleanAnalysis");function ye(){try{let t=GM_getValue(E,!0);return t!==!1&&t!==0&&t!=="0"}catch{return!0}}a(ye,"isAppleEdgeLine");function qi(t){return GM_setValue(E,!!t),!!t}a(qi,"setAppleEdgeLine");function ua(){try{return!!GM_getValue(c,!1)}catch{return!1}}a(ua,"isAutoUpdateCheck");function Ti(t){return GM_setValue(c,!!t),!!t}a(Ti,"setAutoUpdateCheck");function Cr(t,e){try{let r=GM_getValue(t,"");if(r&&typeof r=="object")return r;if(typeof r=="string"&&r.trim())return JSON.parse(r)}catch{}return e}a(Cr,"readJsonSetting");function Pr(t,e){return GM_setValue(t,JSON.stringify(e)),e}a(Pr,"writeJsonSetting");function ve(){return no(Cr(O,null))}a(ve,"getPrivacySettings");function ma(t){return Pr(O,no(t))}a(ma,"setPrivacySettings");function $e(){return Sr(Cr(M,null))}a($e,"getCustomIdentity");function fo(t){return Pr(M,Sr(t))}a(fo,"setCustomIdentity");function ha(){let t=Cr(H,{});return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}a(ha,"getScheduleFirstMondayMap");function xo(t,e){if(!t||!/^\d{4}-\d{2}-\d{2}$/.test(String(e||"")))return;let r=ha();r[String(t)]=String(e),Pr(H,r)}a(xo,"rememberScheduleFirstMonday");function zr(){let t="";try{t=GM_getValue(G,"")}catch{}let e=!!(t&&(typeof t!="string"||t.trim())),r=Cr(G,null);try{if(e&&(!r||typeof r!="object"||Array.isArray(r)))throw new Error("配置不是 JSON 对象");let o=r&&typeof r=="object"?r:{},s={enabled:!!o.enabled,mapping:qe(o.mapping||wr)};return et="",s}catch{return et=e?"JSON 映射配置损坏，已回退小爱课程兼容格式":"",{enabled:!1,mapping:qe(wr)}}}a(zr,"getScheduleJsonFormatSettings");function yo(t){let e=t&&typeof t=="object"?t:{},r={enabled:!!e.enabled,mapping:qe(e.mapping||wr)};return et="",Pr(G,r)}a(yo,"setScheduleJsonFormatSettings");function vo(){try{let t=String(location.pathname||"").replace(/\/+$/,"")||"/";return t==="/"||t==="/index"||/\/index\.html?$/i.test(t)}catch{return!1}}a(vo,"isHomePage");function Lr(){try{return!!GM_getValue(q,!1)}catch{return!1}}a(Lr,"isFollowUseDynamic");function ba(t){return GM_setValue(q,!!t),!!t}a(ba,"setFollowUseDynamic");function Mi(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch{return!1}}a(Mi,"systemPrefersDark");function we(){return Mi()&&Ie()?"dark":Lr()&&Ne()?"scu-red":"default"}a(we,"resolveFollowThemeName");function or(t,e){return t==="dark"?Ie(e):t==="scu-red"?Ne(e):t==="default"}a(or,"isThemeModeAvailable");function Wt(t,e){e=e||{},!Ie()&&Kt()&&Er(!1),!Ne()&&Lr()&&ba(!1),e.manual&&Er(!1);let r;e.system||Kt()&&!e.manual?r=we():(r=Ct[t]?t:Qt()||"default",Ct[r]||(r="default")),or(r)||(r="default");let o=Ct[r]||Ct.default;e.skipPersist||GM_setValue(w,r),ue();let s=document.getElementById("urppp-theme-vars")||(()=>{let _=document.createElement("style");return _.id="urppp-theme-vars",(document.head||document.documentElement).appendChild(_),_})(),i=Yt(),l=Object.assign({},o.vars);if(r==="scu-red"){let _=i||mt,$=Me();l=Object.assign(l,It(_,$));let j=l["--primary"]||_,z=l["--primary-hover"]||Ka(j,.12);document.documentElement.style.setProperty("--urppp-accent",j),document.documentElement.style.setProperty("--urppp-accent-hover",z),document.documentElement.style.setProperty("--urppp-accent-ring",l["--ring"]||fe(j,.15)),document.documentElement.style.setProperty("--urppp-seed",_),document.documentElement.style.setProperty("--urppp-scheme",$)}else r==="default"?(document.documentElement.style.setProperty("--urppp-accent","#0071E3"),document.documentElement.style.setProperty("--urppp-accent-hover","#0077ED"),document.documentElement.style.setProperty("--urppp-accent-ring","rgba(0,113,227,0.28)"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme")):(document.documentElement.style.removeProperty("--urppp-accent"),document.documentElement.style.removeProperty("--urppp-accent-hover"),document.documentElement.style.removeProperty("--urppp-accent-ring"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme"));let g=":root {";for(let[_,$]of Object.entries(l))g+=`${_}:${$};`;g+="}",s.textContent=g,document.body&&(document.body.style.fontFamily=o.font);try{let _=document.documentElement;_.dataset.urpppTheme=r,_.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),_.classList.add("urppp-theme-"+r),_.classList.toggle("urppp-theme-follow",Kt()),document.body&&(document.body.dataset.urpppTheme=r,document.body.classList.toggle("urppp-dark",r==="dark"),document.body.classList.toggle("urppp-theme-follow",Kt()))}catch{}try{ee()}catch{}try{ft()}catch{}try{Dt()}catch{}try{Oo()}catch{}try{Ri()}catch{}let h=document.getElementById("urppp-boot-loader");h&&(h.style.fontFamily=o.font)}a(Wt,"applyTheme");function Qt(){return GM_getValue(w,"default")}a(Qt,"getCurrent");function me(t){try{return!!GM_getValue("urppp_theme_css_"+t,"")}catch{return!1}}a(me,"themeDownloaded");function nr(){try{let t=GM_getValue("urppp_local_themes","");return t?JSON.parse(t)||{}:{}}catch{return{}}}a(nr,"localThemes");function $i(t,e){try{let r=nr();r[t]=e,GM_setValue("urppp_local_themes",JSON.stringify(r))}catch{}}a($i,"saveLocalTheme");function Ii(t){try{let e=nr();delete e[t],GM_setValue("urppp_local_themes",JSON.stringify(e))}catch{}}a(Ii,"removeLocalTheme");function ga(t){let e=document.getElementById("urppp-store-theme-"+t);return e||(e=document.createElement("style"),e.id="urppp-store-theme-"+t,e.dataset.urpppStoreTheme=t,(document.head||document.documentElement).appendChild(e)),e}a(ga,"storeThemeStyleEl");function Ni(t){let e=document.getElementById("urppp-store-theme-"+t);e&&e.remove()}a(Ni,"removeStoreThemeStyle");function wo(){u.forEach(t=>{let e="urppp_theme_css_"+t.id,r="";try{r=GM_getValue(e,"")||""}catch{}r&&(ga(t.id).textContent=r);let o="";try{o=GM_getValue("urppp_card_css_"+t.id,"")||""}catch{}o&&Oe([{id:t.id,cardCss:o}])});try{ee()}catch{}}a(wo,"injectAllStoreThemeStyles");function Zt(){let t=GM_getValue(d,"apple"),e=u.find(o=>o.id===t);return e&&e.ready&&(e.installed!==!1||me(e.id))||nr()[t]&&me(t)?t:"apple"}a(Zt,"getSkin");function fa(t,e){let r=t||Zt(),o=u.find(s=>s.id===r);return!!(o&&o[e])}a(fa,"getSkinCapability");function Ie(t){return fa(t,"dark")}a(Ie,"skinSupportsDark");function Ne(t){return fa(t,"dynamic")}a(Ne,"skinSupportsDynamic");function ko(t){return fa(t,"palettes")}a(ko,"skinSupportsFixedPalettes");function pr(t){return Q.find(e=>e.id===t)||Q[0]}a(pr,"getBrutalPaletteById");function Ao(){let t=String(GM_getValue(I,"acid")||"acid"),e=pr(t);return e.id===V?pr("acid"):e}a(Ao,"getBrutalSelectedPalette");function So(){let t=String(GM_getValue(L,V)||V);return pr(t)}a(So,"getBrutalActivePalette");function _o(t,e){let r=e||{},o=pr(t);r.select&&o.id!==V&&GM_setValue(I,o.id),GM_setValue(L,o.id);try{ee()}catch{}try{ft()}catch{}try{Dt()}catch{}try{let s=document.getElementById("urppp-clean-root");s&&typeof s.__syncCleanThemeDots=="function"&&s.__syncCleanThemeDots()}catch{}}a(_o,"setBrutalPalette");function Bi(t){let e=t||Zt();return e==="flat"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"2px","--urppp-card-border":"2px solid var(--text)","--urppp-input-border":"2px solid var(--text)","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:e==="organic"?{"--radius":"22px","--radius-sm":"14px","--shadow":"0 2px 10px rgba(92,64,51,0.06)","--border-w":"1px","--urppp-card-border":"1px solid #E7E0D6","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"1px solid var(--border)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--input-bg)","--urppp-action-color":"var(--primary)","--urppp-menu-radius":"14px","--urppp-menu-border":"1px solid var(--border)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}:e==="editorial"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"none","--urppp-action-radius":"0px","--urppp-action-border":"none","--urppp-action-shadow":"none","--urppp-action-bg":"transparent","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"1px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"transparent","--urppp-menu-color":"var(--text)"}:e==="brutal"?{"--radius":"0px","--radius-sm":"0px","--shadow":"6px 6px 0 #000","--border-w":"3px","--urppp-card-border":"3px solid #000","--urppp-input-border":"2px solid #000","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"3px 3px 0 var(--text)","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"3px 3px 0 var(--text)","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:e==="neu"?{"--radius":"16px","--radius-sm":"12px","--shadow":"5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"1px solid rgba(38,49,66,.16)","--urppp-input-shadow":"inset 2px 2px 4px rgba(38,49,66,.16), inset -2px -2px 4px rgba(255,255,255,.72)","--urppp-action-radius":"12px","--urppp-action-border":"none","--urppp-action-shadow":"var(--shadow)","--urppp-action-bg":"var(--bg)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"12px","--urppp-menu-border":"none","--urppp-menu-shadow":"var(--shadow)","--urppp-menu-bg":"var(--bg)","--urppp-menu-color":"var(--text)"}:{"--radius":"18px","--radius-sm":"12px","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--border-w":"0px","--urppp-card-border":e==="apple"&&ye()?"1px solid rgba(0,0,0,0.08)":"none","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"none","--urppp-action-shadow":"0 2px 6px var(--ring)","--urppp-action-bg":"var(--primary)","--urppp-action-color":"var(--surface)","--urppp-menu-radius":"12px","--urppp-menu-border":e==="apple"&&ye()?"1px solid var(--border)":"none","--urppp-menu-shadow":"0 1px 3px rgba(0,0,0,.08)","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}}a(Bi,"getSkinShapeOverrides");function Be(){try{let t=Zt();if(t==="apple")return ye()?"1px solid rgba(0,0,0,0.08)":"none";if(t==="flat")return"2px solid var(--text)";if(t==="organic")return"1px solid #E7E0D6";if(t==="brutal")return"3px solid var(--text)";if(t==="editorial"||t==="neu")return"none"}catch{}return"1px solid var(--border)"}a(Be,"urpppCardBorderValue");function ee(){let t=Zt();try{document.documentElement.setAttribute("data-urppp-skin",t)}catch{}try{document.body&&document.body.setAttribute("data-urppp-skin",t)}catch{}try{let e=t==="apple"&&ye();document.documentElement.setAttribute("data-urppp-apple-edge",e?"1":"0"),document.body&&document.body.setAttribute("data-urppp-apple-edge",e?"1":"0")}catch{}try{let e=document.getElementById("urppp-skin-vars")||(()=>{let i=document.createElement("style");return i.id="urppp-skin-vars",(document.head||document.documentElement).appendChild(i),i})(),r=Bi(t),o=":root, html[data-urppp-skin] {";if(Object.keys(r).forEach(i=>{o+=i+":"+r[i]+";"}),o+="}",o+=".urppp-nav-dot.urppp-theme-disabled{opacity:.42!important;cursor:not-allowed!important;box-shadow:none!important;filter:grayscale(1)!important;transform:none!important;}",t==="flat"||t==="organic"||t==="brutal"||t==="neu"){if(t==="brutal"){let i=So();o+='html[data-urppp-skin="brutal"]{--brutal-accent:'+i.accent+";--brutal-secondary:"+i.secondary+";--brutal-info:"+i.info+";--brutal-warning:"+i.warning+";}"}e.textContent=o;return}if(t==="apple"){let i=ye(),l=i?"1px solid rgba(0,0,0,0.08)":"none",g=i?"1px solid rgba(255,255,255,0.10)":"none",h=i?"1px solid rgba(0,0,0,0.06)":"none";o+=['html[data-urppp-skin="apple"]{--shadow:0 6px 20px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);--border:'+(i?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.04)")+";}",'html[data-urppp-skin="apple"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="apple"]{--shadow:0 10px 28px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.04);--border:'+(i?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)")+";}",'html[data-urppp-skin="apple"] .widget-box,html[data-urppp-skin="apple"] .widget-box.transparent,html[data-urppp-skin="apple"] .panel,html[data-urppp-skin="apple"] .panel-default,html[data-urppp-skin="apple"] .well,html[data-urppp-skin="apple"] .thumbnail,html[data-urppp-skin="apple"] .infobox,html[data-urppp-skin="apple"] .profile-user-info,html[data-urppp-skin="apple"] .profile-user-info-striped,html[data-urppp-skin="apple"] .modal-content,html[data-urppp-skin="apple"] fieldset,html[data-urppp-skin="apple"] .urppp-stat-card,html[data-urppp-skin="apple"] .urppp-db-card,html[data-urppp-skin="apple"] .urppp-db-panel,html[data-urppp-skin="apple"] #urppp-dashboard .widget-box,html[data-urppp-skin="apple"] #urppp-root .uc,html[data-urppp-skin="apple"] #urppp-clean-root .uc-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-modal,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top,html[data-urppp-skin="apple"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="apple"] .urppp-card,html[data-urppp-skin="apple"] #urppp-dashboard .urppp-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+l+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"].urppp-theme-dark .widget-box,html[data-urppp-skin="apple"].urppp-theme-dark .panel,html[data-urppp-skin="apple"].urppp-theme-dark .profile-user-info,html[data-urppp-skin="apple"].urppp-theme-dark .modal-content,html[data-urppp-skin="apple"].urppp-theme-dark .urppp-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-root .uc{border:'+g+"!important;}",'html[data-urppp-skin="apple"] .page-content .widget-box,html[data-urppp-skin="apple"] #page-content-template .widget-box,html[data-urppp-skin="apple"] html body .page-content .profile-user-info.setLabelWidth{border:'+l+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"] .btn,html[data-urppp-skin="apple"] .btn-default,html[data-urppp-skin="apple"] .btn-white,html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] .btn-success,html[data-urppp-skin="apple"] .btn-warning,html[data-urppp-skin="apple"] .btn-danger,html[data-urppp-skin="apple"] a.btn,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn{border-color:transparent!important;box-shadow:0 1px 2px rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn.primary{border:none!important;}','html[data-urppp-skin="apple"] .table,html[data-urppp-skin="apple"] table,html[data-urppp-skin="apple"] .table-bordered,html[data-urppp-skin="apple"] .table-bordered>thead>tr>th,html[data-urppp-skin="apple"] .table-bordered>tbody>tr>td{border-color:rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"].urppp-theme-dark .table,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>thead>tr>th,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>tbody>tr>td{border-color:rgba(255,255,255,.06)!important;}','html[data-urppp-skin="apple"] .nav-tabs>li>a,html[data-urppp-skin="apple"] .nav-tabs{border-color:transparent!important;}','html[data-urppp-skin="apple"] .urppp-nav-link{border:none!important;}','html[data-urppp-skin="apple"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="apple"] #urppp-clean-root .uc-grid-cell{border-color:'+(i?"rgba(0,0,0,0.06)":"transparent")+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+h+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-dots span{border-radius:50%!important;border:2px solid var(--border)!important;box-shadow:none!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important;background-clip:padding-box!important;flex:0 0 auto!important;}','html[data-urppp-skin="apple"] .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary)!important;box-shadow:0 0 0 3px var(--ring)!important;}','html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-dots span[data-theme="scu-red"]{border-radius:50%!important;border:2px solid var(--border)!important;}'].join("")}else t==="editorial"&&(o+=`
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
        `);e.textContent=o;let s=document.head||document.documentElement;e.parentNode===s&&s.lastElementChild!==e&&s.appendChild(e)}catch(e){try{console.warn("[URP++] applySkinAttr",e)}catch{}}setTimeout(()=>{try{Vt(document)}catch{}},0)}a(ee,"applySkinAttr");function Eo(t){let e=u.find(s=>s.id===t&&s.ready&&(s.installed!==!1||me(s.id))),r=!e&&nr()[t]&&me(t)?{id:t,ready:!0,installed:!1}:null,o=e||r;if(!o)return!1;GM_setValue(d,o.id);try{o.dynamic||ba(!1),!o.dark&&Kt()&&Er(!1);let s=Kt(),i=s?we():Qt(),l=or(i,e.id)?i:"default";ee(),Wt(l,{system:s})}catch{try{ee()}catch{}}try{Dt()}catch{}try{ft()}catch{}try{let s=document.getElementById("urppp-clean-root");s&&typeof s.__syncCleanThemeDots=="function"&&s.__syncCleanThemeDots()}catch{}return!0}a(Eo,"setSkin");function Fi(){if(!window.__urpppSystemThemeBound&&window.matchMedia){window.__urpppSystemThemeBound=!0;try{let t=window.matchMedia("(prefers-color-scheme: dark)"),e=a(()=>{if(Kt())try{Wt(we(),{system:!0})}catch{}},"onChange");t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}catch{}}}a(Fi,"bindSystemThemeListener");try{Kt()?Wt(we(),{system:!0}):Wt(Qt())}catch{}try{ee()}catch{}try{Fi()}catch{}function Di(t){let e=String(document.body&&document.body.innerText||t&&t.innerText||"").replace(/\s+/g," ").trim(),r=[/token\s*校验失败[！!]?/i,/令牌\s*校验失败[！!]?/i,/验证码.{0,12}(?:错误|失败|过期)[！!]?/i,/(?:用户名|账号|学号).{0,12}(?:密码).{0,12}(?:错误|失败)[！!]?/i,/登录.{0,12}(?:错误|失败)[！!]?/i];for(let o of r){let s=e.match(o);if(s)return s[0].trim()}return""}a(Di,"extractLoginErrorMessage");function Co(){let t=location.pathname,e=document.getElementById("formContent"),r=document.querySelector(".form-signin");if(!e||!r){setTimeout(Co,50);return}if(e.querySelector(":scope > #urppp-root"))return;let o=Di(e),s=r.querySelector('a[onclick*="toModifyPwd"]'),i=(()=>{let R=e.querySelector(".fadeIn.first svg");return R?R.outerHTML:""})(),l=(()=>{let R=document.querySelector("#tocas a");return R?R.href:"https://id.scu.edu.cn/"})();for(let R of e.children)R.style.display="none";e.style.cssText="max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;";let g=location.pathname==="/loginEn",h=a((R,B)=>g?B:R,"t");e.insertAdjacentHTML("afterbegin",`
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
          <h1>${h("四川大学教务管理系统","SCU Academic System")}</h1>
          <p>${h("学生端 · 欢迎登录","Student Portal · Welcome")}</p>
        </div>

        <div class="ut" id="urppp-tabs">
          <button class="ac" data-mode="account">${h("账号登录","Account")}</button>
          <button data-mode="sso">${h("统一认证","SSO")}</button>
        </div>

        ${o?`<div class="urppp-login-error" role="alert">${at(o)}</div>`:""}

        <div class="ufb" id="urppp-form">
          <div class="ufg">
            <label class="ufl" for="urppp-user">${h("学号","Student ID")}</label>
            <input class="ui" id="urppp-user" type="text" placeholder="${h("请输入学号","Enter student ID")}" autocomplete="username">
          </div>
          <div class="ufg">
            <label class="ufl" for="urppp-pass">${h("密码","Password")}</label>
            <input class="ui" id="urppp-pass" type="password" placeholder="${h("请输入密码","Enter password")}" autocomplete="current-password">
          </div>
          <div class="ucr">
            <div class="ufg ufg-cap">
              <label class="ufl" for="urppp-cap">${h("验证码","Captcha")}</label>
              <div class="ucap-input-wrap">
                <input class="ui" id="urppp-cap" type="text" placeholder="${h("请输入","Enter")}" maxlength="4" autocomplete="off">
                <div class="uci-wrap" id="urppp-capwrap" title="${h("点击刷新","Refresh")}">
                  <img class="uci" id="urppp-capimg" src="" alt="Captcha">
                </div>
              </div>
            </div>
          </div>
          <button class="ubtn" id="urppp-submit">${h("登 录","Sign In")}</button>
        </div>

        <div class="uft">
          <a href="javascript:void(0)" id="urppp-forgot">${h("忘记密码？","Forgot password?")}</a>
          <a href="${g?"/login":"/loginEn"}">${g?"中文":"EN"}</a>
        </div>

        <div class="us" id="urppp-dots">
          <span data-theme="default" title="简约白" style="background:#F5F5F7;box-shadow:inset 0 0 0 1px #D2D2D7"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="动态配色" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);let _=e.querySelector("#urppp-root");[["#urppp-user","#input_username"],["#urppp-pass","#input_password"],["#urppp-cap","#input_checkcode"]].forEach(([R,B])=>{let K=_.querySelector(R),ut=document.querySelector(B);K&&ut&&(ut.value&&(K.value=ut.value),K.addEventListener("input",()=>{ut.value=K.value}))});let $=_.querySelector("#urppp-capimg"),j=_.querySelector("#urppp-capwrap"),z=document.querySelector(".form-signin img");if($&&z){$.src=z.src;let R=a(()=>{let B=z.src.replace(/\?.*/,"")+"?"+Date.now();z.src=B,$.src=B},"refreshCap");j?j.addEventListener("click",R):$.addEventListener("click",R)}_.querySelectorAll(".ut button").forEach(R=>{R.addEventListener("click",()=>{if(R.dataset.mode==="sso"){location.href=l;return}_.querySelectorAll(".ut button").forEach(ut=>ut.classList.remove("ac")),R.classList.add("ac");let B=_.querySelector("#urppp-form"),K=_.querySelector("#urppp-sso");B&&(B.style.display="block"),K&&(K.style.display="none")})});let F=_.querySelector("#urppp-submit");F.addEventListener("click",()=>{if(F.dataset.submitting==="1")return;F.dataset.submitting="1",F.disabled=!0;let R=document.getElementById("loginButton");R?R.click():typeof r.requestSubmit=="function"?r.requestSubmit():r.submit(),setTimeout(()=>{F.dataset.submitting="0",F.disabled=!1},1500)}),_.querySelectorAll(".ui").forEach(R=>{R.addEventListener("keydown",B=>{B.key==="Enter"&&F.click()})}),_.querySelector("#urppp-forgot").addEventListener("click",R=>{R.preventDefault(),s&&s.click()});let J=_.querySelector("#urppp-dots"),D=a(()=>{if(!J)return;let R=Qt();J.querySelectorAll("span").forEach(K=>{K.classList.toggle("ac",K.dataset.theme===R)});let B=J.querySelector('span[data-theme="scu-red"]');if(B){let K=Yt()||mt;try{let ut=Xt(K,Me());B.style.background="linear-gradient(135deg, "+ut.primary+" 0 55%, "+ut.surface+" 55% 100%)"}catch{B.style.background=K}}},"syncLoginDots");J&&(J.querySelectorAll("span").forEach(R=>{R.addEventListener("click",()=>{Wt(R.dataset.theme,{manual:!0}),D()})}),D()),console.log("[URP++] 登录界面已重建"),setTimeout(()=>{document.body.classList.add("urppp-ready"),wt()},100)}a(Co,"rebuild");let{beautifyBreadcrumbs:qr}=Si({});function xa(){try{document.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(t=>{if(t.classList.contains("setLabelWidth")||t.classList.contains("urppp-query-form")||t.querySelector(".urppp-query-pair"))return;let e=Array.from(t.querySelectorAll(":scope > .profile-info-row, .profile-info-row"));!e.length||e.some(o=>Array.from(o.children).filter(s=>s.classList&&s.classList.contains("profile-info-name")).length>=2)||(t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("display","block","important"),$r(t),e.forEach(o=>{o.classList.remove("urppp-query-row","urppp-dual-pair"),delete o.dataset.urpppQueryDone,delete o.dataset.urpppQueryCols;let s=Array.from(o.querySelectorAll(":scope > .urppp-query-pair"));if(s.length){let i=[];for(s.forEach(l=>Array.from(l.children).forEach(g=>i.push(g)));o.firstChild;)o.removeChild(o.firstChild);i.forEach(l=>o.appendChild(l))}o.style.setProperty("display","grid","important"),o.style.setProperty("grid-template-columns","140px minmax(0,1fr)","important"),o.style.setProperty("align-items","stretch","important"),o.style.setProperty("width","100%","important"),Array.from(o.children).forEach(i=>{i.classList&&(i.style.setProperty("float","none","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("box-sizing","border-box","important"))})}))})}catch(t){console.warn("[URP++] single pair profile fix failed",t)}}a(xa,"fixSinglePairProfileForms");function Tr(){let t=document.querySelector(".page-content")||document.getElementById("page-content-template");t&&(t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(e=>{if(!e.querySelector(".setLabelWidth"))return;let r=e.querySelector(".setLabelWidth");r&&(e.querySelectorAll("h4.header, h3.header, .header.smaller, .header").forEach(o=>{r.contains(o)||o.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING&&(o.classList.add("urppp-section-label"),["background","background-color","background-image","border","box-shadow","border-radius","padding","margin","min-height"].forEach(s=>{o.style.removeProperty(s)}),o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important"),o.style.setProperty("background-image","none","important"),o.style.setProperty("border","0 none transparent","important"),o.style.setProperty("box-shadow","none","important"),o.style.setProperty("border-radius","0","important"),o.style.setProperty("padding","4px 2px 10px","important"),o.style.setProperty("margin","0 0 8px 0","important"),o.style.setProperty("min-height","0","important"))}),r.classList.remove("urppp-query-form"),r.style.setProperty("padding","0","important"),r.style.setProperty("overflow","hidden","important"),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("border",Be(),"important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("box-shadow","none","important"))}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(e=>{e.classList.remove("urppp-query-form"),e.querySelectorAll(".profile-info-row").forEach(r=>{r.classList.remove("urppp-query-row"),delete r.dataset.urpppQueryDone,delete r.dataset.urpppQueryCols;let o=Array.from(r.querySelectorAll(":scope > .urppp-query-pair"));if(o.length){let s=[];for(o.forEach(i=>{Array.from(i.children).forEach(l=>s.push(l))});r.firstChild;)r.removeChild(r.firstChild);s.forEach(i=>r.appendChild(i))}})}),t.querySelectorAll(".setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row").forEach(e=>{let r=Array.from(e.querySelectorAll(":scope > .urppp-query-pair"));if(r.length){let i=[];for(r.forEach(l=>{Array.from(l.children).forEach(g=>i.push(g))});e.firstChild;)e.removeChild(e.firstChild);i.forEach(l=>e.appendChild(l))}e.classList.remove("urppp-query-row"),delete e.dataset.urpppQueryDone,delete e.dataset.urpppQueryCols;let o=Array.from(e.children).filter(i=>i.classList&&(i.classList.contains("profile-info-name")||i.classList.contains("profile-info-value")));o.filter(i=>i.classList.contains("profile-info-name")).length>=2?(e.classList.add("urppp-dual-pair"),e.style.setProperty("display","grid","important"),e.style.setProperty("grid-template-columns","112px minmax(140px,1fr) 112px minmax(140px,1fr)","important"),e.style.setProperty("align-items","stretch","important"),e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("float","none","important"),o.forEach(i=>{i.style.setProperty("float","none","important"),i.style.setProperty("clear","none","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("min-width","0","important"),i.style.setProperty("box-sizing","border-box","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.classList.contains("profile-info-value")?(i.style.removeProperty("width"),i.style.setProperty("width","auto","important"),i.style.setProperty("justify-content","flex-start","important"),i.style.setProperty("white-space","normal","important"),i.style.setProperty("word-break","normal","important")):(i.style.setProperty("justify-content","flex-end","important"),i.style.setProperty("white-space","nowrap","important"))})):e.classList.remove("urppp-dual-pair")}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(e=>{e.classList.remove("urppp-query-form"),e.style.cssText=(e.getAttribute("style")||"").replace(/padding\s*:[^;]+;?/gi,""),e.style.setProperty("background","var(--surface)","important"),e.style.setProperty("border-radius","12px","important"),e.style.setProperty("overflow","hidden","important"),e.style.setProperty("border",Be(),"important"),e.style.setProperty("box-shadow","none","important"),e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("box-sizing","border-box","important"),e.style.setProperty("margin","0 0 16px 0","important"),e.style.setProperty("padding","0","important");let r=e.closest(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8")||e.parentElement;r&&Array.from(r.querySelectorAll("h4.header, h3.header, .header.smaller")).forEach(o=>{e.contains(o)||o.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING&&(o.classList.add("urppp-section-label"),o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important"),o.style.setProperty("background-image","none","important"),o.style.setProperty("border","0 none transparent","important"),o.style.setProperty("box-shadow","none","important"),o.style.setProperty("border-radius","0","important"),o.style.setProperty("padding","4px 2px 10px","important"),o.style.setProperty("margin","0 0 8px 0","important"),o.style.setProperty("min-height","0","important"))})}),t.querySelectorAll(".urppp-col-row").forEach(e=>{e.classList.remove("urppp-col-row"),["display","flex-wrap","gap","align-items","width","box-sizing"].forEach(r=>e.style.removeProperty(r))}),t.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach(e=>{["float","flex","width","max-width","padding-left","padding-right","box-sizing"].forEach(r=>{e.style.getPropertyPriority(r)==="important"&&e.style.removeProperty(r)}),e.style.setProperty("padding-left","0","important"),e.style.setProperty("box-sizing","border-box","important")}),t.querySelectorAll(".col-xs-4, .col-sm-4, .col-md-4").forEach(e=>{e.style.setProperty("padding-right","16px","important")}),t.querySelectorAll(".col-xs-8, .col-sm-8, .col-md-8").forEach(e=>{e.style.setProperty("padding-left","0","important"),e.style.setProperty("padding-right","0","important")}),t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(e=>{e.querySelector(".setLabelWidth")&&e.querySelectorAll(":scope > h4.header, :scope > .header, :scope > .header.smaller").forEach(r=>{r.style.cssText+=";background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;border-radius:0!important;padding:4px 2px 10px!important;margin:0 0 8px 0!important;min-height:0!important;"})}),t.querySelectorAll(".urppp-section-title-wrap").forEach(e=>{let r=e.querySelector("h4.header, h3.header, h5.header, .header.smaller");if(!r){e.remove();return}let o=e.nextElementSibling;for(;o&&!o.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]');)o=o.nextElementSibling;let s=o&&(o.querySelector(".col-xs-4, .col-sm-4, .col-md-4")||Array.from(o.children).find(i=>/col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(i.className||"")));s&&(s.insertBefore(r,s.firstChild),delete r.dataset.urpppHoisted,r.style.removeProperty("width"),r.style.removeProperty("max-width"),r.style.removeProperty("margin-left"),r.style.removeProperty("margin-right"),r.style.removeProperty("box-sizing"),r.style.removeProperty("position"),r.style.removeProperty("left")),e.remove()}))}a(Tr,"alignRollInfoLayout");function Mr(){let t=typeof unsafeWindow<"u"?unsafeWindow:window;return t.jQuery||t.$||window.jQuery||window.$||null}a(Mr,"pageJQuery");function ji(t){return t?t.id&&String(t.id).indexOf("pagination_pageSize_")===0?!0:!!(t.closest&&t.closest('#urppagebar, .urppagebreak, .dataTables_paginate, [id^="sample-table-2_paginate_"]')):!1}a(ji,"isPagebarSelect");function Po(t){if(t){try{let e=Mr();e&&e.fn&&e(t).data("chosen")&&e(t).chosen("destroy")}catch{}try{if(t.parentElement&&t.parentElement.querySelectorAll(":scope > .chosen-container").forEach(e=>{try{e.remove()}catch{}}),t.nextElementSibling&&t.nextElementSibling.classList.contains("chosen-container"))try{t.nextElementSibling.remove()}catch{}}catch{}t.classList.remove("urppp-chosen-hidden","chzn-done","chosen");try{delete t.dataset.urpppChosen}catch{}t.style.setProperty("display","inline-block","important")}}a(Po,"destroyPagebarChosen");let zo=0,Lo=!1;function Oi(){if(Lo)return;Lo=!0;let t=a(e=>{if(Date.now()<zo){try{e.preventDefault()}catch{}try{e.stopPropagation()}catch{}}},"guard");document.addEventListener("mousedown",t,!0),document.addEventListener("mouseup",t,!0),document.addEventListener("click",t,!0)}a(Oi,"bindChosenPickGuard");function ya(t){if(!t||t.__urpppChosenNoPierce)return;t.__urpppChosenNoPierce=!0,Oi();let e=t.querySelector(".chosen-drop"),r=a(o=>{let s=o.target;!s||!s.closest||!s.closest(".chosen-results li")||(zo=Date.now()+350)},"onPick");t.addEventListener("mouseup",r,!1),t.addEventListener("touchend",r,!1),e&&(e.addEventListener("mouseup",r,!1),e.addEventListener("touchend",r,!1))}a(ya,"bindChosenNoPierce");function va(t=document){try{t.querySelectorAll(".chosen-container").forEach(ya)}catch{}}a(va,"bindAllChosenNoPierce");function he(){try{let t=Mr();if(!t||!t.fn||typeof t.fn.chosen!="function")return!1;let e=document.querySelectorAll(".profile-user-info, .urppp-query-form, .profile-info-row, form"),r=new Set,o=[];if(e.forEach(s=>{s.querySelectorAll("select").forEach(i=>{r.has(i)||(r.add(i),o.push(i))})}),document.querySelectorAll("select.value_element, .profile-info-value > select").forEach(s=>{r.has(s)||(r.add(s),o.push(s))}),o.forEach(s=>{if(!s||s.multiple||s.disabled||s.size&&s.size>1)return;if(ji(s)){Po(s);return}let i=t(s);if(!!i.data("chosen")||s.classList.contains("chzn-done")||!!(s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container"))||!!(s.parentElement&&s.parentElement.querySelector(":scope > .chosen-container"))){s.dataset.urpppChosen="1",s.classList.add("urppp-chosen-hidden"),s.style.setProperty("display","none","important");let g=s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container")?s.nextElementSibling:s.parentElement&&s.parentElement.querySelector(":scope > .chosen-container");g&&ya(g);return}try{s.classList.contains("select")||s.classList.add("select");try{i.data("chosen")&&i.chosen("destroy")}catch{}i.chosen({allow_single_deselect:!0,search_contains:!0,width:"100%",no_results_text:"无匹配项",disable_search_threshold:0}),s.dataset.urpppChosen="1",s.classList.add("urppp-chosen-hidden"),s.style.setProperty("display","none","important");let g=s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container")?s.nextElementSibling:s.parentElement&&s.parentElement.querySelector(".chosen-container");g&&(g.style.setProperty("width","100%","important"),g.style.setProperty("min-width","0","important"),g.style.setProperty("display","block","important")),g&&ya(g)}catch(g){console.warn("[URP++] chosen init failed",s,g)}}),!window.__urpppChosenHtmlPatch){window.__urpppChosenHtmlPatch=!0;let s=t.fn.html;t.fn.html=function(){let i=s.apply(this,arguments);if(arguments.length)try{this.filter("select").add(this.find("select")).each(function(){let l=t(this);if(l.data("chosen")||l.next(".chosen-container").length)try{l.trigger("chosen:updated")}catch{}})}catch{}return i}}return!0}catch(t){return console.warn("[URP++] ensureQueryChosen failed",t),!1}}a(he,"ensureQueryChosen");function qo(){if(window.__urpppChosenScheduleBound)return;window.__urpppChosenScheduleBound=!0,[0,200,600,1500,3e3].forEach(o=>setTimeout(()=>{he(),va()},o));let e=0,r=setInterval(()=>{e+=1;let o=he();va(),(o&&e>3||e>15)&&clearInterval(r)},500)}a(qo,"scheduleEnsureQueryChosen");let{beautifyPagebar:To}=$p({destroyPagebarChosen:Po}),{scheduleBeautifyPagebar:Mo}=Mp({beautifyPagebar:To});function wa(){try{document.querySelectorAll("#drag-ul, ul#drag-ul").forEach(t=>{if(!t)return;let e=Array.from(t.children).filter(r=>r.tagName==="LI");if(!e.length){t.classList.add("urppp-empty"),t.style.setProperty("display","none","important");let r=t.closest("#xq-section, .widget-main, .widget-body");r&&!r.querySelector("li")&&(r.classList.add("urppp-empty"),r.style.setProperty("display","none","important"));return}t.classList.remove("urppp-empty"),t.classList.add("urppp-drag-ul"),t.style.removeProperty("display"),t.style.setProperty("height","auto","important"),t.style.setProperty("min-height","0","important"),e.forEach(r=>{let o=(r.textContent||"").replace(/\s+/g," ").trim(),s=(r.getAttribute("onclick")||"").includes("goDetail")||r.classList.contains("ui-selectee")||r.classList.contains("jc-future")||!!r.querySelector("a");!s&&/校区/.test(o)&&o.length<=12?(r.classList.add("xq-section"),r.classList.remove("ui-selectee","jc-future","urppp-building-active")):s&&!r.classList.contains("jc-future")&&r.classList.add("ui-selectee")})}),window.__urpppBuildingActiveBound||(window.__urpppBuildingActiveBound=!0,document.addEventListener("click",t=>{let e=t.target&&t.target.closest?t.target.closest("#drag-ul > li"):null;if(!e||e.classList.contains("xq-section")||e.classList.contains("jc-future"))return;let r=e.parentElement;r&&(r.querySelectorAll("li.urppp-building-active, li.ui-selected").forEach(o=>{o.classList.remove("urppp-building-active","ui-selected")}),e.classList.add("urppp-building-active","ui-selected"))},!0))}catch(t){console.warn("[URP++] free classroom list beautify failed",t)}}a(wa,"beautifyFreeClassroomList");function $r(t){if(!t||!t.style)return;if(t.classList.contains("setLabelWidth")){t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",Be(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 16px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important");return}let e=!!(t.closest&&t.closest(".widget-box, .widget-main, .widget-body, .panel"));t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("min-width","0","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("clear","both","important");let r=t.parentElement&&t.parentElement.tagName==="FORM"?t.parentElement:null;r&&(r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("display","block","important"),r.style.setProperty("float","none","important"),r.style.setProperty("box-sizing","border-box","important"),r.style.setProperty("margin","0","important"));let o=t.closest&&t.closest(".tab-pane, .tab-content");if(o&&(o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("box-sizing","border-box","important")),e){t.style.setProperty("background","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("margin","0","important"),t.style.setProperty("box-shadow","none","important");return}t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",Be(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 18px 0","important"),!t.classList.contains("setLabelWidth")&&(t.classList.contains("urppp-query-form")||!!t.querySelector(".urppp-query-pair, .chosen-container"))?(t.style.setProperty("padding","14px 16px","important"),t.style.setProperty("overflow","visible","important")):(t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important"))}a($r,"ensureProfileCardShell");function ir(){try{he(),document.querySelectorAll(".page-content .profile-user-info, #page-content-template .profile-user-info").forEach(o=>{$r(o)});let t=a(o=>{let s=o.closest(".profile-user-info, .urppp-query-form")||o.parentElement;if(!s)return Math.min(Math.max(o.querySelectorAll(":scope > .urppp-query-pair").length,1),4);let i=0;return s.querySelectorAll(":scope > .profile-info-row, .profile-info-row").forEach(l=>{let g=l.querySelectorAll(":scope > .urppp-query-pair").length;g>i&&(i=g)}),Math.min(Math.max(i,1),4)},"getFormQueryCols"),e=a(o=>{let s=Array.from(o.querySelectorAll(":scope > .urppp-query-pair")),i=t(o);o.classList.add("urppp-query-row"),o.style.setProperty("display","grid","important"),o.style.removeProperty("grid-template-columns"),o.style.setProperty("column-gap","14px","important"),o.style.setProperty("row-gap","10px","important"),o.style.setProperty("align-items","center","important"),o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("box-sizing","border-box","important"),o.dataset.urpppQueryCols=String(i),s.forEach(l=>{l.style.removeProperty("grid-column")}),s.forEach(l=>{l.style.setProperty("display","flex","important"),l.style.setProperty("align-items","center","important"),l.style.setProperty("width","100%","important"),l.style.setProperty("min-width","0","important"),l.style.setProperty("max-width","100%","important"),l.style.setProperty("box-sizing","border-box","important"),l.style.removeProperty("flex");let g=l.querySelector(".profile-info-name"),h=l.querySelector(".profile-info-value");g&&(g.style.setProperty("float","none","important"),g.style.setProperty("display","flex","important"),g.style.setProperty("align-items","center","important"),g.style.setProperty("justify-content","flex-end","important"),g.style.setProperty("flex","0 0 var(--urppp-qlabel, 84px)","important"),g.style.setProperty("width","var(--urppp-qlabel, 84px)","important"),g.style.setProperty("min-width","var(--urppp-qlabel, 84px)","important"),g.style.setProperty("max-width","var(--urppp-qlabel-max, 96px)","important"),g.style.setProperty("margin","0","important"),g.style.setProperty("margin-left","0","important"),g.style.setProperty("padding","0 8px 0 0","important"),g.style.setProperty("background","transparent","important"),g.style.setProperty("border","none","important"),g.style.setProperty("border-right","none","important")),h&&(h.style.setProperty("float","none","important"),h.style.setProperty("display","flex","important"),h.style.setProperty("align-items","center","important"),h.style.setProperty("flex","1 1 auto","important"),h.style.setProperty("width","auto","important"),h.style.setProperty("min-width","0","important"),h.style.setProperty("max-width","none","important"),h.style.setProperty("margin","0","important"),h.style.setProperty("margin-left","0","important"),h.style.setProperty("padding","0","important"),h.style.setProperty("background","transparent","important"),h.style.setProperty("border","none","important"),h.querySelectorAll("input, select, .chosen-container, .form-control").forEach(_=>{_.style.setProperty("width","100%","important"),_.style.setProperty("min-width","0","important"),_.style.setProperty("max-width","none","important")})),l.querySelectorAll(".chosen-container").forEach(_=>{let $=_.previousElementSibling;$&&$.tagName==="SELECT"&&($.style.setProperty("display","none","important"),$.classList.add("urppp-chosen-hidden"));let j=_.parentElement&&_.parentElement.querySelector("select");j&&(j.style.setProperty("display","none","important"),j.classList.add("urppp-chosen-hidden")),_.style.setProperty("width","100%","important"),_.style.setProperty("min-width","0","important"),_.style.setProperty("max-width","none","important");let z=_.querySelector(".chosen-single");if(z){z.style.setProperty("width","100%","important"),z.style.setProperty("max-width","none","important"),z.style.setProperty("display","flex","important"),z.style.setProperty("align-items","center","important"),z.style.setProperty("height","34px","important"),z.style.setProperty("line-height","normal","important");let F=z.querySelector(":scope > span, span");F&&(F.style.setProperty("line-height","normal","important"),F.style.setProperty("height","auto","important"),F.style.setProperty("margin-top","0","important"),F.style.setProperty("padding-top","0","important"));let J=z.querySelector("div");if(J){J.style.setProperty("display","flex","important"),J.style.setProperty("align-items","center","important"),J.style.setProperty("justify-content","center","important"),J.style.setProperty("top","0","important"),J.style.setProperty("bottom","0","important"),J.style.setProperty("height","auto","important");let D=J.querySelector("b");D&&(D.style.setProperty("margin","0","important"),D.style.setProperty("background-position","center center","important"),D.style.setProperty("background-size","12px 12px","important"),D.style.setProperty("width","14px","important"),D.style.setProperty("height","14px","important"))}}})})},"applyRowLayout");document.querySelectorAll(".profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)").forEach(o=>{if(o.classList.contains("setLabelWidth")||o.closest&&o.closest("#curriculumInfo-divcon, #curriculumInfo-divcon1, #curriculumInfo-divcon2, #fajh, #xnxq, #kz, #kc, #kcfa"))return;let s=Array.from(o.querySelectorAll(".profile-info-row")).some(l=>Array.from(l.children).filter(g=>g.classList&&g.classList.contains("profile-info-name")).length>=2),i=!!o.querySelector("select.chosen, select.select, .chosen-container");if(!s&&!i){o.classList.remove("urppp-query-form");return}o.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')&&(o.classList.add("urppp-query-form"),$r(o),o.querySelectorAll(".profile-info-row").forEach(l=>{if(l.dataset.urpppQueryDone==="1"){l.querySelector(":scope > .urppp-query-pair")&&e(l);return}let g=Array.from(l.children).filter(j=>j.classList&&(j.classList.contains("profile-info-name")||j.classList.contains("profile-info-value"))),h=[];for(let j=0;j<g.length;){let z=g[j],F=g[j+1];z&&F&&z.classList.contains("profile-info-name")&&F.classList.contains("profile-info-value")?(h.push([z,F]),j+=2):j+=1}if(!h.length){l.dataset.urpppQueryDone="1";return}let _=document.createDocumentFragment(),$=new Set;for(h.forEach(([j,z])=>{let F=document.createElement("div");F.className="urppp-query-pair",F.appendChild(j),F.appendChild(z),$.add(j),$.add(z),_.appendChild(F)}),g.forEach(j=>{$.has(j)||_.appendChild(j)});l.firstChild;)l.removeChild(l.firstChild);l.appendChild(_),l.dataset.urpppQueryDone="1",e(l)}))}),he()}catch(t){console.warn("[URP++] query form beautify failed",t)}}a(ir,"beautifyQueryForms");function $o(){if(window.__urpppChosenAlignBound)return;window.__urpppChosenAlignBound=!0;let t=!1,e=a(r=>{if(!t){t=!0;try{let o=r&&r.querySelectorAll?r:document,s=document.getElementById("urppp-chosen-li-style");s||(s=document.createElement("style"),s.id="urppp-chosen-li-style",document.documentElement.appendChild(s)),s.textContent=[".self div.profile-info-value a.chosen-single > span,","body .self div.profile-info-value a.chosen-single > span {","  line-height: normal !important;","  height: auto !important;","  margin-top: 0 !important;","  padding-top: 0 !important;","}",".self div.profile-info-value a.chosen-single,","body .self div.profile-info-value a.chosen-single {","  display: flex !important;","  align-items: center !important;","  height: 34px !important;","  line-height: normal !important;","}","body .chosen-container .chosen-results li,","body .chosen-with-drop .chosen-results li,","html body .chosen-container .chosen-results li.active-result {","  display:flex !important;","  align-items:center !important;","  justify-content:flex-start !important;","  height:36px !important;","  min-height:36px !important;","  max-height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","  margin:0 !important;","  box-sizing:border-box !important;","}","body .chosen-container .chosen-results li.highlighted,","body .chosen-container .chosen-results li.result-selected {","  display:flex !important;","  align-items:center !important;","  height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","}"].join(""),o.querySelectorAll(".chosen-results li").forEach(i=>{i.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-start !important","height:36px !important","min-height:36px !important","max-height:36px !important","line-height:1 !important","padding:0 12px !important","margin:0 !important","box-sizing:border-box !important"].join(";")}),o.querySelectorAll("a.chosen-single").forEach(i=>{i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("height","34px","important"),i.style.setProperty("min-height","34px","important"),i.style.setProperty("line-height","normal","important"),i.style.setProperty("padding-top","0","important"),i.style.setProperty("padding-bottom","0","important");let l=i.querySelector(":scope > span");l&&(l.style.setProperty("line-height","normal","important"),l.style.setProperty("height","auto","important"),l.style.setProperty("margin-top","0","important"),l.style.setProperty("margin-bottom","0","important"),l.style.setProperty("padding-top","0","important"),l.style.setProperty("padding-bottom","0","important"))}),o.querySelectorAll(".chosen-search").forEach(i=>{if(!i.querySelector(".urppp-chosen-search-icon")){let l=document.createElement("i");l.className="fa fa-search urppp-chosen-search-icon",l.setAttribute("aria-hidden","true"),i.appendChild(l)}})}finally{setTimeout(()=>{t=!1},0)}}},"apply");document.addEventListener("mousedown",r=>{let o=r.target&&r.target.closest?r.target.closest(".chosen-container"):null;o&&(setTimeout(()=>e(o),0),setTimeout(()=>e(o),30),setTimeout(()=>e(o),100),setTimeout(()=>e(o),200))},!0);try{let r=window.jQuery||window.$;r&&r.fn&&r(document).off("chosen:showing_dropdown.urppp chosen:updated.urppp").on("chosen:showing_dropdown.urppp chosen:updated.urppp",o=>{let s=o.target&&o.target.parentElement?o.target.parentElement:document;setTimeout(()=>e(s),0),setTimeout(()=>e(s),60)})}catch{}}a($o,"patchChosenDropdownAlign");function ka(){try{let t=document.getElementById("work_rest_schedule_modal");if(!t)return;(t.classList.contains("in")||t.classList.contains("show"))&&t.style.setProperty("display","block","important");let e=t.querySelector(".modal-body")||t,r=Array.from(e.querySelectorAll("table"));if(!r.length)return;let o=a(l=>(l||"").replace(/\s+/g," ").trim(),"norm"),s=a(l=>String(l??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),"esc");if(e.dataset.urpppWrsDone==="1")return;e.dataset.urpppWrsDone="1",r.forEach(l=>{let g=l.closest(".urppp-table-wrap");g&&t.contains(g)&&g.parentElement&&(g.parentElement.insertBefore(l,g),g.remove()),l.classList.add("urppp-wrs-table"),l.style.setProperty("width","100%","important");let h=Array.from(l.rows||[]);if(!h.length)return;let _=0;h.forEach($=>{let j=o($.textContent);if(!/\d{1,2}:\d{2}/.test(j))return;let z=0;Array.from($.cells||[]).forEach(F=>{z+=F.colSpan||1}),z>_&&(_=z)}),_<4&&h.forEach($=>{let j=0;Array.from($.cells||[]).forEach(z=>{j+=z.colSpan||1}),j>_&&(_=j)}),_<1&&(_=1),Array.from(l.rows||[]).forEach($=>{let j=Array.from($.cells||[]);if(!j.length)return;let z=o($.textContent);if(!/\d{1,2}:\d{2}/.test(z)&&(/作息时间|学年/.test(z)||/(望江|华西|江安)/.test(z)&&/校区|时间|安排|作息/.test(z))){let D=z;$.className="urppp-wrs-title-row",$.innerHTML='<td class="urppp-wrs-title" colspan="'+_+'" align="center">'+s(D)+"</td>";return}j.forEach(D=>{["border","borderTop","borderRight","borderBottom","borderLeft","textAlign","verticalAlign","width"].forEach(B=>{try{D.style[B]=""}catch{}}),D.classList.remove("urppp-wrs-title","urppp-wrs-period","urppp-wrs-time","urppp-wrs-head");let R=o(D.textContent);R&&(/^(上午|下午|晚上|中午)$/.test(R)||(D.rowSpan||1)>1&&/上午|下午|晚上|中午/.test(R)?D.classList.add("urppp-wrs-period"):/节次|大节|时间|校区/.test(R)&&!/\d{1,2}:\d{2}/.test(R)&&!/第\d/.test(R)?/节次|时间|大节|校区/.test(z)&&!/\d{1,2}:\d{2}/.test(z)&&D.classList.add("urppp-wrs-head"):/\d{1,2}:\d{2}/.test(R)&&D.classList.add("urppp-wrs-time"),D.style.setProperty("text-align","center","important"),D.style.setProperty("vertical-align","middle","important"))})})});let i=t.querySelector(".modal-title");i&&(i.style.setProperty("text-align","center","important"),i.style.setProperty("width","100%","important")),e.dataset.urpppWrsDone="1"}catch{}}a(ka,"beautifyWorkRestSchedule");let Io="https://jwc.scu.edu.cn/cdxl.htm";function Aa(){let t=['a[onclick*="jwc.scu.edu.cn/article/206"]','a[href*="jwc.scu.edu.cn/article/206"]',".cdsj a",".ace-nav a"],e=new Set;t.forEach(r=>{document.querySelectorAll(r).forEach(o=>{if(e.has(o))return;e.add(o);let s=(o.textContent||"").replace(/\s+/g,""),i=o.getAttribute("onclick")||"",l=o.getAttribute("href")||"";(s.includes("学校校历")||i.includes("article/206")||l.includes("article/206")||i.includes("jwc.scu.edu.cn")&&s.includes("校历"))&&(o.setAttribute("href",Io),o.setAttribute("target","_blank"),o.setAttribute("rel","noopener noreferrer"),o.setAttribute("onclick",`window.open('${Io}');return false;`))})})}a(Aa,"patchSchoolCalendarLink");function Ir(){document.querySelectorAll("#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static").forEach(t=>{if(!t.querySelector(".nav-tabs"))return;["background","background-color","background-image","border","border-radius","box-shadow"].forEach(o=>{t.style.setProperty(o,o.startsWith("background")||o==="box-shadow"?o==="box-shadow"?"none":"transparent":o==="border"?"none":"0","important")}),t.style.setProperty("background","transparent","important"),t.style.setProperty("background-color","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("width","100%","important"),t.style.setProperty("margin","0 0 14px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("min-height","0","important"),t.style.setProperty("box-sizing","border-box","important");let e=t.querySelector(".navbar-inner");e&&(e.style.setProperty("background","transparent","important"),e.style.setProperty("border","none","important"),e.style.setProperty("box-shadow","none","important"),e.style.setProperty("padding","0","important"),e.style.setProperty("min-height","0","important"),e.style.setProperty("filter","none","important"),e.style.setProperty("width","100%","important")),t.querySelectorAll(".container, .container-fluid").forEach(o=>{o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("margin","0","important"),o.style.setProperty("margin-left","0","important"),o.style.setProperty("padding","0","important"),o.style.setProperty("background","transparent","important"),o.style.setProperty("box-sizing","border-box","important")});let r=t.querySelector(".nav-tabs");r&&(r.style.setProperty("width","100%","important"),r.style.setProperty("margin","0","important"),r.style.setProperty("padding","8px 10px","important"),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("background-color","var(--surface)","important"),r.style.setProperty("border",Be(),"important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("box-sizing","border-box","important"))})}a(Ir,"patchAceTabNavbars");function Fe(){let t=a(e=>{let r=NaN,o=[e.getAttribute("data-percent"),e.querySelector("[data-percent]")?.getAttribute("data-percent"),e.querySelector(".percent")?.textContent,e.querySelector(".urppp-pct-text")?.textContent];for(let s of o){if(s==null||s==="")continue;let i=parseFloat(String(s).replace(/[^\d.]/g,""));if(!Number.isNaN(i)){r=i;break}}if(Number.isNaN(r)){let s=(e.textContent||"").match(/(\d+(?:\.\d+)?)\s*%/);s&&(r=parseFloat(s[1]))}if(Number.isNaN(r)){let s=e.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');if(s){let i=String(s.style.width||"").match(/([\d.]+)%/);i&&(r=parseFloat(i[1]))}}return Number.isNaN(r)?null:Math.max(0,Math.min(100,r))},"readPct");document.querySelectorAll(".infobox").forEach(e=>{let r=t(e);if(r==null)return;e.querySelectorAll("canvas").forEach(l=>l.remove()),e.querySelectorAll(".easy-pie-chart, .percentage, .infobox-progress").forEach(l=>{l.classList.contains("urppp-pct-bar")||l.remove()}),e.querySelectorAll(".urppp-pct-text, .urppp-pct-bar").forEach(l=>l.remove());let o=e.querySelector(".infobox-data")||e,s=document.createElement("div");s.className="urppp-pct-text",s.textContent=Math.round(r)+"%";let i=document.createElement("div");if(i.className="urppp-pct-bar"+(r<=0?" is-empty":""),r>0){let l=document.createElement("span");l.className="urppp-pct-fill",l.style.width=r+"%",i.appendChild(l)}o.insertBefore(i,o.firstChild),o.insertBefore(s,o.firstChild),e.dataset.urpppPctDone="1"})}a(Fe,"restyleInfoboxPercentages");function sr(t){let e=document.getElementById("treeDemo");if(!e)return;let r=!!(t&&t.force);if(e.dataset.urpppBusy==="1"&&!(t&&t.ignoreBusy))return;let o=e.closest('div[style*="border"]')||e.closest("#tree_div")?.parentElement||e.parentElement;o&&o.classList.add("urppp-plan-tree-shell"),e.classList.add("urppp-ztree");let s=typeof unsafeWindow<"u"?unsafeWindow:window,i=a(()=>{try{return(s.jQuery||s.$||window.jQuery||window.$)?.fn?.zTree?.getZTreeObj?.("treeDemo")||null}catch{return null}},"getZTree"),l=a(()=>{let R=Array.from(e.querySelectorAll('span.button.switch[class*="_open"]')).filter(B=>!/_docu\b/.test(B.className));return R.reverse().forEach(B=>{try{B.click()}catch{}}),R.length>0},"collapseAllDom"),g=a(()=>{let R=i();if(R)try{R.expandAll(!1)}catch{}return e.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')&&l(),!0},"collapseAll");if(!window.__urpppExpandKzPatched){window.__urpppExpandKzPatched=!0;let R=a(()=>{let B=typeof unsafeWindow<"u"?unsafeWindow:window;try{B.expandKzByRule=function(){e.dataset.urpppUserExpanded||g()}}catch{}},"patch");R(),setTimeout(R,0),setTimeout(R,200)}e.dataset.urpppCollapsedOnce||(e.dataset.urpppCollapsedOnce="1",[0,80,200,500,1e3].forEach(R=>setTimeout(()=>{e.dataset.urpppUserExpanded||g()},R)));let h=document.querySelector("#two h4.header, #two .header");if(h&&!h.dataset.urpppLegendDone){let R=h.querySelector("font");if(R){let B=document.createElement("div");B.className="urppp-plan-legend",B.innerHTML=['<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>','<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>','<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>','<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>','<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>'].join(""),R.replaceWith(B)}h.classList.add("urppp-plan-header"),h.dataset.urpppLegendDone="1"}let _=a(()=>{if(e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}},"pauseObs"),$=a(()=>{e.dataset.urpppBusy="0";let R=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&R)try{window.__urpppPlanTreeObs.observe(R,{childList:!0,subtree:!0})}catch{}},"resumeObs"),j=a(R=>{let B=R;return B=B.replace(/\((最低修读学分:[^)]+)\)/g,(K,ut)=>{let vt=ut.split(",").map(qt=>qt.trim()).filter(Boolean),Et=[];return vt.forEach(qt=>{/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(qt)&&Et.push(qt)}),`<span class="urppp-sub">${(Et.length?Et:vt).map(qt=>{let Ot=qt.match(/^([^:：]+)[:：]\s*(.+)$/);if(!Ot)return qt;let Ht=Ot[1].trim(),Mt=Ot[2].trim(),ae="neutral";return/通过|已及格/.test(Ht)?ae="ok":/未修读|未及格/.test(Ht)?ae=Number(Mt)>0?"warn":"muted":/最低/.test(Ht)&&(ae="req"),`<span class="urppp-kv ${ae}"><em>${Ht}</em><b>${Mt}</b></span>`}).join("")}</span>`}),B=B.replace(/\[(\d{6,})\]/g,'<span class="urppp-code">$1</span>'),B=B.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g,'<span class="urppp-meta">$1</span>'),B=B.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g,(K,ut,vt)=>{let Et=String(vt).trim(),Lt=Et.match(/^(.+?)(?:\((\d{6,8})\))?$/),qt=(Lt?Lt[1]:Et).trim(),Ot=Lt&&Lt[2]?Lt[2]:"",Ht=parseFloat(qt),Mt=!1;Number.isNaN(Ht)?/不及格|未通过|不通过/.test(qt)?Mt=!1:(/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(qt),Mt=!0):Mt=Ht>=60;let ae=Ot?`<i>${Ot}</i>`:"";return`<span class="urppp-score ${Mt?"pass":"fail"}"><b>${ut}</b><em>${qt}</em>${ae}</span>`}),B=B.replace(/(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,'$1<span class="urppp-title">$2</span>'),B=B.replace(/(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,'$1 <span class="urppp-gname">$2</span>'),B=B.replace(/(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,"$1 "),B},"formatNodeHtml"),z=a(R=>{let B=R.querySelector("i.fa, i.ace-icon"),K=R.closest("li");K&&(K.classList.remove("urppp-node-done","urppp-node-todo","urppp-node-pass","urppp-node-fail","urppp-node-pending"),B&&(B.classList.contains("fa-check-square-o")?K.classList.add("urppp-node-done"):B.classList.contains("fa-smile-o")?K.classList.add("urppp-node-pass"):B.classList.contains("fa-frown-o")?K.classList.add("urppp-node-fail"):B.classList.contains("fa-meh-o")?K.classList.add("urppp-node-pending"):B.classList.contains("fa-kz")&&K.classList.add("urppp-node-todo")))},"markStatus"),F=a(R=>{if(!R||!r&&R.dataset.urpppNodeDone==="1")return!1;z(R);let B=R.querySelector("span.node_name")||R;if(!B)return!1;if(!r&&B.querySelector(".urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname"))R.dataset.urpppNodeDone="1";else{let ut=B.dataset.urpppRaw;ut||(B.querySelector(".urppp-score, .urppp-code, .urppp-sub")?(R.dataset.urpppNodeDone="1",ut=null):(ut=B.innerHTML,ut&&(B.dataset.urpppRaw=ut))),ut&&(B.innerHTML=j(ut),R.dataset.urpppNodeDone="1")}let K=R.parentElement&&R.parentElement.querySelector(":scope > span.button.switch");return K&&(K.dataset.urpppSw||(K.dataset.urpppSw="1",/_docu\b/.test(K.className)&&(K.classList.add("urppp-switch-leaf"),K.style.setProperty("display","none","important"))),/_docu\b/.test(K.className)||K.classList.contains("urppp-switch-leaf")?R.classList.remove("urppp-expandable"):R.classList.add("urppp-expandable")),!0},"paintOne"),J=a((R,B)=>{let K=Array.from(R||[]),ut=0,vt=a(()=>{let Et=Math.min(ut+48,K.length);for(;ut<Et;ut++)F(K[ut]);ut<K.length?window.requestIdleCallback?requestIdleCallback(vt,{timeout:120}):setTimeout(vt,0):B&&B()},"step");vt()},"paintList"),D=a(R=>{let B=R||e;B.querySelectorAll("span.button.switch:not([data-urppp-sw])").forEach(K=>{K.dataset.urpppSw="1",/_docu\b/.test(K.className)&&(K.classList.add("urppp-switch-leaf"),K.style.setProperty("display","none","important"))}),B.querySelectorAll("li > a").forEach(K=>F(K))},"paintScopeSync");_();try{D(e),e.dataset.urpppExpandClick||(e.dataset.urpppExpandClick="1",e.addEventListener("click",B=>{if(B.target.closest&&B.target.closest("span.button.switch")){let Lt=B.target.closest("span.button.switch"),qt=Lt&&Lt.parentElement;if(!qt||/_docu\b/.test(Lt.className))return;if(e.dataset.urpppUserExpanded="1",e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}setTimeout(()=>{D(qt),e.dataset.urpppBusy="0";let Ot=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&Ot)try{window.__urpppPlanTreeObs.observe(Ot,{childList:!0,subtree:!0})}catch{}},0);return}let K=B.target&&B.target.closest?B.target.closest("li > a"):null;if(!K||!e.contains(K))return;let ut=K.parentElement;if(!ut)return;let vt=ut.querySelector(":scope > span.button.switch");if(!vt||/_docu\b/.test(vt.className)||vt.classList.contains("urppp-switch-leaf")||!K.classList.contains("urppp-expandable")&&!/_open|_close/.test(vt.className))return;if(B.preventDefault(),B.stopImmediatePropagation(),e.dataset.urpppUserExpanded="1",e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}vt.click(),D(ut),e.dataset.urpppBusy="0";let Et=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&Et)try{window.__urpppPlanTreeObs.observe(Et,{childList:!0,subtree:!0})}catch{}},!0));let R=a((B,K)=>{let ut=document.getElementById(B);return!ut||ut.dataset.urpppBound==="1"?!1:(ut.dataset.urpppBound="1",ut.addEventListener("click",vt=>{vt.preventDefault(),vt.stopImmediatePropagation(),e.dataset.urpppUserExpanded="1",_();try{let Et=i();if(K){Et?Et.expandAll(!0):e.querySelectorAll('span.button.switch[class*="_close"]').forEach(qt=>{/_docu\b/.test(qt.className)||qt.click()});let Lt=e.querySelectorAll('li > a:not([data-urppp-node-done="1"])');J(Lt,$)}else{if(Et)try{Et.expandAll(!1)}catch{}l(),setTimeout(()=>{e.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')&&l(),$()},0)}}catch{K||l(),$()}},!0),!0)},"bindAll");R("expandAllBtn",!0),R("collapseAllBtn",!1),e.dataset.urpppAllBtnsRetry||(e.dataset.urpppAllBtnsRetry="1",setTimeout(()=>{R("expandAllBtn",!0),R("collapseAllBtn",!1)},300),setTimeout(()=>{R("expandAllBtn",!0),R("collapseAllBtn",!1)},1e3))}finally{requestAnimationFrame(()=>{requestAnimationFrame($)})}}a(sr,"beautifyPlanTree");function lr(){if(!de())try{let t=document.getElementById("soliderbox");if(t){t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","720px","important"),t.style.setProperty("min-width","0","important"),t.classList.remove("container");let s=t.closest(".profile-info-row");s&&(s.style.setProperty("display","flex","important"),s.style.setProperty("align-items","center","important"),s.style.setProperty("width","100%","important"),s.style.setProperty("max-width","100%","important"));let i=t.closest(".profile-info-value");i&&(i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","100%","important"),i.style.setProperty("flex","1 1 auto","important"),i.style.setProperty("min-width","0","important"))}let e=document.getElementById("mycoursetable");if(!e)return;let r=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches);e.classList.toggle("urppp-mobile-schedule-scroll",r),e.style.setProperty("position","relative","important"),e.style.setProperty("width","100%","important");let o=72;r||e.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(s=>{let i=s.offsetHeight||0;i>o&&(o=i)}),o<56&&(o=72),e.querySelectorAll("div.class_div").forEach(s=>{let i=parseInt(s.getAttribute("classNum")||"1",10)||1,l=s.scrollHeight||0;if(l>0){let g=Math.ceil(l/i);o=r?Math.max(o,Math.min(g,88)):Math.max(o,g)}}),r?o=Math.min(Math.max(o,72),88):(o<64&&(o=72),o>160&&(o=120)),e.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(s=>{s.style.setProperty("height",o+"px","important")}),e.querySelectorAll("td").forEach(s=>{let i=Array.from(s.querySelectorAll(":scope > div.class_div"));if(!i.length)return;s.style.setProperty("position","relative","important"),s.style.setProperty("vertical-align","top","important"),s.style.setProperty("overflow","visible","important");let l=s.getBoundingClientRect().width||s.offsetWidth||s.clientWidth||0,g=getComputedStyle(s),h=s.closest("table"),_=h?getComputedStyle(h):null,$=parseFloat(g.borderLeftWidth)||0,j=_&&_.borderCollapse==="collapse"?$/2:$,z=Math.max(1,i.length);i.forEach((F,J)=>{let D=parseInt(F.getAttribute("classNum")||"1",10)||1,R=cp(l,z,J,j),B=R.left,K=R.width;F.style.setProperty("position","absolute","important"),F.style.setProperty("top","0px","important"),F.style.setProperty("left",B+"px","important"),F.style.setProperty("right","auto","important"),F.style.setProperty("bottom","auto","important"),F.style.setProperty("transform","none","important"),F.style.setProperty("width",K+"px","important"),F.style.setProperty("max-width","none","important"),F.style.setProperty("height",o*D+"px","important"),F.style.setProperty("margin","0","important"),F.style.setProperty("box-sizing","border-box","important"),F.style.setProperty("z-index","2","important"),F.style.setProperty("overflow","hidden","important")})})}catch(t){console.warn("[URP++] week schedule fix failed",t)}}a(lr,"fixWeekScheduleLayout");function Sa(){try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;if(!t||t.__urpppDivBuildPatched||typeof t.divBuild!="function")return;t.__urpppDivBuildPatched=!0;let e=t.divBuild;t.__urpppOriginalDivBuild=e,t.divBuild=function(){try{lr()}catch{try{return e.apply(this,arguments)}catch{}}};try{t.divBuild._urppp=!0}catch{}}catch(t){console.warn("[URP++] patch divBuild failed",t)}}a(Sa,"patchSiteDivBuild");let De=null,No=!1;function Bo(){let t=document.getElementById("mycoursetable")||document.getElementById("page-content-template")||document.body;if(De&&De.root===t&&t?.isConnected){lr();return}De&&De.disconnect(),De=null;let e=!No;No=!0;let r=!1,o=a(()=>{if(!(r||de())&&!(!document.getElementById("soliderbox")&&!document.getElementById("mycoursetable"))){r=!0;try{Sa(),lr()}finally{setTimeout(()=>{r=!1},40)}}},"run");Sa(),[0,50,150,400,1e3,2e3].forEach(l=>setTimeout(()=>{Sa(),o()},l)),e&&window.addEventListener("resize",()=>{clearTimeout(window.__urpppWeekSchedResize),window.__urpppWeekSchedResize=setTimeout(o,120)});let s=a(l=>{if(!l||de())return;let g=[];l.nodeType===1&&(l.matches&&l.matches("div.class_div")&&g.push(l),l.querySelectorAll&&l.querySelectorAll("div.class_div").forEach(h=>g.push(h))),g.forEach(h=>{let _=h.parentElement;_&&_.tagName==="TD"&&_.style.setProperty("position","relative","important"),h.style.setProperty("position","absolute","important"),h.style.setProperty("top","0px","important"),h.style.setProperty("left","0px","important"),h.style.setProperty("right","auto","important"),h.style.setProperty("transform","none","important"),h.style.setProperty("width","100%","important"),h.style.setProperty("margin","0","important"),h.style.setProperty("box-sizing","border-box","important")})},"pinNew"),i=new MutationObserver(l=>{if(de())return;let g=!1;l.forEach(h=>{if(h.type==="childList"&&h.addedNodes.forEach(_=>{s(_),g=!0}),h.type==="attributes"&&h.attributeName==="style"&&h.target&&h.target.classList&&h.target.classList.contains("class_div")){let _=h.target,$=_.style.left||"",j=parseFloat($);(!$||$==="auto"||Number.isFinite(j)&&j>200)&&(_.style.setProperty("left","0px","important"),_.style.setProperty("top","0px","important"),_.style.setProperty("position","absolute","important")),g=!0}}),g&&(clearTimeout(window.__urpppWeekSchedMut),window.__urpppWeekSchedMut=setTimeout(()=>{requestAnimationFrame(o)},16))});if(t){i.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]});let l=null,g=0,h=0;if(t.id==="mycoursetable"&&typeof window.ResizeObserver=="function"){let _=t.getBoundingClientRect().width||0;l=new window.ResizeObserver($=>{let j=$[0]?.contentRect?.width||t.getBoundingClientRect().width||0;!j||Math.abs(j-_)<.5||(_=j,g||(g=requestAnimationFrame(()=>{g=0,o()})),clearTimeout(h),h=setTimeout(o,80))}),l.observe(t)}De={root:t,observer:i,disconnect(){i.disconnect(),l&&l.disconnect(),g&&cancelAnimationFrame(g),clearTimeout(h)}}}e&&document.addEventListener("mouseup",()=>{document.getElementById("soliderbox")&&(setTimeout(o,200),setTimeout(o,500))},!0)}a(Bo,"scheduleWeekScheduleFix");function Fo(){try{let t=document.getElementById("curriculumInfo-divcon2");if(!t)return;let e=parseFloat(t.style.width||getComputedStyle(t).width||"0");if(!e||e<40)return;t.classList.add("urppp-curriculum-drawer");let r=t.querySelector(".modal-body");if(!r)return;let o=r.querySelector(":scope > .col-xs-12 > .row")||r.querySelector(".col-xs-12 > .row")||r.querySelector(".row");if(!o)return;o.classList.add("urppp-drawer-layout");let s=o.querySelector(":scope > .urppp-drawer-toolbar, :scope > p");s&&s.tagName==="P"&&s.classList.add("urppp-drawer-toolbar");let i=o.querySelector(":scope > .urppp-drawer-body"),l=o.querySelector(".urppp-drawer-left"),g=o.querySelector(".urppp-drawer-right");i||(i=document.createElement("div"),i.className="urppp-drawer-body"),l||(l=document.createElement("div"),l.className="urppp-drawer-left"),g||(g=document.createElement("div"),g.className="urppp-drawer-right"),i.contains(l)||i.appendChild(l),i.contains(g)||i.appendChild(g),i.parentElement!==o&&(s&&s.parentElement===o?o.insertBefore(i,s.nextSibling):o.appendChild(i)),s&&o.firstElementChild!==s&&o.insertBefore(s,o.firstElementChild);let h=o.querySelector("#treeDemo, .ztree")||t.querySelector("#treeDemo, .ztree"),_=null;if(h){_=h.closest(".col-xs-6, .col-sm-6, .widget-box")||h.parentElement;let J=h.closest(".col-xs-6, .col-sm-6");J&&(_=J)}let $=["fajh","xnxq","kz","kc","kcfa"],j=$.map(J=>document.getElementById(J)).filter(J=>J&&t.contains(J));_&&_.parentElement!==l&&l.appendChild(_),Array.from(l.children).forEach(J=>{($.includes(J.id)||J.id&&$.includes(J.id)||J!==_&&J.querySelector&&!J.querySelector("#treeDemo, .ztree")&&J.classList&&J.classList.contains("col-xs-6"))&&g.appendChild(J)}),$.forEach(J=>{let D=document.getElementById(J);!D||!t.contains(D)||(D.parentElement!==g&&g.appendChild(D),D.style.setProperty("width","100%","important"),D.style.setProperty("max-width","100%","important"),D.style.setProperty("float","none","important"),D.style.setProperty("margin","0","important"),D.style.setProperty("padding","0","important"),D.style.setProperty("box-sizing","border-box","important"),D.style.display!=="none"&&getComputedStyle(D).display!=="none"&&D.style.setProperty("display","block","important"))});let z=document.getElementById("fajh");z&&t.contains(z)&&(z.parentElement!==g&&g.appendChild(z),(!z.innerHTML||!z.innerHTML.trim())&&!z.querySelector(".urppp-drawer-skeleton, .profile-user-info, .widget-box")&&(z.innerHTML=["<div class='widget-box transparent urppp-drawer-skeleton'>","  <div class='widget-header widget-header-small'>","    <h4 class='widget-title smaller grey'>方案计划信息</h4>","  </div>","</div>","<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>","  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>","</div>"].join(""),z.style.setProperty("display","block","important"),z.dataset.urpppSkeleton="1"),z.dataset.urpppSkeleton==="1"&&z.querySelector(".profile-info-value")&&/方案名称|计划名称|年级|院系/.test(z.textContent||"")&&(delete z.dataset.urpppSkeleton,z.querySelectorAll(".urppp-drawer-skeleton, .urppp-drawer-skeleton-card").forEach(D=>D.remove())),z.innerHTML&&z.innerHTML.trim()&&z.style.display==="none"&&(z.dataset.urpppSkeleton==="1"||z.querySelector(".profile-user-info"))&&z.style.setProperty("display","block","important")),g.style.setProperty("min-height","240px","important"),l.style.setProperty("min-height","240px","important"),_&&(_.style.setProperty("width","100%","important"),_.style.setProperty("max-width","100%","important"),_.style.setProperty("float","none","important"),_.style.setProperty("margin","0","important"),_.style.setProperty("padding","0","important"),_.style.setProperty("border","none","important"),_.style.setProperty("box-sizing","border-box","important"));let F=l.querySelector(".widget-box");F&&(F.style.setProperty("width","100%","important"),F.style.setProperty("margin","0","important"),F.style.setProperty("border",Be(),"important"),F.style.setProperty("border-radius","12px","important"),F.style.setProperty("overflow","hidden","important"),F.style.setProperty("background","var(--surface)","important")),t.querySelectorAll(".profile-info-row").forEach(J=>{J.classList.remove("urppp-query-row","urppp-dual-pair"),J.style.setProperty("display","grid","important"),J.style.setProperty("grid-template-columns","112px minmax(0,1fr)","important"),J.style.setProperty("width","100%","important"),Array.from(J.children).forEach(D=>{D.classList&&(D.style.setProperty("float","none","important"),D.style.setProperty("margin-left","0","important"),D.style.setProperty("width","auto","important"),D.style.setProperty("max-width","none","important"))})}),t.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(J=>{J.classList.remove("urppp-query-form");try{$r(J)}catch{}J.querySelectorAll(".profile-info-value, .profile-info-value span, span.editable").forEach(D=>{D.style.setProperty("color","var(--text)","important"),D.style.setProperty("opacity","1","important"),D.style.setProperty("visibility","visible","important")}),J.style.setProperty("border-radius","12px","important"),J.style.setProperty("overflow","hidden","important"),J.style.setProperty("width","100%","important"),J.style.setProperty("max-width","100%","important"),J.style.setProperty("display","block","important"),J.style.setProperty("box-sizing","border-box","important")})}catch(t){console.warn("[URP++] curriculum drawer beautify failed",t)}}a(Fo,"beautifyCurriculumDrawer");function Hi(){if(window.__urpppCurriculumDrawerBound)return;window.__urpppCurriculumDrawerBound=!0;let t=a(()=>Fo(),"run");[0,50,150,350,800,1600].forEach(o=>setTimeout(t,o));let e=new MutationObserver(o=>{o.some(i=>!!(i.type==="childList"||i.type==="attributes"&&i.target&&(i.target.id==="curriculumInfo-divcon2"||i.target.id==="fajh")))&&(clearTimeout(window.__urpppCurriculumDrawerTimer),window.__urpppCurriculumDrawerTimer=setTimeout(()=>requestAnimationFrame(t),16))}),r=document.getElementById("curriculumInfo-divcon2");r&&e.observe(r,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),document.addEventListener("click",o=>{if(!document.getElementById("curriculumInfo-divcon2"))return;let s=o.target&&o.target.closest?o.target.closest("a,button,span,div"):null,i=(s&&s.textContent||"").replace(/\s+/g,"");(/培养方案|与我相关|方案计划|自动化培养/.test(i)||s&&s.closest&&s.closest("#curriculumInfo-divcon2"))&&(setTimeout(t,0),setTimeout(t,50),setTimeout(t,150),setTimeout(t,400))},!0)}a(Hi,"scheduleCurriculumDrawerBeautify");let{scheduleScrubTableInlineBg:Do,scrubTableHeaderInlineBg:Ri}=Tp({isNativePdfIsolationActive:de}),{disarmNoticeTableHover:Ui,pinNoticeRowSurface:jo,scrubNoticeInlineBg:Oo,stripMistakenNoticeTable:Ho}=Np({getCurrentTheme:Qt});function _a(){try{let t=document.querySelector("h4.header, h3.header, h4, h3, .breadcrumb, .page-header");return Pp({pathname:location.pathname,href:location.href,title:document.title,headingText:t?.textContent||""})}catch{return!1}}a(_a,"isNoticePageContext");function Wi(t){return io(t,{noticePage:_a()})}a(Wi,"isNoticeListTable");function Ea(t){return zp(t,{noticePage:_a()})}a(Ea,"isBusinessDataTable");let Ro,{bindNoticeHoverScrub:Gi,scheduleBeautifyNoticeTables:Uo}=Ip({beautifyNoticeTables:a(t=>Ro(t),"beautifyNoticeTables"),pinNoticeRowSurface:jo});({beautifyNoticeTables:Ro}=Bp({isNativePdfIsolationActive:de,bindNoticeHoverScrub:Gi,scrubNoticeInlineBg:Oo,stripMistakenNoticeTable:Ho,disarmNoticeTableHover:Ui,pinNoticeRowSurface:jo,isBusinessDataTable:Ea,isNoticeListTable:Wi,isNoticePageContext:_a,isNoticeBulletText:po}));let{wrapTables:Wo,bindTableWrapObserver:Go}=Lp({isNativePdfIsolationActive:de,isBusinessDataTable:Ea});function cr(){try{document.querySelectorAll(".modal").forEach(e=>{if(!e||!e.style)return;e.style.getPropertyPriority("display")==="important"&&e.style.removeProperty("display"),e.classList.contains("in")||e.classList.contains("show")?e.style.display==="none"&&e.style.removeProperty("display"):(e.style.display==="block"||getComputedStyle(e).display!=="none")&&(e.style.setProperty("display","none","important"),setTimeout(()=>{try{!e.classList.contains("in")&&!e.classList.contains("show")&&(e.style.getPropertyPriority("display")==="important"&&e.style.removeProperty("display"),e.style.display="none")}catch{}},0))}),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(e=>{try{e.parentElement&&e.parentElement.removeChild(e)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right")))}catch{}}a(cr,"cleanupStuckModals");function Ji(){if(window.__urpppModalOpenPatched)return;window.__urpppModalOpenPatched=!0;let t=a(i=>{!i||!i.style||(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.getPropertyPriority("opacity")==="important"&&i.style.removeProperty("opacity"),i.style.getPropertyPriority("pointer-events")==="important"&&i.style.removeProperty("pointer-events"),i.style.getPropertyPriority("visibility")==="important"&&i.style.removeProperty("visibility"))},"unlock"),e=a(i=>{if(!(!i||!i.classList))try{i.classList.remove("in","show"),i.setAttribute("aria-hidden","true"),i.style.removeProperty("display"),i.style.setProperty("display","none","important"),setTimeout(()=>{try{!i.classList.contains("in")&&!i.classList.contains("show")&&(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.display="none")}catch{}},30)}catch{}},"forceHide"),r=a(()=>{document.querySelectorAll(".modal-backdrop").forEach(i=>{try{i.parentElement&&i.parentElement.removeChild(i)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"),document.body.style.removeProperty("overflow"))},"clearBackdrops"),o=a(i=>{if(i){if(i.classList&&i.classList.contains("modal-backdrop")&&(i=document.querySelector(".modal.in, .modal.show")||i),!i||!i.classList||!i.classList.contains("modal")){r();return}t(i),e(i),r();try{let l=typeof Mr=="function"&&Mr()||typeof unsafeWindow<"u"&&(unsafeWindow.jQuery||unsafeWindow.$)||window.jQuery||window.$;if(l&&l.fn&&typeof l.fn.modal=="function"){try{l(i).trigger("hide.bs.modal")}catch{}try{l(i).modal("hide")}catch{}try{l(i).trigger("hidden.bs.modal")}catch{}}}catch{}setTimeout(()=>{e(i),document.querySelector(".modal.in, .modal.show")||r();try{cr()}catch{}},0)}},"hideModalEl");document.addEventListener("show.bs.modal",i=>{let l=i.target;if(!(!l||!l.classList||!l.classList.contains("modal"))){t(l),l.style.display==="none"&&l.style.removeProperty("display");try{l.getAttribute("data-backdrop")==="static"&&l.setAttribute("data-backdrop","true"),l.dataset&&(l.dataset.backdrop="true")}catch{}}},!0),document.addEventListener("hide.bs.modal",i=>{let l=i.target;!l||!l.classList||!l.classList.contains("modal")||t(l)},!0),document.addEventListener("hidden.bs.modal",i=>{let l=i.target;!l||!l.classList||!l.classList.contains("modal")||(e(l),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(g=>{try{g.parentElement&&g.parentElement.removeChild(g)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"))))},!0);let s=a(i=>{let l=i.target;if(!l||!l.closest||l.closest(".modal-dialog, .modal-content, .modal-header, .modal-body, .modal-footer")&&!l.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return;if(l.classList&&l.classList.contains("modal-backdrop")){let $=document.querySelector(".modal.in, .modal.show")||document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"]');$?(i.preventDefault(),i.stopPropagation(),o($)):(i.preventDefault(),r(),cr());return}let g=null;if(l.classList&&l.classList.contains("modal")?g=l:g=l.closest(".modal.in, .modal.show, .modal"),!g||!g.classList.contains("modal")||!(g.classList.contains("in")||g.classList.contains("show")||getComputedStyle(g).display!=="none"))return;let _=g.querySelector(".modal-dialog");if(_){let $=_.getBoundingClientRect(),j=i.clientX,z=i.clientY;if(j>=$.left&&j<=$.right&&z>=$.top&&z<=$.bottom&&!l.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return}else if(l.closest(".modal-content"))return;i.preventDefault(),i.stopPropagation(),o(g)},"onBlankClose");document.addEventListener("pointerdown",s,!0),document.addEventListener("mousedown",s,!0),document.addEventListener("click",s,!0),document.addEventListener("click",i=>{let l=i.target&&i.target.closest?i.target.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'):null;if(!l)return;let g=l.closest(".modal");g&&(i.preventDefault(),i.stopPropagation(),o(g)),setTimeout(()=>{try{cr()}catch{}},50),setTimeout(()=>{try{cr()}catch{}},220)},!0),document.addEventListener("click",i=>{let l=i.target&&i.target.closest?i.target.closest("a,button,td,span,div,i"):null;if(!l)return;["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon","billContainer"].forEach(h=>{let _=document.getElementById(h);_&&(t(_),_.style.opacity==="0"&&_.style.removeProperty("opacity"),_.style.pointerEvents==="none"&&_.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(h=>t(h));let g=l.getAttribute&&(l.getAttribute("data-target")||l.getAttribute("href")||"");if(g&&g.charAt(0)==="#"){let h=document.querySelector(g);h&&t(h)}},!0)}a(Ji,"patchModalOpenPath");let je=null,Ca=0;function Pa(){if(de())return;let t=document.getElementById("courseTable");t&&t.querySelectorAll("td").forEach(e=>{let r=e.style.backgroundColor;if(!r||!r.includes("rgba"))return;let o=r.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);o&&(e.style.backgroundColor=`rgba(${o[1]},${o[2]},${o[3]},0.5)`)})}a(Pa,"applyCourseTableOpacity");function Jo(){let t=document.getElementById("mycoursetable")||document.getElementById("courseTable");if(je&&je.root===t&&t?.isConnected){Pa();return}if(clearTimeout(Ca),je&&je.observer.disconnect(),je=null,!t)return;let e=new MutationObserver(()=>{clearTimeout(Ca),Ca=setTimeout(Pa,60)});e.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style"]}),je={root:t,observer:e},Pa()}a(Jo,"bindCourseTableOpacityObserver");function Vi(){try{let z=Qt();document.documentElement.dataset.urpppTheme=z,document.documentElement.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),document.documentElement.classList.add("urppp-theme-"+z),document.body&&(document.body.dataset.urpppTheme=z,document.body.classList.toggle("urppp-dark",z==="dark"))}catch{}let t=document.getElementById("urppp-internal-style");t||(t=document.createElement("style"),t.id="urppp-internal-style",document.head.appendChild(t));{let z=t;z.textContent=Up}let e=document.getElementById("urppp-table-beautify-style");e||(e=document.createElement("style"),e.id="urppp-table-beautify-style",document.head.appendChild(e)),e.textContent=Vp;let r=document.getElementById("urppp-navigation-style");r||(r=document.createElement("style"),r.id="urppp-navigation-style",document.head.appendChild(r)),r.textContent=Yp;let o=document.getElementById("urppp-dashboard-style");o||(o=document.createElement("style"),o.id="urppp-dashboard-style",document.head.appendChild(o)),o.textContent=Xp;let s=document.getElementById("urppp-schedule-card-style");s||(s=document.createElement("style"),s.id="urppp-schedule-card-style",document.head.appendChild(s)),s.textContent=Wp;let i=document.getElementById("urppp-mobile-style");i||(i=document.createElement("style"),i.id="urppp-mobile-style",document.head.appendChild(i)),i.textContent=Zp;try{ee()}catch{}cr(),Ji(),["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon"].forEach(z=>{let F=document.getElementById(z);!F||!F.style||(["display","opacity","pointer-events","visibility"].forEach(J=>{F.style.getPropertyPriority(J)==="important"&&F.style.removeProperty(J)}),F.style.opacity==="0"&&F.style.removeProperty("opacity"),F.style.pointerEvents==="none"&&F.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(z=>{z.style&&z.style.getPropertyPriority("display")==="important"&&z.style.removeProperty("display")}),Wo(),Uo(),Do(),setTimeout(()=>document.querySelectorAll("table").forEach(z=>{Ea(z)&&Ho(z)}),500),Bo(),lr(),Hi(),Fo(),Go();let l=document.querySelector(".page-content");l&&l.querySelectorAll(".widget-box").length>=4&&setTimeout(ws,500),dn(),_e(),h();function h(){let z="(max-width: 640px)",F=a(()=>!!(window.matchMedia&&window.matchMedia(z).matches),"isNarrow"),J=a((W,pt)=>{if(!(!W||!document.body)){if(pt){Object.hasOwn(W.dataset,"urpppDesktopSidebarMin")||(W.dataset.urpppDesktopSidebarMin=W.classList.contains("menu-min")?"1":"0",W.dataset.urpppDesktopBodyMin=document.body.classList.contains("menu-min")?"1":"0"),W.classList.remove("menu-min"),document.body.classList.remove("menu-min");return}Object.hasOwn(W.dataset,"urpppDesktopSidebarMin")&&(W.classList.toggle("menu-min",W.dataset.urpppDesktopSidebarMin==="1"),document.body.classList.toggle("menu-min",W.dataset.urpppDesktopBodyMin==="1"),delete W.dataset.urpppDesktopSidebarMin,delete W.dataset.urpppDesktopBodyMin)}},"syncMobileSidebarMode"),D=new WeakMap,R=a(W=>{let pt=D.get(W);pt&&cancelAnimationFrame(pt),D.delete(W)},"stopDrawerAnimation"),B=a((W,pt)=>{R(W);let lt=W.getBoundingClientRect(),xt=Math.max(lt.width,W.offsetWidth||0,260),gt=Math.max(-xt,Math.min(0,lt.left)),St=pt?0:-xt,Tt=Math.abs(St-gt),jt=Math.max(140,Math.round(260*Tt/xt)),ce=performance.now(),Rt=W.classList.contains("urppp-clean-sidebar"),oe=Rt?"12030":"1200",Nt=Rt?"12030":"1030";W.style.setProperty("display","block","important"),W.style.setProperty("transition","none","important"),W.style.setProperty("visibility","visible","important"),W.style.setProperty("pointer-events",pt?"auto":"none","important"),W.style.setProperty("z-index",oe,"important"),W.style.setProperty("transform",`translate3d(${gt}px, 0, 0)`,"important"),W.classList.toggle("urppp-drawer-closing",!pt),W.classList.add("display");let At=a(()=>{W.style.setProperty("transform",`translate3d(${St}px, 0, 0)`,"important"),pt?(W.classList.remove("urppp-drawer-closing"),W.style.setProperty("pointer-events","auto","important")):(W.classList.remove("display","urppp-drawer-closing"),W.style.setProperty("visibility","hidden","important"),W.style.setProperty("z-index",Nt,"important")),D.delete(W)},"finish");if(Tt<1){At();return}let ge=a($t=>{if(!W.isConnected){D.delete(W);return}let Ut=Math.min(1,($t-ce)/jt),Qn=Ut<.5?4*Ut*Ut*Ut:1-Math.pow(-2*Ut+2,3)/2,Jr=gt+(St-gt)*Qn;if(W.style.setProperty("transform",`translate3d(${Jr}px, 0, 0)`,"important"),Ut>=1){At();return}D.set(W,requestAnimationFrame(ge))},"step");D.set(W,requestAnimationFrame(ge))},"animateDrawer"),K=a((W,pt,lt)=>{if(W){B(W,lt),pt&&(pt.setAttribute("aria-expanded",lt?"true":"false"),pt.setAttribute("aria-label",lt?"关闭菜单":"打开菜单"));try{Re()}catch{}}},"setDrawerOpen"),ut=a(()=>{K(document.getElementById("sidebar"),document.getElementById("urppp-mobile-menu-button"),!1)},"closeDrawer"),vt=a(()=>{let pt=document.getElementById("urppp-mobile-search-panel")?.querySelector("#form-search");if(!pt)return;Object.entries({position:"relative",right:"auto",top:"auto",left:"auto",transform:"none",width:"100%","min-width":"0","max-width":"none",height:"36px",opacity:"1",margin:"0",overflow:"visible","z-index":"1"}).forEach(([xt,gt])=>pt.style.setProperty(xt,gt,"important")),[pt.querySelector("form"),pt.querySelector(".input-icon")].forEach(xt=>{xt&&Object.entries({display:"block",position:"relative",width:"100%","min-width":"0","max-width":"none",height:"36px",margin:"0",padding:"0","box-sizing":"border-box"}).forEach(([gt,St])=>xt.style.setProperty(gt,St,"important"))});let lt=pt.querySelector("#search-input");lt&&(lt.style.setProperty("display","block","important"),lt.style.setProperty("width","100%","important"),lt.style.setProperty("min-width","0","important"),lt.style.setProperty("max-width","none","important"),lt.style.setProperty("height","36px","important"),lt.style.setProperty("box-sizing","border-box","important"))},"syncMobileSearchLayout"),Et=a(()=>{let W=document.getElementById("form-search");if(!W||!W.__urpppMobileParent)return;let pt=W.__urpppMobileParent,lt=W.__urpppMobileNext;pt.isConnected&&(lt&&lt.parentElement===pt?pt.insertBefore(W,lt):pt.appendChild(W)),W.classList.remove("urppp-mobile-form-search"),W.dataset.open="0",W.removeAttribute("style"),delete W.__urpppMobileParent,delete W.__urpppMobileNext;try{dt()}catch{}},"restoreMobileSearch"),Lt=a(()=>{let W=document.querySelector("#navbar .menu-toggler");!W||W.dataset.urpppMobileHidden!=="1"||(W.style.removeProperty("display"),W.removeAttribute("aria-hidden"),W.dataset.urpppPreviousTabindex?W.setAttribute("tabindex",W.dataset.urpppPreviousTabindex):W.removeAttribute("tabindex"),delete W.dataset.urpppPreviousTabindex,delete W.dataset.urpppMobileHidden)},"restoreNativeMenuToggler"),qt=a(()=>{let W=document.getElementById("urppp-mobile-menu-button");if(!F())return W?.remove(),Lt(),null;if(W)return W;let pt=document.getElementById("navbar"),lt=document.getElementById("sidebar");if(!pt||!lt)return null;let xt=pt.querySelector(".menu-toggler");xt&&(xt.dataset.urpppMobileHidden="1",xt.dataset.urpppPreviousTabindex=xt.getAttribute("tabindex")||"",xt.style.setProperty("display","none","important"),xt.setAttribute("aria-hidden","true"),xt.setAttribute("tabindex","-1"));let gt=document.createElement("button");gt.type="button",gt.id="urppp-mobile-menu-button",gt.className="urppp-mobile-menu-button",gt.setAttribute("aria-label","打开菜单"),gt.setAttribute("aria-expanded","false");let St=pt.querySelector(".navbar-container")||pt;return St.insertBefore(gt,St.firstChild),gt},"ensureMenuToggler"),Ot=a(W=>{!W||W.dataset.urpppIconReady||(W.dataset.urpppIconReady="1",W.innerHTML=['<span class="urppp-menu-icon" aria-hidden="true">','<svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false">','<path d="M5 8h14"></path><path d="M5 16h10"></path>',"</svg>",'<svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false">','<path d="M7 7l10 10"></path><path d="M17 7 7 17"></path>',"</svg>","</span>"].join(""))},"ensureMenuButtonIcon"),Ht=a(()=>{let W=qt(),pt=document.getElementById("sidebar");W&&Ot(W),W&&pt&&!W.__urpppToggleHandler&&(W.setAttribute("aria-label","打开菜单"),W.setAttribute("aria-expanded",pt.classList.contains("display")?"true":"false"),W.__urpppToggleHandler=lt=>{lt.preventDefault(),lt.stopImmediatePropagation(),F()&&J(pt,!0);let xt=W.getAttribute("aria-expanded")!=="true";K(pt,W,xt)},W.addEventListener("click",W.__urpppToggleHandler,!0)),document.__urpppMobileDrawerOutsideBound||(document.__urpppMobileDrawerOutsideBound=!0,document.addEventListener("click",lt=>{if(!F()||!lt.target.closest)return;let xt=document.getElementById("sidebar");if(!xt||!xt.classList.contains("display"))return;let gt=document.getElementById("urppp-clean-root");gt&&gt.classList.contains("open")||lt.target.closest("#sidebar, #urppp-mobile-menu-button")||ut()},!0)),document.__urpppMobileRouteCloseBound||(document.__urpppMobileRouteCloseBound=!0,document.addEventListener("click",lt=>{if(!F()||!lt.target.closest)return;let xt=document.getElementById("urppp-clean-root");if(xt&&xt.classList.contains("open"))return;let gt=lt.target.closest("#sidebar a[href]");if(!gt)return;let St=String(gt.getAttribute("href")||"").trim();!St||St==="#"||St.startsWith("javascript")||ut()}))},"bindDrawerControls"),Mt=a((W,pt)=>{let lt=W?W.cloneNode(!0):document.createElement("a");return lt.className="urppp-mobile-user-action",lt.removeAttribute("style"),lt.removeAttribute("id"),!W&&pt&&(lt.href=pt.href,pt.onclick&&lt.setAttribute("onclick",pt.onclick),lt.innerHTML='<i class="ace-icon fa '+pt.icon+'" aria-hidden="true"></i><span>'+pt.label+"</span>"),lt},"createActionLink"),ae=a((W,pt)=>{if(document.getElementById("urppp-mobile-user"))return;let lt=W.querySelector(":scope > li.light-blue")||Array.from(W.children).find(Ut=>Ut.querySelector&&Ut.querySelector(".nav-user-photo, .user-menu, .dropdown-menu")),xt=document.createElement("section");xt.id="urppp-mobile-user",xt.className="urppp-mobile-user";let gt=document.createElement("div");gt.className="urppp-mobile-user-identity";let St=lt?.querySelector(".nav-user-photo")||document.querySelector("#navbar .nav-user-photo"),Tt=St?St.cloneNode(!0):document.createElement("img");Tt.className="nav-user-photo",Tt.removeAttribute("style"),Tt.getAttribute("src")||Tt.setAttribute("src","/main/queryStudent/img"),Tt.setAttribute("data-urppp-private","avatar"),Tt.alt=St?.alt?.replace(/\s+/g," ").trim()||"用户头像";let jt=lt?.querySelector(".user-info")||document.querySelector("#navbar .user-info"),ce=document.createElement("span");ce.className="urppp-mobile-user-copy";let Rt=document.createElement("small");Rt.className="urppp-mobile-user-welcome",Rt.textContent="欢迎您，";let oe=document.createElement("span");oe.className="user-info urppp-user-name-value",oe.setAttribute("data-urppp-private","name"),oe.textContent=jt?.textContent?.replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim()||St?.alt?.replace(/\s+/g," ").trim()||"我的账户",ce.append(Rt,oe),gt.append(Tt,ce),xt.appendChild(gt);let Nt=document.createElement("div");Nt.className="urppp-mobile-user-actions";let At=lt?Array.from(lt.querySelectorAll(".user-menu a, .dropdown-menu a")):[],ge=[{label:"首页",href:"/",icon:"fa-home"},{label:"在线反馈",href:"/main/systemQuestion/index",icon:"fa-question-circle"},{label:"修改密码",href:"javascript:changePassword('/student/rollManagement/personalInfoUpdate/updatePassword')",icon:"fa-user"},{label:"注销",href:"/logout",icon:"fa-power-off"}];At.length?At.forEach(Ut=>Nt.appendChild(Mt(Ut))):ge.forEach(Ut=>Nt.appendChild(Mt(null,Ut))),xt.appendChild(Nt);let $t=pt.querySelector(".urppp-sidebar-header");$t&&$t.nextSibling?pt.insertBefore(xt,$t.nextSibling):$t?pt.appendChild(xt):pt.insertBefore(xt,pt.firstChild);try{Vt(xt)}catch{}},"ensureMobileUser"),Yn=a((W,pt,lt,xt={})=>{if(!lt||document.getElementById("urppp-mobile-quick"))return;let gt=document.createElement("section");gt.id="urppp-mobile-quick",gt.className="urppp-mobile-quick",gt.innerHTML='<div class="urppp-mobile-quick-title">快捷功能</div>';let St=document.createElement("div");St.className="urppp-mobile-tool-row";let Tt=W.querySelector(':scope > li > a[href*="customerServiceCenter"]'),jt=Tt?Tt.cloneNode(!0):document.createElement("a");jt.className="urppp-mobile-tool-button urppp-mobile-help-button",jt.removeAttribute("style"),jt.removeAttribute("onclick"),jt.removeAttribute("data-toggle"),jt.removeAttribute("target"),jt.querySelectorAll("[style]").forEach(At=>At.removeAttribute("style"));let ce=String(jt.getAttribute("href")||"").trim();(!ce||ce==="#"||ce.startsWith("javascript"))&&(jt.href="/main/customerServiceCenter"),jt.querySelector("i")||(jt.innerHTML='<i class="ace-icon glyphicon glyphicon-headphones" aria-hidden="true"></i>'),jt.querySelectorAll("span").forEach(At=>At.remove()),jt.insertAdjacentHTML("beforeend","<span>帮助</span>"),St.appendChild(jt);let Rt=document.createElement("button");Rt.type="button",Rt.id="urppp-mobile-search-button",Rt.className="urppp-mobile-tool-button",Rt.setAttribute("aria-expanded","false"),Rt.innerHTML='<i class="ace-icon fa fa-search" aria-hidden="true"></i><span>搜索</span>',St.appendChild(Rt),gt.appendChild(St);let oe=document.createElement("div");oe.className="urppp-mobile-quick-links",Array.from(W.querySelectorAll(":scope > li > a")).forEach(At=>{let ge=At.closest("li");if(ge?.classList.contains("light-blue")||ge?.querySelector("#intellegenceUDiv, #form-search")||At===Tt||At.classList.contains("dropdown-toggle")||!At.getAttribute("href")&&!At.getAttribute("onclick"))return;let $t=At.cloneNode(!0);$t.className="urppp-mobile-quick-link",$t.removeAttribute("style");let Ut=String(At.getAttribute("onclick")||"");if(/openWorkRestSchedule|open\w*Schedule/i.test(Ut)||$t.removeAttribute("onclick"),xt.cleanMode){let Jr=String(At.getAttribute("href")||"");(Jr==="/holiday"||/holiday/i.test(Jr)||/假期/.test(At.textContent||""))&&($t.removeAttribute("href"),$t.removeAttribute("target"),$t.style.cursor="default",$t.style.pointerEvents="none")}oe.appendChild($t)});let Nt=document.createElement("div");Nt.id="urppp-mobile-search-panel",Nt.className="urppp-mobile-search-panel",Nt.hidden=!0;{let At=document.getElementById("form-search");At&&(At.__urpppMobileParent||(At.__urpppMobileParent=At.parentElement,At.__urpppMobileNext=At.nextSibling),At.classList.add("urppp-mobile-form-search"),At.dataset.open="0",Nt.appendChild(At),vt())}gt.appendChild(Nt),oe.children.length&&gt.appendChild(oe),Rt.addEventListener("click",At=>{if(At.preventDefault(),At.stopPropagation(),Nt.hidden){vt();let $t=Nt.querySelector("#form-search");$t&&($t.dataset.open="0",$t.style.setProperty("pointer-events","auto","important"),$t.style.setProperty("opacity","1","important"),$t.style.setProperty("width","100%","important"),$t.style.setProperty("min-width","0","important")),Nt.hidden=!1,Nt.classList.add("open"),setTimeout(()=>Nt.querySelector("#search-input")?.focus(),30),Rt.setAttribute("aria-expanded","true")}else Nt.hidden=!0,Nt.classList.remove("open"),Rt.setAttribute("aria-expanded","false")}),pt.insertBefore(gt,lt)},"ensureMobileQuick"),Le=a(()=>{let W=F(),pt=document.querySelector("#navbar .navbar-buttons .ace-nav"),lt=document.getElementById("sidebar"),xt=document.getElementById("urppp-menus");if(lt&&J(lt,W),Ht(),!W){let gt=document.documentElement.classList.contains("urppp-clean-open");gt||Et(),gt||(document.getElementById("urppp-mobile-quick")?.remove(),document.getElementById("urppp-mobile-user")?.remove());let St=document.getElementById("urppp-nav-clean"),Tt=document.getElementById("urppp-nav-theme");St&&Tt&&St.parentElement!==Tt&&Tt.appendChild(St),Tt&&Tt.style.setProperty("display","inline-flex","important");return}if(!(!pt||!lt)){try{let gt=document.getElementById("urppp-nav-clean"),St=document.querySelector("#navbar .navbar-header"),Tt=document.getElementById("urppp-nav-theme");gt&&St&&gt.parentElement!==St&&St.appendChild(gt),Tt&&Tt.style.setProperty("display","inline-flex","important"),document.getElementById("urppp-nav-cal")?.remove()}catch{}ae(pt,lt),Yn(pt,lt,xt),vt()}},"apply");window.__urpppRefreshMobileNavbar=Le,window.__urpppCloseMobileDrawer=ut,window.__urpppSetDrawerOpen=(W,pt,lt)=>{K(W,pt,lt)},window.__urpppStopDrawerAnimation=W=>{W&&R(W)},window.__urpppInjectCleanSidebarSections=W=>{let pt=document.querySelector("#navbar .navbar-buttons .ace-nav")||document.querySelector("#navbar .ace-nav"),lt=document.getElementById("urppp-menus");if(!pt||!W)return;try{ae(pt,W)}catch{}let xt=document.getElementById("urppp-mobile-quick");if(xt){let gt=xt.querySelector("#urppp-mobile-search-panel");if(gt&&gt.querySelector("#form-search"))try{Et()}catch{}xt.remove()}try{Yn(pt,W,lt,{cleanMode:!0})}catch{}};try{Le()}catch{}if(setTimeout(Le,300),setTimeout(Le,900),setTimeout(Le,1800),window.matchMedia){let W=window.matchMedia(z),pt=a(()=>Le(),"onChange");typeof W.addEventListener=="function"?W.addEventListener("change",pt):typeof W.addListener=="function"&&W.addListener(pt)}try{window.__urpppMobileNavbarObserver&&window.__urpppMobileNavbarObserver.disconnect();let W=0,pt=new MutationObserver(()=>{clearTimeout(W),W=setTimeout(()=>{try{Le()}catch{}},40)}),lt=document.getElementById("navbar"),xt=document.getElementById("sidebar");lt&&pt.observe(lt,{childList:!0,subtree:!0}),xt&&pt.observe(xt,{childList:!0}),window.__urpppMobileNavbarObserver=pt}catch{}}a(h,"setupMobileNavbar");let $=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches)?"8px 8px 24px":"16px 64px 40px";if(document.querySelectorAll(".page-content, #page-content-template").forEach(z=>{z.style.setProperty("padding",$,"important"),z.style.setProperty("box-sizing","border-box","important")}),Tr(),xa(),Ir(),Fe(),wa(),setTimeout(()=>{Fe(),wa()},300),setTimeout(()=>{Fe(),wa()},1e3),Mo(),To(),qo(),he(),va(),ir(),$o(),setTimeout(()=>{he(),ir()},200),setTimeout(()=>{he(),ir()},800),setTimeout(xa,350),setTimeout(xa,1e3),sr(),setTimeout(()=>sr(),400),!window.__urpppPlanTreeObs){let z=0;window.__urpppPlanTreeObs=new MutationObserver(()=>{let J=document.getElementById("treeDemo");!J||J.dataset.urpppBusy==="1"||J.querySelector('li > a:not([data-urppp-node-done="1"])')&&(clearTimeout(z),z=setTimeout(()=>sr(),220))});let F=document.getElementById("tree_div")||document.getElementById("treeDemo");F&&window.__urpppPlanTreeObs.observe(F,{childList:!0,subtree:!0})}window.__urpppWrsBound||(window.__urpppWrsBound=!0,document.addEventListener("shown.bs.modal",z=>{z.target&&(z.target.id==="work_rest_schedule_modal"||z.target.querySelector?.("#work_rest_schedule_modal"))&&setTimeout(ka,30)},!0),document.addEventListener("click",z=>{let F=z.target&&z.target.closest?z.target.closest("a,button"):null;if(!F)return;let J=F.getAttribute("onclick")||"",D=(F.textContent||"").trim();(J.includes("openWorkRestSchedule")||D.includes("作息时间表"))&&(setTimeout(ka,80),setTimeout(ka,300))},!0)),qr(),st(),dt(),Aa();let j=a(()=>{Tr(),Ir(),qr()},"layoutWave");setTimeout(j,200),setTimeout(j,800),window.__urpppLoadBound||(window.__urpppLoadBound=!0,window.addEventListener("load",()=>{st(),dt(),rt(),Aa(),qr(),Tr(),Ir()})),setTimeout(()=>{document.body.classList.add("urppp-ready"),wt()},600),console.log("[URP++] style applied apple-leaning");try{bindScheduleHoverNearCursor()}catch{}Jo()}a(Vi,"beautifyInternal");function Yi(t){if(!t)return;let e=t.querySelector("#urppp-set-brutal-palettes");if(!e)return;let r=Ao();e.innerHTML="",Q.filter(o=>o.id!==V).forEach(o=>{let s=document.createElement("button");s.type="button",s.className="urppp-set-scheme"+(o.id===r.id?" ac":""),s.dataset.palette=o.id,s.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:#000"></span>','  <span style="background:'+o.accent+'"></span>','  <span style="background:'+o.secondary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+o.name+"</strong>","  <em>"+o.desc+"</em>","</div>"].join(""),s.addEventListener("click",()=>_o(o.id,{select:!0})),e.appendChild(s)})}a(Yi,"renderBrutalPaletteCards");let Nr=_p({getPrivacySettings:ve,setPrivacySettings:ma,getCustomIdentity:$e,setCustomIdentity:fo,applyDisplay:a(()=>Vt(document),"applyDisplay"),refreshCleanDisplay:Ha,finishActiveDirectEdit:a(t=>{be?.__finish&&be.__finish(t)},"finishActiveDirectEdit")}),Qi=Nr.sync,_c=Nr.collect,Ec=Nr.setStatus,Xi=Nr.bind,za=Ap({document,getSettings:zr,setSettings:yo,validateMapping:qe,defaultMapping:wr,getRecoveryMessage:a(()=>et,"getRecoveryMessage")}),Cc=za.setStatus,Ki=za.sync,Zi=za.bind;function Dt(){let t=document.getElementById("urppp-settings-panel");if(!t)return;let e=Yt()||mt,r=Me(),o=Qt(),s=Kt(),i=Zt(),l=Ie(i),g=Ne(i),h=ko(i),_={};t.querySelectorAll(".urppp-set-mode").forEach(z=>{_[z.dataset.theme]=or(z.dataset.theme,i)}),Cp(t,{seed:e,currentTheme:o,followSystem:s,skinId:i,darkSupported:l,dynamicSupported:g,fixedPalettes:h,followUseDynamic:Lr(),cleanDefault:ca(),cleanAnalysis:da()?"direct":"tab",appleEdge:ye(),autoUpdate:ua(),modeAvailability:_}),h&&Yi(t);try{Qi(t)}catch{}try{Ki(t)}catch{}try{window.__urpppCleanMode&&typeof window.__urpppCleanMode.refreshRender=="function"&&window.__urpppCleanMode.refreshRender()}catch{}let $=t.querySelector("#urppp-set-presets");$&&($.innerHTML="",la().forEach(z=>{let F=document.createElement("button");F.type="button",F.className="urppp-set-swatch"+(z.toLowerCase()===e.toLowerCase()?" ac":""),F.title=z,F.style.background=z,F.addEventListener("click",()=>{GM_setValue(T,z),Kt()?Wt(we(),{system:!0}):Wt("scu-red",{manual:!0}),Dt()}),$.appendChild(F)}));let j=t.querySelector("#urppp-set-schemes");j&&(j.innerHTML="",Te(e).forEach(z=>{let F=document.createElement("button");F.type="button",F.className="urppp-set-scheme"+(z.id===r?" ac":""),F.dataset.scheme=z.id,F.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+z.bg+'"></span>','  <span style="background:'+z.surface+";border-color:"+z.border+'"></span>','  <span style="background:'+z.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+z.name+"</strong>","  <em>"+z.desc+"</em>","</div>"].join(""),F.addEventListener("click",()=>{sa(z.id),GM_setValue(T,e),Kt()?Wt(we(),{system:!0}):Wt("scu-red",{manual:!0}),Dt()}),j.appendChild(F)}));try{us(t)}catch(z){try{console.warn("[URP++] renderSkinCards",z)}catch{}}try{let z=t.querySelector(".urppp-about-ver, #urppp-about-ver");z&&(z.textContent="SCU URP++ v"+p,z.tagName==="A"&&(z.setAttribute("href",n.repo),z.setAttribute("target","_blank"),z.setAttribute("rel","noopener noreferrer")))}catch{}try{Xo(t)}catch{}}a(Dt,"syncSettingsPanelUI");let Vo=wp({document,ensurePanel:Ko,syncPanel:Dt,refreshUpdateStatus:cn}),ts=Ep({document,theme:{isModeAvailable:or,apply:Wt,supportsDark:Ie,supportsDynamic:Ne,getFollowSystem:Kt,setFollowSystem:Er,resolveFollowTheme:we,getCurrent:Qt,getFollowDynamic:Lr,setFollowDynamic:ba,syncNavbar:ft},preferences:{getCleanDefault:ca,setCleanDefault:zi,getCleanAnalysis:a(()=>da()?"direct":"tab","getCleanAnalysis"),setCleanAnalysis:Li,getAppleEdge:ye,setAppleEdge:qi,applySkin:ee,getAutoUpdate:ua,setAutoUpdate:Ti,checkUpdates:Ba},accent:{normalize:Gt,setAccent:a(t=>GM_setValue(T,t),"setAccent"),savePreset:Pi,getScheme:Me,setScheme:sa,listSchemePreviews:Te},syncPanel:Dt}),_t=oo({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:p},uiDeps:{openSubpanel:a(t=>{t==="plugin-store"&&La("plugin")},"openSubpanel")}});a((function(){let e=a(()=>{try{_t.bootFromCache("assist")}catch{}},"run");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}),"bootstrapPlugins")();function Yo(){return Vo.open()}a(Yo,"openSettingsPanel");function Qo(){Vo.close()}a(Qo,"closeSettingsPanel");let Br="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=";function Xo(t){let e=t&&t.querySelector?t.querySelector("#urppp-about-logo"):document.getElementById("urppp-about-logo");e&&(e.getAttribute("src")!==Br&&e.setAttribute("src",Br),e.removeAttribute("referrerpolicy"),e.alt="SCU URP++",e.style.maxWidth="100%",e.style.height="auto",e.style.display="block")}a(Xo,"ensureAboutLogo");function Ko(){if(document.getElementById("urppp-settings-panel"))return;Ss();try{ee()}catch{}try{ke&&ke.length&&Oe(ke)}catch{}let t=document.createElement("div");t.id="urppp-settings-mask",t.addEventListener("click",Qo);let e=document.createElement("div");e.id="urppp-settings-panel",e.setAttribute("role","dialog"),e.setAttribute("aria-label","URP++ 设置");let r=Br;e.innerHTML=kp({logoData:Br,repositoryUrl:n.repo,version:p}),document.documentElement.appendChild(t),document.documentElement.appendChild(e),vp(e),e.querySelector("#urppp-set-close").addEventListener("click",Qo);try{Xi(e)}catch(s){console.warn("[URP++] privacy settings",s)}try{Zi(e)}catch(s){console.warn("[URP++] JSON settings",s)}try{Xo(e)}catch{}let o=e.querySelector("#urppp-about-logo");o&&!o.__urpppFallback&&(o.__urpppFallback=!0,o.addEventListener("error",()=>{o.dataset.fallback!=="1"&&(o.dataset.fallback="1",o.src=r)})),ts.bind(e);try{_t.renderAssistUi(e.querySelector("#urppp-set-assist-slot"))}catch(s){console.warn("[URP++] plugin manager",s)}}a(Ko,"ensureSettingsPanel");function La(t){let e=document.getElementById("urppp-settings-panel");if(!e)return;let r=document.getElementById("urppp-store-subpanel");r||(r=document.createElement("div"),r.id="urppp-store-subpanel",r.className="urppp-store-subpanel",r.innerHTML=`
        <div class="urppp-store-sub-head">
          <button type="button" class="urppp-store-sub-back" id="urppp-store-sub-back" aria-label="返回">←</button>
          <div class="urppp-store-sub-title" id="urppp-store-sub-title"></div>
        </div>
        <div class="urppp-store-sub-body" id="urppp-store-sub-body"></div>`,e.appendChild(r),r.querySelector("#urppp-store-sub-back").onclick=es);let o=r.querySelector("#urppp-store-sub-title"),s=r.querySelector("#urppp-store-sub-body");o.textContent=t==="theme"?"主题商店":"插件商店",s.innerHTML="",t==="theme"?is(s):on(s),r.classList.add("open")}a(La,"openStoreSubPanel");function es(){let t=document.getElementById("urppp-store-subpanel");if(!t)return;t.classList.remove("open");let e=t.querySelector("#urppp-store-sub-body");e&&(e.innerHTML="")}a(es,"closeStoreSubPanel");function Zo(t){t.querySelectorAll(".urppp-store-tab").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll(".urppp-store-tab").forEach(o=>o.className="urppp-store-tab"),e.className="urppp-store-tab ac",t.querySelectorAll(".urppp-store-pane").forEach(o=>o.style.display="none");let r=t.querySelector('.urppp-store-pane[data-pane="'+e.dataset.tab+'"]');r&&(r.style.display="")})})}a(Zo,"bindStoreTabs");function Oe(t){Array.isArray(t)&&t.forEach(e=>{if(!e||!e.id)return;let r="";try{r=GM_getValue("urppp_card_css_"+e.id,"")||""}catch{}let o=r||e.cardCss||"";if(!o)return;let s=document.getElementById("urppp-store-card-css-"+e.id);s||(s=document.createElement("style"),s.id="urppp-store-card-css-"+e.id,(document.head||document.documentElement).appendChild(s)),s.textContent!==o&&(s.textContent=o)})}a(Oe,"ensureStoreCardStyles");function rs(t,e){let r=(u.find(i=>i.id===t.id)||{}).repo,o=t.repo||r,s=o?`<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${at(o)}">仓库</button>`:"";return`<div class="urppp-skin-card" data-skin="${at(t.id)}">
      <div class="urppp-skin-name">${at(t.name||t.id)}</div>
      <div class="urppp-skin-meta">${at(t.author||"")}${t.author&&t.version?" · ":""}v${at(t.version||"")}</div>
      <p class="urppp-skin-desc">${at(t.description||"")}</p>
      <button type="button" class="urppp-skin-apply" data-store-theme="${at(t.id)}"${e?" disabled":""}>${e?"已安装":"下载"}</button>
      ${s}
    </div>`}a(rs,"themeStoreCard");async function qa(t){let e=t.querySelector('[data-pane="download"]');if(!e)return;let r=[];try{r=(await Ae()).filter(o=>o.type==="theme"&&!me(o.id))}catch{}if(!r.length){e.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载主题</p><p class="urppp-store-sub">已安装的主题不会再显示在这里。</p></div>';return}Oe(r),e.innerHTML=`<div class="urppp-store-theme-grid">${r.map(o=>rs(o,!1)).join("")}</div>`,e.querySelectorAll("[data-store-theme]").forEach(o=>{o.addEventListener("click",()=>as(o.dataset.storeTheme,o))}),e.querySelectorAll("[data-repo]").forEach(o=>o.addEventListener("click",()=>{try{window.open(o.dataset.repo,"_blank","noopener")}catch{}}))}a(qa,"fetchCatalogThemes");async function as(t,e){if(!e||e.disabled)return;e.disabled=!0,e.textContent="下载中…";let r=(await Ae()).find(i=>i.id===t);if(!r||!Array.isArray(r.entry)||!r.entry.length){e.disabled=!1,e.textContent="下载";return}let o="";for(let i of r.entry)try{let l=await fetch(i,{cache:"no-store"});if(l.ok){o=await l.text();break}}catch{}if(!o){e.textContent="下载失败",setTimeout(()=>{e.textContent="下载",e.disabled=!1},1400);return}try{GM_setValue("urppp_theme_css_"+t,o)}catch{}if(r.cardCss)try{GM_setValue("urppp_card_css_"+t,r.cardCss)}catch{}try{ga(t).textContent=o}catch{}try{Oe([{id:t,cardCss:r.cardCss||""}])}catch{}e.textContent="已安装",e.disabled=!0;let s=e.closest&&e.closest(".urppp-store-inline");if(s){try{let i=s.querySelector("#urppp-theme-manage");i&&await Fr(i)}catch{}try{qa(s)}catch{}}try{Dt()}catch{}}a(as,"downloadStoreTheme");function os(t,e){let o=t.installed!==!1?"":`<button type="button" class="urppp-skin-apply urppp-store-del" data-theme-del="${at(t.id)}">删除</button>`,s=e&&e.repo||t.repo,i=s?`<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${at(s)}">仓库</button>`:"",l=e&&e.downloads!=null?`<span class="urppp-store-dl">↓ ${at(String(e.downloads))}</span>`:"",g=Zt()===t.id;return`<div class="urppp-skin-card${g?" is-active":""}" data-skin="${at(t.id)}">
      <div class="urppp-skin-name">${at(t.name)}</div>
      <div class="urppp-skin-meta">${at(e&&e.author||"")}${e&&e.author&&t.version?" · ":""}v${at(t.version||"")}${l?" · "+l:""}</div>
      <p class="urppp-skin-desc">${at(t.desc||"")}</p>
      <button type="button" class="urppp-skin-apply${g?" is-current":""}" data-theme-use="${at(t.id)}"${g?" disabled":""}>${g?"使用中":"使用"}</button>
      ${o}${i}
    </div>`}a(os,"themeManageCardHtml");async function Fr(t){if(!t)return;let e=[];try{e=await Ae()}catch{}let r=nr(),o=Object.keys(r).map(i=>({id:i,name:r[i].name||i,desc:r[i].desc||"本地主题",version:r[i].version||"1.0.0",author:r[i].author||"本地",installed:!1})),s=u.filter(i=>i.installed!==!1||me(i.id)).concat(o.filter(i=>!u.some(l=>l.id===i.id)));if(!s.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无已装主题</p></div>';return}Oe(s.map(i=>e.find(l=>l.id===i.id))),t.innerHTML=`<div class="urppp-store-theme-grid">${s.map(i=>os(i,e.find(l=>l.id===i.id))).join("")}</div>`,t.querySelectorAll("[data-theme-use]").forEach(i=>i.addEventListener("click",()=>{if(Eo(i.dataset.themeUse)){try{Dt()}catch{}t.querySelectorAll(".urppp-skin-card").forEach(l=>{let g=l.dataset.skin,h=l.querySelector(".urppp-skin-apply"),_=Zt()===g;l.classList.toggle("is-active",_),h&&(h.classList.toggle("is-current",_),h.disabled=_,h.textContent=_?"使用中":"使用")})}})),t.querySelectorAll("[data-theme-del]").forEach(i=>i.addEventListener("click",()=>{let l=i.dataset.themeDel,g=Zt()===l;try{GM_setValue("urppp_theme_css_"+l,"")}catch{}try{GM_setValue("urppp_card_css_"+l,"")}catch{}Ii(l),Ni(l);try{if(g){GM_setValue(d,"apple");try{document.documentElement.removeAttribute("data-urppp-skin")}catch{}try{document.body&&document.body.removeAttribute("data-urppp-skin")}catch{}ee(),Wt("default",{manual:!0})}}catch{}try{Dt()}catch{}let h=t.closest(".urppp-store-inline");if(h){try{Fr(t)}catch{}try{qa(h)}catch{}}})),t.querySelectorAll("[data-repo]").forEach(i=>i.addEventListener("click",()=>{try{window.open(i.dataset.repo,"_blank","noopener")}catch{}}))}a(Fr,"fetchThemeManage");function tn(){return`<div class="urppp-store-settings">
      <button type="button" class="urppp-set-follow" data-store-auto-update>自动检测更新：关</button>
      <button type="button" class="urppp-set-btn" data-store-check-update>检查更新</button>
    </div>`}a(tn,"storeManageSettingsHtml");let ns=["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json"],ke=null;async function Ae(t){if(ke&&!t)return ke;let e=a((s,i)=>Promise.race([s,new Promise((l,g)=>setTimeout(()=>g(new Error("timeout")),i))]),"withTimeout"),r=await Promise.allSettled(ns.map(s=>e(fetch(s,{cache:"no-store"}),5e3))),o=[];for(let s of r)if(s.status==="fulfilled"&&s.value&&s.value.ok)try{let i=await s.value.json();if(i&&Array.isArray(i.items)&&(o.length||(o=i.items),i.items.some(l=>l.type==="theme"&&l.cardCss)))return ke=i.items,i.items}catch{}return o.length&&(ke=o),o}a(Ae,"fetchCatalogList");function en(t,e){let r=String(t||"0").split(".").map(Number),o=String(e||"0").split(".").map(Number);for(let s=0;s<Math.max(r.length,o.length);s+=1){let i=r[s]||0,l=o[s]||0;if(i!==l)return i>l}return!1}a(en,"versionGt");function ps(t,e){let r=0;return e.forEach(o=>{if(!o.id)return;let s=t.querySelector('[data-theme-use="'+o.id+'"]');s&&en(o.version,u.find(l=>l.id===o.id)&&u.find(l=>l.id===o.id).version)&&(rn(s.closest(".urppp-skin-card"),"主题"),r+=1);let i=t.querySelector('[data-plugin-id="'+o.id+'"]');if(i){let l=_t&&_t.api&&_t.api.get&&_t.api.get(o.id);l&&en(o.version,l.version)&&(rn(i.closest(".urppp-store-item"),"插件"),r+=1)}}),r}a(ps,"applyStoreUpdateBadges");function rn(t,e){if(!t||t.querySelector(".urppp-store-update"))return;let r=t.querySelector(".urppp-store-ops");if(!r)return;let o=document.createElement("button");o.type="button",o.className="urppp-set-btn urppp-store-update",o.textContent="有新更新",o.addEventListener("click",()=>{try{o.textContent="更新中…"}catch{}}),r.appendChild(o)}a(rn,"addUpdateBadge");function an(t){let e=t.querySelector("[data-store-auto-update]"),r=t.querySelector("[data-store-check-update]");if(!e||!r)return;let o=GM_getValue("urppp_store_auto_update",!1),s=a(()=>{e.textContent="自动检测更新："+(o?"开":"关")},"sync");s(),e.addEventListener("click",()=>{o=!o,GM_setValue("urppp_store_auto_update",o),s()}),r.addEventListener("click",async()=>{r.disabled=!0;let i=r.textContent;r.textContent="检查中…";try{let l=await Ae(),g=ps(t,l);r.textContent=g?"发现更新":"已是最新"}catch{r.textContent="检查失败"}setTimeout(()=>{r.textContent=i,r.disabled=!1},1600)})}a(an,"bindStoreManageSettings");function is(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">主题下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">主题管理</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${tn()}<button type="button" class="urppp-set-btn ghost" data-add-local-theme style="width:100%;margin:0 0 10px">＋ 添加本地主题</button><input type="file" accept=".css,.txt" data-local-theme-file style="display:none"><div class="urppp-store-bd"><div id="urppp-theme-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div></div>
        </div>
      </div>`,Zo(t),an(t),ss(t),qa(t),Fr(t.querySelector("#urppp-theme-manage"))}a(is,"renderThemeStoreBody");function ss(t){let e=t.querySelector("[data-add-local-theme]"),r=t.querySelector("[data-local-theme-file]");!e||!r||(e.addEventListener("click",()=>r.click()),r.addEventListener("change",async()=>{let o=r.files&&r.files[0];if(!o)return;let s=await o.text(),i=s.match(/html\[data-urppp-skin="([\w-]+)"\]/);if(!i){alert('未能从 CSS 中识别主题 id（需要 html[data-urppp-skin="…"]）'),r.value="";return}let l=i[1];try{GM_setValue("urppp_theme_css_"+l,s)}catch{}$i(l,{name:l,desc:"本地主题",author:"本地",version:"1.0.0"});try{ga(l).textContent=s}catch{}r.value="";try{Fr(t.querySelector("#urppp-theme-manage"))}catch{}}))}a(ss,"bindLocalThemeImport");function ls(t){let e=t.downloads!=null?`${at(String(t.downloads))}`:"",r=t.repo?`<button type="button" class="urppp-store-repo" data-repo="${at(t.repo)}">仓库</button>`:"";return`<div class="urppp-skin-card" data-plugin-card="${at(t.id)}">
      <div class="urppp-skin-name">${at(t.name||t.id)}</div>
      <div class="urppp-skin-meta">${at(t.author||"")}${t.author&&t.version?" · ":""}v${at(t.version||"")}${e?" · ↓"+e:""}${r?" · "+r:""}</div>
      <p class="urppp-skin-desc">${at(t.description||"")}</p>
      <button type="button" class="urppp-skin-apply" data-plugin-apply="${at(t.id)}">安装</button>
    </div>`}a(ls,"pluginStoreCard");async function cs(t){if(!t)return;let e=[];try{e=(await Ae()).filter(r=>r.type==="plugin"&&!(_t&&_t.api&&_t.api.isEnabled&&_t.api.isEnabled(r.id)))}catch{}if(!e.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载插件</p><p class="urppp-store-sub">已安装的插件不会再显示在这里。</p></div>';return}t.innerHTML=`<div class="urppp-store-theme-grid">${e.map(r=>ls(r)).join("")}</div>`,t.querySelectorAll("[data-plugin-apply]").forEach(r=>r.addEventListener("click",async()=>{r.disabled=!0;let o=r.textContent;r.textContent="下载中…";try{_t&&_t.api&&_t.api.install&&await _t.api.install(r.dataset.pluginApply,null),r.textContent="已安装";try{Dt()}catch{}}catch{r.textContent="失败"}setTimeout(()=>{r.textContent=o,r.disabled=!1},1200)})),t.querySelectorAll("[data-repo]").forEach(r=>r.addEventListener("click",()=>{try{window.open(r.dataset.repo,"_blank","noopener")}catch{}}))}a(cs,"fetchCatalogPlugins");async function ds(t){if(!t)return;let e=[];try{e=await Ae()}catch{}let r=_t&&_t.api&&_t.api.list&&_t.api.list()||[];if(!r.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}t.innerHTML=r.map(o=>{let s=e.find(g=>g.id===o.id),i=s&&s.downloads!=null?`<span class="urppp-store-dl">↓ ${at(String(s.downloads))}</span>`:"",l=o.repo||s&&s.repo?`<button type="button" class="urppp-set-btn ghost" data-repo="${at(o.repo||s.repo)}">仓库</button>`:"";return`<div class="urppp-store-item">
        <div class="urppp-store-row">
          <div class="urppp-store-info"><strong>${at(o.name||o.id)}</strong>${o.author?`<span class="urppp-store-author">${at(o.author)}</span>`:""}<span class="urppp-store-ver">${o.version?"v"+at(o.version):""}</span><span class="urppp-store-state ok">已装</span>${i}</div>
          <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-op="reload" data-plugin-id="${at(o.id)}">重新装载</button><button type="button" class="urppp-set-btn ghost" data-plugin-op="unload" data-plugin-id="${at(o.id)}">卸载</button>${l}</div>
        </div>
        ${o.description?`<p class="urppp-store-item-desc">${at(o.description)}</p>`:""}
      </div>`}).join(""),t.querySelectorAll('[data-plugin-op="reload"]').forEach(o=>o.addEventListener("click",async()=>{o.disabled=!0;let s=o.textContent;o.textContent="装载中…";try{_t&&_t.api&&_t.api.install&&await _t.api.install(o.dataset.pluginId,null),o.textContent="已装载";try{Dt()}catch{}}catch{o.textContent="失败"}setTimeout(()=>{o.textContent=s,o.disabled=!1},1200)})),t.querySelectorAll('[data-plugin-op="unload"]').forEach(o=>o.addEventListener("click",()=>{try{_t&&_t.api&&_t.api.unregister&&_t.api.unregister(o.dataset.pluginId)}catch{}try{Dt()}catch{}let s=t.closest(".urppp-store-inline");try{on(s)}catch{}})),t.querySelectorAll("[data-repo]").forEach(o=>o.addEventListener("click",()=>{try{window.open(o.dataset.repo,"_blank","noopener")}catch{}}))}a(ds,"fetchPluginManage");function on(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">插件下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">插件管理</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${tn()}<div class="urppp-store-bd" id="urppp-plugin-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div>
        </div>
      </div>`,Zo(t),an(t),cs(t.querySelector('[data-pane="download"]')),ds(t.querySelector("#urppp-plugin-manage"))}a(on,"renderPluginStoreBody");function us(t){if(!t)return;let e=t.querySelector("#urppp-theme-store");e&&!e.dataset.bound&&(e.dataset.bound="1",e.addEventListener("click",()=>La("theme")));let r=t.querySelector("#urppp-skin-list");if(!r)return;let o=Zt();if(r.innerHTML="",!u||!u.length){r.innerHTML='<p class="urppp-set-tip">暂无可用风格</p>';return}u.filter(s=>s.installed!==!1||me(s.id)).forEach(s=>{let i=document.createElement("div");i.className="urppp-skin-card"+(s.id===o?" is-active":""),i.dataset.skin=s.id;let l=document.createElement("button");l.type="button",l.className="urppp-skin-apply";let g=s.installed!==!1||me(s.id);g?s.id===o&&s.ready?(l.classList.add("is-current"),l.textContent="使用中",l.disabled=!0):l.textContent="应用主题":(l.classList.add("is-disabled"),l.textContent="去下载"),l.addEventListener("click",h=>{if(h.preventDefault(),h.stopPropagation(),!g){La("theme");return}if(!(s.id===o&&s.ready)&&Eo(s.id)){Dt();try{window.__urpppCleanMode&&window.__urpppCleanMode.inject&&window.__urpppCleanMode.inject()}catch{}}}),i.innerHTML=['<div class="urppp-skin-name"></div>','<p class="urppp-skin-desc"></p>'].join(""),i.querySelector(".urppp-skin-name").textContent=s.name,i.querySelector(".urppp-skin-desc").textContent=s.desc,i.appendChild(l),r.appendChild(i)})}a(us,"renderSkinCards");let He=[],Ta=!1;function ms(t,e,r){let o=typeof AbortController=="function"?new AbortController:null,s=o?setTimeout(()=>o.abort(),r):null;return fetch(t,{cache:"no-store",headers:e,signal:o?o.signal:void 0}).then(i=>{if(!i.ok)throw new Error("HTTP "+i.status);return i.text()}).finally(()=>{s&&clearTimeout(s)})}a(ms,"fetchWithTimeout");function hs(t,e){return new Promise((r,o)=>{try{GM_xmlhttpRequest({method:"GET",url:t,timeout:12e3,headers:e,onload:a(s=>{s.status>=200&&s.status<400?r(s.responseText||""):o(new Error("HTTP "+s.status))},"onload"),onerror:a(()=>o(new Error("network error")),"onerror"),ontimeout:a(()=>o(new Error("timeout")),"ontimeout")})}catch(s){o(s)}})}a(hs,"gmRequestForUpdate");function bs(t,e){let r={"Cache-Control":"no-cache"};return e&&e.range&&(r.Range=e.range),ms(t,r,12e3).catch(o=>{if(typeof GM_xmlhttpRequest=="function")return hs(t,r);throw o})}a(bs,"fetchTextForUpdate");async function Ma(t,e,r=1e3){let o=[],s=t[0],i=t.slice(1),l=a(z=>bs(z,e).then(F=>({url:z,text:F})).catch(F=>(o.push((z.split("/")[2]||z)+": "+(F&&F.message||F)),null)),"grab"),g=l(s),h=new Promise(z=>setTimeout(()=>z("__TIMEOUT__"),r)),_=await Promise.race([g,h]);if(_!=="__TIMEOUT__"){if(_&&_.text&&_.text.length>0)return _.text;let F=(await Promise.all(i.map(l))).find(J=>J&&J.text&&J.text.length>0);if(F)return F.text;throw new Error("所有更新源均不可用（"+o.join("; ")+"）")}let $=Promise.all(i.map(l)).then(z=>{let F=z.find(J=>J&&J.text&&J.text.length>0);if(F)return F.text;throw new Error("所有更新源均不可用（"+o.join("; ")+"）")}),j=g.then(z=>{if(z&&z.text&&z.text.length>0)return z.text;throw new Error("主源内容无效")}).catch(()=>new Promise(()=>{}));return Promise.race([j,$])}a(Ma,"fetchFirstAvailable");function Se(t,e){let r=document.getElementById("urppp-set-update-status");r&&(r.dataset.locked=t?"1":"",r.innerHTML=t||"",r.style.color=e==="err"?"#b91c1c":e==="ok"?"#15803d":"var(--text-muted)")}a(Se,"setUpdateStatus");async function $a(){let t=p,e="",r=!1,o="";try{let i=await Ma(n.sourceUrls(n.versionJson)),l=JSON.parse(i);e=String(l&&l.version||"").trim(),l&&String(l.prevVersion||"").trim()===t&&(r=!0),l&&typeof l.changelog=="string"&&l.changelog.trim()&&(o=l.changelog)}catch{}if(!e){let i=await Ma(n.sourceUrls("urppp.user.js"),{range:"bytes=0-2048"});e=to(i)}if(!e)throw new Error("无法解析远程主插件版本");let s=yr(e,t);return{id:"main",name:"主插件",local:t,remote:e,status:s>0?"update":s===0?"latest":"ahead",updateUrl:n.mainRaw,pageUrl:n.greasySearch,changelogMd:r?o:""}}a($a,"checkMainUpdate");function nn(t,e,r){let o=String(t||"").replace(/\r\n/g,`
`);if(!o.trim())return"";let s=/^##\s*\[?v?([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)\]?[^\n]*$/gim,i=[],l;for(;(l=s.exec(o))!==null;)i.push({ver:l[1],index:l.index,headEnd:s.lastIndex});if(!i.length)return"";for(let h=0;h<i.length;h++){let _=h+1<i.length?i[h+1].index:o.length;i[h].body=o.slice(i[h].index,_).trim()}let g=[];for(let h of i)yr(h.ver,r)>0||yr(h.ver,e)<=0||g.push(h.body);return g.join(`

`).trim()}a(nn,"extractChangelogRange");function pn(){let t=document.getElementById("urppp-update-toast-style");t&&t.remove();let e=document.createElement("style");e.id="urppp-update-toast-style",e.textContent=`
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
    `,document.documentElement.appendChild(e)}a(pn,"ensureUpdateToastStyles");function gs(t){let e=String(t||"").replace(/\r\n/g,`
`).trim();if(!e)return'<p class="uuc-meta">暂无更新日志</p>';let r=a(g=>{let h=at(g);return h=h.replace(/`([^`]+)`/g,"<code>$1</code>"),h=h.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),h=h.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),h=h.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g,'$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'),h},"inline"),o=e.split(`
`),s=[],i=!1,l=a(()=>{i&&(s.push("</ul>"),i=!1)},"closeList");for(let g=0;g<o.length;g++){let _=o[g].replace(/\s+$/,"");if(!_.trim()){l();continue}let $=_.match(/^(#{2,3})\s+(.+)$/);if($){l();let z=$[1].length,F=$[2];s.push(z===2?`<h2>${r(F)}</h2>`:`<h3>${r(F)}</h3>`);continue}let j=_.match(/^[-*]\s+(.+)$/);if(j){i||(s.push("<ul>"),i=!0),s.push(`<li>${r(j[1])}</li>`);continue}l(),s.push(`<p>${r(_)}</p>`)}return l(),s.join("")||'<p class="uuc-meta">暂无更新日志</p>'}a(gs,"renderChangelogMarkdown");function sn(t){let e=t||document.getElementById("urppp-update-toast");if(!e||!e.classList.contains("open")){e&&e.classList.remove("open","closing");return}if(e.__closing)return;e.__closing=!0,e.classList.add("closing"),e.classList.remove("open");let r=a(()=>{e.classList.remove("closing"),e.__closing=!1,e.removeEventListener("transitionend",o)},"done"),o=a(s=>{s&&s.target!==e||s&&s.propertyName&&s.propertyName!=="opacity"&&s.propertyName!=="transform"||r()},"onEnd");e.addEventListener("transitionend",o),setTimeout(r,380)}a(sn,"hideUpdateToast");function fs(t){let e=t||document.getElementById("urppp-update-changelog");if(!e||!e.classList.contains("open")&&!e.classList.contains("closing")||e.__closing)return;e.__closing=!0,e.classList.add("closing"),e.classList.remove("open");let r=a(()=>{e.classList.remove("closing"),e.__closing=!1,e.removeEventListener("transitionend",o)},"done"),o=a(s=>{s&&s.target!==e||s&&s.propertyName&&s.propertyName!=="opacity"&&s.propertyName!=="background-color"&&s.propertyName!=="background"||r()},"onEnd");e.addEventListener("transitionend",o),setTimeout(r,360)}a(fs,"hideChangelogModal");function ln(t,e){pn();let r=document.getElementById("urppp-update-changelog");r||(r=document.createElement("div"),r.id="urppp-update-changelog",r.innerHTML=`
        <div class="uuc-panel" role="dialog" aria-modal="true" aria-label="更新日志">
          <div class="uuc-head">
            <h3></h3>
            <button type="button" class="uut-btn ghost" data-close="1">关闭</button>
          </div>
          <div class="uuc-body"></div>
        </div>`,r.addEventListener("click",o=>{(o.target===r||o.target&&o.target.getAttribute&&o.target.getAttribute("data-close")==="1")&&fs(r)}),document.documentElement.appendChild(r)),r.querySelector("h3").textContent=t||"更新日志",r.querySelector(".uuc-body").innerHTML=e||'<p class="uuc-meta">暂无更新日志</p>',r.__closing=!1,r.classList.remove("open","closing"),r.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>r.classList.add("open"))})}a(ln,"openChangelogModal");function Ia(t){pn();let e=document.getElementById("urppp-update-toast");e||(e=document.createElement("div"),e.id="urppp-update-toast",e.innerHTML=`
        <button type="button" class="uut-close" aria-label="关闭">×</button>
        <div class="uut-title"></div>
        <div class="uut-sub"></div>
        <div class="uut-actions">
          <button type="button" class="uut-btn" data-act="log">更新日志</button>
          <button type="button" class="uut-btn primary" data-act="go">去更新</button>
          <button type="button" class="uut-btn ghost" data-act="later">稍后</button>
        </div>`,e.querySelector(".uut-close").addEventListener("click",()=>sn(e)),e.addEventListener("click",async r=>{let o=r.target&&r.target.closest?r.target.closest("[data-act]"):null;if(!o)return;let s=o.getAttribute("data-act"),i=e.__pack||{};if(s==="later"){sn(e);return}if(s==="go"){let l=i.updateUrl||n.mainRaw;try{window.open(l,"_blank","noopener,noreferrer")}catch{location.href=l}return}if(s==="log"){o.disabled=!0,o.textContent="加载中…";try{let l=i.changelogMd;l||(l=await Ma(n.sourceUrls("CHANGELOG.md")),i.changelogMd=l);let g=nn(l,i.local,i.remote),h=g?gs(g):'<p class="uuc-meta">未找到区间日志。</p><p><a href="'+n.changelogPage+'" target="_blank" rel="noopener noreferrer">打开完整 CHANGELOG</a></p>';ln("更新日志 "+i.local+" → "+i.remote,h)}catch(l){ln("更新日志","<p>加载失败："+at(l&&l.message||l)+'</p><p><a href="'+n.changelogPage+'" target="_blank" rel="noopener noreferrer">打开 GitHub CHANGELOG</a></p>')}finally{o.disabled=!1,o.textContent="更新日志"}}}),document.documentElement.appendChild(e)),e.__pack=t||{},e.querySelector(".uut-title").textContent="发现新版本 "+(t&&t.remote||""),e.querySelector(".uut-sub").textContent="当前 "+(t&&t.local||"")+" · 主插件可更新",e.__closing=!1,e.classList.remove("open","closing"),e.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>e.classList.add("open"))})}a(Ia,"showUpdateToast");async function Na(){if(ua()&&!window.__urpppAutoUpdateTried){window.__urpppAutoUpdateTried=!0;try{let t=await $a();t&&t.status==="update"&&Ia(t);let e=await xs();if(e)try{console.log("[URP++] 辅助插件热更新到",e.version)}catch{}}catch(t){try{console.debug("[URP++] auto update check failed",t)}catch{}}}}a(Na,"maybeAutoCheckUpdate");function xs(){let t=(window.__urpppUpdateCheckers||He||[]).find(e=>e&&e.id==="assist");return!t||typeof t.check!="function"?Promise.resolve(null):Promise.resolve().then(()=>t.check()).then(e=>e&&e.status==="update"?_t.update("assist"):null).catch(()=>null)}a(xs,"hotUpdateAssist");async function Ba(){if(Ta)return;Ta=!0;let t=document.getElementById("urppp-set-check-update");t&&(t.disabled=!0,t.textContent="检查中…"),Se("正在从多源检查更新…");try{let e=[$a()];(He||[]).forEach(h=>{h&&typeof h.check=="function"&&e.push(Promise.resolve().then(()=>h.check()).then(_=>_||{id:h.id||"extra",name:h.name||"扩展",status:"err",message:"无结果"}).catch(_=>({id:h.id||"extra",name:h.name||"扩展",status:"err",message:String(_&&_.message||_)})))});let r=await Promise.all(e),o=r.map(h=>{if(!h)return"";if(h.status==="err")return`• <b>${at(h.name||h.id)}</b>：检查失败（${at(h.message||"unknown")}）`;if(h.status==="update"){let _="";if(h.id==="assist"&&_t&&_t.loaded("assist"))_=' <a class="urppp-update-relaunch" href="javascript:void(0)" data-urppp-relaunch="assist" rel="nofollow">重新装载</a>';else{let $=h.updateUrl?` <a href="${at(h.updateUrl)}" target="_blank" rel="noopener noreferrer">打开更新源</a>`:"",j=h.pageUrl?` <a href="${at(h.pageUrl)}" target="_blank" rel="noopener noreferrer">Greasy Fork</a>`:"";_=$+j}return`• <b>${at(h.name)}</b>：发现新版本 <b>${at(h.remote)}</b>（当前 ${at(h.local)}）${_}`}return h.status==="ahead"?`• <b>${at(h.name)}</b>：本地 ${at(h.local)} 新于远程 ${at(h.remote)}`:`• <b>${at(h.name)}</b>：已是最新（${at(h.local)}）`}).filter(Boolean),s=r.some(h=>h&&h.status==="update"),i=r.some(h=>h&&h.status==="err");Se(`${s?"检查完成：发现更新":i?"检查完成：部分失败":"检查完成：全部最新"}<br>${o.join("<br>")}<br><span style="opacity:.85">仓库：<a href="${n.repo}" target="_blank" rel="noopener noreferrer">SCU-URP-plusplus</a></span>`,i?"err":"ok");let g=document.querySelector('#urppp-set-update-status .urppp-update-relaunch[data-urppp-relaunch="assist"]');g&&g.addEventListener("click",()=>{try{Se("正在重新装载辅助插件…",""),_t.install("assist").then(()=>{Se("辅助插件已重新装载，刷新页面后生效。","ok")}).catch(h=>{Se("重新装载失败："+(h&&h.message?h.message:h),"err")})}catch(h){Se("重新装载失败："+(h&&h.message?h.message:h),"err")}})}catch(e){Se("检查失败："+at(e&&e.message||e),"err")}finally{Ta=!1,t&&(t.disabled=!1,t.textContent="检查更新")}}a(Ba,"checkForUpdates");function cn(){let t=document.getElementById("urppp-set-update-status");if(!t||t.dataset.locked==="1")return;let e="当前主插件："+p,r=t.getAttribute("data-assist-version")||"";r&&(e+="；辅助插件："+r),t.textContent=e,t.style.color="var(--text-muted)"}a(cn,"refreshUpdateStatusHint");function ys(t){if(!t||typeof t.check!="function")return!1;let e=String(t.id||t.name||"").trim();if(!e)return!1;let r=He.findIndex(s=>s&&s.id===e),o={id:e,name:t.name||e,check:t.check,localVersion:t.localVersion||""};r>=0?He[r]=o:He.push(o);try{let s=document.getElementById("urppp-set-update-status");s&&o.localVersion&&e==="assist"&&s.setAttribute("data-assist-version",String(o.localVersion))}catch{}try{cn()}catch{}return!0}a(ys,"registerUpdateChecker");function vs(){let t={version:p,urls:n,check:Ba,checkMain:$a,registerChecker:ys,compareVersions:yr,parseUserscriptVersion:to,extractChangelogRange:nn,showUpdateToast:Ia,maybeAutoCheckUpdate:Na,listCheckers:a(()=>He.slice(),"listCheckers")};try{window.__urpppUpdate=t}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppUpdate=t)}catch{}return t}a(vs,"publishUpdateApi"),vs();let{rebuildSidebarCompletely:dn,syncMobileContentOffset:Re,syncSidebarUnderNavbar:_e}=_i({}),{rebuildDashboard:ws}=bi({deps:{statCardPrivacyMarkup:Es}}),ks="urppp-clean-open",Fa={100:4,99:4,98:4,97:4,96:4,95:4,94:3.9,93:3.8,92:3.7,91:3.6,90:3.5,89:3.4,88:3.3,87:3.2,86:3.1,85:3,84:2.9,83:2.8,82:2.7,81:2.6,80:2.5,79:2.4,78:2.3,77:2.2,76:2.1,75:2,74:1.9,73:1.8,72:1.7,71:1.6,70:1.5,69:1.4,68:1.3,67:1.2,66:1.1,65:1,64:.9,63:.8,62:.7,61:.6,60:.5};function ie(t){if(t==null||t==="")return!1;let e=String(t).trim();if(!e)return!1;if(/未评估|未评教|待评估|待评教/.test(e))return!0;let r=Number(e);return!Number.isNaN(r)&&r<0}a(ie,"isUnevaluatedScore");function Dr(t){if(t==null||t==="")return!1;let e=Number(t);return!Number.isNaN(e)&&e>=0&&e<=5}a(Dr,"isValidOfficialGpa");function jr(t){let e=String(t||"").trim();if(!e)return"";let r=e.match(/[\u4e00-\u9fffA-Za-z0-9]/);return r?r[0]:e.charAt(0)}a(jr,"firstContentChar");function Da(t,e){let r=String(t||""),o=Number(e)||0;return!r||o<=0||o>r.length?!1:r.charAt(o-1)==="1"}a(Da,"weekBitmapActive");function Ue(t){if(t==null||t==="")return null;let e=String(t).trim();if(!e||ie(e)||/^免修$|^通过$|^取消$|^缓考$|^旷考$|^缺考$/.test(e))return null;if(/^A\+$/i.test(e)||/^A$/i.test(e))return 4;if(/^A-$/i.test(e))return 3.7;if(/^B\+$/i.test(e))return 3.3;if(/^B$/i.test(e))return 3;if(/^B-$/i.test(e))return 2.7;if(/^C\+$/i.test(e))return 2.3;if(/^C$/i.test(e))return 2;if(/^C-$/i.test(e))return 1.7;if(/^D$/i.test(e))return 1.3;if(/^F$/i.test(e))return 0;if(/优秀/.test(e))return 4;if(/良好/.test(e))return 3;if(/中等/.test(e))return 2;if(/及格/.test(e)&&!/不及格/.test(e))return 1;if(/不及格|不合格|不通过/.test(e))return 0;if(/合格/.test(e))return 1;let r=parseFloat(e.replace(/[^\d.]/g,""));if(Number.isNaN(r)||r<0)return null;let o=Math.round(r);return o<60?0:o>100?4:Fa[o]!=null?Fa[o]:Fa[Math.max(60,Math.min(100,Math.floor(r)))]||0}a(Ue,"scoreToGpa");function We(t){let e=String(t||"").trim();if(!e||ie(e))return null;if(/优秀/.test(e))return 95;if(/良好/.test(e))return 85;if(/中等/.test(e))return 75;if(/及格/.test(e)&&!/不及格/.test(e))return 65;if(/不及格|不合格|不通过/.test(e))return 0;if(/合格/.test(e))return 70;if(/^A/i.test(e))return 95;if(/^B/i.test(e))return 85;if(/^C/i.test(e))return 75;if(/^D/i.test(e))return 65;if(/^F/i.test(e))return 0;let r=parseFloat(e.replace(/[^\d.]/g,""));return Number.isNaN(r)||r<0?null:r}a(We,"scoreToNumber");function Ee(t){return Math.round((Number(t)||0)*100)/100}a(Ee,"round2");function un(t){return/必修/.test(String(t||""))}a(un,"isRequiredAttr");function re(t){let e=0,r=0,o=0,s=0,i=0,l=0,g=0,h=0;return(t||[]).forEach(_=>{if(_&&(_.unevaluated||ie(_.score)))return;let $=Number(_.credit)||0,j=We(_.score),z=Dr(_.officialGpa)?Number(_.officialGpa):Ue(_.score);j==null||$<=0||(e+=$,r+=j*$,z!=null&&(o+=z*$,s+=$),_.required&&(i+=$,l+=j*$,z!=null&&(g+=z*$,h+=$)))}),{totalCredit:Ee(e),avgScore:Ee(e?r/e:0),avgGpa:Ee(s?o/s:0),requiredCredit:Ee(i),requiredGpa:Ee(h?g/h:0),requiredAvg:Ee(i?l/i:0),count:(t||[]).length}}a(re,"summarizeCourses");function ja(t){let e=String(t||"");return/^https?:\/\//i.test(e)?e:e.startsWith("//")?location.protocol+e:e.startsWith("/")?location.origin+e:location.origin+"/"+e.replace(/^\.\//,"")}a(ja,"absUrl");function Jt(t,e){let r=ja(t),o=e&&e.method||"GET",s=e&&e.data||null;return new Promise((i,l)=>{let g=a((h,_)=>h?i(_):l(new Error(_||"fetch failed")),"done");try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:o,url:r,data:s||void 0,headers:e&&e.headers?e.headers:{},withCredentials:!0,onload:a(h=>{h.status>=200&&h.status<400?g(!0,h.responseText||""):g(!1,"HTTP "+h.status)},"onload"),onerror:a(()=>g(!1,"network error"),"onerror")});return}}catch{}fetch(r,{method:o,credentials:"include",cache:"no-store",headers:e&&e.headers?e.headers:{},body:s||void 0}).then(h=>{if(!h.ok)throw new Error("HTTP "+h.status);return h.text()}).then(h=>g(!0,h)).catch(h=>g(!1,h&&h.message))})}a(Jt,"fetchText");function Or(t){return new DOMParser().parseFromString(String(t||""),"text/html")}a(Or,"parseHtml");function mn(){if(document.getElementById("urppp-feature-style"))return;let t=document.createElement("style");t.id="urppp-feature-style",t.textContent=Rp,(document.head||document.documentElement).appendChild(t)}a(mn,"ensureFeatureStyles");function As(){if(document.getElementById("urppp-schedule-export-style"))return;let t=document.createElement("style");t.id="urppp-schedule-export-style",t.textContent=Gp,(document.head||document.documentElement).appendChild(t)}a(As,"ensureScheduleExportStyles");function Ss(){if(document.getElementById("urppp-settings-style"))return;let t=document.createElement("style");t.id="urppp-settings-style",t.textContent=Jp,(document.head||document.documentElement).appendChild(t)}a(Ss,"ensureSettingsStyles");function hn(t){let r=(t&&t.querySelector?t:document).querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(!r)return null;let o=r.querySelector(".urppp-user-name-value");if(o)return o;let s=r.cloneNode(!0);s.querySelectorAll("small, i, img, b, .badge").forEach(g=>g.remove());let i=(s.textContent||"").replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim();Array.from(r.childNodes).forEach(g=>{g.nodeType===Node.TEXT_NODE&&g.textContent.trim()&&g.remove()});let l=document.createElement("span");return l.className="urppp-user-name-value",l.textContent=i||"同学",l.__urpppOriginalText=l.textContent,r.appendChild(l),l}a(hn,"ensureNavNameTarget");function Hr(t){let e=String(t||"").replace(/[\s:：]/g,"");return e?/姓名|英文姓名|姓名拼音/.test(e)?"name":/学号|证件|身份证|护照|证书编号|考生号|录取号|学籍号/.test(e)?"identity":/学院|院系|专业|班级|年级|主修方案|培养方案|专业方向|分流方向|毕业中学/.test(e)?"organization":/电话|手机|电子邮件|邮箱|QQ|地址|家长|个人主页|出生日期|入学日期|乘车区间|性别|籍贯|民族|政治面貌|国籍|户口|户籍|生源|出生地|健康|宗教|血型|婚姻|联系人|家庭/.test(e)?"contact":/绩点|GPA/.test(e)?"gpa":/学分/.test(e)?"credit":/成绩|分数|高考总分|均分|平均分|必修平均|课程门数|及格课程|不及格课程|待修读课程|已修读课程/.test(e)?"grade":/课表|日程安排/.test(e)?"schedule":"":""}a(Hr,"classifyPrivacyLabel");function _s(t,e){let r=String(t||"")+" "+String(e||"");return/绩点|GPA/.test(r)?"majorGpa":/主修为|培养方案|方案/.test(r)?"majorPlan":/尚不及格|未及格/.test(r)?"failedCourses":/待修读课程/.test(r)?"remainingCourses":/已修读课程/.test(r)?"completedCourses":""}a(_s,"classifyHomeDataKey");function Rr(t,e,r){let o=e?` data-urppp-edit-key="${e}"`:"";return`<span class="urppp-private-value" data-urppp-private="${t}"${o}>${r}</span>`}a(Rr,"homePrivateValueSpan");function Es(t,e){let r=at(t),o=at(e),s=_s(t,e),l={completedCourses:"other",failedCourses:"other",majorGpa:"gpa",majorPlan:"organization",remainingCourses:"other"}[s]||Hr(String(t||"")+" "+String(e||""));if(l==="organization")return e?{valueHtml:r,labelHtml:Rr("organization",s,o)}:{valueHtml:Rr("organization",s,r),labelHtml:o};if(!["grade","gpa","credit","other"].includes(l))return{valueHtml:r,labelHtml:o};let g=String(e||"").match(/-?\d+(?:\.\d+)?/);if(!(/^-?\d+(?:\.\d+)?$/.test(String(t||"").trim())||/^(优秀|良好|中等|及格|不及格|合格|不合格)$/.test(String(t||"").trim()))&&g){let _=g.index||0,$=String(e).slice(0,_),j=String(e).slice(_+g[0].length);return{valueHtml:r,labelHtml:`${at($)}${Rr(l,s,at(g[0]))}${at(j)}`}}return{valueHtml:Rr(l,s,r),labelHtml:o}}a(Es,"statCardPrivacyMarkup");function Ce(t,e){if(!t||t.mode==="off")return"";if(t.mode==="one")return t.mask||Ar;if(e==="name")return"";let r=t.fields&&t.fields[e];return!r||!r.enabled?"":String(r.replacement||t.mask||Ar)}a(Ce,"privacyReplacement");function dr(t,e){if(!(!t||!e)&&!(t.querySelector&&t.querySelector("input,select,textarea,button"))){if(!t.classList.contains("urppp-private-text")){let r=getComputedStyle(t).fontSize;r&&r!=="0px"&&t.style.setProperty("--urppp-private-font-size",r)}t.classList.add("urppp-private-text"),t.setAttribute("data-urppp-private-mask",e)}}a(dr,"markPrivateText");function bn(t,e){if(!t||!t.parentElement)return;let r=t.parentElement;t.classList.add("urppp-private-avatar"),r.classList.add("urppp-private-avatar-host"),r.setAttribute("data-urppp-private-mask",e||Ar);let o=t.getBoundingClientRect();r.style.setProperty("--urppp-avatar-left",t.offsetLeft+"px"),r.style.setProperty("--urppp-avatar-top",t.offsetTop+"px"),r.style.setProperty("--urppp-avatar-width",Math.max(1,o.width)+"px"),r.style.setProperty("--urppp-avatar-height",Math.max(1,o.height)+"px"),r.style.setProperty("--urppp-avatar-radius",getComputedStyle(t).borderRadius||"50%")}a(bn,"markPrivateAvatar");function Cs(t,e){if(!t||!e)return;let r=t.matches("table")&&t.closest(".table-responsive, .urppp-table-wrap")||t;r.classList.add("urppp-private-block"),r.setAttribute("data-urppp-private-mask",e)}a(Cs,"markPrivateBlock");function Ps(t,e){if(!(!t||!U[e])){if(!t.hasAttribute("data-urppp-direct-tabindex")){let r=t.getAttribute("tabindex");t.setAttribute("data-urppp-direct-tabindex",r??"__none__"),t.__urpppDirectTitle=t.getAttribute("title"),t.__urpppDirectAriaLabel=t.getAttribute("aria-label")}t.classList.add("urppp-direct-editable"),t.setAttribute("tabindex","0"),t.setAttribute("data-urppp-edit-key",e),t.setAttribute("aria-label","修改"+U[e]+"显示值"),t.title="点击修改显示值"}}a(Ps,"markDirectEditable");let be=null;function gn(t){let e=t&&t.getAttribute("data-urppp-edit-key");if(!e||!U[e])return;be&&be.__finish&&be.__finish(!1);let r=ve();if(r.mode!=="custom"||!r.directEdit.enabled)return;let s=String(r.directEdit.values[e]||"")||t.getAttribute("data-urppp-private-mask")||String(t.textContent||"").trim(),i=t.getBoundingClientRect(),l=t.parentElement?.getBoundingClientRect(),g=i.height>=8||!l?i:{left:i.left,top:l.top,width:Math.max(i.width,40),height:l.height},h=document.createElement("input"),_=getComputedStyle(t),$=Math.min(Math.max(g.width+64,140),Math.max(140,window.innerWidth-24)),j=Math.min(Math.max(12,g.left),Math.max(12,window.innerWidth-$-12)),z=Math.min(Math.max(12,g.top+(g.height-36)/2),Math.max(12,window.innerHeight-48));h.type="text",h.maxLength=80,h.className="urppp-direct-edit-input",h.value=s,h.setAttribute("aria-label","修改"+U[e]+"显示值"),h.style.left=j+"px",h.style.top=z+"px",h.style.setProperty("--urppp-direct-edit-width",$+"px"),h.style.fontFamily=_.fontFamily,h.style.fontSize=(window.innerWidth<=520?16:Math.min(18,Math.max(13,parseFloat(_.fontSize)||14)))+"px";let F=!1,J=a(D=>{if(F||(F=!0,h.remove(),be===h&&(be=null),D))return;let R=ve();R.mode!=="custom"||!R.directEdit.enabled||(R.directEdit.values[e]=String(h.value||"").trim().slice(0,80),ma(R),Vt(document),Wa(R.directEdit.values[e]?"显示值已更新":"已恢复分类设置"))},"finish");h.__finish=J,h.addEventListener("click",D=>D.stopPropagation()),h.addEventListener("blur",()=>J(!1)),h.addEventListener("keydown",D=>{D.key==="Enter"&&(D.preventDefault(),J(!1)),D.key==="Escape"&&(D.preventDefault(),J(!0))}),document.documentElement.appendChild(h),be=h,h.focus(),h.select()}a(gn,"openDirectEditInput");function zs(){document.__urpppDirectEditBound||(document.__urpppDirectEditBound=!0,document.addEventListener("click",t=>{let e=t.target?.closest?.(".urppp-direct-editable");e&&(t.preventDefault(),t.stopPropagation(),gn(e))},!0),document.addEventListener("keydown",t=>{if(!["Enter"," "].includes(t.key))return;let e=t.target?.closest?.(".urppp-direct-editable");e&&(t.preventDefault(),t.stopPropagation(),gn(e))},!0))}a(zs,"bindDirectEditInteraction");function Ls(t){let e=t&&t.querySelectorAll?t:document;e.querySelectorAll(".urppp-direct-editable").forEach(r=>{let o=r.getAttribute("data-urppp-direct-tabindex");r.classList.remove("urppp-direct-editable"),r.removeAttribute("data-urppp-direct-tabindex"),o==="__none__"?r.removeAttribute("tabindex"):o!=null&&r.setAttribute("tabindex",o),r.__urpppDirectTitle==null?r.removeAttribute("title"):r.setAttribute("title",r.__urpppDirectTitle),r.__urpppDirectAriaLabel==null?r.removeAttribute("aria-label"):r.setAttribute("aria-label",r.__urpppDirectAriaLabel),delete r.__urpppDirectTitle,delete r.__urpppDirectAriaLabel}),e.querySelectorAll(".urppp-private-text").forEach(r=>{r.classList.remove("urppp-private-text"),r.removeAttribute("data-urppp-private-mask"),r.style.removeProperty("--urppp-private-font-size")}),e.querySelectorAll(".urppp-private-avatar").forEach(r=>r.classList.remove("urppp-private-avatar")),e.querySelectorAll(".urppp-private-avatar-host").forEach(r=>{r.classList.remove("urppp-private-avatar-host"),r.removeAttribute("data-urppp-private-mask"),["--urppp-avatar-left","--urppp-avatar-top","--urppp-avatar-width","--urppp-avatar-height","--urppp-avatar-radius"].forEach(o=>r.style.removeProperty(o))}),e.querySelectorAll(".urppp-private-avatar-block").forEach(r=>{r.classList.remove("urppp-private-avatar-block"),r.removeAttribute("data-urppp-private-mask")}),e.querySelectorAll(".urppp-private-block").forEach(r=>{r.classList.remove("urppp-private-block"),r.removeAttribute("data-urppp-private-mask")})}a(Ls,"clearPrivacyDisplay");function fn(t,e,r){if(!t||t.matches?.("input,select,textarea,button")||t.querySelector?.("input,select,textarea,button"))return;if(t.__urpppOriginalText==null){if(!e)return;t.__urpppOriginalText=t.textContent||""}let o=e&&r?r:t.__urpppOriginalText;t.textContent!==o&&(t.textContent=o)}a(fn,"applyCustomText");function qs(t){let e=t&&t.querySelectorAll?t:document,r=$e(),s=e.querySelector?.(".urppp-user-name-value")||(r.nameEnabled?hn(e):null);fn(s,r.nameEnabled,r.name),e.querySelectorAll(".profile-info-row").forEach(g=>{let h=g.querySelector(".profile-info-name"),_=g.querySelector(".profile-info-value");!h||!_||String(h.textContent||"").replace(/[\s:：]/g,"")!=="姓名"||fn(_,r.nameEnabled,r.name)});let i=rr(r.avatar),l=r.avatarEnabled&&!!i;e.querySelectorAll("#navbar img.nav-user-photo, #urppp-mobile-user img.nav-user-photo, img#avatar, .profile-picture img").forEach(g=>{let h=g.getAttribute("src")||"";h&&h!==g.__urpppAppliedCustomSrc&&(g.__urpppOriginalSrc=h),l?(g.__urpppOriginalSrc==null&&(g.__urpppOriginalSrc=h),h!==i&&g.setAttribute("src",i),g.__urpppAppliedCustomSrc=i):g.__urpppAppliedCustomSrc!=null&&(g.__urpppOriginalSrc&&g.setAttribute("src",g.__urpppOriginalSrc),delete g.__urpppAppliedCustomSrc)})}a(qs,"applyCustomIdentityDisplay");function Ts(t,e){t.querySelectorAll(".profile-info-row").forEach(r=>{let o=r.querySelector(".profile-info-name, th, label"),s=r.querySelector(".profile-info-value, td:last-child");if(!o||!s||o===s)return;let i=Hr(o.textContent),l=Ce(e,i);l&&dr(s,l)})}a(Ts,"applyProfilePrivacy");function Ms(t,e){t.querySelectorAll("table").forEach(r=>{let o=Array.from(r.querySelectorAll("thead th, thead td, tr:first-child th, tr:first-child td"));if(!o.length)return;let s=o.map(i=>{let l=Hr(i.textContent);return["grade","gpa","credit"].includes(l)?l:""});s.some(Boolean)&&r.querySelectorAll("tbody tr").forEach(i=>{let l=i.querySelectorAll("td");s.forEach((g,h)=>{let _=Ce(e,g);g&&_&&dr(l[h],_)})})})}a(Ms,"applyScoreTablePrivacy");function $s(t){let e=t&&t.querySelectorAll?t:document,r=ve();if(r.mode==="off")return;let o=Ce(r,"name"),s=Ce(r,"avatar"),i=Ce(r,"schedule"),l=o?hn(e):e.querySelector?.(".urppp-user-name-value");o&&dr(l,o),[["#courseNum, #coursePas, #xy_kcms","other"],["#gpa","gpa"],["#bottom","organization"]].forEach(([_,$])=>{let j=Ce(r,$);j&&e.querySelectorAll(_).forEach(z=>dr(z,j))}),Ms(e,r);let h=r.mode==="custom"&&r.directEdit.enabled;if(e.querySelectorAll("[data-urppp-private]").forEach(_=>{let $=_.getAttribute("data-urppp-private"),j=_.getAttribute("data-urppp-edit-key"),F=(h&&j?String(r.directEdit.values[j]||"").trim():"")||Ce(r,$);!["avatar","schedule"].includes($)&&F&&dr(_,F),h&&j&&Ps(_,j)}),h&&zs(),Ts(e,r),s&&(e.querySelectorAll('[data-urppp-private="avatar"]').forEach(_=>{let $=_.matches("img")?_:_.querySelector("img");$?bn($,s):(_.classList.add("urppp-private-avatar-block"),_.setAttribute("data-urppp-private-mask",s))}),e.querySelectorAll("#navbar img.nav-user-photo, img#avatar, .profile-picture img, .uc-avatar img").forEach(_=>bn(_,s))),i){let _=Array.from(e.querySelectorAll('[data-urppp-private="schedule"], #main-calendar, #courseTable'));_.filter($=>!_.some(j=>j!==$&&j.contains($))).forEach($=>Cs($,i))}}a($s,"applyPrivacyDisplay");let Oa=0,se=[];function xn(){let t=ve(),e=$e();return t.mode!=="off"||e.nameEnabled||e.avatarEnabled}a(xn,"personalDisplayIsEnabled");function Is(){se=se.filter(({root:t})=>t&&t.isConnected),se.forEach(({root:t,observer:e})=>e.observe(t,{childList:!0,subtree:!0}))}a(Is,"resumePersonalDisplayObservers");function Vt(t){let e=t||document;se.forEach(({observer:r})=>r.disconnect());try{mn()}catch{}try{Ls(e)}catch{}try{qs(e)}catch(r){console.warn("[URP++] custom identity",r)}try{$s(e)}catch(r){console.warn("[URP++] privacy",r)}xn()?(Is(),Bs()):(clearTimeout(Oa),se=[])}a(Vt,"applyPersonalDisplay");function Ns(t){clearTimeout(Oa),Oa=setTimeout(()=>Vt(t||document),140)}a(Ns,"schedulePersonalDisplay");function Ha(){try{nt&&nt.open&&Xe()}catch{}}a(Ha,"refreshCleanPersonalDisplay");function Bs(){if(!xn()){se.forEach(({observer:t})=>t.disconnect()),se=[];return}[document.getElementById("navbar"),document.getElementById("page-content-template"),document.getElementById("urppp-clean-root")].filter(Boolean).forEach(t=>{if(se.some(r=>r.root===t))return;let e=new MutationObserver(()=>Ns(document));se.push({root:t,observer:e}),e.observe(t,{childList:!0,subtree:!0})})}a(Bs,"bindPersonalDisplayObservers");function Fs(t){let e=Object.assign({},t||{}),r=$e();r.nameEnabled&&r.name&&(e.name=r.name);let o=rr(r.avatar);return r.avatarEnabled&&o&&(e.avatar=o),e}a(Fs,"personalizedProfile");let yn="/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback",Ds="/student/courseSelect/thisSemesterCurriculum/callback",js="/student/courseSelect/thisSemesterCurriculum/index";async function Os(){let t=document.querySelector("#planCode, #zxjxjhh");if(t&&t.value&&t.value!=="no")return String(t.value);try{let e=new URLSearchParams(location.search),r=e.get("planCode")||e.get("zxjxjhh");if(r)return r}catch{}if(nt&&nt.schedule&&nt.schedule.exportData){let e=nt.schedule.exportData.semester&&nt.schedule.exportData.semester.planCode;if(e)return e}if(/\/student\/courseSelect\/courseSelectResult\//.test(location.pathname))try{let e=await Jt(Ds),r=JSON.parse(e),o=er(r);if(o)return o}catch{}return""}a(Os,"resolveSchedulePlanCode");async function vn(t){let e=await Os(),r=e?{method:"POST",data:"planCode="+encodeURIComponent(e),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}:null,o=await Jt(yn,r),s;try{s=JSON.parse(o)}catch{throw new Error("课表接口返回了非 JSON 内容，请刷新教务页面后重试")}e||(e=er(s)),(!s.jcsjbs||!s.jcsjbs.length)&&e&&(s=JSON.parse(await Jt(yn,{method:"POST",data:"planCode="+encodeURIComponent(e),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}})));let i=kn(s,e,t);if(!i.courses.length)throw new Error("没有读取到可导出的课表数据");return i}a(vn,"loadScheduleExportData");function Ra(t){return String(t||"学生课表").replace(/[\\/:*?"<>|]+/g,"-").replace(/\s+/g,"").slice(0,80)||"学生课表"}a(Ra,"safeScheduleFilename");function Ua(t,e){let r=URL.createObjectURL(t),o=document.createElement("a");o.href=r,o.download=e,o.style.display="none",document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(r),1200)}a(Ua,"downloadBlob");function Hs(t){let e=Qr(t),r=zr(),o=r.enabled?Kr(e,r.mapping):Xr(e),s=JSON.stringify(o,null,2)+`
`;return Ua(new Blob([s],{type:"application/json;charset=utf-8"}),Ra(t.semester.label)+".json"),Object.assign({customFormat:r.enabled},e.stats)}a(Hs,"exportScheduleJson");function wn(t){let r=(Array.from(document.querySelectorAll(".span_bbzx")).map(l=>l.textContent||"").join(" ")+" "+(document.querySelector("#navbar")?.textContent||"")).replace(/\s+/g," ").match(/(\d{4})-(\d{4})\s*(春|秋).*?第\s*(\d{1,2})\s*周/);if(!r)return"";let o=r[3]==="秋"?"1":"2";if(t&&!String(t).startsWith(r[1]+"-"+r[2]+"-"+o))return"";let s=Number(r[4]);if(s<1||s>30)return"";let i=ao(new Date);return i.setDate(i.getDate()-(s-1)*7),kr(i)}a(wn,"deriveCurrentSemesterMonday");function kn(t,e,r){let o=e||er(t),s=wn(o)||ha()[o]||"";return lp(t,o,r,{firstMonday:s})}a(kn,"normalizeScheduleDataForPage");function Rs(t){let e=t.semester.planCode,r=ha()[e],o=wn(e);return o?(xo(e,o),Promise.resolve(o)):tr(r)?Promise.resolve(r):new Promise((s,i)=>{document.querySelector('.urppp-dialog-mask[data-dialog="schedule-date"]')?.remove();let l=document.createElement("div");l.className="urppp-dialog-mask",l.dataset.dialog="schedule-date",l.innerHTML=`<div class="urppp-dialog" role="dialog" aria-modal="true"><h3>确认第一教学周周一</h3><p>${at(t.semester.label)}没有可可靠推导的起始日期。该日期决定 ICS 中每节课的实际日历时间；预填值仅为估算，请对照校历核对。</p><input type="date" value="${at(r||op(e))}"><div class="urppp-dialog-actions"><button type="button" class="urppp-set-btn ghost" data-action="cancel">取消</button><button type="button" class="urppp-set-btn" data-action="ok">确认并导出</button></div></div>`,document.documentElement.appendChild(l);let g=a((h,_)=>{l.remove(),h?i(h):s(_)},"close");l.querySelector('[data-action="cancel"]').addEventListener("click",()=>g(new Error("已取消导出"))),l.querySelector('[data-action="ok"]').addEventListener("click",()=>{let h=l.querySelector("input").value;tr(h)&&(xo(e,h),g(null,h))}),l.addEventListener("click",h=>{h.target===l&&g(new Error("已取消导出"))})})}a(Rs,"requestScheduleFirstMonday");async function Us(t){let e=await Rs(t),r=pp(t,e);return Ua(new Blob([r],{type:"text/calendar;charset=utf-8"}),Ra(t.semester.label)+".ics"),ip(t)}a(Us,"exportScheduleIcs");let Ws={apple:"类 Apple",flat:"极简扁平",organic:"自然有机",brutal:"新野兽派",editorial:"编辑杂志",neu:"新拟物"};function le(t,e,r){if(typeof document>"u")return Gt(e)||"#000000";let o=document.createElement("span");o.style.cssText="position:fixed;left:-9999px;visibility:hidden;color:var("+t+","+e+")",(document.body||document.documentElement).appendChild(o);let s=getComputedStyle(o).color;o.remove();let i=String(s||"").match(/[\d.]+/g)?.map(Number)||[];if(i.length>=3){let l=xr(i[0],i[1],i[2]),g=i.length>3?Math.max(0,Math.min(1,i[3])):1;return g<1?Bt(r||e,l,g):l}return Gt(s)||Gt(e)||"#000000"}a(le,"resolvedScheduleImageColor");function An(){let t=Qt(),e=Zt(),r=t==="dark",o=r?{bg:"#000000",surface:"#1C1C1E",input:"#2C2C2E",text:"#F5F5F7",secondary:"#A1A1A6",muted:"#8E8E93",border:"#38383A",primary:"#0A84FF"}:{bg:"#F5F5F7",surface:"#FFFFFF",input:"#F5F5F7",text:"#1D1D1F",secondary:"#6E6E73",muted:"#86868B",border:"#D2D2D7",primary:"#0071E3"},s={bg:le("--bg",o.bg),surface:le(e==="neu"?"--neu-base":"--surface",o.surface),input:le("--input-bg",o.input),text:le("--text",o.text),secondary:le("--text-secondary",o.secondary),muted:le("--text-muted",o.muted),border:le("--border",o.border,le(e==="neu"?"--neu-base":"--surface",o.surface)),primary:le("--primary",o.primary)},i={apple:{frameRadius:24,headerRadius:13,gridRadius:10,cardRadius:12,frameStroke:1,cardStroke:1,shadow:"soft"},flat:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:2,cardStroke:2,shadow:"none"},organic:{frameRadius:30,headerRadius:18,gridRadius:14,cardRadius:18,frameStroke:1,cardStroke:1,shadow:"warm"},brutal:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:3,cardStroke:3,shadow:"hard"},editorial:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:1,cardStroke:1,shadow:"none",serif:!0},neu:{frameRadius:22,headerRadius:14,gridRadius:10,cardRadius:14,frameStroke:0,cardStroke:0,shadow:"neu"}};return{id:t,skin:e,dark:r,label:(Ws[e]||e)+" · "+(Ct[t]&&Ct[t].name||t),colors:s,shape:i[e]||i.apple}}a(An,"currentScheduleImageTheme");function Sn(t,e){return xp(t,e||An())}a(Sn,"buildScheduleSvg");function Gs(t){return new Promise((e,r)=>{let o=new Blob([t.svg],{type:"image/svg+xml;charset=utf-8"}),s=URL.createObjectURL(o),i=new Image;i.onload=()=>{try{let g=Math.min(2,Math.sqrt(15e6/(t.width*t.height))),h=document.createElement("canvas");h.width=Math.floor(t.width*g),h.height=Math.floor(t.height*g);let _=h.getContext("2d");_.scale(h.width/t.width,h.height/t.height),_.fillStyle=t.background||"#F8FAFC",_.fillRect(0,0,t.width,t.height),_.drawImage(i,0,0,t.width,t.height),h.toBlob($=>$?e($):r(new Error("无法生成课表图片")),"image/png")}catch(l){r(l)}finally{URL.revokeObjectURL(s)}},i.onerror=()=>{URL.revokeObjectURL(s),r(new Error("课表图片渲染失败"))},i.src=s})}a(Gs,"svgToPngBlob");async function Js(t){let e=await Gs(Sn(t));Ua(e,Ra(t.semester.label)+".png")}a(Js,"exportSchedulePng");function Wa(t,e){document.getElementById("urppp-feature-toast")?.remove();let r=document.createElement("div");r.id="urppp-feature-toast",r.textContent=String(t||""),r.className=e?"error":"",document.documentElement.appendChild(r),requestAnimationFrame(()=>r.classList.add("open")),setTimeout(()=>{r.classList.remove("open"),setTimeout(()=>r.remove(),220)},e?4200:2400)}a(Wa,"showFeatureToast");let Ga=yp({document,window,ensureStyles:As,loadData:vn,exportJson:Hs,exportIcs:Us,exportPng:Js,showToast:Wa,nativePageUrl:js,navigate:a(t=>{location.href=t},"navigate"),logger:console});function Vs(t,e,r,o){return Ga.run(t,e,r,o)}a(Vs,"runScheduleExport");function Ys(t){return Ga.createMenu(t)}a(Ys,"createScheduleExportMenu");function Qs(t){if(t){try{t.stage.remove()}catch{}try{document.getElementById("urppp-pdf-reset-style")?.remove()}catch{}}}a(Qs,"disposeNativePdfCapture");function Xs(){window.__urpppPdfDiagnose||(window.__urpppPdfDiagnose=async()=>{let t={time:new Date().toISOString()},e=document.getElementById("mycoursetable"),r=document.getElementById("page-content-template");t.host=!!e,t.pageSource=!!r,t.hostCards=e?e.querySelectorAll("div.class_div").length:-1,t.hostHasCourseTable=e?!!e.querySelector("#courseTable"):!1,t.hostHasCourseTableBody=e?!!e.querySelector("#courseTableBody"):!1,t.hostTableId=e&&e.querySelector("table")?e.querySelector("table").id:"none";try{let s=Dp(e);t.stage="ok",t.stageCards=s.target.querySelectorAll(".urppp-pdf-card").length,t.stageTableId=s.target.querySelector("table")?s.target.querySelector("table").id:"none",Qs(s)}catch(s){t.stage="failed",t.stageError=s&&s.message||String(s)}let o=typeof unsafeWindow<"u"?unsafeWindow:window;return t.deps={dollar:typeof o.$,loadFileList:typeof(o.Import&&o.Import.LoadFileList),back:typeof o.back,html2canvas:typeof o.html2canvas,originalDivBuild:typeof o.__urpppOriginalDivBuild},t})}a(Xs,"bindNativePdfDiagnose");function Ks(t){return t?(Xs(),async()=>{let e=document.getElementById("urppp-settings-panel"),r=document.getElementById("urppp-settings-mask");e&&e.classList.contains("open")&&e.classList.remove("open"),r&&r.classList.contains("open")&&r.classList.remove("open");try{await Hp(t,{document,page:typeof unsafeWindow<"u"?unsafeWindow:window,onAfterRestore:lr})}catch(o){console.warn("[URP++] isolated native PDF export failed",o),Wa("原生 PDF 隔离导出失败："+(o&&o.message||String(o))+"，请重试",!0)}}):null}a(Ks,"pagePdfExportHandler");function Ja(t=location){return/\/(?:student\/courseSelect\/(?:thisSemesterCurriculum|courseSelectResult|calendarSemesterCurriculum)|student\/personalSenate\/giveLessonInfo\/thisSemesterSchedule)\//.test(t.pathname)}a(Ja,"isPersonalSchedulePage");function Zs(t=location){return/\/student\/integratedQuery\/scoreQuery\/[^/]+\/index$/.test(t.pathname)}a(Zs,"isScoreQueryPage");function Va(){if(!Ja())return;let t=document.querySelector("#h4_id1")?.closest("h4")||document.querySelector("h4.header"),e=t?.querySelector(".right_top_oper")||document.querySelector("#mainDIV .right_top_oper, .page-content .right_top_oper"),r=Array.from((e||document).querySelectorAll("button, a")),o=a(l=>[l.textContent,l.getAttribute("title"),l.getAttribute("onclick")].filter(Boolean).join(" ").replace(/\s+/g," "),"signatureOf");if(r.forEach(l=>{/打印.*课表|\bdy\s*\(/i.test(o(l))&&l.setAttribute("data-urppp-native-print-source","1")}),document.getElementById("urppp-native-schedule-export"))return;let s=r.find(l=>/导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(o(l))),i=Ys({source:"native",pdfHandler:Ks(s)});if(i.id="urppp-native-schedule-export",s&&s.parentElement){s.__urpppNativeExportState||(s.__urpppNativeExportState={display:s.style.getPropertyValue("display"),displayPriority:s.style.getPropertyPriority("display"),ariaHidden:s.getAttribute("aria-hidden"),tabIndex:s.getAttribute("tabindex")}),s.setAttribute("data-urppp-native-export-source","1"),s.style.setProperty("display","none","important"),s.setAttribute("aria-hidden","true"),s.setAttribute("tabindex","-1"),s.parentElement.insertBefore(i,s.nextSibling);return}if(e)e.appendChild(i);else if(t)t.appendChild(i);else{let l=document.getElementById("page-content-template")||document.querySelector(".page-content");if(l){let g=document.createElement("div");g.className="urppp-export-fallback",g.appendChild(i),l.prepend(g)}}}a(Va,"patchNativeScheduleExport");let Ge=null,Ur=0;function Ya(){clearTimeout(Ur),Ur=0,Ge&&Ge.observer.disconnect(),Ge=null}a(Ya,"disconnectNativeScheduleExportObserver");function tl(){if(!Ja()){Ya();return}let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;if(!t||Ge&&Ge.root===t&&t.isConnected)return;Ya();let e=new MutationObserver(()=>{clearTimeout(Ur),Ur=setTimeout(()=>Va(),80)});e.observe(t,{childList:!0,subtree:!0}),Ge={root:t,observer:e}}a(tl,"bindNativeScheduleExportObserver");function _n(t,e,r){r===null?t.removeAttribute(e):t.setAttribute(e,r)}a(_n,"restoreOptionalAttribute");function el(t=document){let e=t&&t.querySelectorAll?t:document,r=e.matches?.("#urppp-native-schedule-export")?e:e.querySelector("#urppp-native-schedule-export");if(r){let o=r.closest(".urppp-export-fallback");r.remove(),o&&!o.children.length&&o.remove()}e.querySelectorAll("[data-urppp-native-export-source]").forEach(o=>{let s=o.__urpppNativeExportState;s&&(s.display?o.style.setProperty("display",s.display,s.displayPriority):o.style.removeProperty("display"),_n(o,"aria-hidden",s.ariaHidden),_n(o,"tabindex",s.tabIndex)),o.removeAttribute("data-urppp-native-export-source");try{delete o.__urpppNativeExportState}catch{}}),e.querySelectorAll("[data-urppp-native-print-source]").forEach(o=>{o.removeAttribute("data-urppp-native-print-source")})}a(el,"removeNativeScheduleExport");let En=Ai({deps:{styles:Kp,loadScores:jn,loadProfile:Cn,scoreToNumber:We,scoreToGpa:Ue,getInsertHost:a(()=>document.querySelector(".page-content")||document.getElementById("page-content-template")||null,"getInsertHost"),shouldAutoExpand:a(()=>{let t=/[?&]urppp=sa(?:&|$)/.test(window.location.search);if(t)try{history.replaceState(null,"",window.location.pathname+window.location.hash)}catch{}return t},"shouldAutoExpand")}}),rl=Xn([Vr({id:"schedule-export",matches:a(t=>Ja(t.location),"matches"),mount:a(()=>{Va(),tl()},"mount"),unmount:a(t=>{Ya(),el(t?.lifecycleKey)},"unmount")}),Vr({id:"score-analysis",matches:a(t=>Zs(t.location),"matches"),mount:a(()=>{try{En.mount()}catch(t){console.warn("[URP++] score analysis mount",t)}},"mount"),unmount:a(()=>{try{En.unmount()}catch{}},"unmount")})]);function Wr(){let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;return rl.refresh({document,location,window,lifecycleKey:t})}a(Wr,"refreshRouteFeatures");function al(t){Ga.bindHosts(t)}a(al,"bindScheduleExportHosts");function ur(t){return String(t||"").replace(/\u00a0/g," ").replace(/\s+/g," ").replace(/^[\s:：]+|[\s:：]+$/g,"").trim()}a(ur,"normalizeProfileValue");function Gr(t,e){if(!t||!t.querySelectorAll)return"";let r=(e||[]).map(s=>ur(s).replace(/[：:]/g,"")),o=t.querySelectorAll(".profile-info-row, tr");for(let s=0;s<o.length;s++){let i=o[s],l=i.querySelector(".profile-info-name, th, label"),g=i.querySelector(".profile-info-value, td:last-child");if(!l||!g||l===g)continue;let h=ur(l.textContent).replace(/[：:]/g,"");if(!r.some($=>h===$||h.endsWith($)))continue;let _=ur(g.textContent);if(_&&_!=="—"&&_!=="-")return _}return""}a(Gr,"readLabeledProfileValue");function Je(t){return ur(t).replace(/^主修为\s*/,"").replace(/培养方案概况.*$/,"").replace(/…+/g,"").split(/主修必修GPA|GPA算法|已修读|尚不及格|本学期/)[0].trim()}a(Je,"cleanMajorPlanName");function ol(t){let e={majorPlan:"",majorGpa:""};return!t||!t.querySelectorAll||t.querySelectorAll(".infobox, .widget-box, .urppp-stat-card").forEach(r=>{let o=(r.innerText||r.textContent||"").trim(),s=ur(o);if(/主修必修GPA/.test(s)){let i=s.match(/(-?\d+(?:\.\d+)?)\s*主修必修GPA/)||s.match(/主修必修GPA[^\d-]{0,20}(-?\d+(?:\.\d+)?)/);if(i){let l=Number(i[1]),g=Number(e.majorGpa);Number.isFinite(l)&&l>=0&&l<=5&&(!e.majorGpa||g===0||l>0)&&(e.majorGpa=i[1])}}if(/主修为|培养方案/.test(s)){let i=s.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·+\-]{2,60}(?:培养方案|教学计划))/)||s.match(/^(.{2,60}?)\s*主修为/)||s.match(/主修为\s*(.{2,60})$/),l=Je(i&&i[1]);if(l&&!/GPA|已修读|尚不及格|本学期/.test(l)){let g=/培养方案|教学计划/.test(l);(!e.majorPlan||g)&&(e.majorPlan=l)}}}),e}a(ol,"extractAcademicOverview");async function Cn(){let t={name:"",avatar:"",majorPlan:"",majorGpa:"",studentId:""};try{let r=document.querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(r){let i=r.querySelector(".urppp-user-name-value"),l=i&&i.__urpppOriginalText;l&&(t.name=String(l).trim());let g=(r.innerText||r.textContent||"").replace(/\s+/g," ").trim(),h=t.name?null:g.match(/欢迎您[，,]\s*([\u4e00-\u9fa5·]{2,12})/);if(!t.name&&!h){let _=r.cloneNode(!0);_.querySelectorAll("small, i, img, b, .badge").forEach(j=>j.remove());let $=(_.textContent||"").replace(/\s+/g," ").trim();$=$.replace(/^欢迎您[，,]\s*/g,"").replace(/\d{8,}/g,"").trim(),h=$.match(/([\u4e00-\u9fa5·]{2,12})/)}h&&h[1]&&!/欢迎|同学|首页|反馈|密码|注销/.test(h[1])&&(t.name=h[1])}let o=document.querySelector("#navbar img.nav-user-photo, .ace-nav img.nav-user-photo");o&&(t.avatar=o.__urpppOriginalSrc||o.src||o.getAttribute("src")||"");let s=ol(document);t.majorPlan=s.majorPlan,t.majorGpa=s.majorGpa}catch{}try{let r=await Jt("/student/rollManagement/rollInfo/index"),o=Or(r),s=o.body&&(o.body.innerText||o.body.textContent)||"";if(!t.name&&(t.name=Gr(o,["姓名"]),!t.name)){let h=s.match(/姓名\s*[：:]?\s*([\u4e00-\u9fa5·]{2,20})/);h&&(t.name=h[1].trim())}let i=Gr(o,["主修方案名称"]),l=Gr(o,["专业"]);t.studentId=Gr(o,["学号"]),i?t.majorPlan=Je(i):!t.majorPlan&&l&&(t.majorPlan=Je(l));let g=o.querySelector('.profile-picture img, img#avatar, img[src*="photo" i], img[src*="Photo"]');if(g&&g.getAttribute("src")&&!t.avatar){let h=g.getAttribute("src");t.avatar=/^https?:/i.test(h)?h:ja(h)}}catch{}let e=Number(t.majorGpa);return t.name||(t.name="同学"),t.majorPlan||(t.majorPlan="主修方案"),(!Number.isFinite(e)||e<=0||e>5)&&(t.majorGpa="—"),t}a(Cn,"loadProfile");let Pn=["周日","周一","周二","周三","周四","周五","周六"];function Qa(t){let e=[],r=t.querySelector("#courseTableBody")||t.querySelector("#courseTable tbody");if(!r)return e;r.querySelectorAll("td[id]").forEach(s=>{let i=String(s.id||"").match(/^(\d+)_(\d+)$/);if(!i)return;let l=parseInt(i[1],10),g=parseInt(i[2],10),h=l===7?0:l,_=s.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"]'),$=_.length?_:[];if(!$.length&&(s.textContent||"").trim()){let j=(s.textContent||"").replace(/\s+/g," ").trim();j&&e.push({name:j.slice(0,40),teacher:"",place:"",week:"",day:h,section:g});return}$.forEach(j=>{let z=Array.from(j.querySelectorAll("p")).map(K=>(K.textContent||"").trim()).filter(Boolean),F=(j.querySelector(".p-kcm-1, .p-kcm")||{}).textContent||z[0]||"",J=(j.querySelector('.p-jxl-1, [class*="jxl"]')||{}).textContent||"",D=z.find((K,ut)=>ut>0&&!/周|节/.test(K)&&K!==J)||"",R=z.find(K=>/周/.test(K))||"",B=String(F).replace(/_\d+\s*$/,"").trim();!B||B.length<2||e.push({name:B,teacher:String(D).trim(),place:String(J||"").trim(),week:String(R).trim(),day:h,section:g})})});let o=new Set;return e.filter(s=>{let i=[s.day,s.section,s.name,s.place].join("|");return o.has(i)?!1:(o.add(i),!0)})}a(Qa,"parseScheduleFromDoc");let zn="urppp_term_week_v1";function Ve(t){let e=Number(t)||0;if(e<1||e>30)return 0;nt._termWeek=e,nt._termWeekResolved=!0;try{GM_setValue(zn,e)}catch{}return e}a(Ve,"rememberTermWeek");function mr(){if(nt&&nt._termWeek>=1)return nt._termWeekResolved=!0,nt._termWeek;try{let t=Number(GM_getValue(zn,0))||0;if(t>=1&&t<=30)return Ve(t)}catch{}return 0}a(mr,"readRememberedTermWeek");function hr(t){let e=String(t||"").replace(/\s+/g," ");if(!e)return 0;let r=[/(?:\d{4}\s*[-–]\s*\d{4}).{0,40}?第\s*(\d{1,2})\s*周/,/20\d{2}.{0,40}?第\s*(\d{1,2})\s*周/,/(?:春|秋|夏|冬)\s*第\s*(\d{1,2})\s*周/,/第\s*(\d{1,2})\s*周\s*(?:星期|周[一二三四五六日天])/];for(let o=0;o<r.length;o++){let s=e.match(r[o]);if(s){let i=parseInt(s[1],10);if(i>=1&&i<=30)return i}}return 0}a(hr,"extractTermWeekFromText");function Pe(){if(nt._termWeekResolved&&nt._termWeek>=1&&nt._termWeek<=30)return nt._termWeek;try{let t=[document.querySelector("#navbar"),document.querySelector(".navbar-fixed-top"),document.querySelector(".navbar"),document.querySelector("#navbar .navbar-header"),document.querySelector("#navbar .navbar-buttons"),document.querySelector(".ace-nav"),document.querySelector("#breadcrumbs"),document.querySelector("#page-content-header"),document.querySelector(".page-header"),document.querySelector("header")].filter(Boolean);for(let l=0;l<t.length;l++){let g=t[l],h=hr(g.innerText||g.textContent||"")||hr(g.innerHTML||"");if(h)return Ve(h)}let e=document.documentElement&&document.documentElement.innerHTML||"",r=hr(e);if(r)return Ve(r);let o=document.body&&document.body.innerText||"",s=hr(o);if(s)return Ve(s);let i=mr();if(i)return i}catch{}return 0}a(Pe,"getCurrentWeekNumber");let Ye=null;function nl(){let t=new Date,e=a(r=>String(r).padStart(2,"0"),"p");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}a(nl,"calTodayStr");function pl(t,e){let r=new Date(`${t}T00:00:00`);r.setDate(r.getDate()+e);let o=a(s=>String(s).padStart(2,"0"),"p");return`${r.getFullYear()}-${o(r.getMonth()+1)}-${o(r.getDate())}`}a(pl,"calAddDays");function br(t){if(Ye)return Ye;let e=t||nl();return e>="2027-02-06"&&e<=pl("2027-02-06",6)?"springfestival":e>="2027-01-18"&&e<"2027-03-01"?"winter":e>="2027-07-04"&&e<"2027-08-31"||e>="2026-07-04"&&e<"2026-08-31"?"summer":"term"}a(br,"calVacation");function il(){let t='<svg viewBox="0 0 52 190"><path d="M26 0v16" stroke="#c8102e" stroke-width="3"/><rect x="16" y="16" width="20" height="8" rx="4" fill="#c8102e"/><ellipse cx="26" cy="62" rx="22" ry="30" fill="#e63946"/><path d="M26 26v72M14 34q12 12 0 24M38 34q-12 12 0 24" stroke="#ffd75e" stroke-width="1.4" fill="none"/><path d="M14 92h24M17 98h18M20 104h12" stroke="#ffd75e" stroke-width="2.4" stroke-linecap="round"/></svg>';return`<div id="urppp-festive-decor" aria-hidden="true"><div class="ufd ufd-left">${t}</div><div class="ufd ufd-right">${t}</div></div>`}a(il,"festiveDecorHtml");function Ln(){let t=typeof document<"u"?document:null;if(!t)return;let e=br()==="springfestival",r=t.getElementById("urppp-festive-decor");e&&!r?t.documentElement.insertAdjacentHTML("beforeend",il()):!e&&r&&r.remove()}a(Ln,"syncFestiveDecor");function qn(t){Ye=t==="summer"||t==="winter"||t==="springfestival"||t==="term"?t:null,Ye&&Ye!=="term"&&(nt.weekLocked=!1,nt.viewWeek=0);try{Ln()}catch{}try{typeof Xe=="function"&&Xe()}catch{}return Ye}a(qn,"setCalendarPhase");function sl(){return br()}a(sl,"getCalendarPhase");function Tn(){if(br()!=="term")return nt.weekLocked?(!nt.viewWeek||nt.viewWeek<0)&&(nt.viewWeek=0):nt.viewWeek=0,nt.viewWeek;let t=Pe()||mr()||0;return nt.weekLocked?(!nt.viewWeek||nt.viewWeek<1)&&(nt.viewWeek=t>=1?t:1):t>=1?nt.viewWeek=t:(!nt.viewWeek||nt.viewWeek<1)&&(nt.viewWeek=1),!nt.weekLocked&&t>1&&nt.viewWeek===1&&(nt.viewWeek=t),nt.viewWeek}a(Tn,"getViewWeekNumber");async function ll(){let t=Pe();if(t>=1)return t;try{let e=await Jt("/index");if(t=hr(e),t)return Ve(t)}catch{}try{let e=new Date,r=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0"),o="xqh=03&jxlh=302&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(r),s=await Jt("/student/teachingResources/classroomUseStatus/jasInfo",{method:"POST",data:o,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),i=JSON.parse(s),l=Number(i&&i.jxzc);if(l>=1&&l<=30)return Ve(l)}catch{}return mr()||0}a(ll,"ensureTermWeekResolved");function cl(t){let e=Pe()||20;return(t||[]).forEach(r=>{let o=String(r.classWeek||"");o.length>e&&(e=o.length);let s=String(r.week||"").match(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/);s&&(e=Math.max(e,parseInt(s[2],10)||0));let i=String(r.week||"").match(/\d{1,2}/g);i&&i.forEach(l=>{e=Math.max(e,parseInt(l,10)||0)})}),Math.min(Math.max(e,1),30)}a(cl,"inferMaxWeek");function Mn(t,e){if(!e||!t)return!1;let r=String(t);return r.length>=e?r.charAt(e-1)==="1":!1}a(Mn,"weekBitActive");let $n=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#EC4899","#84CC16","#F97316","#6366F1"];function In(t){let e=0,r=String(t||"");for(let o=0;o<r.length;o++)e=e*31+r.charCodeAt(o)>>>0;return $n[e%$n.length]}a(In,"courseColor");function dl(t){let e=[],r=Pe();(t&&t.xkxx||[]).forEach(i=>{Object.keys(i||{}).forEach(l=>{let g=i[l];if(!g)return;let h=g.courseName||g.englishCourseName||l,_=g.attendClassTeacher||"";(g.timeAndPlaceList||[]).forEach(j=>{let z=Number(j.classDay)||0,F=z===7?0:z,J=Number(j.classSessions)||1,D=Math.max(1,Number(j.continuingSession)||1),R=[j.campusName,j.teachingBuildingName,j.classroomName].filter(Boolean).join(""),B=j.weekDescription||g.skzcs||"",K=Mn(j.classWeek,r)||r&&B.indexOf(String(r))>=0;e.push({name:String(h).trim(),teacher:String(_).trim(),place:String(R).trim(),week:String(B).trim(),classWeek:String(j.classWeek||""),day:F,section:J,span:D,thisWeek:!!K,color:In(h)})})})});let s=new Set;return e.filter(i=>{let l=[i.day,i.section,i.span,i.name,i.place,i.week].join("|");return s.has(l)?!1:(s.add(l),!0)})}a(dl,"parseScheduleFromJson");async function ul(){try{let t=await Jt("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),e=[],r=null;try{r=JSON.parse(t);let s=Number(r&&(r.jxzc||r.zc||r.currentWeek));s>=1&&s<=30&&(nt._termWeek=Math.max(nt._termWeek||0,s),nt.weekLocked||(nt.viewWeek=nt._termWeek)),e=dl(r)}catch{e=Qa(Or(t))}e.length||(e=Qa(document));let o=r?kn(r,er(r),"clean"):null;return{courses:e,exportData:o,rawOk:e.length>0,error:e.length?"":"课表 JSON 无 timeAndPlaceList"}}catch(t){try{let e=Qa(document);if(e.length)return{courses:e,rawOk:!0,error:""}}catch{}return{courses:[],rawOk:!1,error:String(t&&t.message||t)}}}a(ul,"loadSchedule");function ml(t,e){let r=String(t||""),o=new RegExp(`url\\s*=\\s*["']([^"']*`+e+`[^"']*)["']`,"i"),s=r.match(o);if(s&&s[1])return s[1];let i=new RegExp(`(\\/student\\/integratedQuery\\/scoreQuery\\/[^"'\\s]+`+e+")","i"),l=r.match(i);return l?l[1]:""}a(ml,"extractScoreCallback");function hl(t){let e=[];return(t&&t.lnList||[]).forEach(o=>{let s=o.cjlx||o.cjbh||o.famc||o.zxjxjhh||"成绩",i=[];(o.cjList||[]).forEach(l=>{let g=l.courseName||l.englishCourseName||"";if(!g)return;let h=l.cj!=null&&l.cj!==""?String(l.cj):"";!h&&l.courseScore!=null&&(h=String(l.courseScore)),!h&&l.gradeName&&(h=String(l.gradeName)),!h&&l.zscj!=null&&(h=String(l.zscj));let _=l.courseAttributeName||l.xkcsxmc||"",$=parseFloat(l.credit)||0,j=l.id&&(l.id.courseNumber||l.id.kch_zj)||"",z=l.id&&(l.id.coureSequenceNumber||l.id.courseSequenceNumber||l.id.kxh)||l.classNo||"",F=l.gradePointScore!=null?Number(l.gradePointScore):null,J=ie(h)||ie(l.gradeName)||F!=null&&F<0,D=J?"未评估":h;i.push({code:j,seq:String(z||""),name:g,attr:_,credit:$,score:D,unevaluated:J,required:un(_),officialGpa:Dr(F)?F:null,evalUrl:""})}),i.length&&e.push({title:String(s).slice(0,100),courses:i,summary:re(i),meta:{zxf:o.zxf,tgms:o.tgms,zms:o.zms,famc:o.famc}})}),e}a(hl,"parseScoreJson");async function Nn(t,e){let r=await Jt(t),o=Bn(Or(r));if(o.length)return o;let s=ml(r,e);if(!s)return[];let i=await Jt(s);try{let l=JSON.parse(i);o=hl(l).map(g=>(g.summary=re(g.courses),g))}catch{o=Bn(Or(i))}return o}a(Nn,"loadScoreByIndex");function Bn(t){let e=[];return t.querySelectorAll("table").forEach(r=>{let o=Array.from(r.tHead&&r.tHead.rows[0]?r.tHead.rows[0].cells:r.rows[0]&&r.rows[0].cells||[]).map($=>($.textContent||"").replace(/\s+/g,""));if(!o.length)return;let s=o.join("|");if(!/课程名/.test(s)||!/成绩/.test(s))return;let i={code:o.findIndex($=>$==="课程号"),name:o.findIndex($=>$==="课程名"),attr:o.findIndex($=>/课程属性|属性/.test($)),credit:o.findIndex($=>$==="学分"),score:o.findIndex($=>$==="成绩")};if(i.name<0||i.score<0)return;let l="成绩",g=r.previousElementSibling;for(let $=0;$<8&&g;$++,g=g.previousElementSibling)if(/^H[1-4]$/.test(g.tagName)||g.classList&&g.classList.contains("header")){l=(g.textContent||"").replace(/\s+/g," ").trim();break}let h=[],_=r.tBodies.length?r.tBodies[0].rows:Array.from(r.rows).slice(1);Array.from(_).forEach($=>{let j=Array.from($.cells||$.querySelectorAll("td"));if(j.length<4)return;let z=a(B=>B>=0&&j[B]?(j[B].textContent||"").replace(/\s+/g," ").trim():"","get"),F=z(i.name),J=z(i.score);if(!F||!J||/课程名|序号/.test(F))return;let D=z(i.attr),R=ie(J);h.push({code:z(i.code),name:F,attr:D,credit:parseFloat(z(i.credit))||0,score:R?"未评估":J,unevaluated:R,required:un(D),officialGpa:null,evalUrl:""})}),h.length&&e.push({title:l.slice(0,100),courses:h,summary:re(h)})}),e}a(Bn,"parseScoreTables");function gr(t){return Je(t&&t.meta&&t.meta.famc||t&&t.title||"")}a(gr,"schemePlanName");function Fn(t,e){if(!t||!t.length)return 0;let r=Je(e),o=t.findIndex(l=>{let g=gr(l);return/培养方案/.test(g)&&!/微专业|辅修|双学位/.test(g)});if(o>=0&&(!r||gr(t[o]).includes(r.slice(0,4)))||r&&(o=t.findIndex(l=>{let g=gr(l);return g.includes(r.replace(/培养方案.*/,"培养方案"))||r.includes(g.slice(0,4))||g.includes(r.slice(0,4))}),o>=0))return o;let s=0,i=-1;return t.forEach((l,g)=>{if(/微专业|辅修/.test(gr(l)))return;let h=(l.courses||[]).length;h>i&&(i=h,s=g)}),s}a(Fn,"pickMajorSchemeIndex");async function bl(){let t={};try{let e=await Jt("/student/teachingAssessment/evaluation/queryAll",{method:"POST",data:"pageNum=1&pageSize=200&flag=kt",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),r;try{r=JSON.parse(e)}catch{r=null}(r&&r.data&&r.data.records||[]).forEach(s=>{let i=String(s.KCH||"").trim();if(!i)return;let l=String(s.SFPG)==="1",g=String(s.KTID||"").trim();if(!t[i]){t[i]={ktid:g,kxh:String(s.KXH||""),kcm:s.KCM||"",done:l,pending:l?0:1,total:1,url:!l&&g?"/student/teachingEvaluation/newEvaluation/evaluation/"+g:"/student/teachingEvaluation/newEvaluation/index"};return}t[i].total+=1,l||(t[i].pending+=1,t[i].done=!1,g&&(t[i].ktid=g,t[i].url="/student/teachingEvaluation/newEvaluation/evaluation/"+g))}),Object.keys(t).forEach(s=>{let i=t[s];i.done=!(i.pending>0)})}catch(e){console.warn("[URP++] evaluation map",e)}return t}a(bl,"loadEvaluationMap");function gl(t){if(!t)return!1;if(t.officialGpa!=null&&Dr(t.officialGpa))return!0;let e=t.score;return e==null||e===""||ie(e)?!1:We(e)!=null||Ue(e)!=null?!0:!/未评估|未评教|待评估|待评教/.test(String(e))}a(gl,"hasDisplayableScore");function fl(t,e){if(!t||!e)return t;let r=a(o=>(o||[]).forEach(s=>{if(!s||!s.code)return;let i=e[s.code];if(i){if(gl(s)){s.unevaluated=!1,i.done?s.evalUrl=s.evalUrl||"":s.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index";return}i.done||(s.unevaluated=!0,s.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index",(!s.score||s.score===""||ie(s.score))&&(s.score="未评估"))}}),"apply");return(t.passing||[]).forEach(o=>r(o.courses)),(t.schemes||[]).forEach(o=>r(o.courses)),t}a(fl,"attachEvaluationLinks");function Dn(t){return t&&(t.passing&&t.passing[0]&&(t.passing[0].summary=re(t.passing[0].courses)),t.schemes=(t.schemes||[]).map(e=>(e.summary=re(e.courses),e)),t)}a(Dn,"refreshScoreSummaries");async function xl(t){if(!t||t.evaluationLoading)return t;t.evaluationLoading=!0;try{let e=await bl();return fl(t,e),t.evalMap=e,t.evaluationReady=!0,Dn(t)}finally{t.evaluationLoading=!1}}a(xl,"enrichScoresWithEvaluation");function yl(){if(!nt.scores||!nt.scores.schemes)return;let t=nt.scores.schemes,e=nt.profile&&nt.profile.majorPlan,r=Fn(t,e);nt.scores.majorIdx=r,nt._schemeUserSelected||(nt.activeSchemeIdx=r,nt._schemeInited=!0);let o=t[r];if(!o||!nt.profile)return;let s=gr(o),i=Je(nt.profile.majorPlan);/培养方案|教学计划/.test(s)&&(!/培养方案|教学计划/.test(i)||i==="主修方案")&&(nt.profile.majorPlan=s);let l=o.summary||{},g=Number(l.requiredCredit),h=Number(l.requiredGpa),_=Number(nt.profile.majorGpa);g>0&&Number.isFinite(h)&&h>=0&&h<=5&&(!Number.isFinite(_)||_<=0)&&(nt.profile.majorGpa=String(Ee(h)))}a(yl,"reconcileProfileAndScores");let Qe=null;async function jn(t){return t&&(Qe=null),Qe&&!Qe.error||(Qe=await vl()),Qe}a(jn,"loadScores");async function vl(){let t={passing:[],schemes:[],error:"",majorIdx:0,evaluationReady:!1,evaluationLoading:!1};try{let[e,r]=await Promise.all([Nn("/student/integratedQuery/scoreQuery/allPassingScores/index","allPassingScores/callback"),Nn("/student/integratedQuery/scoreQuery/schemeScores/index","schemeScores/callback")]),o=[];e.forEach(s=>s.courses.forEach(i=>{o.push(Object.assign({term:s.title},i))})),t.passing=[{title:"全部及格成绩",courses:o,summary:re(o),groups:e}],t.schemes=r,!t.schemes.length&&o.length&&(t.schemes=[{title:"方案成绩",courses:o,summary:re(o)}]),Dn(t),t.majorIdx=Fn(t.schemes,nt.profile&&nt.profile.majorPlan),!o.length&&!t.schemes.length&&(t.error="成绩 callback 无数据")}catch(e){t.error=String(e&&e.message||e)}return t}a(vl,"loadScoresImpl");function ze(t){if(!t)return[];let e=String(t).trim();if(!e)return[];e=e.replace(/^['"]|['"]$/g,"");try{return JSON.parse(e)}catch{}try{return JSON.parse(e.replace(/&quot;/g,'"').replace(/&#34;/g,'"'))}catch{}return[]}a(ze,"parseJsonArrayLoose");function On(t,e){let r=t.indexOf(e);if(r<0)return"";let o=t.indexOf("[",r);if(o<0)return"";let s=0;for(let i=o;i<t.length&&i<o+3e5;i++){let l=t[i];if(l==="[")s++;else if(l==="]"&&(s--,s===0))return t.slice(o,i+1)}return""}a(On,"extractBalancedArray");async function wl(){let t=await Jt("/student/teachingResources/classroomUseStatus/index");if(/欢迎登录|name=["']j_username["']|loginEn/i.test(t)&&!/jxlList|teachingBuildingName|classroomUseStatus/i.test(t))throw new Error("登录已失效，请刷新页面后重试");let e=[],r=[];try{let i=(t.match(/id=["']xqList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']xqList["'][^>]*value=["']([^"']*)["']/i)||[])[1],l=(t.match(/id=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||[])[1];if(i&&(e=ze(i)),l&&(r=ze(l)),!e.length){let g=t.match(/(?:var\s+)?xqList\s*=\s*(\[[\s\S]*?\])\s*;/);g&&(e=ze(g[1]))}if(!r.length){let g=t.match(/(?:var\s+)?jxlList\s*=\s*(\[[\s\S]*?\])\s*;/);g&&(r=ze(g[1]))}if(!r.length){let g=On(t,"teachingBuildingName");g&&(r=ze(g))}if(!e.length){let g=On(t,"campusName");g&&(e=ze(g))}}catch(i){console.warn("[URP++] classroom json parse",i)}if(!r.length){let i=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}];e=i;let l=[];for(let g of i)try{let h=await Jt("/student/teachingResources/classroomCurriculum/"+g.campusNumber+"/teachingBuildingJson");ze(h).forEach($=>{l.push({id:{campusNumber:g.campusNumber,teachingBuildingNumber:String($.id&&$.id.teachingBuildingNumber||$.teachingBuildingNumber||"")},teachingBuildingName:$.teachingBuildingName||$.name||""})})}catch(h){console.warn("[URP++] building json",g.campusNumber,h)}r=l}e.length||(e=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}]);let o=e.map(i=>({campus:i.campusName||i.campusNumber,campusNumber:String(i.campusNumber||i.id&&i.id.campusNumber||""),buildings:[]}));r.forEach(i=>{let l=String(i.id&&i.id.campusNumber||i.campusNumber||""),g=String(i.id&&i.id.teachingBuildingNumber||i.teachingBuildingNumber||""),h=i.teachingBuildingName||i.name||g;if(!l||!g||!h)return;let _=o.find(j=>j.campusNumber===l);_||(_={campus:l,campusNumber:l,buildings:[]},o.push(_));let $="/student/teachingResources/classroomUseStatus/"+l+"/"+g+"/"+encodeURI(encodeURI(_.campus||l))+"/"+encodeURI(encodeURI(h));_.buildings.push({name:h,path:$,campusNumber:l,buildingNumber:g})});let s=o.filter(i=>i.buildings.length);if(!s.length)throw new Error("未解析到教学楼，请刷新后重试");return s}a(wl,"loadClassroomCatalog");function fr(t){let e=String(t&&t.occupancymoduleId||""),r={"06":"有课","07":"考试",14:"实验",room:"借用"};if(r[e])return r[e];if(t&&t.remark){let o=String(t.remark).trim();if(o)return o}return"占用"}a(fr,"occupancyTypeLabel");function kl(t){if(t&&t.contentName)return String(t.contentName).trim();if(t&&t.remark){let e=String(t.remark).trim();if(e)return e}return fr(t)}a(kl,"occupancyReason");async function Al(t,e,r,o){let s=new URLSearchParams({planNumber:String(t||""),campusNumber:String(e||""),teachingBuildingNumber:String(r||""),classroomNumber:String(o||"")}),i=await Jt("/student/teachingResources/classroomCurriculum/searchCurriculum/callback?"+s.toString());try{let l=JSON.parse(i);return Array.isArray(l)?l.length&&Array.isArray(l[0])?l[0]:l.filter(g=>g&&typeof g=="object"&&(g.kcm||g.id&&g.id.kch)):l&&Array.isArray(l.list)?l.list:[]}catch{return[]}}a(Al,"fetchClassroomCurriculum");function Sl(t,e,r){let o=t||[],s=Number(e.xq)||0,i=Number(e.start)||0,l=Number(r)||0,g=[];return o.forEach(h=>{let _=h.id||{},$=Number(_.skxq!=null?_.skxq:h.skxq)||0,j=Number(_.skjc!=null?_.skjc:h.skjc)||0,z=Math.max(1,Number(h.cxjc)||1),F=_.skzc||h.skzc||"";s&&$&&s!==$||i&&(i<j||i>=j+z)||l&&F&&!Da(F,l)||g.push(h)}),g.length?(g.sort((h,_)=>{let $=Da(h.id&&h.id.skzc||h.skzc,l)?0:1,j=Da(_.id&&_.id.skzc||_.skzc,l)?0:1;return $-j}),g[0]):null}a(Sl,"matchCurriculumCourse");async function _l(t,e,r){if(!t||!t.rooms||!t.rooms.length)return t;let o=String(e.campusNumber||""),s=String(e.buildingNumber||""),i=r||t.planNumber||"";if(!o||!s||!i)return t;let l=t.rooms.filter(z=>(z.slots||[]).some(F=>F.busy)),g={},h=a(async z=>{if(g[z])return g[z];try{g[z]=await Al(i,o,s,z)}catch{g[z]=[]}return g[z]},"queue"),_=4,$=0,j=new Array(Math.min(_,Math.max(l.length,1))).fill(0).map(async()=>{for(;$<l.length;){let z=$++,F=l[z],J=await h(F.name);(F.slots||[]).forEach(D=>{if(!D.busy)return;let R={xq:D.detail&&D.detail.xq||D.xq||0,start:D.section,week:t.jxzc};D.detail&&D.detail.xq!=null&&(R.xq=D.detail.xq);let B=Sl(J,R,t.jxzc);if(B&&B.kcm){let K=String(B.kcm).trim();D.contentName=K,D.reason=K,D.displayChar=jr(K),D.detail&&(D.detail.contentName=K,D.detail.reason=K,D.detail.teacher=B.jsm||"",D.detail.weeks=B.zcsm||"",D.detail.courseNo=B.id&&B.id.kch||"",D.detail.typeLabel=fr({occupancymoduleId:D.module}))}else D.displayChar=jr(D.reason||"占用"),D.detail&&(D.detail.typeLabel=fr({occupancymoduleId:D.module}))})}});return await Promise.all(j),t}a(_l,"enrichOccupancyWithCurriculum");function El(t){return t==="有课"?"kind-course":t==="考试"?"kind-exam":t==="实验"?"kind-lab":t==="借用"?"kind-borrow":"kind-busy"}a(El,"occupancyKindClass");async function Cl(t){let e="",r="",o="",s="";if(t&&typeof t=="object")e=String(t.campusNumber||""),r=String(t.buildingNumber||""),o=t.name||"",s=t.path||"";else{s=String(t||"");let B=s.match(/classroomUseStatus\/(\d+)\/(\d+)\//);B&&(e=B[1],r=B[2])}if(!e||!r)throw new Error("缺少校区/楼栋编号");let i=Number(t&&t.dateOffset!=null?t.dateOffset:nt.roomDateOffset)||0,l=Pl(Hn(new Date,i)),g="xqh="+encodeURIComponent(e)+"&jxlh="+encodeURIComponent(r)+"&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(l),h=await new Promise((B,K)=>{let ut=ja("/student/teachingResources/classroomUseStatus/jasInfo");typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest({method:"POST",url:ut,data:g,withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},onload:a(vt=>vt.status>=200&&vt.status<400?B(vt.responseText||""):K(new Error("HTTP "+vt.status)),"onload"),onerror:a(()=>K(new Error("network")),"onerror")}):fetch(ut,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:g}).then(vt=>vt.text()).then(B).catch(K)}),_;try{_=JSON.parse(h)}catch{throw new Error("jasInfo 非 JSON")}let $=(_.classrooms||[]).map(B=>{let K=B.classroomName||B.id&&B.id.classroomNumber||"",ut=B.placeNum||"",vt=B.remark||"",Et=[];for(let Lt=1;Lt<=12;Lt++)Et.push({section:Lt,busy:!1});return{name:K,seats:ut,type:vt,slots:Et,map:{}}}),j={};$.forEach(B=>{j[B.name]=B}),(_.classroomTime||[]).forEach(B=>{let K=B.id||{},ut=K.classroomNumber||"",vt=Number(K.sessionstart)||1,Et=Math.max(1,Number(B.continuingsession)||1),Lt=j[ut];if(!Lt)return;let qt=fr(B),Ot=kl(B);for(let Ht=vt;Ht<vt+Et&&Ht<=12;Ht++){let Mt=Lt.slots.find(ae=>ae.section===Ht);Mt&&(Mt.busy=!0,Mt.kind=B.timestatenumber||B.occupancymoduleId||"",Mt.module=B.occupancymoduleId||"",Mt.reason=Ot,Mt.typeLabel=qt,Mt.displayChar=jr(Ot),Mt.xq=K.xq,Mt.weekBitmap=K.week||"",Mt.detail={room:ut,section:Ht,start:vt,span:Et,reason:Ot,typeLabel:qt,week:K.week||"",xq:K.xq||"",state:B.timestatenumber||"",module:B.occupancymoduleId||""})}});let z="";try{let B=_.jhZxjxjhb;typeof B=="string"&&/\d{4}-\d{4}-\d-\d/.test(B)?z=B:B&&typeof B=="object"&&(z=String(B.zxjxjhh||B.jhxnxq||B.executiveEducationPlanNumber||B.planNumber||""))}catch{}if(!z&&_.classrooms&&_.classrooms[0]&&_.classrooms[0].id&&(z=_.classrooms[0].id.executiveEducationPlanNumber||""),_.jxzc!=null&&Number(_.jxzc)>=1){let B=Number(_.jxzc);nt._termWeek=Math.max(nt._termWeek||0,B),nt.weekLocked||(nt.viewWeek=nt._termWeek)}let F=["日","一","二","三","四","五","六"],J=zl(_.date||l)||Hn(new Date,i),D=_.week!=null?Number(_.week):J.getDay(),R=i===1?"明天":i===2?"后天":"今天";return{rooms:$,dateLabel:(_.date||l)+"（周"+(F[D]||D)+" · "+R+"）",jxzc:_.jxzc,planNumber:z,week:_.week!=null?_.week:D,searchDate:_.date||l,dateOffset:i}}a(Cl,"loadBuildingOccupancy");function Hn(t,e){let r=new Date(t.getFullYear(),t.getMonth(),t.getDate());return r.setDate(r.getDate()+(Number(e)||0)),r}a(Hn,"addDays");function Pl(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}a(Pl,"formatLocalDate");function zl(t){let e=String(t||"").match(/(\d{4})-(\d{1,2})-(\d{1,2})/);return e?new Date(Number(e[1]),Number(e[2])-1,Number(e[3])):null}a(zl,"parseLocalDate");let Rn={clean:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h11M4 17h14"/></svg>',exit:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M14 12H8"/><path d="m14 8 4 4-4 4"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',schedule:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/></svg>',score:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h10v17H7z"/><path d="M10 8h4M10 12h4M10 16h3"/></svg>',room:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-7h6v7"/><path d="M9 10h.01M15 10h.01"/></svg>',eval:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 7h11M8 12h11M8 17h8"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg>',plan:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h8l3 3V20.5H7z"/><path d="M15 3.5V7h3M10 12h5M10 16h5"/></svg>',apply:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',home:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 11 8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/></svg>',more:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',close:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'};function Un(t){return Rn[t]||Rn.more}a(Un,"ico");let nt=ti();function Ll(){if(document.getElementById("urppp-clean-style"))return;let t=document.createElement("style");t.id="urppp-clean-style",t.textContent=Qp,(document.head||document.documentElement).appendChild(t)}a(Ll,"ensureStyle");let ql=na({deps:{scoreToNumber:We,scoreToGpa:Ue}}),{metricHtml:Tl,occupancyHtml:Ml,render:Xe,renderScheduleBoard:Pc,roomPickerHtml:$l,scheduleRender:Il}=ui({state:nt,deps:{DIRECT_EDIT_LABELS:U,DAY_NAMES:Pn,analyzeScores:a(t=>ql.analyzeScores(t),"analyzeScores"),applyPersonalDisplay:Vt,bandsChartSvg:ia,bindUI:a(t=>Bl(t),"bindUI"),classifyPrivacyLabel:Hr,courseColor:In,ensureRoot:a(()=>Gn(),"ensureRoot"),escapeHtml:at,firstContentChar:jr,getViewWeekNumber:Tn,ico:Un,isCleanAnalysisDirect:da,occupancyKindClass:El,occupancyTypeLabel:fr,personalizedProfile:Fs,scoreChartLayout:a(()=>{try{return window.matchMedia&&window.matchMedia("(max-width: 900px)").matches?{variant:"mobile"}:null}catch{return null}},"scoreChartLayout"),scoreToNumber:We,summarizeCourses:re,trendChartSvg:pa,weekBitActive:Mn,calVacation:br,setCalendarPhase:qn}}),{ensureRoomCatalogLoaded:Wn,loadAll:Nl}=ri({state:nt,deps:{ensureTermWeekResolved:ll,enrichScoresWithEvaluation:xl,getCurrentWeekNumber:Pe,loadClassroomCatalog:wl,loadProfile:Cn,loadSchedule:ul,loadScores:jn,readRememberedTermWeek:mr,reconcileProfileAndScores:yl,render:Xe,scheduleRender:Il}}),{bindUI:Bl,closeModal:Fl,getRoomHost:zc,openModal:Lc,openRoomModal:qc,openScoreModal:Tc,showBuilding:Mc}=mi({state:nt,deps:{DAY_NAMES:Pn,applyPersonalDisplay:Vt,bindScheduleExportHosts:al,closeCleanMode:a(()=>jl(),"closeCleanMode"),ensureRoomCatalogLoaded:Wn,enrichOccupancyWithCurriculum:_l,ensureRoot:a(()=>Gn(),"ensureRoot"),escapeHtml:at,fetchText:Jt,getCurrentWeekNumber:Pe,getViewWeekNumber:Tn,inferMaxWeek:cl,isUnevaluatedScore:ie,isValidOfficialGpa:Dr,loadBuildingOccupancy:Cl,metricHtml:Tl,occupancyHtml:Ml,render:Xe,rootEl:a(()=>Ol(),"rootEl"),roomPickerHtml:$l,scoreToGpa:Ue,scoreToNumber:We,summarizeCourses:re,summarizeCoursesPreferOfficial:re}}),{cleanModeApi:Dl,closeCleanMode:jl,ensureRoot:Gn,injectCleanEntry:$c,openCleanMode:Ic,rootEl:Ol}=hi({state:nt,deps:{CLEAN_FLAG:ks,applySkinAttr:ee,closeModal:Fl,ensureRoomCatalogLoaded:Wn,ensureStyle:Ll,getCurrentWeekNumber:Pe,getSkin:Zt,handleThemeDotClick:ct,ico:Un,injectCleanSidebarSections:a(t=>{try{window.__urpppInjectCleanSidebarSections?.(t)}catch{}},"injectCleanSidebarSections"),refreshMobileNavbar:a(()=>{try{window.__urpppRefreshMobileNavbar?.()}catch{}},"refreshMobileNavbar"),setDrawerOpen:a((t,e,r)=>{try{window.__urpppSetDrawerOpen?.(t,e,r)}catch{}},"setDrawerOpen"),stopDrawerAnimation:a(t=>{try{window.__urpppStopDrawerAnimation?.(t)}catch{}},"stopDrawerAnimation"),isHomePage:vo,loadAll:Nl,openSettingsPanel:Yo,readRememberedTermWeek:mr,refreshCleanPersonalDisplay:Ha,render:Xe,scoreToGpa:Ue,summarizeCourses:re,syncNavbarThemeUI:ft,syncSettingsPanelUI:Dt,syncThemeDotGroup:Z}});window.__urpppCleanMode=Dl;function Xa(){if(!document.body){setTimeout(Xa,10);return}if(wo(),Wt(Qt()),setTimeout(()=>{try{Ae().then(e=>Oe(e))}catch{}},0),document.addEventListener("focusin",e=>{let r=e.target;if(!r||!r.matches||!r.matches(".chosen-search input"))return;let o=[],s=r.parentElement;for(;s;){let i=s.scrollTop,l=s.scrollLeft;(i||l||s.scrollHeight>s.clientHeight||s.scrollWidth>s.clientWidth)&&o.push({el:s,top:i,left:l}),s=s.parentElement}requestAnimationFrame(()=>{o.forEach(i=>{i.el.scrollTop=i.top,i.el.scrollLeft=i.left})})},!0),!!document.getElementById("formContent")&&!!document.querySelector(".form-signin"))Co();else{Vi();try{mn()}catch{}try{Wr()}catch(e){console.warn("[URP++] route feature refresh",e)}try{Vt(document)}catch{}try{Ln()}catch{}[350,900,1800].forEach(e=>setTimeout(()=>{try{Wr()}catch{}try{Vt(document)}catch{}},e));try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}[400,1200,2500].forEach(e=>setTimeout(()=>{try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}},e));try{ca()&&vo()&&window.__urpppCleanMode&&setTimeout(()=>{try{window.__urpppCleanMode.open(!1)}catch{}},700)}catch{}}}if(a(Xa,"init"),!window.__urpppSidebarSyncBound){window.__urpppSidebarSyncBound=!0,window.addEventListener("resize",()=>{clearTimeout(window.__urpppSidebarSyncTimer),window.__urpppSidebarSyncTimer=setTimeout(_e,50)}),window.addEventListener("load",()=>{_e(),Re(),setTimeout(_e,100),setTimeout(_e,400)}),document.addEventListener("click",e=>{e.target&&e.target.closest&&e.target.closest("#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse")&&(setTimeout(Re,0),setTimeout(Re,50),setTimeout(Re,200))},!0);let t=document.getElementById("sidebar");t&&!t.__urpppMarginObs&&(t.__urpppMarginObs=new MutationObserver(()=>{clearTimeout(window.__urpppMarginObsTimer),window.__urpppMarginObsTimer=setTimeout(Re,30)}),t.__urpppMarginObs.observe(t,{attributes:!0,attributeFilter:["class","style"]}))}function Jn(){if(window.__urpppRouteWatchBound)return;window.__urpppRouteWatchBound=!0;let t=0,e=a(()=>{try{let s=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches),i=!!(document.getElementById("urppp-clean-root")&&document.getElementById("urppp-clean-root").classList.contains("open"));s&&!i&&window.__urpppCloseMobileDrawer&&window.__urpppCloseMobileDrawer()}catch{}clearTimeout(t),t=setTimeout(()=>{if(nt._termWeekResolved=!1,!!document.getElementById("sidebar")){_e(),dn(),st(),_e();try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}dt(),[250,700].forEach(i=>setTimeout(()=>{try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}},i)),Aa(),Wo(),Go(),Bo(),Jo(),Uo(),Do(),document.querySelectorAll(".page-content, #page-content-template").forEach(i=>{let l=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches);i.style.setProperty("padding",l?"8px 8px 24px":"16px 64px 40px","important"),i.style.setProperty("box-sizing","border-box","important")}),Tr(),Ir(),Fe(),setTimeout(Fe,300),setTimeout(Fe,1e3),qo(),he(),ir(),$o(),setTimeout(ir,300),sr(),setTimeout(()=>sr(),500),qr(),Mo();try{Wr()}catch{}try{Vt(document)}catch{}setTimeout(()=>{try{Wr()}catch{}try{Vt(document)}catch{}},500)}},100)},"run");window.addEventListener("popstate",e),window.addEventListener("hashchange",e);let r=history.pushState,o=history.replaceState;history.pushState=function(...s){let i=r.apply(this,s);return e(),i},history.replaceState=function(...s){let i=o.apply(this,s);return e(),i}}a(Jn,"watchRouteChanges");let Ke=typeof unsafeWindow<"u"?unsafeWindow:window;Ke.__urpppDebug=Ke.__urpppDebug||{},Ke.__urpppDebug.setCalendarPhase=t=>qn(t),Ke.__urpppDebug.getCalendarPhase=()=>sl(),Ke.__urpppDebug.calVacation=t=>br(t),Ke.urppp={version:p,showLogo(t){let e=document.querySelector("#urppp-brand .ub-logo");e&&e.classList.toggle("show",t)},theme:{apply:a(t=>{Wt(t)},"apply"),setAccent:Ci,getAccent:Yt,getCurrent:Qt,list:a(()=>Object.entries(Ct).map(([t,e])=>({name:t,displayName:e.name,current:t===Qt()})),"list")},update:{check:Ba,auto:Na,showToast:Ia},privacy:{get:ve,set(t){return ma(t),Vt(document),ve()},apply:a(()=>Vt(document),"apply"),identity:{get:$e,set(t){return fo(t),Vt(document),Ha(),$e()}}},scheduleExport:{load:a(()=>vn("api"),"load"),run:a(t=>Vs(t,"api",null,null),"run"),patch:Va,image:{theme:An,build:a((t,e)=>Sn(t,e),"build")},jsonFormat:{get:zr,set:yo,validate:qe,build(t,e){let r=Qr(t);if(e)return Kr(r,qe(e));let o=zr();return o.enabled?Kr(r,o.mapping):Xr(r)},buildDefault(t){return Xr(Qr(t))}}}};function Vn(){setTimeout(()=>{try{Na()}catch{}},1800)}a(Vn,"scheduleAutoUpdateCheck");try{wo()}catch{}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Xa(),Jn(),Vn()}):(Xa(),Jn(),Vn())})();})();
