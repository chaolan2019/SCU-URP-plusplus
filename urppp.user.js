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

(()=>{var zl=Object.defineProperty;var a=(p,n)=>zl(p,"name",{value:n,configurable:!0});function Qr(p){let n=String(p).replace("#","").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return n?{r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16)}:{r:30,g:58,b:95}}a(Qr,"hexToRgb");function be(p,n,c){return"#"+[p,n,c].map(d=>Math.max(0,Math.min(255,Math.round(d))).toString(16).padStart(2,"0")).join("")}a(be,"rgbToHex");function Wt(p){let n=String(p||"").trim();return n?(n[0]!=="#"&&(n="#"+n),/^#[0-9a-fA-F]{6}$/.test(n)?n.toUpperCase():""):""}a(Wt,"normalizeHexColor");function Ga(p,n){let{r:c,g:d,b:u}=Qr(p),k=1-n;return be(c*k,d*k,u*k)}a(Ga,"darken");function gr(p,n){let{r:c,g:d,b:u}=Qr(p);return`rgba(${c},${d},${u},${n})`}a(gr,"alpha");function Nt(p,n,c){let d=Qr(Wt(p)||"#FFFFFF"),u=Qr(Wt(n)||"#FFFFFF"),k=Math.max(0,Math.min(1,Number(c)||0));return be(d.r+(u.r-d.r)*k,d.g+(u.g-d.g)*k,d.b+(u.b-d.b)*k)}a(Nt,"mixHex");function Ja(p,n){if(typeof p!="function")throw new TypeError(`${n} must be a function`)}a(Ja,"assertFunction");function Re(p){if(!p||typeof p!="object")throw new TypeError("feature definition must be an object");let n=String(p.id||"").trim();if(!n)throw new TypeError("feature id is required");return Ja(p.matches,`${n}.matches`),Ja(p.mount,`${n}.mount`),Ja(p.unmount,`${n}.unmount`),Object.freeze({id:n,matches:p.matches,mount:p.mount,unmount:p.unmount})}a(Re,"defineFeature");function Wn(p){if(!Array.isArray(p))throw new TypeError("features must be an array");let n=p.map(Re),c=new Set;n.forEach(S=>{if(c.has(S.id))throw new Error(`duplicate feature id: ${S.id}`);c.add(S.id)});let d=null,u=null;function k(){if(!d)return;let S=d,y=u;d=null,u=null,S.unmount(y)}a(k,"unmount");function P(S={}){let y=n.find(g=>g.matches(S));if(y&&d===y&&S.lifecycleKey!==void 0&&u?.lifecycleKey===S.lifecycleKey)try{return y.mount(S),u=S,y.id}catch(g){throw k(),g}if(k(),!y)return null;try{return y.mount(S),d=y,u=S,y.id}catch(g){try{y.unmount(S)}catch{}throw g}}return a(P,"refresh"),Object.freeze({refresh:P,unmount:k,getActiveFeatureId:a(()=>d?.id||null,"getActiveFeatureId"),listFeatureIds:a(()=>n.map(S=>S.id),"listFeatureIds")})}a(Wn,"createFeatureRuntime");function pt(p){return String(p||"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}a(pt,"escapeHtml");function Va(p){let n=String(p||"").match(/@version\s+([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)/i);return n?n[1]:""}a(Va,"parseUserscriptVersion");function Gn(p){return String(p||"0").replace(/^v/i,"").split(/[.+\-]/).filter(Boolean).map(n=>/^\d+$/.test(n)?parseInt(n,10):n)}a(Gn,"normalizeVersionParts");function he(p,n){let c=Gn(p),d=Gn(n),u=Math.max(c.length,d.length);for(let k=0;k<u;k+=1){let P=c[k]==null?0:c[k],S=d[k]==null?0:d[k];if(typeof P=="number"&&typeof S=="number"){if(P>S)return 1;if(P<S)return-1;continue}let g=String(P),w=String(S);if(g>w)return 1;if(g<w)return-1}return 0}a(he,"compareVersions");var fe={base:{},coursesPath:"courses",schedulePath:"schedule",courseFields:{name:"name",teacher:"teacher",position:"position",day:"day",sections:"sections",weeks:"weeks"},scheduleFields:{morningNum:"morningNum",afternoonNum:"afternoonNum",nightNum:"nightNum",sections:"sections"}},Ll=["name","teacher","position","day","sections","weeks","code","sequence","englishName","attribute","category","credit","status","campus","building","classroom","startSection","endSection","weekList"],ql=["morningNum","afternoonNum","nightNum","sections","sectionList"];function Qa(p){return JSON.parse(JSON.stringify(p))}a(Qa,"cloneJsonValue");function Qn(p,n){return p===n||p.startsWith(`${n}.`)||n.startsWith(`${p}.`)}a(Qn,"scheduleJsonPathsOverlap");function Ue(p,n){let c=String(p??"").trim();if(!c){if(n)return"";throw new Error("课程数组输出路径不能为空")}if(c.length>120)throw new Error("JSON 输出路径不能超过 120 个字符");let d=c.split("."),u=new Set(["__proto__","prototype","constructor"]);if(d.some(P=>!P||/^\d+$/.test(P)||/[\[\]\x00-\x1f]/.test(P)||u.has(P)))throw new Error(`JSON 输出路径包含无效片段：${c}`);return d.join(".")}a(Ue,"validateScheduleJsonPath");function Tl(p,n){for(let c=0;c<p.length;c+=1)for(let d=c+1;d<p.length;d+=1)if(Qn(p[c],p[d]))throw new Error(`${n}目标路径不能重叠：${p[c]} / ${p[d]}`)}a(Tl,"validateScheduleJsonTargetPaths");function Jn(p,n,c){let d=n.split("."),u=p;for(let k=0;k<d.length;k+=1){let P=d[k];if(!Object.prototype.hasOwnProperty.call(u,P))return;if(k===d.length-1)throw new Error(`${c}输出路径与 base 字段重叠：${n}`);if(u=u[P],!u||typeof u!="object"||Array.isArray(u)){let S=d.slice(0,k+1).join(".");throw new Error(`${c}输出路径无法穿过 base 中的非对象字段：${S}`)}}}a(Jn,"validateScheduleJsonBasePath");function Vn(p,n,c){if(!p||typeof p!="object"||Array.isArray(p))throw new Error(`${c}字段映射必须是对象`);let d={};return Object.entries(p).forEach(([u,k])=>{if(!n.includes(u))throw new Error(`${c}不支持源字段：${u}`);let P=Ue(k,!0);P&&(d[u]=P)}),Tl(Object.values(d),`${c}字段`),d}a(Vn,"validateScheduleJsonFieldMap");function Pr(p){if(!p||typeof p!="object"||Array.isArray(p))throw new Error("自定义 JSON 映射必须是对象");let n=p.base==null?{}:p.base;if(!n||typeof n!="object"||Array.isArray(n))throw new Error("base 必须是 JSON 对象");let c={base:Qa(n),coursesPath:Ue(p.coursesPath,!1),schedulePath:Ue(p.schedulePath,!0),courseFields:Vn(p.courseFields,Ll,"课程"),scheduleFields:Vn(p.scheduleFields||{},ql,"时间表")};if(!Object.keys(c.courseFields).length)throw new Error("至少保留一个课程字段映射");if(c.schedulePath&&Qn(c.schedulePath,c.coursesPath))throw new Error("课程与时间表输出路径不能重叠");return Jn(c.base,c.coursesPath,"课程"),c.schedulePath&&Jn(c.base,c.schedulePath,"时间表"),c}a(Pr,"validateScheduleJsonMapping");function ge(p){let n=String(p||"").replace(/\D/g,"").padStart(4,"0").slice(-4),c=`${n.slice(0,2)}:${n.slice(2)}`;return/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(c)?c:""}a(ge,"normalizeSectionTime");function Ya(p,n,c){let d=Ue(n,!1).split("."),u=p;d.forEach((k,P)=>{if(P===d.length-1){u[k]=c;return}(!u[k]||typeof u[k]!="object"||Array.isArray(u[k]))&&(u[k]={}),u=u[k]})}a(Ya,"setScheduleJsonPath");function Yn(p,n){let c={};return Object.entries(n||{}).forEach(([d,u])=>{!Object.prototype.hasOwnProperty.call(p,d)||p[d]===void 0||Ya(c,u,Qa(p[d]))}),c}a(Yn,"mappedScheduleJsonObject");function Ml(p){return[p.campus,p.building,p.classroom].map(n=>String(n||"").trim()).filter(Boolean).join(" ")}a(Ml,"scheduleJsonPosition");function $l(p){let n=Number(p.startSection)||0,c=Number(p.endSection)||n;return n<1||c<n?"":Array.from({length:c-n+1},(d,u)=>n+u).join(",")}a($l,"scheduleJsonSectionString");function Il(p,n){let c=Number(n.day)||0,d=$l(n),u=Array.from(new Set((n.weeks||[]).map(Number).filter(k=>Number.isInteger(k)&&k>=1&&k<=60))).sort((k,P)=>k-P);return c<1||c>7||!d?{error:"invalid"}:u.length?{value:{name:p.name,teacher:p.teacher,position:Ml(n),day:c,sections:d,weeks:u.join(","),code:p.code,sequence:p.sequence,englishName:p.englishName,attribute:p.attribute,category:p.category,credit:p.credit,status:p.status,campus:n.campus,building:n.building,classroom:n.classroom,startSection:n.startSection,endSection:n.endSection,weekList:u}}:{error:"weeks"}}a(Il,"scheduleJsonCourseRecord");function Nl(p,n){let c=[];return p.courses.forEach(d=>{if(!d.arrangements.length){n.unscheduledCourses+=1;return}d.arrangements.forEach(u=>{let k=Il(d,u);k.error==="weeks"?n.missingWeeks+=1:k.error?n.invalidArrangements+=1:c.push(k.value)})}),c}a(Nl,"buildScheduleJsonCourses");function Bl(p){let n=new Map;return(p||[]).forEach(c=>{let d=Number(c.section),u=ge(c.start),k=ge(c.end);!Number.isInteger(d)||d<1||d>20||!u||!k||n.set(d,{i:d,s:u,e:k})}),Array.from(n.values()).sort((c,d)=>c.i-d.i)}a(Bl,"buildScheduleJsonSections");function Fl(p){let n=Bl(p);if(!n.length)return{};let c={sections:JSON.stringify(n),sectionList:n};if(!n.every((u,k)=>u.i===k+1))return c;let d={morningNum:0,afternoonNum:0,nightNum:0};return n.forEach(u=>{let[k,P]=u.s.split(":").map(Number),S=k*60+P;S<720?d.morningNum+=1:S>=1080?d.nightNum+=1:d.afternoonNum+=1}),d.morningNum&&d.afternoonNum&&d.nightNum?Object.assign(c,d):c}a(Fl,"buildScheduleJsonSchedule");function We(p){let n={unscheduledCourses:0,missingWeeks:0,invalidArrangements:0},c=Nl(p,n);if(!c.length)throw new Error("没有符合导入格式的已排课课程");return{courses:c,schedule:Fl(p.sections),stats:n}}a(We,"buildScheduleJsonSource");function Ge(p){let n={courses:p.courses.map(d=>({name:d.name,teacher:d.teacher,position:d.position,day:d.day,sections:d.sections,weeks:d.weeks}))},c={};return["morningNum","afternoonNum","nightNum","sections"].forEach(d=>{Object.prototype.hasOwnProperty.call(p.schedule,d)&&(c[d]=p.schedule[d])}),Object.keys(c).length&&(n.schedule=c),n}a(Ge,"buildXiaoAiScheduleJson");function Je(p,n){let c=Qa(n.base||{}),d=p.courses.map(u=>Yn(u,n.courseFields));if(Ya(c,n.coursesPath,d),n.schedulePath&&Object.keys(p.schedule).length){let u=Yn(p.schedule,n.scheduleFields);Object.keys(u).length&&Ya(c,n.schedulePath,u)}return c}a(Je,"buildCustomScheduleJson");function xe(p){return p.getFullYear()+"-"+String(p.getMonth()+1).padStart(2,"0")+"-"+String(p.getDate()).padStart(2,"0")}a(xe,"localDateIso");function Xr(p){let n=String(p||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!n)return null;let c=new Date(Number(n[1]),Number(n[2])-1,Number(n[3]));return Number.isNaN(c.getTime())||xe(c)!==String(p)?null:c}a(Xr,"parseLocalIsoDate");function Xa(p){let n=new Date(p.getFullYear(),p.getMonth(),p.getDate()),c=n.getDay();return n.setDate(n.getDate()-(c===0?6:c-1)),n}a(Xa,"mondayOfDate");function Kn(p){let n=String(p||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!n)return xe(Xa(new Date));let c=n[3]==="1"?Number(n[1]):Number(n[2]),d=n[3]==="1"?8:2,u=new Date(c,d,1);for(;u.getDay()!==1;)u.setDate(u.getDate()+1);return xe(u)}a(Kn,"defaultSemesterMonday");function Xn(p){return p.getFullYear()+String(p.getMonth()+1).padStart(2,"0")+String(p.getDate()).padStart(2,"0")+"T"+String(p.getHours()).padStart(2,"0")+String(p.getMinutes()).padStart(2,"0")+"00"}a(Xn,"formatIcsLocal");function Ve(p){return String(p||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}a(Ve,"escapeIcsText");function Dl(p){if(typeof TextEncoder!="function")return p;let n=new TextEncoder,c=[],d="",u=73;for(let k of String(p))n.encode(d+k).length>u&&d?(c.push(d),d=" "+k,u=74):d+=k;return d&&c.push(d),c.join(`\r
`)}a(Dl,"foldIcsLine");function jl(p){let n=2166136261,c=String(p||"");for(let d=0;d<c.length;d+=1)n=Math.imul(n^c.charCodeAt(d),16777619);return(n>>>0).toString(16)+"@scu-urppp"}a(jl,"scheduleUid");function Zn(p){let n=new Map;return p.sections.forEach(c=>n.set(c.section,c)),n}a(Zn,"scheduleSectionMap");function Ol(p){return p.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}a(Ol,"formatTimestamp");function tp(p,n,c={}){let d=Xr(n);if(!d)throw new Error("第一教学周日期无效");let u=Zn(p);if(!u.size)throw new Error("教务接口没有返回节次时间，无法生成 ICS");let k=Ol(c.now instanceof Date?c.now:new Date),P=0,S=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SCU URP++//Schedule Export//CN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:"+Ve(p.semester.label+"课表"),"X-WR-TIMEZONE:Asia/Shanghai","BEGIN:VTIMEZONE","TZID:Asia/Shanghai","X-LIC-LOCATION:Asia/Shanghai","BEGIN:STANDARD","TZOFFSETFROM:+0800","TZOFFSETTO:+0800","TZNAME:CST","DTSTART:19700101T000000","END:STANDARD","END:VTIMEZONE"];if(p.courses.forEach(y=>y.arrangements.forEach(A=>{let g=u.get(A.startSection),w=u.get(A.endSection);!g||!w||A.weeks.forEach(T=>{let C=new Date(d);C.setDate(d.getDate()+(T-1)*7+A.day-1);let b=new Date(C),m=new Date(C),v=g.start.split(":").map(Number),x=w.end.split(":").map(Number);b.setHours(v[0],v[1],0,0),m.setHours(x[0],x[1],0,0);let _=[A.campus,A.building,A.classroom].filter(Boolean).join(" "),q=["教师："+y.teacher,"周次："+A.weekDescription,"课程号："+y.code+(y.sequence?"_"+y.sequence:""),"学分："+y.credit,"课程属性："+y.attribute].filter(L=>!/[：:]$/.test(L)).join(`
`),I=[p.semester.planCode,y.code,y.sequence,A.day,A.startSection,A.endSection,T,A.campus,A.building,A.classroom].join("|");P+=1,S.push("BEGIN:VEVENT","UID:"+jl(I),"DTSTAMP:"+k,"SUMMARY:"+Ve(y.name),"LOCATION:"+Ve(_),"DESCRIPTION:"+Ve(q),"DTSTART;TZID=Asia/Shanghai:"+Xn(b),"DTEND;TZID=Asia/Shanghai:"+Xn(m),"END:VEVENT")})})),!P)throw new Error("课表中没有已安排时间的课程，无法生成 ICS");return S.push("END:VCALENDAR"),S.map(Dl).join(`\r
`)+`\r
`}a(tp,"buildScheduleIcs");function rp(p){let n=Zn(p),c=0,d=0;return p.courses.forEach(u=>u.arrangements.forEach(k=>{k.weeks.length||(c+=1),(!n.has(k.startSection)||!n.has(k.endSection))&&(d+=1)})),{missingWeeks:c,missingTimes:d}}a(rp,"scheduleIcsOmissionStats");function Hl(p){let n=String(p||"").replace(/[—–]/g,"-"),c=/单周|单数周|[（(]单[）)]/.test(n)?1:/双周|双数周|[（(]双[）)]/.test(n)?0:-1,d=new Set,u=a(k=>{let P=Number(k);P>=1&&P<=30&&(c<0||P%2===c)&&d.add(P)},"add");return n.replace(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/g,(k,P,S)=>{let y=Math.min(Number(P),Number(S)),A=Math.max(Number(P),Number(S));for(let g=y;g<=A;g+=1)u(g);return k}),(n.match(/\d{1,2}/g)||[]).forEach(u),Array.from(d).sort((k,P)=>k-P)}a(Hl,"scheduleWeeksFromDescription");function ep(p,n){let c=String(p||"").trim();if(/^[01]+$/.test(c)){let d=[];for(let u=0;u<c.length;u+=1)c.charAt(u)==="1"&&d.push(u+1);return d}return Hl(n||c)}a(ep,"scheduleWeeks");function Rl(p){let n=p&&Array.isArray(p.xkxx)?p.xkxx:[];for(let c of n){let d=Object.values(c||{});if(d.length)return d[0]}return null}a(Rl,"firstScheduleCourse");function Kr(p){let n=Rl(p);if(!n)return"";let c=Array.isArray(n.timeAndPlaceList)?n.timeAndPlaceList[0]:null;return String(n.zxjxjhh||n.executiveEducationPlanNumber||n.id&&(n.id.zxjxjhh||n.id.executiveEducationPlanNumber)||c&&(c.zxjxjhh||c.executiveEducationPlanNumber)||"").trim()}a(Kr,"schedulePlanCodeFromData");function Ul(p){let n=String(p||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!n)return"学生课表";let c=n[3]==="1"?"秋季学期":n[3]==="2"?"春季学期":"学期";return n[1]+"-"+n[2]+"学年"+c}a(Ul,"semesterLabelFromPlanCode");function ap(p,n,c,d={}){let u=n||Kr(p),k=(Array.isArray(p&&p.jcsjbs)?p.jcsjbs:[]).map(y=>({section:Number(y.jc)||0,start:ge(y.kssj),end:ge(y.jssj)})).filter(y=>y.section>=1&&y.section<=20&&y.start&&y.end).sort((y,A)=>y.section-A.section),P=[];(Array.isArray(p&&p.xkxx)?p.xkxx:[]).forEach(y=>{Object.keys(y||{}).forEach(A=>{let g=y[A];if(!g)return;let w=g.id||{},T=(g.timeAndPlaceList||[]).map(C=>({day:Number(C.classDay)||0,startSection:Number(C.classSessions)||1,endSection:Math.min(12,(Number(C.classSessions)||1)+Math.max(1,Number(C.continuingSession)||1)-1),weeks:ep(C.classWeek,C.weekDescription||g.skzcs),weekDescription:String(C.weekDescription||g.skzcs||"").trim(),campus:String(C.campusName||"").trim(),building:String(C.teachingBuildingName||"").trim(),classroom:String(C.classroomName||"").trim()})).filter(C=>C.day>=1&&C.day<=7&&C.startSection>=1&&C.startSection<=12);P.push({code:String(w.coureNumber||g.zkch||"").trim(),sequence:String(w.coureSequenceNumber||g.zkxh||"").trim(),name:String(g.courseName||g.englishCourseName||A).trim(),englishName:String(g.englishCourseName||"").trim(),teacher:String(g.attendClassTeacher||"").trim(),attribute:String(g.coursePropertiesName||"").trim(),category:String(g.courseCategoryName||"").trim(),credit:Number(g.unit)||0,status:String(g.selectCourseStatusName||"").trim(),arrangements:T})})});let S=String(d.firstMonday||"").trim();return{schemaVersion:1,exportedAt:(d.now instanceof Date?d.now:new Date).toISOString(),source:c||"SCU URP++",semester:{planCode:u,label:Ul(u),firstMonday:Xr(S)?S:""},sections:k,courses:P}}a(ap,"normalizeScheduleExportData");function op(p,n,c,d=0){let u=Math.max(0,Number(p)||0),k=Math.max(1,Math.floor(Number(n)||1)),P=Math.max(0,Math.min(k-1,Math.floor(Number(c)||0))),S=-Math.max(0,Number(d)||0),y=S+u*P/k,A=S+u*(P+1)/k;return{left:y,width:Math.max(0,A-y)}}a(op,"scheduleCardLaneGeometry");function Ye(p,n,c){let d=[],u=String(p||""),k=Math.max(4,Number(n)||4);for(;u;)d.push({text:u.slice(0,k),kind:c}),u=u.slice(k);return d}a(Ye,"wrapField");function Qe(p,n){let c=p.slice(0,Math.max(0,n)).map(d=>({...d}));if(c.length&&c.length<p.length){let d=c[c.length-1];d.text=d.text.length>1?d.text.slice(0,-1)+"…":"…"}return c}a(Qe,"takeLines");var np=["#2563EB","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#DB2777","#4D7C0F","#EA580C","#4F46E5"];function ip(p){let n=0,c=String(p||"");for(let d=0;d<c.length;d+=1)n=n*31+c.charCodeAt(d)>>>0;return np[n%np.length]}a(ip,"exportCourseColor");function pp(p){let n=[];p.forEach(c=>{let d=n.findIndex(u=>u<c.startSection);d<0&&(d=n.length,n.push(0)),n[d]=c.endSection,c.lane=d}),p.forEach(c=>{c.laneCount=Math.max(1,n.length)})}a(pp,"assignScheduleLanes");function sp(p){let n=p.slice().sort((u,k)=>u.startSection-k.startSection||u.endSection-k.endSection||u.course.name.localeCompare(k.course.name)),c=[],d=0;return n.forEach(u=>{c.length&&u.startSection>d&&(pp(c),c=[],d=0),c.push(u),d=Math.max(d,u.endSection)}),c.length&&pp(c),n}a(sp,"layoutScheduleDay");function lp(p){let n=[];return p.courses.forEach(c=>c.arrangements.forEach(d=>{n.push({course:c,arrangement:d,startSection:d.startSection,endSection:d.endSection,day:d.day})})),n}a(lp,"scheduleExportEvents");function cp(p,n){let c=[],d=String(p||"");for(;d;)c.push(d.slice(0,n)),d=d.slice(n);return c}a(cp,"wrapScheduleFooter");function dp(p,n,c){let d=p.startSection===p.endSection?p.startSection+"节":p.startSection+"-"+p.endSection+"节",u=Ye(p.name,Math.max(5,n),"title"),k=Ye(p.teacher,Math.max(6,n+2),"teacher"),P=Ye([p.weekDescription,d].filter(Boolean).join(" · "),Math.max(6,n+2),"schedule"),S=Ye([p.campus,p.building,p.classroom].filter(Boolean).join(" "),Math.max(6,n+2),"location"),y=Math.max(1,Number(c)||1),A=S.length&&y>=2?Math.min(2,S.length):0,g=P.length&&y>=3?1:0,w=k.length&&y>=4?1:0,T=Math.max(1,y-A-g-w),C=Qe(u,T),b=y-C.length,m=Math.min(k.length,Math.max(0,b-g-A));C.push(...Qe(k,m)),b=y-C.length;let v=Math.min(P.length,Math.max(0,b-A));return C.push(...Qe(P,v)),b=y-C.length,C.push(...Qe(S,b)),C.slice(0,y)}a(dp,"scheduleImageTextLines");function Wl(p,n){let c=ip(n),d=p.colors,u=p.skin;return u==="brutal"?{fill:Nt(d.surface,c,.48),stroke:"#000000",text:"#111111",secondary:"#242424",stripe:c}:u==="flat"?{fill:Nt(d.surface,c,p.dark?.24:.16),stroke:d.text,text:d.text,secondary:d.secondary,stripe:c}:u==="editorial"?{fill:Nt(d.surface,c,p.dark?.16:.08),stroke:d.border,text:d.text,secondary:d.secondary,stripe:c}:{fill:Nt(d.surface,c,p.dark?.28:u==="organic"?.2:.14),stroke:Nt(d.border,c,p.dark?.52:.42),text:d.text,secondary:d.secondary,stripe:c}}a(Wl,"scheduleImageCourseStyle");function up(p,n,c={}){if(!n||!n.colors||!n.shape)throw new Error("课表图片主题未解析");let d=n.colors,u=n.shape,k=c.now instanceof Date?c.now:new Date,P=1960,S=40,y=136,A=P-S*2,g=S+24,w=64,T=8,C=g+w+12,b=S+A-24,m=(b-C-T*6)/7,v=y+88,x=108,_=102,I=v+x*12-y+24,L=p.courses.filter(at=>!at.arrangements.length).map(at=>at.name),O=cp(L.join("、"),92),M=O.length?74+O.length*27:44,H=y+I+M,G=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],U=u.serif?"Georgia,Noto Serif SC,Songti SC,STSong,SimSun,serif":"Microsoft YaHei,Segoe UI,sans-serif",rt="Microsoft YaHei,Segoe UI,sans-serif",it=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-frame-shadow)"':"",mt=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-card-shadow)"':"",V=[`<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${H}" viewBox="0 0 ${P} ${H}">`,"<defs>",`<filter id="schedule-frame-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${n.dark?10:7}" stdDeviation="${n.dark?16:11}" flood-color="${n.dark?"#000000":d.text}" flood-opacity="${n.dark?.48:.1}"/></filter>`,`<filter id="schedule-card-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${n.dark?"#000000":d.text}" flood-opacity="${n.dark?.34:.1}"/></filter>`,"</defs>",`<rect width="100%" height="100%" fill="${d.bg}"/>`,`<rect x="${S}" y="32" width="142" height="36" rx="${u.headerRadius}" fill="${d.primary}"/>`,`<text x="${S+71}" y="56" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="700" font-family="${rt}">SCU URP++</text>`,`<text x="${S}" y="106" fill="${d.text}" font-size="36" font-weight="700" font-family="${U}">${pt(p.semester.label)}课表</text>`,`<text x="${P-S}" y="54" text-anchor="end" fill="${d.secondary}" font-size="16" font-family="${rt}">${pt(n.label)}</text>`,`<text x="${P-S}" y="83" text-anchor="end" fill="${d.muted}" font-size="14" font-family="${rt}">${pt(k.toLocaleString("zh-CN",{hour12:!1}))}</text>`];u.shadow==="hard"&&V.push(`<rect x="${S+8}" y="${y+8}" width="${A}" height="${I}" fill="#000000"/>`),V.push(`<rect x="${S}" y="${y}" width="${A}" height="${I}" rx="${u.frameRadius}" fill="${d.surface}" stroke="${u.shadow==="hard"?"#000000":d.border}" stroke-width="${u.frameStroke}"${it}/>`),G.forEach((at,X)=>{let ct=C+X*(m+T);V.push(`<rect x="${ct}" y="${y+22}" width="${m}" height="48" rx="${u.headerRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${ct+m/2}" y="${y+53}" text-anchor="middle" fill="${d.secondary}" font-size="17" font-weight="600" font-family="${rt}">${at}</text>`)});for(let at=1;at<=12;at+=1){let X=v+(at-1)*x;V.push(`<rect x="${g}" y="${X}" width="${w}" height="${_}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${g+w/2}" y="${X+_/2+6}" text-anchor="middle" fill="${d.muted}" font-size="16" font-weight="600" font-family="${rt}">${at}</text>`),G.forEach((ct,et)=>{let st=C+et*(m+T);V.push(`<rect x="${st}" y="${X}" width="${m}" height="${_}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`)})}[4,9].forEach(at=>{let X=v+at*x-3;V.push(`<line x1="${C}" y1="${X}" x2="${b}" y2="${X}" stroke="${d.primary}" stroke-opacity=".42" stroke-width="2" stroke-dasharray="10 9"/>`)});for(let at=1;at<=7;at+=1)sp(lp(p).filter(ct=>ct.day===at)).forEach((ct,et)=>{let st=m/ct.laneCount,ft=C+(at-1)*(m+T)+ct.lane*st,Z=v+(ct.startSection-1)*x,dt=st,kt=Math.max(_,(ct.endSection-ct.startSection)*x+_),wt=Wl(n,ct.course.name),Et="course-clip-"+at+"-"+et,N=Math.max(1,Math.floor((kt-18)/23)),Y=dp({name:ct.course.name,teacher:ct.course.teacher,weekDescription:ct.arrangement.weekDescription,startSection:ct.startSection,endSection:ct.endSection,campus:ct.arrangement.campus,building:ct.arrangement.building,classroom:ct.arrangement.classroom},Math.floor((dt-22)/16),N);V.push(`<clipPath id="${Et}"><rect x="${ft+11}" y="${Z+8}" width="${Math.max(10,dt-22)}" height="${Math.max(18,kt-16)}" rx="${Math.max(0,u.cardRadius-5)}"/></clipPath>`,`<rect data-course-card="1" data-day="${at}" data-start="${ct.startSection}" data-end="${ct.endSection}" x="${ft}" y="${Z}" width="${dt}" height="${kt}" rx="${u.cardRadius}" fill="${wt.fill}" stroke="${wt.stroke}" stroke-width="${u.cardStroke}"${mt}/>`),n.skin==="brutal"&&V.push(`<path d="M ${ft+dt-4} ${Z+4} V ${Z+kt-4} H ${ft+4}" fill="none" stroke="#000000" stroke-opacity=".28" stroke-width="5"/>`),n.skin==="editorial"&&V.push(`<rect x="${ft}" y="${Z}" width="6" height="${kt}" fill="${wt.stripe}"/>`),n.skin==="neu"&&V.push(`<path d="M ${ft+u.cardRadius} ${Z+1} H ${ft+dt-u.cardRadius}" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2"/>`),V.push('<g clip-path="url(#'+Et+')">'),Y.forEach((tt,ht)=>{let bt=tt.kind==="title";V.push(`<text data-kind="${tt.kind}" x="${ft+14}" y="${Z+28+ht*23}" fill="${bt?wt.text:wt.secondary}" font-size="${bt?16:13}" font-weight="${bt?700:500}" font-family="${bt&&u.serif?U:rt}">${pt(tt.text)}</text>`)}),V.push("</g>")});let Q=y+I+30;return O.length?(V.push(`<text x="${S}" y="${Q}" fill="${d.secondary}" font-size="15" font-weight="700" font-family="${rt}">未排定时间的课程</text>`),O.forEach((at,X)=>V.push(`<text x="${S}" y="${Q+29+X*27}" fill="${d.muted}" font-size="14" font-family="${rt}">${pt(at)}</text>`))):V.push(`<text x="${S}" y="${Q}" fill="${d.muted}" font-size="14" font-family="${rt}">由 SCU URP++ 基于结构化课表数据生成</text>`),V.push("</svg>"),{svg:V.join(""),width:P,height:H,background:d.bg,theme:n}}a(up,"buildScheduleSvg");function Gl(p,n,c={}){let d=[],u=c.json||null,k=c.ics||null,P=p==="ics"?n.courses.filter(S=>!S.arrangements.length).length:0;return P&&d.push(P+" 门未排定时间的课程未写入日历"),u&&u.unscheduledCourses&&d.push(u.unscheduledCourses+" 门未排定时间的课程未写入 JSON"),u&&u.missingWeeks&&d.push(u.missingWeeks+" 个上课安排缺少周次"),u&&u.invalidArrangements&&d.push(u.invalidArrangements+" 个上课安排缺少日期或节次"),k&&k.missingWeeks&&d.push(k.missingWeeks+" 个上课安排缺少周次"),k&&k.missingTimes&&d.push(k.missingTimes+" 个上课安排缺少节次时间"),d}a(Gl,"scheduleExportCompletionNotes");function Xe(p,n,c,d,u){return`<button type="button" class="urppp-export-option" role="menuitem" data-export-type="${p}"${u?" disabled":""}><i class="fa ${n}" aria-hidden="true"></i><span><strong>${c}</strong><small>${d}</small></span></button>`}a(Xe,"exportOptionHtml");function mp(p){let{document:n,window:c,ensureStyles:d,loadData:u,exportJson:k,exportIcs:P,exportPng:S,showToast:y,nativePageUrl:A,navigate:g,logger:w=console}=p;function T(x){x&&(x.classList.remove("open"),x.querySelector(".urppp-export-trigger")?.setAttribute("aria-expanded","false"))}a(T,"closeMenu");function C(){c.__urpppExportDismissBound||(c.__urpppExportDismissBound=!0,n.addEventListener("click",x=>{n.querySelectorAll(".urppp-export-wrap.open").forEach(_=>{_.contains(x.target)||T(_)})},!0),n.addEventListener("keydown",x=>{x.key==="Escape"&&n.querySelectorAll(".urppp-export-wrap.open").forEach(T)}))}a(C,"bindDismiss");async function b(x,_,q,I){if(I&&I.disabled)return;let L=I&&I.innerHTML;try{if(I&&(I.disabled=!0,I.innerHTML='<i class="fa fa-spinner fa-spin"></i> 准备中'),x==="pdf"){if(typeof q!="function")throw new Error("当前页面不提供原生 PDF 导出");await q();return}let O=await u(_),M={};if(x==="json")M.json=await k(O);else if(x==="ics")M.ics=await P(O);else if(x==="png")await S(O);else throw new Error("未知导出格式");let H=Gl(x,O,M);y("课表已导出："+x.toUpperCase()+(H.length?"；"+H.join("，"):""))}catch(O){if(O&&O.message==="已取消导出")return;w.warn("[URP++] schedule export",O),y(O&&O.message||String(O),!0)}finally{I&&(I.disabled=!1,I.innerHTML=L)}}a(b,"run");function m(x={}){d();let _=x.source||"native",q=x.pdfHandler,I=typeof q=="function",L=n.createElement("span"),O=_==="native"?"导出课表":"导出";L.className="urppp-export-wrap",L.innerHTML=`<button type="button" class="urppp-export-trigger" aria-haspopup="menu" aria-expanded="false" title="导出课表"><i class="fa fa-cloud-download" aria-hidden="true"></i><span>${O}</span><i class="fa fa-angle-down" aria-hidden="true"></i></button><div class="urppp-export-menu" role="menu">${Xe("ics","fa-calendar","ICS 日历","导入系统日历或日历应用",!1)}${Xe("json","fa-code","JSON 数据","兼容小爱课程导入，可自定义格式",!1)}${Xe("png","fa-image","PNG 图片","完整学期课表高清图片",!1)}${Xe("pdf","fa-file-pdf-o","PDF",I?"使用教务系统原生导出":"仅原教务课表页面可用",!I)}${I?"":'<div class="urppp-export-guide">PDF 依赖原教务课表页面。<button type="button" data-export-native="1">前往本学期课表</button></div>'}</div>`;let M=L.querySelector(".urppp-export-trigger");M.addEventListener("click",G=>{G.preventDefault(),G.stopPropagation();let U=!L.classList.contains("open");n.querySelectorAll(".urppp-export-wrap.open").forEach(T),L.classList.toggle("open",U),M.setAttribute("aria-expanded",U?"true":"false")}),L.querySelectorAll("[data-export-type]:not(:disabled)").forEach(G=>{G.addEventListener("click",()=>{T(L),b(G.getAttribute("data-export-type"),_,q,M)})});let H=L.querySelector("[data-export-native]");return H&&H.addEventListener("click",()=>g(A)),C(),L}a(m,"createMenu");function v(x){(x&&x.querySelectorAll?x:n).querySelectorAll("[data-schedule-export-host]").forEach(q=>{q.querySelector(".urppp-export-wrap")||q.appendChild(m({source:q.getAttribute("data-schedule-export-host")||"clean"}))})}return a(v,"bindHosts"),{bindHosts:v,closeMenu:T,createMenu:m,run:b}}a(mp,"createScheduleExportUi");function bp(p){let n=a(c=>{p.querySelectorAll(".urppp-set-tab").forEach(d=>{let u=d.dataset.tab===c;d.classList.toggle("ac",u),d.setAttribute("aria-selected",u?"true":"false")}),p.querySelectorAll(".urppp-set-pane").forEach(d=>{d.classList.toggle("ac",d.dataset.pane===c)});try{let d=p.querySelector(".urppp-set-body");d&&(d.scrollTop=0)}catch{}},"switchTab");return p.querySelectorAll(".urppp-set-tab").forEach(c=>{c.addEventListener("click",()=>n(c.dataset.tab))}),p.__urpppSwitchTab=n,n}a(bp,"bindSettingsTabs");function hp(p){let{document:n,ensurePanel:c,syncPanel:d,refreshUpdateStatus:u,defaultTab:k="theme"}=p;function P(){c();let y=n.getElementById("urppp-settings-panel"),A=n.getElementById("urppp-settings-mask");if(!y||!A)return!1;d();try{u()}catch{}try{y.__urpppSwitchTab&&y.__urpppSwitchTab(k)}catch{}A.classList.remove("open"),y.classList.remove("open"),y.offsetWidth,A.classList.add("open"),y.classList.add("open");try{let g=y.querySelector(".urppp-set-body");g&&(g.scrollTop=0)}catch{}return!0}a(P,"open");function S(){let y=n.getElementById("urppp-settings-panel"),A=n.getElementById("urppp-settings-mask");y&&y.classList.remove("open"),A&&A.classList.remove("open")}return a(S,"close"),{close:S,open:P}}a(hp,"createSettingsPanelController");function gp(p){let{logoData:n,repositoryUrl:c,version:d}=p;return['<div class="urppp-set-head">','  <div class="urppp-set-title">设置</div>','  <button type="button" class="urppp-set-close" id="urppp-set-close" aria-label="关闭">×</button>',"</div>",'<div class="urppp-set-tabs" role="tablist">','  <button type="button" class="urppp-set-tab ac" data-tab="theme" role="tab" aria-selected="true">主题设置</button>','  <button type="button" class="urppp-set-tab" data-tab="skin" role="tab" aria-selected="false">主题选择</button>','  <button type="button" class="urppp-set-tab" data-tab="system" role="tab" aria-selected="false">系统设置</button>','  <button type="button" class="urppp-set-tab" data-tab="about" role="tab" aria-selected="false">关于</button>',"</div>",'<div class="urppp-set-body">','  <div class="urppp-set-pane ac" data-pane="theme">','    <section class="urppp-set-sec">',"      <h3>主题模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-modes">','        <button type="button" class="urppp-set-mode" data-theme="default">简约白</button>','        <button type="button" class="urppp-set-mode" data-theme="dark">深邃暗</button>','        <button type="button" class="urppp-set-mode" data-theme="scu-red">动态配色</button>',"      </div>",'      <div class="urppp-set-follow-row">','        <button type="button" class="urppp-set-follow" id="urppp-set-follow" aria-pressed="false">跟随系统：关</button>','        <button type="button" class="urppp-set-follow" id="urppp-set-follow-dynamic" aria-pressed="false">浅色用动态配色：关</button>',"      </div>",'      <button type="button" class="urppp-set-follow" id="urppp-set-clean-default" aria-pressed="false" style="margin-top:12px;width:100%">默认进入清爽模式：关</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-clean-analysis" aria-pressed="false" style="margin-top:12px;width:100%">清爽成绩分析展示：选项卡</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-apple-edge" aria-pressed="true" style="margin-top:12px;width:100%">类Apple边缘线条：开</button>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-dynamic">',"      <h3>种子色</h3>",'      <p class="urppp-set-tip">选一个颜色，自动生成背景、卡片、强调色等多套方案</p>','      <div class="urppp-set-presets" id="urppp-set-presets"></div>','      <div class="urppp-set-custom">','        <input type="color" id="urppp-set-color" value="#B53434" />','        <input type="text" id="urppp-set-hex" maxlength="7" value="#B53434" spellcheck="false" />','        <button type="button" class="urppp-set-btn" id="urppp-set-gen">生成方案</button>','        <button type="button" class="urppp-set-btn ghost" id="urppp-set-save">存为预设</button>',"      </div>",'      <h3 style="margin-top:16px">配色方案</h3>','      <div class="urppp-set-schemes" id="urppp-set-schemes"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-brutal" style="display:none">',"      <h3>高对比配色</h3>",'      <p class="urppp-set-tip">默认圆点使用高能粉；选择一种备用配色后，可由左上第三个圆点快速切换。</p>','      <div class="urppp-set-schemes" id="urppp-set-brutal-palettes"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="skin">','    <section class="urppp-set-sec">',"      <h3>界面风格</h3>",'      <p class="urppp-set-tip">在同一布局上切换视觉气质。因适配规模较大，仅保证清爽模式的完整适配，如有影响请使用默认类Apple风格并选择性开启边缘线条。</p>','      <div class="urppp-theme-store-bar"><button type="button" class="urppp-set-btn ghost" id="urppp-theme-store">主题商店</button></div>','      <div id="urppp-theme-store-inline" class="urppp-store-inline" style="display:none"></div>','      <div class="urppp-skin-list" id="urppp-skin-list"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="system">','    <section class="urppp-set-sec" id="urppp-set-privacy">',"      <h3>隐私模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-privacy-modes">','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="off">关闭</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="one">一键隐私</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="custom">自定义</button>',"      </div>",'      <div class="urppp-privacy-groups" id="urppp-set-privacy-custom">','        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">身份信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-identity" type="checkbox" data-privacy-field="identity" aria-label="隐藏学号和证件"><label for="urppp-privacy-identity">学号/证件</label><input class="urppp-feature-input" data-privacy-value="identity" maxlength="40" aria-label="学号和证件替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-organization" type="checkbox" data-privacy-field="organization" aria-label="隐藏学院和专业"><label for="urppp-privacy-organization">学院/专业</label><input class="urppp-feature-input" data-privacy-value="organization" maxlength="40" aria-label="学院和专业替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-contact" type="checkbox" data-privacy-field="contact" aria-label="隐藏联系和个人信息"><label for="urppp-privacy-contact">联系/个人信息</label><input class="urppp-feature-input" data-privacy-value="contact" maxlength="40" aria-label="联系和个人信息替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">学业信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-grade" type="checkbox" data-privacy-field="grade" aria-label="隐藏成绩"><label for="urppp-privacy-grade">成绩</label><input class="urppp-feature-input" data-privacy-value="grade" maxlength="40" aria-label="成绩替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-gpa" type="checkbox" data-privacy-field="gpa" aria-label="隐藏绩点"><label for="urppp-privacy-gpa">绩点</label><input class="urppp-feature-input" data-privacy-value="gpa" maxlength="40" aria-label="绩点替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-credit" type="checkbox" data-privacy-field="credit" aria-label="隐藏学分"><label for="urppp-privacy-credit">学分</label><input class="urppp-feature-input" data-privacy-value="credit" maxlength="40" aria-label="学分替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">页面内容</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-other" type="checkbox" data-privacy-field="other" aria-label="隐藏其他数据"><label for="urppp-privacy-other">其他数据</label><input class="urppp-feature-input" data-privacy-value="other" maxlength="40" aria-label="其他数据替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-schedule" type="checkbox" data-privacy-field="schedule" aria-label="隐藏课表"><label for="urppp-privacy-schedule">课表</label><input class="urppp-feature-input" data-privacy-value="schedule" maxlength="40" aria-label="课表替换内容"></div>','            <div class="urppp-privacy-field urppp-privacy-field-static"><input id="urppp-privacy-avatar" type="checkbox" data-privacy-field="avatar" aria-label="隐藏头像"><label for="urppp-privacy-avatar">头像</label><span class="urppp-privacy-note">使用统一遮罩</span></div>',"          </div>","        </div>","      </div>",'      <div class="urppp-direct-edit-control">',"        <div><strong>自由修改显示数据</strong><span>开启后，直接点击首页或清爽模式中带标记的数据进行修改</span></div>",'        <button type="button" class="urppp-set-follow" id="urppp-set-direct-edit-toggle" aria-pressed="false">页面内修改：关</button>',"      </div>","    </section>",'    <section class="urppp-set-sec" id="urppp-set-identity">',"      <h3>自定义姓名与头像</h3>",'      <div class="urppp-identity-editor">','        <div class="urppp-identity-fields">','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-name-enabled"> 自定义姓名</label><input class="urppp-feature-input" id="urppp-set-custom-name" maxlength="40" placeholder="输入显示姓名"></div>','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-avatar-enabled"> 自定义头像</label><input class="urppp-feature-input" id="urppp-set-custom-avatar-url" placeholder="https://... 图片地址"></div>','          <div class="urppp-feature-row"><label for="urppp-set-custom-avatar-file">本地图片</label><input class="urppp-feature-input" type="file" id="urppp-set-custom-avatar-file" accept="image/png,image/jpeg,image/webp,image/gif"></div>',"        </div>",'        <div class="urppp-identity-preview">','          <span class="urppp-identity-preview-label">头像预览</span>','          <div class="urppp-avatar-preview-shell"><span>未设置</span><img class="urppp-avatar-preview" id="urppp-set-avatar-preview" alt="自定义头像预览"></div>',"        </div>","      </div>",'      <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-privacy-save">保存隐私与显示设置</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-avatar-clear">清除自定义头像</button></div>','      <div class="urppp-set-tip" id="urppp-set-privacy-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-json-export">',"      <h3>JSON 导出格式</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-json-custom" aria-pressed="false" style="width:100%">自定义 JSON：关</button>','      <div class="urppp-json-mapping-editor" id="urppp-set-json-editor">','        <label for="urppp-set-json-mapping">字段映射</label>','        <textarea id="urppp-set-json-mapping" spellcheck="false" aria-label="自定义 JSON 字段映射"></textarea>','        <p class="urppp-set-tip">源字段包括 name、teacher、position、day、sections、weeks、code、credit、campus、building、classroom、weekList 等；目标值支持 data.courses 形式的嵌套路径。</p>','        <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-json-save">保存映射</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-json-reset">恢复默认映射</button></div>',"      </div>",'      <div class="urppp-set-tip" id="urppp-set-json-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-update">',"      <h3>更新</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-auto-update" aria-pressed="false" style="width:100%">自动检测更新：关</button>','      <button type="button" class="urppp-set-btn" id="urppp-set-check-update" style="margin-top:12px;width:100%">检查更新</button>','      <div id="urppp-set-update-status" class="urppp-set-tip" style="margin-top:8px"></div>',"    </section>",'    <div id="urppp-set-assist-slot"></div>',"  </div>",'  <div class="urppp-set-pane" data-pane="about">','    <div class="urppp-about">','      <img class="urppp-about-logo" id="urppp-about-logo" src="'+n+'" alt="SCU URP++" referrerpolicy="no-referrer" />','      <a class="urppp-about-ver" id="urppp-about-ver" href="'+c+'" target="_blank" rel="noopener noreferrer">SCU URP++ v'+d+"</a>",'      <p class="urppp-about-author">作者：Chao_Lan · Hanako</p>','      <p class="urppp-about-contact">QQ：2718748334</p>',`      <p class="urppp-about-msg">有任何问题欢迎及时反馈！
半夜Vibe有点爽怎么回事。</p>`,"    </div>","  </div>","</div>"].join("")}a(gp,"buildSettingsPanelHtml");var Zt="urppp_plugin_",Jl="1.0.0";function Ka({GM:p,doc:n,hostInfo:c,uiDeps:d}){let{getValue:u=a(()=>null,"getValue"),setValue:k=a(()=>{},"setValue"),xmlHttp:P,addStyle:S}=p||{},y=(typeof d=="function"?d:d&&d.openSubpanel)||null,A=new Map,g=new Map,w=new Map,T=[],C=null;function b(N,Y){let tt=w.get(N);tt&&tt.forEach(ht=>{try{ht(Y)}catch{}})}a(b,"emit");function m(N,Y){return w.has(N)||w.set(N,new Set),w.get(N).add(Y),()=>w.get(N).delete(Y)}a(m,"on");function v(N,Y){return u(`${Zt}${N}_${Y}`)}a(v,"storageGet");function x(N,Y,tt){k(`${Zt}${N}_${Y}`,tt)}a(x,"storageSet");function _(){return N=>({get:a(Y=>v(N,Y),"get"),set:a((Y,tt)=>x(N,Y,tt),"set"),remove:a(Y=>k(`${Zt}${N}_${Y}`,void 0),"remove")})}a(_,"storage");function q(N,Y={}){return new Promise((tt,ht)=>{if(typeof P!="function"){ht(new Error("GM_xmlhttpRequest 不可用（未授权跨域？）"));return}P({method:Y.method||"GET",url:N,headers:Y.headers||{},data:Y.data,timeout:Y.timeout||8e3,onload:a(bt=>bt.status>=200&&bt.status<300?tt(bt.responseText):ht(new Error(`HTTP ${bt.status}`)),"onload"),onerror:a(()=>ht(new Error("网络错误")),"onerror"),ontimeout:a(()=>ht(new Error("超时(8s)")),"ontimeout")})})}a(q,"request");async function I(N,Y){let tt=Array.isArray(N)?N:[N],ht=[];for(let bt=0;bt<tt.length;bt+=1){let Pt=tt[bt];Y&&Y({stage:"downloading",index:bt+1,total:tt.length,url:Pt});try{let yt=await q(Pt);return Y&&Y({stage:"downloaded",url:Pt,size:yt.length}),yt}catch(yt){ht.push(`源${bt+1}(${L(Pt)})失败: ${yt&&yt.message?yt.message:yt}`),Y&&Y({stage:"source_failed",index:bt+1,total:tt.length,error:yt&&yt.message?yt.message:yt})}}throw new Error("所有下载源失败 → "+ht.join(" ｜ "))}a(I,"fetchWithFallback");function L(N){try{return new URL(N).host}catch{return N}}a(L,"shortHost");function O(N){let Y=String(N||"").match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);return Y?N.replace(Y[0],""):N}a(O,"stripMetadata");function M(N,Y){try{let tt=O(N),ht=["GM_getValue","GM_setValue","GM_xmlhttpRequest","GM_registerMenuCommand","GM_addStyle","unsafeWindow"],bt=[typeof GM_getValue=="function"?GM_getValue:void 0,typeof GM_setValue=="function"?GM_setValue:void 0,typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:void 0,typeof GM_registerMenuCommand=="function"?GM_registerMenuCommand:void 0,typeof GM_addStyle=="function"?GM_addStyle:void 0,typeof unsafeWindow<"u"?unsafeWindow:null];return new Function(...ht,tt)(...bt),!0}catch(tt){return console.warn("[URP++ plugin] 注入失败",Y,tt),!1}}a(M,"inject");function H(N,Y){let tt=g.get(N);return tt?(tt.enabled=!!Y,k(`${Zt}${N}_enabled`,tt.enabled),b(Y?"enabled":"disabled",N),!0):!1}a(H,"setEnabled");function G(N){let Y=g.get(N);return!!Y&&Y.enabled}a(G,"isEnabled");function U(N){if(!N||!N.id)return!1;if(A.has(N.id)&&A.get(N.id).__urpppRegistered)return!0;let Y=Object.assign({type:"plugin"},N);Y.__urpppRegistered=!0,A.set(N.id,Y);let tt=g.get(N.id)||{loaded:!1,enabled:!1,version:N.version||""};return tt.version=Y.version||tt.version,g.set(N.id,tt),b("registered",Y.id),!0}a(U,"register");function rt(N){return A.get(N)||null}a(rt,"get");function it(N){let Y=[];for(let tt of A.values())(!N||tt.type===N)&&Y.push(tt);return Y}a(it,"list");function mt(N){let Y=g.get(N);return!!Y&&Y.loaded}a(mt,"loaded");async function V(N,Y,tt){tt&&tt({stage:"start",id:N});let ht=Array.isArray(Y)?Y:Y?[Y]:et(N),bt=await I(ht,tt);k(`${Zt}${N}_code`,bt),tt&&tt({stage:"injecting",id:N});let Pt=M(bt,N),yt=g.get(N)||{loaded:!1,enabled:!1,version:""};return yt.loaded=Pt,yt.enabled=Pt,yt.code=bt,yt.version=yt.version||Q(bt),g.set(N,yt),k(`${Zt}${N}_enabled`,Pt),b("loaded",N),Pt}a(V,"install");function Q(N){let Y=String(N||"").match(/@version\s+(\S+)/);return Y?Y[1]:""}a(Q,"detectVersion");async function at(N,Y,tt){let ht=Array.isArray(Y)?Y:Y?[Y]:et(N),bt=await I(ht,tt);k(`${Zt}${N}_code`,bt);let Pt=Q(bt),yt=g.get(N)||{loaded:!1,enabled:!1,version:""};return yt.version=Pt||yt.version,yt.code=bt,g.set(N,yt),b("updated",N),{ok:!0,version:Pt||yt.version}}a(at,"update");function X(N){let Y=u(`${Zt}${N}_code`);if(!Y)return!1;let tt=g.get(N);if(tt&&tt.loaded)return!0;let ht=M(Y,N),bt=g.get(N)||{loaded:!1,enabled:!1,version:Q(Y)};return bt.loaded=ht,bt.enabled=ht&&u(`${Zt}${N}_enabled`)!==!1,bt.code=Y,g.set(N,bt),b("loaded",N),ht}a(X,"bootFromCache");function ct(N){let Y=A.get(N);return A.delete(N),g.delete(N),k(`${Zt}${N}_enabled`,!1),b("unregistered",N),!!Y}a(ct,"unregister");function et(N){return N==="assist"?["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/plugins/urpppp.plugin.js","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js"]:[]}a(et,"pluginSource");let st={protocolVersion:Jl,register:U,unregister:ct,get:rt,list:it,loaded:mt,isEnabled:G,enable:a((N,Y=!0)=>H(N,Y),"enable"),disable:a(N=>H(N,!1),"disable"),install:V,update:at,bootFromCache:X,storage:a(()=>u&&{get:a(N=>u(N),"get"),set:a((N,Y)=>k(N,Y),"set")},"storage"),pluginStorage:a(N=>_()(N),"pluginStorage"),request:q,addStyle:a(N=>{try{S&&S(N)}catch{}},"addStyle"),log:a((...N)=>{console.log("[URP++ plugin]",...N)},"log"),on:m,emit:b,hostInfo:Object.assign({name:"SCU URP++"},c||{}),getSubpanel:a(()=>y,"getSubpanel")};try{window.__urpppPlugin=st}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppPlugin=st)}catch{}function ft(N){if(!N||!n||N.querySelector(".urppp-plugin-sec, .urpppp-entry-sec"))return;let Y=n.createElement("section");Y.className="urppp-set-sec urppp-plugin-sec",Y.id="urppp-plugin-sec",Y.innerHTML=`
      <h3>辅助插件</h3>
      <div class="urppp-plugin-status" id="urppp-plugin-status">检查中…</div>
      <div class="urppp-plugin-actions">
        <button type="button" class="urppp-set-btn" id="urppp-plugin-install">装载辅助插件</button>
        <button type="button" class="urppp-set-btn ghost" id="urppp-plugin-store">插件商店</button>
      </div>
      <div id="urppp-plugin-panels" style="margin-top:10px"></div>
      <div id="urppp-store-inline" class="urppp-store-inline" style="display:none"></div>
      <p class="urppp-set-tip" id="urppp-plugin-tip" style="margin-top:8px"></p>
    `,N.appendChild(Y);let tt=Y.querySelector("#urppp-plugin-status"),ht=Y.querySelector("#urppp-plugin-install"),bt=Y.querySelector("#urppp-plugin-store"),Pt=Y.querySelector("#urppp-plugin-panels"),yt=Y.querySelector("#urppp-plugin-tip");function Bt(){let Ct=g.get("assist"),$t=A.has("assist");Ct&&Ct.loaded||$t?(tt.textContent=`辅助插件 v${Ct&&Ct.version?Ct.version:rt("assist")&&rt("assist").version||""} 已装载`,tt.className="urppp-plugin-status ok",ht.textContent="重新装载",ht.dataset.state="loaded",yt.textContent="已装载。下方为扩展入口。"):(tt.textContent=C||"未装载",tt.className=C?"urppp-plugin-status err":"urppp-plugin-status",ht.textContent="装载辅助插件",ht.dataset.state="notloaded",yt.textContent=C?"装载失败，可就近重试或放回本地安装。下方为装载/商店入口。":"点击装载后，主插件会下载并注入辅助插件（登录助手/评教/会话保持/2FA），无需再单独安装。"),Pt.innerHTML="";let Xt=Et();if(Xt&&Object.keys(Xt).length){let zr=n.createElement("div");zr.className="urppp-plugin-sub",Object.keys(Xt).forEach(ur=>{let Yt=n.createElement("button");Yt.type="button",Yt.className="urppp-set-btn ghost",Yt.textContent=Xt[ur].label||ur,Yt.addEventListener("click",()=>{try{Xt[ur]&&typeof Xt[ur].open=="function"?Xt[ur].open():y&&y(ur)}catch{}}),zr.appendChild(Yt)}),Pt.appendChild(zr)}}a(Bt,"refresh"),ht.addEventListener("click",async()=>{ht.disabled=!0,ht.textContent="装载中…",tt.className="urppp-plugin-status",tt.textContent="正在开始装载…";try{if(await V("assist",null,$t=>{try{$t.stage==="downloading"?tt.textContent=`下载中… 源${$t.index}/${$t.total}（${L($t.url)}）`:$t.stage==="downloaded"?tt.textContent=`已下载（${$t.size} 字节），注入中…`:$t.stage==="source_failed"?tt.textContent=`源${$t.index}失败（${$t.error||""}），切换下一源…`:$t.stage==="injecting"?tt.textContent="注入中…":$t.stage==="start"&&(tt.textContent="正在开始装载…"),console.log("[URP++ plugin] assist 装载进度",$t)}catch{}}))C=null,tt.textContent="辅助插件已装载 v"+(rt("assist")&&rt("assist").version||""),console.log("[URP++ plugin] assist 装载成功");else throw new Error("注入失败")}catch(Ct){C="装载失败："+(Ct&&Ct.message?Ct.message:Ct),tt.textContent=C,tt.className="urppp-plugin-status err",console.warn("[URP++ plugin] assist 装载失败",Ct)}finally{ht.disabled=!1,Bt()}}),bt.addEventListener("click",()=>{y&&y("plugin-store")}),m("loaded",Ct=>{Ct==="assist"&&Bt()}),m("registered",Ct=>{Ct==="assist"&&Bt()}),m("unregistered",Ct=>{Ct==="assist"&&Bt()}),Bt()}a(ft,"renderAssistUi");function Z(N){return String(N??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}a(Z,"escapeHtml");function dt(N){if(N){if(kt(),N.dataset.rendered==="1"){N.style.display=N.style.display==="none"?"":"none";return}N.dataset.rendered="1",N.innerHTML=`
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
      </div>`,N.querySelectorAll(".urppp-store-tab").forEach(Y=>{Y.addEventListener("click",()=>{N.querySelectorAll(".urppp-store-tab").forEach(ht=>ht.className="urppp-store-tab"),Y.className="urppp-store-tab ac",N.querySelectorAll(".urppp-store-pane").forEach(ht=>ht.style.display="none");let tt=N.querySelector('.urppp-store-pane[data-pane="'+Y.dataset.tab+'"]');tt&&(tt.style.display="")})}),wt(N.querySelector("#urppp-store-manage-list")),N.style.display=""}}a(dt,"togglePluginStore");function kt(){if(n.getElementById("urppp-store-style"))return;let N=n.createElement("style");N.id="urppp-store-style",N.textContent=`
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
    `,(n.head||n.documentElement).appendChild(N)}a(kt,"ensureStoreStyle");function wt(N){if(!N)return;N.innerHTML="";let Y=Array.from(A.values());if(!Y.length){N.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}Y.forEach(tt=>{let ht=g.get(tt.id)||{},bt=n.createElement("div");bt.className="urppp-store-item";let Pt=n.createElement("div");Pt.className="urppp-store-info",Pt.innerHTML="<strong>"+Z(tt.name||tt.id)+'</strong><span class="urppp-store-ver">'+(tt.version?"v"+Z(tt.version):"")+'</span><span class="urppp-store-state'+(ht.loaded?" ok":"")+'">'+(ht.loaded?"已装载":"未装载")+"</span>";let yt=n.createElement("div");yt.className="urppp-store-ops";let Bt=n.createElement("button");Bt.type="button",Bt.textContent="重新装载",Bt.addEventListener("click",async()=>{Bt.disabled=!0,Bt.textContent="装载中…";try{let $t=await V(tt.id,null);Bt.textContent=$t?"已装载":"装载失败",b("loaded",tt.id)}catch{Bt.textContent="装载失败"}setTimeout(()=>{Bt.disabled=!1,Bt.textContent="重新装载"},1400)});let Ct=n.createElement("button");Ct.type="button",Ct.className="danger",Ct.textContent="卸载",Ct.addEventListener("click",()=>{ct(tt.id),k(`${Zt}${tt.id}_code`,""),k(`${Zt}${tt.id}_enabled`,!1),b("unregistered",tt.id),wt(N)}),yt.appendChild(Bt),yt.appendChild(Ct),bt.appendChild(Pt),bt.appendChild(yt),N.appendChild(bt)})}a(wt,"renderStoreManage");function Et(){let N={};return A.forEach(Y=>{if(Y.subpanels&&typeof Y.subpanels=="function"){let tt=Y.subpanels();Object.keys(tt||{}).forEach(ht=>{N[ht]=tt[ht]})}else Y.subpanels&&typeof Y.subpanels=="object"&&Object.keys(Y.subpanels).forEach(tt=>{N[tt]=Y.subpanels[tt]})}),N}return a(Et,"collectSubpanels"),{api:st,install:V,update:at,renderAssistUi:ft,openPluginStore:dt,bootFromCache:X,register:U}}a(Ka,"createPluginManager");function fp(p){let{document:n,getSettings:c,setSettings:d,validateMapping:u,defaultMapping:k,getRecoveryMessage:P=a(()=>"","getRecoveryMessage")}=p;function S(g,w,T){let C=g&&g.querySelector("#urppp-set-json-status");C&&(C.textContent=w||"",C.classList.toggle("urppp-status-error",!!T),C.style.color=T?"var(--danger,#b91c1c)":"var(--text-muted)")}a(S,"setStatus");function y(g,w){if(!g)return;let T=c(),C=g.querySelector("#urppp-set-json-custom"),b=g.querySelector("#urppp-set-json-editor"),m=g.querySelector("#urppp-set-json-mapping");C&&(C.classList.toggle("ac",T.enabled),C.setAttribute("aria-pressed",T.enabled?"true":"false"),C.textContent="自定义 JSON："+(T.enabled?"开":"关")),b&&(b.style.display=T.enabled?"grid":"none"),m&&(w||!g.__urpppJsonMappingDirty&&n.activeElement!==m)&&(m.value=JSON.stringify(T.mapping,null,2),g.__urpppJsonMappingDirty=!1);let v=P();v&&S(g,v,!0)}a(y,"sync");function A(g){if(!g||g.__urpppJsonSettingsBound)return;g.__urpppJsonSettingsBound=!0;let w=g.querySelector("#urppp-set-json-custom"),T=g.querySelector("#urppp-set-json-mapping"),C=g.querySelector("#urppp-set-json-save"),b=g.querySelector("#urppp-set-json-reset");T&&T.addEventListener("input",()=>{g.__urpppJsonMappingDirty=!0}),w&&w.addEventListener("click",()=>{let m=c();m.enabled=!m.enabled;let v=!!g.__urpppJsonMappingDirty;d(m),y(g,!1);let x=m.enabled?"已启用自定义 JSON 格式":"已恢复小爱课程兼容格式";S(g,v?x+"；未保存草稿已保留":x)}),C&&C.addEventListener("click",()=>{try{let m=JSON.parse(String(T&&T.value||"").trim()),v=c();v.mapping=u(m),d(v),g.__urpppJsonMappingDirty=!1,y(g,!0),S(g,"自定义 JSON 映射已保存")}catch(m){S(g,m&&m.message||String(m),!0)}}),b&&b.addEventListener("click",()=>{let m=c();m.mapping=u(k),d(m),g.__urpppJsonMappingDirty=!1,y(g,!0),S(g,"已恢复默认字段映射")})}return a(A,"bind"),{bind:A,setStatus:S,sync:y}}a(fp,"createJsonSettingsController");var ye="••••";var xp={name:{enabled:!1,replacement:"同学"},identity:{enabled:!0,replacement:"已隐藏"},organization:{enabled:!0,replacement:"已隐藏"},contact:{enabled:!0,replacement:"已隐藏"},grade:{enabled:!0,replacement:"已隐藏"},gpa:{enabled:!0,replacement:"••••"},credit:{enabled:!0,replacement:"••••"},other:{enabled:!0,replacement:"已隐藏"},avatar:{enabled:!0,replacement:""},schedule:{enabled:!1,replacement:"课表已隐藏"}},Vl=["completedCourses","failedCourses","majorGpa","majorPlan","remainingCourses","passingTotalCredit","passingAvgScore","passingAvgGpa","passingRequiredCredit","passingRequiredAvg","passingRequiredGpa","schemeTotalCredit","schemeAvgScore","schemeAvgGpa","schemeRequiredCredit","schemeRequiredAvg","schemeRequiredGpa"];function Za(p){let n=p&&typeof p=="object"?p:{},c=["off","one","custom"].includes(n.mode)?n.mode:"off",d={},u=n.fields&&typeof n.fields=="object"?n.fields:{},k=u.score&&typeof u.score=="object"?u.score:null;Object.keys(xp).forEach(g=>{let w=xp[g],T=["grade","gpa","credit"].includes(g)?k:null,C=g==="other"&&u.grade&&typeof u.grade=="object"?u.grade:null,b=u[g]&&typeof u[g]=="object"?u[g]:T||C||{};d[g]={enabled:g==="name"?!1:b.enabled==null?w.enabled:!!b.enabled,replacement:String(b.replacement==null?w.replacement:b.replacement).slice(0,80)}});let P=n.homepage&&typeof n.homepage=="object"?n.homepage:{},S=n.directEdit&&typeof n.directEdit=="object"?n.directEdit:P,y=S.values&&typeof S.values=="object"?S.values:{},A={};return Vl.forEach(g=>{A[g]=String(y[g]==null?"":y[g]).trim().slice(0,80)}),{mode:c,mask:ye,fields:d,directEdit:{enabled:!!S.enabled,values:A}}}a(Za,"normalizePrivacySettings");function ve(p){let n=p&&typeof p=="object"?p:{},c=String(n.avatar||"").trim();return{nameEnabled:!!n.nameEnabled,name:String(n.name||"").trim().slice(0,40),avatarEnabled:!!n.avatarEnabled,avatar:c.length<=3145728?c:"",avatarName:String(n.avatarName||"").trim().slice(0,120)}}a(ve,"normalizeCustomIdentity");function Zr(p){let n=String(p||"").trim();return n.length>3145728?"":/^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(n)?n:""}a(Zr,"validCustomAvatar");function Yl(p,n=globalThis.FileReader){return new Promise((c,d)=>{if(!p||!/^image\/(png|jpeg|webp|gif)$/i.test(p.type||"")){d(new Error("请选择 PNG、JPG、WebP 或 GIF 图片"));return}if(p.size>2*1024*1024){d(new Error("本地头像不能超过 2MB"));return}let u=new n;u.onload=()=>c(String(u.result||"")),u.onerror=()=>d(new Error("读取头像失败")),u.readAsDataURL(p)})}a(Yl,"readAvatarFile");function yp(p){let{getPrivacySettings:n,setPrivacySettings:c,getCustomIdentity:d,setCustomIdentity:u,applyDisplay:k,refreshCleanDisplay:P,finishActiveDirectEdit:S,readAvatar:y=Yl}=p;function A(b,m){let v=m.mode==="custom",x=b.querySelector(".urppp-direct-edit-control"),_=b.querySelector("#urppp-set-direct-edit-toggle");x&&(x.style.display=v?"flex":"none"),_&&(_.dataset.enabled=m.directEdit.enabled?"1":"0",_.classList.toggle("ac",m.directEdit.enabled),_.setAttribute("aria-pressed",m.directEdit.enabled?"true":"false"),_.textContent="页面内修改："+(m.directEdit.enabled?"开":"关"))}a(A,"syncDirectEdit");function g(b){if(!b)return;let m=n();b.querySelectorAll("[data-privacy-mode]").forEach(M=>{let H=M.getAttribute("data-privacy-mode")===m.mode;M.classList.toggle("ac",H),M.setAttribute("aria-pressed",H?"true":"false")});let v=b.querySelector("#urppp-set-privacy-custom");v&&(v.style.display=m.mode==="custom"?"grid":"none"),Object.keys(m.fields).forEach(M=>{let H=m.fields[M],G=b.querySelector('[data-privacy-field="'+M+'"]'),U=b.querySelector('[data-privacy-value="'+M+'"]');G&&(G.checked=!!H.enabled),U&&(U.value=H.replacement||"",U.disabled=!H.enabled)}),A(b,m);let x=d(),_=b.querySelector("#urppp-set-name-enabled"),q=b.querySelector("#urppp-set-custom-name"),I=b.querySelector("#urppp-set-avatar-enabled"),L=b.querySelector("#urppp-set-custom-avatar-url"),O=b.querySelector("#urppp-set-avatar-preview");if(_&&(_.checked=x.nameEnabled),q&&(q.value=x.name,q.disabled=!x.nameEnabled),I&&(I.checked=x.avatarEnabled),L&&(L.value=/^data:image\//i.test(x.avatar)?"":x.avatar,L.disabled=!x.avatarEnabled),b.__urpppAvatarSource=x.avatar,O){let M=Zr(x.avatar);O.style.display=M?"block":"none",M?O.src=M:O.removeAttribute("src")}}a(g,"sync");function w(b){let m=n();Object.keys(m.fields).forEach(x=>{let _=b.querySelector('[data-privacy-field="'+x+'"]'),q=b.querySelector('[data-privacy-value="'+x+'"]');_&&(m.fields[x].enabled=!!_.checked),q&&(m.fields[x].replacement=String(q.value||"").trim().slice(0,80))});let v=b.querySelector("#urppp-set-direct-edit-toggle");return m.directEdit.enabled=!!(v&&v.dataset.enabled==="1"),m}a(w,"collect");function T(b,m,v){let x=b&&b.querySelector("#urppp-set-privacy-status");x&&(x.textContent=m||"",x.style.color=v?"#b91c1c":"var(--text-muted)")}a(T,"setStatus");function C(b){if(!b||b.__urpppPrivacyBound)return;b.__urpppPrivacyBound=!0,b.querySelectorAll("[data-privacy-mode]").forEach(L=>{L.addEventListener("click",()=>{let O=n();O.mode=L.getAttribute("data-privacy-mode")||"off",c(O),g(b),k()})}),b.querySelectorAll("[data-privacy-field]").forEach(L=>{L.addEventListener("change",()=>{let O=L.getAttribute("data-privacy-field"),M=b.querySelector('[data-privacy-value="'+O+'"]');M&&(M.disabled=!L.checked)})});let m=b.querySelector("#urppp-set-direct-edit-toggle");m&&m.addEventListener("click",()=>{let L=m.dataset.enabled!=="1";m.dataset.enabled=L?"1":"0",m.classList.toggle("ac",L),m.setAttribute("aria-pressed",L?"true":"false"),m.textContent="页面内修改："+(L?"开":"关")});let v=b.querySelector("#urppp-set-name-enabled"),x=b.querySelector("#urppp-set-avatar-enabled");v&&v.addEventListener("change",()=>{let L=b.querySelector("#urppp-set-custom-name");L&&(L.disabled=!v.checked)}),x&&x.addEventListener("change",()=>{let L=b.querySelector("#urppp-set-custom-avatar-url");L&&(L.disabled=!x.checked)});let _=b.querySelector("#urppp-set-custom-avatar-file");_&&_.addEventListener("change",async()=>{try{let L=await y(_.files&&_.files[0]);b.__urpppAvatarSource=L;let O=b.querySelector("#urppp-set-avatar-preview");O&&(O.src=L,O.style.display="block"),x&&(x.checked=!0),T(b,"本地头像已读取，点击保存后生效")}catch(L){T(b,L&&L.message||String(L),!0)}});let q=b.querySelector("#urppp-set-avatar-clear");q&&q.addEventListener("click",()=>{try{let L=d();L.avatarEnabled=!1,L.avatar="",L.avatarName="",u(L),b.__urpppAvatarSource="",g(b),k(),P(),T(b,"已清除自定义头像")}catch(L){T(b,L&&L.message||"清除自定义头像失败",!0)}});let I=b.querySelector("#urppp-set-privacy-save");I&&I.addEventListener("click",()=>{let L=n(),O=d();try{let M=w(b),H=b.querySelector("#urppp-set-custom-avatar-url"),U=String(H&&H.value||"").trim()||b.__urpppAvatarSource||"",rt=ve({nameEnabled:!!(v&&v.checked),name:String(b.querySelector("#urppp-set-custom-name")?.value||"").trim(),avatarEnabled:!!(x&&x.checked),avatar:U,avatarName:O.avatarName});if(rt.avatarEnabled&&!Zr(rt.avatar))throw new Error("头像地址必须是 http(s) 图片或已选择的本地图片");L.directEdit.enabled&&!M.directEdit.enabled&&S(!0);try{u(rt),c(M)}catch(it){try{u(O),c(L)}catch{}throw it}k(),P(),g(b),T(b,"隐私与显示设置已保存")}catch(M){T(b,M&&M.message||String(M),!0)}})}return a(C,"bind"),{bind:C,collect:w,setStatus:T,sync:g}}a(yp,"createPrivacySettingsController");function vp(p){let{document:n,theme:c,preferences:d,accent:u,syncPanel:k}=p;function P(){c.getFollowSystem()?c.apply(c.resolveFollowTheme(),{system:!0}):c.apply("scu-red",{manual:!0})}a(P,"applyAccentTheme");function S(A,g){let w=A.querySelector("#urppp-set-schemes");if(!w)return;let T=u.getScheme();w.innerHTML="",u.listSchemePreviews(g).forEach(C=>{let b=n.createElement("button");b.type="button",b.className="urppp-set-scheme"+(C.id===T?" ac":""),b.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+C.bg+'"></span>','  <span style="background:'+C.surface+";border-color:"+C.border+'"></span>','  <span style="background:'+C.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+C.name+"</strong>","  <em>"+C.desc+"</em>","</div>"].join(""),b.addEventListener("click",()=>{u.setAccent(g),u.setScheme(C.id),P(),k()}),w.appendChild(b)})}a(S,"renderSchemeChoices");function y(A){A.querySelectorAll(".urppp-set-mode").forEach(L=>{L.addEventListener("click",()=>{c.isModeAvailable(L.dataset.theme)&&(c.apply(L.dataset.theme,{manual:!0}),k())})});let g=A.querySelector("#urppp-set-follow");g&&g.addEventListener("click",()=>{if(!c.supportsDark())return;let L=!c.getFollowSystem();c.setFollowSystem(L),L?c.apply(c.resolveFollowTheme(),{system:!0}):c.apply(c.getCurrent(),{manual:!0}),k(),c.syncNavbar()});let w=A.querySelector("#urppp-set-follow-dynamic");w&&w.addEventListener("click",()=>{c.supportsDynamic()&&(c.getFollowSystem()?c.setFollowDynamic(!c.getFollowDynamic()):(c.setFollowSystem(!0),c.setFollowDynamic(!0)),c.apply(c.resolveFollowTheme(),{system:!0}),k(),c.syncNavbar())});let T=A.querySelector("#urppp-set-clean-default");T&&T.addEventListener("click",()=>{d.setCleanDefault(!d.getCleanDefault()),k()});let C=A.querySelector("#urppp-set-clean-analysis");C&&C.addEventListener("click",()=>{let L=d.getCleanAnalysis()==="direct";d.setCleanAnalysis(L?"tab":"direct"),k()});let b=A.querySelector("#urppp-set-apple-edge");b&&b.addEventListener("click",()=>{d.setAppleEdge(!d.getAppleEdge());try{d.applySkin()}catch{}k()});let m=A.querySelector("#urppp-set-auto-update");m&&m.addEventListener("click",()=>{d.setAutoUpdate(!d.getAutoUpdate()),k()});let v=A.querySelector("#urppp-set-check-update");v&&!v.__urpppBound&&(v.__urpppBound=!0,v.addEventListener("click",()=>{d.checkUpdates()}));let x=A.querySelector("#urppp-set-color"),_=A.querySelector("#urppp-set-hex");if(!x||!_)return;x.addEventListener("input",()=>{_.value=x.value.toUpperCase()}),_.addEventListener("change",()=>{let L=u.normalize(_.value);L&&(_.value=L,x.value=L)});let q=A.querySelector("#urppp-set-gen");q&&q.addEventListener("click",()=>{let L=u.normalize(_.value)||x.value;L&&(u.setAccent(u.normalize(L)),P(),k())});let I=A.querySelector("#urppp-set-save");I&&I.addEventListener("click",()=>{let L=u.normalize(_.value)||x.value;L&&(u.savePreset(L),u.setAccent(u.normalize(L)),P(),k())}),x.addEventListener("change",()=>{let L=u.normalize(x.value);L&&(_.value=L,S(A,L))})}return a(y,"bind"),{bind:y,renderSchemeChoices:S}}a(vp,"createThemeSettingsController");function wp(p,n){let{seed:c,currentTheme:d,followSystem:u,skinId:k,darkSupported:P,dynamicSupported:S,fixedPalettes:y,followUseDynamic:A,cleanDefault:g,cleanAnalysis:w,appleEdge:T,autoUpdate:C,modeAvailability:b}=n,m=p.querySelector("#urppp-set-color"),v=p.querySelector("#urppp-set-hex");m&&(m.value=c),v&&(v.value=c),p.querySelectorAll(".urppp-set-mode").forEach(U=>{let rt=U.dataset.theme,it=b[rt]!==!1,mt=!u&&rt===d&&it;U.disabled=!it,U.classList.toggle("ac",mt),U.classList.toggle("urppp-dyn-disabled",!it),U.setAttribute("aria-disabled",it?"false":"true"),it?U.removeAttribute("title"):U.title=rt==="dark"?"当前界面风格不支持暗色模式":"当前界面风格不支持动态配色"});let x=p.querySelector("#urppp-set-follow");x&&(x.disabled=!P,x.classList.toggle("ac",u&&P),x.classList.toggle("urppp-dyn-disabled",!P),x.setAttribute("aria-pressed",u&&P?"true":"false"),x.textContent=u&&P?"跟随系统：开":"跟随系统：关",x.title=P?"":"当前界面风格不支持暗色模式");let _=p.querySelector("#urppp-set-follow-dynamic");_&&(_.classList.toggle("ac",A&&S),_.setAttribute("aria-pressed",A&&S?"true":"false"),_.textContent=A?"浅色用动态配色：开":"浅色用动态配色：关",_.disabled=!u||!S,_.classList.toggle("urppp-dyn-disabled",!S),_.style.opacity=S&&u?"1":"0.5",_.title=S?"":"当前界面风格不支持动态配色");let q=p.querySelector("#urppp-set-dynamic");q&&(q.style.display=S?"":"none",q.style.opacity="1",q.classList.toggle("urppp-dyn-disabled",!1),q.querySelectorAll("button, input, .urppp-set-scheme, .urppp-set-swatch").forEach(U=>{U.disabled=!1,U.classList.toggle("urppp-dyn-disabled",!1)}),q.querySelectorAll("h3, .urppp-set-tip, label").forEach(U=>{U.classList.toggle("urppp-dyn-disabled",!1)}));let I=p.querySelector("#urppp-set-brutal");I&&(I.style.display=y?"":"none");let L=p.querySelector("#urppp-set-clean-default");L&&(L.classList.toggle("ac",g),L.setAttribute("aria-pressed",g?"true":"false"),L.textContent=g?"默认进入清爽模式：开":"默认进入清爽模式：关");let O=p.querySelector("#urppp-set-clean-analysis");if(O){let U=w==="direct";O.classList.toggle("ac",U),O.setAttribute("aria-pressed",U?"true":"false"),O.textContent=U?"清爽成绩分析展示：直接显示":"清爽成绩分析展示：选项卡"}let M=p.querySelector("#urppp-set-apple-edge"),H=p.querySelector("#urppp-set-apple-edge-tip");if(M){let U=k==="apple";M.style.display=U?"":"none",H&&(H.style.display=U?"":"none"),U&&(M.classList.toggle("ac",T),M.setAttribute("aria-pressed",T?"true":"false"),M.textContent=T?"类Apple边缘线条：开":"类Apple边缘线条：关")}let G=p.querySelector("#urppp-set-auto-update");G&&(G.classList.toggle("ac",C),G.setAttribute("aria-pressed",C?"true":"false"),G.textContent=C?"自动检测更新：开":"自动检测更新：关")}a(wp,"syncThemeSettingsControls");function to(p){let n=String(p||"").replace(/\s+/g,"");return/^[•·●○▪◆★\-–]$/.test(n)||/^\d{1,4}$/.test(n)}a(to,"isNoticeBulletText");function Ql(p){return/\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(p||""))}a(Ql,"isNoticeDateText");function kp({pathname:p="",href:n="",title:c="",headingText:d=""}={}){return/courseSelectNotice|evaluationNotice|notice\/index/i.test(`${p} ${n}`)?!0:/评估公告|通知公告|选课公告|公告|通知/.test(`${c} ${d}`)}a(kp,"isNoticePageContext");function ro(p,{noticePage:n=!1}={}){if(!p)return!1;let d=(p.querySelector("thead")?.textContent||"").replace(/\s+/g,"");if(/标题/.test(d)&&/发布时间|发布日期|日期|时间/.test(d)||n&&/标题|公告|通知/.test(d)&&!/教室|教学楼|课程号|成绩|学号|座位数/.test(d))return!0;let u=p.querySelectorAll("tbody tr, tr"),k=0;if(u.forEach(S=>{let y=S.querySelectorAll("td");y.length<2||y.length>4||to(y[0].textContent)&&S.querySelector("a")&&Ql(S.textContent)&&(k+=1)}),k<1)return!1;if(n||k===u.length)return!0;let P=p.getAttribute("style")||"";return/dashed/i.test(P)||p.classList.contains("no-border-top")||!!p.getAttribute("width")}a(ro,"isNoticeListTable");function Ap(p,{noticePage:n=!1}={}){if(!p)return!0;if(p.classList?.contains("urppp-notice-table")||ro(p,{noticePage:n}))return!1;let c=`${p.id||""} ${p.getAttribute("class")||""}`;if(/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(c)||p.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]'))return!0;let d=p.querySelector("tbody tr, tr");if(d&&d.querySelectorAll("td,th").length>=5)return!0;let k=(p.querySelector("thead")?.textContent||"").replace(/\s+/g,"");return!!(k&&(/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(k)||/序号/.test(k)&&!/标题|公告|通知|发布时间/.test(k))||p.querySelector("a")&&/课表|教室信息|查看/.test(p.textContent||"")&&!n&&/座位数|教学楼|教室号|校区名/.test(p.textContent||""))}a(Ap,"isBusinessDataTable");function Sp({isNativePdfIsolationActive:p,isBusinessDataTable:n,documentRef:c=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,getComputedStyleRef:k=getComputedStyle}){function P(){p()||c.querySelectorAll("table.table, table.table-bordered, table.dataTable").forEach(y=>{if(!y||y.closest(".urppp-table-wrap")||y.id==="courseTable"||y.closest(".modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal")||y.classList.contains("urppp-wrs-table")||y.classList.contains("urppp-notice-table"))return;n(y);let A=y.parentElement;if(!A)return;let g=A.style?.overflow||k(A).overflow;if(A.id?.endsWith("_scroll")||g==="auto"||g==="scroll"){A.classList.add("urppp-scroll-table-host");return}let T=c.createElement("div");T.className="urppp-table-wrap",A.insertBefore(T,y),T.appendChild(y)})}a(P,"wrapTables");function S(){let y=c.getElementById("page-content-template")||c.querySelector(".page-content")||c.body;if(!y)return;let A=d.__urpppTableObsRoot;if(d.__urpppTableObs&&A===y&&y.isConnected)return;d.__urpppTableObs&&d.__urpppTableObs.disconnect();let g=0,w=new u(()=>{clearTimeout(g),g=setTimeout(P,80)});w.observe(y,{childList:!0,subtree:!0}),d.__urpppTableObs=w,d.__urpppTableObsRoot=y}return a(S,"bindTableWrapObserver"),{bindTableWrapObserver:S,wrapTables:P}}a(Sp,"createTableWrapper");function _p(p){let n=String(p||"").trim().toLowerCase();if(!n||n==="transparent"||n==="inherit"||n==="initial")return!1;if(/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(n))return!0;let c=n.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);if(!c)return!1;let d=Number(c[1]),u=Number(c[2]),k=Number(c[3]);return(d+u+k)/3>=200}a(_p,"isLightInlineColor");function Xl(p){if(!p?.style)return;let n=p.getAttribute("style")||"";if(!n||!/background/i.test(n))return;let c=p.style.backgroundColor||p.style.background||"";(_p(c)||/background(-color|-image)?\s*:/i.test(n))&&(p.style.removeProperty("background"),p.style.removeProperty("background-color"),p.style.removeProperty("background-image")),["borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"].forEach(d=>{let u=p.style[d];!u||!_p(u)||p.style.removeProperty(d.replace(/[A-Z]/g,k=>`-${k.toLowerCase()}`))}),/border(-color)?\s*:/i.test(n)&&/#e6e6e6|#eee|#ddd|#ccc/i.test(n)&&(p.style.removeProperty("border-color"),p.style.removeProperty("border-top-color"),p.style.removeProperty("border-right-color"),p.style.removeProperty("border-bottom-color"),p.style.removeProperty("border-left-color"))}a(Xl,"scrubLightInlineBackground");function Ep({isNativePdfIsolationActive:p,documentRef:n=document,windowRef:c=window,MutationObserverRef:d=MutationObserver}){function u(){if(!p())try{let P=n.documentElement.classList.contains("urppp-theme-dark"),S=n.body?.classList.contains("urppp-dark");if(!P&&!S)return;n.querySelectorAll("table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th").forEach(Xl)}catch{}}a(u,"scrubTableHeaderInlineBg");function k(){[0,200,800,1600].forEach(P=>setTimeout(()=>{try{u()}catch{}},P));try{let P=n.querySelector(".page-content, #page-content-template, .main-content")||n.body;if(!P)return;let S=c.__urpppTableScrubObs;if(S&&S.root===P&&P.isConnected)return;S?.observer&&S.observer.disconnect();let y=new d(()=>{clearTimeout(c.__urpppTableScrubTimer),c.__urpppTableScrubTimer=setTimeout(()=>{try{u()}catch{}},120)});y.observe(P,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),c.__urpppTableScrubObs={root:P,observer:y}}catch{}}return a(k,"scheduleScrubTableInlineBg"),{scheduleScrubTableInlineBg:k,scrubTableHeaderInlineBg:u}}a(Ep,"createTableInlineStyleScrubber");function Cp({beautifyPagebar:p,documentRef:n=document,windowRef:c=window,MutationObserverRef:d=MutationObserver,setTimeoutRef:u=setTimeout,clearTimeoutRef:k=clearTimeout}){function P(){p(),n.querySelectorAll("#urppagebar").forEach(y=>{if(y.__urpppPagebarObs)return;y.__urpppPagebarObs=!0,new d(()=>{k(c.__urpppPagebarTimer),c.__urpppPagebarTimer=u(()=>p(y.parentElement||n),150)}).observe(y,{childList:!0,subtree:!0})})}a(P,"run");function S(){if(c.__urpppPagebarBound){u(P,0);return}c.__urpppPagebarBound=!0,[0,300,1e3,2500].forEach(y=>u(P,y))}return a(S,"scheduleBeautifyPagebar"),{scheduleBeautifyPagebar:S}}a(Cp,"createPagebarLifecycle");function Pp({destroyPagebarChosen:p,documentRef:n=document,logger:c=console}){function d(u){try{(u?.querySelectorAll?u.querySelectorAll("#urppagebar"):n.querySelectorAll("#urppagebar")).forEach(P=>{if(!P)return;P.classList.add("urppp-pagebar"),P.style.setProperty("display","block","important"),P.style.setProperty("width","100%","important"),P.style.setProperty("line-height","1.5","important");let S=P.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]')||P,y=Array.from(P.querySelectorAll('[id^="span_page_txt_"]')).map(b=>String(b.textContent||"").trim()).join(""),A=P.querySelector('select[id^="pagination_pageSize_"]'),g=A?String(A.value||""):"",w=P.querySelector('[id^="turnpageto_"]'),T=!!(w&&(w.readOnly||w.hasAttribute("readonly")));if(!(y.includes("转到")&&!T&&!g.includes("_"))){P.classList.add("urppp-pagebar-scroll"),P.classList.remove("urppp-pagebar-jump"),P.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach(b=>{b.style.setProperty("display","none","important")}),P.querySelectorAll("select").forEach(b=>{p(b),b.style.setProperty("width","128px","important"),b.style.setProperty("min-width","128px","important"),b.style.setProperty("max-width","128px","important")}),P.querySelectorAll(".chosen-container").forEach(b=>{try{b.style.setProperty("display","none","important")}catch{}});return}P.classList.add("urppp-pagebar-jump"),P.classList.remove("urppp-pagebar-scroll"),S.style.setProperty("display","flex","important"),S.style.setProperty("align-items","center","important"),S.style.setProperty("flex-wrap","wrap","important"),S.style.setProperty("gap","8px","important"),S.style.setProperty("position","relative","important"),S.style.setProperty("line-height","1.5","important"),P.querySelectorAll("ul.pagination").forEach(b=>{b.classList.add("urppp-pagination"),b.style.cssText=["display:inline-flex !important","align-items:center !important","flex-wrap:wrap !important","gap:4px !important","margin:0 !important","padding:0 !important","list-style:none !important","float:none !important","position:static !important"].join(";")}),P.querySelectorAll("ul.pagination > li").forEach(b=>{let m=b.classList.contains("active"),v=b.classList.contains("disabled"),x=b.classList.contains("previous")||/previous/i.test(b.getAttribute("name")||""),_=b.classList.contains("next")||/next/i.test(b.getAttribute("name")||"");b.classList.add("urppp-page-li"),m&&b.classList.add("urppp-page-li-active"),v&&b.classList.add("urppp-page-li-disabled"),x&&b.classList.add("urppp-page-li-prev"),_&&b.classList.add("urppp-page-li-next"),b.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","float:none !important","position:static !important","margin:0 !important","padding:0 !important","list-style:none !important","border:none !important","background:transparent !important","height:auto !important","min-height:0 !important"].join(";");let q=b.querySelector(":scope > span, :scope > a")||b.firstElementChild;if(!q)return;q.classList.add("urppp-page-chip"),m&&q.classList.add("urppp-page-chip-active"),v&&q.classList.add("urppp-page-chip-disabled"),(x||_)&&q.classList.add("urppp-page-chip-nav");let I=x||_?"72px":"40px",L=m?"var(--pagination-active-bg, var(--primary))":"var(--surface)",O=m?"var(--pagination-active-border, var(--primary))":"var(--border)",M=m?"var(--pagination-active-foreground, var(--primary-foreground, #fff))":v?"var(--text-muted)":"var(--text)";q.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","box-sizing:border-box !important","float:none !important","position:static !important","width:auto !important",`min-width:${I} !important`,"height:36px !important","min-height:36px !important","max-height:36px !important","padding:0 12px !important","margin:0 !important","line-height:36px !important","font-size:14px !important","font-weight:600 !important","border-radius:8px !important",`border:1px solid ${O} !important`,`background:${L} !important`,`color:${M} !important`,"box-shadow:none !important","text-decoration:none !important",`cursor:${v?"default":"pointer"} !important`,"white-space:nowrap !important","overflow:hidden !important"].join(";")}),P.querySelectorAll('[id^="btn_turnpageto_"]').forEach(b=>{b.classList.add("urppp-page-confirm"),b.style.setProperty("position","static","important"),b.style.setProperty("left","auto","important"),b.style.setProperty("top","auto","important"),b.style.setProperty("float","none","important"),b.style.setProperty("height","32px","important"),b.style.setProperty("min-width","52px","important"),b.style.setProperty("padding","0 12px","important"),b.style.setProperty("margin","0 4px","important"),b.style.setProperty("font-size","13px","important"),b.style.setProperty("line-height","1","important"),b.style.setProperty("vertical-align","middle","important")}),P.querySelectorAll('[id^="turnpageto_"]').forEach(b=>{b.classList.add("urppp-page-goto"),b.style.setProperty("position","static","important"),b.style.setProperty("display","inline-block","important"),b.style.setProperty("height","32px","important"),b.style.setProperty("width","48px","important"),b.style.setProperty("margin","0 4px","important"),b.style.setProperty("padding","4px 8px","important"),b.style.setProperty("font-size","14px","important"),b.style.setProperty("line-height","1.2","important"),b.style.setProperty("box-sizing","border-box","important"),b.style.setProperty("vertical-align","middle","important");let m=b.parentElement;m?.tagName==="SPAN"&&(m.style.setProperty("position","static","important"),m.style.setProperty("display","inline-flex","important"),m.style.setProperty("align-items","center","important"),m.style.setProperty("width","auto","important"),m.style.setProperty("height","auto","important"),m.style.setProperty("min-height","0","important"),m.style.setProperty("vertical-align","middle","important"))}),P.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach(b=>{b.style.setProperty("display","inline","important"),b.style.setProperty("border","none","important"),b.style.setProperty("background","transparent","important"),b.style.setProperty("padding","0","important"),b.style.setProperty("margin","0","important"),b.style.setProperty("height","auto","important"),b.style.setProperty("line-height","1.5","important"),b.style.setProperty("font-size","13px","important"),b.style.setProperty("color","var(--text-secondary, var(--text-muted))","important")})})}catch(k){c.warn("[URP++] pagebar beautify failed",k)}}return a(d,"beautifyPagebar"),{beautifyPagebar:d}}a(Pp,"createPagebarBeautifier");function zp({beautifyNoticeTables:p,pinNoticeRowSurface:n,documentRef:c=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,requestAnimationFrameRef:k=requestAnimationFrame,setTimeoutRef:P=setTimeout,clearTimeoutRef:S=clearTimeout}){function y(){d.__urpppNoticeHoverScrub||(d.__urpppNoticeHoverScrub=!0,c.addEventListener("mouseout",g=>{let w=g.target?.closest?g.target.closest("table.urppp-notice-table tr.urppp-notice-row"):null;w&&k(()=>n(w))},!0))}a(y,"bindNoticeHoverScrub");function A(){[0,400,1500].forEach(g=>P(()=>{try{p()}catch{}},g));try{let g=c.getElementById("page-content-template")||c.querySelector(".page-content, .main-content")||c.body;if(!g)return;let w=d.__urpppNoticeObs;if(w&&w.root===g&&g.isConnected)return;w?.observer&&w.observer.disconnect();let T=new u(()=>{S(d.__urpppNoticeTimer),d.__urpppNoticeTimer=P(()=>{try{p()}catch{}},180)});T.observe(g,{childList:!0,subtree:!0}),d.__urpppNoticeObs={root:g,observer:T}}catch{}}return a(A,"scheduleBeautifyNoticeTables"),{bindNoticeHoverScrub:y,scheduleBeautifyNoticeTables:A}}a(zp,"createNoticeTableLifecycle");function Lp({getCurrentTheme:p,documentRef:n=document,getComputedStyleRef:c=getComputedStyle}){function d(){try{return c(n.documentElement).getPropertyValue("--surface").trim()||(p()==="dark"?"#151A24":"#FFFFFF")}catch{return p()==="dark"?"#151A24":"#FFFFFF"}}a(d,"noticeSurfaceColor");function u(y){if(!y?.classList?.contains("urppp-notice-row"))return;let A=d();y.classList.remove("hover"),y.style.setProperty("background",A,"important"),y.style.setProperty("background-color",A,"important"),y.querySelectorAll("td, th").forEach(g=>{g.classList.remove("hover"),g.style.setProperty("background","transparent","important"),g.style.setProperty("background-color","transparent","important")})}a(u,"pinNoticeRowSurface");function k(y){try{let A=y||n;if(A.matches?.("tr.urppp-notice-row")){u(A);return}A.querySelectorAll("table.urppp-notice-table tr.urppp-notice-row").forEach(u)}catch{}}a(k,"scrubNoticeInlineBg");function P(y){y&&(y.classList.remove("table-hover","table-striped"),y.classList.add("urppp-notice-nohover"),y.querySelectorAll("tr.urppp-notice-row").forEach(A=>{A.classList.remove("hover"),u(A)}))}a(P,"disarmNoticeTableHover");function S(y){if(!y)return;y.classList.remove("urppp-notice-table"),delete y.dataset.urpppNoticeScan,y.style.removeProperty("border"),y.style.removeProperty("border-left"),y.style.removeProperty("background");let A=y.closest(".urppp-table-wrap.urppp-notice-wrap");A&&(A.classList.remove("urppp-notice-wrap"),A.style.removeProperty("border"),A.style.removeProperty("background"),A.style.removeProperty("box-shadow"),A.style.removeProperty("overflow"),A.style.removeProperty("border-radius")),y.querySelectorAll("tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card").forEach(g=>{g.classList.remove("urppp-notice-row","urppp-notice-title-cell","urppp-notice-date-cell","urppp-notice-bullet-cell","urppp-notice-link","urppp-notice-time","urppp-notice-card","urppp-notice-card-row","urppp-notice-main","urppp-notice-meta","urppp-notice-title","urppp-notice-body"),(g.tagName==="TR"||g.tagName==="TD")&&["display","border","background","padding","margin","width","box-shadow","border-radius","float","position"].forEach(w=>{g.style.getPropertyPriority(w)==="important"&&g.style.removeProperty(w)}),delete g.dataset.urpppNoticeDone})}return a(S,"stripMistakenNoticeTable"),{disarmNoticeTableHover:P,pinNoticeRowSurface:u,scrubNoticeInlineBg:k,stripMistakenNoticeTable:S}}a(Lp,"createNoticeTableSurface");function qp({isNativePdfIsolationActive:p,bindNoticeHoverScrub:n,scrubNoticeInlineBg:c,stripMistakenNoticeTable:d,disarmNoticeTableHover:u,pinNoticeRowSurface:k,isBusinessDataTable:P,isNoticeListTable:S,isNoticePageContext:y,isNoticeBulletText:A,documentRef:g=document,windowRef:w=window,logger:T=console}){function C(){if(!p())try{n(),c(),g.querySelectorAll("table.urppp-notice-table, table.table").forEach(m=>{P(m)&&(m.classList.contains("urppp-notice-table")||m.querySelector(".urppp-notice-row, .urppp-notice-title-cell"))&&d(m)});let b=new Set(g.querySelectorAll('.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'));y()?g.querySelectorAll("table").forEach(m=>b.add(m)):g.querySelectorAll("table").forEach(m=>{S(m)&&b.add(m)}),Array.from(b).forEach(m=>{if(!m||P(m))return;if(m.querySelector("thead th")&&m.querySelectorAll("thead th").length>=3){let L=m.querySelector("thead")?.textContent||"";if(!S(m)&&/序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(L)&&!/标题|公告|通知/.test(L))return}let v=Array.from(m.querySelectorAll("tbody > tr, tr")).filter(L=>L.querySelector("td"));if(!v.length)return;let x=0;v.slice(0,12).forEach(L=>{let O=Array.from(L.children).filter(rt=>rt.tagName==="TD"||rt.tagName==="TH");if(O.length>=5)return;let M=(L.textContent||"").replace(/\s+/g," ").trim(),H=!!L.querySelector("a[href], a[onclick], a"),G=/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(M),U=O.some(rt=>A(rt.textContent));(H&&G||U&&H||U&&G)&&(x+=1)});let _=m.classList.contains("no-border-top")||/dashed|border-left-style/.test(m.getAttribute("style")||""),q=y();if(x<1){if(q){if(v.slice(0,8).filter(O=>{let M=Array.from(O.children).filter(G=>G.tagName==="TD"||G.tagName==="TH");if(M.length<1||M.length>4)return!1;let H=(O.textContent||"").replace(/\s+/g," ").trim();return!!O.querySelector("a")||/\d{4}/.test(H)}).length<1&&!_)return}else if(!(_&&/公告|通知/.test(g.title||"")))return}if(P(m))return;m.classList.add("urppp-notice-table"),m.dataset.urpppNoticeScan="1",u(m),m.style.setProperty("border","none","important"),m.style.setProperty("border-left","none","important"),m.style.setProperty("background","transparent","important"),m.style.setProperty("width","100%","important");let I=m.closest(".urppp-table-wrap");I&&(I.classList.add("urppp-notice-wrap"),I.style.setProperty("border","none","important"),I.style.setProperty("background","transparent","important"),I.style.setProperty("box-shadow","none","important"),I.style.setProperty("overflow","visible","important"),I.style.setProperty("border-radius","0","important")),v.forEach(L=>{if(L.dataset.urpppNoticeDone==="1")return;let O=Array.from(L.children).filter(V=>V.tagName==="TD"||V.tagName==="TH");if(!O.length)return;let M=a(V=>(V||"").replace(/\u00AD/g,"").replace(/\u200B/g,"").replace(/\s+/g," ").trim(),"clean");if(O.length>=2){let V=null,Q=null,at=null;if(O.forEach((X,ct)=>{let et=M(X.textContent),st=!!X.querySelector("a");if(!V&&A(et)&&(ct===0||O.length>=2)){V=X;return}if(!at&&(/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(et)||/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(et)||/text-align\s*:\s*right/i.test(X.getAttribute("style")||"")||ct===O.length-1&&et.length<=28&&/\d{4}/.test(et))&&/\d{4}/.test(et)&&et.length<=32){at=X;return}!Q&&(st||et.length>4)&&(Q=X)}),Q||(Q=O.find(X=>X!==V&&X!==at)||O[0]),!at&&O.length>=2){let X=O[O.length-1];X!==Q&&X!==V&&(at=X)}if(L.classList.add("urppp-notice-row"),k(L),L.removeAttribute("width"),L.style.setProperty("flex-wrap","nowrap","important"),O.forEach(X=>{X.removeAttribute("width"),X.removeAttribute("height"),X.removeAttribute("align"),X.style.setProperty("border","none","important"),X.style.setProperty("background","transparent","important"),X.style.setProperty("vertical-align","middle","important"),X.style.removeProperty("width"),X.style.setProperty("width","auto","important")}),V&&(V.classList.add("urppp-notice-bullet-cell"),V.style.setProperty("display","none","important"),V.style.setProperty("width","0","important"),V.style.setProperty("padding","0","important")),Q){Q.classList.add("urppp-notice-title-cell"),Q.removeAttribute("width"),Q.style.setProperty("width","auto","important"),Q.style.setProperty("max-width","100%","important"),Q.style.setProperty("min-width","0","important"),Q.style.setProperty("flex","1 1 0%","important"),Q.style.setProperty("overflow","hidden","important"),Q.style.setProperty("padding","0","important"),Q.style.setProperty("pointer-events","auto","important"),Q.style.setProperty("white-space","nowrap","important");let X=Q.querySelector("a[href], a[onclick], a");if(X||(X=L.querySelector("a[href], a[onclick], a")),X){Q.contains(X)||(Q.innerHTML="",Q.appendChild(X)),X.classList.add("urppp-notice-link");let ct=X.getAttribute("href"),et=X.getAttribute("onclick"),st=X.getAttribute("target"),ft=M(X.textContent);X.textContent=ft,ct!=null&&X.setAttribute("href",ct),et!=null&&X.setAttribute("onclick",et),st!=null&&X.setAttribute("target",st),X.style.setProperty("color","var(--text)","important"),X.style.setProperty("text-decoration","none","important"),X.style.setProperty("font-size","14px","important"),X.style.setProperty("font-weight","500","important"),X.style.setProperty("line-height","1.5","important"),X.style.setProperty("pointer-events","auto","important"),X.style.setProperty("cursor","pointer","important"),X.style.setProperty("position","relative","important"),X.style.setProperty("z-index","2","important"),X.style.setProperty("display","block","important"),X.style.setProperty("white-space","nowrap","important"),X.style.setProperty("overflow","hidden","important"),X.style.setProperty("text-overflow","ellipsis","important"),L.dataset.urpppNoticeClickBound!=="1"&&(L.dataset.urpppNoticeClickBound="1",L.style.setProperty("cursor","pointer","important"),L.addEventListener("click",Z=>{if(Z.target&&Z.target.closest&&Z.target.closest("a,button,input,select,textarea,label"))return;if(X.getAttribute("onclick")){X.click();return}let dt=X.getAttribute("href");if(!dt||dt==="#"||dt.indexOf("javascript:")===0){X.click();return}X.target==="_blank"?w.open(dt,"_blank"):w.location.href=dt}))}else{let ct=M(Q.textContent);ct&&!Q.querySelector("button, input, select")&&(!Q.querySelector("*")||Q.children.length===0)&&(Q.textContent=ct)}}if(at){at.classList.add("urppp-notice-date-cell"),at.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-end !important","flex:0 0 auto !important","width:auto !important","max-width:none !important","white-space:nowrap !important","text-align:right !important","padding:0 !important","margin:0 0 0 auto !important","border:none !important","background:transparent !important","float:none !important","position:static !important","right:auto !important","left:auto !important","top:auto !important"].join(";");let X=M(at.textContent);at.innerHTML="";let ct=g.createElement("span");ct.className="urppp-notice-time",ct.textContent=X,at.appendChild(ct)}Q&&(Q.style.setProperty("flex","1 1 auto","important"),Q.style.setProperty("min-width","0","important"),Q.style.setProperty("margin","0","important"),Q.style.setProperty("float","none","important"),Q.style.setProperty("position","static","important")),L.style.setProperty("display","flex","important"),L.style.setProperty("align-items","center","important"),L.style.setProperty("justify-content","space-between","important"),L.style.setProperty("gap","16px","important"),L.style.setProperty("max-width","100%","important"),L.style.setProperty("box-sizing","border-box","important"),L.style.setProperty("overflow","hidden","important"),L.dataset.urpppNoticeDone="1";return}let H=O[0],G=Array.from(H.querySelectorAll(":scope > span"));if(G.length<2){let V=H.querySelector("a"),Q=M(H.textContent),at=Q.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);if(V||at){L.classList.add("urppp-notice-row");let X=g.createElement("div");X.className="urppp-notice-card urppp-notice-card-row";let ct=g.createElement("div");if(ct.className="urppp-notice-main",V){V.classList.add("urppp-notice-link");let et=V.getAttribute("href"),st=V.getAttribute("onclick"),ft=M(V.textContent);V.textContent=ft,et!=null&&V.setAttribute("href",et),st!=null&&V.setAttribute("onclick",st),V.style.setProperty("pointer-events","auto","important"),V.style.setProperty("cursor","pointer","important"),ct.appendChild(V),L.dataset.urpppNoticeClickBound!=="1"&&(L.dataset.urpppNoticeClickBound="1",L.style.setProperty("cursor","pointer","important"),L.addEventListener("click",Z=>{if(!(Z.target&&Z.target.closest&&Z.target.closest("a,button,input,select"))){if(V.getAttribute("onclick")||!V.getAttribute("href")||V.getAttribute("href")==="#"){V.click();return}w.location.href=V.getAttribute("href")}}))}else{let et=g.createElement("div");et.className="urppp-notice-title",et.textContent=at?Q.replace(at[0],"").trim():Q,ct.appendChild(et)}if(X.appendChild(ct),at){let et=g.createElement("div");et.className="urppp-notice-meta";let st=g.createElement("span");st.className="urppp-notice-time",st.textContent=at[1],et.appendChild(st),X.appendChild(et)}H.innerHTML="",H.appendChild(X),H.dataset.urpppNoticeDone="1",L.dataset.urpppNoticeDone="1"}return}let U=null,rt=null,it=[];if(G.forEach(V=>{let Q=(V.getAttribute("style")||"")+" "+(V.style.cssText||""),at=M(V.textContent);if(at){if(/font-size\s*:\s*18/i.test(Q)||!U&&/font-size\s*:\s*1[6-9]/i.test(Q)){U=V;return}if(/font-size\s*:\s*12/i.test(Q)||/float\s*:\s*right/i.test(Q)||/^\d{4}-\d{2}-\d{2}/.test(at)){rt=V;return}it.push(V)}}),U||(U=G[0]),!rt){let V=G[G.length-1];V!==U&&(rt=V)}let mt=g.createElement("div");if(mt.className="urppp-notice-card",U){let V=g.createElement("div");V.className="urppp-notice-title",V.textContent=M(U.textContent),mt.appendChild(V)}if((it.length?it:G.filter(V=>V!==U&&V!==rt)).forEach(V=>{let Q=g.createElement("div");Q.className="urppp-notice-body",Q.textContent=M(V.textContent),Q.textContent&&mt.appendChild(Q)}),rt){let V=g.createElement("div");V.className="urppp-notice-meta";let Q=g.createElement("span");Q.className="urppp-notice-time",Q.textContent=M(rt.textContent),V.appendChild(Q),mt.appendChild(V)}H.innerHTML="",H.appendChild(mt),H.dataset.urpppNoticeDone="1",L.dataset.urpppNoticeDone="1",L.classList.add("urppp-notice-row")})})}catch(b){T.warn("[URP++] notice table beautify failed",b)}}return a(C,"beautifyNoticeTables"),{beautifyNoticeTables:C}}a(qp,"createNoticeTableBeautifier");var Tp={"page-content-template":"urppp-pdf-page",mycoursetable:"urppp-pdf-mycoursetable",courseTable:"urppp-pdf-courseTable",courseTableBody:"urppp-pdf-courseTableBody",h4_id1:"urppp-pdf-h4-1",h4_id2:"urppp-pdf-h4-2",infoTable:"urppp-pdf-info-table","rwskxxbg-course":"urppp-pdf-rwskxxbg","other-course":"urppp-pdf-other-course",temp_title:"urppp-pdf-temp-title",temp_subtitle:"urppp-pdf-temp-subtitle"};function Kl(p){return p.querySelectorAll('script, iframe, object, embed, [id^="urppp-"], [data-urppp]').forEach(n=>n.remove()),[p,...p.querySelectorAll("*")].forEach(n=>{Array.from(n.classList||[]).forEach(c=>{/^urppp(?:-|$)/.test(c)&&n.classList.remove(c)}),Array.from(n.attributes||[]).forEach(c=>{/^data-urppp(?:-|$)/.test(c.name)&&n.removeAttribute(c.name)}),n.style&&Array.from(n.style).forEach(c=>{n.style.getPropertyPriority(c)==="important"&&n.style.removeProperty(c)})}),p}a(Kl,"sanitizeNativePdfClone");function Zl(p){return[p,...p.querySelectorAll("*")].forEach(n=>{n.id&&Tp[n.id]&&(n.id=Tp[n.id]),n.classList.contains("class_div")&&(n.classList.remove("class_div"),n.classList.remove("box_font"),n.classList.add("urppp-pdf-card")),n.classList.contains("course")&&(n.classList.remove("course"),n.classList.add("urppp-pdf-course"))}),p}a(Zl,"renameNativePdfClone");function tc(){let p=[];document.querySelectorAll('style[id^="urppp-"]').forEach(d=>{d.sheet&&!d.sheet.disabled&&(p.push(d),d.sheet.disabled=!0)});let n=0,c=document.getElementById("mycoursetable");return c&&(n=c.getBoundingClientRect().width),p.forEach(d=>{d.sheet.disabled=!1}),n}a(tc,"measureNativeScheduleWidth");var rc=`
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
`;function ec(p){p.querySelectorAll("td, th").forEach(n=>{n.style.removeProperty("background"),n.style.removeProperty("background-color")}),p.querySelectorAll("th[rowspan]").forEach(n=>{n.style.removeProperty("width"),n.style.setProperty("white-space","nowrap"),n.style.setProperty("text-align","center")}),p.querySelectorAll("table").forEach(n=>{n.style.setProperty("background","#ffffff","important"),n.style.setProperty("background-color","#ffffff","important"),n.style.setProperty("border","none","important"),n.style.setProperty("color","#000000","important")}),p.querySelectorAll("th").forEach(n=>{if(n.style.setProperty("color","#000000","important"),n.style.setProperty("border","1px solid #dddddd","important"),n.style.setProperty("font-weight","normal","important"),n.childNodes.length===1&&n.firstChild&&n.firstChild.nodeType===3){let c=document.createElement("span");c.textContent=n.textContent,n.textContent="",n.appendChild(c)}}),p.querySelectorAll("thead th").forEach(n=>{n.style.setProperty("background","#dddddd","important"),n.style.setProperty("background-color","#dddddd","important")}),p.querySelectorAll("tbody th").forEach(n=>{n.style.setProperty("background","transparent","important"),n.style.setProperty("background-color","transparent","important")}),p.querySelectorAll("td").forEach(n=>{n.style.setProperty("background","transparent","important"),n.style.setProperty("background-color","transparent","important"),n.style.setProperty("color","#000000","important"),n.style.setProperty("border","1px solid #dddddd","important")})}a(ec,"normalizeNativePdfStage");function Mp(p){let n=tc(),c=document.createElement("div");c.id="urppp-pdf-stage",c.style.cssText="position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;width:"+(n||window.innerWidth||1440)+"px;";let d=document.createElement("div");d.id="urppp-pdf-page",d.style.cssText="position:relative;width:100%;box-sizing:border-box;";let u=p.cloneNode(!0);Kl(u),Zl(u),d.appendChild(u),c.appendChild(d),ec(u);let k=document.createElement("style");k.id="urppp-pdf-reset-style",k.textContent=rc,document.head.appendChild(k),document.body.appendChild(c);let P=c.querySelector("#urppp-pdf-mycoursetable"),S=c.querySelector("#urppp-pdf-page")||c;if(!P)throw c.remove(),new Error("无法建立原生课表捕获节点");return{stage:c,target:P,page:S,sourceHost:p}}a(Mp,"cloneNativePdfStage");var Ke=0;function dr(){return Ke>0}a(dr,"isNativePdfIsolationActive");function ac(p){return!p||p.tagName!=="STYLE"?!1:/^urppp(?:-|$)/.test(p.id||"")||p.hasAttribute("data-urppp-style")?!0:(p.textContent||"").includes("urppp-")}a(ac,"isUrpppOwnedStyle");function $p(){try{if(typeof unsafeWindow<"u"&&unsafeWindow)return unsafeWindow}catch{}return typeof window<"u"?window:null}a($p,"defaultPage");function Ip(p,n){let c=p&&typeof p.requestAnimationFrame=="function"?p.requestAnimationFrame.bind(p):typeof requestAnimationFrame=="function"?requestAnimationFrame:null;return c?c(n):setTimeout(n,0)}a(Ip,"scheduleFrame");function oc(p={}){let n=p.document||(typeof document<"u"?document:null),c=p.page||$p();if(!n)throw new Error("原生 PDF 隔离缺少 document");let d=n.getElementById("mycoursetable");if(!d)throw new Error("当前页面没有课表节点");Ke+=1;let u=[d,...d.querySelectorAll("*")],k=[],P=n.getElementById("soliderbox");P&&k.push(P);let S=d.parentElement;for(;S&&S!==n.documentElement;){let x=S.classList;(S.id==="page-content-template"||x&&(x.contains("page-content")||x.contains("profile-info-row")||x.contains("profile-info-value")))&&k.push(S),S=S.parentElement}let y=n.getElementById("page-content-template")||n.querySelector(".page-content");y&&!k.includes(y)&&k.push(y);let A=[...u,...k],g=A.map(x=>({element:x,style:x.getAttribute("style")})),w=Array.from(n.querySelectorAll("style")).filter(ac).map(x=>({style:x,disabled:x.sheet?x.sheet.disabled:!1,media:x.getAttribute("media")})),T=Array.from(d.querySelectorAll('[id^="urppp-"], [data-urppp]')),C=c&&c.divBuild,b=c&&c.__urpppOriginalDivBuild,m=!1,v=a(()=>{m||(m=!0,c&&c.divBuild===b&&typeof C=="function"&&(c.divBuild=C),g.forEach(({element:x,style:_})=>{x.isConnected&&(_===null?x.removeAttribute("style"):x.setAttribute("style",_))}),T.forEach(x=>x.removeAttribute("data-urppp-pdf-hidden")),w.forEach(({style:x,disabled:_,media:q})=>{try{q===null?x.removeAttribute("media"):x.setAttribute("media",q),x.sheet&&(x.sheet.disabled=_)}catch{}}),Ke=Math.max(0,Ke-1),Ip(c,()=>{try{typeof p.onAfterRestore=="function"&&p.onAfterRestore()}catch{}}))},"restore");try{return w.forEach(({style:x})=>{try{x.setAttribute("media","not all"),x.sheet&&(x.sheet.disabled=!0)}catch{}}),A.forEach(x=>{!x.style||!x.style.length||Array.from(x.style).forEach(_=>{x.style.getPropertyPriority(_)==="important"&&(_==="height"&&x.matches("td, th")||x.style.removeProperty(_))})}),d.querySelectorAll("td").forEach(x=>{x.style.removeProperty("background"),x.style.removeProperty("background-color")}),y&&y.style.setProperty("position","relative","important"),d.style.setProperty("position","static","important"),d.querySelectorAll("td").forEach(x=>{x.style.setProperty("position","static","important")}),T.forEach(x=>{x.setAttribute("data-urppp-pdf-hidden","1"),x.style.setProperty("display","none","important")}),c&&typeof b=="function"&&(c.divBuild=b),v}catch(x){throw v(),x}}a(oc,"isolateScheduleForNativeExport");function Np(p,n={}){return new Promise((c,d)=>{let u=n.page||$p(),k=u&&u.back,P=u&&u.html2canvas;if(!p||typeof k!="function"){d(new Error("教务原生导出依赖未就绪"));return}let S=null;try{S=oc(n)}catch(b){d(b);return}let y=0,A=!1,g=null,w=null,T=a(b=>{if(!A){A=!0,y&&clearTimeout(y),u&&g&&u.back===g&&(u.back=k),w&&u.html2canvas===w&&(u.html2canvas=P);try{S&&S()}catch{}b?d(b):c()}},"settle"),C=a(b=>T(b instanceof Error?b:new Error(String(b))),"fail");typeof P=="function"&&(w=a(function(){let b=P.apply(this,arguments);return b&&typeof b.catch=="function"&&b.catch(C),b},"scopedCanvas"),u.html2canvas=w),g=a(function(){try{return k.apply(this,arguments)}finally{setTimeout(()=>T(),0)}},"wrappedBack"),u.back=g,y=setTimeout(()=>{try{k.call(u)}catch{}C(new Error("原生 PDF 生成超时"))},n.timeoutMs||60*1e3),Ip(u,()=>{try{p.click()}catch(b){C(b)}})})}a(Np,"exportNativePdfIsolated");var Bp=`.urppp-private-value{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;font-style:inherit!important;line-height:inherit!important;letter-spacing:0!important;color:inherit!important}
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
`;var Fp=`      /* 全局 */
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
`;var Dp=`/* Personal and resource schedule course cards. Keep table cells and table surfaces untouched. */
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
`;var jp=`.urppp-export-wrap{position:relative!important;display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;margin-left:7px!important;font-weight:400!important;vertical-align:middle!important;white-space:nowrap!important}
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
`;var Op=`/* Settings panel shell */
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
#urppp-settings-panel .urppp-store-author{font-size:11px;color:var(--text-secondary,#5b5f69)}
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
`;var Hp=`      /* 表格美化：业务表格、分页、公告卡片（table-beautify） */
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
`;var Rp=`      /* 导航：顶栏、侧栏、面包屑（navigation） */
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
`;var Up=`/* ===== 插件弹窗统一进入动画：淡入+缩放 + 内容逐条浮现 ===== */
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
`;var Wp=`      /* 首页重构仪表板（dashboard） */
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
`;var Gp=`      /* 成绩分析面板（score-analysis） */
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
`;var Jp=`      /* ============================================================
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
`;function Vp(){return{open:!1,mobileTab:"home",scoreAnalysisTab:"overview",profile:null,schedule:null,scores:null,catalog:null,occupancy:null,currentBuilding:null,loading:{profile:!1,schedule:!1,scores:!1,room:!1},roomError:"",roomDateOffset:0,selected:{passing:new Set,scheme:new Set},activeSchemeIdx:0,_schemeUserSelected:!1,viewWeek:0,weekLocked:!1,_termWeek:0,_termWeekResolved:!1,uiReady:!1}}a(Vp,"createCleanModeState");function Yp(p){p.profile=null,p.schedule=null,p.scores=null,p.catalog=null,p.occupancy=null,p._termWeekResolved=!1,p._schemeUserSelected=!1,p._schemeInited=!1}a(Yp,"resetCleanModeData");function Qp({state:p,deps:n}){async function c(u){if(!u&&p.catalog&&p.catalog.length||p.loading.room)return p.catalog;p.loading.room=!0;try{n.render()}catch{}try{p.catalog=await n.loadClassroomCatalog(),p.roomError=""}catch(k){p.catalog=p.catalog||[],p.roomError=String(k&&k.message||k),console.warn("[URP++] room catalog",k)}finally{p.loading.room=!1;try{n.scheduleRender()}catch{}}return p.catalog}a(c,"ensureRoomCatalogLoaded");async function d(u){u&&Yp(p),p.loading.profile=p.loading.schedule=p.loading.scores=!0;try{let k=await n.ensureTermWeekResolved();!p.weekLocked&&k>=1&&(p.viewWeek=k)}catch{}if(n.render(),await Promise.all([(async()=>{try{p.profile&&!u||(p.profile=await n.loadProfile()),n.reconcileProfileAndScores()}catch(k){p.profile={name:"同学",majorPlan:"主修方案",majorGpa:"—",avatar:""},console.warn(k)}finally{p.loading.profile=!1,n.scheduleRender()}})(),(async()=>{try{p.schedule&&!u||(p.schedule=await n.loadSchedule())}catch(k){p.schedule={courses:[],error:String(k&&k.message||k)}}finally{if(p.loading.schedule=!1,!p.weekLocked){let k=n.getCurrentWeekNumber()||n.readRememberedTermWeek();k>=1&&(p.viewWeek=k)}n.scheduleRender()}})(),(async()=>{let k=null;try{p.scores&&!u||(p.scores=await n.loadScores(u)),k=p.scores,n.reconcileProfileAndScores(),k&&!k.error&&!k.evaluationReady&&n.enrichScoresWithEvaluation(k).then(()=>{p.scores===k&&(n.reconcileProfileAndScores(),n.scheduleRender())}).catch(P=>{console.warn("[URP++] attach evaluation",P)})}catch(P){p.scores={passing:[],schemes:[],error:String(P&&P.message||P)}}finally{p.loading.scores=!1,n.scheduleRender()}})()]),n.reconcileProfileAndScores(),!p.weekLocked){let k=n.getCurrentWeekNumber()||n.readRememberedTermWeek();k>=1&&(p.viewWeek=k)}n.scheduleRender()}return a(d,"loadAll"),{ensureRoomCatalogLoaded:c,loadAll:d}}a(Qp,"createCleanModeDataLoader");var te={autumn:{name:"秋季学期",weeks:20,start:"2026-08-31",end:"2027-02-20",events:[{t:"reg",name:"本科生新生报到",start:"2026-08-24",end:"2026-08-25"},{t:"reg",name:"在校生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"研究生新生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"在校本科补缓考",start:"2026-08-28",end:"2026-08-30"},{t:"term",name:"本科生开学典礼",start:"2026-09-01"},{t:"term",name:"研究生开学典礼",start:"2026-09-04"},{t:"term",name:"在校生正式行课",start:"2026-08-31",end:"2026-09-06"},{t:"holiday",name:"中秋节",start:"2026-09-25"},{t:"holiday",name:"国庆节假期",start:"2026-10-01",end:"2026-10-07"},{t:"sport",name:"校秋季田径运动会",start:"2026-10-23",end:"2026-10-24"},{t:"exam",name:"本科生期末集中考试周",start:"2027-01-04",end:"2027-01-15"},{t:"holiday",name:"寒假",start:"2027-01-18",end:"2027-02-20"},{t:"holiday",name:"春节",start:"2027-02-06"}]},spring:{name:"春季学期",weeks:18,start:"2027-03-01",end:"2027-07-03",events:[{t:"reg",name:"在校生报到",start:"2027-02-25",end:"2027-02-26"},{t:"term",name:"正式行课",start:"2027-03-01",end:"2027-03-07"},{t:"holiday",name:"清明节",start:"2027-04-05"},{t:"holiday",name:"劳动节假期",start:"2027-05-01",end:"2027-05-05"},{t:"holiday",name:"端午节",start:"2027-06-09"},{t:"exam",name:"期末集中考试",start:"2027-06-21",end:"2027-06-27"},{t:"term",name:"毕业典礼",start:"2027-06-25"},{t:"holiday",name:"暑假开始",start:"2027-07-04"}]}},nc={"2026-08-24":"农历七月十二","2026-08-25":"农历七月十三","2026-08-27":"农历七月十五","2026-08-28":"农历七月十六","2026-08-30":"农历七月十八","2026-08-31":"农历七月十九","2026-09-01":"农历七月二十","2026-09-04":"农历七月廿三","2026-09-25":"农历八月十五","2026-10-01":"农历八月廿一","2026-10-07":"农历八月廿七","2026-10-23":"农历九月十四","2026-10-24":"农历九月十五","2027-01-04":"农历冬月廿七","2027-01-15":"农历腊月初八","2027-01-18":"农历腊月十一","2027-02-06":"农历正月初一","2027-02-20":"农历正月十五","2027-02-25":"农历正月二十","2027-02-26":"农历正月廿一","2027-03-01":"农历正月廿四","2027-04-05":"农历二月廿九","2027-05-01":"农历三月廿五","2027-05-05":"农历三月廿九","2027-06-09":"农历五月初五","2027-06-21":"农历五月十七","2027-06-25":"农历五月廿一","2027-06-27":"农历五月廿三","2027-07-03":"农历五月廿九","2027-07-04":"农历六月初一"},we={term:{color:"#44616f",label:"教学/开学"},reg:{color:"#8a74bd",label:"报到"},exam:{color:"#c08a3f",label:"考试周"},holiday:{color:"#d0716a",label:"假期"},sport:{color:"#778e63",label:"运动会"}};function Zp(){let p=new Date,n=a(c=>String(c).padStart(2,"0"),"p");return`${p.getFullYear()}-${n(p.getMonth()+1)}-${n(p.getDate())}`}a(Zp,"calToday");function oo(p,n){return Math.round((Date.parse(n)-Date.parse(p))/864e5)}a(oo,"calDayDiff");function no(p,n){let c=oo(te[p].start,n);return c<0?0:Math.floor(c/7)+1}a(no,"calWeekNo");function eo(p){return nc[p]||""}a(eo,"calLunar");function Xp(p){return String(p||"").slice(5)}a(Xp,"calYY");function pc(p){let n=p||Zp(),[c,d]=n.split("-").map(Number);return d===8&&n>="2026-08-15"||d>=9||d<=2?"autumn":"spring"}a(pc,"calActiveTerm");function po(p,n){let c=p&&te[p]?p:"autumn",d=te[c],u=n||Zp(),k=d.events.map(g=>({e:g,d:oo(u,g.start)})).filter(g=>g.d>=-0).sort((g,w)=>g.d-w.d)[0],P=k?oo(u,k.e.start):null,S=no(c,u),y=Math.max(0,Math.min(100,S/d.weeks*100)),A=u>=d.start;return{term:d,termId:c,next:k,daysLeft:P,weekNo:S,progress:y,started:A,today:u}}a(po,"calStatus");function ti(p,n){let c=po(p,n),d=c.next?we[c.next.e.t].color:"#c9cdd4",u=c.term;return`<button type="button" class="uc-cal-summary" data-urppp-cal-open aria-label="打开校历时间线">
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
  </button>`}a(ti,"calendarSummaryHtml");function ri(p,n){let c=po(p,n);return`<button type="button" class="uc-cal-summary uc-cal-summary-compact" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-c-dot" style="background:${c.next?we[c.next.e.t].color:"#c9cdd4"}"></span>
    <span class="cal-c-count"><b>${c.daysLeft==null?"—":c.daysLeft}</b><em>天后</em></span>
    <span class="cal-c-info">
      <span class="cal-c-name">${c.next?c.next.e.name:"学期已结束"}</span>
      <span class="cal-c-sub">${c.started?`第 ${c.weekNo} 周`:"尚未开学"} · ${c.term.name}</span>
    </span>
    <span class="cal-c-prog"><span class="cal-c-bar"><i style="width:${c.progress}%"></i></span><span class="cal-c-week">本学期进度 ${Math.min(c.weekNo,c.term.weeks)}/${c.term.weeks} 周</span></span>
  </button>`}a(ri,"calendarSummaryCompactHtml");function Kp(p,n){let c=po(p,n),d=c.next?we[c.next.e.t].color:"#c9cdd4",u=c.term,k=Object.keys(te).map(w=>`<button type="button" class="cal-term${w===c.termId?" ac":""}" data-cal-term="${w}">${te[w].name}</button>`).join(""),P=`<div class="cal-widget">
    <div class="cal-w-left">
      <div class="cal-w-label">下一个事件</div>
      <div class="cal-w-ev"><i style="background:${d}"></i><b>${c.next?c.next.e.name:"学期已结束"}</b></div>
      <div class="cal-w-sub">${c.next?c.next.e.start+(c.next.e.end&&c.next.e.end!==c.next.e.start?" ~ "+c.next.e.end:""):""}${c.next&&eo(c.next.e.start)?" · "+eo(c.next.e.start):""}</div>
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
  </div>`,S=u.events.slice().sort((w,T)=>w.start<T.start?-1:1),y={};S.forEach(w=>{(y[w.start.slice(0,7)]=y[w.start.slice(0,7)]||[]).push(w)});let A=a(w=>w===c.today?" cal-today":"","todayFlag"),g=Object.keys(y).map(w=>{let[,T]=w.split("-");return`<div class="cal-mon">
      <div class="cal-mon-label">${Number(T)} 月</div>
      <div class="cal-mon-items">${y[w].map(C=>{let b=we[C.t].color,m=C.end&&C.end!==C.start?"~"+Xp(C.end):"",v=no(c.termId,C.start)>0?`第 ${no(c.termId,C.start)} 周`:"开学前";return`<div class="cal-ev${A(C.start)}">
          <span class="cal-ev-dot" style="background:${b}"></span>
          <span class="cal-ev-date">${Xp(C.start)}${m||""}<em>${eo(C.start)||"&nbsp;"}</em></span>
          <span class="cal-ev-name">${C.name}</span>
          <span class="cal-ev-tag" style="color:${b};background:${b}1a">${we[C.t].label}</span>
          <span class="cal-ev-wk">${v}</span>
        </div>`}).join("")}</div>
    </div>`}).join("");return`<div class="cal-modal-wrap">
    <div class="cal-modal-top">
      <span class="cal-modal-title">校历时间线</span>
      <span class="cal-right"><span class="cal-term-pills">${k}</span><button type="button" class="cal-close" aria-label="关闭">✕</button></span>
    </div>
    ${P}
    <div class="cal-timeline">${g}</div>
  </div>`}a(Kp,"calendarModalHtml");function ei(p,n){let c=typeof document<"u"?document:null;if(!c)return;ao();let d=p&&te[p]?p:pc(n),u=c.createElement("div");u.id="urppp-cal-modal",u.innerHTML=`<div class="cal-overlay"></div>
    <div class="cal-dialog"><div class="cal-body">${Kp(d,n)}</div></div>`,c.documentElement.appendChild(u),setTimeout(()=>u.classList.add("open"),20),u.querySelector(".cal-overlay").addEventListener("click",()=>ao()),u.addEventListener("click",k=>{let P=k.target;if(P&&P.closest&&P.closest(".cal-close")){ao();return}let S=P&&P.closest?P.closest("[data-cal-term]"):null;if(S){let y=u.querySelector(".cal-body");y&&(y.innerHTML=Kp(S.dataset.calTerm,n)),u.querySelectorAll("[data-cal-term]").forEach(A=>A.classList.toggle("ac",A.dataset.calTerm===S.dataset.calTerm))}})}a(ei,"openCalendarModal");function ao(){let p=typeof document<"u"?document:null;if(!p)return;let n=p.getElementById("urppp-cal-modal");n&&(n.classList.remove("open"),n.classList.add("closing"),setTimeout(()=>{n.remove()},200))}a(ao,"closeCalendarModal");function ai(p,n){let c=p||(typeof document<"u"?document:null);c&&c.addEventListener("click",d=>{let u=d.target;u&&u.closest&&u.closest("[data-urppp-cal-open]")&&(d.preventDefault(),d.stopPropagation(),ei())})}a(ai,"bindCalendarOpen");var Ze=!1;function io(){let p=typeof document<"u"?document:null;if(!p||Ze)return Ze;try{let n=p.createElement("style");if(n&&n.id!==void 0){n.id="urppp-cal-style",n.textContent=`
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
  `,n.id="urppp-cal-style";let c=p.head||p.documentElement;c&&c.appendChild(n),Ze=!0}}catch{}return Ze}a(io,"ensureCalendarStyle");function oi(){let p=typeof document<"u"?document:null;if(!p)return;let n=p.getElementById("urppp-nav-theme")||p.querySelector("#navbar .navbar-header")||p.getElementById("navbar"),c=p.getElementById("urppp-nav-clean"),d=p.getElementById("urppp-nav-cal");if(!n&&!c)return;let u=c&&c.parentElement||n;d&&d.parentElement===u||(d&&d.remove(),d=p.createElement("button"),d.type="button",d.id="urppp-nav-cal",d.title="校历时间线",d.setAttribute("aria-label","校历时间线"),d.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg><span>校历</span>',Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none",margin:"0 0 0 8px","vertical-align":"middle"}).forEach(([k,P])=>d.style.setProperty(k,P,"important")),d.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation(),ei()}),c&&c.parentElement?c.after(d):u&&u.appendChild(d))}a(oi,"mountCalendarButton");function ni(){let p=typeof document<"u"?document:null;if(!p)return;let n=p.getElementById("urppp-nav-cal");n&&n.remove()}a(ni,"removeCalendarButton");function pi({state:p,deps:n}){let c=0,d={gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)"};function u(x,_){let q=x||n.summarizeCourses([]);return`<div class="uc-metrics">${[["TotalCredit","总学分",q.totalCredit],["AvgScore","平均成绩",q.avgScore],["AvgGpa","平均绩点",q.avgGpa],["RequiredCredit","必修学分",q.requiredCredit],["RequiredAvg","必修平均",q.requiredAvg],["RequiredGpa","必修绩点",q.requiredGpa]].map(([L,O,M])=>{let H=n.classifyPrivacyLabel(O)||"grade",G=_&&n.DIRECT_EDIT_LABELS[_+L]?` data-urppp-edit-key="${_+L}"`:"";return`<div class="uc-metric"><em>${O}</em><b data-urppp-private="${H}"${G}>${M}</b></div>`}).join("")}</div>`}a(u,"metricHtml");function k(){let x=p.scores;if(!x||x.error)return`<div class="uc-sa-empty">${n.escapeHtml(x&&x.error||"暂无成绩数据")}</div>`;let _=null;try{_=n.analyzeScores({scorePack:x,profile:p.profile})}catch{}if(!_||_.empty)return'<div class="uc-sa-empty">暂无可用成绩数据，请先查询成绩后再试。</div>';let q=typeof n.scoreChartLayout=="function"?n.scoreChartLayout():null;return`<div class="uc-sa-charts">
      <div class="uc-sa-chart-card"><h5>学期趋势</h5><div class="uc-sa-chart-scroll">${n.trendChartSvg({trend:_.trend,palette:n.scoreChartPalette||d,layout:q})}</div></div>
      <div class="uc-sa-chart-card"><h5>成绩分段分布</h5><div class="uc-sa-chart-scroll">${n.bandsChartSvg({bands:_.bands,palette:n.scoreChartPalette||d,layout:q})}</div></div>
    </div>
    <div class="uc-sa-more-row"><a class="uc-sa-more" data-href="/student/integratedQuery/scoreQuery/allPassingScores/index?urppp=sa">点击此处跳转到详细分析界面 →</a></div>`}a(k,"analysisHtml");function P(x){let _=!!n.isCleanAnalysisDirect(),q=p.scoreAnalysisTab==="analysis";return _?`<div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
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
  </div>`}a(P,"scoreSectionHtml");function S(){try{if(window.matchMedia&&window.matchMedia("(max-width:900px)").matches)return 40}catch{}return 56}a(S,"getScheduleRowHeight");function y(x){let _=n.getViewWeekNumber(),q=S(),I=Math.max(q-4,28),L=(x||[]).map(H=>Object.assign({},H,{thisWeek:n.weekBitActive(H.classWeek,_)||!H.classWeek&&String(H.week||"").indexOf(String(_))>=0,span:Math.max(1,H.span||1),color:H.color||n.courseColor(H.name)})),O={};L.forEach(H=>{let G=H.day+"_"+H.section;(O[G]||(O[G]=[])).push(H)});let M=`<div class="uc-week" data-urppp-private="schedule" data-week="${_}" data-row="${q}">`;M+='<div class="uc-week-head"><div class="h"></div>';for(let H=0;H<7;H++)M+=`<div class="h">${n.DAY_NAMES[H]}</div>`;M+='</div><div class="uc-week-body">',M+='<div class="uc-sec-col">';for(let H=1;H<=12;H++)M+=`<div class="s" style="height:${q}px">${H}</div>`;M+="</div>";for(let H=0;H<7;H++){M+=`<div class="uc-day-col" data-day="${H}" style="height:${q*12}px">`;for(let G=1;G<=12;G++)M+=`<div class="uc-grid-cell" data-sec="${G}" style="top:${(G-1)*q}px;height:${I}px"></div>`;M+=`<div class="uc-part-line" style="top:${4*q-2}px"></div>`,M+=`<div class="uc-part-line" style="top:${9*q-2}px"></div>`;for(let G=1;G<=12;G++){let U=(O[H+"_"+G]||[]).slice().sort((ft,Z)=>ft.thisWeek!==Z.thisWeek?(Z.thisWeek?1:0)-(ft.thisWeek?1:0):(Z.span||1)-(ft.span||1));if(!U.length)continue;let it=U.filter(ft=>ft.thisWeek)[0]||U[0],mt=U.filter(ft=>ft!==it),V=it.span,Q=(G-1)*q+1,at=V*q-6,X=it.thisWeek?8:2,ct=it.thisWeek?`--uc-course-color:${it.color};top:${Q}px;height:${at}px;z-index:${X};background:${it.color}26;border-color:${it.color}80`:`--uc-course-color:${it.color};top:${Q}px;height:${at}px;z-index:${X};background:color-mix(in srgb,${it.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`,et=mt.length?`<span class="uc-badge">+${mt.length}</span>`:"",st=n.escapeHtml(JSON.stringify({name:it.name,teacher:it.teacher,place:it.place,week:it.week,day:it.day,section:it.section,span:it.span,thisWeek:it.thisWeek,others:mt.map(ft=>({name:ft.name,teacher:ft.teacher,place:ft.place,week:ft.week,thisWeek:ft.thisWeek,section:ft.section,span:ft.span}))}));M+=`<div class="uc-lesson${it.thisWeek?"":" is-fade"}" style="${ct}" data-course='${st}'>
          <b>${n.escapeHtml(it.name)}</b>
          <i>${n.escapeHtml([it.place,it.week].filter(Boolean).join(" · "))}</i>
          ${et}
        </div>`}M+="</div>"}return M+="</div></div>",M}a(y,"renderScheduleBoard");function A(){try{if(p.loading&&p.loading.schedule)return"";let x=n.calVacation?n.calVacation():"term";if(x==="term"||n.getViewWeekNumber()!==0)return"";let _={summer:{title:"放暑假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'},winter:{title:"放寒假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>'},springfestival:{title:"春节快乐！",sub:"",svg:'<svg viewBox="0 0 72 72"><rect x="16" y="16" width="40" height="40" rx="7" fill="#b71c1c" stroke="#f5b301" stroke-width="2.4" transform="rotate(45 36 36)"/><path d="M36 16v40M16 36h40" stroke="#f5b301" stroke-width="1" opacity=".5"/><path d="M24 24l24 24M48 24L24 48" stroke="#f5b301" stroke-width="1" opacity=".35"/><text x="36" y="47" text-anchor="middle" font-size="30" font-weight="900" fill="#ffd54f" font-family="Noto Serif SC,STKaiti,KaiTi,serif" transform="rotate(180 36 36)">福</text></svg>',couplet:{scroll:"万象纳祥",right:"望江听雨华西看杏海纳百川享人间烟火",left:"江安漫步眉山泛舟有容乃大过锦绣新年"}}}[x];if(!_)return"";if(x==="springfestival"&&_.couplet){let I=_.couplet;return`<div class="uc-schedule-mask uc-mask-springfestival">
          <span class="uc-mask-scroll">${I.scroll}</span>
          <span class="uc-mask-cl uc-mask-cl-r">${I.right}</span>
          <span class="uc-mask-cl uc-mask-cl-l">${I.left}</span>
          <span class="uc-mask-ico">${_.svg}</span>
          <span class="uc-mask-txt"><b>${_.title}</b></span>
        </div>`}let q=_.sub?`<i>${_.sub}</i>`:"";return`<div class="uc-schedule-mask uc-mask-${x}"><span class="uc-mask-ico">${_.svg}</span><span class="uc-mask-txt"><b>${_.title}</b>${q}</span></div>`}catch{return""}}a(A,"vacationMark");function g(){return`<div class="uc-services">${[{t:"空闲教室",i:"room",a:"room"},{t:"教学评估",i:"eval",h:"/student/teachingEvaluation/newEvaluation/index"},{t:"培养方案",i:"plan",h:"/student/integratedQuery/planCompletion/index"},{t:"补办学生证",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082"},{t:"免修申请",i:"apply",h:"/student/personalManagement/individualApplication/exemptionApplication/index"},{t:"替代课申请",i:"apply",h:"/student/personalManagement/personalApplication/curriculumReplacement/index"},{t:"火车票优惠卡",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083"}].map(_=>`
      <button type="button" class="uc-svc" data-action="${_.a||""}" data-href="${_.h||""}">
        ${n.ico(_.i)}<strong>${_.t}</strong>
      </button>`).join("")}</div>`}a(g,"servicesHtml");function w(){let x=n.personalizedProfile(p.profile||{}),_=p.schedule&&p.schedule.courses||[],q=p.scores&&p.scores.passing&&p.scores.passing[0]||{summary:n.summarizeCourses([])},I=p.scores&&p.scores.schemes||[];p.scores&&p.scores.majorIdx!=null&&p._schemeInited!==!0&&(p.activeSchemeIdx=p.scores.majorIdx||0,p._schemeInited=!0);let L=I[p.activeSchemeIdx]||I[0]||{summary:n.summarizeCourses([]),title:"方案成绩"},O=x.avatar?`<img src="${n.escapeHtml(x.avatar)}" alt="">`:`<span>${n.escapeHtml((x.name||"同")[0])}</span>`,M=p.loading.scores?'<div class="uc-loading">成绩加载中</div>':p.scores&&p.scores.error?`<div class="uc-empty">${n.escapeHtml(p.scores.error)}</div>`:`<div class="uc-score-grid">
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
        </div>${(()=>{try{return ti()}catch{return""}})()}</div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${n.getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${_.length?_.length+" 课次":p.schedule&&p.schedule.error||""}</span>
            </div>
          </div>
          <div class="uc-bd"><div class="uc-schedule-wrap">${p.loading.schedule?'<div class="uc-loading">课表加载中</div>':_.length?y(_):`<div class="uc-empty">${n.escapeHtml(p.schedule&&p.schedule.error||"暂无课表数据")}</div>`}${A()}</div></div>
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
    </div>`}a(w,"renderDesktop");function T(){let x=n.personalizedProfile(p.profile||{}),_=p.schedule&&p.schedule.courses||[],q=p.scores&&p.scores.passing&&p.scores.passing[0]||{summary:n.summarizeCourses([])},I=(p.scores&&p.scores.schemes||[])[p.activeSchemeIdx]||{summary:n.summarizeCourses([])},L=x.avatar?`<img src="${n.escapeHtml(x.avatar)}" alt="">`:`<span>${n.escapeHtml((x.name||"同")[0])}</span>`;if(p.mobileTab==="scores"){let O=`<div class="uc-score-grid uc-score-grid-mobile">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${u(q.summary,"passing")}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${u(I.summary,"scheme")}</div>
      </div>`;return`<div class="uc-mobile"><div class="uc-card">${P(O)}</div></div>`}return p.mobileTab==="room"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${C()}</div></div></div>`:p.mobileTab==="more"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${g()}</div></div></div>`:`<div class="uc-mobile">
      <div class="uc-card uc-profile-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${L}</div>
        <div><div class="uc-name" data-urppp-private="name">${n.escapeHtml(x.name||"同学")}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${n.escapeHtml(x.majorPlan||"—")}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${n.escapeHtml(String(x.majorGpa||"—"))}</span></div></div>
      </div>${(()=>{try{return ri()}catch{return""}})()}</div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${n.getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd"><div class="uc-schedule-wrap">${p.loading.schedule?'<div class="uc-loading">课表加载中</div>':_.length?y(_):`<div class="uc-empty">${n.escapeHtml(p.schedule&&p.schedule.error||"暂无课表数据")}</div>`}${A()}</div></div></div>
    </div>`}a(T,"renderMobile");function C(){if(p.loading.room)return'<div class="uc-loading">教学楼加载中</div>';let x=p.catalog||[];return x.length?x.slice().sort((q,I)=>(/江安/.test(q.campus)?-1:0)-(/江安/.test(I.campus)?-1:0)).map(q=>`
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${n.escapeHtml(q.campus)}</div>
        <div class="uc-build-grid">
          ${q.buildings.map(I=>`<button type="button" data-build-path="${n.escapeHtml(I.path)}" data-cn="${n.escapeHtml(I.campusNumber||"")}" data-bn="${n.escapeHtml(I.buildingNumber||"")}">${n.escapeHtml(I.name)}</button>`).join("")}
        </div>
      </div>`).join(""):`<div class="uc-empty">${n.escapeHtml(p.roomError||"未读到教学楼列表")}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`}a(C,"roomPickerHtml");function b(x,_){if(!x||!x.rooms||!x.rooms.length)return'<div class="uc-empty">该楼暂无教室占用数据</div>';let q='<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';for(let M=1;M<=12;M++)q+=`<th class="sec">${M}</th>`;q+="</tr>";let I=x.rooms.map(M=>{let H=`<tr><th class="sticky">${n.escapeHtml(M.name)}</th><th class="sticky2">${n.escapeHtml(M.seats)}</th>`;for(let G=1;G<=12;G++){let U=(M.slots||[]).find(rt=>rt.section===G)||{busy:!1};if(U.busy){let rt=U.reason||U.typeLabel||"占用",it=U.typeLabel||n.occupancyTypeLabel({occupancymoduleId:U.module}),mt=U.displayChar||n.firstContentChar(rt)||n.firstContentChar(it)||"占",V=Object.assign({},U.detail||{room:M.name,section:G,reason:rt},{reason:rt,typeLabel:it,contentName:U.contentName||U.detail&&U.detail.contentName||""}),Q=n.escapeHtml(JSON.stringify(V));H+=`<td><button type="button" class="uc-slot busy ${n.occupancyKindClass(it)}" data-occ='${Q}' title="${n.escapeHtml(M.name)} 第${G}节 · ${n.escapeHtml(rt)}">${n.escapeHtml(mt)}</button></td>`}else H+=`<td><div class="uc-slot free" title="${n.escapeHtml(M.name)} 第${G}节 · 空闲"></div></td>`}return H+"</tr>"}).join(""),L=Number(x.dateOffset!=null?x.dateOffset:p.roomDateOffset)||0,O=a((M,H)=>`<button type="button" class="uc-btn${L===M?" primary":""}" data-room-day="${M}">${H}</button>`,"dayBtn");return`
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${n.escapeHtml(_||"")}</div>
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
      <div class="uc-occ"><table class="uc-occ-table">${q}${I}</table></div>`}a(b,"occupancyHtml");function m(){let x=n.ensureRoot(),_=x.querySelector("#uc-body");n.getViewWeekNumber();let q=typeof window<"u"&&window.matchMedia?window.matchMedia:null,I=q&&q("(max-width:900px)").matches,L=!p.uiReady;_.innerHTML=I?T():w(),L?(p.uiReady=!0,x.classList.remove("uc-settled"),clearTimeout(x.__ucSettleTimer),x.__ucSettleTimer=setTimeout(()=>{p.open&&x.classList.add("uc-settled")},480)):x.classList.add("uc-settled"),n.bindUI(_),n.applyPersonalDisplay(_)}a(m,"render");function v(){if(!p.open||c)return;let x=a(()=>{c=0,p.open&&m()},"run"),_=typeof requestAnimationFrame=="function"?requestAnimationFrame:null;c=_?_(x):setTimeout(x,0)}return a(v,"scheduleRender"),{analysisHtml:k,metricHtml:u,occupancyHtml:b,render:m,renderScheduleBoard:y,roomPickerHtml:C,scheduleRender:v,scoreSectionHtml:P}}a(pi,"createCleanModeRenderer");function ii({state:p,deps:n}){function c(w,T){return!w||(w.__urpppCleanUiBindings||(w.__urpppCleanUiBindings=new Set),w.__urpppCleanUiBindings.has(T))?!1:(w.__urpppCleanUiBindings.add(T),!0)}a(c,"markCleanUiBound");function d(w){if(!w)return;try{n.bindScheduleExportHosts(w)}catch(C){console.warn("[URP++] schedule export menu",C)}w.querySelectorAll("[data-score]").forEach(C=>{c(C,"score")&&C.addEventListener("click",()=>S(C.getAttribute("data-score")))}),w.querySelectorAll("[data-sa-tab]").forEach(C=>{c(C,"saTab")&&C.addEventListener("click",()=>{p.scoreAnalysisTab=C.getAttribute("data-sa-tab")==="analysis"?"analysis":"overview",n.render()})}),w.querySelectorAll("[data-href]").forEach(C=>{c(C,"href")&&C.addEventListener("click",b=>{let m=C.getAttribute("data-href");m&&(b.preventDefault(),n.closeCleanMode(),location.href=m)})}),w.querySelectorAll("[data-eval-url]").forEach(C=>{c(C,"eval")&&C.addEventListener("click",b=>{let m=C.getAttribute("data-eval-url");m&&(b.preventDefault(),b.stopPropagation(),n.closeCleanMode(),location.href=m)})}),w.querySelectorAll('[data-action="room"]').forEach(C=>{c(C,"room")&&C.addEventListener("click",()=>y())}),w.querySelectorAll("[data-room-reload]").forEach(C=>{c(C,"roomReload")&&C.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),n.ensureRoomCatalogLoaded(!0)})}),w.querySelectorAll("[data-build-path]").forEach(C=>{c(C,"building")&&C.addEventListener("click",async()=>{let b=C.getAttribute("data-build-path"),m=(C.textContent||"").trim(),v=C.getAttribute("data-cn")||"",x=C.getAttribute("data-bn")||"",_=C.closest("#uc-room-panel")||C.closest("#uc-modal-body")||null;p.roomDateOffset=0,await g({path:b,name:m,campusNumber:v,buildingNumber:x,dateOffset:0},m,_)})}),w.querySelectorAll("[data-room-day]").forEach(C=>{c(C,"roomDay")&&C.addEventListener("click",async b=>{b.preventDefault(),b.stopPropagation();let m=parseInt(C.getAttribute("data-room-day")||"0",10)||0;if(!p.currentBuilding)return;p.roomDateOffset=m;let v=Object.assign({},p.currentBuilding,{dateOffset:m}),x=C.closest("#uc-room-panel")||C.closest("#uc-modal-body")||null;await g(v,v.name||"",x)})});let T=w.querySelector("#uc-room-back");T&&(T.onclick=()=>{p.occupancy=null,p.currentBuilding=null;let C=T.closest("#uc-room-panel")||document.querySelector("#uc-room-panel")||document.querySelector("#uc-modal-body");C&&C.id==="uc-modal-body"||C&&C.id==="uc-room-panel"?(C.innerHTML=n.roomPickerHtml(),d(C)):n.render()}),w.querySelectorAll(".uc-slot.busy[data-occ]").forEach(C=>{c(C,"occupancy")&&C.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();try{let m=JSON.parse(C.getAttribute("data-occ")||"{}");k("占用详情",`
            <div class="uc-occ-detail">
              <div class="uc-name">${n.escapeHtml(m.room||"")}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${n.escapeHtml(String(m.section||m.start||""))}${m.span>1?"-"+(Number(m.start||m.section)+Number(m.span)-1):""}节</div>
              <div class="uc-sub">占用类型：${n.escapeHtml(m.typeLabel||m.reason||"占用")}</div>
              <div class="uc-sub">具体内容：${n.escapeHtml(m.contentName||m.reason||"—")}</div>
              ${m.teacher?`<div class="uc-sub">教师：${n.escapeHtml(m.teacher)}</div>`:""}
              ${m.weeks?`<div class="uc-sub">周次：${n.escapeHtml(m.weeks)}</div>`:""}
              ${m.courseNo?`<div class="uc-sub">课程号：${n.escapeHtml(m.courseNo)}</div>`:""}
            </div>
          `,"",{stack:!0})}catch{}})}),w.querySelectorAll(".uc-lesson[data-course]").forEach(C=>{c(C,"course")&&C.addEventListener("click",b=>{b.stopPropagation();try{let m=JSON.parse(C.getAttribute("data-course")||"{}"),v=`第${m.section||"?"}${m.span>1?"-"+(Number(m.section)+Number(m.span)-1):""}节`,x=(m.others||[]).map(_=>`<div class="uc-course-sub ${_.thisWeek?"":"is-fade"}">
              <div class="uc-cd-name">${n.escapeHtml(_.name||"")}</div>
              <div class="uc-cd-meta">${n.escapeHtml([_.place,_.week,_.teacher].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${_.thisWeek?"当前周有课":"当前周无课"}</div>
            </div>`).join("");k("课程详情",`
            <div class="uc-course-detail">
              <div class="uc-cd-name">${n.escapeHtml(m.name||"")}</div>
              <div class="uc-cd-meta">${n.escapeHtml([m.place,m.teacher,m.week].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${m.thisWeek?"当前周有课":"当前周无课"} · ${n.escapeHtml(v)} · ${n.escapeHtml(n.DAY_NAMES[m.day]||"")}</div>
            </div>
            ${x?'<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>'+x:""}
          `,"")}catch{}})}),w.querySelectorAll("[data-week-delta]").forEach(C=>{c(C,"weekDelta")&&C.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();let m=parseInt(C.getAttribute("data-week-delta")||"0",10)||0,v=p.schedule&&p.schedule.courses||[],x=n.inferMaxWeek(v),_=n.getViewWeekNumber();p.weekLocked=!0,p.viewWeek=Math.min(x,Math.max(1,_+m)),n.render();let q=document.querySelector("#urppp-clean-root .uc-week-label");q&&(q.classList.remove("uc-pop"),q.offsetWidth,q.classList.add("uc-pop"))})}),w.querySelectorAll("[data-week-reset]").forEach(C=>{c(C,"weekReset")&&C.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),p.weekLocked=!1;let m=n.getCurrentWeekNumber()||p._termWeek||1;p.viewWeek=m,n.render();let v=document.querySelector("#urppp-clean-root .uc-week-label");v&&(v.classList.remove("uc-pop"),v.offsetWidth,v.classList.add("uc-pop"))})})}a(d,"bindUI");let u=[];function k(w,T,C,b){b=b||{};let m=n.ensureRoot(),v=m.querySelector("#uc-mask"),x=m.querySelector("#uc-modal");b.stack&&x.classList.contains("open")?u.push({title:m.querySelector("#uc-modal-title").textContent,body:m.querySelector("#uc-modal-body").innerHTML,ft:m.querySelector("#uc-modal-ft").innerHTML}):b.stack||(u.length=0),v.classList.add("open"),x.classList.add("open"),m.querySelector("#uc-modal-title").textContent=w,m.querySelector("#uc-modal-body").innerHTML=T,m.querySelector("#uc-modal-ft").innerHTML=C||"",d(m.querySelector("#uc-modal-body")),d(m.querySelector("#uc-modal-ft")),n.applyPersonalDisplay(m.querySelector("#uc-modal"))}a(k,"openModal");function P(){let w=n.rootEl();if(w){if(u.length){let T=u.pop();w.querySelector("#uc-modal-title").textContent=T.title,w.querySelector("#uc-modal-body").innerHTML=T.body,w.querySelector("#uc-modal-ft").innerHTML=T.ft||"",d(w.querySelector("#uc-modal-body")),d(w.querySelector("#uc-modal-ft"));return}w.querySelector("#uc-mask").classList.remove("open"),w.querySelector("#uc-modal").classList.remove("open")}}a(P,"closeModal");function S(w){let T=p.scores&&p.scores.passing&&p.scores.passing[0]||{courses:[],summary:n.summarizeCourses([])},C=p.scores&&p.scores.schemes||[];w==="scheme"&&p.scores&&p.scores.majorIdx!=null&&p._schemeInited!==!0&&(p.activeSchemeIdx=p.scores.majorIdx||0,p._schemeInited=!0);let b=C[p.activeSchemeIdx]||C[0]||{courses:[],summary:n.summarizeCourses([]),title:"方案成绩"},m=w==="scheme"?b:T,v=w==="scheme"?"scheme":"passing";p.selected[v]||(p.selected[v]=new Set);let x=w==="scheme"&&C.length>1?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${C.map((Z,dt)=>`<button type="button" class="uc-btn ${dt===p.activeSchemeIdx?"primary":""}" data-scheme-idx="${dt}"><span data-urppp-private="organization">${n.escapeHtml((Z.title||"方案").slice(0,28))}</span></button>`).join("")}</div>`:"",_=a(Z=>{let dt=!!(Z&&(Z.unevaluated||n.isUnevaluatedScore(Z.score))),kt=n.scoreToNumber(Z&&Z.score),wt="";dt?wt=kt!=null&&kt<60?"uneval-fail":"uneval":kt!=null?wt=kt>=60?"pass":"fail":/不及格|不合格|不通过/.test(String(Z&&Z.score||""))?wt="fail":Z&&Z.score&&(wt="pass");let Et=n.escapeHtml(Z&&Z.score||"—"),N=dt?Z.evalUrl||"/student/teachingEvaluation/newEvaluation/index":"";return N?`<span class="uc-score-cell ${wt}" data-eval-url="${n.escapeHtml(N)}" title="未评教，点击前往评教">${Et}</span>`:`<span class="uc-score-cell ${wt}">${Et}</span>`},"scoreCellHtml"),q=(m.courses||[]).map((Z,dt)=>{let kt=p.selected[v].has(dt),wt=n.isValidOfficialGpa(Z.officialGpa)?Z.officialGpa:n.scoreToGpa(Z.score),Et=!!(Z.unevaluated||n.isUnevaluatedScore(Z.score));return`<tr class="${kt?"is-on":""}${Et?" is-uneval":""}" data-idx="${dt}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${kt?"✓":""}</span><span class="uc-cname">${n.escapeHtml(Z.name)}</span></td>
        <td><span class="uc-attr-pill">${n.escapeHtml(Z.attr||"—")}</span></td>
        <td data-urppp-private="credit">${Z.credit}</td>
        <td data-urppp-private="grade">${_(Z)}</td>
        <td data-urppp-private="gpa">${Et||wt==null?"—":wt}</td>
      </tr>`}).join("");k(w==="scheme"?"方案成绩 · "+(b.title||""):"全部及格成绩",`
      ${x}${n.metricHtml(m.summary,w==="scheme"?"scheme":"passing")}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${q||'<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`,'<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>');let I=document.querySelector("#uc-modal-title");I&&(w==="scheme"?I.setAttribute("data-urppp-private","organization"):I.removeAttribute("data-urppp-private"),n.applyPersonalDisplay(I.parentElement||I));let L=document.querySelector("#uc-modal-body"),O=document.getElementById("uc-calc"),M=document.getElementById("uc-score-table"),H=document.getElementById("uc-score-wrap"),G=document.getElementById("uc-select-box"),U=a(()=>{M.querySelectorAll("tbody tr[data-idx]").forEach(kt=>{let wt=parseInt(kt.getAttribute("data-idx"),10),Et=p.selected[v].has(wt);kt.classList.toggle("is-on",Et);let N=kt.querySelector(".uc-selmark");N&&(N.textContent=Et?"✓":"")});let Z=[];p.selected[v].forEach(kt=>{m.courses[kt]&&Z.push(m.courses[kt])});let dt=n.summarizeCoursesPreferOfficial(Z);O&&(O.className="uc-calc",O.innerHTML=Z.length?`已选 <b>${Z.length}</b> 门 · 学分 <b data-urppp-private="credit">${dt.totalCredit}</b> · 均分 <b data-urppp-private="grade">${dt.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${dt.avgGpa}</b>`:"已选 0 门")},"paint"),rt=a((Z,dt)=>{dt===!0?p.selected[v].add(Z):dt===!1||p.selected[v].has(Z)?p.selected[v].delete(Z):p.selected[v].add(Z)},"toggleIdx"),it=!1;M.querySelectorAll("tbody tr[data-idx]").forEach(Z=>{Z.addEventListener("click",dt=>{if(it){it=!1;return}let kt=parseInt(Z.getAttribute("data-idx"),10);rt(kt),U()})});let mt=!1,V=0,Q=0,at=null,X=a(()=>Array.from(M.querySelectorAll("tbody tr[data-idx]")),"rowsEls"),ct=a((Z,dt)=>{if(!G||!H)return{left:0,top:0,right:0,bottom:0,w:0,h:0};let kt=H.getBoundingClientRect(),wt=Math.min(V,Z),Et=Math.min(Q,dt),N=Math.max(V,Z),Y=Math.max(Q,dt),tt=N-wt,ht=Y-Et,bt=wt-kt.left+H.scrollLeft,Pt=Et-kt.top+H.scrollTop;return G.style.display=tt>3||ht>3?"block":"none",G.style.left=bt+"px",G.style.top=Pt+"px",G.style.width=tt+"px",G.style.height=ht+"px",{left:wt,top:Et,right:N,bottom:Y,w:tt,h:ht}},"placeBox"),et=a(Z=>{if(!mt)return;Z.preventDefault();let dt=ct(Z.clientX,Z.clientY);dt.w<=3&&dt.h<=3||(p.selected[v]=new Set(at),X().forEach(kt=>{let wt=kt.getBoundingClientRect();if(!!(wt.right<dt.left||wt.left>dt.right||wt.bottom<dt.top||wt.top>dt.bottom))return;let N=parseInt(kt.getAttribute("data-idx"),10);at.has(N)?p.selected[v].delete(N):p.selected[v].add(N)}),U())},"onMoveSel"),st=a(Z=>{let dt=Math.abs(Z.clientX-V)>3||Math.abs(Z.clientY-Q)>3;mt=!1,G&&(G.style.display="none"),document.removeEventListener("mousemove",et,!0),document.removeEventListener("mouseup",st,!0),dt&&(it=!0),U()},"onUpSel");H.addEventListener("mousedown",Z=>{Z.button===0&&(mt=!0,V=Z.clientX,Q=Z.clientY,at=new Set(p.selected[v]),ct(V,Q),document.addEventListener("mousemove",et,!0),document.addEventListener("mouseup",st,!0))}),L.querySelectorAll("[data-scheme-idx]").forEach(Z=>Z.addEventListener("click",()=>{p.activeSchemeIdx=parseInt(Z.getAttribute("data-scheme-idx"),10)||0,p._schemeUserSelected=!0,S("scheme")}));let ft=document.getElementById("uc-clear");ft&&(ft.onclick=()=>{p.selected[v]=new Set,U()}),U()}a(S,"openScoreModal");async function y(){k("空闲教室",'<div class="uc-loading">加载教学楼</div>',"");try{await n.ensureRoomCatalogLoaded(!1),k("空闲教室",n.roomPickerHtml(),'<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>')}catch(w){k("空闲教室",`<div class="uc-empty">${n.escapeHtml(w&&w.message||w)}</div>`,"")}}a(y,"openRoomModal");function A(w){if(w&&w.isConnected)return w;let T=document.querySelector("#uc-room-panel");if(T&&T.offsetParent!==null||T&&p.mobileTab==="room")return T;let C=document.querySelector("#uc-modal-body"),b=document.querySelector("#uc-modal");return b&&b.classList.contains("open")&&C?C:T||C||null}a(A,"getRoomHost");async function g(w,T,C){let b=A(C);if(!b){console.warn("[URP++] no room host");return}b.innerHTML='<div class="uc-loading">加载占用网格</div>';try{let m=await n.loadBuildingOccupancy(w);b.innerHTML='<div class="uc-loading">匹配课程名称</div>';let v=m.planNumber||"";if(!v)try{let q=await n.fetchText("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),I=JSON.parse(q);if(v=I&&(I.zxjxjhh||I.xnxq||I.dateList&&I.dateList[0]&&I.dateList[0].zxjxjhh)||"",!v&&I&&I.xkxx&&I.xkxx[0]){let L=Object.keys(I.xkxx[0]||{}),O=L.length?I.xkxx[0][L[0]]:null;v=O&&(O.zxjxjhh||O.executiveEducationPlanNumber)||""}}catch{}v||(v="2025-2026-2-1"),m.planNumber=v;try{m=await n.enrichOccupancyWithCurriculum(m,typeof w=="object"?w:{},v)}catch(q){console.warn("[URP++] enrich occupancy",q)}p.occupancy=m,p.roomDateOffset=Number(m.dateOffset!=null?m.dateOffset:p.roomDateOffset)||0;let x=typeof w=="object"?w:{path:w,name:T};p.currentBuilding=Object.assign({},x,{name:T||x.name||"",dateOffset:p.roomDateOffset}),T=T||w&&w.name||"";let _=A(b)||b;_.innerHTML=n.occupancyHtml(m,T),d(_)}catch(m){let v=A(b)||b;v&&(v.innerHTML=`<div class="uc-empty">${n.escapeHtml(m&&m.message||m)}</div>`)}}return a(g,"showBuilding"),{bindUI:d,closeModal:P,getRoomHost:A,openModal:k,openRoomModal:y,openScoreModal:S,showBuilding:g}}a(ii,"createCleanModeUI");function si({state:p,deps:n}){function c(){return document.getElementById("urppp-clean-root")}a(c,"rootEl");function d(){n.ensureStyle();let y=c();if(y)return y;y=document.createElement("div"),y.id="urppp-clean-root",y.innerHTML=`
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
      </div>`,document.documentElement.appendChild(y),y.querySelector("#uc-exit").onclick=k,y.querySelector("#uc-refresh").onclick=()=>u(!0),y.querySelector("#uc-mask").onclick=n.closeModal,y.querySelector("#uc-modal-close").onclick=n.closeModal;let A=a(()=>{n.syncThemeDotGroup(y.querySelector("#uc-top-theme"))},"syncCleanThemeDots");y.querySelectorAll("#uc-top-theme .urppp-nav-dot[data-theme]").forEach(v=>{v.addEventListener("click",()=>{n.handleThemeDotClick(v.dataset.theme),A();try{n.syncNavbarThemeUI()}catch{}try{n.syncSettingsPanelUI()}catch{}})});let g=y.querySelector("#uc-settings");g&&g.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation();try{n.openSettingsPanel()}catch{}});let w=y.querySelector("#uc-menu-toggle"),T=a(v=>{v.classList.remove("urppp-clean-sidebar");let x=v.__urpppCleanInline;if(x){let q=v.style,I=a((L,O)=>{let M=x[O];M&&M.v?q.setProperty(L,M.v,M.p||""):q.removeProperty(L)},"restore");I("top","top"),I("height","height"),I("z-index","z"),I("position","pos"),I("transform","transform"),I("visibility","vis"),I("pointer-events","pe"),I("transition","transition"),delete v.__urpppCleanInline}let _=v.__urpppCleanOrigin;_&&_.parent&&v.parentElement!==_.parent&&(_.next&&_.next.parentElement===_.parent?_.parent.insertBefore(v,_.next):_.parent.appendChild(v)),delete v.__urpppCleanOrigin},"restoreCleanSidebarInline"),C=a(()=>{let v=document.getElementById("sidebar");if(v)if(p.open){if(v.classList.add("urppp-clean-sidebar"),!v.__urpppCleanInline){let O=v.style,M=a(H=>({v:O.getPropertyValue(H),p:O.getPropertyPriority(H)}),"grab");v.__urpppCleanInline={top:M("top"),height:M("height"),z:M("z-index"),pos:M("position"),transform:M("transform"),vis:M("visibility"),pe:M("pointer-events"),transition:M("transition")},v.__urpppCleanOrigin={parent:v.parentElement,next:v.nextSibling}}if(v.parentElement!==y){let O=y.querySelector(".uc-shell");y.insertBefore(v,O||null)}let x=y.getBoundingClientRect(),_=y.querySelector(".uc-top"),q=_?_.getBoundingClientRect():null,I=Math.max(44,Math.round(q?q.bottom-x.top:60)),L=Math.max(0,Math.round(x.height-I));v.style.setProperty("top",I+"px","important"),v.style.setProperty("height",L+"px","important"),v.style.setProperty("z-index","12030","important"),v.style.setProperty("position","fixed","important")}else T(v)},"syncCleanSidebarZ"),b=a(()=>{let v=document.getElementById("sidebar");if(!v)return;try{n.stopDrawerAnimation(v)}catch{}v.classList.remove("display","urppp-drawer-closing"),T(v),w&&(w.setAttribute("aria-expanded","false"),w.setAttribute("aria-label","打开菜单"));let x=document.getElementById("urppp-mobile-menu-button");x&&(x.setAttribute("aria-expanded","false"),x.setAttribute("aria-label","打开菜单"))},"closeCleanSidebar");w&&w.addEventListener("click",v=>{v.preventDefault(),v.stopImmediatePropagation();let x=document.getElementById("sidebar");if(!x)return;x.__urpppCleanMenuBound||(x.__urpppCleanMenuBound=!0,x.addEventListener("click",I=>{if(!p.open)return;let L=I.target&&I.target.closest?I.target.closest("a[href]"):null;if(!L||L.closest("#urppp-mobile-search-panel"))return;let O=String(L.getAttribute("href")||"").trim();if(L.closest("#urppp-mobile-quick, #urppp-mobile-user")){if(!O||O==="#"||O.startsWith("javascript")||L.target==="_blank"||/^https?:\/\//i.test(O))return;k();return}!O||O==="#"||O.startsWith("javascript")||L.target==="_blank"||/^https?:\/\//i.test(O)||k()},!0));let _=!x.classList.contains("display");C(),n.setDrawerOpen(x,w,_);let q=document.getElementById("urppp-mobile-menu-button");q&&(q.setAttribute("aria-expanded",_?"true":"false"),q.setAttribute("aria-label",_?"关闭菜单":"打开菜单"))}),y.__closeCleanDrawer=b,y.__syncCleanSidebarZ=C,y.__syncCleanThemeDots=A;let m=globalThis.ResizeObserver;if(typeof m=="function"){let v=new m(()=>{p.open&&C()});v.observe(y);let x=y.querySelector(".uc-top");x&&v.observe(x),y.__cleanSidebarResizeObserver=v}try{let v=window.matchMedia&&window.matchMedia("(max-width: 900px)");if(v){let x=a(()=>{p.open&&(C(),n.render())},"onLayoutChange");typeof v.addEventListener=="function"?v.addEventListener("change",x):typeof v.addListener=="function"&&v.addListener(x),y.__scoreLayoutMedia=v,y.__scoreLayoutChange=x}}catch{}try{n.applySkinAttr()}catch{}return A(),y.querySelectorAll("#uc-tabbar button").forEach(v=>{v.onclick=()=>{p.mobileTab=v.dataset.tab,y.querySelectorAll("#uc-tabbar button").forEach(x=>x.classList.toggle("ac",x===v)),n.render(),p.mobileTab==="room"&&n.ensureRoomCatalogLoaded()}}),io(),ai(y),y}a(d,"ensureRoot");function u(y){d();let A=p.open;p.open=!0,p.uiReady=!1,p.weekLocked=!1;let g=n.getCurrentWeekNumber()||n.readRememberedTermWeek();p.viewWeek=g>=1?g:p.viewWeek>=1?p.viewWeek:0,document.documentElement.classList.add("urppp-clean-lock",n.CLEAN_FLAG);let w=c();w.classList.remove("closing"),A||(w.classList.remove("uc-settled","open"),w.offsetWidth,w.classList.add("open"));try{n.stopDrawerAnimation(document.getElementById("sidebar"))}catch{}try{w.__syncCleanThemeDots&&w.__syncCleanThemeDots()}catch{}try{w.__syncCleanSidebarZ&&w.__syncCleanSidebarZ()}catch{}try{n.injectCleanSidebarSections(document.getElementById("sidebar"))}catch{}n.loadAll(!!y);try{n.ensureRoomCatalogLoaded()}catch{}}a(u,"openCleanMode");function k(){p.open=!1,p.uiReady=!1,n.closeModal(),document.documentElement.classList.remove("urppp-clean-lock",n.CLEAN_FLAG);let y=c();if(y){y.classList.remove("open","uc-settled","uc-drawer-open"),y.classList.add("closing"),clearTimeout(y.__ucSettleTimer);try{y.__closeCleanDrawer&&y.__closeCleanDrawer()}catch{}setTimeout(()=>{y.classList.remove("closing")},360)}try{n.refreshMobileNavbar()}catch{}}a(k,"closeCleanMode");function P(){try{n.ensureStyle();let y=document.getElementById("urppp-nav-clean");if(!n.isHomePage()){y&&y.remove(),ni();return}let A=document.getElementById("urppp-nav-theme")||document.querySelector("#navbar .navbar-header")||document.querySelector("#navbar");if(!A)return;y||(y=document.createElement("button"),y.type="button",y.id="urppp-nav-clean",y.title="清爽模式",y.innerHTML=`${n.ico("clean")}<span>清爽</span>`,y.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),u(!1)}),A.appendChild(y)),Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none"}).forEach(([g,w])=>y.style.setProperty(g,w,"important")),io();try{oi()}catch{}}catch(y){console.warn("[URP++] clean entry",y)}}return a(P,"injectCleanEntry"),{cleanModeApi:{open:u,close:k,inject:P,refresh:n.refreshCleanPersonalDisplay,refreshRender:a(()=>{try{n.render()}catch{}},"refreshRender"),scoreToGpa:n.scoreToGpa,summarizeCourses:n.summarizeCourses},closeCleanMode:k,ensureRoot:d,injectCleanEntry:P,openCleanMode:u,rootEl:c}}a(si,"createCleanModeController");function li({deps:p}){function n(){if(window.__urpppScheduleHoverNear)return;window.__urpppScheduleHoverNear=!0;let P=12,S=16,y=0,A=0,g=!1,w=0,T=a(()=>document.getElementById("schedule-hover"),"hoverEl"),C=a(v=>{if(!v||v.style&&v.style.display==="none")return!1;let x=window.getComputedStyle(v);return x.display!=="none"&&x.visibility!=="hidden"},"isShown"),b=a(()=>{let v=T();if(!v||!C(v)){g=!1;return}g=!0;let x=window.innerWidth||1200,_=window.innerHeight||800,q=y+P,I=A+S,L=Math.min(320,v.offsetWidth||280),O=Math.min(220,v.offsetHeight||160);q+L>x-8&&(q=x-L-8),I+O>_-8&&(I=_-O-8),q<8&&(q=8),I<8&&(I=8),v.style.setProperty("position","fixed","important"),v.style.setProperty("left",Math.round(q)+"px","important"),v.style.setProperty("top",Math.round(I)+"px","important"),v.style.setProperty("right","auto","important"),v.style.setProperty("bottom","auto","important"),v.style.setProperty("margin","0","important"),v.style.setProperty("z-index","3000","important"),v.style.setProperty("pointer-events","none","important")},"place"),m=a(()=>{w||(w=requestAnimationFrame(()=>{w=0,b()}))},"schedulePlace");document.addEventListener("mousemove",v=>{if(y=v.clientX,A=v.clientY,!g){let x=T();x&&x.style&&x.style.display&&x.style.display!=="none"&&(g=!0)}g&&m()},!0),document.addEventListener("mouseover",v=>{v.target&&v.target.closest&&v.target.closest(".fc-event, .fc-time-grid-event")&&(y=v.clientX,A=v.clientY,setTimeout(()=>{g=!0,b()},0),setTimeout(b,40))},!0),document.addEventListener("mouseout",v=>{v.target&&v.target.closest&&v.target.closest(".fc-event, .fc-time-grid-event")&&setTimeout(()=>{let _=T();C(_)||(g=!1)},50)},!0)}a(n,"bindScheduleHoverNearCursor");function c(P){try{let S=!!(P&&P.force),y=typeof unsafeWindow<"u"&&unsafeWindow.jQuery?unsafeWindow.jQuery:window.jQuery||null;if(!y||!y.fn||!y.fn.fullCalendar)return!1;let A=document.getElementById("main-calendar")||document.querySelector("#urppp-left .fc, #urppp-dashboard .fc");if(!A)return!1;if(!S&&A.dataset.urpppFcSized==="1")return!0;let g=y(A);if(!(g.data("fullCalendar")||g.hasClass("fc")))return!1;let T=Array.from(A.querySelectorAll(".fc-scroller")).map(b=>({el:b,top:b.scrollTop,left:b.scrollLeft}));if(S||A.dataset.urpppFcRendered!=="1"){try{g.fullCalendar("render")}catch{}A.dataset.urpppFcRendered="1"}else try{g.fullCalendar("updateSize")}catch{}return requestAnimationFrame(()=>{T.forEach(b=>{try{b.el.scrollTop=b.top,b.el.scrollLeft=b.left}catch{}})}),(A.getBoundingClientRect().height||0)>=300&&(A.dataset.urpppFcSized="1"),!0}catch(S){return console.warn("[URP++] fullCalendar refresh failed",S),!1}}a(c,"refreshHomeFullCalendar");function d(){window.__urpppFcRefreshBound||(window.__urpppFcRefreshBound=!0,setTimeout(()=>c({force:!0}),0),setTimeout(()=>c({force:!1}),300))}a(d,"scheduleHomeFullCalendarRefresh");function u(P,S,y){let A=P.querySelector(".widget-header"),g=A?A.querySelector(".widget-toolbar"):null,w=document.createElement("div");w.className="urppp-card",w.innerHTML=`
      <div class="urppp-card-header">
        <h4>${y}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `,g&&(g.style.display="inline-block",w.querySelector(".urppp-card-tools").appendChild(g)),w.querySelector(".urppp-card-body").appendChild(P),S.appendChild(w)}a(u,"wrapWidget");function k(){try{n()}catch{}if(document.getElementById("urppp-dashboard"))return;let P=document.querySelector(".page-content");if(!P)return;let S=Array.from(P.querySelectorAll(".widget-box"));if(S.length<6)return;let y=S[4],A=y?Array.from(y.querySelectorAll(".infobox")):[],g=document.createElement("div");g.id="urppp-dashboard",g.innerHTML=`
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `,P.appendChild(g);let w=P.querySelector("#warningInfo");w&&document.body.appendChild(w),S.forEach(x=>{let _=x.closest('.widget-container-col, [class*="col-"]');_&&(_.style.display="none")}),P.querySelectorAll(":scope > .row").forEach(x=>{x.style.display="none"});let T=g.querySelector("#urppp-stats"),C=Math.max(A.length,5);for(let x=0;x<C;x++){let _=document.createElement("div");_.className="urppp-stat-card urppp-stat-skeleton",_.innerHTML='<div class="value">-</div><div class="label">加载中</div>',T.appendChild(_)}function b(){let x=y?Array.from(y.querySelectorAll(".infobox")):[];x.length!==0&&(T.innerHTML="",x.forEach(_=>{let q=_.innerText.trim().split(/\n+/).map(rt=>rt.trim()).filter(rt=>rt),I=q[0]||"",L=q.slice(1).join(" ").replace(/更多\.\.\./g,"").trim(),M=/[\u4e00-\u9fa5]/.test(I)||I.length>5?"value urppp-stat-value-text":"value",H=_.closest("a"),G=document.createElement(H?"a":"div");H&&(G.href=H.href||"javascript:void(0)",G.onclick=H.onclick,G.style.textDecoration="none"),G.className="urppp-stat-card";let U=p.statCardPrivacyMarkup(I,L);G.innerHTML=`<div class="${M}">${U.valueHtml}</div><div class="label">${U.labelHtml}</div>`,T.appendChild(G)}))}if(a(b,"updateStats"),b(),y){let x=new MutationObserver(()=>b());x.observe(y,{childList:!0,subtree:!0}),setTimeout(()=>x.disconnect(),5e3)}let m=g.querySelector("#urppp-left"),v=g.querySelector("#urppp-right");u(S[5],m,"我的日程安排"),u(S[0],v,"通知公告"),u(S[1],v,"我的待办任务"),u(S[2],v,"可申请业务"),u(S[3],v,"常用下载"),y&&(y.style.display="none"),d(),console.log("[URP++] 首页仪表板已重构")}return a(k,"rebuildDashboard"),{rebuildDashboard:k,refreshHomeFullCalendar:c,scheduleHomeFullCalendarRefresh:d,wrapWidget:u}}a(li,"createDashboardController");function fr(p){return Math.round((Number(p)||0)*100)/100}a(fr,"round2");var ic=[{key:"a",level:"A",range:"90-100",gpa:4,min:90,max:100},{key:"am",level:"A-",range:"85-89",gpa:3.7,min:85,max:89.999},{key:"bp",level:"B+",range:"82-84",gpa:3.3,min:82,max:84.999},{key:"b",level:"B",range:"78-81",gpa:3,min:78,max:81.999},{key:"bm",level:"B-",range:"75-77",gpa:2.7,min:75,max:77.999},{key:"cp",level:"C+",range:"72-74",gpa:2.3,min:72,max:74.999},{key:"c",level:"C",range:"68-71",gpa:2,min:68,max:71.999},{key:"cm",level:"C-",range:"64-67",gpa:1.7,min:64,max:67.999},{key:"dp",level:"D+",range:"60-63",gpa:1.3,min:60,max:63.999},{key:"d",level:"D",range:"60-62",gpa:1,min:60,max:62.999},{key:"f",level:"F",range:"<60",gpa:0,min:0,max:59.999}],ci={优秀:95,"A+":98,A:95,"A-":87,良好:85,"B+":83,B:79,"B-":76,中等:73,"C+":73,C:69,"C-":65,及格:62,"D+":62,D:60,不及格:50,F:50},sc=[{key:"required",label:"必修",test:a(p=>/必修/.test(p),"test")},{key:"elective",label:"任选",test:a(p=>/任选/.test(p),"test")},{key:"optional",label:"选修",test:a(p=>/选修/.test(p),"test")},{key:"other",label:"其他",test:a(()=>!0,"test")}];function di(p){let n=String(p||"").match(/^(\d{4})-(\d{4})-(\d+)/);return n?`${n[1].slice(2)}-${n[2].slice(2)}-${n[3]}`:String(p||"")}a(di,"shortTerm");function ta({deps:p}){let n=p.scoreToNumber,c=p.scoreToGpa;function d(b){let m=n(b);if(m!=null)return m;let v=String(b||"").trim().toUpperCase();return ci[v]!=null?ci[v]:null}a(d,"scoreToNumberWithLevels");function u(b){return!b||b.unevaluated?!1:d(b.score)!=null}a(u,"hasScore");function k(b){let m=String(b||"").match(/^(\d{4})-(\d{4})-(\d+)/);return m?[Number(m[1]),Number(m[3])]:[9999,9999]}a(k,"termOrderKey");function P(b){let m=b&&b.passing&&b.passing[0];return m&&m.courses||[]}a(P,"allCourses");function S(b){let m=b&&b.officialGpa,v=Number(m);return m!=null&&Number.isFinite(v)&&v>=0&&v<=5?v:null}a(S,"officialGpa");function y(b){let m=S(b);return m??c(b.score)}a(y,"courseGpa");function A({scorePack:b,profile:m}){let v=P(b),x=m&&m.majorGpa?String(m.majorGpa).trim():"",_=0,q=0,I=0,L=0,O=0,M=0;return v.forEach(H=>{if(!u(H))return;let G=Number(H.credit)||0,U=d(H.score);if(U==null||G<=0)return;_+=G,q+=U*G;let rt=y(H);rt!=null&&(I+=rt*G,L+=G,H.required&&(O+=rt*G,M+=G))}),{majorGpa:x,requiredGpa:fr(M?O/M:0),avgGpa:fr(L?I/L:0),avgScore:fr(_?q/_:0),totalCredit:fr(_),courseCount:v.length}}a(A,"computeMetrics");function g(b){let m=new Map;return(b||[]).forEach(v=>{if(!u(v))return;let x=v.term||"未分组",_=m.get(x);_||(_={term:x,count:0,credit:0,scoreW:0,gpaW:0,gpaCredit:0},m.set(x,_));let q=Number(v.credit)||0,I=d(v.score);if(I==null||(_.count+=1,q<=0))return;_.credit+=q,_.scoreW+=I*q;let L=y(v);L!=null&&(_.gpaW+=L*q,_.gpaCredit+=q)}),Array.from(m.values()).map(v=>({term:v.term,label:di(v.term),count:v.count,credit:fr(v.credit),avgScore:fr(v.credit?v.scoreW/v.credit:0),avgGpa:fr(v.gpaCredit?v.gpaW/v.gpaCredit:0)})).sort((v,x)=>{let _=k(v.term),q=k(x.term);return _[0]-q[0]||_[1]-q[1]})}a(g,"computeTrend");function w(b){let m=ic.map(x=>({...x,count:0,credit:0}));(b||[]).forEach(x=>{if(!u(x))return;let _=d(x.score);if(_==null)return;let q=m.find(I=>_>=I.min&&_<=I.max);q&&(q.count+=1,q.credit+=Number(x.credit)||0)});let v=m.reduce((x,_)=>Math.max(x,_.count),1);return m.map(x=>({...x,ratio:Math.round(x.count/v*100)}))}a(w,"computeBands");function T(b){let m=sc.map(q=>({...q,credit:0,count:0}));(b||[]).forEach(q=>{if(!u(q))return;let I=String(q.attr||""),L=m.find(O=>O.test(I));L&&(L.credit+=Number(q.credit)||0,L.count+=1)});let v=m.reduce((q,I)=>q+I.credit,0)||1,x=m.filter(q=>q.count>0).map(q=>({key:q.key,label:q.label,credit:fr(q.credit),count:q.count,ratio:Math.round(q.credit/v*100)})),_=x.find(q=>q.key==="required");return{items:x,requiredCredit:_?_.credit:0,requiredRatio:_?_.ratio:0}}a(T,"computeShare");function C({scorePack:b,profile:m}){let v=P(b);return{metrics:A({scorePack:b,profile:m}),trend:g(v),bands:w(v),share:T(v),empty:v.length===0}}return a(C,"analyzeScores"),{analyzeScores:C,hasScore:u,officialGpa:S,scoreToNumberWithLevels:d,shortTerm:di}}a(ta,"createScoreAnalysisData");var ar="var(--text-secondary)",lo="var(--border)";function or(p){return pt(String(p??""))}a(or,"escapeLabel");function ui(p,n,c){let d=!!(p&&p.variant==="mobile");if(n==="trend"){if(!d)return{mobile:d,width:920,height:330,pad:{top:36,right:30,bottom:46,left:30}};let P={top:58,right:20,bottom:44,left:20},S=Math.max(56,Number(p&&p.slotWidth)||72);return{mobile:d,width:Math.max(300,P.left+P.right+Math.max(1,c)*S),height:286,pad:P}}if(!d)return{mobile:d,width:660,height:236,pad:{top:28,right:14,bottom:44,left:14}};let u={top:28,right:14,bottom:44,left:14},k=Math.max(44,Number(p&&p.slotWidth)||48);return{mobile:d,width:Math.max(320,u.left+u.right+Math.max(1,c)*k),height:236,pad:u}}a(ui,"resolveChartLayout");function so({width:p,height:n,mobile:c,kind:d,label:u}){let k=c?` data-urppp-chart-layout="mobile" style="width:max(100%,${p}px);max-width:none;height:auto"`:"";return`<svg viewBox="0 0 ${p} ${n}" class="urppp-sa-chart" role="img" aria-label="${u}" data-urppp-chart-kind="${d}"${k}>`}a(so,"openSvg");function ra({trend:p,palette:n,layout:c}){let d=(p||[]).filter(et=>et&&et.avgScore!=null),u=ui(c,"trend",d.length),{width:k,height:P,pad:S,mobile:y}=u,A=k-S.left-S.right,g=P-S.top-S.bottom;if(!d.length)return`${so({...u,kind:"trend",label:"学期成绩趋势"})}</svg>`;let w=d.length,T=a(et=>S.left+(et+.5)*(A/w),"xAt"),C=d.map(et=>Number(et.avgGpa)||0),b=d.map(et=>Number(et.avgScore)||0),m=d.map(et=>Number(et.credit)||0),v=Math.max(0,Math.min(...C)-.2),x=Math.min(5,Math.max(...C)+.2),_=Math.max(0,Math.min(...b)-4),q=Math.min(100,Math.max(...b)+4),I=Math.max(1,...m),L=x-v||1,O=q-_||1,M=a(et=>S.top+g-(et-v)/L*g,"yGpa"),H=a(et=>S.top+g-(et-_)/O*g,"yScore"),G=a(et=>S.top+g-et/I*g*.9,"yCredit"),U=d.map((et,st)=>`${T(st)},${M(et.avgGpa)}`).join(" "),rt=d.map((et,st)=>`${T(st)},${H(et.avgScore)}`).join(" "),it=[0,.25,.5,.75,1].map(et=>{let st=S.top+g-et*g;return`<line x1="${S.left}" y1="${st.toFixed(1)}" x2="${k-S.right}" y2="${st.toFixed(1)}" stroke="${lo}" stroke-width="1" stroke-dasharray="3 4"/>`}).join(""),mt=d.map((et,st)=>{let ft=T(st),Z=y?Math.min(30,A/w*.42):Math.min(26,A/w*.32),dt=G(et.credit);return`<rect x="${(ft-Z/2).toFixed(1)}" y="${dt.toFixed(1)}" width="${Z.toFixed(1)}" height="${(S.top+g-dt).toFixed(1)}" rx="3" fill="${n.credit}" opacity="0.55"/>
<text x="${ft.toFixed(1)}" y="${(dt-4).toFixed(1)}" text-anchor="middle" font-size="12" fill="${ar}">${or(et.credit)}</text>`}).join(""),V=d.map((et,st)=>`<text x="${T(st).toFixed(1)}" y="${P-16}" text-anchor="middle" font-size="12" fill="${ar}">${or(et.label)}</text>`).join(""),Q=d.map((et,st)=>{let ft=A/w,Z=T(st)-ft/2,dt=[`学期 ${et.label}`,`课程 ${et.count} 门`,`修读学分 ${et.credit}`,`加权均分 ${et.avgScore}`,`平均绩点 ${et.avgGpa}`].join(`
`);return`<rect class="urppp-sa-hover" x="${Z.toFixed(1)}" y="${S.top}" width="${ft.toFixed(1)}" height="${g.toFixed(1)}" fill="transparent"><title>${or(dt)}</title></rect>`}).join(""),at=d.map((et,st)=>`<circle cx="${T(st).toFixed(1)}" cy="${M(et.avgGpa).toFixed(1)}" r="3.5" fill="${n.gpaLine}"/><text x="${T(st).toFixed(1)}" y="${(M(et.avgGpa)-9).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${n.gpaLine}">${or(et.avgGpa)}</text>`).join(""),X=d.map((et,st)=>`<circle cx="${T(st).toFixed(1)}" cy="${H(et.avgScore).toFixed(1)}" r="3" fill="${n.scoreLine}"/><text x="${T(st).toFixed(1)}" y="${(H(et.avgScore)+17).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="${n.scoreLine}">${or(et.avgScore)}</text>`).join(""),ct=y?`<g font-size="12">
  <rect x="${S.left}" y="30" width="12" height="12" rx="3" fill="${n.gpaLine}"/><text x="${S.left+18}" y="40" fill="${ar}">学期平均绩点</text>
  <rect x="${S.left+132}" y="30" width="12" height="12" rx="3" fill="${n.scoreLine}"/><text x="${S.left+150}" y="40" fill="${ar}">加权均分</text>
</g>`:`<g font-size="12">
  <rect x="${k-S.right-176}" y="8" width="12" height="12" rx="3" fill="${n.gpaLine}"/><text x="${k-S.right-158}" y="18" fill="${ar}">学期平均绩点</text>
  <rect x="${k-S.right-82}" y="8" width="12" height="12" rx="3" fill="${n.scoreLine}"/><text x="${k-S.right-64}" y="18" fill="${ar}">加权均分</text>
</g>`;return`${so({...u,kind:"trend",label:"学期成绩趋势"})}
${it}
${mt}
<g>${Q}</g>
<text x="${S.left}" y="18" font-size="12" fill="${ar}">每学期修读学分（柱）</text>
<g stroke="${n.gpaLine}" stroke-width="2.2" fill="none"><polyline points="${U}"/></g>
<g stroke="${n.scoreLine}" stroke-width="1.8" stroke-dasharray="5 4" fill="none"><polyline points="${rt}"/></g>
<g>${at}</g>
<g>${X}</g>
<g>${V}</g>
${ct}
</svg>`}a(ra,"trendChartSvg");function ea({bands:p,palette:n,layout:c}){let d=p||[],u=ui(c,"bands",d.length),{width:k,height:P,pad:S,mobile:y}=u,A=k-S.left-S.right,g=P-S.top-S.bottom,w=d.length||1,T=Math.max(1,...d.map(m=>m.count)),C=y?Math.min(32,A/w*.62):Math.min(40,A/w*.52),b=d.map((m,v)=>{let x=S.left+(v+.5)*(A/w),_=m.count?Math.max(8,m.count/T*g):0,q=S.top+g-_,I=(.4+(1-v/(w-1))*.6).toFixed(2),L=m.range||(m.min===0?"<60":`${m.min}-${m.max===100?"100":m.max}`),O=[`${m.level||""}（绩点 ${m.gpa}）`,`百分制 ${L}`,`课程 ${m.count} 门`].join(`
`);return`<rect class="urppp-sa-band" x="${(x-C/2).toFixed(1)}" y="${q.toFixed(1)}" width="${C.toFixed(1)}" height="${_.toFixed(1)}" rx="4" fill="${n.primary}" opacity="${I}"><title>${or(O)}</title></rect>
<text x="${x.toFixed(1)}" y="${(q-6).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)">${or(m.count)}</text>
<text x="${x.toFixed(1)}" y="${P-26}" text-anchor="middle" font-size="11" font-weight="600" fill="${ar}">${or(L)}</text>
<text x="${x.toFixed(1)}" y="${P-12}" text-anchor="middle" font-size="12" fill="${ar}">${or(m.gpa)}</text>`}).join("");return`${so({...u,kind:"bands",label:"成绩分段分布"})}
<line x1="${S.left}" y1="${(S.top+g).toFixed(1)}" x2="${k-S.right}" y2="${(S.top+g).toFixed(1)}" stroke="${lo}" stroke-width="1"/>
${b}
</svg>`}a(ea,"bandsChartSvg");function mi({items:p,requiredRatio:n,palette:c}){let S=2*Math.PI*56,y=(p||[]).filter(T=>T&&T.ratio>0),A=Math.max(0,Math.min(100,Math.round(Number(n)||0)));if(!y.length)return'<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成"></svg>';let g=-90,w=y.map(T=>{let C=T.ratio/100*S,m=`<circle cx="75" cy="75" r="56" fill="none" stroke="${c.share&&c.share[T.key]||c.required}" stroke-width="24"
  stroke-dasharray="${C.toFixed(2)} ${S.toFixed(2)}"
  stroke-linecap="butt" transform="rotate(${g.toFixed(2)} 75 75)"/>`;return g+=T.ratio/100*360,m}).join("");return`<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成">
<circle cx="75" cy="75" r="56" fill="none" stroke="${lo}" stroke-width="24"/>
${w}
<text x="75" y="69" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${or(A)}%</text>
<text x="75" y="91" text-anchor="middle" font-size="11.5" fill="${ar}">必修学分占比</text>
</svg>`}a(mi,"donutSvg");var lc=Object.freeze({gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)",share:Object.freeze({required:"var(--primary)",elective:"var(--text-muted)",optional:"var(--text-secondary)",other:"var(--border)"})}),cc='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>',dc='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';function bi({deps:p}){let n=p&&p.palette||lc;function c(){return`<div id="urppp-score-analysis" class="urppp-sa" data-urppp-sa-state="collapsed">
  <button type="button" class="urppp-sa-toggle" aria-expanded="false">
    <span class="urppp-sa-icon">${cc}</span>
    <span class="urppp-sa-title">成绩分析</span>
    <span class="urppp-sa-summary" data-urppp-sa-summary>点击展开，查看成绩指标与学期变化</span>
    <span class="urppp-sa-chevron">${dc}</span>
  </button>
  <div class="urppp-sa-body" data-urppp-sa-body hidden>
    <div class="urppp-sa-content" data-urppp-sa-content></div>
  </div>
</div>`}a(c,"panelShellHtml");function d(){return'<div class="urppp-sa-loading"><span class="urppp-sa-spinner"></span><span>正在计算成绩分析…</span></div>'}a(d,"loadingHtml");function u(A){return`<div class="urppp-sa-error">${pt(String(A||"成绩数据加载失败"))}
  <button type="button" class="urppp-sa-retry" data-urppp-sa-retry>重试</button></div>`}a(u,"errorHtml");function k(A){return[{label:"主修必修绩点",value:A.requiredGpa>0?String(A.requiredGpa):"—",hint:"必修课程加权"},{label:"平均绩点",value:A.avgGpa!=null?String(A.avgGpa):"—",hint:"全部及格加权"},{label:"加权均分",value:A.avgScore!=null?String(A.avgScore):"—",hint:"学分加权"},{label:"已修学分",value:A.totalCredit!=null?String(A.totalCredit):"—",hint:"及格课程学分"},{label:"已修课程",value:String(A.courseCount||0),hint:"含未评估"}].map(w=>`<div class="urppp-sa-metric">
  <div class="urppp-sa-metric-value">${pt(w.value)}</div>
  <div class="urppp-sa-metric-label">${pt(w.label)}</div>
  <div class="urppp-sa-metric-hint">${pt(w.hint)}</div>
</div>`).join("")}a(k,"metricCards");function P(A){return`<table class="urppp-sa-table">
<thead><tr><th>学期</th><th>课程</th><th>学分</th><th>加权均分</th><th>平均绩点</th></tr></thead>
<tbody>${(A||[]).map(w=>`<tr><td>${pt(w.label)}</td><td>${pt(w.count)}</td><td>${pt(w.credit)}</td><td>${pt(w.avgScore)}</td><td>${pt(w.avgGpa)}</td></tr>`).join("")}</tbody></table>`}a(P,"detailTable");function S(A){return(A||[]).map(g=>`<div class="urppp-sa-legend-item"><i class="urppp-sa-legend-dot" style="background:${n.share&&n.share[g.key]||n.primary}"></i>${pt(g.label)} ${pt(g.credit)} 学分 · ${pt(g.count)} 门</div>`).join("")}a(S,"shareLegend");function y(A,g={}){if(!A||A.empty)return'<div class="urppp-sa-empty">暂无可用成绩数据，请先在教务系统查询成绩后再试。</div>';let w=A.share||{items:[],requiredRatio:0},T=g.chartLayout||null;return`<div class="urppp-sa-metrics">${k(A.metrics)}</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-trend">
    <h5 class="urppp-sa-card-title">学期趋势</h5>
    <div class="urppp-sa-chart-scroll">${ra({trend:A.trend,palette:n,layout:T})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-share">
    <h5 class="urppp-sa-card-title">课程类型构成</h5>
    <div class="urppp-sa-share-body">
      <div class="urppp-sa-donut">${mi({items:w.items,requiredRatio:w.requiredRatio,palette:n})}</div>
      <div class="urppp-sa-legend">${S(w.items)}</div>
    </div>
  </section>
</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-bands">
    <h5 class="urppp-sa-card-title">成绩分段分布</h5>
    <div class="urppp-sa-chart-scroll">${ea({bands:A.bands,palette:n,layout:T})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-detail">
    <h5 class="urppp-sa-card-title">各学期明细</h5>
    ${P(A.trend)}
  </section>
</div>`}return a(y,"analysisHtml"),{panelShellHtml:c,loadingHtml:d,errorHtml:u,analysisHtml:y,palette:n}}a(bi,"createScoreAnalysisRenderer");function hi(){function p(n,c){let d=n.querySelector(".urppp-sa-toggle"),u=n.querySelector("[data-urppp-sa-body]");if(!d||!u)return{isExpanded:a(()=>!1,"isExpanded"),setExpanded:a(()=>{},"setExpanded"),syncShareLayout:a(()=>{},"syncShareLayout")};let k=a(S=>{let y=S?"expanded":"collapsed";n.dataset.urpppSaState=y,d.setAttribute("aria-expanded",String(S)),u.hidden=!S,S&&typeof c.onExpand=="function"&&c.onExpand()},"setExpanded");d.addEventListener("click",()=>{let S=d.getAttribute("aria-expanded")==="true";k(!S)}),u.addEventListener("click",S=>{let y=S.target;y&&y.closest&&y.closest("[data-urppp-sa-retry]")&&typeof c.onRetry=="function"&&c.onRetry()});function P(){let S=n.querySelector(".urppp-sa-donut"),y=n.querySelector(".urppp-sa-legend"),A=!!(S&&y&&y.getBoundingClientRect().top>=S.getBoundingClientRect().bottom);n.classList.toggle("urppp-sa-share-stacked",A)}return a(P,"syncShareLayout"),{setExpanded:k,syncShareLayout:P,isExpanded:a(()=>d.getAttribute("aria-expanded")==="true","isExpanded")}}return a(p,"bindPanel"),{bindPanel:p}}a(hi,"createScoreAnalysisUI");var gi="urppp-score-analysis";function fi({deps:p}){let n=ta({deps:p}),c=bi({deps:p}),d=hi(),u=null,k="idle",P=null,S=null,y=null,A=!1,g=0,w="desktop";function T(){if(!p.styles||document.getElementById("urppp-score-analysis-style"))return;let U=document.createElement("style");U.id="urppp-score-analysis-style",U.textContent=p.styles,(document.head||document.documentElement).appendChild(U)}a(T,"ensureStyle");function C(){if(typeof p.getInsertHost=="function"){let U=p.getInsertHost();if(U)return U}return document.querySelector(".page-content")||document.getElementById("page-content-template")||document.body}a(C,"findHost");function b(){return u&&u.querySelector("[data-urppp-sa-content]")}a(b,"contentEl");function m(){return P||(k="loading",P=(async()=>{try{let[U,rt]=await Promise.all([p.loadScores(),p.loadProfile()]);if(U&&U.error)throw new Error(U.error);let it=n.analyzeScores({scorePack:U,profile:rt});return S=it,k="ready",it}catch(U){throw k="error",U}finally{P=null}})(),P)}a(m,"startLoad");function v(){k==="idle"&&m().catch(()=>{})}a(v,"warmup");function x(){if(y&&typeof y.syncShareLayout=="function")try{y.syncShareLayout()}catch{}}a(x,"syncShareLayout");function _(){try{if(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches)return{variant:"mobile"}}catch{}return null}a(_,"currentChartLayout");function q(){let U=b();if(!U||!S)return;let rt=_();w=rt?rt.variant:"desktop",U.innerHTML=c.analysisHtml(S,{chartLayout:rt}),x()}a(q,"renderReadyAnalysis");function I(){clearTimeout(g),g=setTimeout(()=>{if(x(),!S||!y||!y.isExpanded())return;let U=_();(U?U.variant:"desktop")!==w&&q()},120)}a(I,"handleResize");function L(){A||(A=!0,window.addEventListener("resize",I))}a(L,"bindResize");function O(){A&&(A=!1,clearTimeout(g),g=0,window.removeEventListener("resize",I))}a(O,"unbindResize");async function M(){let U=b();if(U){if(k==="ready"&&S){q();return}U.innerHTML=c.loadingHtml();try{await m(),q()}catch(rt){U.innerHTML=c.errorHtml(rt&&rt.message||String(rt))}}}a(M,"handleExpand");function H(){if(T(),u&&u.isConnected)return u;if(document.getElementById(gi))return document.getElementById(gi);let U=C();if(!U)return null;let rt=document.createElement("div");return rt.innerHTML=c.panelShellHtml(),u=rt.firstElementChild,U.insertBefore(u,U.firstChild),y=d.bindPanel(u,{onExpand:M,onRetry:M}),L(),v(),p.shouldAutoExpand&&p.shouldAutoExpand()&&(typeof requestAnimationFrame=="function"?requestAnimationFrame:mt=>setTimeout(mt,0))(()=>{try{y.setExpanded(!0)}catch{}}),u}a(H,"mount");function G(){O(),u&&u.isConnected&&u.remove(),u=null,y=null,k="idle",P=null,S=null,w="desktop"}return a(G,"unmount"),{mount:H,unmount:G,getPanel:a(()=>u,"getPanel"),reset:G}}a(fi,"createScoreAnalysisController");function xi({documentRef:p=document,locationRef:n=location,windowRef:c=window}){function d(A){return String(A||"").replace(/[\u00a0\s]+/g," ").replace(/^[>\u25b8\u203a·•\u00bb]+/,"").replace(/^\s*[\u25b8>]\s*/,"").trim()}a(d,"cleanMenuLabel");function u(A){if(!A)return"";let g=A.querySelector(":scope > a");if(!g)return"";let w=g.querySelector(".menu-text, .urppp-nav-text");if(w)return d(w.textContent);let T=g.cloneNode(!0);return T.querySelectorAll("i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow").forEach(C=>C.remove()),d(T.textContent)}a(u,"getMenuLiLabel");function k(A){let g=[],w=A,T=p.getElementById("menus")||p.getElementById("urppp-menus");for(;w&&w!==T;){if(w.tagName==="LI"){let C=u(w);C&&!/^(首页|一级菜单|二级菜单|三级菜单)$/.test(C)&&g.unshift(C)}w=w.parentElement}return g.filter((C,b)=>C&&C!==g[b-1])}a(k,"walkMenuAncestors");function P(){let A=n.pathname.replace(/\/+$/,"")||"/",g=n.search||"",w=[];return[p.getElementById("menus"),p.getElementById("urppp-menus")].filter(Boolean).forEach(C=>{C.querySelectorAll("a[href]").forEach(b=>{let m=b.getAttribute("href")||"";if(!(!m||m==="#"||m.startsWith("javascript")))try{let v=new URL(m,n.origin),x=v.pathname.replace(/\/+$/,"")||"/";if(x==="/"&&A!=="/")return;let _=0;A===x?_=1e3+x.length:A.startsWith(x+"/")?_=500+x.length:A.includes(x)&&x.length>8&&(_=200+x.length),_&&g&&v.search&&g.indexOf(v.search.slice(1))>=0&&(_+=50),_>0&&w.push({score:_,li:b.closest("li")})}catch{}})}),w.sort((C,b)=>b.score-C.score),w.length?w[0].li:null}a(P,"findMenuLiByPath");function S(){let A=P();if(A){let m=k(A);if(m.length)return m}let g="";try{let m=p.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);m&&(g=decodeURIComponent(m[1]))}catch{}if(g&&g!=="0"){let m=p.getElementById(g);if(m){let v=k(m);if(v.length)return v}}let w=null,T=Array.from(p.querySelectorAll("#menus li.active"));if(T.length){w=T[T.length-1];for(let m=T.length-1;m>=0;m--)if(!T[m].querySelector("li.active")){w=T[m];break}}if(!w){let m=Array.from(p.querySelectorAll("#urppp-menus .urppp-nav-item.active"));if(m.length){w=m[m.length-1];for(let v=m.length-1;v>=0;v--)if(!m[v].querySelector(".urppp-nav-item.active")){w=m[v];break}}}if(w){let m=k(w);if(m.length)return m}let C=p.getElementById("breadcrumbs")||p.querySelector(".breadcrumbs"),b=C&&(C.querySelector("ul.breadcrumb")||C.querySelector(".breadcrumb"));if(b){let m=[];if(Array.from(b.children).forEach((v,x)=>{if(x===0)return;let _=d(v.textContent);!_||/^(首页|一级菜单|二级菜单|三级菜单)$/.test(_)||m[m.length-1]!==_&&m.push(_)}),m.length)return m}return[]}a(S,"getBreadcrumbTrail");function y(){let A=p.getElementById("breadcrumbs")||p.querySelector(".breadcrumbs");if(!A)return;A.classList.remove("hide"),A.style.removeProperty("display"),A.style.setProperty("display","flex","important");let g=A.querySelector("ul.breadcrumb")||A.querySelector(".breadcrumb");g||(g=p.createElement("ul"),g.className="breadcrumb",A.appendChild(g));let w=S();if(!w.length&&Array.from(g.children).map(m=>d(m.textContent)).filter(Boolean).some(m=>m!=="首页"&&!/^(一级菜单|二级菜单|三级菜单)$/.test(m)))return;g.innerHTML="";let T=p.createElement("li");T.style.cursor="pointer",T.innerHTML='<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>',T.addEventListener("click",()=>{c.location.href="/"}),g.appendChild(T),w.forEach((C,b)=>{let m=p.createElement("li");b===w.length-1&&m.classList.add("active");let v=p.createElement("span");v.className="urppp-bc-label",v.textContent=C,m.appendChild(v),g.appendChild(m)})}return a(y,"beautifyBreadcrumbs"),{beautifyBreadcrumbs:y}}a(xi,"createBreadcrumbController");function yi({documentRef:p=document,windowRef:n=window,MutationObserverRef:c=MutationObserver,nodeTypeRef:d=Node}){function u(){try{let S=p.getElementById("sidebar"),y=p.querySelectorAll(".main-content");if(!y.length)return;let A=n.matchMedia&&n.matchMedia("(max-width: 991px)").matches,g="260px";A?g="0px":S&&(g=S.classList.contains("menu-min")?"50px":"260px"),y.forEach(w=>w.style.setProperty("margin-left",g,"important"))}catch{}}a(u,"syncMobileContentOffset");function k(){try{let S=p.getElementById("sidebar"),y=p.querySelector("#navbar, .navbar.navbar-default, .navbar-fixed-top");if(!S||!y||S.classList.contains("urppp-clean-sidebar"))return;let A=y.getBoundingClientRect(),g=Math.max(45,Math.round(A.height||y.offsetHeight||45));p.documentElement.style.setProperty("--urppp-navbar-height",g+"px"),S.style.setProperty("top",g+"px","important"),S.style.setProperty("height","calc(100vh - "+g+"px)","important"),S.style.setProperty("margin-top","0","important"),y.style.setProperty("z-index","1100","important"),S.style.setProperty("z-index","1030","important"),u()}catch{}}a(k,"syncSidebarUnderNavbar");function P(){let S=p.getElementById("sidebar"),y=p.getElementById("menus");if(!S||!y)return;if(n.__urpppSidebarMenuObserver){try{n.__urpppSidebarMenuObserver.disconnect()}catch{}n.__urpppSidebarMenuObserver=null}let A=p.getElementById("urppp-menus"),g=S.querySelector(".urppp-sidebar-header");A&&A.remove(),g&&g.remove(),k();let w=new Set;y.querySelectorAll("li.active").forEach(M=>{M.id&&w.add(M.id)});function T(M){return Array.from(M.children).filter(H=>H.tagName==="LI").map(H=>{let G=H.querySelector(":scope > a"),U=G?.querySelector(".menu-text"),rt=U?U.textContent.trim():G?Array.from(G.childNodes).filter(st=>st.nodeType===d.TEXT_NODE).map(st=>st.textContent).join("").trim():"",it=G?.querySelector(".menu-icon"),mt=it?Array.from(it.classList).filter(st=>st!=="menu-icon").join(" "):"",V=H.querySelector(":scope > .submenu"),Q=V?T(V):[];Q=Q.filter(st=>st.text&&(st.text.trim()||st.href&&st.href!=="#"));let at=G?.getAttribute("href")||"#",X=G?.getAttribute("target")||"",ct=H.getAttribute("onclick")||G?.getAttribute("onclick")||"",et=H.id;return at!=="#"&&!at.startsWith("javascript")?{id:et,text:rt,iconClass:mt,children:[],href:at,target:X,onclick:ct}:Q.length===1&&Q[0].children.length===0?{id:et||Q[0].id,text:rt,iconClass:mt||Q[0].iconClass,children:[],href:Q[0].href||at,target:Q[0].target||X,onclick:Q[0].onclick||ct}:{id:et,text:rt,iconClass:mt,children:Q,href:at,target:X,onclick:ct}})}a(T,"parseMenu");let C=T(y);y.style.display="none";let b=p.createElement("div");b.className="urppp-sidebar-header",b.style.cssText="position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)";let m=p.createElement("button");m.type="button",m.className="urppp-sidebar-toggle",m.innerHTML='<i class="fa fa-angle-left" aria-hidden="true"></i>',m.title="收起侧边栏",typeof m.setAttribute=="function"&&m.setAttribute("aria-label","收起侧边栏");let v=a(()=>!!(n.matchMedia&&n.matchMedia("(max-width: 991px)").matches),"isNarrow"),x=a(M=>{if(M&&(M.preventDefault(),M.stopPropagation()),v()){S.classList.remove("display"),u();return}let H=p.getElementById("sidebar-collapse");H&&H.click()},"doToggle");m.addEventListener("click",x),b.appendChild(m);let _=a(()=>{let M=v(),H=p.body.classList.contains("menu-min")||S.classList.contains("menu-min"),G=M?"关闭菜单":H?"展开侧边栏":"收起侧边栏";m.innerHTML=M?'<i class="fa fa-times" aria-hidden="true"></i>':H?'<i class="fa fa-angle-right" aria-hidden="true"></i>':'<i class="fa fa-angle-left" aria-hidden="true"></i>',m.title=G,typeof m.setAttribute=="function"&&m.setAttribute("aria-label",G),!M&&H?(b.style.justifyContent="center",b.style.padding="12px 0"):(b.style.justifyContent="flex-end",b.style.padding="")},"syncToggle"),q=new c(_);q.observe(p.body,{attributes:!0,attributeFilter:["class"]}),q.observe(S,{attributes:!0,attributeFilter:["class"]}),n.__urpppSidebarMenuObserver=q,_();let I=p.createElement("ul");I.id="urppp-menus",I.style.cssText="margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)";function L(M){p.querySelectorAll("#urppp-menus .urppp-nav-item").forEach(G=>G.classList.remove("active"));let H=M;for(;H&&H.id!=="urppp-menus";)H.classList.contains("urppp-nav-item")&&H.classList.add("active"),H=H.parentElement}a(L,"setActiveBranch");function O(M,H){let G=p.createElement("li");G.className="urppp-nav-item",M.id&&(G.id=M.id);let U=M.children.length>0,rt=M.href||"#",it=rt!=="#"&&!rt.startsWith("javascript"),mt=p.createElement("a");if(mt.className="urppp-nav-link",mt.href=it?rt:"javascript:void(0)",M.target&&mt.setAttribute("target",M.target),M.iconClass){let Q=p.createElement("i");M.iconClass.split(" ").forEach(at=>{at&&Q.classList.add(at)}),mt.appendChild(Q)}let V=p.createElement("span");if(V.className="urppp-nav-text",V.textContent=M.text,V.title=M.text,mt.appendChild(V),U){let Q=p.createElement("i");Q.className="urppp-nav-arrow fa fa-angle-down",Q.addEventListener("click",at=>{at.preventDefault(),at.stopPropagation(),G.classList.toggle("open")}),mt.appendChild(Q)}if(G.appendChild(mt),mt.addEventListener("click",Q=>{if(L(G),!it&&U)Q.preventDefault(),G.classList.toggle("open");else if(it)return}),U){let Q=p.createElement("ul");Q.className="urppp-nav-submenu",M.children.forEach(at=>O(at,Q)),G.appendChild(Q)}M.id&&w.has(M.id)&&G.classList.add("active"),H.appendChild(G)}a(O,"buildItem"),C.forEach(M=>O(M,I)),I.querySelectorAll(".urppp-nav-item.open").forEach(M=>M.classList.remove("open")),S.insertBefore(b,S.firstChild),S.appendChild(I)}return a(P,"rebuildSidebarCompletely"),{rebuildSidebarCompletely:P,syncMobileContentOffset:u,syncSidebarUnderNavbar:k}}a(yi,"createSidebarController");function vi({theme:p,settings:n,documentRef:c=document,windowRef:d=window}){function u(A){if(!A)return;let g=p.getSkin(),w=p.skinSupportsFixedPalettes(g),T=p.getCurrent(),C=w?p.getBrutalActivePalette():null,b=w?p.getBrutalSelectedPalette():null;A.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(m=>{let v=m.dataset.theme,x=v==="dark",_=v==="scu-red",q=x&&!p.skinSupportsDark(g)||_&&!p.skinSupportsDynamic(g)&&!w,I=v===T;if(w&&(I=v==="default"&&C.id===p.BRUTAL_DEFAULT_PALETTE||_&&C.id!==p.BRUTAL_DEFAULT_PALETTE),m.disabled=q,m.classList.toggle("urppp-theme-disabled",q),m.classList.toggle("ac",I&&!q),m.setAttribute("aria-disabled",q?"true":"false"),v==="default")m.style.background=w?p.getBrutalPaletteById(p.BRUTAL_DEFAULT_PALETTE).accent:"#F1F3F5",m.title=w?"默认高能粉":"简约白";else if(x)m.style.background=q?"#A7A7A7":"#0B0F14",m.title=q?"当前界面风格不支持暗色模式":"深邃暗";else if(_)if(q)m.style.background="#A7A7A7",m.title="当前界面风格不支持动态配色";else if(w)m.style.background=b.accent,m.title="高对比配色："+b.name;else{let L=p.getAccent()||p.DEFAULT_SEED;try{let O=p.buildSchemePreview(L,p.getScheme());m.style.background="linear-gradient(135deg, "+O.primary+" 0 55%, "+O.surface+" 55% 100%)"}catch{m.style.background=L}m.title="动态配色"}})}a(u,"syncThemeDotGroup");function k(A){let g=p.getSkin();if(p.skinSupportsFixedPalettes(g)){if(A==="dark")return;p.getCurrent()!=="default"&&p.applyTheme("default",{manual:!0}),A==="default"&&p.setBrutalPalette(p.BRUTAL_DEFAULT_PALETTE),A==="scu-red"&&p.setBrutalPalette(p.getBrutalSelectedPalette().id);return}p.isThemeModeAvailable(A,g)&&p.applyTheme(A,{manual:!0})}a(k,"handleThemeDotClick");function P(){u(c.getElementById("urppp-nav-theme"))}a(P,"syncNavbarThemeUI");function S(){try{let A=c.getElementById("navbar")||c.querySelector(".navbar");if(!A)return;if(c.getElementById("urppp-nav-theme")){P();return}let g=A.querySelector(".navbar-header .navbar-brand")||A.querySelector(".navbar-brand")||A.querySelector(".navbar-header");if(!g)return;let w=c.createElement("div");w.id="urppp-nav-theme",w.innerHTML=['<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>','<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>','<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>','<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">','  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">','    <circle cx="12" cy="12" r="3"></circle>','    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',"  </svg>","</button>"].join(""),g.parentElement?(g.parentElement.style.setProperty("display","flex","important"),g.parentElement.style.setProperty("align-items","center","important"),g.nextSibling?g.parentElement.insertBefore(w,g.nextSibling):g.parentElement.appendChild(w)):g.appendChild(w),w.style.setProperty("display","inline-flex","important"),w.style.setProperty("align-items","center","important"),w.style.setProperty("height","36px","important"),w.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(T=>{T.addEventListener("click",()=>{k(T.dataset.theme),P();try{n.syncSettingsPanelUI()}catch{}})}),w.querySelector("#urppp-nav-settings").addEventListener("click",T=>{T.preventDefault(),T.stopPropagation(),n.openSettingsPanel()}),n.ensureSettingsPanel(),P();try{d.__urpppCleanMode&&d.__urpppCleanMode.inject()}catch{}}catch(A){console.warn("[URP++] navbar theme switch inject failed",A)}}a(S,"injectNavbarThemeSwitch");function y(){let g=c.getElementById("navbar")?.querySelector(".ace-nav");try{S()}catch{}if(!g)return;function w(_,q){Object.entries(q).forEach(([I,L])=>_.style.setProperty(I,L,"important"))}a(w,"force"),Array.from(g.childNodes).forEach(_=>{_.nodeType===Node.TEXT_NODE&&!_.textContent.trim()&&_.remove()}),g.querySelectorAll(":scope > li").forEach(_=>{w(_,{display:"inline-flex","align-items":"center","vertical-align":"middle",margin:"0",padding:"0","text-align":"left"})}),g.querySelectorAll(":scope > li > a").forEach(_=>{w(_,{display:"inline-flex","align-items":"center","justify-content":"center",height:"36px",padding:"0 4px","flex-wrap":"nowrap","vertical-align":"middle","text-decoration":"none"}),_.style.lineHeight="1"}),g.querySelectorAll(":scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa").forEach(_=>{w(_,{top:"auto","vertical-align":"middle","line-height":"1","margin-top":"0"})});let T=g.querySelector(':scope > li > a[href*="customerServiceCenter"]');T&&(w(T,{width:"28px","justify-content":"center"}),T.style.padding="0 4px");let C=c.getElementById("clickdiv"),b=c.getElementById("form-search"),m=c.getElementById("search-input"),v=c.getElementById("intellegenceUDiv");if(v&&(v.style.setProperty("position","relative","important"),v.style.setProperty("z-index","30","important"),v.style.setProperty("display","inline-flex","important"),v.style.setProperty("align-items","center","important"),v.style.setProperty("justify-content","center","important"),v.style.setProperty("width","32px","important"),v.style.setProperty("height","36px","important"),v.style.setProperty("vertical-align","middle","important"),v.style.setProperty("margin","0","important"),v.style.setProperty("padding","0","important")),C&&b){C.removeAttribute("onclick"),w(C,{"background-color":"transparent",position:"relative",display:"inline-flex","align-items":"center","justify-content":"center",width:"32px",height:"32px","border-radius":"8px","line-height":"1","z-index":"30"});let _=c.getElementById("clicki");_&&w(_,{color:"var(--text-secondary)","margin-top":"0"}),C.__urpppNavbarClickBound||(C.__urpppNavbarClickBound=!0,C.addEventListener("mouseenter",()=>C.style.setProperty("background-color","var(--input-bg)","important")),C.addEventListener("mouseleave",()=>C.style.setProperty("background-color","transparent","important")),C.addEventListener("click",L=>{L.preventDefault(),L.stopPropagation(),b.dataset.open==="1"?(b.style.width="0px",b.style.opacity="0",b.dataset.open="0"):(b.style.width="180px",b.style.opacity="1",b.dataset.open="1",m&&setTimeout(()=>m.focus(),50))})),d.__urpppNavbarOutsideClickBound||(d.__urpppNavbarOutsideClickBound=!0,c.addEventListener("click",L=>{let O=c.getElementById("clickdiv"),M=c.getElementById("form-search");!O||!M||M.dataset.open!=="1"||!O.contains(L.target)&&!M.contains(L.target)&&(M.style.width="0px",M.style.opacity="0",M.dataset.open="0")})),w(b,{position:"absolute",right:"34px",top:"50%",transform:"translateY(-50%)",left:"auto",margin:"0","z-index":"10",background:"transparent",border:"none","box-shadow":"none",overflow:"hidden",padding:"0",transition:"width .2s ease, opacity .2s ease"});let q=b.dataset.open==="1"?"160px":"0px";b.style.width!==q&&(b.style.width=q,b.style.opacity=b.dataset.open==="1"?"1":"0"),m&&w(m,{"background-color":"var(--input-bg)",border:"1px solid var(--border)",color:"var(--text)","border-radius":"8px",height:"32px",padding:"0 12px","line-height":"32px",width:"100%"});let I=b.querySelector(".input-icon > .ace-icon.fa-search");I&&(I.style.display="none")}let x=g.querySelector(":scope > li.light-blue > a");if(x){w(x,{display:"inline-flex","align-items":"center",gap:"6px"});let _=x.querySelector(".user-info");_&&(w(_,{display:"inline-flex","align-items":"center",gap:"4px","max-width":"none","white-space":"nowrap","vertical-align":"middle","line-height":"1","margin-top":"-12px"}),Array.from(_.childNodes).forEach(I=>{I.nodeType===Node.TEXT_NODE&&(I.textContent=I.textContent.replace(/\s+/g,"").trim())}),Array.from(_.children).forEach(I=>{w(I,{display:"inline","white-space":"nowrap","vertical-align":"middle","line-height":"1",margin:"0",padding:"0"}),I.tagName==="SMALL"&&I.style.setProperty("font-size","inherit","important")}));let q=x.querySelector(".nav-user-photo");q&&(q.alt=(q.alt||"").replace(/\s+/g,"").trim(),w(q,{"vertical-align":"middle",display:"inline-block",width:"30px",height:"30px"}))}}return a(y,"rebuildNavbar"),{handleThemeDotClick:k,injectNavbarThemeSwitch:S,rebuildNavbar:y,syncNavbarThemeUI:P,syncThemeDotGroup:u}}a(vi,"createNavbarController");(function(){"use strict";try{let t=typeof navigator<"u"&&navigator.userAgent||"";if(/Android|iPhone|iPad|iPod|Mobile/i.test(t)){document.documentElement&&document.documentElement.classList.add("urppp-mobile");let r=document.querySelector('meta[name="viewport"]');r||(r=document.createElement("meta"),r.name="viewport",r.content="width=device-width, initial-scale=1",(document.head||document.documentElement||document).appendChild(r))}}catch{}let p="1.9.4";if(/^id\./i.test(String(location.hostname||""))){try{let t=Ka({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:p},uiDeps:{openSubpanel:a(()=>{},"openSubpanel")}}),r=a(()=>{try{t.bootFromCache("assist")}catch{}},"boot");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r()}catch{}return}let n={mainRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js",assistRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",changelogPage:"https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md",greasySearch:"https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B",versionJson:"version.json",sourceUrls:a(t=>[`https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`,`https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/${t}`,`https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`],"sourceUrls")},c="urppp_auto_update_check_v1",d="urppp_skin_v1",u=[{id:"apple",name:"类Apple风格",desc:"系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。",ready:!0,dark:!0,dynamic:!0,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"editorial",name:"编辑杂志",desc:"衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"flat",name:"极简扁平",desc:"无阴影、硬边与纯色层次，冷硬清晰。",ready:!0,dark:!0,dynamic:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"organic",name:"自然有机",desc:"奶油底与大地色，温暖圆角。不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"brutal",name:"新野兽派",desc:"高对比画布、粗边框与硬阴影。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,palettes:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}},{id:"neu",name:"新拟物",desc:"同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",caps:{scope:"app",allowJS:!1}}],k=GM_addStyle(`
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
  `;function S(t){let r=document.createElement("div");return r.className="urppp-inline-loader",r.innerHTML=P+(t?`<div>${t}</div>`:""),r}a(S,"makeInlineLoader");function y(t){return!t||!t.closest?!1:!!t.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]')}a(y,"isPageLoadingOverlay");function A(t){try{(t&&t.querySelectorAll?t:document).querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach(e=>{e.querySelectorAll(".urppp-inline-loader").forEach(o=>{try{o.remove()}catch{}}),e.classList.remove("urppp-loading-active")})}catch{}}a(A,"cleanupPageLoadingOverlays");function g(t){try{let r=t&&t.querySelectorAll?t:document;A(r),r.querySelectorAll("img").forEach(e=>{try{if(!e||e.dataset.urpppReplaced==="1"||y(e))return;let o=(e.getAttribute("src")||e.src||"").toLowerCase();if(!o||!(o.includes("pageloading")||o.includes("page-loading")||o.includes("loading.gif")||o.includes("loading-0")||o.includes("loading-1"))||o.includes("/loading")&&!o.includes("pageloading")&&!o.includes("loading.gif")&&!o.includes("loading-0"))return;e.dataset.urpppReplaced="1";let s=S("");s.style.minHeight="0",s.style.padding="0",e.parentElement&&e.parentElement.replaceChild(s,e)}catch{}}),r.querySelectorAll(".layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content").forEach(e=>{try{if(!e||e.dataset.urpppReplaced==="1")return;if(e.dataset.urpppReplaced="1",e.style.setProperty("background","transparent","important"),e.style.setProperty("background-image","none","important"),!e.querySelector(".urppp-inline-loader")){let o=S("");o.style.minHeight="0",o.style.padding="0",e.appendChild(o)}}catch{}})}catch{}}if(a(g,"replaceNativeLoaders"),!window.__urpppLoaderObs){window.__urpppLoaderObs=!0;let t=!1,r=a(()=>{if(!t){t=!0;try{g(document)}catch{}t=!1}},"run");document.body&&setTimeout(r,0),document.addEventListener("DOMContentLoaded",()=>setTimeout(r,0),{once:!0});let e=a(()=>{new MutationObserver(()=>{clearTimeout(window.__urpppLoaderTimer),window.__urpppLoaderTimer=setTimeout(r,200)}).observe(document.documentElement,{childList:!0,subtree:!0})},"startObs");document.body?e():document.addEventListener("DOMContentLoaded",e,{once:!0})}let w="urppp_theme_v3",T="urppp_accent_v1",C="urppp_accent_presets_v1",b="urppp_scheme_v1",m="urppp_theme_follow_system_v1",v="urppp_clean_default_v1",x="urppp_clean_analysis_v1",_="urppp_apple_edge_line_v1",q="urppp_follow_use_dynamic_v1",I="urppp_brutal_palette_v1",L="urppp_brutal_active_palette_v1",O="urppp_privacy_v1",M="urppp_custom_identity_v1",H="urppp_schedule_first_monday_v1",G="urppp_schedule_json_format_v1",U={completedCourses:"已修课程",failedCourses:"未及格课程",majorGpa:"主修绩点",majorPlan:"主修方案",remainingCourses:"待修课程",passingTotalCredit:"全部及格总学分",passingAvgScore:"全部及格平均成绩",passingAvgGpa:"全部及格平均绩点",passingRequiredCredit:"全部及格必修学分",passingRequiredAvg:"全部及格必修平均",passingRequiredGpa:"全部及格必修绩点",schemeTotalCredit:"方案总学分",schemeAvgScore:"方案平均成绩",schemeAvgGpa:"方案平均绩点",schemeRequiredCredit:"方案必修学分",schemeRequiredAvg:"方案必修平均",schemeRequiredGpa:"方案必修绩点"},rt="",it=["#1E3A5F","#B53434","#0F766E","#7C3AED","#C2410C","#0369A1","#BE185D","#365314"],mt="#B53434",V="pink",Q=[{id:"pink",name:"高能粉",desc:"默认配色，热粉强调与酸性绿辅助",accent:"#FF006E",secondary:"#CCFF00",info:"#00D9FF",warning:"#FF9500"},{id:"acid",name:"酸性绿",desc:"酸性绿强调与热粉辅助",accent:"#CCFF00",secondary:"#FF006E",info:"#00D9FF",warning:"#FF9500"},{id:"cyan",name:"电子蓝",desc:"电子蓝强调与亮橙辅助",accent:"#00D9FF",secondary:"#FF9500",info:"#CCFF00",warning:"#FF006E"},{id:"orange",name:"亮橙",desc:"亮橙强调与电子蓝辅助",accent:"#FF9500",secondary:"#00D9FF",info:"#CCFF00",warning:"#FF006E"}],at="tonal",X=[{id:"paper",name:"纯白卡片",desc:"卡片保持白，仅强调色跟种子"},{id:"tonal",name:"色调点缀",desc:"背景轻染，卡片带同色相浅底"},{id:"soft",name:"柔和粉彩",desc:"卡片明显粉彩/浅色，低对比"},{id:"vibrant",name:"鲜艳",desc:"背景与卡片都更有色，主色更饱和"},{id:"expressive",name:"表现力",desc:"双色拼色：卡片跟主色，背景走协调次色"}],{handleThemeDotClick:ct,injectNavbarThemeSwitch:et,rebuildNavbar:st,syncNavbarThemeUI:ft,syncThemeDotGroup:Z}=vi({theme:{BRUTAL_DEFAULT_PALETTE:V,DEFAULT_SEED:mt,applyTheme:Gt,buildSchemePreview:Xt,getAccent:Yt,getBrutalActivePalette:fo,getBrutalPaletteById:ee,getBrutalSelectedPalette:go,getCurrent:Qt,getScheme:Lr,getSkin:nr,isThemeModeAvailable:re,setBrutalPalette:xo,skinSupportsDark:Mr,skinSupportsDynamic:$r,skinSupportsFixedPalettes:ho},settings:{ensureSettingsPanel:Wo,openSettingsPanel:Ho,syncSettingsPanelUI:Ut}});function dt(){try{if(!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches))return;let r=document.getElementById("navbar"),e=r?.querySelector(".ace-nav");if(!r||!e)return;let o=document.getElementById("intellegenceUDiv"),s=document.getElementById("clickdiv"),i=document.getElementById("form-search");if(!o){let D=document.createElement("li");D.className="green urppp-search-item",o=document.createElement("div"),o.id="intellegenceUDiv",D.appendChild(o),e.appendChild(D)}let l=o.closest("li")||o.parentElement,f=Array.from(e.children).find(D=>{let R=D.querySelector(":scope > a");if(!R)return!1;let B=R.getAttribute("href")||"",K=(R.getAttribute("title")||"")+" "+(R.textContent||"");return B.includes("customerServiceCenter")||/help|service|support/i.test(B)||!!R.querySelector(".glyphicon-headphones, .fa-headphones, .fa-question-circle, .fa-life-ring")||/帮助|客服|服务|帮助中心/i.test(K)}),h=Array.from(e.children).find(D=>D.classList.contains("light-blue")),E=f||h||null;E&&l&&E!==l&&((l.compareDocumentPosition(E)&Node.DOCUMENT_POSITION_FOLLOWING)!==0||e.insertBefore(l,E)),l&&!l.classList.contains("urppp-search-item")&&l.classList.add("urppp-search-item");let $=l;s?(s.removeAttribute("onclick"),s.setAttribute("role","button"),s.setAttribute("aria-label","搜索功能")):(s=document.createElement("button"),s.type="button",s.id="clickdiv",s.setAttribute("aria-label","搜索功能"),s.innerHTML='<i class="fa fa-search" id="clicki" aria-hidden="true"></i>',o.appendChild(s)),s.style.setProperty("left","8px","important"),s.style.setProperty("position","relative","important"),s.style.setProperty("z-index","31","important"),i||(i=document.createElement("div"),i.id="form-search",i.className="nav-search",i.innerHTML='<form class="form-search"><span class="input-icon"><input type="text" placeholder="查找功能..." class="nav-search-input" id="search-input" autocomplete="off"><i class="ace-icon fa fa-search" aria-hidden="true"></i></span></form>'),$&&i.parentElement!==$&&$.appendChild(i),$&&$.style.setProperty("position","relative","important"),i.classList.add("urppp-desktop-search"),i.style.setProperty("position","absolute","important"),i.style.setProperty("top","50%","important"),i.style.setProperty("right","24px","important"),i.style.setProperty("left","auto","important"),i.style.setProperty("transform","translateY(-50%)","important"),i.style.setProperty("width",i.dataset.open==="1"?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("max-width","calc(100vw - 24px)","important"),i.style.setProperty("opacity",i.dataset.open==="1"?"1":"0","important"),i.style.setProperty("pointer-events",i.dataset.open==="1"?"auto":"none","important"),i.style.setProperty("z-index","1200","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("background","transparent","important"),i.style.setProperty("border","0 solid transparent","important"),i.style.setProperty("box-shadow","none","important"),i.style.setProperty("overflow","visible","important"),i.style.setProperty("transition","width .2s ease, opacity .2s ease","important");let j=i.querySelector("#search-input"),z=i.querySelector("form");if(!j||!z)return;z.style.setProperty("display","block","important"),z.style.setProperty("margin","0","important"),z.style.setProperty("padding","10px","important");let F=i.querySelector(".input-icon");F&&(F.style.setProperty("display","block","important"),F.style.setProperty("position","relative","important")),j.style.setProperty("display","block","important"),j.style.setProperty("width","100%","important"),j.style.setProperty("height","36px","important"),j.style.setProperty("box-sizing","border-box","important"),j.style.setProperty("padding","0 12px","important"),j.style.setProperty("border","1px solid var(--border)","important"),j.style.setProperty("border-radius","var(--radius-sm)","important"),j.style.setProperty("background","var(--input-bg)","important"),j.style.setProperty("color","var(--text)","important");let J=a(D=>{i.dataset.open=D?"1":"0",i.style.setProperty("width",D?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("opacity",D?"1":"0","important"),i.style.setProperty("pointer-events",D?"auto":"none","important"),s.setAttribute("aria-expanded",D?"true":"false"),D&&setTimeout(()=>j.focus(),30)},"setOpen");s.__urpppSearchBound||(s.__urpppSearchBound=!0,s.addEventListener("click",D=>{D.preventDefault(),D.stopImmediatePropagation(),J(i.dataset.open!=="1")},!0)),document.__urpppDesktopSearchOutsideBound||(document.__urpppDesktopSearchOutsideBound=!0,document.addEventListener("click",D=>{let R=document.getElementById("form-search"),B=document.getElementById("clickdiv");!R||R.dataset.open!=="1"||R.classList.contains("urppp-mobile-form-search")||R.closest("#urppp-mobile-search-panel")||R.contains(D.target)||B?.contains(D.target)||J(!1)},!0))}catch(t){console.warn("[URP++] desktop search bind failed",t)}}a(dt,"bindDesktopNavbarSearch");function kt(){if(document.getElementById("urppp-boot-loader"))return;let t=document.createElement("div");t.id="urppp-boot-loader",t.setAttribute("aria-busy","true"),t.innerHTML=`
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
    `;let r=document.documentElement||document.body;r&&r.appendChild(t)}a(kt,"ensureBootLoader");function wt(){try{document.documentElement.classList.add("urppp-ready"),document.body&&(document.body.classList.add("urppp-ready"),document.body.style.removeProperty("opacity"));let t=document.getElementById("urppp-boot-loader");if(!t)return;t.classList.add("urppp-boot-hide"),setTimeout(()=>{try{t.remove()}catch{}},280)}catch{}}a(wt,"hideBootLoader");try{kt()}catch{}window.__urpppBootSafety||(window.__urpppBootSafety=setTimeout(()=>{try{wt()}catch{}},2500));let Et={default:{name:"简约白",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"#0071E3","--input-bg":"#F5F5F7","--primary":"#0071E3","--primary-hover":"#0077ED","--ring":"rgba(0,113,227,0.28)","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px","--border-w":"0px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},dark:{name:"深邃暗",vars:{"--bg":"#000000","--surface":"#1C1C1E","--text":"#F5F5F7","--text-secondary":"#A1A1A6","--text-muted":"#8E8E93","--border":"#38383A","--border-focus":"#0A84FF","--input-bg":"#2C2C2E","--primary":"#0A84FF","--primary-hover":"#409CFF","--ring":"rgba(10,132,255,0.32)","--shadow":"0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},"scu-red":{name:"动态配色",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"var(--urppp-accent, #B53434)","--input-bg":"#F5F5F7","--primary":"var(--urppp-accent, #B53434)","--primary-hover":"var(--urppp-accent-hover, #962929)","--ring":"var(--urppp-accent-ring, rgba(181,52,52,0.18))","--shadow":"0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'}};function N(t,r,e){t/=255,r/=255,e/=255;let o=Math.max(t,r,e),s=Math.min(t,r,e),i=0,l=0,f=(o+s)/2;if(o!==s){let h=o-s;switch(l=f>.5?h/(2-o-s):h/(o+s),o){case t:i=(r-e)/h+(r<e?6:0);break;case r:i=(e-t)/h+2;break;default:i=(t-r)/h+4;break}i/=6}return{h:i*360,s:l,l:f}}a(N,"rgbToHsl");function Y(t,r,e){t=(t%360+360)%360,r=Math.max(0,Math.min(1,r)),e=Math.max(0,Math.min(1,e));let o=(1-Math.abs(2*e-1))*r,s=o*(1-Math.abs(t/60%2-1)),i=e-o/2,l=0,f=0,h=0;return t<60?(l=o,f=s):t<120?(l=s,f=o):t<180?(f=o,h=s):t<240?(f=s,h=o):t<300?(l=s,h=o):(l=o,h=s),{r:Math.round((l+i)*255),g:Math.round((f+i)*255),b:Math.round((h+i)*255)}}a(Y,"hslToRgb");function tt(t,r,e){let{r:o,g:s,b:i}=Y(t,r,e);return be(o,s,i)}a(tt,"hslHex");function ht(t){let{r,g:e,b:o}=Qr(Wt(t)||mt),s=N(r,e,o);return s.s<.12&&(s.s=.18),s}a(ht,"seedHsl");function bt(t,r,e){let o=Math.max(0,Math.min(100,e))/100,s=Math.max(0,Math.min(.95,r));return tt(t,s,o)}a(bt,"tone");function Pt(t){switch(t){case"paper":case"neutral":return{chroma:1,secShift:0,primaryTone:38,whiteCard:!0,bgSeed:.05,surfaceSeed:0,borderSeed:.08};case"soft":return{chroma:1,secShift:10,primaryTone:42,bgSeed:.14,surfaceSeed:.16,borderSeed:.18};case"vibrant":return{chroma:1.15,secShift:14,primaryTone:36,bgSeed:.2,surfaceSeed:.22,borderSeed:.26};case"expressive":return{chroma:1.08,secShift:0,primaryTone:36,duo:!0,bgSeed:.12,surfaceSeed:.15,borderSeed:.18};default:return{chroma:1,secShift:18,primaryTone:40,bgSeed:.12,surfaceSeed:.13,borderSeed:.16}}}a(Pt,"schemeProfile");function yt(t,r){let e=Wt(t)||mt,o=Math.max(0,Math.min(.45,Number(r)||0));return o<=.001?"#FFFFFF":Nt("#FFFFFF",e,o)}a(yt,"tintFromHex");function Bt(t){return t<25||t>=345?(t+28)%360:t<55?(t+22)%360:t<90?(t+160)%360:t<160?(t+40)%360:t<210?(t+35)%360:t<265?(t+48)%360:t<310?(t+40)%360:(t+24)%360}a(Bt,"companionHue");function Ct(t){let r=Wt(t)||mt,{h:e,s:o}=ht(r),s=Bt(e),i=Math.min(.72,Math.max(.28,o*.78));return bt(s,i,42)}a(Ct,"companionColor");function $t(t,r){let e=Wt(t)||mt,{h:o,s}=ht(e),l=Pt(r||at),f=Math.min(.92,Math.max(.35,s*l.chroma)),h=Ct(e),{h:E}=ht(h),$=bt(o,f,l.primaryTone),j=bt(o,f,Math.max(24,l.primaryTone-10)),z=Nt("#FFFFFF",e,.18),F,J,D;l.whiteCard?(F=Nt("#F1F5F9",Nt("#FFFFFF",e,.08),.5),J="#FFFFFF",D="#E5E7EB"):l.duo?(F=Nt(yt(h,l.bgSeed+.04),"#EEF1F4",.1),J=Nt(yt(e,l.surfaceSeed),"#FFFFFF",.1),D=Nt("#E5E7EB",h,.16)):(F=Nt(yt(e,l.bgSeed),"#E8EBEF",.12),J=Nt(yt(e,l.surfaceSeed),"#FFFFFF",.12),D=Nt("#E5E7EB",e,Math.max(.08,l.borderSeed*.7)));let R=l.whiteCard?"#F8FAFC":Nt(J,yt(l.duo?h:e,Math.max(.05,(l.surfaceSeed||.1)*.55)),.35),B=bt(o,Math.min(.45,f*.55),14),K=gr(bt(o,f*.3,34),.88),ut=gr(bt(o,f*.22,46),.76),vt=gr($,.18),_t="0 4px 12px "+gr($,.1)+", 0 1px 2px "+gr($,.05);return{"--bg":F,"--surface":J,"--text":B,"--text-secondary":K,"--text-muted":ut,"--border":D,"--border-focus":$,"--input-bg":R,"--primary":$,"--primary-hover":j,"--ring":vt,"--shadow":_t,"--radius":"18px","--radius-sm":"12px","--primary-container":z,"--secondary":h}}a($t,"buildMaterialSchemeVars");function Xt(t,r){let e=$t(t,r);return{id:r,primary:e["--primary"],bg:e["--bg"],surface:e["--surface"],border:e["--border"],text:e["--text"]}}a(Xt,"buildSchemePreview");function zr(t){let r=Wt(t)||Yt()||mt;return X.map(e=>Object.assign({},e,Xt(r,e.id)))}a(zr,"listSchemePreviews");function ur(){let t=document.documentElement;["--primary","--primary-hover","--border-focus","--ring","--bg","--surface","--text","--text-secondary","--text-muted","--border","--input-bg","--shadow","--primary-container","--secondary"].forEach(r=>t.style.removeProperty(r))}a(ur,"clearInlinePrimaryOverrides");function Yt(){return Wt(GM_getValue(T,""))||""}a(Yt,"getAccent");function Lr(){let t=String(GM_getValue(b,at)||at);return X.some(r=>r.id===t)?t:at}a(Lr,"getScheme");function aa(t){let r=X.some(e=>e.id===t)?t:at;return GM_setValue(b,r),r}a(aa,"setScheme");function wi(t,r){if(!t)return;let e=Wt(t);if(e){if(GM_setValue(T,e),r&&r.scheme&&aa(r.scheme),r&&r.skipTheme){let o=Ga(e,.15),s=gr(e,.15);document.documentElement.style.setProperty("--urppp-accent",e),document.documentElement.style.setProperty("--urppp-accent-hover",o),document.documentElement.style.setProperty("--urppp-accent-ring",s);try{ft()}catch{}try{Ut()}catch{}return}Gt("scu-red");try{ft()}catch{}try{Ut()}catch{}}}a(wi,"applyAccent");function oa(){try{let t=GM_getValue(C,"");if(!t)return it.slice();let r=JSON.parse(t);return Array.isArray(r)?r.filter(e=>typeof e=="string"&&/^#?[0-9a-fA-F]{6}$/i.test(e.replace("#",""))).map(e=>e.startsWith("#")?e.toUpperCase():"#"+e.toUpperCase()):it.slice()}catch{return it.slice()}}a(oa,"getAccentPresets");function ki(t){let r=Wt(t||Yt()||mt);if(!r)return oa();let e=oa();return e=[r].concat(e.filter(o=>o.toLowerCase()!==r.toLowerCase())),e=e.slice(0,12),GM_setValue(C,JSON.stringify(e)),e}a(ki,"saveAccentPreset");function Kt(){try{return!!GM_getValue(m,!1)}catch{return!1}}a(Kt,"isThemeFollowSystem");function ke(t){return GM_setValue(m,!!t),!!t}a(ke,"setThemeFollowSystem");function na(){try{return!!GM_getValue(v,!1)}catch{return!1}}a(na,"isCleanDefault");function Ai(t){return GM_setValue(v,!!t),!!t}a(Ai,"setCleanDefault");function pa(){try{return GM_getValue(x,"tab")==="direct"}catch{return!1}}a(pa,"isCleanAnalysisDirect");function Si(t){return GM_setValue(x,t==="direct"?"direct":"tab"),t==="direct"?"direct":"tab"}a(Si,"setCleanAnalysis");function xr(){try{let t=GM_getValue(_,!0);return t!==!1&&t!==0&&t!=="0"}catch{return!0}}a(xr,"isAppleEdgeLine");function _i(t){return GM_setValue(_,!!t),!!t}a(_i,"setAppleEdgeLine");function ia(){try{return!!GM_getValue(c,!1)}catch{return!1}}a(ia,"isAutoUpdateCheck");function Ei(t){return GM_setValue(c,!!t),!!t}a(Ei,"setAutoUpdateCheck");function Ae(t,r){try{let e=GM_getValue(t,"");if(e&&typeof e=="object")return e;if(typeof e=="string"&&e.trim())return JSON.parse(e)}catch{}return r}a(Ae,"readJsonSetting");function Se(t,r){return GM_setValue(t,JSON.stringify(r)),r}a(Se,"writeJsonSetting");function yr(){return Za(Ae(O,null))}a(yr,"getPrivacySettings");function sa(t){return Se(O,Za(t))}a(sa,"setPrivacySettings");function qr(){return ve(Ae(M,null))}a(qr,"getCustomIdentity");function co(t){return Se(M,ve(t))}a(co,"setCustomIdentity");function la(){let t=Ae(H,{});return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}a(la,"getScheduleFirstMondayMap");function uo(t,r){if(!t||!/^\d{4}-\d{2}-\d{2}$/.test(String(r||"")))return;let e=la();e[String(t)]=String(r),Se(H,e)}a(uo,"rememberScheduleFirstMonday");function _e(){let t="";try{t=GM_getValue(G,"")}catch{}let r=!!(t&&(typeof t!="string"||t.trim())),e=Ae(G,null);try{if(r&&(!e||typeof e!="object"||Array.isArray(e)))throw new Error("配置不是 JSON 对象");let o=e&&typeof e=="object"?e:{},s={enabled:!!o.enabled,mapping:Pr(o.mapping||fe)};return rt="",s}catch{return rt=r?"JSON 映射配置损坏，已回退小爱课程兼容格式":"",{enabled:!1,mapping:Pr(fe)}}}a(_e,"getScheduleJsonFormatSettings");function mo(t){let r=t&&typeof t=="object"?t:{},e={enabled:!!r.enabled,mapping:Pr(r.mapping||fe)};return rt="",Se(G,e)}a(mo,"setScheduleJsonFormatSettings");function bo(){try{let t=String(location.pathname||"").replace(/\/+$/,"")||"/";return t==="/"||t==="/index"||/\/index\.html?$/i.test(t)}catch{return!1}}a(bo,"isHomePage");function Ee(){try{return!!GM_getValue(q,!1)}catch{return!1}}a(Ee,"isFollowUseDynamic");function ca(t){return GM_setValue(q,!!t),!!t}a(ca,"setFollowUseDynamic");function Ci(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch{return!1}}a(Ci,"systemPrefersDark");function vr(){return Ci()&&Mr()?"dark":Ee()&&$r()?"scu-red":"default"}a(vr,"resolveFollowThemeName");function re(t,r){return t==="dark"?Mr(r):t==="scu-red"?$r(r):t==="default"}a(re,"isThemeModeAvailable");function Gt(t,r){r=r||{},!Mr()&&Kt()&&ke(!1),!$r()&&Ee()&&ca(!1),r.manual&&ke(!1);let e;r.system||Kt()&&!r.manual?e=vr():(e=Et[t]?t:Qt()||"default",Et[e]||(e="default")),re(e)||(e="default");let o=Et[e]||Et.default;r.skipPersist||GM_setValue(w,e),ur();let s=document.getElementById("urppp-theme-vars")||(()=>{let E=document.createElement("style");return E.id="urppp-theme-vars",(document.head||document.documentElement).appendChild(E),E})(),i=Yt(),l=Object.assign({},o.vars);if(e==="scu-red"){let E=i||mt,$=Lr();l=Object.assign(l,$t(E,$));let j=l["--primary"]||E,z=l["--primary-hover"]||Ga(j,.12);document.documentElement.style.setProperty("--urppp-accent",j),document.documentElement.style.setProperty("--urppp-accent-hover",z),document.documentElement.style.setProperty("--urppp-accent-ring",l["--ring"]||gr(j,.15)),document.documentElement.style.setProperty("--urppp-seed",E),document.documentElement.style.setProperty("--urppp-scheme",$)}else e==="default"?(document.documentElement.style.setProperty("--urppp-accent","#0071E3"),document.documentElement.style.setProperty("--urppp-accent-hover","#0077ED"),document.documentElement.style.setProperty("--urppp-accent-ring","rgba(0,113,227,0.28)"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme")):(document.documentElement.style.removeProperty("--urppp-accent"),document.documentElement.style.removeProperty("--urppp-accent-hover"),document.documentElement.style.removeProperty("--urppp-accent-ring"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme"));let f=":root {";for(let[E,$]of Object.entries(l))f+=`${E}:${$};`;f+="}",s.textContent=f,document.body&&(document.body.style.fontFamily=o.font);try{let E=document.documentElement;E.dataset.urpppTheme=e,E.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),E.classList.add("urppp-theme-"+e),E.classList.toggle("urppp-theme-follow",Kt()),document.body&&(document.body.dataset.urpppTheme=e,document.body.classList.toggle("urppp-dark",e==="dark"),document.body.classList.toggle("urppp-theme-follow",Kt()))}catch{}try{pr()}catch{}try{ft()}catch{}try{Ut()}catch{}try{$o()}catch{}try{$i()}catch{}let h=document.getElementById("urppp-boot-loader");h&&(h.style.fontFamily=o.font)}a(Gt,"applyTheme");function Qt(){return GM_getValue(w,"default")}a(Qt,"getCurrent");function Tr(t){try{return!!GM_getValue("urppp_theme_css_"+t,"")}catch{return!1}}a(Tr,"themeDownloaded");function nr(){let t=GM_getValue(d,"apple"),r=u.find(e=>e.id===t);return r&&r.ready&&(r.installed!==!1||Tr(r.id))?t:"apple"}a(nr,"getSkin");function da(t,r){let e=t||nr(),o=u.find(s=>s.id===e);return!!(o&&o[r])}a(da,"getSkinCapability");function Mr(t){return da(t,"dark")}a(Mr,"skinSupportsDark");function $r(t){return da(t,"dynamic")}a($r,"skinSupportsDynamic");function ho(t){return da(t,"palettes")}a(ho,"skinSupportsFixedPalettes");function ee(t){return Q.find(r=>r.id===t)||Q[0]}a(ee,"getBrutalPaletteById");function go(){let t=String(GM_getValue(I,"acid")||"acid"),r=ee(t);return r.id===V?ee("acid"):r}a(go,"getBrutalSelectedPalette");function fo(){let t=String(GM_getValue(L,V)||V);return ee(t)}a(fo,"getBrutalActivePalette");function xo(t,r){let e=r||{},o=ee(t);e.select&&o.id!==V&&GM_setValue(I,o.id),GM_setValue(L,o.id);try{pr()}catch{}try{ft()}catch{}try{Ut()}catch{}try{let s=document.getElementById("urppp-clean-root");s&&typeof s.__syncCleanThemeDots=="function"&&s.__syncCleanThemeDots()}catch{}}a(xo,"setBrutalPalette");function Pi(t){let r=t||nr();return r==="flat"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"2px","--urppp-card-border":"2px solid var(--text)","--urppp-input-border":"2px solid var(--text)","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:r==="organic"?{"--radius":"22px","--radius-sm":"14px","--shadow":"0 2px 10px rgba(92,64,51,0.06)","--border-w":"1px","--urppp-card-border":"1px solid #E7E0D6","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"1px solid var(--border)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--input-bg)","--urppp-action-color":"var(--primary)","--urppp-menu-radius":"14px","--urppp-menu-border":"1px solid var(--border)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}:r==="editorial"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"none","--urppp-action-radius":"0px","--urppp-action-border":"none","--urppp-action-shadow":"none","--urppp-action-bg":"transparent","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"1px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"transparent","--urppp-menu-color":"var(--text)"}:r==="brutal"?{"--radius":"0px","--radius-sm":"0px","--shadow":"6px 6px 0 #000","--border-w":"3px","--urppp-card-border":"3px solid #000","--urppp-input-border":"2px solid #000","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"3px 3px 0 var(--text)","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"3px 3px 0 var(--text)","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:r==="neu"?{"--radius":"16px","--radius-sm":"12px","--shadow":"5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"1px solid rgba(38,49,66,.16)","--urppp-input-shadow":"inset 2px 2px 4px rgba(38,49,66,.16), inset -2px -2px 4px rgba(255,255,255,.72)","--urppp-action-radius":"12px","--urppp-action-border":"none","--urppp-action-shadow":"var(--shadow)","--urppp-action-bg":"var(--bg)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"12px","--urppp-menu-border":"none","--urppp-menu-shadow":"var(--shadow)","--urppp-menu-bg":"var(--bg)","--urppp-menu-color":"var(--text)"}:{"--radius":"18px","--radius-sm":"12px","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--border-w":"0px","--urppp-card-border":r==="apple"&&xr()?"1px solid rgba(0,0,0,0.08)":"none","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"none","--urppp-action-shadow":"0 2px 6px var(--ring)","--urppp-action-bg":"var(--primary)","--urppp-action-color":"var(--surface)","--urppp-menu-radius":"12px","--urppp-menu-border":r==="apple"&&xr()?"1px solid var(--border)":"none","--urppp-menu-shadow":"0 1px 3px rgba(0,0,0,.08)","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}}a(Pi,"getSkinShapeOverrides");function Ir(){try{let t=nr();if(t==="apple")return xr()?"1px solid rgba(0,0,0,0.08)":"none";if(t==="flat")return"2px solid var(--text)";if(t==="organic")return"1px solid #E7E0D6";if(t==="brutal")return"3px solid var(--text)";if(t==="editorial"||t==="neu")return"none"}catch{}return"1px solid var(--border)"}a(Ir,"urpppCardBorderValue");function pr(){let t=nr();try{document.documentElement.setAttribute("data-urppp-skin",t)}catch{}try{document.body&&document.body.setAttribute("data-urppp-skin",t)}catch{}try{let r=t==="apple"&&xr();document.documentElement.setAttribute("data-urppp-apple-edge",r?"1":"0"),document.body&&document.body.setAttribute("data-urppp-apple-edge",r?"1":"0")}catch{}try{let r=document.getElementById("urppp-skin-vars")||(()=>{let i=document.createElement("style");return i.id="urppp-skin-vars",(document.head||document.documentElement).appendChild(i),i})(),e=Pi(t),o=":root, html[data-urppp-skin] {";if(Object.keys(e).forEach(i=>{o+=i+":"+e[i]+";"}),o+="}",o+=".urppp-nav-dot.urppp-theme-disabled{opacity:.42!important;cursor:not-allowed!important;box-shadow:none!important;filter:grayscale(1)!important;transform:none!important;}",t==="flat"||t==="organic"||t==="brutal"||t==="neu"){if(t==="brutal"){let i=fo();o+='html[data-urppp-skin="brutal"]{--brutal-accent:'+i.accent+";--brutal-secondary:"+i.secondary+";--brutal-info:"+i.info+";--brutal-warning:"+i.warning+";}"}r.textContent=o;return}if(t==="apple"){let i=xr(),l=i?"1px solid rgba(0,0,0,0.08)":"none",f=i?"1px solid rgba(255,255,255,0.10)":"none",h=i?"1px solid rgba(0,0,0,0.06)":"none";o+=['html[data-urppp-skin="apple"]{--shadow:0 6px 20px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);--border:'+(i?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.04)")+";}",'html[data-urppp-skin="apple"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="apple"]{--shadow:0 10px 28px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.04);--border:'+(i?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)")+";}",'html[data-urppp-skin="apple"] .widget-box,html[data-urppp-skin="apple"] .widget-box.transparent,html[data-urppp-skin="apple"] .panel,html[data-urppp-skin="apple"] .panel-default,html[data-urppp-skin="apple"] .well,html[data-urppp-skin="apple"] .thumbnail,html[data-urppp-skin="apple"] .infobox,html[data-urppp-skin="apple"] .profile-user-info,html[data-urppp-skin="apple"] .profile-user-info-striped,html[data-urppp-skin="apple"] .modal-content,html[data-urppp-skin="apple"] fieldset,html[data-urppp-skin="apple"] .urppp-stat-card,html[data-urppp-skin="apple"] .urppp-db-card,html[data-urppp-skin="apple"] .urppp-db-panel,html[data-urppp-skin="apple"] #urppp-dashboard .widget-box,html[data-urppp-skin="apple"] #urppp-root .uc,html[data-urppp-skin="apple"] #urppp-clean-root .uc-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-modal,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top,html[data-urppp-skin="apple"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="apple"] .urppp-card,html[data-urppp-skin="apple"] #urppp-dashboard .urppp-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+l+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"].urppp-theme-dark .widget-box,html[data-urppp-skin="apple"].urppp-theme-dark .panel,html[data-urppp-skin="apple"].urppp-theme-dark .profile-user-info,html[data-urppp-skin="apple"].urppp-theme-dark .modal-content,html[data-urppp-skin="apple"].urppp-theme-dark .urppp-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-root .uc{border:'+f+"!important;}",'html[data-urppp-skin="apple"] .page-content .widget-box,html[data-urppp-skin="apple"] #page-content-template .widget-box,html[data-urppp-skin="apple"] html body .page-content .profile-user-info.setLabelWidth{border:'+l+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"] .btn,html[data-urppp-skin="apple"] .btn-default,html[data-urppp-skin="apple"] .btn-white,html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] .btn-success,html[data-urppp-skin="apple"] .btn-warning,html[data-urppp-skin="apple"] .btn-danger,html[data-urppp-skin="apple"] a.btn,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn{border-color:transparent!important;box-shadow:0 1px 2px rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn.primary{border:none!important;}','html[data-urppp-skin="apple"] .table,html[data-urppp-skin="apple"] table,html[data-urppp-skin="apple"] .table-bordered,html[data-urppp-skin="apple"] .table-bordered>thead>tr>th,html[data-urppp-skin="apple"] .table-bordered>tbody>tr>td{border-color:rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"].urppp-theme-dark .table,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>thead>tr>th,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>tbody>tr>td{border-color:rgba(255,255,255,.06)!important;}','html[data-urppp-skin="apple"] .nav-tabs>li>a,html[data-urppp-skin="apple"] .nav-tabs{border-color:transparent!important;}','html[data-urppp-skin="apple"] .urppp-nav-link{border:none!important;}','html[data-urppp-skin="apple"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="apple"] #urppp-clean-root .uc-grid-cell{border-color:'+(i?"rgba(0,0,0,0.06)":"transparent")+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+h+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-dots span{border-radius:50%!important;border:2px solid var(--border)!important;box-shadow:none!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important;background-clip:padding-box!important;flex:0 0 auto!important;}','html[data-urppp-skin="apple"] .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary)!important;box-shadow:0 0 0 3px var(--ring)!important;}','html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-dots span[data-theme="scu-red"]{border-radius:50%!important;border:2px solid var(--border)!important;}'].join("")}else t==="editorial"&&(o+=`
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
        `);r.textContent=o;let s=document.head||document.documentElement;r.parentNode===s&&s.lastElementChild!==r&&s.appendChild(r)}catch(r){try{console.warn("[URP++] applySkinAttr",r)}catch{}}setTimeout(()=>{try{Vt(document)}catch{}},0)}a(pr,"applySkinAttr");function yo(t){let r=u.find(e=>e.id===t&&e.ready&&(e.installed!==!1||Tr(e.id)));if(!r)return!1;GM_setValue(d,r.id);try{r.dynamic||ca(!1),!r.dark&&Kt()&&ke(!1);let e=Kt(),o=e?vr():Qt(),s=re(o,r.id)?o:"default";pr(),Gt(s,{system:e})}catch{try{pr()}catch{}}try{Ut()}catch{}try{ft()}catch{}try{let e=document.getElementById("urppp-clean-root");e&&typeof e.__syncCleanThemeDots=="function"&&e.__syncCleanThemeDots()}catch{}return!0}a(yo,"setSkin");function zi(){if(!window.__urpppSystemThemeBound&&window.matchMedia){window.__urpppSystemThemeBound=!0;try{let t=window.matchMedia("(prefers-color-scheme: dark)"),r=a(()=>{if(Kt())try{Gt(vr(),{system:!0})}catch{}},"onChange");t.addEventListener?t.addEventListener("change",r):t.addListener&&t.addListener(r)}catch{}}}a(zi,"bindSystemThemeListener");try{Kt()?Gt(vr(),{system:!0}):Gt(Qt())}catch{}try{pr()}catch{}try{zi()}catch{}function Li(t){let r=String(document.body&&document.body.innerText||t&&t.innerText||"").replace(/\s+/g," ").trim(),e=[/token\s*校验失败[！!]?/i,/令牌\s*校验失败[！!]?/i,/验证码.{0,12}(?:错误|失败|过期)[！!]?/i,/(?:用户名|账号|学号).{0,12}(?:密码).{0,12}(?:错误|失败)[！!]?/i,/登录.{0,12}(?:错误|失败)[！!]?/i];for(let o of e){let s=r.match(o);if(s)return s[0].trim()}return""}a(Li,"extractLoginErrorMessage");function vo(){let t=location.pathname,r=document.getElementById("formContent"),e=document.querySelector(".form-signin");if(!r||!e){setTimeout(vo,50);return}if(r.querySelector(":scope > #urppp-root"))return;let o=Li(r),s=e.querySelector('a[onclick*="toModifyPwd"]'),i=(()=>{let R=r.querySelector(".fadeIn.first svg");return R?R.outerHTML:""})(),l=(()=>{let R=document.querySelector("#tocas a");return R?R.href:"https://id.scu.edu.cn/"})();for(let R of r.children)R.style.display="none";r.style.cssText="max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;";let f=location.pathname==="/loginEn",h=a((R,B)=>f?B:R,"t");r.insertAdjacentHTML("afterbegin",`
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

        ${o?`<div class="urppp-login-error" role="alert">${pt(o)}</div>`:""}

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
          <a href="${f?"/login":"/loginEn"}">${f?"中文":"EN"}</a>
        </div>

        <div class="us" id="urppp-dots">
          <span data-theme="default" title="简约白" style="background:#F5F5F7;box-shadow:inset 0 0 0 1px #D2D2D7"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="动态配色" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);let E=r.querySelector("#urppp-root");[["#urppp-user","#input_username"],["#urppp-pass","#input_password"],["#urppp-cap","#input_checkcode"]].forEach(([R,B])=>{let K=E.querySelector(R),ut=document.querySelector(B);K&&ut&&(ut.value&&(K.value=ut.value),K.addEventListener("input",()=>{ut.value=K.value}))});let $=E.querySelector("#urppp-capimg"),j=E.querySelector("#urppp-capwrap"),z=document.querySelector(".form-signin img");if($&&z){$.src=z.src;let R=a(()=>{let B=z.src.replace(/\?.*/,"")+"?"+Date.now();z.src=B,$.src=B},"refreshCap");j?j.addEventListener("click",R):$.addEventListener("click",R)}E.querySelectorAll(".ut button").forEach(R=>{R.addEventListener("click",()=>{if(R.dataset.mode==="sso"){location.href=l;return}E.querySelectorAll(".ut button").forEach(ut=>ut.classList.remove("ac")),R.classList.add("ac");let B=E.querySelector("#urppp-form"),K=E.querySelector("#urppp-sso");B&&(B.style.display="block"),K&&(K.style.display="none")})});let F=E.querySelector("#urppp-submit");F.addEventListener("click",()=>{if(F.dataset.submitting==="1")return;F.dataset.submitting="1",F.disabled=!0;let R=document.getElementById("loginButton");R?R.click():typeof e.requestSubmit=="function"?e.requestSubmit():e.submit(),setTimeout(()=>{F.dataset.submitting="0",F.disabled=!1},1500)}),E.querySelectorAll(".ui").forEach(R=>{R.addEventListener("keydown",B=>{B.key==="Enter"&&F.click()})}),E.querySelector("#urppp-forgot").addEventListener("click",R=>{R.preventDefault(),s&&s.click()});let J=E.querySelector("#urppp-dots"),D=a(()=>{if(!J)return;let R=Qt();J.querySelectorAll("span").forEach(K=>{K.classList.toggle("ac",K.dataset.theme===R)});let B=J.querySelector('span[data-theme="scu-red"]');if(B){let K=Yt()||mt;try{let ut=Xt(K,Lr());B.style.background="linear-gradient(135deg, "+ut.primary+" 0 55%, "+ut.surface+" 55% 100%)"}catch{B.style.background=K}}},"syncLoginDots");J&&(J.querySelectorAll("span").forEach(R=>{R.addEventListener("click",()=>{Gt(R.dataset.theme,{manual:!0}),D()})}),D()),console.log("[URP++] 登录界面已重建"),setTimeout(()=>{document.body.classList.add("urppp-ready"),wt()},100)}a(vo,"rebuild");let{beautifyBreadcrumbs:Ce}=xi({});function ua(){try{document.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(t=>{if(t.classList.contains("setLabelWidth")||t.classList.contains("urppp-query-form")||t.querySelector(".urppp-query-pair"))return;let r=Array.from(t.querySelectorAll(":scope > .profile-info-row, .profile-info-row"));!r.length||r.some(o=>Array.from(o.children).filter(s=>s.classList&&s.classList.contains("profile-info-name")).length>=2)||(t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("display","block","important"),Le(t),r.forEach(o=>{o.classList.remove("urppp-query-row","urppp-dual-pair"),delete o.dataset.urpppQueryDone,delete o.dataset.urpppQueryCols;let s=Array.from(o.querySelectorAll(":scope > .urppp-query-pair"));if(s.length){let i=[];for(s.forEach(l=>Array.from(l.children).forEach(f=>i.push(f)));o.firstChild;)o.removeChild(o.firstChild);i.forEach(l=>o.appendChild(l))}o.style.setProperty("display","grid","important"),o.style.setProperty("grid-template-columns","140px minmax(0,1fr)","important"),o.style.setProperty("align-items","stretch","important"),o.style.setProperty("width","100%","important"),Array.from(o.children).forEach(i=>{i.classList&&(i.style.setProperty("float","none","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("box-sizing","border-box","important"))})}))})}catch(t){console.warn("[URP++] single pair profile fix failed",t)}}a(ua,"fixSinglePairProfileForms");function Pe(){let t=document.querySelector(".page-content")||document.getElementById("page-content-template");t&&(t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(r=>{if(!r.querySelector(".setLabelWidth"))return;let e=r.querySelector(".setLabelWidth");e&&(r.querySelectorAll("h4.header, h3.header, .header.smaller, .header").forEach(o=>{e.contains(o)||o.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING&&(o.classList.add("urppp-section-label"),["background","background-color","background-image","border","box-shadow","border-radius","padding","margin","min-height"].forEach(s=>{o.style.removeProperty(s)}),o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important"),o.style.setProperty("background-image","none","important"),o.style.setProperty("border","0 none transparent","important"),o.style.setProperty("box-shadow","none","important"),o.style.setProperty("border-radius","0","important"),o.style.setProperty("padding","4px 2px 10px","important"),o.style.setProperty("margin","0 0 8px 0","important"),o.style.setProperty("min-height","0","important"))}),e.classList.remove("urppp-query-form"),e.style.setProperty("padding","0","important"),e.style.setProperty("overflow","hidden","important"),e.style.setProperty("background","var(--surface)","important"),e.style.setProperty("border",Ir(),"important"),e.style.setProperty("border-radius","12px","important"),e.style.setProperty("box-shadow","none","important"))}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(r=>{r.classList.remove("urppp-query-form"),r.querySelectorAll(".profile-info-row").forEach(e=>{e.classList.remove("urppp-query-row"),delete e.dataset.urpppQueryDone,delete e.dataset.urpppQueryCols;let o=Array.from(e.querySelectorAll(":scope > .urppp-query-pair"));if(o.length){let s=[];for(o.forEach(i=>{Array.from(i.children).forEach(l=>s.push(l))});e.firstChild;)e.removeChild(e.firstChild);s.forEach(i=>e.appendChild(i))}})}),t.querySelectorAll(".setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row").forEach(r=>{let e=Array.from(r.querySelectorAll(":scope > .urppp-query-pair"));if(e.length){let i=[];for(e.forEach(l=>{Array.from(l.children).forEach(f=>i.push(f))});r.firstChild;)r.removeChild(r.firstChild);i.forEach(l=>r.appendChild(l))}r.classList.remove("urppp-query-row"),delete r.dataset.urpppQueryDone,delete r.dataset.urpppQueryCols;let o=Array.from(r.children).filter(i=>i.classList&&(i.classList.contains("profile-info-name")||i.classList.contains("profile-info-value")));o.filter(i=>i.classList.contains("profile-info-name")).length>=2?(r.classList.add("urppp-dual-pair"),r.style.setProperty("display","grid","important"),r.style.setProperty("grid-template-columns","112px minmax(140px,1fr) 112px minmax(140px,1fr)","important"),r.style.setProperty("align-items","stretch","important"),r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("float","none","important"),o.forEach(i=>{i.style.setProperty("float","none","important"),i.style.setProperty("clear","none","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("min-width","0","important"),i.style.setProperty("box-sizing","border-box","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.classList.contains("profile-info-value")?(i.style.removeProperty("width"),i.style.setProperty("width","auto","important"),i.style.setProperty("justify-content","flex-start","important"),i.style.setProperty("white-space","normal","important"),i.style.setProperty("word-break","normal","important")):(i.style.setProperty("justify-content","flex-end","important"),i.style.setProperty("white-space","nowrap","important"))})):r.classList.remove("urppp-dual-pair")}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(r=>{r.classList.remove("urppp-query-form"),r.style.cssText=(r.getAttribute("style")||"").replace(/padding\s*:[^;]+;?/gi,""),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("overflow","hidden","important"),r.style.setProperty("border",Ir(),"important"),r.style.setProperty("box-shadow","none","important"),r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("box-sizing","border-box","important"),r.style.setProperty("margin","0 0 16px 0","important"),r.style.setProperty("padding","0","important");let e=r.closest(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8")||r.parentElement;e&&Array.from(e.querySelectorAll("h4.header, h3.header, .header.smaller")).forEach(o=>{r.contains(o)||o.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING&&(o.classList.add("urppp-section-label"),o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important"),o.style.setProperty("background-image","none","important"),o.style.setProperty("border","0 none transparent","important"),o.style.setProperty("box-shadow","none","important"),o.style.setProperty("border-radius","0","important"),o.style.setProperty("padding","4px 2px 10px","important"),o.style.setProperty("margin","0 0 8px 0","important"),o.style.setProperty("min-height","0","important"))})}),t.querySelectorAll(".urppp-col-row").forEach(r=>{r.classList.remove("urppp-col-row"),["display","flex-wrap","gap","align-items","width","box-sizing"].forEach(e=>r.style.removeProperty(e))}),t.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach(r=>{["float","flex","width","max-width","padding-left","padding-right","box-sizing"].forEach(e=>{r.style.getPropertyPriority(e)==="important"&&r.style.removeProperty(e)}),r.style.setProperty("padding-left","0","important"),r.style.setProperty("box-sizing","border-box","important")}),t.querySelectorAll(".col-xs-4, .col-sm-4, .col-md-4").forEach(r=>{r.style.setProperty("padding-right","16px","important")}),t.querySelectorAll(".col-xs-8, .col-sm-8, .col-md-8").forEach(r=>{r.style.setProperty("padding-left","0","important"),r.style.setProperty("padding-right","0","important")}),t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(r=>{r.querySelector(".setLabelWidth")&&r.querySelectorAll(":scope > h4.header, :scope > .header, :scope > .header.smaller").forEach(e=>{e.style.cssText+=";background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;border-radius:0!important;padding:4px 2px 10px!important;margin:0 0 8px 0!important;min-height:0!important;"})}),t.querySelectorAll(".urppp-section-title-wrap").forEach(r=>{let e=r.querySelector("h4.header, h3.header, h5.header, .header.smaller");if(!e){r.remove();return}let o=r.nextElementSibling;for(;o&&!o.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]');)o=o.nextElementSibling;let s=o&&(o.querySelector(".col-xs-4, .col-sm-4, .col-md-4")||Array.from(o.children).find(i=>/col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(i.className||"")));s&&(s.insertBefore(e,s.firstChild),delete e.dataset.urpppHoisted,e.style.removeProperty("width"),e.style.removeProperty("max-width"),e.style.removeProperty("margin-left"),e.style.removeProperty("margin-right"),e.style.removeProperty("box-sizing"),e.style.removeProperty("position"),e.style.removeProperty("left")),r.remove()}))}a(Pe,"alignRollInfoLayout");function ze(){let t=typeof unsafeWindow<"u"?unsafeWindow:window;return t.jQuery||t.$||window.jQuery||window.$||null}a(ze,"pageJQuery");function qi(t){return t?t.id&&String(t.id).indexOf("pagination_pageSize_")===0?!0:!!(t.closest&&t.closest('#urppagebar, .urppagebreak, .dataTables_paginate, [id^="sample-table-2_paginate_"]')):!1}a(qi,"isPagebarSelect");function wo(t){if(t){try{let r=ze();r&&r.fn&&r(t).data("chosen")&&r(t).chosen("destroy")}catch{}try{if(t.parentElement&&t.parentElement.querySelectorAll(":scope > .chosen-container").forEach(r=>{try{r.remove()}catch{}}),t.nextElementSibling&&t.nextElementSibling.classList.contains("chosen-container"))try{t.nextElementSibling.remove()}catch{}}catch{}t.classList.remove("urppp-chosen-hidden","chzn-done","chosen");try{delete t.dataset.urpppChosen}catch{}t.style.setProperty("display","inline-block","important")}}a(wo,"destroyPagebarChosen");let ko=0,Ao=!1;function Ti(){if(Ao)return;Ao=!0;let t=a(r=>{if(Date.now()<ko){try{r.preventDefault()}catch{}try{r.stopPropagation()}catch{}}},"guard");document.addEventListener("mousedown",t,!0),document.addEventListener("mouseup",t,!0),document.addEventListener("click",t,!0)}a(Ti,"bindChosenPickGuard");function ma(t){if(!t||t.__urpppChosenNoPierce)return;t.__urpppChosenNoPierce=!0,Ti();let r=t.querySelector(".chosen-drop"),e=a(o=>{let s=o.target;!s||!s.closest||!s.closest(".chosen-results li")||(ko=Date.now()+350)},"onPick");t.addEventListener("mouseup",e,!1),t.addEventListener("touchend",e,!1),r&&(r.addEventListener("mouseup",e,!1),r.addEventListener("touchend",e,!1))}a(ma,"bindChosenNoPierce");function ba(t=document){try{t.querySelectorAll(".chosen-container").forEach(ma)}catch{}}a(ba,"bindAllChosenNoPierce");function mr(){try{let t=ze();if(!t||!t.fn||typeof t.fn.chosen!="function")return!1;let r=document.querySelectorAll(".profile-user-info, .urppp-query-form, .profile-info-row, form"),e=new Set,o=[];if(r.forEach(s=>{s.querySelectorAll("select").forEach(i=>{e.has(i)||(e.add(i),o.push(i))})}),document.querySelectorAll("select.value_element, .profile-info-value > select").forEach(s=>{e.has(s)||(e.add(s),o.push(s))}),o.forEach(s=>{if(!s||s.multiple||s.disabled||s.size&&s.size>1)return;if(qi(s)){wo(s);return}let i=t(s);if(!!i.data("chosen")||s.classList.contains("chzn-done")||!!(s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container"))||!!(s.parentElement&&s.parentElement.querySelector(":scope > .chosen-container"))){s.dataset.urpppChosen="1",s.classList.add("urppp-chosen-hidden"),s.style.setProperty("display","none","important");let f=s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container")?s.nextElementSibling:s.parentElement&&s.parentElement.querySelector(":scope > .chosen-container");f&&ma(f);return}try{s.classList.contains("select")||s.classList.add("select");try{i.data("chosen")&&i.chosen("destroy")}catch{}i.chosen({allow_single_deselect:!0,search_contains:!0,width:"100%",no_results_text:"无匹配项",disable_search_threshold:0}),s.dataset.urpppChosen="1",s.classList.add("urppp-chosen-hidden"),s.style.setProperty("display","none","important");let f=s.nextElementSibling&&s.nextElementSibling.classList.contains("chosen-container")?s.nextElementSibling:s.parentElement&&s.parentElement.querySelector(".chosen-container");f&&(f.style.setProperty("width","100%","important"),f.style.setProperty("min-width","0","important"),f.style.setProperty("display","block","important")),f&&ma(f)}catch(f){console.warn("[URP++] chosen init failed",s,f)}}),!window.__urpppChosenHtmlPatch){window.__urpppChosenHtmlPatch=!0;let s=t.fn.html;t.fn.html=function(){let i=s.apply(this,arguments);if(arguments.length)try{this.filter("select").add(this.find("select")).each(function(){let l=t(this);if(l.data("chosen")||l.next(".chosen-container").length)try{l.trigger("chosen:updated")}catch{}})}catch{}return i}}return!0}catch(t){return console.warn("[URP++] ensureQueryChosen failed",t),!1}}a(mr,"ensureQueryChosen");function So(){if(window.__urpppChosenScheduleBound)return;window.__urpppChosenScheduleBound=!0,[0,200,600,1500,3e3].forEach(o=>setTimeout(()=>{mr(),ba()},o));let r=0,e=setInterval(()=>{r+=1;let o=mr();ba(),(o&&r>3||r>15)&&clearInterval(e)},500)}a(So,"scheduleEnsureQueryChosen");let{beautifyPagebar:_o}=Pp({destroyPagebarChosen:wo}),{scheduleBeautifyPagebar:Eo}=Cp({beautifyPagebar:_o});function ha(){try{document.querySelectorAll("#drag-ul, ul#drag-ul").forEach(t=>{if(!t)return;let r=Array.from(t.children).filter(e=>e.tagName==="LI");if(!r.length){t.classList.add("urppp-empty"),t.style.setProperty("display","none","important");let e=t.closest("#xq-section, .widget-main, .widget-body");e&&!e.querySelector("li")&&(e.classList.add("urppp-empty"),e.style.setProperty("display","none","important"));return}t.classList.remove("urppp-empty"),t.classList.add("urppp-drag-ul"),t.style.removeProperty("display"),t.style.setProperty("height","auto","important"),t.style.setProperty("min-height","0","important"),r.forEach(e=>{let o=(e.textContent||"").replace(/\s+/g," ").trim(),s=(e.getAttribute("onclick")||"").includes("goDetail")||e.classList.contains("ui-selectee")||e.classList.contains("jc-future")||!!e.querySelector("a");!s&&/校区/.test(o)&&o.length<=12?(e.classList.add("xq-section"),e.classList.remove("ui-selectee","jc-future","urppp-building-active")):s&&!e.classList.contains("jc-future")&&e.classList.add("ui-selectee")})}),window.__urpppBuildingActiveBound||(window.__urpppBuildingActiveBound=!0,document.addEventListener("click",t=>{let r=t.target&&t.target.closest?t.target.closest("#drag-ul > li"):null;if(!r||r.classList.contains("xq-section")||r.classList.contains("jc-future"))return;let e=r.parentElement;e&&(e.querySelectorAll("li.urppp-building-active, li.ui-selected").forEach(o=>{o.classList.remove("urppp-building-active","ui-selected")}),r.classList.add("urppp-building-active","ui-selected"))},!0))}catch(t){console.warn("[URP++] free classroom list beautify failed",t)}}a(ha,"beautifyFreeClassroomList");function Le(t){if(!t||!t.style)return;if(t.classList.contains("setLabelWidth")){t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",Ir(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 16px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important");return}let r=!!(t.closest&&t.closest(".widget-box, .widget-main, .widget-body, .panel"));t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("min-width","0","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("clear","both","important");let e=t.parentElement&&t.parentElement.tagName==="FORM"?t.parentElement:null;e&&(e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("display","block","important"),e.style.setProperty("float","none","important"),e.style.setProperty("box-sizing","border-box","important"),e.style.setProperty("margin","0","important"));let o=t.closest&&t.closest(".tab-pane, .tab-content");if(o&&(o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("box-sizing","border-box","important")),r){t.style.setProperty("background","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("margin","0","important"),t.style.setProperty("box-shadow","none","important");return}t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",Ir(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 18px 0","important"),!t.classList.contains("setLabelWidth")&&(t.classList.contains("urppp-query-form")||!!t.querySelector(".urppp-query-pair, .chosen-container"))?(t.style.setProperty("padding","14px 16px","important"),t.style.setProperty("overflow","visible","important")):(t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important"))}a(Le,"ensureProfileCardShell");function ae(){try{mr(),document.querySelectorAll(".page-content .profile-user-info, #page-content-template .profile-user-info").forEach(o=>{Le(o)});let t=a(o=>{let s=o.closest(".profile-user-info, .urppp-query-form")||o.parentElement;if(!s)return Math.min(Math.max(o.querySelectorAll(":scope > .urppp-query-pair").length,1),4);let i=0;return s.querySelectorAll(":scope > .profile-info-row, .profile-info-row").forEach(l=>{let f=l.querySelectorAll(":scope > .urppp-query-pair").length;f>i&&(i=f)}),Math.min(Math.max(i,1),4)},"getFormQueryCols"),r=a(o=>{let s=Array.from(o.querySelectorAll(":scope > .urppp-query-pair")),i=t(o);o.classList.add("urppp-query-row"),o.style.setProperty("display","grid","important"),o.style.removeProperty("grid-template-columns"),o.style.setProperty("column-gap","14px","important"),o.style.setProperty("row-gap","10px","important"),o.style.setProperty("align-items","center","important"),o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("box-sizing","border-box","important"),o.dataset.urpppQueryCols=String(i),s.forEach(l=>{l.style.removeProperty("grid-column")}),s.forEach(l=>{l.style.setProperty("display","flex","important"),l.style.setProperty("align-items","center","important"),l.style.setProperty("width","100%","important"),l.style.setProperty("min-width","0","important"),l.style.setProperty("max-width","100%","important"),l.style.setProperty("box-sizing","border-box","important"),l.style.removeProperty("flex");let f=l.querySelector(".profile-info-name"),h=l.querySelector(".profile-info-value");f&&(f.style.setProperty("float","none","important"),f.style.setProperty("display","flex","important"),f.style.setProperty("align-items","center","important"),f.style.setProperty("justify-content","flex-end","important"),f.style.setProperty("flex","0 0 var(--urppp-qlabel, 84px)","important"),f.style.setProperty("width","var(--urppp-qlabel, 84px)","important"),f.style.setProperty("min-width","var(--urppp-qlabel, 84px)","important"),f.style.setProperty("max-width","var(--urppp-qlabel-max, 96px)","important"),f.style.setProperty("margin","0","important"),f.style.setProperty("margin-left","0","important"),f.style.setProperty("padding","0 8px 0 0","important"),f.style.setProperty("background","transparent","important"),f.style.setProperty("border","none","important"),f.style.setProperty("border-right","none","important")),h&&(h.style.setProperty("float","none","important"),h.style.setProperty("display","flex","important"),h.style.setProperty("align-items","center","important"),h.style.setProperty("flex","1 1 auto","important"),h.style.setProperty("width","auto","important"),h.style.setProperty("min-width","0","important"),h.style.setProperty("max-width","none","important"),h.style.setProperty("margin","0","important"),h.style.setProperty("margin-left","0","important"),h.style.setProperty("padding","0","important"),h.style.setProperty("background","transparent","important"),h.style.setProperty("border","none","important"),h.querySelectorAll("input, select, .chosen-container, .form-control").forEach(E=>{E.style.setProperty("width","100%","important"),E.style.setProperty("min-width","0","important"),E.style.setProperty("max-width","none","important")})),l.querySelectorAll(".chosen-container").forEach(E=>{let $=E.previousElementSibling;$&&$.tagName==="SELECT"&&($.style.setProperty("display","none","important"),$.classList.add("urppp-chosen-hidden"));let j=E.parentElement&&E.parentElement.querySelector("select");j&&(j.style.setProperty("display","none","important"),j.classList.add("urppp-chosen-hidden")),E.style.setProperty("width","100%","important"),E.style.setProperty("min-width","0","important"),E.style.setProperty("max-width","none","important");let z=E.querySelector(".chosen-single");if(z){z.style.setProperty("width","100%","important"),z.style.setProperty("max-width","none","important"),z.style.setProperty("display","flex","important"),z.style.setProperty("align-items","center","important"),z.style.setProperty("height","34px","important"),z.style.setProperty("line-height","normal","important");let F=z.querySelector(":scope > span, span");F&&(F.style.setProperty("line-height","normal","important"),F.style.setProperty("height","auto","important"),F.style.setProperty("margin-top","0","important"),F.style.setProperty("padding-top","0","important"));let J=z.querySelector("div");if(J){J.style.setProperty("display","flex","important"),J.style.setProperty("align-items","center","important"),J.style.setProperty("justify-content","center","important"),J.style.setProperty("top","0","important"),J.style.setProperty("bottom","0","important"),J.style.setProperty("height","auto","important");let D=J.querySelector("b");D&&(D.style.setProperty("margin","0","important"),D.style.setProperty("background-position","center center","important"),D.style.setProperty("background-size","12px 12px","important"),D.style.setProperty("width","14px","important"),D.style.setProperty("height","14px","important"))}}})})},"applyRowLayout");document.querySelectorAll(".profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)").forEach(o=>{if(o.classList.contains("setLabelWidth")||o.closest&&o.closest("#curriculumInfo-divcon, #curriculumInfo-divcon1, #curriculumInfo-divcon2, #fajh, #xnxq, #kz, #kc, #kcfa"))return;let s=Array.from(o.querySelectorAll(".profile-info-row")).some(l=>Array.from(l.children).filter(f=>f.classList&&f.classList.contains("profile-info-name")).length>=2),i=!!o.querySelector("select.chosen, select.select, .chosen-container");if(!s&&!i){o.classList.remove("urppp-query-form");return}o.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')&&(o.classList.add("urppp-query-form"),Le(o),o.querySelectorAll(".profile-info-row").forEach(l=>{if(l.dataset.urpppQueryDone==="1"){l.querySelector(":scope > .urppp-query-pair")&&r(l);return}let f=Array.from(l.children).filter(j=>j.classList&&(j.classList.contains("profile-info-name")||j.classList.contains("profile-info-value"))),h=[];for(let j=0;j<f.length;){let z=f[j],F=f[j+1];z&&F&&z.classList.contains("profile-info-name")&&F.classList.contains("profile-info-value")?(h.push([z,F]),j+=2):j+=1}if(!h.length){l.dataset.urpppQueryDone="1";return}let E=document.createDocumentFragment(),$=new Set;for(h.forEach(([j,z])=>{let F=document.createElement("div");F.className="urppp-query-pair",F.appendChild(j),F.appendChild(z),$.add(j),$.add(z),E.appendChild(F)}),f.forEach(j=>{$.has(j)||E.appendChild(j)});l.firstChild;)l.removeChild(l.firstChild);l.appendChild(E),l.dataset.urpppQueryDone="1",r(l)}))}),mr()}catch(t){console.warn("[URP++] query form beautify failed",t)}}a(ae,"beautifyQueryForms");function Co(){if(window.__urpppChosenAlignBound)return;window.__urpppChosenAlignBound=!0;let t=!1,r=a(e=>{if(!t){t=!0;try{let o=e&&e.querySelectorAll?e:document,s=document.getElementById("urppp-chosen-li-style");s||(s=document.createElement("style"),s.id="urppp-chosen-li-style",document.documentElement.appendChild(s)),s.textContent=[".self div.profile-info-value a.chosen-single > span,","body .self div.profile-info-value a.chosen-single > span {","  line-height: normal !important;","  height: auto !important;","  margin-top: 0 !important;","  padding-top: 0 !important;","}",".self div.profile-info-value a.chosen-single,","body .self div.profile-info-value a.chosen-single {","  display: flex !important;","  align-items: center !important;","  height: 34px !important;","  line-height: normal !important;","}","body .chosen-container .chosen-results li,","body .chosen-with-drop .chosen-results li,","html body .chosen-container .chosen-results li.active-result {","  display:flex !important;","  align-items:center !important;","  justify-content:flex-start !important;","  height:36px !important;","  min-height:36px !important;","  max-height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","  margin:0 !important;","  box-sizing:border-box !important;","}","body .chosen-container .chosen-results li.highlighted,","body .chosen-container .chosen-results li.result-selected {","  display:flex !important;","  align-items:center !important;","  height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","}"].join(""),o.querySelectorAll(".chosen-results li").forEach(i=>{i.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-start !important","height:36px !important","min-height:36px !important","max-height:36px !important","line-height:1 !important","padding:0 12px !important","margin:0 !important","box-sizing:border-box !important"].join(";")}),o.querySelectorAll("a.chosen-single").forEach(i=>{i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("height","34px","important"),i.style.setProperty("min-height","34px","important"),i.style.setProperty("line-height","normal","important"),i.style.setProperty("padding-top","0","important"),i.style.setProperty("padding-bottom","0","important");let l=i.querySelector(":scope > span");l&&(l.style.setProperty("line-height","normal","important"),l.style.setProperty("height","auto","important"),l.style.setProperty("margin-top","0","important"),l.style.setProperty("margin-bottom","0","important"),l.style.setProperty("padding-top","0","important"),l.style.setProperty("padding-bottom","0","important"))}),o.querySelectorAll(".chosen-search").forEach(i=>{if(!i.querySelector(".urppp-chosen-search-icon")){let l=document.createElement("i");l.className="fa fa-search urppp-chosen-search-icon",l.setAttribute("aria-hidden","true"),i.appendChild(l)}})}finally{setTimeout(()=>{t=!1},0)}}},"apply");document.addEventListener("mousedown",e=>{let o=e.target&&e.target.closest?e.target.closest(".chosen-container"):null;o&&(setTimeout(()=>r(o),0),setTimeout(()=>r(o),30),setTimeout(()=>r(o),100),setTimeout(()=>r(o),200))},!0);try{let e=window.jQuery||window.$;e&&e.fn&&e(document).off("chosen:showing_dropdown.urppp chosen:updated.urppp").on("chosen:showing_dropdown.urppp chosen:updated.urppp",o=>{let s=o.target&&o.target.parentElement?o.target.parentElement:document;setTimeout(()=>r(s),0),setTimeout(()=>r(s),60)})}catch{}}a(Co,"patchChosenDropdownAlign");function ga(){try{let t=document.getElementById("work_rest_schedule_modal");if(!t)return;(t.classList.contains("in")||t.classList.contains("show"))&&t.style.setProperty("display","block","important");let r=t.querySelector(".modal-body")||t,e=Array.from(r.querySelectorAll("table"));if(!e.length)return;let o=a(l=>(l||"").replace(/\s+/g," ").trim(),"norm"),s=a(l=>String(l??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),"esc");if(r.dataset.urpppWrsDone==="1")return;r.dataset.urpppWrsDone="1",e.forEach(l=>{let f=l.closest(".urppp-table-wrap");f&&t.contains(f)&&f.parentElement&&(f.parentElement.insertBefore(l,f),f.remove()),l.classList.add("urppp-wrs-table"),l.style.setProperty("width","100%","important");let h=Array.from(l.rows||[]);if(!h.length)return;let E=0;h.forEach($=>{let j=o($.textContent);if(!/\d{1,2}:\d{2}/.test(j))return;let z=0;Array.from($.cells||[]).forEach(F=>{z+=F.colSpan||1}),z>E&&(E=z)}),E<4&&h.forEach($=>{let j=0;Array.from($.cells||[]).forEach(z=>{j+=z.colSpan||1}),j>E&&(E=j)}),E<1&&(E=1),Array.from(l.rows||[]).forEach($=>{let j=Array.from($.cells||[]);if(!j.length)return;let z=o($.textContent);if(!/\d{1,2}:\d{2}/.test(z)&&(/作息时间|学年/.test(z)||/(望江|华西|江安)/.test(z)&&/校区|时间|安排|作息/.test(z))){let D=z;$.className="urppp-wrs-title-row",$.innerHTML='<td class="urppp-wrs-title" colspan="'+E+'" align="center">'+s(D)+"</td>";return}j.forEach(D=>{["border","borderTop","borderRight","borderBottom","borderLeft","textAlign","verticalAlign","width"].forEach(B=>{try{D.style[B]=""}catch{}}),D.classList.remove("urppp-wrs-title","urppp-wrs-period","urppp-wrs-time","urppp-wrs-head");let R=o(D.textContent);R&&(/^(上午|下午|晚上|中午)$/.test(R)||(D.rowSpan||1)>1&&/上午|下午|晚上|中午/.test(R)?D.classList.add("urppp-wrs-period"):/节次|大节|时间|校区/.test(R)&&!/\d{1,2}:\d{2}/.test(R)&&!/第\d/.test(R)?/节次|时间|大节|校区/.test(z)&&!/\d{1,2}:\d{2}/.test(z)&&D.classList.add("urppp-wrs-head"):/\d{1,2}:\d{2}/.test(R)&&D.classList.add("urppp-wrs-time"),D.style.setProperty("text-align","center","important"),D.style.setProperty("vertical-align","middle","important"))})})});let i=t.querySelector(".modal-title");i&&(i.style.setProperty("text-align","center","important"),i.style.setProperty("width","100%","important")),r.dataset.urpppWrsDone="1"}catch{}}a(ga,"beautifyWorkRestSchedule");let Po="https://jwc.scu.edu.cn/cdxl.htm";function fa(){let t=['a[onclick*="jwc.scu.edu.cn/article/206"]','a[href*="jwc.scu.edu.cn/article/206"]',".cdsj a",".ace-nav a"],r=new Set;t.forEach(e=>{document.querySelectorAll(e).forEach(o=>{if(r.has(o))return;r.add(o);let s=(o.textContent||"").replace(/\s+/g,""),i=o.getAttribute("onclick")||"",l=o.getAttribute("href")||"";(s.includes("学校校历")||i.includes("article/206")||l.includes("article/206")||i.includes("jwc.scu.edu.cn")&&s.includes("校历"))&&(o.setAttribute("href",Po),o.setAttribute("target","_blank"),o.setAttribute("rel","noopener noreferrer"),o.setAttribute("onclick",`window.open('${Po}');return false;`))})})}a(fa,"patchSchoolCalendarLink");function qe(){document.querySelectorAll("#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static").forEach(t=>{if(!t.querySelector(".nav-tabs"))return;["background","background-color","background-image","border","border-radius","box-shadow"].forEach(o=>{t.style.setProperty(o,o.startsWith("background")||o==="box-shadow"?o==="box-shadow"?"none":"transparent":o==="border"?"none":"0","important")}),t.style.setProperty("background","transparent","important"),t.style.setProperty("background-color","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("width","100%","important"),t.style.setProperty("margin","0 0 14px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("min-height","0","important"),t.style.setProperty("box-sizing","border-box","important");let r=t.querySelector(".navbar-inner");r&&(r.style.setProperty("background","transparent","important"),r.style.setProperty("border","none","important"),r.style.setProperty("box-shadow","none","important"),r.style.setProperty("padding","0","important"),r.style.setProperty("min-height","0","important"),r.style.setProperty("filter","none","important"),r.style.setProperty("width","100%","important")),t.querySelectorAll(".container, .container-fluid").forEach(o=>{o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("margin","0","important"),o.style.setProperty("margin-left","0","important"),o.style.setProperty("padding","0","important"),o.style.setProperty("background","transparent","important"),o.style.setProperty("box-sizing","border-box","important")});let e=t.querySelector(".nav-tabs");e&&(e.style.setProperty("width","100%","important"),e.style.setProperty("margin","0","important"),e.style.setProperty("padding","8px 10px","important"),e.style.setProperty("background","var(--surface)","important"),e.style.setProperty("background-color","var(--surface)","important"),e.style.setProperty("border",Ir(),"important"),e.style.setProperty("border-radius","12px","important"),e.style.setProperty("box-sizing","border-box","important"))})}a(qe,"patchAceTabNavbars");function Nr(){let t=a(r=>{let e=NaN,o=[r.getAttribute("data-percent"),r.querySelector("[data-percent]")?.getAttribute("data-percent"),r.querySelector(".percent")?.textContent,r.querySelector(".urppp-pct-text")?.textContent];for(let s of o){if(s==null||s==="")continue;let i=parseFloat(String(s).replace(/[^\d.]/g,""));if(!Number.isNaN(i)){e=i;break}}if(Number.isNaN(e)){let s=(r.textContent||"").match(/(\d+(?:\.\d+)?)\s*%/);s&&(e=parseFloat(s[1]))}if(Number.isNaN(e)){let s=r.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');if(s){let i=String(s.style.width||"").match(/([\d.]+)%/);i&&(e=parseFloat(i[1]))}}return Number.isNaN(e)?null:Math.max(0,Math.min(100,e))},"readPct");document.querySelectorAll(".infobox").forEach(r=>{let e=t(r);if(e==null)return;r.querySelectorAll("canvas").forEach(l=>l.remove()),r.querySelectorAll(".easy-pie-chart, .percentage, .infobox-progress").forEach(l=>{l.classList.contains("urppp-pct-bar")||l.remove()}),r.querySelectorAll(".urppp-pct-text, .urppp-pct-bar").forEach(l=>l.remove());let o=r.querySelector(".infobox-data")||r,s=document.createElement("div");s.className="urppp-pct-text",s.textContent=Math.round(e)+"%";let i=document.createElement("div");if(i.className="urppp-pct-bar"+(e<=0?" is-empty":""),e>0){let l=document.createElement("span");l.className="urppp-pct-fill",l.style.width=e+"%",i.appendChild(l)}o.insertBefore(i,o.firstChild),o.insertBefore(s,o.firstChild),r.dataset.urpppPctDone="1"})}a(Nr,"restyleInfoboxPercentages");function oe(t){let r=document.getElementById("treeDemo");if(!r)return;let e=!!(t&&t.force);if(r.dataset.urpppBusy==="1"&&!(t&&t.ignoreBusy))return;let o=r.closest('div[style*="border"]')||r.closest("#tree_div")?.parentElement||r.parentElement;o&&o.classList.add("urppp-plan-tree-shell"),r.classList.add("urppp-ztree");let s=typeof unsafeWindow<"u"?unsafeWindow:window,i=a(()=>{try{return(s.jQuery||s.$||window.jQuery||window.$)?.fn?.zTree?.getZTreeObj?.("treeDemo")||null}catch{return null}},"getZTree"),l=a(()=>{let R=Array.from(r.querySelectorAll('span.button.switch[class*="_open"]')).filter(B=>!/_docu\b/.test(B.className));return R.reverse().forEach(B=>{try{B.click()}catch{}}),R.length>0},"collapseAllDom"),f=a(()=>{let R=i();if(R)try{R.expandAll(!1)}catch{}return r.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')&&l(),!0},"collapseAll");if(!window.__urpppExpandKzPatched){window.__urpppExpandKzPatched=!0;let R=a(()=>{let B=typeof unsafeWindow<"u"?unsafeWindow:window;try{B.expandKzByRule=function(){r.dataset.urpppUserExpanded||f()}}catch{}},"patch");R(),setTimeout(R,0),setTimeout(R,200)}r.dataset.urpppCollapsedOnce||(r.dataset.urpppCollapsedOnce="1",[0,80,200,500,1e3].forEach(R=>setTimeout(()=>{r.dataset.urpppUserExpanded||f()},R)));let h=document.querySelector("#two h4.header, #two .header");if(h&&!h.dataset.urpppLegendDone){let R=h.querySelector("font");if(R){let B=document.createElement("div");B.className="urppp-plan-legend",B.innerHTML=['<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>','<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>','<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>','<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>','<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>'].join(""),R.replaceWith(B)}h.classList.add("urppp-plan-header"),h.dataset.urpppLegendDone="1"}let E=a(()=>{if(r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}},"pauseObs"),$=a(()=>{r.dataset.urpppBusy="0";let R=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&R)try{window.__urpppPlanTreeObs.observe(R,{childList:!0,subtree:!0})}catch{}},"resumeObs"),j=a(R=>{let B=R;return B=B.replace(/\((最低修读学分:[^)]+)\)/g,(K,ut)=>{let vt=ut.split(",").map(Lt=>Lt.trim()).filter(Boolean),_t=[];return vt.forEach(Lt=>{/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(Lt)&&_t.push(Lt)}),`<span class="urppp-sub">${(_t.length?_t:vt).map(Lt=>{let jt=Lt.match(/^([^:：]+)[:：]\s*(.+)$/);if(!jt)return Lt;let Ot=jt[1].trim(),Tt=jt[2].trim(),rr="neutral";return/通过|已及格/.test(Ot)?rr="ok":/未修读|未及格/.test(Ot)?rr=Number(Tt)>0?"warn":"muted":/最低/.test(Ot)&&(rr="req"),`<span class="urppp-kv ${rr}"><em>${Ot}</em><b>${Tt}</b></span>`}).join("")}</span>`}),B=B.replace(/\[(\d{6,})\]/g,'<span class="urppp-code">$1</span>'),B=B.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g,'<span class="urppp-meta">$1</span>'),B=B.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g,(K,ut,vt)=>{let _t=String(vt).trim(),zt=_t.match(/^(.+?)(?:\((\d{6,8})\))?$/),Lt=(zt?zt[1]:_t).trim(),jt=zt&&zt[2]?zt[2]:"",Ot=parseFloat(Lt),Tt=!1;Number.isNaN(Ot)?/不及格|未通过|不通过/.test(Lt)?Tt=!1:(/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(Lt),Tt=!0):Tt=Ot>=60;let rr=jt?`<i>${jt}</i>`:"";return`<span class="urppp-score ${Tt?"pass":"fail"}"><b>${ut}</b><em>${Lt}</em>${rr}</span>`}),B=B.replace(/(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,'$1<span class="urppp-title">$2</span>'),B=B.replace(/(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,'$1 <span class="urppp-gname">$2</span>'),B=B.replace(/(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,"$1 "),B},"formatNodeHtml"),z=a(R=>{let B=R.querySelector("i.fa, i.ace-icon"),K=R.closest("li");K&&(K.classList.remove("urppp-node-done","urppp-node-todo","urppp-node-pass","urppp-node-fail","urppp-node-pending"),B&&(B.classList.contains("fa-check-square-o")?K.classList.add("urppp-node-done"):B.classList.contains("fa-smile-o")?K.classList.add("urppp-node-pass"):B.classList.contains("fa-frown-o")?K.classList.add("urppp-node-fail"):B.classList.contains("fa-meh-o")?K.classList.add("urppp-node-pending"):B.classList.contains("fa-kz")&&K.classList.add("urppp-node-todo")))},"markStatus"),F=a(R=>{if(!R||!e&&R.dataset.urpppNodeDone==="1")return!1;z(R);let B=R.querySelector("span.node_name")||R;if(!B)return!1;if(!e&&B.querySelector(".urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname"))R.dataset.urpppNodeDone="1";else{let ut=B.dataset.urpppRaw;ut||(B.querySelector(".urppp-score, .urppp-code, .urppp-sub")?(R.dataset.urpppNodeDone="1",ut=null):(ut=B.innerHTML,ut&&(B.dataset.urpppRaw=ut))),ut&&(B.innerHTML=j(ut),R.dataset.urpppNodeDone="1")}let K=R.parentElement&&R.parentElement.querySelector(":scope > span.button.switch");return K&&(K.dataset.urpppSw||(K.dataset.urpppSw="1",/_docu\b/.test(K.className)&&(K.classList.add("urppp-switch-leaf"),K.style.setProperty("display","none","important"))),/_docu\b/.test(K.className)||K.classList.contains("urppp-switch-leaf")?R.classList.remove("urppp-expandable"):R.classList.add("urppp-expandable")),!0},"paintOne"),J=a((R,B)=>{let K=Array.from(R||[]),ut=0,vt=a(()=>{let _t=Math.min(ut+48,K.length);for(;ut<_t;ut++)F(K[ut]);ut<K.length?window.requestIdleCallback?requestIdleCallback(vt,{timeout:120}):setTimeout(vt,0):B&&B()},"step");vt()},"paintList"),D=a(R=>{let B=R||r;B.querySelectorAll("span.button.switch:not([data-urppp-sw])").forEach(K=>{K.dataset.urpppSw="1",/_docu\b/.test(K.className)&&(K.classList.add("urppp-switch-leaf"),K.style.setProperty("display","none","important"))}),B.querySelectorAll("li > a").forEach(K=>F(K))},"paintScopeSync");E();try{D(r),r.dataset.urpppExpandClick||(r.dataset.urpppExpandClick="1",r.addEventListener("click",B=>{if(B.target.closest&&B.target.closest("span.button.switch")){let zt=B.target.closest("span.button.switch"),Lt=zt&&zt.parentElement;if(!Lt||/_docu\b/.test(zt.className))return;if(r.dataset.urpppUserExpanded="1",r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}setTimeout(()=>{D(Lt),r.dataset.urpppBusy="0";let jt=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&jt)try{window.__urpppPlanTreeObs.observe(jt,{childList:!0,subtree:!0})}catch{}},0);return}let K=B.target&&B.target.closest?B.target.closest("li > a"):null;if(!K||!r.contains(K))return;let ut=K.parentElement;if(!ut)return;let vt=ut.querySelector(":scope > span.button.switch");if(!vt||/_docu\b/.test(vt.className)||vt.classList.contains("urppp-switch-leaf")||!K.classList.contains("urppp-expandable")&&!/_open|_close/.test(vt.className))return;if(B.preventDefault(),B.stopImmediatePropagation(),r.dataset.urpppUserExpanded="1",r.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}vt.click(),D(ut),r.dataset.urpppBusy="0";let _t=document.getElementById("tree_div")||r;if(window.__urpppPlanTreeObs&&_t)try{window.__urpppPlanTreeObs.observe(_t,{childList:!0,subtree:!0})}catch{}},!0));let R=a((B,K)=>{let ut=document.getElementById(B);return!ut||ut.dataset.urpppBound==="1"?!1:(ut.dataset.urpppBound="1",ut.addEventListener("click",vt=>{vt.preventDefault(),vt.stopImmediatePropagation(),r.dataset.urpppUserExpanded="1",E();try{let _t=i();if(K){_t?_t.expandAll(!0):r.querySelectorAll('span.button.switch[class*="_close"]').forEach(Lt=>{/_docu\b/.test(Lt.className)||Lt.click()});let zt=r.querySelectorAll('li > a:not([data-urppp-node-done="1"])');J(zt,$)}else{if(_t)try{_t.expandAll(!1)}catch{}l(),setTimeout(()=>{r.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')&&l(),$()},0)}}catch{K||l(),$()}},!0),!0)},"bindAll");R("expandAllBtn",!0),R("collapseAllBtn",!1),r.dataset.urpppAllBtnsRetry||(r.dataset.urpppAllBtnsRetry="1",setTimeout(()=>{R("expandAllBtn",!0),R("collapseAllBtn",!1)},300),setTimeout(()=>{R("expandAllBtn",!0),R("collapseAllBtn",!1)},1e3))}finally{requestAnimationFrame(()=>{requestAnimationFrame($)})}}a(oe,"beautifyPlanTree");function ne(){if(!dr())try{let t=document.getElementById("soliderbox");if(t){t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","720px","important"),t.style.setProperty("min-width","0","important"),t.classList.remove("container");let s=t.closest(".profile-info-row");s&&(s.style.setProperty("display","flex","important"),s.style.setProperty("align-items","center","important"),s.style.setProperty("width","100%","important"),s.style.setProperty("max-width","100%","important"));let i=t.closest(".profile-info-value");i&&(i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","100%","important"),i.style.setProperty("flex","1 1 auto","important"),i.style.setProperty("min-width","0","important"))}let r=document.getElementById("mycoursetable");if(!r)return;let e=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches);r.classList.toggle("urppp-mobile-schedule-scroll",e),r.style.setProperty("position","relative","important"),r.style.setProperty("width","100%","important");let o=72;e||r.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(s=>{let i=s.offsetHeight||0;i>o&&(o=i)}),o<56&&(o=72),r.querySelectorAll("div.class_div").forEach(s=>{let i=parseInt(s.getAttribute("classNum")||"1",10)||1,l=s.scrollHeight||0;if(l>0){let f=Math.ceil(l/i);o=e?Math.max(o,Math.min(f,88)):Math.max(o,f)}}),e?o=Math.min(Math.max(o,72),88):(o<64&&(o=72),o>160&&(o=120)),r.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(s=>{s.style.setProperty("height",o+"px","important")}),r.querySelectorAll("td").forEach(s=>{let i=Array.from(s.querySelectorAll(":scope > div.class_div"));if(!i.length)return;s.style.setProperty("position","relative","important"),s.style.setProperty("vertical-align","top","important"),s.style.setProperty("overflow","visible","important");let l=s.getBoundingClientRect().width||s.offsetWidth||s.clientWidth||0,f=getComputedStyle(s),h=s.closest("table"),E=h?getComputedStyle(h):null,$=parseFloat(f.borderLeftWidth)||0,j=E&&E.borderCollapse==="collapse"?$/2:$,z=Math.max(1,i.length);i.forEach((F,J)=>{let D=parseInt(F.getAttribute("classNum")||"1",10)||1,R=op(l,z,J,j),B=R.left,K=R.width;F.style.setProperty("position","absolute","important"),F.style.setProperty("top","0px","important"),F.style.setProperty("left",B+"px","important"),F.style.setProperty("right","auto","important"),F.style.setProperty("bottom","auto","important"),F.style.setProperty("transform","none","important"),F.style.setProperty("width",K+"px","important"),F.style.setProperty("max-width","none","important"),F.style.setProperty("height",o*D+"px","important"),F.style.setProperty("margin","0","important"),F.style.setProperty("box-sizing","border-box","important"),F.style.setProperty("z-index","2","important"),F.style.setProperty("overflow","hidden","important")})})}catch(t){console.warn("[URP++] week schedule fix failed",t)}}a(ne,"fixWeekScheduleLayout");function xa(){try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;if(!t||t.__urpppDivBuildPatched||typeof t.divBuild!="function")return;t.__urpppDivBuildPatched=!0;let r=t.divBuild;t.__urpppOriginalDivBuild=r,t.divBuild=function(){try{ne()}catch{try{return r.apply(this,arguments)}catch{}}};try{t.divBuild._urppp=!0}catch{}}catch(t){console.warn("[URP++] patch divBuild failed",t)}}a(xa,"patchSiteDivBuild");let Br=null,zo=!1;function Lo(){let t=document.getElementById("mycoursetable")||document.getElementById("page-content-template")||document.body;if(Br&&Br.root===t&&t?.isConnected){ne();return}Br&&Br.disconnect(),Br=null;let r=!zo;zo=!0;let e=!1,o=a(()=>{if(!(e||dr())&&!(!document.getElementById("soliderbox")&&!document.getElementById("mycoursetable"))){e=!0;try{xa(),ne()}finally{setTimeout(()=>{e=!1},40)}}},"run");xa(),[0,50,150,400,1e3,2e3].forEach(l=>setTimeout(()=>{xa(),o()},l)),r&&window.addEventListener("resize",()=>{clearTimeout(window.__urpppWeekSchedResize),window.__urpppWeekSchedResize=setTimeout(o,120)});let s=a(l=>{if(!l||dr())return;let f=[];l.nodeType===1&&(l.matches&&l.matches("div.class_div")&&f.push(l),l.querySelectorAll&&l.querySelectorAll("div.class_div").forEach(h=>f.push(h))),f.forEach(h=>{let E=h.parentElement;E&&E.tagName==="TD"&&E.style.setProperty("position","relative","important"),h.style.setProperty("position","absolute","important"),h.style.setProperty("top","0px","important"),h.style.setProperty("left","0px","important"),h.style.setProperty("right","auto","important"),h.style.setProperty("transform","none","important"),h.style.setProperty("width","100%","important"),h.style.setProperty("margin","0","important"),h.style.setProperty("box-sizing","border-box","important")})},"pinNew"),i=new MutationObserver(l=>{if(dr())return;let f=!1;l.forEach(h=>{if(h.type==="childList"&&h.addedNodes.forEach(E=>{s(E),f=!0}),h.type==="attributes"&&h.attributeName==="style"&&h.target&&h.target.classList&&h.target.classList.contains("class_div")){let E=h.target,$=E.style.left||"",j=parseFloat($);(!$||$==="auto"||Number.isFinite(j)&&j>200)&&(E.style.setProperty("left","0px","important"),E.style.setProperty("top","0px","important"),E.style.setProperty("position","absolute","important")),f=!0}}),f&&(clearTimeout(window.__urpppWeekSchedMut),window.__urpppWeekSchedMut=setTimeout(()=>{requestAnimationFrame(o)},16))});if(t){i.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]});let l=null,f=0,h=0;if(t.id==="mycoursetable"&&typeof window.ResizeObserver=="function"){let E=t.getBoundingClientRect().width||0;l=new window.ResizeObserver($=>{let j=$[0]?.contentRect?.width||t.getBoundingClientRect().width||0;!j||Math.abs(j-E)<.5||(E=j,f||(f=requestAnimationFrame(()=>{f=0,o()})),clearTimeout(h),h=setTimeout(o,80))}),l.observe(t)}Br={root:t,observer:i,disconnect(){i.disconnect(),l&&l.disconnect(),f&&cancelAnimationFrame(f),clearTimeout(h)}}}r&&document.addEventListener("mouseup",()=>{document.getElementById("soliderbox")&&(setTimeout(o,200),setTimeout(o,500))},!0)}a(Lo,"scheduleWeekScheduleFix");function qo(){try{let t=document.getElementById("curriculumInfo-divcon2");if(!t)return;let r=parseFloat(t.style.width||getComputedStyle(t).width||"0");if(!r||r<40)return;t.classList.add("urppp-curriculum-drawer");let e=t.querySelector(".modal-body");if(!e)return;let o=e.querySelector(":scope > .col-xs-12 > .row")||e.querySelector(".col-xs-12 > .row")||e.querySelector(".row");if(!o)return;o.classList.add("urppp-drawer-layout");let s=o.querySelector(":scope > .urppp-drawer-toolbar, :scope > p");s&&s.tagName==="P"&&s.classList.add("urppp-drawer-toolbar");let i=o.querySelector(":scope > .urppp-drawer-body"),l=o.querySelector(".urppp-drawer-left"),f=o.querySelector(".urppp-drawer-right");i||(i=document.createElement("div"),i.className="urppp-drawer-body"),l||(l=document.createElement("div"),l.className="urppp-drawer-left"),f||(f=document.createElement("div"),f.className="urppp-drawer-right"),i.contains(l)||i.appendChild(l),i.contains(f)||i.appendChild(f),i.parentElement!==o&&(s&&s.parentElement===o?o.insertBefore(i,s.nextSibling):o.appendChild(i)),s&&o.firstElementChild!==s&&o.insertBefore(s,o.firstElementChild);let h=o.querySelector("#treeDemo, .ztree")||t.querySelector("#treeDemo, .ztree"),E=null;if(h){E=h.closest(".col-xs-6, .col-sm-6, .widget-box")||h.parentElement;let J=h.closest(".col-xs-6, .col-sm-6");J&&(E=J)}let $=["fajh","xnxq","kz","kc","kcfa"],j=$.map(J=>document.getElementById(J)).filter(J=>J&&t.contains(J));E&&E.parentElement!==l&&l.appendChild(E),Array.from(l.children).forEach(J=>{($.includes(J.id)||J.id&&$.includes(J.id)||J!==E&&J.querySelector&&!J.querySelector("#treeDemo, .ztree")&&J.classList&&J.classList.contains("col-xs-6"))&&f.appendChild(J)}),$.forEach(J=>{let D=document.getElementById(J);!D||!t.contains(D)||(D.parentElement!==f&&f.appendChild(D),D.style.setProperty("width","100%","important"),D.style.setProperty("max-width","100%","important"),D.style.setProperty("float","none","important"),D.style.setProperty("margin","0","important"),D.style.setProperty("padding","0","important"),D.style.setProperty("box-sizing","border-box","important"),D.style.display!=="none"&&getComputedStyle(D).display!=="none"&&D.style.setProperty("display","block","important"))});let z=document.getElementById("fajh");z&&t.contains(z)&&(z.parentElement!==f&&f.appendChild(z),(!z.innerHTML||!z.innerHTML.trim())&&!z.querySelector(".urppp-drawer-skeleton, .profile-user-info, .widget-box")&&(z.innerHTML=["<div class='widget-box transparent urppp-drawer-skeleton'>","  <div class='widget-header widget-header-small'>","    <h4 class='widget-title smaller grey'>方案计划信息</h4>","  </div>","</div>","<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>","  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>","</div>"].join(""),z.style.setProperty("display","block","important"),z.dataset.urpppSkeleton="1"),z.dataset.urpppSkeleton==="1"&&z.querySelector(".profile-info-value")&&/方案名称|计划名称|年级|院系/.test(z.textContent||"")&&(delete z.dataset.urpppSkeleton,z.querySelectorAll(".urppp-drawer-skeleton, .urppp-drawer-skeleton-card").forEach(D=>D.remove())),z.innerHTML&&z.innerHTML.trim()&&z.style.display==="none"&&(z.dataset.urpppSkeleton==="1"||z.querySelector(".profile-user-info"))&&z.style.setProperty("display","block","important")),f.style.setProperty("min-height","240px","important"),l.style.setProperty("min-height","240px","important"),E&&(E.style.setProperty("width","100%","important"),E.style.setProperty("max-width","100%","important"),E.style.setProperty("float","none","important"),E.style.setProperty("margin","0","important"),E.style.setProperty("padding","0","important"),E.style.setProperty("border","none","important"),E.style.setProperty("box-sizing","border-box","important"));let F=l.querySelector(".widget-box");F&&(F.style.setProperty("width","100%","important"),F.style.setProperty("margin","0","important"),F.style.setProperty("border",Ir(),"important"),F.style.setProperty("border-radius","12px","important"),F.style.setProperty("overflow","hidden","important"),F.style.setProperty("background","var(--surface)","important")),t.querySelectorAll(".profile-info-row").forEach(J=>{J.classList.remove("urppp-query-row","urppp-dual-pair"),J.style.setProperty("display","grid","important"),J.style.setProperty("grid-template-columns","112px minmax(0,1fr)","important"),J.style.setProperty("width","100%","important"),Array.from(J.children).forEach(D=>{D.classList&&(D.style.setProperty("float","none","important"),D.style.setProperty("margin-left","0","important"),D.style.setProperty("width","auto","important"),D.style.setProperty("max-width","none","important"))})}),t.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(J=>{J.classList.remove("urppp-query-form");try{Le(J)}catch{}J.querySelectorAll(".profile-info-value, .profile-info-value span, span.editable").forEach(D=>{D.style.setProperty("color","var(--text)","important"),D.style.setProperty("opacity","1","important"),D.style.setProperty("visibility","visible","important")}),J.style.setProperty("border-radius","12px","important"),J.style.setProperty("overflow","hidden","important"),J.style.setProperty("width","100%","important"),J.style.setProperty("max-width","100%","important"),J.style.setProperty("display","block","important"),J.style.setProperty("box-sizing","border-box","important")})}catch(t){console.warn("[URP++] curriculum drawer beautify failed",t)}}a(qo,"beautifyCurriculumDrawer");function Mi(){if(window.__urpppCurriculumDrawerBound)return;window.__urpppCurriculumDrawerBound=!0;let t=a(()=>qo(),"run");[0,50,150,350,800,1600].forEach(o=>setTimeout(t,o));let r=new MutationObserver(o=>{o.some(i=>!!(i.type==="childList"||i.type==="attributes"&&i.target&&(i.target.id==="curriculumInfo-divcon2"||i.target.id==="fajh")))&&(clearTimeout(window.__urpppCurriculumDrawerTimer),window.__urpppCurriculumDrawerTimer=setTimeout(()=>requestAnimationFrame(t),16))}),e=document.getElementById("curriculumInfo-divcon2");e&&r.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),document.addEventListener("click",o=>{if(!document.getElementById("curriculumInfo-divcon2"))return;let s=o.target&&o.target.closest?o.target.closest("a,button,span,div"):null,i=(s&&s.textContent||"").replace(/\s+/g,"");(/培养方案|与我相关|方案计划|自动化培养/.test(i)||s&&s.closest&&s.closest("#curriculumInfo-divcon2"))&&(setTimeout(t,0),setTimeout(t,50),setTimeout(t,150),setTimeout(t,400))},!0)}a(Mi,"scheduleCurriculumDrawerBeautify");let{scheduleScrubTableInlineBg:To,scrubTableHeaderInlineBg:$i}=Ep({isNativePdfIsolationActive:dr}),{disarmNoticeTableHover:Ii,pinNoticeRowSurface:Mo,scrubNoticeInlineBg:$o,stripMistakenNoticeTable:Io}=Lp({getCurrentTheme:Qt});function ya(){try{let t=document.querySelector("h4.header, h3.header, h4, h3, .breadcrumb, .page-header");return kp({pathname:location.pathname,href:location.href,title:document.title,headingText:t?.textContent||""})}catch{return!1}}a(ya,"isNoticePageContext");function Ni(t){return ro(t,{noticePage:ya()})}a(Ni,"isNoticeListTable");function va(t){return Ap(t,{noticePage:ya()})}a(va,"isBusinessDataTable");let No,{bindNoticeHoverScrub:Bi,scheduleBeautifyNoticeTables:Bo}=zp({beautifyNoticeTables:a(t=>No(t),"beautifyNoticeTables"),pinNoticeRowSurface:Mo});({beautifyNoticeTables:No}=qp({isNativePdfIsolationActive:dr,bindNoticeHoverScrub:Bi,scrubNoticeInlineBg:$o,stripMistakenNoticeTable:Io,disarmNoticeTableHover:Ii,pinNoticeRowSurface:Mo,isBusinessDataTable:va,isNoticeListTable:Ni,isNoticePageContext:ya,isNoticeBulletText:to}));let{wrapTables:Fo,bindTableWrapObserver:Do}=Sp({isNativePdfIsolationActive:dr,isBusinessDataTable:va});function pe(){try{document.querySelectorAll(".modal").forEach(r=>{if(!r||!r.style)return;r.style.getPropertyPriority("display")==="important"&&r.style.removeProperty("display"),r.classList.contains("in")||r.classList.contains("show")?r.style.display==="none"&&r.style.removeProperty("display"):(r.style.display==="block"||getComputedStyle(r).display!=="none")&&(r.style.setProperty("display","none","important"),setTimeout(()=>{try{!r.classList.contains("in")&&!r.classList.contains("show")&&(r.style.getPropertyPriority("display")==="important"&&r.style.removeProperty("display"),r.style.display="none")}catch{}},0))}),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(r=>{try{r.parentElement&&r.parentElement.removeChild(r)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right")))}catch{}}a(pe,"cleanupStuckModals");function Fi(){if(window.__urpppModalOpenPatched)return;window.__urpppModalOpenPatched=!0;let t=a(i=>{!i||!i.style||(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.getPropertyPriority("opacity")==="important"&&i.style.removeProperty("opacity"),i.style.getPropertyPriority("pointer-events")==="important"&&i.style.removeProperty("pointer-events"),i.style.getPropertyPriority("visibility")==="important"&&i.style.removeProperty("visibility"))},"unlock"),r=a(i=>{if(!(!i||!i.classList))try{i.classList.remove("in","show"),i.setAttribute("aria-hidden","true"),i.style.removeProperty("display"),i.style.setProperty("display","none","important"),setTimeout(()=>{try{!i.classList.contains("in")&&!i.classList.contains("show")&&(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.display="none")}catch{}},30)}catch{}},"forceHide"),e=a(()=>{document.querySelectorAll(".modal-backdrop").forEach(i=>{try{i.parentElement&&i.parentElement.removeChild(i)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"),document.body.style.removeProperty("overflow"))},"clearBackdrops"),o=a(i=>{if(i){if(i.classList&&i.classList.contains("modal-backdrop")&&(i=document.querySelector(".modal.in, .modal.show")||i),!i||!i.classList||!i.classList.contains("modal")){e();return}t(i),r(i),e();try{let l=typeof ze=="function"&&ze()||typeof unsafeWindow<"u"&&(unsafeWindow.jQuery||unsafeWindow.$)||window.jQuery||window.$;if(l&&l.fn&&typeof l.fn.modal=="function"){try{l(i).trigger("hide.bs.modal")}catch{}try{l(i).modal("hide")}catch{}try{l(i).trigger("hidden.bs.modal")}catch{}}}catch{}setTimeout(()=>{r(i),document.querySelector(".modal.in, .modal.show")||e();try{pe()}catch{}},0)}},"hideModalEl");document.addEventListener("show.bs.modal",i=>{let l=i.target;if(!(!l||!l.classList||!l.classList.contains("modal"))){t(l),l.style.display==="none"&&l.style.removeProperty("display");try{l.getAttribute("data-backdrop")==="static"&&l.setAttribute("data-backdrop","true"),l.dataset&&(l.dataset.backdrop="true")}catch{}}},!0),document.addEventListener("hide.bs.modal",i=>{let l=i.target;!l||!l.classList||!l.classList.contains("modal")||t(l)},!0),document.addEventListener("hidden.bs.modal",i=>{let l=i.target;!l||!l.classList||!l.classList.contains("modal")||(r(l),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(f=>{try{f.parentElement&&f.parentElement.removeChild(f)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"))))},!0);let s=a(i=>{let l=i.target;if(!l||!l.closest||l.closest(".modal-dialog, .modal-content, .modal-header, .modal-body, .modal-footer")&&!l.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return;if(l.classList&&l.classList.contains("modal-backdrop")){let $=document.querySelector(".modal.in, .modal.show")||document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"]');$?(i.preventDefault(),i.stopPropagation(),o($)):(i.preventDefault(),e(),pe());return}let f=null;if(l.classList&&l.classList.contains("modal")?f=l:f=l.closest(".modal.in, .modal.show, .modal"),!f||!f.classList.contains("modal")||!(f.classList.contains("in")||f.classList.contains("show")||getComputedStyle(f).display!=="none"))return;let E=f.querySelector(".modal-dialog");if(E){let $=E.getBoundingClientRect(),j=i.clientX,z=i.clientY;if(j>=$.left&&j<=$.right&&z>=$.top&&z<=$.bottom&&!l.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return}else if(l.closest(".modal-content"))return;i.preventDefault(),i.stopPropagation(),o(f)},"onBlankClose");document.addEventListener("pointerdown",s,!0),document.addEventListener("mousedown",s,!0),document.addEventListener("click",s,!0),document.addEventListener("click",i=>{let l=i.target&&i.target.closest?i.target.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'):null;if(!l)return;let f=l.closest(".modal");f&&(i.preventDefault(),i.stopPropagation(),o(f)),setTimeout(()=>{try{pe()}catch{}},50),setTimeout(()=>{try{pe()}catch{}},220)},!0),document.addEventListener("click",i=>{let l=i.target&&i.target.closest?i.target.closest("a,button,td,span,div,i"):null;if(!l)return;["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon","billContainer"].forEach(h=>{let E=document.getElementById(h);E&&(t(E),E.style.opacity==="0"&&E.style.removeProperty("opacity"),E.style.pointerEvents==="none"&&E.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(h=>t(h));let f=l.getAttribute&&(l.getAttribute("data-target")||l.getAttribute("href")||"");if(f&&f.charAt(0)==="#"){let h=document.querySelector(f);h&&t(h)}},!0)}a(Fi,"patchModalOpenPath");let Fr=null,wa=0;function ka(){if(dr())return;let t=document.getElementById("courseTable");t&&t.querySelectorAll("td").forEach(r=>{let e=r.style.backgroundColor;if(!e||!e.includes("rgba"))return;let o=e.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);o&&(r.style.backgroundColor=`rgba(${o[1]},${o[2]},${o[3]},0.5)`)})}a(ka,"applyCourseTableOpacity");function jo(){let t=document.getElementById("mycoursetable")||document.getElementById("courseTable");if(Fr&&Fr.root===t&&t?.isConnected){ka();return}if(clearTimeout(wa),Fr&&Fr.observer.disconnect(),Fr=null,!t)return;let r=new MutationObserver(()=>{clearTimeout(wa),wa=setTimeout(ka,60)});r.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style"]}),Fr={root:t,observer:r},ka()}a(jo,"bindCourseTableOpacityObserver");function Di(){try{let z=Qt();document.documentElement.dataset.urpppTheme=z,document.documentElement.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),document.documentElement.classList.add("urppp-theme-"+z),document.body&&(document.body.dataset.urpppTheme=z,document.body.classList.toggle("urppp-dark",z==="dark"))}catch{}let t=document.getElementById("urppp-internal-style");t||(t=document.createElement("style"),t.id="urppp-internal-style",document.head.appendChild(t));{let z=t;z.textContent=Fp}let r=document.getElementById("urppp-table-beautify-style");r||(r=document.createElement("style"),r.id="urppp-table-beautify-style",document.head.appendChild(r)),r.textContent=Hp;let e=document.getElementById("urppp-navigation-style");e||(e=document.createElement("style"),e.id="urppp-navigation-style",document.head.appendChild(e)),e.textContent=Rp;let o=document.getElementById("urppp-dashboard-style");o||(o=document.createElement("style"),o.id="urppp-dashboard-style",document.head.appendChild(o)),o.textContent=Wp;let s=document.getElementById("urppp-schedule-card-style");s||(s=document.createElement("style"),s.id="urppp-schedule-card-style",document.head.appendChild(s)),s.textContent=Dp;let i=document.getElementById("urppp-mobile-style");i||(i=document.createElement("style"),i.id="urppp-mobile-style",document.head.appendChild(i)),i.textContent=Jp;try{pr()}catch{}pe(),Fi(),["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon"].forEach(z=>{let F=document.getElementById(z);!F||!F.style||(["display","opacity","pointer-events","visibility"].forEach(J=>{F.style.getPropertyPriority(J)==="important"&&F.style.removeProperty(J)}),F.style.opacity==="0"&&F.style.removeProperty("opacity"),F.style.pointerEvents==="none"&&F.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(z=>{z.style&&z.style.getPropertyPriority("display")==="important"&&z.style.removeProperty("display")}),Fo(),Bo(),To(),setTimeout(()=>document.querySelectorAll("table").forEach(z=>{va(z)&&Io(z)}),500),Lo(),ne(),Mi(),qo(),Do();let l=document.querySelector(".page-content");l&&l.querySelectorAll(".widget-box").length>=4&&setTimeout(ss,500),on(),kr(),h();function h(){let z="(max-width: 640px)",F=a(()=>!!(window.matchMedia&&window.matchMedia(z).matches),"isNarrow"),J=a((W,nt)=>{if(!(!W||!document.body)){if(nt){Object.hasOwn(W.dataset,"urpppDesktopSidebarMin")||(W.dataset.urpppDesktopSidebarMin=W.classList.contains("menu-min")?"1":"0",W.dataset.urpppDesktopBodyMin=document.body.classList.contains("menu-min")?"1":"0"),W.classList.remove("menu-min"),document.body.classList.remove("menu-min");return}Object.hasOwn(W.dataset,"urpppDesktopSidebarMin")&&(W.classList.toggle("menu-min",W.dataset.urpppDesktopSidebarMin==="1"),document.body.classList.toggle("menu-min",W.dataset.urpppDesktopBodyMin==="1"),delete W.dataset.urpppDesktopSidebarMin,delete W.dataset.urpppDesktopBodyMin)}},"syncMobileSidebarMode"),D=new WeakMap,R=a(W=>{let nt=D.get(W);nt&&cancelAnimationFrame(nt),D.delete(W)},"stopDrawerAnimation"),B=a((W,nt)=>{R(W);let lt=W.getBoundingClientRect(),xt=Math.max(lt.width,W.offsetWidth||0,260),gt=Math.max(-xt,Math.min(0,lt.left)),St=nt?0:-xt,qt=Math.abs(St-gt),Ft=Math.max(140,Math.round(260*qt/xt)),cr=performance.now(),Ht=W.classList.contains("urppp-clean-sidebar"),er=Ht?"12030":"1200",It=Ht?"12030":"1030";W.style.setProperty("display","block","important"),W.style.setProperty("transition","none","important"),W.style.setProperty("visibility","visible","important"),W.style.setProperty("pointer-events",nt?"auto":"none","important"),W.style.setProperty("z-index",er,"important"),W.style.setProperty("transform",`translate3d(${gt}px, 0, 0)`,"important"),W.classList.toggle("urppp-drawer-closing",!nt),W.classList.add("display");let At=a(()=>{W.style.setProperty("transform",`translate3d(${St}px, 0, 0)`,"important"),nt?(W.classList.remove("urppp-drawer-closing"),W.style.setProperty("pointer-events","auto","important")):(W.classList.remove("display","urppp-drawer-closing"),W.style.setProperty("visibility","hidden","important"),W.style.setProperty("z-index",It,"important")),D.delete(W)},"finish");if(qt<1){At();return}let hr=a(Mt=>{if(!W.isConnected){D.delete(W);return}let Rt=Math.min(1,(Mt-cr)/Ft),Un=Rt<.5?4*Rt*Rt*Rt:1-Math.pow(-2*Rt+2,3)/2,He=gt+(St-gt)*Un;if(W.style.setProperty("transform",`translate3d(${He}px, 0, 0)`,"important"),Rt>=1){At();return}D.set(W,requestAnimationFrame(hr))},"step");D.set(W,requestAnimationFrame(hr))},"animateDrawer"),K=a((W,nt,lt)=>{if(W){B(W,lt),nt&&(nt.setAttribute("aria-expanded",lt?"true":"false"),nt.setAttribute("aria-label",lt?"关闭菜单":"打开菜单"));try{jr()}catch{}}},"setDrawerOpen"),ut=a(()=>{K(document.getElementById("sidebar"),document.getElementById("urppp-mobile-menu-button"),!1)},"closeDrawer"),vt=a(()=>{let nt=document.getElementById("urppp-mobile-search-panel")?.querySelector("#form-search");if(!nt)return;Object.entries({position:"relative",right:"auto",top:"auto",left:"auto",transform:"none",width:"100%","min-width":"0","max-width":"none",height:"36px",opacity:"1",margin:"0",overflow:"visible","z-index":"1"}).forEach(([xt,gt])=>nt.style.setProperty(xt,gt,"important")),[nt.querySelector("form"),nt.querySelector(".input-icon")].forEach(xt=>{xt&&Object.entries({display:"block",position:"relative",width:"100%","min-width":"0","max-width":"none",height:"36px",margin:"0",padding:"0","box-sizing":"border-box"}).forEach(([gt,St])=>xt.style.setProperty(gt,St,"important"))});let lt=nt.querySelector("#search-input");lt&&(lt.style.setProperty("display","block","important"),lt.style.setProperty("width","100%","important"),lt.style.setProperty("min-width","0","important"),lt.style.setProperty("max-width","none","important"),lt.style.setProperty("height","36px","important"),lt.style.setProperty("box-sizing","border-box","important"))},"syncMobileSearchLayout"),_t=a(()=>{let W=document.getElementById("form-search");if(!W||!W.__urpppMobileParent)return;let nt=W.__urpppMobileParent,lt=W.__urpppMobileNext;nt.isConnected&&(lt&&lt.parentElement===nt?nt.insertBefore(W,lt):nt.appendChild(W)),W.classList.remove("urppp-mobile-form-search"),W.dataset.open="0",W.removeAttribute("style"),delete W.__urpppMobileParent,delete W.__urpppMobileNext;try{dt()}catch{}},"restoreMobileSearch"),zt=a(()=>{let W=document.querySelector("#navbar .menu-toggler");!W||W.dataset.urpppMobileHidden!=="1"||(W.style.removeProperty("display"),W.removeAttribute("aria-hidden"),W.dataset.urpppPreviousTabindex?W.setAttribute("tabindex",W.dataset.urpppPreviousTabindex):W.removeAttribute("tabindex"),delete W.dataset.urpppPreviousTabindex,delete W.dataset.urpppMobileHidden)},"restoreNativeMenuToggler"),Lt=a(()=>{let W=document.getElementById("urppp-mobile-menu-button");if(!F())return W?.remove(),zt(),null;if(W)return W;let nt=document.getElementById("navbar"),lt=document.getElementById("sidebar");if(!nt||!lt)return null;let xt=nt.querySelector(".menu-toggler");xt&&(xt.dataset.urpppMobileHidden="1",xt.dataset.urpppPreviousTabindex=xt.getAttribute("tabindex")||"",xt.style.setProperty("display","none","important"),xt.setAttribute("aria-hidden","true"),xt.setAttribute("tabindex","-1"));let gt=document.createElement("button");gt.type="button",gt.id="urppp-mobile-menu-button",gt.className="urppp-mobile-menu-button",gt.setAttribute("aria-label","打开菜单"),gt.setAttribute("aria-expanded","false");let St=nt.querySelector(".navbar-container")||nt;return St.insertBefore(gt,St.firstChild),gt},"ensureMenuToggler"),jt=a(W=>{!W||W.dataset.urpppIconReady||(W.dataset.urpppIconReady="1",W.innerHTML=['<span class="urppp-menu-icon" aria-hidden="true">','<svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false">','<path d="M5 8h14"></path><path d="M5 16h10"></path>',"</svg>",'<svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false">','<path d="M7 7l10 10"></path><path d="M17 7 7 17"></path>',"</svg>","</span>"].join(""))},"ensureMenuButtonIcon"),Ot=a(()=>{let W=Lt(),nt=document.getElementById("sidebar");W&&jt(W),W&&nt&&!W.__urpppToggleHandler&&(W.setAttribute("aria-label","打开菜单"),W.setAttribute("aria-expanded",nt.classList.contains("display")?"true":"false"),W.__urpppToggleHandler=lt=>{lt.preventDefault(),lt.stopImmediatePropagation(),F()&&J(nt,!0);let xt=W.getAttribute("aria-expanded")!=="true";K(nt,W,xt)},W.addEventListener("click",W.__urpppToggleHandler,!0)),document.__urpppMobileDrawerOutsideBound||(document.__urpppMobileDrawerOutsideBound=!0,document.addEventListener("click",lt=>{if(!F()||!lt.target.closest)return;let xt=document.getElementById("sidebar");if(!xt||!xt.classList.contains("display"))return;let gt=document.getElementById("urppp-clean-root");gt&&gt.classList.contains("open")||lt.target.closest("#sidebar, #urppp-mobile-menu-button")||ut()},!0)),document.__urpppMobileRouteCloseBound||(document.__urpppMobileRouteCloseBound=!0,document.addEventListener("click",lt=>{if(!F()||!lt.target.closest)return;let xt=document.getElementById("urppp-clean-root");if(xt&&xt.classList.contains("open"))return;let gt=lt.target.closest("#sidebar a[href]");if(!gt)return;let St=String(gt.getAttribute("href")||"").trim();!St||St==="#"||St.startsWith("javascript")||ut()}))},"bindDrawerControls"),Tt=a((W,nt)=>{let lt=W?W.cloneNode(!0):document.createElement("a");return lt.className="urppp-mobile-user-action",lt.removeAttribute("style"),lt.removeAttribute("id"),!W&&nt&&(lt.href=nt.href,nt.onclick&&lt.setAttribute("onclick",nt.onclick),lt.innerHTML='<i class="ace-icon fa '+nt.icon+'" aria-hidden="true"></i><span>'+nt.label+"</span>"),lt},"createActionLink"),rr=a((W,nt)=>{if(document.getElementById("urppp-mobile-user"))return;let lt=W.querySelector(":scope > li.light-blue")||Array.from(W.children).find(Rt=>Rt.querySelector&&Rt.querySelector(".nav-user-photo, .user-menu, .dropdown-menu")),xt=document.createElement("section");xt.id="urppp-mobile-user",xt.className="urppp-mobile-user";let gt=document.createElement("div");gt.className="urppp-mobile-user-identity";let St=lt?.querySelector(".nav-user-photo")||document.querySelector("#navbar .nav-user-photo"),qt=St?St.cloneNode(!0):document.createElement("img");qt.className="nav-user-photo",qt.removeAttribute("style"),qt.getAttribute("src")||qt.setAttribute("src","/main/queryStudent/img"),qt.setAttribute("data-urppp-private","avatar"),qt.alt=St?.alt?.replace(/\s+/g," ").trim()||"用户头像";let Ft=lt?.querySelector(".user-info")||document.querySelector("#navbar .user-info"),cr=document.createElement("span");cr.className="urppp-mobile-user-copy";let Ht=document.createElement("small");Ht.className="urppp-mobile-user-welcome",Ht.textContent="欢迎您，";let er=document.createElement("span");er.className="user-info urppp-user-name-value",er.setAttribute("data-urppp-private","name"),er.textContent=Ft?.textContent?.replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim()||St?.alt?.replace(/\s+/g," ").trim()||"我的账户",cr.append(Ht,er),gt.append(qt,cr),xt.appendChild(gt);let It=document.createElement("div");It.className="urppp-mobile-user-actions";let At=lt?Array.from(lt.querySelectorAll(".user-menu a, .dropdown-menu a")):[],hr=[{label:"首页",href:"/",icon:"fa-home"},{label:"在线反馈",href:"/main/systemQuestion/index",icon:"fa-question-circle"},{label:"修改密码",href:"javascript:changePassword('/student/rollManagement/personalInfoUpdate/updatePassword')",icon:"fa-user"},{label:"注销",href:"/logout",icon:"fa-power-off"}];At.length?At.forEach(Rt=>It.appendChild(Tt(Rt))):hr.forEach(Rt=>It.appendChild(Tt(null,Rt))),xt.appendChild(It);let Mt=nt.querySelector(".urppp-sidebar-header");Mt&&Mt.nextSibling?nt.insertBefore(xt,Mt.nextSibling):Mt?nt.appendChild(xt):nt.insertBefore(xt,nt.firstChild);try{Vt(xt)}catch{}},"ensureMobileUser"),Rn=a((W,nt,lt,xt={})=>{if(!lt||document.getElementById("urppp-mobile-quick"))return;let gt=document.createElement("section");gt.id="urppp-mobile-quick",gt.className="urppp-mobile-quick",gt.innerHTML='<div class="urppp-mobile-quick-title">快捷功能</div>';let St=document.createElement("div");St.className="urppp-mobile-tool-row";let qt=W.querySelector(':scope > li > a[href*="customerServiceCenter"]'),Ft=qt?qt.cloneNode(!0):document.createElement("a");Ft.className="urppp-mobile-tool-button urppp-mobile-help-button",Ft.removeAttribute("style"),Ft.removeAttribute("onclick"),Ft.removeAttribute("data-toggle"),Ft.removeAttribute("target"),Ft.querySelectorAll("[style]").forEach(At=>At.removeAttribute("style"));let cr=String(Ft.getAttribute("href")||"").trim();(!cr||cr==="#"||cr.startsWith("javascript"))&&(Ft.href="/main/customerServiceCenter"),Ft.querySelector("i")||(Ft.innerHTML='<i class="ace-icon glyphicon glyphicon-headphones" aria-hidden="true"></i>'),Ft.querySelectorAll("span").forEach(At=>At.remove()),Ft.insertAdjacentHTML("beforeend","<span>帮助</span>"),St.appendChild(Ft);let Ht=document.createElement("button");Ht.type="button",Ht.id="urppp-mobile-search-button",Ht.className="urppp-mobile-tool-button",Ht.setAttribute("aria-expanded","false"),Ht.innerHTML='<i class="ace-icon fa fa-search" aria-hidden="true"></i><span>搜索</span>',St.appendChild(Ht),gt.appendChild(St);let er=document.createElement("div");er.className="urppp-mobile-quick-links",Array.from(W.querySelectorAll(":scope > li > a")).forEach(At=>{let hr=At.closest("li");if(hr?.classList.contains("light-blue")||hr?.querySelector("#intellegenceUDiv, #form-search")||At===qt||At.classList.contains("dropdown-toggle")||!At.getAttribute("href")&&!At.getAttribute("onclick"))return;let Mt=At.cloneNode(!0);Mt.className="urppp-mobile-quick-link",Mt.removeAttribute("style");let Rt=String(At.getAttribute("onclick")||"");if(/openWorkRestSchedule|open\w*Schedule/i.test(Rt)||Mt.removeAttribute("onclick"),xt.cleanMode){let He=String(At.getAttribute("href")||"");(He==="/holiday"||/holiday/i.test(He)||/假期/.test(At.textContent||""))&&(Mt.removeAttribute("href"),Mt.removeAttribute("target"),Mt.style.cursor="default",Mt.style.pointerEvents="none")}er.appendChild(Mt)});let It=document.createElement("div");It.id="urppp-mobile-search-panel",It.className="urppp-mobile-search-panel",It.hidden=!0;{let At=document.getElementById("form-search");At&&(At.__urpppMobileParent||(At.__urpppMobileParent=At.parentElement,At.__urpppMobileNext=At.nextSibling),At.classList.add("urppp-mobile-form-search"),At.dataset.open="0",It.appendChild(At),vt())}gt.appendChild(It),er.children.length&&gt.appendChild(er),Ht.addEventListener("click",At=>{if(At.preventDefault(),At.stopPropagation(),It.hidden){vt();let Mt=It.querySelector("#form-search");Mt&&(Mt.dataset.open="0",Mt.style.setProperty("pointer-events","auto","important"),Mt.style.setProperty("opacity","1","important"),Mt.style.setProperty("width","100%","important"),Mt.style.setProperty("min-width","0","important")),It.hidden=!1,It.classList.add("open"),setTimeout(()=>It.querySelector("#search-input")?.focus(),30),Ht.setAttribute("aria-expanded","true")}else It.hidden=!0,It.classList.remove("open"),Ht.setAttribute("aria-expanded","false")}),nt.insertBefore(gt,lt)},"ensureMobileQuick"),Cr=a(()=>{let W=F(),nt=document.querySelector("#navbar .navbar-buttons .ace-nav"),lt=document.getElementById("sidebar"),xt=document.getElementById("urppp-menus");if(lt&&J(lt,W),Ot(),!W){let gt=document.documentElement.classList.contains("urppp-clean-open");gt||_t(),gt||(document.getElementById("urppp-mobile-quick")?.remove(),document.getElementById("urppp-mobile-user")?.remove());let St=document.getElementById("urppp-nav-clean"),qt=document.getElementById("urppp-nav-theme");St&&qt&&St.parentElement!==qt&&qt.appendChild(St),qt&&qt.style.setProperty("display","inline-flex","important");return}if(!(!nt||!lt)){try{let gt=document.getElementById("urppp-nav-clean"),St=document.querySelector("#navbar .navbar-header"),qt=document.getElementById("urppp-nav-theme");gt&&St&&gt.parentElement!==St&&St.appendChild(gt),qt&&qt.style.setProperty("display","inline-flex","important"),document.getElementById("urppp-nav-cal")?.remove()}catch{}rr(nt,lt),Rn(nt,lt,xt),vt()}},"apply");window.__urpppRefreshMobileNavbar=Cr,window.__urpppCloseMobileDrawer=ut,window.__urpppSetDrawerOpen=(W,nt,lt)=>{K(W,nt,lt)},window.__urpppStopDrawerAnimation=W=>{W&&R(W)},window.__urpppInjectCleanSidebarSections=W=>{let nt=document.querySelector("#navbar .navbar-buttons .ace-nav")||document.querySelector("#navbar .ace-nav"),lt=document.getElementById("urppp-menus");if(!nt||!W)return;try{rr(nt,W)}catch{}let xt=document.getElementById("urppp-mobile-quick");if(xt){let gt=xt.querySelector("#urppp-mobile-search-panel");if(gt&&gt.querySelector("#form-search"))try{_t()}catch{}xt.remove()}try{Rn(nt,W,lt,{cleanMode:!0})}catch{}};try{Cr()}catch{}if(setTimeout(Cr,300),setTimeout(Cr,900),setTimeout(Cr,1800),window.matchMedia){let W=window.matchMedia(z),nt=a(()=>Cr(),"onChange");typeof W.addEventListener=="function"?W.addEventListener("change",nt):typeof W.addListener=="function"&&W.addListener(nt)}try{window.__urpppMobileNavbarObserver&&window.__urpppMobileNavbarObserver.disconnect();let W=0,nt=new MutationObserver(()=>{clearTimeout(W),W=setTimeout(()=>{try{Cr()}catch{}},40)}),lt=document.getElementById("navbar"),xt=document.getElementById("sidebar");lt&&nt.observe(lt,{childList:!0,subtree:!0}),xt&&nt.observe(xt,{childList:!0}),window.__urpppMobileNavbarObserver=nt}catch{}}a(h,"setupMobileNavbar");let $=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches)?"8px 8px 24px":"16px 64px 40px";if(document.querySelectorAll(".page-content, #page-content-template").forEach(z=>{z.style.setProperty("padding",$,"important"),z.style.setProperty("box-sizing","border-box","important")}),Pe(),ua(),qe(),Nr(),ha(),setTimeout(()=>{Nr(),ha()},300),setTimeout(()=>{Nr(),ha()},1e3),Eo(),_o(),So(),mr(),ba(),ae(),Co(),setTimeout(()=>{mr(),ae()},200),setTimeout(()=>{mr(),ae()},800),setTimeout(ua,350),setTimeout(ua,1e3),oe(),setTimeout(()=>oe(),400),!window.__urpppPlanTreeObs){let z=0;window.__urpppPlanTreeObs=new MutationObserver(()=>{let J=document.getElementById("treeDemo");!J||J.dataset.urpppBusy==="1"||J.querySelector('li > a:not([data-urppp-node-done="1"])')&&(clearTimeout(z),z=setTimeout(()=>oe(),220))});let F=document.getElementById("tree_div")||document.getElementById("treeDemo");F&&window.__urpppPlanTreeObs.observe(F,{childList:!0,subtree:!0})}window.__urpppWrsBound||(window.__urpppWrsBound=!0,document.addEventListener("shown.bs.modal",z=>{z.target&&(z.target.id==="work_rest_schedule_modal"||z.target.querySelector?.("#work_rest_schedule_modal"))&&setTimeout(ga,30)},!0),document.addEventListener("click",z=>{let F=z.target&&z.target.closest?z.target.closest("a,button"):null;if(!F)return;let J=F.getAttribute("onclick")||"",D=(F.textContent||"").trim();(J.includes("openWorkRestSchedule")||D.includes("作息时间表"))&&(setTimeout(ga,80),setTimeout(ga,300))},!0)),Ce(),st(),dt(),fa();let j=a(()=>{Pe(),qe(),Ce()},"layoutWave");setTimeout(j,200),setTimeout(j,800),window.__urpppLoadBound||(window.__urpppLoadBound=!0,window.addEventListener("load",()=>{st(),dt(),et(),fa(),Ce(),Pe(),qe()})),setTimeout(()=>{document.body.classList.add("urppp-ready"),wt()},600),console.log("[URP++] style applied apple-leaning");try{bindScheduleHoverNearCursor()}catch{}jo()}a(Di,"beautifyInternal");function ji(t){if(!t)return;let r=t.querySelector("#urppp-set-brutal-palettes");if(!r)return;let e=go();r.innerHTML="",Q.filter(o=>o.id!==V).forEach(o=>{let s=document.createElement("button");s.type="button",s.className="urppp-set-scheme"+(o.id===e.id?" ac":""),s.dataset.palette=o.id,s.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:#000"></span>','  <span style="background:'+o.accent+'"></span>','  <span style="background:'+o.secondary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+o.name+"</strong>","  <em>"+o.desc+"</em>","</div>"].join(""),s.addEventListener("click",()=>xo(o.id,{select:!0})),r.appendChild(s)})}a(ji,"renderBrutalPaletteCards");let Te=yp({getPrivacySettings:yr,setPrivacySettings:sa,getCustomIdentity:qr,setCustomIdentity:co,applyDisplay:a(()=>Vt(document),"applyDisplay"),refreshCleanDisplay:Na,finishActiveDirectEdit:a(t=>{br?.__finish&&br.__finish(t)},"finishActiveDirectEdit")}),Oi=Te.sync,uc=Te.collect,mc=Te.setStatus,Hi=Te.bind,Aa=fp({document,getSettings:_e,setSettings:mo,validateMapping:Pr,defaultMapping:fe,getRecoveryMessage:a(()=>rt,"getRecoveryMessage")}),bc=Aa.setStatus,Ri=Aa.sync,Ui=Aa.bind;function Ut(){let t=document.getElementById("urppp-settings-panel");if(!t)return;let r=Yt()||mt,e=Lr(),o=Qt(),s=Kt(),i=nr(),l=Mr(i),f=$r(i),h=ho(i),E={};t.querySelectorAll(".urppp-set-mode").forEach(z=>{E[z.dataset.theme]=re(z.dataset.theme,i)}),wp(t,{seed:r,currentTheme:o,followSystem:s,skinId:i,darkSupported:l,dynamicSupported:f,fixedPalettes:h,followUseDynamic:Ee(),cleanDefault:na(),cleanAnalysis:pa()?"direct":"tab",appleEdge:xr(),autoUpdate:ia(),modeAvailability:E}),h&&ji(t);try{Oi(t)}catch{}try{Ri(t)}catch{}try{window.__urpppCleanMode&&typeof window.__urpppCleanMode.refreshRender=="function"&&window.__urpppCleanMode.refreshRender()}catch{}let $=t.querySelector("#urppp-set-presets");$&&($.innerHTML="",oa().forEach(z=>{let F=document.createElement("button");F.type="button",F.className="urppp-set-swatch"+(z.toLowerCase()===r.toLowerCase()?" ac":""),F.title=z,F.style.background=z,F.addEventListener("click",()=>{GM_setValue(T,z),Kt()?Gt(vr(),{system:!0}):Gt("scu-red",{manual:!0}),Ut()}),$.appendChild(F)}));let j=t.querySelector("#urppp-set-schemes");j&&(j.innerHTML="",zr(r).forEach(z=>{let F=document.createElement("button");F.type="button",F.className="urppp-set-scheme"+(z.id===e?" ac":""),F.dataset.scheme=z.id,F.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+z.bg+'"></span>','  <span style="background:'+z.surface+";border-color:"+z.border+'"></span>','  <span style="background:'+z.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+z.name+"</strong>","  <em>"+z.desc+"</em>","</div>"].join(""),F.addEventListener("click",()=>{aa(z.id),GM_setValue(T,r),Kt()?Gt(vr(),{system:!0}):Gt("scu-red",{manual:!0}),Ut()}),j.appendChild(F)}));try{Zi(t)}catch(z){try{console.warn("[URP++] renderSkinCards",z)}catch{}}try{let z=t.querySelector(".urppp-about-ver, #urppp-about-ver");z&&(z.textContent="SCU URP++ v"+p,z.tagName==="A"&&(z.setAttribute("href",n.repo),z.setAttribute("target","_blank"),z.setAttribute("rel","noopener noreferrer")))}catch{}try{Uo(t)}catch{}}a(Ut,"syncSettingsPanelUI");let Oo=hp({document,ensurePanel:Wo,syncPanel:Ut,refreshUpdateStatus:an}),Wi=vp({document,theme:{isModeAvailable:re,apply:Gt,supportsDark:Mr,supportsDynamic:$r,getFollowSystem:Kt,setFollowSystem:ke,resolveFollowTheme:vr,getCurrent:Qt,getFollowDynamic:Ee,setFollowDynamic:ca,syncNavbar:ft},preferences:{getCleanDefault:na,setCleanDefault:Ai,getCleanAnalysis:a(()=>pa()?"direct":"tab","getCleanAnalysis"),setCleanAnalysis:Si,getAppleEdge:xr,setAppleEdge:_i,applySkin:pr,getAutoUpdate:ia,setAutoUpdate:Ei,checkUpdates:qa},accent:{normalize:Wt,setAccent:a(t=>GM_setValue(T,t),"setAccent"),savePreset:ki,getScheme:Lr,setScheme:aa,listSchemePreviews:zr},syncPanel:Ut}),Dt=Ka({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:p},uiDeps:{openSubpanel:a(t=>{t==="plugin-store"&&Sa("plugin")},"openSubpanel")}});a((function(){let r=a(()=>{try{Dt.bootFromCache("assist")}catch{}},"run");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r()}),"bootstrapPlugins")();function Ho(){return Oo.open()}a(Ho,"openSettingsPanel");function Ro(){Oo.close()}a(Ro,"closeSettingsPanel");let Me="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=";function Uo(t){let r=t&&t.querySelector?t.querySelector("#urppp-about-logo"):document.getElementById("urppp-about-logo");r&&(r.getAttribute("src")!==Me&&r.setAttribute("src",Me),r.removeAttribute("referrerpolicy"),r.alt="SCU URP++",r.style.maxWidth="100%",r.style.height="auto",r.style.display="block")}a(Uo,"ensureAboutLogo");function Wo(){if(document.getElementById("urppp-settings-panel"))return;ds();try{pr()}catch{}let t=document.createElement("div");t.id="urppp-settings-mask",t.addEventListener("click",Ro);let r=document.createElement("div");r.id="urppp-settings-panel",r.setAttribute("role","dialog"),r.setAttribute("aria-label","URP++ 设置");let e=Me;r.innerHTML=gp({logoData:Me,repositoryUrl:n.repo,version:p}),document.documentElement.appendChild(t),document.documentElement.appendChild(r),bp(r),r.querySelector("#urppp-set-close").addEventListener("click",Ro);try{Hi(r)}catch(s){console.warn("[URP++] privacy settings",s)}try{Ui(r)}catch(s){console.warn("[URP++] JSON settings",s)}try{Uo(r)}catch{}let o=r.querySelector("#urppp-about-logo");o&&!o.__urpppFallback&&(o.__urpppFallback=!0,o.addEventListener("error",()=>{o.dataset.fallback!=="1"&&(o.dataset.fallback="1",o.src=e)})),Wi.bind(r);try{Dt.renderAssistUi(r.querySelector("#urppp-set-assist-slot"))}catch(s){console.warn("[URP++] plugin manager",s)}}a(Wo,"ensureSettingsPanel");function Sa(t){let r=document.getElementById("urppp-settings-panel");if(!r)return;let e=document.getElementById("urppp-store-subpanel");e||(e=document.createElement("div"),e.id="urppp-store-subpanel",e.className="urppp-store-subpanel",e.innerHTML=`
        <div class="urppp-store-sub-head">
          <button type="button" class="urppp-store-sub-back" id="urppp-store-sub-back" aria-label="返回">←</button>
          <div class="urppp-store-sub-title" id="urppp-store-sub-title"></div>
        </div>
        <div class="urppp-store-sub-body" id="urppp-store-sub-body"></div>`,r.appendChild(e),e.querySelector("#urppp-store-sub-back").onclick=Gi);let o=e.querySelector("#urppp-store-sub-title"),s=e.querySelector("#urppp-store-sub-body");o.textContent=t==="theme"?"主题商店":"插件商店",s.innerHTML="",t==="theme"?Xo(s):Ko(s),e.classList.add("open")}a(Sa,"openStoreSubPanel");function Gi(){let t=document.getElementById("urppp-store-subpanel");if(!t)return;t.classList.remove("open");let r=t.querySelector("#urppp-store-sub-body");r&&(r.innerHTML="")}a(Gi,"closeStoreSubPanel");function Go(t){t.querySelectorAll(".urppp-store-tab").forEach(r=>{r.addEventListener("click",()=>{t.querySelectorAll(".urppp-store-tab").forEach(o=>o.className="urppp-store-tab"),r.className="urppp-store-tab ac",t.querySelectorAll(".urppp-store-pane").forEach(o=>o.style.display="none");let e=t.querySelector('.urppp-store-pane[data-pane="'+r.dataset.tab+'"]');e&&(e.style.display="")})})}a(Go,"bindStoreTabs");function Ji(t,r){return`<div class="urppp-skin-card" data-skin="${pt(t.id)}">
      <div class="urppp-skin-name">${pt(t.name||t.id)}</div>
      <div class="urppp-skin-meta">${pt(t.author||"")}${t.author&&t.version?" · ":""}v${pt(t.version||"")}</div>
      <p class="urppp-skin-desc">${pt(t.description||"")}</p>
      <button type="button" class="urppp-skin-apply" data-store-theme="${pt(t.id)}"${r?" disabled":""}>${r?"已安装":"下载"}</button>
    </div>`}a(Ji,"themeStoreCard");async function Vi(t){let r=t.querySelector('[data-pane="download"]');if(!r)return;let e=[];try{e=(await _a()).filter(o=>o.type==="theme")}catch{}if(!e.length){r.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无主题</p><p class="urppp-store-sub">主题市场正在筹备中。</p></div>';return}r.innerHTML=`<div class="urppp-store-theme-grid">${e.map(o=>Ji(o,Tr(o.id))).join("")}</div>`,r.querySelectorAll("[data-store-theme]").forEach(o=>{o.addEventListener("click",()=>Yi(o.dataset.storeTheme,o))})}a(Vi,"fetchCatalogThemes");async function Yi(t,r){if(!r||r.disabled)return;let e=(await _a()).find(s=>s.id===t);if(!e||!Array.isArray(e.entry)||!e.entry.length)return;r.disabled=!0,r.textContent="下载中…";let o="";for(let s of e.entry)try{let i=await fetch(s,{cache:"no-store"});if(i.ok){o=await i.text();break}}catch{}if(!o){r.textContent="下载失败",setTimeout(()=>{r.textContent="下载",r.disabled=!1},1400);return}try{GM_setValue("urppp_theme_css_"+t,o)}catch{}try{typeof GM_addStyle=="function"&&GM_addStyle(o)}catch{}r.textContent="已安装",r.disabled=!0;try{Ut()}catch{}}a(Yi,"downloadStoreTheme");function Qi(){let t=u.filter(r=>r.installed!==!1||Tr(r.id));return t.length?t.map(r=>{let e=r.installed!==!1,o=e?"内置":"已下载",s=e?"":`<button type="button" class="urppp-set-btn ghost" data-theme-del="${pt(r.id)}">删除</button>`;return`<div class="urppp-store-item">
        <div class="urppp-store-info"><strong>${pt(r.name)}</strong><span class="urppp-store-ver">v${pt(r.version||"")}</span><span class="urppp-store-state${e?" ok":""}">${o}</span></div>
        <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-theme-use="${pt(r.id)}">使用</button>${s}</div>
      </div>`}).join(""):'<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无已装主题</p></div>'}a(Qi,"themeManageListHtml");function Jo(){return`<div class="urppp-store-settings">
      <button type="button" class="urppp-set-follow" data-store-auto-update>自动检测更新：关</button>
      <button type="button" class="urppp-set-btn" data-store-check-update>检查更新</button>
    </div>`}a(Jo,"storeManageSettingsHtml");let Xi=["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json"];async function _a(){for(let t of Xi)try{let r=await fetch(t,{cache:"no-store"});if(r.ok){let e=await r.json();if(e&&Array.isArray(e.items))return e.items}}catch{}return[]}a(_a,"fetchCatalogList");function Vo(t,r){let e=String(t||"0").split(".").map(Number),o=String(r||"0").split(".").map(Number);for(let s=0;s<Math.max(e.length,o.length);s+=1){let i=e[s]||0,l=o[s]||0;if(i!==l)return i>l}return!1}a(Vo,"versionGt");function Ki(t,r){let e=0;return r.forEach(o=>{if(!o.id)return;let s=t.querySelector('[data-theme-use="'+o.id+'"]');s&&Vo(o.version,u.find(l=>l.id===o.id)&&u.find(l=>l.id===o.id).version)&&(Yo(s.closest(".urppp-store-item"),"主题"),e+=1);let i=t.querySelector('[data-plugin-id="'+o.id+'"]');if(i){let l=Dt&&Dt.api&&Dt.api.get&&Dt.api.get(o.id);l&&Vo(o.version,l.version)&&(Yo(i.closest(".urppp-store-item"),"插件"),e+=1)}}),e}a(Ki,"applyStoreUpdateBadges");function Yo(t,r){if(!t||t.querySelector(".urppp-store-update"))return;let e=t.querySelector(".urppp-store-ops");if(!e)return;let o=document.createElement("button");o.type="button",o.className="urppp-set-btn urppp-store-update",o.textContent="有新更新",o.addEventListener("click",()=>{try{o.textContent="更新中…"}catch{}}),e.appendChild(o)}a(Yo,"addUpdateBadge");function Qo(t){let r=t.querySelector("[data-store-auto-update]"),e=t.querySelector("[data-store-check-update]");if(!r||!e)return;let o=GM_getValue("urppp_store_auto_update",!1),s=a(()=>{r.textContent="自动检测更新："+(o?"开":"关")},"sync");s(),r.addEventListener("click",()=>{o=!o,GM_setValue("urppp_store_auto_update",o),s()}),e.addEventListener("click",async()=>{e.disabled=!0;let i=e.textContent;e.textContent="检查中…";try{let l=await _a(),f=Ki(t,l);e.textContent=f?"发现更新":"已是最新"}catch{e.textContent="检查失败"}setTimeout(()=>{e.textContent=i,e.disabled=!1},1600)})}a(Qo,"bindStoreManageSettings");function Xo(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">主题下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">主题管理</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${Jo()}${Qi()}</div>
        </div>
      </div>`,Go(t),t.querySelectorAll("[data-theme-use]").forEach(r=>{r.addEventListener("click",()=>{yo(r.dataset.themeUse)&&Ut()})}),t.querySelectorAll("[data-theme-del]").forEach(r=>{r.addEventListener("click",()=>{try{GM_setValue("urppp_theme_css_"+r.dataset.themeDel,"")}catch{}try{Ut()}catch{}try{Xo(t)}catch{}})}),Qo(t),Vi(t)}a(Xo,"renderThemeStoreBody");function Ko(t){let r=Dt&&Dt.api&&Dt.api.list&&Dt.api.list()||[],e=r.length?r.map(o=>`
        <div class="urppp-store-item">
          <div class="urppp-store-info"><strong>${pt(o.name||o.id)}</strong>${o.author?`<span class="urppp-store-author">${pt(o.author)}</span>`:""}<span class="urppp-store-ver">${o.version?"v"+pt(o.version):""}</span><span class="urppp-store-state ok">已装</span></div>
          ${o.description?`<p class="urppp-store-item-desc">${pt(o.description)}</p>`:""}
          <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-op="reload" data-plugin-id="${pt(o.id)}">重新装载</button><button type="button" class="urppp-set-btn ghost" data-plugin-op="unload" data-plugin-id="${pt(o.id)}">卸载</button></div>
        </div>`).join(""):'<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">插件下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">插件管理</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">敬请期待</p><p class="urppp-store-sub">插件市场正在筹备中，后续可从这里在线安装更多功能插件。</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${Jo()}${e}</div>
        </div>
      </div>`,Go(t),t.querySelectorAll('[data-plugin-op="reload"]').forEach(o=>{o.addEventListener("click",async()=>{o.disabled=!0;let s=o.textContent;o.textContent="装载中…";try{await Dt.api.install(o.dataset.pluginId,null),o.textContent="已装载"}catch{o.textContent="失败"}setTimeout(()=>{o.textContent=s,o.disabled=!1},1200)})}),t.querySelectorAll('[data-plugin-op="unload"]').forEach(o=>{o.addEventListener("click",()=>{try{Dt.api.unregister(o.dataset.pluginId)}catch{}Ko(t)})}),Qo(t)}a(Ko,"renderPluginStoreBody");function Zi(t){if(!t)return;let r=t.querySelector("#urppp-theme-store");r&&!r.dataset.bound&&(r.dataset.bound="1",r.addEventListener("click",()=>Sa("theme")));let e=t.querySelector("#urppp-skin-list");if(!e)return;let o=nr();if(e.innerHTML="",!u||!u.length){e.innerHTML='<p class="urppp-set-tip">暂无可用风格</p>';return}u.filter(s=>s.installed!==!1||Tr(s.id)).forEach(s=>{let i=document.createElement("div");i.className="urppp-skin-card"+(s.id===o?" is-active":""),i.dataset.skin=s.id;let l=document.createElement("button");l.type="button",l.className="urppp-skin-apply";let f=s.installed!==!1||Tr(s.id);f?s.id===o&&s.ready?(l.classList.add("is-current"),l.textContent="使用中",l.disabled=!0):l.textContent="应用主题":(l.classList.add("is-disabled"),l.textContent="去下载"),l.addEventListener("click",h=>{if(h.preventDefault(),h.stopPropagation(),!f){Sa("theme");return}if(!(s.id===o&&s.ready)&&yo(s.id)){Ut();try{window.__urpppCleanMode&&window.__urpppCleanMode.inject&&window.__urpppCleanMode.inject()}catch{}}}),i.innerHTML=['<div class="urppp-skin-name"></div>','<p class="urppp-skin-desc"></p>'].join(""),i.querySelector(".urppp-skin-name").textContent=s.name,i.querySelector(".urppp-skin-desc").textContent=s.desc,i.appendChild(l),e.appendChild(i)})}a(Zi,"renderSkinCards");let Dr=[],Ea=!1;function ts(t,r,e){let o=typeof AbortController=="function"?new AbortController:null,s=o?setTimeout(()=>o.abort(),e):null;return fetch(t,{cache:"no-store",headers:r,signal:o?o.signal:void 0}).then(i=>{if(!i.ok)throw new Error("HTTP "+i.status);return i.text()}).finally(()=>{s&&clearTimeout(s)})}a(ts,"fetchWithTimeout");function rs(t,r){return new Promise((e,o)=>{try{GM_xmlhttpRequest({method:"GET",url:t,timeout:12e3,headers:r,onload:a(s=>{s.status>=200&&s.status<400?e(s.responseText||""):o(new Error("HTTP "+s.status))},"onload"),onerror:a(()=>o(new Error("network error")),"onerror"),ontimeout:a(()=>o(new Error("timeout")),"ontimeout")})}catch(s){o(s)}})}a(rs,"gmRequestForUpdate");function es(t,r){let e={"Cache-Control":"no-cache"};return r&&r.range&&(e.Range=r.range),ts(t,e,12e3).catch(o=>{if(typeof GM_xmlhttpRequest=="function")return rs(t,e);throw o})}a(es,"fetchTextForUpdate");async function Ca(t,r,e=1e3){let o=[],s=t[0],i=t.slice(1),l=a(z=>es(z,r).then(F=>({url:z,text:F})).catch(F=>(o.push((z.split("/")[2]||z)+": "+(F&&F.message||F)),null)),"grab"),f=l(s),h=new Promise(z=>setTimeout(()=>z("__TIMEOUT__"),e)),E=await Promise.race([f,h]);if(E!=="__TIMEOUT__"){if(E&&E.text&&E.text.length>0)return E.text;let F=(await Promise.all(i.map(l))).find(J=>J&&J.text&&J.text.length>0);if(F)return F.text;throw new Error("所有更新源均不可用（"+o.join("; ")+"）")}let $=Promise.all(i.map(l)).then(z=>{let F=z.find(J=>J&&J.text&&J.text.length>0);if(F)return F.text;throw new Error("所有更新源均不可用（"+o.join("; ")+"）")}),j=f.then(z=>{if(z&&z.text&&z.text.length>0)return z.text;throw new Error("主源内容无效")}).catch(()=>new Promise(()=>{}));return Promise.race([j,$])}a(Ca,"fetchFirstAvailable");function wr(t,r){let e=document.getElementById("urppp-set-update-status");e&&(e.dataset.locked=t?"1":"",e.innerHTML=t||"",e.style.color=r==="err"?"#b91c1c":r==="ok"?"#15803d":"var(--text-muted)")}a(wr,"setUpdateStatus");async function Pa(){let t=p,r="",e=!1,o="";try{let i=await Ca(n.sourceUrls(n.versionJson)),l=JSON.parse(i);r=String(l&&l.version||"").trim(),l&&String(l.prevVersion||"").trim()===t&&(e=!0),l&&typeof l.changelog=="string"&&l.changelog.trim()&&(o=l.changelog)}catch{}if(!r){let i=await Ca(n.sourceUrls("urppp.user.js"),{range:"bytes=0-2048"});r=Va(i)}if(!r)throw new Error("无法解析远程主插件版本");let s=he(r,t);return{id:"main",name:"主插件",local:t,remote:r,status:s>0?"update":s===0?"latest":"ahead",updateUrl:n.mainRaw,pageUrl:n.greasySearch,changelogMd:e?o:""}}a(Pa,"checkMainUpdate");function Zo(t,r,e){let o=String(t||"").replace(/\r\n/g,`
`);if(!o.trim())return"";let s=/^##\s*\[?v?([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)\]?[^\n]*$/gim,i=[],l;for(;(l=s.exec(o))!==null;)i.push({ver:l[1],index:l.index,headEnd:s.lastIndex});if(!i.length)return"";for(let h=0;h<i.length;h++){let E=h+1<i.length?i[h+1].index:o.length;i[h].body=o.slice(i[h].index,E).trim()}let f=[];for(let h of i)he(h.ver,e)>0||he(h.ver,r)<=0||f.push(h.body);return f.join(`

`).trim()}a(Zo,"extractChangelogRange");function tn(){let t=document.getElementById("urppp-update-toast-style");t&&t.remove();let r=document.createElement("style");r.id="urppp-update-toast-style",r.textContent=`
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
    `,document.documentElement.appendChild(r)}a(tn,"ensureUpdateToastStyles");function as(t){let r=String(t||"").replace(/\r\n/g,`
`).trim();if(!r)return'<p class="uuc-meta">暂无更新日志</p>';let e=a(f=>{let h=pt(f);return h=h.replace(/`([^`]+)`/g,"<code>$1</code>"),h=h.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),h=h.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),h=h.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g,'$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'),h},"inline"),o=r.split(`
`),s=[],i=!1,l=a(()=>{i&&(s.push("</ul>"),i=!1)},"closeList");for(let f=0;f<o.length;f++){let E=o[f].replace(/\s+$/,"");if(!E.trim()){l();continue}let $=E.match(/^(#{2,3})\s+(.+)$/);if($){l();let z=$[1].length,F=$[2];s.push(z===2?`<h2>${e(F)}</h2>`:`<h3>${e(F)}</h3>`);continue}let j=E.match(/^[-*]\s+(.+)$/);if(j){i||(s.push("<ul>"),i=!0),s.push(`<li>${e(j[1])}</li>`);continue}l(),s.push(`<p>${e(E)}</p>`)}return l(),s.join("")||'<p class="uuc-meta">暂无更新日志</p>'}a(as,"renderChangelogMarkdown");function rn(t){let r=t||document.getElementById("urppp-update-toast");if(!r||!r.classList.contains("open")){r&&r.classList.remove("open","closing");return}if(r.__closing)return;r.__closing=!0,r.classList.add("closing"),r.classList.remove("open");let e=a(()=>{r.classList.remove("closing"),r.__closing=!1,r.removeEventListener("transitionend",o)},"done"),o=a(s=>{s&&s.target!==r||s&&s.propertyName&&s.propertyName!=="opacity"&&s.propertyName!=="transform"||e()},"onEnd");r.addEventListener("transitionend",o),setTimeout(e,380)}a(rn,"hideUpdateToast");function os(t){let r=t||document.getElementById("urppp-update-changelog");if(!r||!r.classList.contains("open")&&!r.classList.contains("closing")||r.__closing)return;r.__closing=!0,r.classList.add("closing"),r.classList.remove("open");let e=a(()=>{r.classList.remove("closing"),r.__closing=!1,r.removeEventListener("transitionend",o)},"done"),o=a(s=>{s&&s.target!==r||s&&s.propertyName&&s.propertyName!=="opacity"&&s.propertyName!=="background-color"&&s.propertyName!=="background"||e()},"onEnd");r.addEventListener("transitionend",o),setTimeout(e,360)}a(os,"hideChangelogModal");function en(t,r){tn();let e=document.getElementById("urppp-update-changelog");e||(e=document.createElement("div"),e.id="urppp-update-changelog",e.innerHTML=`
        <div class="uuc-panel" role="dialog" aria-modal="true" aria-label="更新日志">
          <div class="uuc-head">
            <h3></h3>
            <button type="button" class="uut-btn ghost" data-close="1">关闭</button>
          </div>
          <div class="uuc-body"></div>
        </div>`,e.addEventListener("click",o=>{(o.target===e||o.target&&o.target.getAttribute&&o.target.getAttribute("data-close")==="1")&&os(e)}),document.documentElement.appendChild(e)),e.querySelector("h3").textContent=t||"更新日志",e.querySelector(".uuc-body").innerHTML=r||'<p class="uuc-meta">暂无更新日志</p>',e.__closing=!1,e.classList.remove("open","closing"),e.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>e.classList.add("open"))})}a(en,"openChangelogModal");function za(t){tn();let r=document.getElementById("urppp-update-toast");r||(r=document.createElement("div"),r.id="urppp-update-toast",r.innerHTML=`
        <button type="button" class="uut-close" aria-label="关闭">×</button>
        <div class="uut-title"></div>
        <div class="uut-sub"></div>
        <div class="uut-actions">
          <button type="button" class="uut-btn" data-act="log">更新日志</button>
          <button type="button" class="uut-btn primary" data-act="go">去更新</button>
          <button type="button" class="uut-btn ghost" data-act="later">稍后</button>
        </div>`,r.querySelector(".uut-close").addEventListener("click",()=>rn(r)),r.addEventListener("click",async e=>{let o=e.target&&e.target.closest?e.target.closest("[data-act]"):null;if(!o)return;let s=o.getAttribute("data-act"),i=r.__pack||{};if(s==="later"){rn(r);return}if(s==="go"){let l=i.updateUrl||n.mainRaw;try{window.open(l,"_blank","noopener,noreferrer")}catch{location.href=l}return}if(s==="log"){o.disabled=!0,o.textContent="加载中…";try{let l=i.changelogMd;l||(l=await Ca(n.sourceUrls("CHANGELOG.md")),i.changelogMd=l);let f=Zo(l,i.local,i.remote),h=f?as(f):'<p class="uuc-meta">未找到区间日志。</p><p><a href="'+n.changelogPage+'" target="_blank" rel="noopener noreferrer">打开完整 CHANGELOG</a></p>';en("更新日志 "+i.local+" → "+i.remote,h)}catch(l){en("更新日志","<p>加载失败："+pt(l&&l.message||l)+'</p><p><a href="'+n.changelogPage+'" target="_blank" rel="noopener noreferrer">打开 GitHub CHANGELOG</a></p>')}finally{o.disabled=!1,o.textContent="更新日志"}}}),document.documentElement.appendChild(r)),r.__pack=t||{},r.querySelector(".uut-title").textContent="发现新版本 "+(t&&t.remote||""),r.querySelector(".uut-sub").textContent="当前 "+(t&&t.local||"")+" · 主插件可更新",r.__closing=!1,r.classList.remove("open","closing"),r.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>r.classList.add("open"))})}a(za,"showUpdateToast");async function La(){if(ia()&&!window.__urpppAutoUpdateTried){window.__urpppAutoUpdateTried=!0;try{let t=await Pa();t&&t.status==="update"&&za(t);let r=await ns();if(r)try{console.log("[URP++] 辅助插件热更新到",r.version)}catch{}}catch(t){try{console.debug("[URP++] auto update check failed",t)}catch{}}}}a(La,"maybeAutoCheckUpdate");function ns(){let t=(window.__urpppUpdateCheckers||Dr||[]).find(r=>r&&r.id==="assist");return!t||typeof t.check!="function"?Promise.resolve(null):Promise.resolve().then(()=>t.check()).then(r=>r&&r.status==="update"?Dt.update("assist"):null).catch(()=>null)}a(ns,"hotUpdateAssist");async function qa(){if(Ea)return;Ea=!0;let t=document.getElementById("urppp-set-check-update");t&&(t.disabled=!0,t.textContent="检查中…"),wr("正在从多源检查更新…");try{let r=[Pa()];(Dr||[]).forEach(h=>{h&&typeof h.check=="function"&&r.push(Promise.resolve().then(()=>h.check()).then(E=>E||{id:h.id||"extra",name:h.name||"扩展",status:"err",message:"无结果"}).catch(E=>({id:h.id||"extra",name:h.name||"扩展",status:"err",message:String(E&&E.message||E)})))});let e=await Promise.all(r),o=e.map(h=>{if(!h)return"";if(h.status==="err")return`• <b>${pt(h.name||h.id)}</b>：检查失败（${pt(h.message||"unknown")}）`;if(h.status==="update"){let E="";if(h.id==="assist"&&Dt&&Dt.loaded("assist"))E=' <a class="urppp-update-relaunch" href="javascript:void(0)" data-urppp-relaunch="assist" rel="nofollow">重新装载</a>';else{let $=h.updateUrl?` <a href="${pt(h.updateUrl)}" target="_blank" rel="noopener noreferrer">打开更新源</a>`:"",j=h.pageUrl?` <a href="${pt(h.pageUrl)}" target="_blank" rel="noopener noreferrer">Greasy Fork</a>`:"";E=$+j}return`• <b>${pt(h.name)}</b>：发现新版本 <b>${pt(h.remote)}</b>（当前 ${pt(h.local)}）${E}`}return h.status==="ahead"?`• <b>${pt(h.name)}</b>：本地 ${pt(h.local)} 新于远程 ${pt(h.remote)}`:`• <b>${pt(h.name)}</b>：已是最新（${pt(h.local)}）`}).filter(Boolean),s=e.some(h=>h&&h.status==="update"),i=e.some(h=>h&&h.status==="err");wr(`${s?"检查完成：发现更新":i?"检查完成：部分失败":"检查完成：全部最新"}<br>${o.join("<br>")}<br><span style="opacity:.85">仓库：<a href="${n.repo}" target="_blank" rel="noopener noreferrer">SCU-URP-plusplus</a></span>`,i?"err":"ok");let f=document.querySelector('#urppp-set-update-status .urppp-update-relaunch[data-urppp-relaunch="assist"]');f&&f.addEventListener("click",()=>{try{wr("正在重新装载辅助插件…",""),Dt.install("assist").then(()=>{wr("辅助插件已重新装载，刷新页面后生效。","ok")}).catch(h=>{wr("重新装载失败："+(h&&h.message?h.message:h),"err")})}catch(h){wr("重新装载失败："+(h&&h.message?h.message:h),"err")}})}catch(r){wr("检查失败："+pt(r&&r.message||r),"err")}finally{Ea=!1,t&&(t.disabled=!1,t.textContent="检查更新")}}a(qa,"checkForUpdates");function an(){let t=document.getElementById("urppp-set-update-status");if(!t||t.dataset.locked==="1")return;let r="当前主插件："+p,e=t.getAttribute("data-assist-version")||"";e&&(r+="；辅助插件："+e),t.textContent=r,t.style.color="var(--text-muted)"}a(an,"refreshUpdateStatusHint");function ps(t){if(!t||typeof t.check!="function")return!1;let r=String(t.id||t.name||"").trim();if(!r)return!1;let e=Dr.findIndex(s=>s&&s.id===r),o={id:r,name:t.name||r,check:t.check,localVersion:t.localVersion||""};e>=0?Dr[e]=o:Dr.push(o);try{let s=document.getElementById("urppp-set-update-status");s&&o.localVersion&&r==="assist"&&s.setAttribute("data-assist-version",String(o.localVersion))}catch{}try{an()}catch{}return!0}a(ps,"registerUpdateChecker");function is(){let t={version:p,urls:n,check:qa,checkMain:Pa,registerChecker:ps,compareVersions:he,parseUserscriptVersion:Va,extractChangelogRange:Zo,showUpdateToast:za,maybeAutoCheckUpdate:La,listCheckers:a(()=>Dr.slice(),"listCheckers")};try{window.__urpppUpdate=t}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppUpdate=t)}catch{}return t}a(is,"publishUpdateApi"),is();let{rebuildSidebarCompletely:on,syncMobileContentOffset:jr,syncSidebarUnderNavbar:kr}=yi({}),{rebuildDashboard:ss}=li({deps:{statCardPrivacyMarkup:ms}}),ls="urppp-clean-open",Ta={100:4,99:4,98:4,97:4,96:4,95:4,94:3.9,93:3.8,92:3.7,91:3.6,90:3.5,89:3.4,88:3.3,87:3.2,86:3.1,85:3,84:2.9,83:2.8,82:2.7,81:2.6,80:2.5,79:2.4,78:2.3,77:2.2,76:2.1,75:2,74:1.9,73:1.8,72:1.7,71:1.6,70:1.5,69:1.4,68:1.3,67:1.2,66:1.1,65:1,64:.9,63:.8,62:.7,61:.6,60:.5};function ir(t){if(t==null||t==="")return!1;let r=String(t).trim();if(!r)return!1;if(/未评估|未评教|待评估|待评教/.test(r))return!0;let e=Number(r);return!Number.isNaN(e)&&e<0}a(ir,"isUnevaluatedScore");function $e(t){if(t==null||t==="")return!1;let r=Number(t);return!Number.isNaN(r)&&r>=0&&r<=5}a($e,"isValidOfficialGpa");function Ie(t){let r=String(t||"").trim();if(!r)return"";let e=r.match(/[\u4e00-\u9fffA-Za-z0-9]/);return e?e[0]:r.charAt(0)}a(Ie,"firstContentChar");function Ma(t,r){let e=String(t||""),o=Number(r)||0;return!e||o<=0||o>e.length?!1:e.charAt(o-1)==="1"}a(Ma,"weekBitmapActive");function Or(t){if(t==null||t==="")return null;let r=String(t).trim();if(!r||ir(r)||/^免修$|^通过$|^取消$|^缓考$|^旷考$|^缺考$/.test(r))return null;if(/^A\+$/i.test(r)||/^A$/i.test(r))return 4;if(/^A-$/i.test(r))return 3.7;if(/^B\+$/i.test(r))return 3.3;if(/^B$/i.test(r))return 3;if(/^B-$/i.test(r))return 2.7;if(/^C\+$/i.test(r))return 2.3;if(/^C$/i.test(r))return 2;if(/^C-$/i.test(r))return 1.7;if(/^D$/i.test(r))return 1.3;if(/^F$/i.test(r))return 0;if(/优秀/.test(r))return 4;if(/良好/.test(r))return 3;if(/中等/.test(r))return 2;if(/及格/.test(r)&&!/不及格/.test(r))return 1;if(/不及格|不合格|不通过/.test(r))return 0;if(/合格/.test(r))return 1;let e=parseFloat(r.replace(/[^\d.]/g,""));if(Number.isNaN(e)||e<0)return null;let o=Math.round(e);return o<60?0:o>100?4:Ta[o]!=null?Ta[o]:Ta[Math.max(60,Math.min(100,Math.floor(e)))]||0}a(Or,"scoreToGpa");function Hr(t){let r=String(t||"").trim();if(!r||ir(r))return null;if(/优秀/.test(r))return 95;if(/良好/.test(r))return 85;if(/中等/.test(r))return 75;if(/及格/.test(r)&&!/不及格/.test(r))return 65;if(/不及格|不合格|不通过/.test(r))return 0;if(/合格/.test(r))return 70;if(/^A/i.test(r))return 95;if(/^B/i.test(r))return 85;if(/^C/i.test(r))return 75;if(/^D/i.test(r))return 65;if(/^F/i.test(r))return 0;let e=parseFloat(r.replace(/[^\d.]/g,""));return Number.isNaN(e)||e<0?null:e}a(Hr,"scoreToNumber");function Ar(t){return Math.round((Number(t)||0)*100)/100}a(Ar,"round2");function nn(t){return/必修/.test(String(t||""))}a(nn,"isRequiredAttr");function tr(t){let r=0,e=0,o=0,s=0,i=0,l=0,f=0,h=0;return(t||[]).forEach(E=>{if(E&&(E.unevaluated||ir(E.score)))return;let $=Number(E.credit)||0,j=Hr(E.score),z=$e(E.officialGpa)?Number(E.officialGpa):Or(E.score);j==null||$<=0||(r+=$,e+=j*$,z!=null&&(o+=z*$,s+=$),E.required&&(i+=$,l+=j*$,z!=null&&(f+=z*$,h+=$)))}),{totalCredit:Ar(r),avgScore:Ar(r?e/r:0),avgGpa:Ar(s?o/s:0),requiredCredit:Ar(i),requiredGpa:Ar(h?f/h:0),requiredAvg:Ar(i?l/i:0),count:(t||[]).length}}a(tr,"summarizeCourses");function $a(t){let r=String(t||"");return/^https?:\/\//i.test(r)?r:r.startsWith("//")?location.protocol+r:r.startsWith("/")?location.origin+r:location.origin+"/"+r.replace(/^\.\//,"")}a($a,"absUrl");function Jt(t,r){let e=$a(t),o=r&&r.method||"GET",s=r&&r.data||null;return new Promise((i,l)=>{let f=a((h,E)=>h?i(E):l(new Error(E||"fetch failed")),"done");try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:o,url:e,data:s||void 0,headers:r&&r.headers?r.headers:{},withCredentials:!0,onload:a(h=>{h.status>=200&&h.status<400?f(!0,h.responseText||""):f(!1,"HTTP "+h.status)},"onload"),onerror:a(()=>f(!1,"network error"),"onerror")});return}}catch{}fetch(e,{method:o,credentials:"include",cache:"no-store",headers:r&&r.headers?r.headers:{},body:s||void 0}).then(h=>{if(!h.ok)throw new Error("HTTP "+h.status);return h.text()}).then(h=>f(!0,h)).catch(h=>f(!1,h&&h.message))})}a(Jt,"fetchText");function Ne(t){return new DOMParser().parseFromString(String(t||""),"text/html")}a(Ne,"parseHtml");function pn(){if(document.getElementById("urppp-feature-style"))return;let t=document.createElement("style");t.id="urppp-feature-style",t.textContent=Bp,(document.head||document.documentElement).appendChild(t)}a(pn,"ensureFeatureStyles");function cs(){if(document.getElementById("urppp-schedule-export-style"))return;let t=document.createElement("style");t.id="urppp-schedule-export-style",t.textContent=jp,(document.head||document.documentElement).appendChild(t)}a(cs,"ensureScheduleExportStyles");function ds(){if(document.getElementById("urppp-settings-style"))return;let t=document.createElement("style");t.id="urppp-settings-style",t.textContent=Op,(document.head||document.documentElement).appendChild(t)}a(ds,"ensureSettingsStyles");function sn(t){let e=(t&&t.querySelector?t:document).querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(!e)return null;let o=e.querySelector(".urppp-user-name-value");if(o)return o;let s=e.cloneNode(!0);s.querySelectorAll("small, i, img, b, .badge").forEach(f=>f.remove());let i=(s.textContent||"").replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim();Array.from(e.childNodes).forEach(f=>{f.nodeType===Node.TEXT_NODE&&f.textContent.trim()&&f.remove()});let l=document.createElement("span");return l.className="urppp-user-name-value",l.textContent=i||"同学",l.__urpppOriginalText=l.textContent,e.appendChild(l),l}a(sn,"ensureNavNameTarget");function Be(t){let r=String(t||"").replace(/[\s:：]/g,"");return r?/姓名|英文姓名|姓名拼音/.test(r)?"name":/学号|证件|身份证|护照|证书编号|考生号|录取号|学籍号/.test(r)?"identity":/学院|院系|专业|班级|年级|主修方案|培养方案|专业方向|分流方向|毕业中学/.test(r)?"organization":/电话|手机|电子邮件|邮箱|QQ|地址|家长|个人主页|出生日期|入学日期|乘车区间|性别|籍贯|民族|政治面貌|国籍|户口|户籍|生源|出生地|健康|宗教|血型|婚姻|联系人|家庭/.test(r)?"contact":/绩点|GPA/.test(r)?"gpa":/学分/.test(r)?"credit":/成绩|分数|高考总分|均分|平均分|必修平均|课程门数|及格课程|不及格课程|待修读课程|已修读课程/.test(r)?"grade":/课表|日程安排/.test(r)?"schedule":"":""}a(Be,"classifyPrivacyLabel");function us(t,r){let e=String(t||"")+" "+String(r||"");return/绩点|GPA/.test(e)?"majorGpa":/主修为|培养方案|方案/.test(e)?"majorPlan":/尚不及格|未及格/.test(e)?"failedCourses":/待修读课程/.test(e)?"remainingCourses":/已修读课程/.test(e)?"completedCourses":""}a(us,"classifyHomeDataKey");function Fe(t,r,e){let o=r?` data-urppp-edit-key="${r}"`:"";return`<span class="urppp-private-value" data-urppp-private="${t}"${o}>${e}</span>`}a(Fe,"homePrivateValueSpan");function ms(t,r){let e=pt(t),o=pt(r),s=us(t,r),l={completedCourses:"other",failedCourses:"other",majorGpa:"gpa",majorPlan:"organization",remainingCourses:"other"}[s]||Be(String(t||"")+" "+String(r||""));if(l==="organization")return r?{valueHtml:e,labelHtml:Fe("organization",s,o)}:{valueHtml:Fe("organization",s,e),labelHtml:o};if(!["grade","gpa","credit","other"].includes(l))return{valueHtml:e,labelHtml:o};let f=String(r||"").match(/-?\d+(?:\.\d+)?/);if(!(/^-?\d+(?:\.\d+)?$/.test(String(t||"").trim())||/^(优秀|良好|中等|及格|不及格|合格|不合格)$/.test(String(t||"").trim()))&&f){let E=f.index||0,$=String(r).slice(0,E),j=String(r).slice(E+f[0].length);return{valueHtml:e,labelHtml:`${pt($)}${Fe(l,s,pt(f[0]))}${pt(j)}`}}return{valueHtml:Fe(l,s,e),labelHtml:o}}a(ms,"statCardPrivacyMarkup");function Sr(t,r){if(!t||t.mode==="off")return"";if(t.mode==="one")return t.mask||ye;if(r==="name")return"";let e=t.fields&&t.fields[r];return!e||!e.enabled?"":String(e.replacement||t.mask||ye)}a(Sr,"privacyReplacement");function ie(t,r){if(!(!t||!r)&&!(t.querySelector&&t.querySelector("input,select,textarea,button"))){if(!t.classList.contains("urppp-private-text")){let e=getComputedStyle(t).fontSize;e&&e!=="0px"&&t.style.setProperty("--urppp-private-font-size",e)}t.classList.add("urppp-private-text"),t.setAttribute("data-urppp-private-mask",r)}}a(ie,"markPrivateText");function ln(t,r){if(!t||!t.parentElement)return;let e=t.parentElement;t.classList.add("urppp-private-avatar"),e.classList.add("urppp-private-avatar-host"),e.setAttribute("data-urppp-private-mask",r||ye);let o=t.getBoundingClientRect();e.style.setProperty("--urppp-avatar-left",t.offsetLeft+"px"),e.style.setProperty("--urppp-avatar-top",t.offsetTop+"px"),e.style.setProperty("--urppp-avatar-width",Math.max(1,o.width)+"px"),e.style.setProperty("--urppp-avatar-height",Math.max(1,o.height)+"px"),e.style.setProperty("--urppp-avatar-radius",getComputedStyle(t).borderRadius||"50%")}a(ln,"markPrivateAvatar");function bs(t,r){if(!t||!r)return;let e=t.matches("table")&&t.closest(".table-responsive, .urppp-table-wrap")||t;e.classList.add("urppp-private-block"),e.setAttribute("data-urppp-private-mask",r)}a(bs,"markPrivateBlock");function hs(t,r){if(!(!t||!U[r])){if(!t.hasAttribute("data-urppp-direct-tabindex")){let e=t.getAttribute("tabindex");t.setAttribute("data-urppp-direct-tabindex",e??"__none__"),t.__urpppDirectTitle=t.getAttribute("title"),t.__urpppDirectAriaLabel=t.getAttribute("aria-label")}t.classList.add("urppp-direct-editable"),t.setAttribute("tabindex","0"),t.setAttribute("data-urppp-edit-key",r),t.setAttribute("aria-label","修改"+U[r]+"显示值"),t.title="点击修改显示值"}}a(hs,"markDirectEditable");let br=null;function cn(t){let r=t&&t.getAttribute("data-urppp-edit-key");if(!r||!U[r])return;br&&br.__finish&&br.__finish(!1);let e=yr();if(e.mode!=="custom"||!e.directEdit.enabled)return;let s=String(e.directEdit.values[r]||"")||t.getAttribute("data-urppp-private-mask")||String(t.textContent||"").trim(),i=t.getBoundingClientRect(),l=t.parentElement?.getBoundingClientRect(),f=i.height>=8||!l?i:{left:i.left,top:l.top,width:Math.max(i.width,40),height:l.height},h=document.createElement("input"),E=getComputedStyle(t),$=Math.min(Math.max(f.width+64,140),Math.max(140,window.innerWidth-24)),j=Math.min(Math.max(12,f.left),Math.max(12,window.innerWidth-$-12)),z=Math.min(Math.max(12,f.top+(f.height-36)/2),Math.max(12,window.innerHeight-48));h.type="text",h.maxLength=80,h.className="urppp-direct-edit-input",h.value=s,h.setAttribute("aria-label","修改"+U[r]+"显示值"),h.style.left=j+"px",h.style.top=z+"px",h.style.setProperty("--urppp-direct-edit-width",$+"px"),h.style.fontFamily=E.fontFamily,h.style.fontSize=(window.innerWidth<=520?16:Math.min(18,Math.max(13,parseFloat(E.fontSize)||14)))+"px";let F=!1,J=a(D=>{if(F||(F=!0,h.remove(),br===h&&(br=null),D))return;let R=yr();R.mode!=="custom"||!R.directEdit.enabled||(R.directEdit.values[r]=String(h.value||"").trim().slice(0,80),sa(R),Vt(document),Da(R.directEdit.values[r]?"显示值已更新":"已恢复分类设置"))},"finish");h.__finish=J,h.addEventListener("click",D=>D.stopPropagation()),h.addEventListener("blur",()=>J(!1)),h.addEventListener("keydown",D=>{D.key==="Enter"&&(D.preventDefault(),J(!1)),D.key==="Escape"&&(D.preventDefault(),J(!0))}),document.documentElement.appendChild(h),br=h,h.focus(),h.select()}a(cn,"openDirectEditInput");function gs(){document.__urpppDirectEditBound||(document.__urpppDirectEditBound=!0,document.addEventListener("click",t=>{let r=t.target?.closest?.(".urppp-direct-editable");r&&(t.preventDefault(),t.stopPropagation(),cn(r))},!0),document.addEventListener("keydown",t=>{if(!["Enter"," "].includes(t.key))return;let r=t.target?.closest?.(".urppp-direct-editable");r&&(t.preventDefault(),t.stopPropagation(),cn(r))},!0))}a(gs,"bindDirectEditInteraction");function fs(t){let r=t&&t.querySelectorAll?t:document;r.querySelectorAll(".urppp-direct-editable").forEach(e=>{let o=e.getAttribute("data-urppp-direct-tabindex");e.classList.remove("urppp-direct-editable"),e.removeAttribute("data-urppp-direct-tabindex"),o==="__none__"?e.removeAttribute("tabindex"):o!=null&&e.setAttribute("tabindex",o),e.__urpppDirectTitle==null?e.removeAttribute("title"):e.setAttribute("title",e.__urpppDirectTitle),e.__urpppDirectAriaLabel==null?e.removeAttribute("aria-label"):e.setAttribute("aria-label",e.__urpppDirectAriaLabel),delete e.__urpppDirectTitle,delete e.__urpppDirectAriaLabel}),r.querySelectorAll(".urppp-private-text").forEach(e=>{e.classList.remove("urppp-private-text"),e.removeAttribute("data-urppp-private-mask"),e.style.removeProperty("--urppp-private-font-size")}),r.querySelectorAll(".urppp-private-avatar").forEach(e=>e.classList.remove("urppp-private-avatar")),r.querySelectorAll(".urppp-private-avatar-host").forEach(e=>{e.classList.remove("urppp-private-avatar-host"),e.removeAttribute("data-urppp-private-mask"),["--urppp-avatar-left","--urppp-avatar-top","--urppp-avatar-width","--urppp-avatar-height","--urppp-avatar-radius"].forEach(o=>e.style.removeProperty(o))}),r.querySelectorAll(".urppp-private-avatar-block").forEach(e=>{e.classList.remove("urppp-private-avatar-block"),e.removeAttribute("data-urppp-private-mask")}),r.querySelectorAll(".urppp-private-block").forEach(e=>{e.classList.remove("urppp-private-block"),e.removeAttribute("data-urppp-private-mask")})}a(fs,"clearPrivacyDisplay");function dn(t,r,e){if(!t||t.matches?.("input,select,textarea,button")||t.querySelector?.("input,select,textarea,button"))return;if(t.__urpppOriginalText==null){if(!r)return;t.__urpppOriginalText=t.textContent||""}let o=r&&e?e:t.__urpppOriginalText;t.textContent!==o&&(t.textContent=o)}a(dn,"applyCustomText");function xs(t){let r=t&&t.querySelectorAll?t:document,e=qr(),s=r.querySelector?.(".urppp-user-name-value")||(e.nameEnabled?sn(r):null);dn(s,e.nameEnabled,e.name),r.querySelectorAll(".profile-info-row").forEach(f=>{let h=f.querySelector(".profile-info-name"),E=f.querySelector(".profile-info-value");!h||!E||String(h.textContent||"").replace(/[\s:：]/g,"")!=="姓名"||dn(E,e.nameEnabled,e.name)});let i=Zr(e.avatar),l=e.avatarEnabled&&!!i;r.querySelectorAll("#navbar img.nav-user-photo, #urppp-mobile-user img.nav-user-photo, img#avatar, .profile-picture img").forEach(f=>{let h=f.getAttribute("src")||"";h&&h!==f.__urpppAppliedCustomSrc&&(f.__urpppOriginalSrc=h),l?(f.__urpppOriginalSrc==null&&(f.__urpppOriginalSrc=h),h!==i&&f.setAttribute("src",i),f.__urpppAppliedCustomSrc=i):f.__urpppAppliedCustomSrc!=null&&(f.__urpppOriginalSrc&&f.setAttribute("src",f.__urpppOriginalSrc),delete f.__urpppAppliedCustomSrc)})}a(xs,"applyCustomIdentityDisplay");function ys(t,r){t.querySelectorAll(".profile-info-row").forEach(e=>{let o=e.querySelector(".profile-info-name, th, label"),s=e.querySelector(".profile-info-value, td:last-child");if(!o||!s||o===s)return;let i=Be(o.textContent),l=Sr(r,i);l&&ie(s,l)})}a(ys,"applyProfilePrivacy");function vs(t,r){t.querySelectorAll("table").forEach(e=>{let o=Array.from(e.querySelectorAll("thead th, thead td, tr:first-child th, tr:first-child td"));if(!o.length)return;let s=o.map(i=>{let l=Be(i.textContent);return["grade","gpa","credit"].includes(l)?l:""});s.some(Boolean)&&e.querySelectorAll("tbody tr").forEach(i=>{let l=i.querySelectorAll("td");s.forEach((f,h)=>{let E=Sr(r,f);f&&E&&ie(l[h],E)})})})}a(vs,"applyScoreTablePrivacy");function ws(t){let r=t&&t.querySelectorAll?t:document,e=yr();if(e.mode==="off")return;let o=Sr(e,"name"),s=Sr(e,"avatar"),i=Sr(e,"schedule"),l=o?sn(r):r.querySelector?.(".urppp-user-name-value");o&&ie(l,o),[["#courseNum, #coursePas, #xy_kcms","other"],["#gpa","gpa"],["#bottom","organization"]].forEach(([E,$])=>{let j=Sr(e,$);j&&r.querySelectorAll(E).forEach(z=>ie(z,j))}),vs(r,e);let h=e.mode==="custom"&&e.directEdit.enabled;if(r.querySelectorAll("[data-urppp-private]").forEach(E=>{let $=E.getAttribute("data-urppp-private"),j=E.getAttribute("data-urppp-edit-key"),F=(h&&j?String(e.directEdit.values[j]||"").trim():"")||Sr(e,$);!["avatar","schedule"].includes($)&&F&&ie(E,F),h&&j&&hs(E,j)}),h&&gs(),ys(r,e),s&&(r.querySelectorAll('[data-urppp-private="avatar"]').forEach(E=>{let $=E.matches("img")?E:E.querySelector("img");$?ln($,s):(E.classList.add("urppp-private-avatar-block"),E.setAttribute("data-urppp-private-mask",s))}),r.querySelectorAll("#navbar img.nav-user-photo, img#avatar, .profile-picture img, .uc-avatar img").forEach(E=>ln(E,s))),i){let E=Array.from(r.querySelectorAll('[data-urppp-private="schedule"], #main-calendar, #courseTable'));E.filter($=>!E.some(j=>j!==$&&j.contains($))).forEach($=>bs($,i))}}a(ws,"applyPrivacyDisplay");let Ia=0,sr=[];function un(){let t=yr(),r=qr();return t.mode!=="off"||r.nameEnabled||r.avatarEnabled}a(un,"personalDisplayIsEnabled");function ks(){sr=sr.filter(({root:t})=>t&&t.isConnected),sr.forEach(({root:t,observer:r})=>r.observe(t,{childList:!0,subtree:!0}))}a(ks,"resumePersonalDisplayObservers");function Vt(t){let r=t||document;sr.forEach(({observer:e})=>e.disconnect());try{pn()}catch{}try{fs(r)}catch{}try{xs(r)}catch(e){console.warn("[URP++] custom identity",e)}try{ws(r)}catch(e){console.warn("[URP++] privacy",e)}un()?(ks(),Ss()):(clearTimeout(Ia),sr=[])}a(Vt,"applyPersonalDisplay");function As(t){clearTimeout(Ia),Ia=setTimeout(()=>Vt(t||document),140)}a(As,"schedulePersonalDisplay");function Na(){try{ot&&ot.open&&Vr()}catch{}}a(Na,"refreshCleanPersonalDisplay");function Ss(){if(!un()){sr.forEach(({observer:t})=>t.disconnect()),sr=[];return}[document.getElementById("navbar"),document.getElementById("page-content-template"),document.getElementById("urppp-clean-root")].filter(Boolean).forEach(t=>{if(sr.some(e=>e.root===t))return;let r=new MutationObserver(()=>As(document));sr.push({root:t,observer:r}),r.observe(t,{childList:!0,subtree:!0})})}a(Ss,"bindPersonalDisplayObservers");function _s(t){let r=Object.assign({},t||{}),e=qr();e.nameEnabled&&e.name&&(r.name=e.name);let o=Zr(e.avatar);return e.avatarEnabled&&o&&(r.avatar=o),r}a(_s,"personalizedProfile");let mn="/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback",Es="/student/courseSelect/thisSemesterCurriculum/callback",Cs="/student/courseSelect/thisSemesterCurriculum/index";async function Ps(){let t=document.querySelector("#planCode, #zxjxjhh");if(t&&t.value&&t.value!=="no")return String(t.value);try{let r=new URLSearchParams(location.search),e=r.get("planCode")||r.get("zxjxjhh");if(e)return e}catch{}if(ot&&ot.schedule&&ot.schedule.exportData){let r=ot.schedule.exportData.semester&&ot.schedule.exportData.semester.planCode;if(r)return r}if(/\/student\/courseSelect\/courseSelectResult\//.test(location.pathname))try{let r=await Jt(Es),e=JSON.parse(r),o=Kr(e);if(o)return o}catch{}return""}a(Ps,"resolveSchedulePlanCode");async function bn(t){let r=await Ps(),e=r?{method:"POST",data:"planCode="+encodeURIComponent(r),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}:null,o=await Jt(mn,e),s;try{s=JSON.parse(o)}catch{throw new Error("课表接口返回了非 JSON 内容，请刷新教务页面后重试")}r||(r=Kr(s)),(!s.jcsjbs||!s.jcsjbs.length)&&r&&(s=JSON.parse(await Jt(mn,{method:"POST",data:"planCode="+encodeURIComponent(r),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}})));let i=gn(s,r,t);if(!i.courses.length)throw new Error("没有读取到可导出的课表数据");return i}a(bn,"loadScheduleExportData");function Ba(t){return String(t||"学生课表").replace(/[\\/:*?"<>|]+/g,"-").replace(/\s+/g,"").slice(0,80)||"学生课表"}a(Ba,"safeScheduleFilename");function Fa(t,r){let e=URL.createObjectURL(t),o=document.createElement("a");o.href=e,o.download=r,o.style.display="none",document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(e),1200)}a(Fa,"downloadBlob");function zs(t){let r=We(t),e=_e(),o=e.enabled?Je(r,e.mapping):Ge(r),s=JSON.stringify(o,null,2)+`
`;return Fa(new Blob([s],{type:"application/json;charset=utf-8"}),Ba(t.semester.label)+".json"),Object.assign({customFormat:e.enabled},r.stats)}a(zs,"exportScheduleJson");function hn(t){let e=(Array.from(document.querySelectorAll(".span_bbzx")).map(l=>l.textContent||"").join(" ")+" "+(document.querySelector("#navbar")?.textContent||"")).replace(/\s+/g," ").match(/(\d{4})-(\d{4})\s*(春|秋).*?第\s*(\d{1,2})\s*周/);if(!e)return"";let o=e[3]==="秋"?"1":"2";if(t&&!String(t).startsWith(e[1]+"-"+e[2]+"-"+o))return"";let s=Number(e[4]);if(s<1||s>30)return"";let i=Xa(new Date);return i.setDate(i.getDate()-(s-1)*7),xe(i)}a(hn,"deriveCurrentSemesterMonday");function gn(t,r,e){let o=r||Kr(t),s=hn(o)||la()[o]||"";return ap(t,o,e,{firstMonday:s})}a(gn,"normalizeScheduleDataForPage");function Ls(t){let r=t.semester.planCode,e=la()[r],o=hn(r);return o?(uo(r,o),Promise.resolve(o)):Xr(e)?Promise.resolve(e):new Promise((s,i)=>{document.querySelector('.urppp-dialog-mask[data-dialog="schedule-date"]')?.remove();let l=document.createElement("div");l.className="urppp-dialog-mask",l.dataset.dialog="schedule-date",l.innerHTML=`<div class="urppp-dialog" role="dialog" aria-modal="true"><h3>确认第一教学周周一</h3><p>${pt(t.semester.label)}没有可可靠推导的起始日期。该日期决定 ICS 中每节课的实际日历时间；预填值仅为估算，请对照校历核对。</p><input type="date" value="${pt(e||Kn(r))}"><div class="urppp-dialog-actions"><button type="button" class="urppp-set-btn ghost" data-action="cancel">取消</button><button type="button" class="urppp-set-btn" data-action="ok">确认并导出</button></div></div>`,document.documentElement.appendChild(l);let f=a((h,E)=>{l.remove(),h?i(h):s(E)},"close");l.querySelector('[data-action="cancel"]').addEventListener("click",()=>f(new Error("已取消导出"))),l.querySelector('[data-action="ok"]').addEventListener("click",()=>{let h=l.querySelector("input").value;Xr(h)&&(uo(r,h),f(null,h))}),l.addEventListener("click",h=>{h.target===l&&f(new Error("已取消导出"))})})}a(Ls,"requestScheduleFirstMonday");async function qs(t){let r=await Ls(t),e=tp(t,r);return Fa(new Blob([e],{type:"text/calendar;charset=utf-8"}),Ba(t.semester.label)+".ics"),rp(t)}a(qs,"exportScheduleIcs");let Ts={apple:"类 Apple",flat:"极简扁平",organic:"自然有机",brutal:"新野兽派",editorial:"编辑杂志",neu:"新拟物"};function lr(t,r,e){if(typeof document>"u")return Wt(r)||"#000000";let o=document.createElement("span");o.style.cssText="position:fixed;left:-9999px;visibility:hidden;color:var("+t+","+r+")",(document.body||document.documentElement).appendChild(o);let s=getComputedStyle(o).color;o.remove();let i=String(s||"").match(/[\d.]+/g)?.map(Number)||[];if(i.length>=3){let l=be(i[0],i[1],i[2]),f=i.length>3?Math.max(0,Math.min(1,i[3])):1;return f<1?Nt(e||r,l,f):l}return Wt(s)||Wt(r)||"#000000"}a(lr,"resolvedScheduleImageColor");function fn(){let t=Qt(),r=nr(),e=t==="dark",o=e?{bg:"#000000",surface:"#1C1C1E",input:"#2C2C2E",text:"#F5F5F7",secondary:"#A1A1A6",muted:"#8E8E93",border:"#38383A",primary:"#0A84FF"}:{bg:"#F5F5F7",surface:"#FFFFFF",input:"#F5F5F7",text:"#1D1D1F",secondary:"#6E6E73",muted:"#86868B",border:"#D2D2D7",primary:"#0071E3"},s={bg:lr("--bg",o.bg),surface:lr(r==="neu"?"--neu-base":"--surface",o.surface),input:lr("--input-bg",o.input),text:lr("--text",o.text),secondary:lr("--text-secondary",o.secondary),muted:lr("--text-muted",o.muted),border:lr("--border",o.border,lr(r==="neu"?"--neu-base":"--surface",o.surface)),primary:lr("--primary",o.primary)},i={apple:{frameRadius:24,headerRadius:13,gridRadius:10,cardRadius:12,frameStroke:1,cardStroke:1,shadow:"soft"},flat:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:2,cardStroke:2,shadow:"none"},organic:{frameRadius:30,headerRadius:18,gridRadius:14,cardRadius:18,frameStroke:1,cardStroke:1,shadow:"warm"},brutal:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:3,cardStroke:3,shadow:"hard"},editorial:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:1,cardStroke:1,shadow:"none",serif:!0},neu:{frameRadius:22,headerRadius:14,gridRadius:10,cardRadius:14,frameStroke:0,cardStroke:0,shadow:"neu"}};return{id:t,skin:r,dark:e,label:(Ts[r]||r)+" · "+(Et[t]&&Et[t].name||t),colors:s,shape:i[r]||i.apple}}a(fn,"currentScheduleImageTheme");function xn(t,r){return up(t,r||fn())}a(xn,"buildScheduleSvg");function Ms(t){return new Promise((r,e)=>{let o=new Blob([t.svg],{type:"image/svg+xml;charset=utf-8"}),s=URL.createObjectURL(o),i=new Image;i.onload=()=>{try{let f=Math.min(2,Math.sqrt(15e6/(t.width*t.height))),h=document.createElement("canvas");h.width=Math.floor(t.width*f),h.height=Math.floor(t.height*f);let E=h.getContext("2d");E.scale(h.width/t.width,h.height/t.height),E.fillStyle=t.background||"#F8FAFC",E.fillRect(0,0,t.width,t.height),E.drawImage(i,0,0,t.width,t.height),h.toBlob($=>$?r($):e(new Error("无法生成课表图片")),"image/png")}catch(l){e(l)}finally{URL.revokeObjectURL(s)}},i.onerror=()=>{URL.revokeObjectURL(s),e(new Error("课表图片渲染失败"))},i.src=s})}a(Ms,"svgToPngBlob");async function $s(t){let r=await Ms(xn(t));Fa(r,Ba(t.semester.label)+".png")}a($s,"exportSchedulePng");function Da(t,r){document.getElementById("urppp-feature-toast")?.remove();let e=document.createElement("div");e.id="urppp-feature-toast",e.textContent=String(t||""),e.className=r?"error":"",document.documentElement.appendChild(e),requestAnimationFrame(()=>e.classList.add("open")),setTimeout(()=>{e.classList.remove("open"),setTimeout(()=>e.remove(),220)},r?4200:2400)}a(Da,"showFeatureToast");let ja=mp({document,window,ensureStyles:cs,loadData:bn,exportJson:zs,exportIcs:qs,exportPng:$s,showToast:Da,nativePageUrl:Cs,navigate:a(t=>{location.href=t},"navigate"),logger:console});function Is(t,r,e,o){return ja.run(t,r,e,o)}a(Is,"runScheduleExport");function Ns(t){return ja.createMenu(t)}a(Ns,"createScheduleExportMenu");function Bs(t){if(t){try{t.stage.remove()}catch{}try{document.getElementById("urppp-pdf-reset-style")?.remove()}catch{}}}a(Bs,"disposeNativePdfCapture");function Fs(){window.__urpppPdfDiagnose||(window.__urpppPdfDiagnose=async()=>{let t={time:new Date().toISOString()},r=document.getElementById("mycoursetable"),e=document.getElementById("page-content-template");t.host=!!r,t.pageSource=!!e,t.hostCards=r?r.querySelectorAll("div.class_div").length:-1,t.hostHasCourseTable=r?!!r.querySelector("#courseTable"):!1,t.hostHasCourseTableBody=r?!!r.querySelector("#courseTableBody"):!1,t.hostTableId=r&&r.querySelector("table")?r.querySelector("table").id:"none";try{let s=Mp(r);t.stage="ok",t.stageCards=s.target.querySelectorAll(".urppp-pdf-card").length,t.stageTableId=s.target.querySelector("table")?s.target.querySelector("table").id:"none",Bs(s)}catch(s){t.stage="failed",t.stageError=s&&s.message||String(s)}let o=typeof unsafeWindow<"u"?unsafeWindow:window;return t.deps={dollar:typeof o.$,loadFileList:typeof(o.Import&&o.Import.LoadFileList),back:typeof o.back,html2canvas:typeof o.html2canvas,originalDivBuild:typeof o.__urpppOriginalDivBuild},t})}a(Fs,"bindNativePdfDiagnose");function Ds(t){return t?(Fs(),async()=>{let r=document.getElementById("urppp-settings-panel"),e=document.getElementById("urppp-settings-mask");r&&r.classList.contains("open")&&r.classList.remove("open"),e&&e.classList.contains("open")&&e.classList.remove("open");try{await Np(t,{document,page:typeof unsafeWindow<"u"?unsafeWindow:window,onAfterRestore:ne})}catch(o){console.warn("[URP++] isolated native PDF export failed",o),Da("原生 PDF 隔离导出失败："+(o&&o.message||String(o))+"，请重试",!0)}}):null}a(Ds,"pagePdfExportHandler");function Oa(t=location){return/\/(?:student\/courseSelect\/(?:thisSemesterCurriculum|courseSelectResult|calendarSemesterCurriculum)|student\/personalSenate\/giveLessonInfo\/thisSemesterSchedule)\//.test(t.pathname)}a(Oa,"isPersonalSchedulePage");function js(t=location){return/\/student\/integratedQuery\/scoreQuery\/[^/]+\/index$/.test(t.pathname)}a(js,"isScoreQueryPage");function Ha(){if(!Oa())return;let t=document.querySelector("#h4_id1")?.closest("h4")||document.querySelector("h4.header"),r=t?.querySelector(".right_top_oper")||document.querySelector("#mainDIV .right_top_oper, .page-content .right_top_oper"),e=Array.from((r||document).querySelectorAll("button, a")),o=a(l=>[l.textContent,l.getAttribute("title"),l.getAttribute("onclick")].filter(Boolean).join(" ").replace(/\s+/g," "),"signatureOf");if(e.forEach(l=>{/打印.*课表|\bdy\s*\(/i.test(o(l))&&l.setAttribute("data-urppp-native-print-source","1")}),document.getElementById("urppp-native-schedule-export"))return;let s=e.find(l=>/导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(o(l))),i=Ns({source:"native",pdfHandler:Ds(s)});if(i.id="urppp-native-schedule-export",s&&s.parentElement){s.__urpppNativeExportState||(s.__urpppNativeExportState={display:s.style.getPropertyValue("display"),displayPriority:s.style.getPropertyPriority("display"),ariaHidden:s.getAttribute("aria-hidden"),tabIndex:s.getAttribute("tabindex")}),s.setAttribute("data-urppp-native-export-source","1"),s.style.setProperty("display","none","important"),s.setAttribute("aria-hidden","true"),s.setAttribute("tabindex","-1"),s.parentElement.insertBefore(i,s.nextSibling);return}if(r)r.appendChild(i);else if(t)t.appendChild(i);else{let l=document.getElementById("page-content-template")||document.querySelector(".page-content");if(l){let f=document.createElement("div");f.className="urppp-export-fallback",f.appendChild(i),l.prepend(f)}}}a(Ha,"patchNativeScheduleExport");let Rr=null,De=0;function Ra(){clearTimeout(De),De=0,Rr&&Rr.observer.disconnect(),Rr=null}a(Ra,"disconnectNativeScheduleExportObserver");function Os(){if(!Oa()){Ra();return}let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;if(!t||Rr&&Rr.root===t&&t.isConnected)return;Ra();let r=new MutationObserver(()=>{clearTimeout(De),De=setTimeout(()=>Ha(),80)});r.observe(t,{childList:!0,subtree:!0}),Rr={root:t,observer:r}}a(Os,"bindNativeScheduleExportObserver");function yn(t,r,e){e===null?t.removeAttribute(r):t.setAttribute(r,e)}a(yn,"restoreOptionalAttribute");function Hs(t=document){let r=t&&t.querySelectorAll?t:document,e=r.matches?.("#urppp-native-schedule-export")?r:r.querySelector("#urppp-native-schedule-export");if(e){let o=e.closest(".urppp-export-fallback");e.remove(),o&&!o.children.length&&o.remove()}r.querySelectorAll("[data-urppp-native-export-source]").forEach(o=>{let s=o.__urpppNativeExportState;s&&(s.display?o.style.setProperty("display",s.display,s.displayPriority):o.style.removeProperty("display"),yn(o,"aria-hidden",s.ariaHidden),yn(o,"tabindex",s.tabIndex)),o.removeAttribute("data-urppp-native-export-source");try{delete o.__urpppNativeExportState}catch{}}),r.querySelectorAll("[data-urppp-native-print-source]").forEach(o=>{o.removeAttribute("data-urppp-native-print-source")})}a(Hs,"removeNativeScheduleExport");let vn=fi({deps:{styles:Gp,loadScores:$n,loadProfile:wn,scoreToNumber:Hr,scoreToGpa:Or,getInsertHost:a(()=>document.querySelector(".page-content")||document.getElementById("page-content-template")||null,"getInsertHost"),shouldAutoExpand:a(()=>{let t=/[?&]urppp=sa(?:&|$)/.test(window.location.search);if(t)try{history.replaceState(null,"",window.location.pathname+window.location.hash)}catch{}return t},"shouldAutoExpand")}}),Rs=Wn([Re({id:"schedule-export",matches:a(t=>Oa(t.location),"matches"),mount:a(()=>{Ha(),Os()},"mount"),unmount:a(t=>{Ra(),Hs(t?.lifecycleKey)},"unmount")}),Re({id:"score-analysis",matches:a(t=>js(t.location),"matches"),mount:a(()=>{try{vn.mount()}catch(t){console.warn("[URP++] score analysis mount",t)}},"mount"),unmount:a(()=>{try{vn.unmount()}catch{}},"unmount")})]);function je(){let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;return Rs.refresh({document,location,window,lifecycleKey:t})}a(je,"refreshRouteFeatures");function Us(t){ja.bindHosts(t)}a(Us,"bindScheduleExportHosts");function se(t){return String(t||"").replace(/\u00a0/g," ").replace(/\s+/g," ").replace(/^[\s:：]+|[\s:：]+$/g,"").trim()}a(se,"normalizeProfileValue");function Oe(t,r){if(!t||!t.querySelectorAll)return"";let e=(r||[]).map(s=>se(s).replace(/[：:]/g,"")),o=t.querySelectorAll(".profile-info-row, tr");for(let s=0;s<o.length;s++){let i=o[s],l=i.querySelector(".profile-info-name, th, label"),f=i.querySelector(".profile-info-value, td:last-child");if(!l||!f||l===f)continue;let h=se(l.textContent).replace(/[：:]/g,"");if(!e.some($=>h===$||h.endsWith($)))continue;let E=se(f.textContent);if(E&&E!=="—"&&E!=="-")return E}return""}a(Oe,"readLabeledProfileValue");function Ur(t){return se(t).replace(/^主修为\s*/,"").replace(/培养方案概况.*$/,"").replace(/…+/g,"").split(/主修必修GPA|GPA算法|已修读|尚不及格|本学期/)[0].trim()}a(Ur,"cleanMajorPlanName");function Ws(t){let r={majorPlan:"",majorGpa:""};return!t||!t.querySelectorAll||t.querySelectorAll(".infobox, .widget-box, .urppp-stat-card").forEach(e=>{let o=(e.innerText||e.textContent||"").trim(),s=se(o);if(/主修必修GPA/.test(s)){let i=s.match(/(-?\d+(?:\.\d+)?)\s*主修必修GPA/)||s.match(/主修必修GPA[^\d-]{0,20}(-?\d+(?:\.\d+)?)/);if(i){let l=Number(i[1]),f=Number(r.majorGpa);Number.isFinite(l)&&l>=0&&l<=5&&(!r.majorGpa||f===0||l>0)&&(r.majorGpa=i[1])}}if(/主修为|培养方案/.test(s)){let i=s.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·+\-]{2,60}(?:培养方案|教学计划))/)||s.match(/^(.{2,60}?)\s*主修为/)||s.match(/主修为\s*(.{2,60})$/),l=Ur(i&&i[1]);if(l&&!/GPA|已修读|尚不及格|本学期/.test(l)){let f=/培养方案|教学计划/.test(l);(!r.majorPlan||f)&&(r.majorPlan=l)}}}),r}a(Ws,"extractAcademicOverview");async function wn(){let t={name:"",avatar:"",majorPlan:"",majorGpa:"",studentId:""};try{let e=document.querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(e){let i=e.querySelector(".urppp-user-name-value"),l=i&&i.__urpppOriginalText;l&&(t.name=String(l).trim());let f=(e.innerText||e.textContent||"").replace(/\s+/g," ").trim(),h=t.name?null:f.match(/欢迎您[，,]\s*([\u4e00-\u9fa5·]{2,12})/);if(!t.name&&!h){let E=e.cloneNode(!0);E.querySelectorAll("small, i, img, b, .badge").forEach(j=>j.remove());let $=(E.textContent||"").replace(/\s+/g," ").trim();$=$.replace(/^欢迎您[，,]\s*/g,"").replace(/\d{8,}/g,"").trim(),h=$.match(/([\u4e00-\u9fa5·]{2,12})/)}h&&h[1]&&!/欢迎|同学|首页|反馈|密码|注销/.test(h[1])&&(t.name=h[1])}let o=document.querySelector("#navbar img.nav-user-photo, .ace-nav img.nav-user-photo");o&&(t.avatar=o.__urpppOriginalSrc||o.src||o.getAttribute("src")||"");let s=Ws(document);t.majorPlan=s.majorPlan,t.majorGpa=s.majorGpa}catch{}try{let e=await Jt("/student/rollManagement/rollInfo/index"),o=Ne(e),s=o.body&&(o.body.innerText||o.body.textContent)||"";if(!t.name&&(t.name=Oe(o,["姓名"]),!t.name)){let h=s.match(/姓名\s*[：:]?\s*([\u4e00-\u9fa5·]{2,20})/);h&&(t.name=h[1].trim())}let i=Oe(o,["主修方案名称"]),l=Oe(o,["专业"]);t.studentId=Oe(o,["学号"]),i?t.majorPlan=Ur(i):!t.majorPlan&&l&&(t.majorPlan=Ur(l));let f=o.querySelector('.profile-picture img, img#avatar, img[src*="photo" i], img[src*="Photo"]');if(f&&f.getAttribute("src")&&!t.avatar){let h=f.getAttribute("src");t.avatar=/^https?:/i.test(h)?h:$a(h)}}catch{}let r=Number(t.majorGpa);return t.name||(t.name="同学"),t.majorPlan||(t.majorPlan="主修方案"),(!Number.isFinite(r)||r<=0||r>5)&&(t.majorGpa="—"),t}a(wn,"loadProfile");let kn=["周日","周一","周二","周三","周四","周五","周六"];function Ua(t){let r=[],e=t.querySelector("#courseTableBody")||t.querySelector("#courseTable tbody");if(!e)return r;e.querySelectorAll("td[id]").forEach(s=>{let i=String(s.id||"").match(/^(\d+)_(\d+)$/);if(!i)return;let l=parseInt(i[1],10),f=parseInt(i[2],10),h=l===7?0:l,E=s.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"]'),$=E.length?E:[];if(!$.length&&(s.textContent||"").trim()){let j=(s.textContent||"").replace(/\s+/g," ").trim();j&&r.push({name:j.slice(0,40),teacher:"",place:"",week:"",day:h,section:f});return}$.forEach(j=>{let z=Array.from(j.querySelectorAll("p")).map(K=>(K.textContent||"").trim()).filter(Boolean),F=(j.querySelector(".p-kcm-1, .p-kcm")||{}).textContent||z[0]||"",J=(j.querySelector('.p-jxl-1, [class*="jxl"]')||{}).textContent||"",D=z.find((K,ut)=>ut>0&&!/周|节/.test(K)&&K!==J)||"",R=z.find(K=>/周/.test(K))||"",B=String(F).replace(/_\d+\s*$/,"").trim();!B||B.length<2||r.push({name:B,teacher:String(D).trim(),place:String(J||"").trim(),week:String(R).trim(),day:h,section:f})})});let o=new Set;return r.filter(s=>{let i=[s.day,s.section,s.name,s.place].join("|");return o.has(i)?!1:(o.add(i),!0)})}a(Ua,"parseScheduleFromDoc");let An="urppp_term_week_v1";function Wr(t){let r=Number(t)||0;if(r<1||r>30)return 0;ot._termWeek=r,ot._termWeekResolved=!0;try{GM_setValue(An,r)}catch{}return r}a(Wr,"rememberTermWeek");function le(){if(ot&&ot._termWeek>=1)return ot._termWeekResolved=!0,ot._termWeek;try{let t=Number(GM_getValue(An,0))||0;if(t>=1&&t<=30)return Wr(t)}catch{}return 0}a(le,"readRememberedTermWeek");function ce(t){let r=String(t||"").replace(/\s+/g," ");if(!r)return 0;let e=[/(?:\d{4}\s*[-–]\s*\d{4}).{0,40}?第\s*(\d{1,2})\s*周/,/20\d{2}.{0,40}?第\s*(\d{1,2})\s*周/,/(?:春|秋|夏|冬)\s*第\s*(\d{1,2})\s*周/,/第\s*(\d{1,2})\s*周\s*(?:星期|周[一二三四五六日天])/];for(let o=0;o<e.length;o++){let s=r.match(e[o]);if(s){let i=parseInt(s[1],10);if(i>=1&&i<=30)return i}}return 0}a(ce,"extractTermWeekFromText");function _r(){if(ot._termWeekResolved&&ot._termWeek>=1&&ot._termWeek<=30)return ot._termWeek;try{let t=[document.querySelector("#navbar"),document.querySelector(".navbar-fixed-top"),document.querySelector(".navbar"),document.querySelector("#navbar .navbar-header"),document.querySelector("#navbar .navbar-buttons"),document.querySelector(".ace-nav"),document.querySelector("#breadcrumbs"),document.querySelector("#page-content-header"),document.querySelector(".page-header"),document.querySelector("header")].filter(Boolean);for(let l=0;l<t.length;l++){let f=t[l],h=ce(f.innerText||f.textContent||"")||ce(f.innerHTML||"");if(h)return Wr(h)}let r=document.documentElement&&document.documentElement.innerHTML||"",e=ce(r);if(e)return Wr(e);let o=document.body&&document.body.innerText||"",s=ce(o);if(s)return Wr(s);let i=le();if(i)return i}catch{}return 0}a(_r,"getCurrentWeekNumber");let Gr=null;function Gs(){let t=new Date,r=a(e=>String(e).padStart(2,"0"),"p");return`${t.getFullYear()}-${r(t.getMonth()+1)}-${r(t.getDate())}`}a(Gs,"calTodayStr");function Js(t,r){let e=new Date(`${t}T00:00:00`);e.setDate(e.getDate()+r);let o=a(s=>String(s).padStart(2,"0"),"p");return`${e.getFullYear()}-${o(e.getMonth()+1)}-${o(e.getDate())}`}a(Js,"calAddDays");function de(t){if(Gr)return Gr;let r=t||Gs();return r>="2027-02-06"&&r<=Js("2027-02-06",6)?"springfestival":r>="2027-01-18"&&r<"2027-03-01"?"winter":r>="2027-07-04"&&r<"2027-08-31"||r>="2026-07-04"&&r<"2026-08-31"?"summer":"term"}a(de,"calVacation");function Vs(){let t='<svg viewBox="0 0 52 190"><path d="M26 0v16" stroke="#c8102e" stroke-width="3"/><rect x="16" y="16" width="20" height="8" rx="4" fill="#c8102e"/><ellipse cx="26" cy="62" rx="22" ry="30" fill="#e63946"/><path d="M26 26v72M14 34q12 12 0 24M38 34q-12 12 0 24" stroke="#ffd75e" stroke-width="1.4" fill="none"/><path d="M14 92h24M17 98h18M20 104h12" stroke="#ffd75e" stroke-width="2.4" stroke-linecap="round"/></svg>';return`<div id="urppp-festive-decor" aria-hidden="true"><div class="ufd ufd-left">${t}</div><div class="ufd ufd-right">${t}</div></div>`}a(Vs,"festiveDecorHtml");function Sn(){let t=typeof document<"u"?document:null;if(!t)return;let r=de()==="springfestival",e=t.getElementById("urppp-festive-decor");r&&!e?t.documentElement.insertAdjacentHTML("beforeend",Vs()):!r&&e&&e.remove()}a(Sn,"syncFestiveDecor");function _n(t){Gr=t==="summer"||t==="winter"||t==="springfestival"||t==="term"?t:null,Gr&&Gr!=="term"&&(ot.weekLocked=!1,ot.viewWeek=0);try{Sn()}catch{}try{typeof Vr=="function"&&Vr()}catch{}return Gr}a(_n,"setCalendarPhase");function Ys(){return de()}a(Ys,"getCalendarPhase");function En(){if(de()!=="term")return ot.weekLocked?(!ot.viewWeek||ot.viewWeek<0)&&(ot.viewWeek=0):ot.viewWeek=0,ot.viewWeek;let t=_r()||le()||0;return ot.weekLocked?(!ot.viewWeek||ot.viewWeek<1)&&(ot.viewWeek=t>=1?t:1):t>=1?ot.viewWeek=t:(!ot.viewWeek||ot.viewWeek<1)&&(ot.viewWeek=1),!ot.weekLocked&&t>1&&ot.viewWeek===1&&(ot.viewWeek=t),ot.viewWeek}a(En,"getViewWeekNumber");async function Qs(){let t=_r();if(t>=1)return t;try{let r=await Jt("/index");if(t=ce(r),t)return Wr(t)}catch{}try{let r=new Date,e=r.getFullYear()+"-"+String(r.getMonth()+1).padStart(2,"0")+"-"+String(r.getDate()).padStart(2,"0"),o="xqh=03&jxlh=302&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(e),s=await Jt("/student/teachingResources/classroomUseStatus/jasInfo",{method:"POST",data:o,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),i=JSON.parse(s),l=Number(i&&i.jxzc);if(l>=1&&l<=30)return Wr(l)}catch{}return le()||0}a(Qs,"ensureTermWeekResolved");function Xs(t){let r=_r()||20;return(t||[]).forEach(e=>{let o=String(e.classWeek||"");o.length>r&&(r=o.length);let s=String(e.week||"").match(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/);s&&(r=Math.max(r,parseInt(s[2],10)||0));let i=String(e.week||"").match(/\d{1,2}/g);i&&i.forEach(l=>{r=Math.max(r,parseInt(l,10)||0)})}),Math.min(Math.max(r,1),30)}a(Xs,"inferMaxWeek");function Cn(t,r){if(!r||!t)return!1;let e=String(t);return e.length>=r?e.charAt(r-1)==="1":!1}a(Cn,"weekBitActive");let Pn=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#EC4899","#84CC16","#F97316","#6366F1"];function zn(t){let r=0,e=String(t||"");for(let o=0;o<e.length;o++)r=r*31+e.charCodeAt(o)>>>0;return Pn[r%Pn.length]}a(zn,"courseColor");function Ks(t){let r=[],e=_r();(t&&t.xkxx||[]).forEach(i=>{Object.keys(i||{}).forEach(l=>{let f=i[l];if(!f)return;let h=f.courseName||f.englishCourseName||l,E=f.attendClassTeacher||"";(f.timeAndPlaceList||[]).forEach(j=>{let z=Number(j.classDay)||0,F=z===7?0:z,J=Number(j.classSessions)||1,D=Math.max(1,Number(j.continuingSession)||1),R=[j.campusName,j.teachingBuildingName,j.classroomName].filter(Boolean).join(""),B=j.weekDescription||f.skzcs||"",K=Cn(j.classWeek,e)||e&&B.indexOf(String(e))>=0;r.push({name:String(h).trim(),teacher:String(E).trim(),place:String(R).trim(),week:String(B).trim(),classWeek:String(j.classWeek||""),day:F,section:J,span:D,thisWeek:!!K,color:zn(h)})})})});let s=new Set;return r.filter(i=>{let l=[i.day,i.section,i.span,i.name,i.place,i.week].join("|");return s.has(l)?!1:(s.add(l),!0)})}a(Ks,"parseScheduleFromJson");async function Zs(){try{let t=await Jt("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),r=[],e=null;try{e=JSON.parse(t);let s=Number(e&&(e.jxzc||e.zc||e.currentWeek));s>=1&&s<=30&&(ot._termWeek=Math.max(ot._termWeek||0,s),ot.weekLocked||(ot.viewWeek=ot._termWeek)),r=Ks(e)}catch{r=Ua(Ne(t))}r.length||(r=Ua(document));let o=e?gn(e,Kr(e),"clean"):null;return{courses:r,exportData:o,rawOk:r.length>0,error:r.length?"":"课表 JSON 无 timeAndPlaceList"}}catch(t){try{let r=Ua(document);if(r.length)return{courses:r,rawOk:!0,error:""}}catch{}return{courses:[],rawOk:!1,error:String(t&&t.message||t)}}}a(Zs,"loadSchedule");function tl(t,r){let e=String(t||""),o=new RegExp(`url\\s*=\\s*["']([^"']*`+r+`[^"']*)["']`,"i"),s=e.match(o);if(s&&s[1])return s[1];let i=new RegExp(`(\\/student\\/integratedQuery\\/scoreQuery\\/[^"'\\s]+`+r+")","i"),l=e.match(i);return l?l[1]:""}a(tl,"extractScoreCallback");function rl(t){let r=[];return(t&&t.lnList||[]).forEach(o=>{let s=o.cjlx||o.cjbh||o.famc||o.zxjxjhh||"成绩",i=[];(o.cjList||[]).forEach(l=>{let f=l.courseName||l.englishCourseName||"";if(!f)return;let h=l.cj!=null&&l.cj!==""?String(l.cj):"";!h&&l.courseScore!=null&&(h=String(l.courseScore)),!h&&l.gradeName&&(h=String(l.gradeName)),!h&&l.zscj!=null&&(h=String(l.zscj));let E=l.courseAttributeName||l.xkcsxmc||"",$=parseFloat(l.credit)||0,j=l.id&&(l.id.courseNumber||l.id.kch_zj)||"",z=l.id&&(l.id.coureSequenceNumber||l.id.courseSequenceNumber||l.id.kxh)||l.classNo||"",F=l.gradePointScore!=null?Number(l.gradePointScore):null,J=ir(h)||ir(l.gradeName)||F!=null&&F<0,D=J?"未评估":h;i.push({code:j,seq:String(z||""),name:f,attr:E,credit:$,score:D,unevaluated:J,required:nn(E),officialGpa:$e(F)?F:null,evalUrl:""})}),i.length&&r.push({title:String(s).slice(0,100),courses:i,summary:tr(i),meta:{zxf:o.zxf,tgms:o.tgms,zms:o.zms,famc:o.famc}})}),r}a(rl,"parseScoreJson");async function Ln(t,r){let e=await Jt(t),o=qn(Ne(e));if(o.length)return o;let s=tl(e,r);if(!s)return[];let i=await Jt(s);try{let l=JSON.parse(i);o=rl(l).map(f=>(f.summary=tr(f.courses),f))}catch{o=qn(Ne(i))}return o}a(Ln,"loadScoreByIndex");function qn(t){let r=[];return t.querySelectorAll("table").forEach(e=>{let o=Array.from(e.tHead&&e.tHead.rows[0]?e.tHead.rows[0].cells:e.rows[0]&&e.rows[0].cells||[]).map($=>($.textContent||"").replace(/\s+/g,""));if(!o.length)return;let s=o.join("|");if(!/课程名/.test(s)||!/成绩/.test(s))return;let i={code:o.findIndex($=>$==="课程号"),name:o.findIndex($=>$==="课程名"),attr:o.findIndex($=>/课程属性|属性/.test($)),credit:o.findIndex($=>$==="学分"),score:o.findIndex($=>$==="成绩")};if(i.name<0||i.score<0)return;let l="成绩",f=e.previousElementSibling;for(let $=0;$<8&&f;$++,f=f.previousElementSibling)if(/^H[1-4]$/.test(f.tagName)||f.classList&&f.classList.contains("header")){l=(f.textContent||"").replace(/\s+/g," ").trim();break}let h=[],E=e.tBodies.length?e.tBodies[0].rows:Array.from(e.rows).slice(1);Array.from(E).forEach($=>{let j=Array.from($.cells||$.querySelectorAll("td"));if(j.length<4)return;let z=a(B=>B>=0&&j[B]?(j[B].textContent||"").replace(/\s+/g," ").trim():"","get"),F=z(i.name),J=z(i.score);if(!F||!J||/课程名|序号/.test(F))return;let D=z(i.attr),R=ir(J);h.push({code:z(i.code),name:F,attr:D,credit:parseFloat(z(i.credit))||0,score:R?"未评估":J,unevaluated:R,required:nn(D),officialGpa:null,evalUrl:""})}),h.length&&r.push({title:l.slice(0,100),courses:h,summary:tr(h)})}),r}a(qn,"parseScoreTables");function ue(t){return Ur(t&&t.meta&&t.meta.famc||t&&t.title||"")}a(ue,"schemePlanName");function Tn(t,r){if(!t||!t.length)return 0;let e=Ur(r),o=t.findIndex(l=>{let f=ue(l);return/培养方案/.test(f)&&!/微专业|辅修|双学位/.test(f)});if(o>=0&&(!e||ue(t[o]).includes(e.slice(0,4)))||e&&(o=t.findIndex(l=>{let f=ue(l);return f.includes(e.replace(/培养方案.*/,"培养方案"))||e.includes(f.slice(0,4))||f.includes(e.slice(0,4))}),o>=0))return o;let s=0,i=-1;return t.forEach((l,f)=>{if(/微专业|辅修/.test(ue(l)))return;let h=(l.courses||[]).length;h>i&&(i=h,s=f)}),s}a(Tn,"pickMajorSchemeIndex");async function el(){let t={};try{let r=await Jt("/student/teachingAssessment/evaluation/queryAll",{method:"POST",data:"pageNum=1&pageSize=200&flag=kt",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),e;try{e=JSON.parse(r)}catch{e=null}(e&&e.data&&e.data.records||[]).forEach(s=>{let i=String(s.KCH||"").trim();if(!i)return;let l=String(s.SFPG)==="1",f=String(s.KTID||"").trim();if(!t[i]){t[i]={ktid:f,kxh:String(s.KXH||""),kcm:s.KCM||"",done:l,pending:l?0:1,total:1,url:!l&&f?"/student/teachingEvaluation/newEvaluation/evaluation/"+f:"/student/teachingEvaluation/newEvaluation/index"};return}t[i].total+=1,l||(t[i].pending+=1,t[i].done=!1,f&&(t[i].ktid=f,t[i].url="/student/teachingEvaluation/newEvaluation/evaluation/"+f))}),Object.keys(t).forEach(s=>{let i=t[s];i.done=!(i.pending>0)})}catch(r){console.warn("[URP++] evaluation map",r)}return t}a(el,"loadEvaluationMap");function al(t){if(!t)return!1;if(t.officialGpa!=null&&$e(t.officialGpa))return!0;let r=t.score;return r==null||r===""||ir(r)?!1:Hr(r)!=null||Or(r)!=null?!0:!/未评估|未评教|待评估|待评教/.test(String(r))}a(al,"hasDisplayableScore");function ol(t,r){if(!t||!r)return t;let e=a(o=>(o||[]).forEach(s=>{if(!s||!s.code)return;let i=r[s.code];if(i){if(al(s)){s.unevaluated=!1,i.done?s.evalUrl=s.evalUrl||"":s.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index";return}i.done||(s.unevaluated=!0,s.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index",(!s.score||s.score===""||ir(s.score))&&(s.score="未评估"))}}),"apply");return(t.passing||[]).forEach(o=>e(o.courses)),(t.schemes||[]).forEach(o=>e(o.courses)),t}a(ol,"attachEvaluationLinks");function Mn(t){return t&&(t.passing&&t.passing[0]&&(t.passing[0].summary=tr(t.passing[0].courses)),t.schemes=(t.schemes||[]).map(r=>(r.summary=tr(r.courses),r)),t)}a(Mn,"refreshScoreSummaries");async function nl(t){if(!t||t.evaluationLoading)return t;t.evaluationLoading=!0;try{let r=await el();return ol(t,r),t.evalMap=r,t.evaluationReady=!0,Mn(t)}finally{t.evaluationLoading=!1}}a(nl,"enrichScoresWithEvaluation");function pl(){if(!ot.scores||!ot.scores.schemes)return;let t=ot.scores.schemes,r=ot.profile&&ot.profile.majorPlan,e=Tn(t,r);ot.scores.majorIdx=e,ot._schemeUserSelected||(ot.activeSchemeIdx=e,ot._schemeInited=!0);let o=t[e];if(!o||!ot.profile)return;let s=ue(o),i=Ur(ot.profile.majorPlan);/培养方案|教学计划/.test(s)&&(!/培养方案|教学计划/.test(i)||i==="主修方案")&&(ot.profile.majorPlan=s);let l=o.summary||{},f=Number(l.requiredCredit),h=Number(l.requiredGpa),E=Number(ot.profile.majorGpa);f>0&&Number.isFinite(h)&&h>=0&&h<=5&&(!Number.isFinite(E)||E<=0)&&(ot.profile.majorGpa=String(Ar(h)))}a(pl,"reconcileProfileAndScores");let Jr=null;async function $n(t){return t&&(Jr=null),Jr&&!Jr.error||(Jr=await il()),Jr}a($n,"loadScores");async function il(){let t={passing:[],schemes:[],error:"",majorIdx:0,evaluationReady:!1,evaluationLoading:!1};try{let[r,e]=await Promise.all([Ln("/student/integratedQuery/scoreQuery/allPassingScores/index","allPassingScores/callback"),Ln("/student/integratedQuery/scoreQuery/schemeScores/index","schemeScores/callback")]),o=[];r.forEach(s=>s.courses.forEach(i=>{o.push(Object.assign({term:s.title},i))})),t.passing=[{title:"全部及格成绩",courses:o,summary:tr(o),groups:r}],t.schemes=e,!t.schemes.length&&o.length&&(t.schemes=[{title:"方案成绩",courses:o,summary:tr(o)}]),Mn(t),t.majorIdx=Tn(t.schemes,ot.profile&&ot.profile.majorPlan),!o.length&&!t.schemes.length&&(t.error="成绩 callback 无数据")}catch(r){t.error=String(r&&r.message||r)}return t}a(il,"loadScoresImpl");function Er(t){if(!t)return[];let r=String(t).trim();if(!r)return[];r=r.replace(/^['"]|['"]$/g,"");try{return JSON.parse(r)}catch{}try{return JSON.parse(r.replace(/&quot;/g,'"').replace(/&#34;/g,'"'))}catch{}return[]}a(Er,"parseJsonArrayLoose");function In(t,r){let e=t.indexOf(r);if(e<0)return"";let o=t.indexOf("[",e);if(o<0)return"";let s=0;for(let i=o;i<t.length&&i<o+3e5;i++){let l=t[i];if(l==="[")s++;else if(l==="]"&&(s--,s===0))return t.slice(o,i+1)}return""}a(In,"extractBalancedArray");async function sl(){let t=await Jt("/student/teachingResources/classroomUseStatus/index");if(/欢迎登录|name=["']j_username["']|loginEn/i.test(t)&&!/jxlList|teachingBuildingName|classroomUseStatus/i.test(t))throw new Error("登录已失效，请刷新页面后重试");let r=[],e=[];try{let i=(t.match(/id=["']xqList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']xqList["'][^>]*value=["']([^"']*)["']/i)||[])[1],l=(t.match(/id=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||[])[1];if(i&&(r=Er(i)),l&&(e=Er(l)),!r.length){let f=t.match(/(?:var\s+)?xqList\s*=\s*(\[[\s\S]*?\])\s*;/);f&&(r=Er(f[1]))}if(!e.length){let f=t.match(/(?:var\s+)?jxlList\s*=\s*(\[[\s\S]*?\])\s*;/);f&&(e=Er(f[1]))}if(!e.length){let f=In(t,"teachingBuildingName");f&&(e=Er(f))}if(!r.length){let f=In(t,"campusName");f&&(r=Er(f))}}catch(i){console.warn("[URP++] classroom json parse",i)}if(!e.length){let i=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}];r=i;let l=[];for(let f of i)try{let h=await Jt("/student/teachingResources/classroomCurriculum/"+f.campusNumber+"/teachingBuildingJson");Er(h).forEach($=>{l.push({id:{campusNumber:f.campusNumber,teachingBuildingNumber:String($.id&&$.id.teachingBuildingNumber||$.teachingBuildingNumber||"")},teachingBuildingName:$.teachingBuildingName||$.name||""})})}catch(h){console.warn("[URP++] building json",f.campusNumber,h)}e=l}r.length||(r=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}]);let o=r.map(i=>({campus:i.campusName||i.campusNumber,campusNumber:String(i.campusNumber||i.id&&i.id.campusNumber||""),buildings:[]}));e.forEach(i=>{let l=String(i.id&&i.id.campusNumber||i.campusNumber||""),f=String(i.id&&i.id.teachingBuildingNumber||i.teachingBuildingNumber||""),h=i.teachingBuildingName||i.name||f;if(!l||!f||!h)return;let E=o.find(j=>j.campusNumber===l);E||(E={campus:l,campusNumber:l,buildings:[]},o.push(E));let $="/student/teachingResources/classroomUseStatus/"+l+"/"+f+"/"+encodeURI(encodeURI(E.campus||l))+"/"+encodeURI(encodeURI(h));E.buildings.push({name:h,path:$,campusNumber:l,buildingNumber:f})});let s=o.filter(i=>i.buildings.length);if(!s.length)throw new Error("未解析到教学楼，请刷新后重试");return s}a(sl,"loadClassroomCatalog");function me(t){let r=String(t&&t.occupancymoduleId||""),e={"06":"有课","07":"考试",14:"实验",room:"借用"};if(e[r])return e[r];if(t&&t.remark){let o=String(t.remark).trim();if(o)return o}return"占用"}a(me,"occupancyTypeLabel");function ll(t){if(t&&t.contentName)return String(t.contentName).trim();if(t&&t.remark){let r=String(t.remark).trim();if(r)return r}return me(t)}a(ll,"occupancyReason");async function cl(t,r,e,o){let s=new URLSearchParams({planNumber:String(t||""),campusNumber:String(r||""),teachingBuildingNumber:String(e||""),classroomNumber:String(o||"")}),i=await Jt("/student/teachingResources/classroomCurriculum/searchCurriculum/callback?"+s.toString());try{let l=JSON.parse(i);return Array.isArray(l)?l.length&&Array.isArray(l[0])?l[0]:l.filter(f=>f&&typeof f=="object"&&(f.kcm||f.id&&f.id.kch)):l&&Array.isArray(l.list)?l.list:[]}catch{return[]}}a(cl,"fetchClassroomCurriculum");function dl(t,r,e){let o=t||[],s=Number(r.xq)||0,i=Number(r.start)||0,l=Number(e)||0,f=[];return o.forEach(h=>{let E=h.id||{},$=Number(E.skxq!=null?E.skxq:h.skxq)||0,j=Number(E.skjc!=null?E.skjc:h.skjc)||0,z=Math.max(1,Number(h.cxjc)||1),F=E.skzc||h.skzc||"";s&&$&&s!==$||i&&(i<j||i>=j+z)||l&&F&&!Ma(F,l)||f.push(h)}),f.length?(f.sort((h,E)=>{let $=Ma(h.id&&h.id.skzc||h.skzc,l)?0:1,j=Ma(E.id&&E.id.skzc||E.skzc,l)?0:1;return $-j}),f[0]):null}a(dl,"matchCurriculumCourse");async function ul(t,r,e){if(!t||!t.rooms||!t.rooms.length)return t;let o=String(r.campusNumber||""),s=String(r.buildingNumber||""),i=e||t.planNumber||"";if(!o||!s||!i)return t;let l=t.rooms.filter(z=>(z.slots||[]).some(F=>F.busy)),f={},h=a(async z=>{if(f[z])return f[z];try{f[z]=await cl(i,o,s,z)}catch{f[z]=[]}return f[z]},"queue"),E=4,$=0,j=new Array(Math.min(E,Math.max(l.length,1))).fill(0).map(async()=>{for(;$<l.length;){let z=$++,F=l[z],J=await h(F.name);(F.slots||[]).forEach(D=>{if(!D.busy)return;let R={xq:D.detail&&D.detail.xq||D.xq||0,start:D.section,week:t.jxzc};D.detail&&D.detail.xq!=null&&(R.xq=D.detail.xq);let B=dl(J,R,t.jxzc);if(B&&B.kcm){let K=String(B.kcm).trim();D.contentName=K,D.reason=K,D.displayChar=Ie(K),D.detail&&(D.detail.contentName=K,D.detail.reason=K,D.detail.teacher=B.jsm||"",D.detail.weeks=B.zcsm||"",D.detail.courseNo=B.id&&B.id.kch||"",D.detail.typeLabel=me({occupancymoduleId:D.module}))}else D.displayChar=Ie(D.reason||"占用"),D.detail&&(D.detail.typeLabel=me({occupancymoduleId:D.module}))})}});return await Promise.all(j),t}a(ul,"enrichOccupancyWithCurriculum");function ml(t){return t==="有课"?"kind-course":t==="考试"?"kind-exam":t==="实验"?"kind-lab":t==="借用"?"kind-borrow":"kind-busy"}a(ml,"occupancyKindClass");async function bl(t){let r="",e="",o="",s="";if(t&&typeof t=="object")r=String(t.campusNumber||""),e=String(t.buildingNumber||""),o=t.name||"",s=t.path||"";else{s=String(t||"");let B=s.match(/classroomUseStatus\/(\d+)\/(\d+)\//);B&&(r=B[1],e=B[2])}if(!r||!e)throw new Error("缺少校区/楼栋编号");let i=Number(t&&t.dateOffset!=null?t.dateOffset:ot.roomDateOffset)||0,l=hl(Nn(new Date,i)),f="xqh="+encodeURIComponent(r)+"&jxlh="+encodeURIComponent(e)+"&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(l),h=await new Promise((B,K)=>{let ut=$a("/student/teachingResources/classroomUseStatus/jasInfo");typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest({method:"POST",url:ut,data:f,withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},onload:a(vt=>vt.status>=200&&vt.status<400?B(vt.responseText||""):K(new Error("HTTP "+vt.status)),"onload"),onerror:a(()=>K(new Error("network")),"onerror")}):fetch(ut,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:f}).then(vt=>vt.text()).then(B).catch(K)}),E;try{E=JSON.parse(h)}catch{throw new Error("jasInfo 非 JSON")}let $=(E.classrooms||[]).map(B=>{let K=B.classroomName||B.id&&B.id.classroomNumber||"",ut=B.placeNum||"",vt=B.remark||"",_t=[];for(let zt=1;zt<=12;zt++)_t.push({section:zt,busy:!1});return{name:K,seats:ut,type:vt,slots:_t,map:{}}}),j={};$.forEach(B=>{j[B.name]=B}),(E.classroomTime||[]).forEach(B=>{let K=B.id||{},ut=K.classroomNumber||"",vt=Number(K.sessionstart)||1,_t=Math.max(1,Number(B.continuingsession)||1),zt=j[ut];if(!zt)return;let Lt=me(B),jt=ll(B);for(let Ot=vt;Ot<vt+_t&&Ot<=12;Ot++){let Tt=zt.slots.find(rr=>rr.section===Ot);Tt&&(Tt.busy=!0,Tt.kind=B.timestatenumber||B.occupancymoduleId||"",Tt.module=B.occupancymoduleId||"",Tt.reason=jt,Tt.typeLabel=Lt,Tt.displayChar=Ie(jt),Tt.xq=K.xq,Tt.weekBitmap=K.week||"",Tt.detail={room:ut,section:Ot,start:vt,span:_t,reason:jt,typeLabel:Lt,week:K.week||"",xq:K.xq||"",state:B.timestatenumber||"",module:B.occupancymoduleId||""})}});let z="";try{let B=E.jhZxjxjhb;typeof B=="string"&&/\d{4}-\d{4}-\d-\d/.test(B)?z=B:B&&typeof B=="object"&&(z=String(B.zxjxjhh||B.jhxnxq||B.executiveEducationPlanNumber||B.planNumber||""))}catch{}if(!z&&E.classrooms&&E.classrooms[0]&&E.classrooms[0].id&&(z=E.classrooms[0].id.executiveEducationPlanNumber||""),E.jxzc!=null&&Number(E.jxzc)>=1){let B=Number(E.jxzc);ot._termWeek=Math.max(ot._termWeek||0,B),ot.weekLocked||(ot.viewWeek=ot._termWeek)}let F=["日","一","二","三","四","五","六"],J=gl(E.date||l)||Nn(new Date,i),D=E.week!=null?Number(E.week):J.getDay(),R=i===1?"明天":i===2?"后天":"今天";return{rooms:$,dateLabel:(E.date||l)+"（周"+(F[D]||D)+" · "+R+"）",jxzc:E.jxzc,planNumber:z,week:E.week!=null?E.week:D,searchDate:E.date||l,dateOffset:i}}a(bl,"loadBuildingOccupancy");function Nn(t,r){let e=new Date(t.getFullYear(),t.getMonth(),t.getDate());return e.setDate(e.getDate()+(Number(r)||0)),e}a(Nn,"addDays");function hl(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}a(hl,"formatLocalDate");function gl(t){let r=String(t||"").match(/(\d{4})-(\d{1,2})-(\d{1,2})/);return r?new Date(Number(r[1]),Number(r[2])-1,Number(r[3])):null}a(gl,"parseLocalDate");let Bn={clean:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h11M4 17h14"/></svg>',exit:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M14 12H8"/><path d="m14 8 4 4-4 4"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',schedule:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/></svg>',score:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h10v17H7z"/><path d="M10 8h4M10 12h4M10 16h3"/></svg>',room:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-7h6v7"/><path d="M9 10h.01M15 10h.01"/></svg>',eval:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 7h11M8 12h11M8 17h8"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg>',plan:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h8l3 3V20.5H7z"/><path d="M15 3.5V7h3M10 12h5M10 16h5"/></svg>',apply:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',home:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 11 8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/></svg>',more:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',close:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'};function Fn(t){return Bn[t]||Bn.more}a(Fn,"ico");let ot=Vp();function fl(){if(document.getElementById("urppp-clean-style"))return;let t=document.createElement("style");t.id="urppp-clean-style",t.textContent=Up,(document.head||document.documentElement).appendChild(t)}a(fl,"ensureStyle");let xl=ta({deps:{scoreToNumber:Hr,scoreToGpa:Or}}),{metricHtml:yl,occupancyHtml:vl,render:Vr,renderScheduleBoard:hc,roomPickerHtml:wl,scheduleRender:kl}=pi({state:ot,deps:{DIRECT_EDIT_LABELS:U,DAY_NAMES:kn,analyzeScores:a(t=>xl.analyzeScores(t),"analyzeScores"),applyPersonalDisplay:Vt,bandsChartSvg:ea,bindUI:a(t=>Sl(t),"bindUI"),classifyPrivacyLabel:Be,courseColor:zn,ensureRoot:a(()=>jn(),"ensureRoot"),escapeHtml:pt,firstContentChar:Ie,getViewWeekNumber:En,ico:Fn,isCleanAnalysisDirect:pa,occupancyKindClass:ml,occupancyTypeLabel:me,personalizedProfile:_s,scoreChartLayout:a(()=>{try{return window.matchMedia&&window.matchMedia("(max-width: 900px)").matches?{variant:"mobile"}:null}catch{return null}},"scoreChartLayout"),scoreToNumber:Hr,summarizeCourses:tr,trendChartSvg:ra,weekBitActive:Cn,calVacation:de,setCalendarPhase:_n}}),{ensureRoomCatalogLoaded:Dn,loadAll:Al}=Qp({state:ot,deps:{ensureTermWeekResolved:Qs,enrichScoresWithEvaluation:nl,getCurrentWeekNumber:_r,loadClassroomCatalog:sl,loadProfile:wn,loadSchedule:Zs,loadScores:$n,readRememberedTermWeek:le,reconcileProfileAndScores:pl,render:Vr,scheduleRender:kl}}),{bindUI:Sl,closeModal:_l,getRoomHost:gc,openModal:fc,openRoomModal:xc,openScoreModal:yc,showBuilding:vc}=ii({state:ot,deps:{DAY_NAMES:kn,applyPersonalDisplay:Vt,bindScheduleExportHosts:Us,closeCleanMode:a(()=>Cl(),"closeCleanMode"),ensureRoomCatalogLoaded:Dn,enrichOccupancyWithCurriculum:ul,ensureRoot:a(()=>jn(),"ensureRoot"),escapeHtml:pt,fetchText:Jt,getCurrentWeekNumber:_r,getViewWeekNumber:En,inferMaxWeek:Xs,isUnevaluatedScore:ir,isValidOfficialGpa:$e,loadBuildingOccupancy:bl,metricHtml:yl,occupancyHtml:vl,render:Vr,rootEl:a(()=>Pl(),"rootEl"),roomPickerHtml:wl,scoreToGpa:Or,scoreToNumber:Hr,summarizeCourses:tr,summarizeCoursesPreferOfficial:tr}}),{cleanModeApi:El,closeCleanMode:Cl,ensureRoot:jn,injectCleanEntry:wc,openCleanMode:kc,rootEl:Pl}=si({state:ot,deps:{CLEAN_FLAG:ls,applySkinAttr:pr,closeModal:_l,ensureRoomCatalogLoaded:Dn,ensureStyle:fl,getCurrentWeekNumber:_r,getSkin:nr,handleThemeDotClick:ct,ico:Fn,injectCleanSidebarSections:a(t=>{try{window.__urpppInjectCleanSidebarSections?.(t)}catch{}},"injectCleanSidebarSections"),refreshMobileNavbar:a(()=>{try{window.__urpppRefreshMobileNavbar?.()}catch{}},"refreshMobileNavbar"),setDrawerOpen:a((t,r,e)=>{try{window.__urpppSetDrawerOpen?.(t,r,e)}catch{}},"setDrawerOpen"),stopDrawerAnimation:a(t=>{try{window.__urpppStopDrawerAnimation?.(t)}catch{}},"stopDrawerAnimation"),isHomePage:bo,loadAll:Al,openSettingsPanel:Ho,readRememberedTermWeek:le,refreshCleanPersonalDisplay:Na,render:Vr,scoreToGpa:Or,summarizeCourses:tr,syncNavbarThemeUI:ft,syncSettingsPanelUI:Ut,syncThemeDotGroup:Z}});window.__urpppCleanMode=El;function Wa(){if(!document.body){setTimeout(Wa,10);return}if(Gt(Qt()),document.addEventListener("focusin",r=>{let e=r.target;if(!e||!e.matches||!e.matches(".chosen-search input"))return;let o=[],s=e.parentElement;for(;s;){let i=s.scrollTop,l=s.scrollLeft;(i||l||s.scrollHeight>s.clientHeight||s.scrollWidth>s.clientWidth)&&o.push({el:s,top:i,left:l}),s=s.parentElement}requestAnimationFrame(()=>{o.forEach(i=>{i.el.scrollTop=i.top,i.el.scrollLeft=i.left})})},!0),!!document.getElementById("formContent")&&!!document.querySelector(".form-signin"))vo();else{Di();try{pn()}catch{}try{je()}catch(r){console.warn("[URP++] route feature refresh",r)}try{Vt(document)}catch{}try{Sn()}catch{}[350,900,1800].forEach(r=>setTimeout(()=>{try{je()}catch{}try{Vt(document)}catch{}},r));try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}[400,1200,2500].forEach(r=>setTimeout(()=>{try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}},r));try{na()&&bo()&&window.__urpppCleanMode&&setTimeout(()=>{try{window.__urpppCleanMode.open(!1)}catch{}},700)}catch{}}}if(a(Wa,"init"),!window.__urpppSidebarSyncBound){window.__urpppSidebarSyncBound=!0,window.addEventListener("resize",()=>{clearTimeout(window.__urpppSidebarSyncTimer),window.__urpppSidebarSyncTimer=setTimeout(kr,50)}),window.addEventListener("load",()=>{kr(),jr(),setTimeout(kr,100),setTimeout(kr,400)}),document.addEventListener("click",r=>{r.target&&r.target.closest&&r.target.closest("#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse")&&(setTimeout(jr,0),setTimeout(jr,50),setTimeout(jr,200))},!0);let t=document.getElementById("sidebar");t&&!t.__urpppMarginObs&&(t.__urpppMarginObs=new MutationObserver(()=>{clearTimeout(window.__urpppMarginObsTimer),window.__urpppMarginObsTimer=setTimeout(jr,30)}),t.__urpppMarginObs.observe(t,{attributes:!0,attributeFilter:["class","style"]}))}function On(){if(window.__urpppRouteWatchBound)return;window.__urpppRouteWatchBound=!0;let t=0,r=a(()=>{try{let s=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches),i=!!(document.getElementById("urppp-clean-root")&&document.getElementById("urppp-clean-root").classList.contains("open"));s&&!i&&window.__urpppCloseMobileDrawer&&window.__urpppCloseMobileDrawer()}catch{}clearTimeout(t),t=setTimeout(()=>{if(ot._termWeekResolved=!1,!!document.getElementById("sidebar")){kr(),on(),st(),kr();try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}dt(),[250,700].forEach(i=>setTimeout(()=>{try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}},i)),fa(),Fo(),Do(),Lo(),jo(),Bo(),To(),document.querySelectorAll(".page-content, #page-content-template").forEach(i=>{let l=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches);i.style.setProperty("padding",l?"8px 8px 24px":"16px 64px 40px","important"),i.style.setProperty("box-sizing","border-box","important")}),Pe(),qe(),Nr(),setTimeout(Nr,300),setTimeout(Nr,1e3),So(),mr(),ae(),Co(),setTimeout(ae,300),oe(),setTimeout(()=>oe(),500),Ce(),Eo();try{je()}catch{}try{Vt(document)}catch{}setTimeout(()=>{try{je()}catch{}try{Vt(document)}catch{}},500)}},100)},"run");window.addEventListener("popstate",r),window.addEventListener("hashchange",r);let e=history.pushState,o=history.replaceState;history.pushState=function(...s){let i=e.apply(this,s);return r(),i},history.replaceState=function(...s){let i=o.apply(this,s);return r(),i}}a(On,"watchRouteChanges");let Yr=typeof unsafeWindow<"u"?unsafeWindow:window;Yr.__urpppDebug=Yr.__urpppDebug||{},Yr.__urpppDebug.setCalendarPhase=t=>_n(t),Yr.__urpppDebug.getCalendarPhase=()=>Ys(),Yr.__urpppDebug.calVacation=t=>de(t),Yr.urppp={version:p,showLogo(t){let r=document.querySelector("#urppp-brand .ub-logo");r&&r.classList.toggle("show",t)},theme:{apply:a(t=>{Gt(t)},"apply"),setAccent:wi,getAccent:Yt,getCurrent:Qt,list:a(()=>Object.entries(Et).map(([t,r])=>({name:t,displayName:r.name,current:t===Qt()})),"list")},update:{check:qa,auto:La,showToast:za},privacy:{get:yr,set(t){return sa(t),Vt(document),yr()},apply:a(()=>Vt(document),"apply"),identity:{get:qr,set(t){return co(t),Vt(document),Na(),qr()}}},scheduleExport:{load:a(()=>bn("api"),"load"),run:a(t=>Is(t,"api",null,null),"run"),patch:Ha,image:{theme:fn,build:a((t,r)=>xn(t,r),"build")},jsonFormat:{get:_e,set:mo,validate:Pr,build(t,r){let e=We(t);if(r)return Je(e,Pr(r));let o=_e();return o.enabled?Je(e,o.mapping):Ge(e)},buildDefault(t){return Ge(We(t))}}}};function Hn(){setTimeout(()=>{try{La()}catch{}},1800)}a(Hn,"scheduleAutoUpdateCheck"),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Wa(),On(),Hn()}):(Wa(),On(),Hn())})();})();
