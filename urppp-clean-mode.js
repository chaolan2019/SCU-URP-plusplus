/**
 * URP++ Clean Mode (清爽模式)
 * Desktop: one-page dashboard (profile+schedule | scores | services)
 * Mobile: home + bottom tabs (home/scores/classroom/more)
 * Theme tokens reuse existing --bg/--surface/--text/--primary
 */
(function () {
  'use strict';

  const CLEAN_FLAG = 'urppp-clean-open';

  // ---- SCU GPA rules (成绩单说明) ----
  function scoreToGpa(raw) {
    if (raw == null || raw === '') return null;
    const s = String(raw).trim();
    if (!s || /取消|缓考|免修|旷考|缺考|通过(?!)/.test(s) && !/及格|合格|优秀|良好|中等/.test(s)) {
      // 纯“通过/免修”等无百分制：不计绩点（返回 null 表示跳过）
      if (/^免修|通过$|合格$/.test(s)) {
        if (s === '合格') return 1.0;
        return null;
      }
    }
    if (/优秀/.test(s)) return 4.0;
    if (/良好/.test(s)) return 3.0;
    if (/中等/.test(s)) return 2.0;
    if (/及格/.test(s) && !/不及格/.test(s)) return 1.0;
    if (/不及格|不合格|不通过/.test(s)) return 0;
    if (/合格/.test(s)) return 1.0;
    const n = parseFloat(s.replace(/[^\d.]/g, ''));
    if (Number.isNaN(n)) return null;
    if (n < 60) return 0;
    // 百分制：分数/10-5，最高 4.0，最低 1.0（及格线）
    const g = n / 10 - 5;
    if (g > 4) return 4.0;
    if (g < 1) return 1.0;
    return Math.round(g * 100) / 100;
  }

  function scoreToNumber(raw) {
    const s = String(raw || '').trim();
    if (/优秀/.test(s)) return 95;
    if (/良好/.test(s)) return 85;
    if (/中等/.test(s)) return 75;
    if (/及格/.test(s) && !/不及格/.test(s)) return 65;
    if (/不及格|不合格|不通过/.test(s)) return 0;
    if (/合格/.test(s)) return 70;
    const n = parseFloat(s.replace(/[^\d.]/g, ''));
    return Number.isNaN(n) ? null : n;
  }

  function summarizeCourses(list) {
    const rows = (list || []).filter((c) => c && c.credit > 0 && scoreToNumber(c.score) != null);
    let creditSum = 0;
    let scoreW = 0;
    let gpaW = 0;
    let gpaCredit = 0;
    let reqCredit = 0;
    let reqScoreW = 0;
    let reqGpaW = 0;
    let reqGpaCredit = 0;

    rows.forEach((c) => {
      const cr = Number(c.credit) || 0;
      const sc = scoreToNumber(c.score);
      const gp = scoreToGpa(c.score);
      if (sc == null || cr <= 0) return;
      creditSum += cr;
      scoreW += sc * cr;
      if (gp != null) {
        gpaW += gp * cr;
        gpaCredit += cr;
      }
      if (c.required) {
        reqCredit += cr;
        reqScoreW += sc * cr;
        if (gp != null) {
          reqGpaW += gp * cr;
          reqGpaCredit += cr;
        }
      }
    });

    const avg = creditSum ? scoreW / creditSum : 0;
    const gpa = gpaCredit ? gpaW / gpaCredit : 0;
    const reqAvg = reqCredit ? reqScoreW / reqCredit : 0;
    const reqGpa = reqGpaCredit ? reqGpaW / reqGpaCredit : 0;
    return {
      totalCredit: round2(creditSum),
      avgScore: round2(avg),
      avgGpa: round2(gpa),
      requiredCredit: round2(reqCredit),
      requiredGpa: round2(reqGpa),
      requiredAvg: round2(reqAvg),
      count: rows.length
    };
  }

  function round2(n) {
    return Math.round((Number(n) || 0) * 100) / 100;
  }

  function isRequiredAttr(attr) {
    return /必修/.test(String(attr || ''));
  }

  // ---- network helpers ----
  function fetchText(url) {
    return new Promise((resolve, reject) => {
      const done = (ok, val) => (ok ? resolve(val) : reject(new Error(val || 'fetch failed')));
      try {
        if (typeof GM_xmlhttpRequest === 'function') {
          GM_xmlhttpRequest({
            method: 'GET',
            url,
            anonymous: false,
            withCredentials: true,
            onload: (r) => {
              if (r.status >= 200 && r.status < 400) done(true, r.responseText || '');
              else done(false, 'HTTP ' + r.status);
            },
            onerror: () => done(false, 'network error')
          });
          return;
        }
      } catch (_) {}
      fetch(url, { credentials: 'include', cache: 'no-store' })
        .then((r) => {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.text();
        })
        .then((t) => done(true, t))
        .catch((e) => done(false, e && e.message));
    });
  }

  function parseHtml(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  // ---- data: profile ----
  async function loadProfile() {
    const profile = {
      name: '',
      avatar: '',
      majorPlan: '',
      majorGpa: '',
      studentId: ''
    };
    try {
      const user = document.querySelector('.user-info, #navbar .user-info, .ace-nav .user-info');
      if (user) {
        const t = (user.textContent || '').replace(/\s+/g, ' ').trim();
        // 常见：姓名 学号 或 欢迎 xxx
        const m = t.match(/([\u4e00-\u9fa5·]{2,20})/);
        if (m) profile.name = m[1];
      }
      const img = document.querySelector('#navbar img.nav-user-photo, .ace-nav img.nav-user-photo, img.nav-user-photo');
      if (img && img.src) profile.avatar = img.src;
      // 首页学业信息
      const bodyText = (document.body && document.body.innerText) || '';
      const gpaM = bodyText.match(/主修必修GPA[^\d]*(\d+\.\d+)/) || bodyText.match(/(\d+\.\d+)\s*主修必修GPA/);
      if (gpaM) profile.majorGpa = gpaM[1];
      // 从数字旁结构再试
      document.querySelectorAll('.infobox, .urppp-stat-card, .widget-box').forEach((box) => {
        const tx = (box.textContent || '').replace(/\s+/g, ' ');
        if (/主修必修GPA|GPA算法/.test(tx)) {
          const n = tx.match(/(\d+\.\d+)/);
          if (n) profile.majorGpa = n[1];
        }
        if (/培养方案|主修为/.test(tx) && !profile.majorPlan) {
          const m = tx.match(/主修为\s*([^\n]{2,40})/) || tx.match(/([\u4e00-\u9fa5A-Za-z0-9（）()]{4,40}培养方案)/);
          if (m) profile.majorPlan = m[1].replace(/…+$/, '').trim();
        }
      });
    } catch (_) {}

    // 补拉学籍页
    try {
      const html = await fetchText('/student/rollManagement/rollInfo/index');
      const doc = parseHtml(html);
      const text = (doc.body && doc.body.innerText) || '';
      if (!profile.name) {
        const nm = text.match(/姓名\s*([^\s]{2,20})/);
        if (nm) profile.name = nm[1];
      }
      if (!profile.studentId) {
        const id = text.match(/学号\s*(\d{8,20})/);
        if (id) profile.studentId = id[1];
      }
      if (!profile.majorPlan) {
        const mp = text.match(/主修方案名称\s*([^\n]+)/) || text.match(/专业\s*([^\n]{2,40})/);
        if (mp) profile.majorPlan = mp[1].trim();
      }
      const photo = doc.querySelector('img[src*="photo"], img[src*="Photo"], .profile-picture img, img.editable-click');
      if (photo && photo.getAttribute('src') && !profile.avatar) {
        const src = photo.getAttribute('src');
        profile.avatar = src.startsWith('http') ? src : (location.origin + (src.startsWith('/') ? src : '/' + src));
      }
    } catch (_) {}

    if (!profile.name) profile.name = '同学';
    if (!profile.majorPlan) profile.majorPlan = '主修方案';
    if (!profile.majorGpa) profile.majorGpa = '—';
    return profile;
  }

  // ---- data: schedule ----
  const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  async function loadSchedule() {
    const html = await fetchText('/student/courseSelect/thisSemesterCurriculum/index');
    const doc = parseHtml(html);
    const table = doc.getElementById('courseTable') || doc.querySelector('table.table-bordered');
    const courses = [];
    if (!table) return { courses, rawOk: false };

    // cells id like "1_1" = Monday section 1? From sample: id="7_1" sunday?, id="1_1" monday
    // thead: 节次, 星期日, 星期一...星期六
    // tbody rows: 大节 + 小节 + 7 day tds
    const body = table.querySelector('#courseTableBody') || table.querySelector('tbody');
    if (!body) return { courses, rawOk: true };

    body.querySelectorAll('tr').forEach((tr) => {
      const ths = tr.querySelectorAll('th');
      const tds = tr.querySelectorAll('td');
      // find section number from th text 第N节
      let section = 0;
      ths.forEach((th) => {
        const m = (th.textContent || '').match(/第\s*(\d+)\s*节/);
        if (m) section = parseInt(m[1], 10);
      });
      if (!section) {
        // try id on th like 0_1
        ths.forEach((th) => {
          const id = th.id || '';
          const m = id.match(/_(\d+)$/);
          if (m) section = parseInt(m[1], 10);
        });
      }
      tds.forEach((td, idx) => {
        // map column: 0=周日 ... 6=周六 based on thead order after two th
        const day = idx; // 0 sunday
        const blocks = td.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"], div');
        const texts = [];
        if (blocks.length) {
          blocks.forEach((b) => {
            const name = (b.querySelector('.p-kcm-1, .p-kcm, [class*="kcm"]') || b).textContent;
            const ps = Array.from(b.querySelectorAll('p')).map((p) => (p.textContent || '').trim()).filter(Boolean);
            const place = (b.querySelector('.p-jxl-1, [class*="jxl"]') || {}).textContent || '';
            const teacher = ps.find((x) => !/周|节/.test(x) && x !== (ps[0] || '')) || '';
            const week = ps.find((x) => /周/.test(x)) || '';
            const jie = ps.find((x) => /节/.test(x)) || '';
            const title = (ps[0] || name || '').replace(/_\d+$/, '').trim();
            if (title && title.length > 1 && !/^\s*$/.test(title)) {
              texts.push({
                name: title,
                teacher: (teacher || '').trim(),
                place: (place || '').trim(),
                week: week,
                sectionText: jie,
                day,
                section
              });
            }
          });
        } else {
          const raw = (td.textContent || '').replace(/\s+/g, ' ').trim();
          if (raw) {
            texts.push({ name: raw.slice(0, 40), teacher: '', place: '', week: '', sectionText: '', day, section });
          }
        }
        texts.forEach((c) => courses.push(c));
      });
    });

    // dedupe by name+day+section
    const seen = new Set();
    const uniq = [];
    courses.forEach((c) => {
      const k = [c.day, c.section, c.name, c.place].join('|');
      if (seen.has(k)) return;
      seen.add(k);
      uniq.push(c);
    });
    return { courses: uniq, rawOk: true };
  }

  // ---- data: scores ----
  function parseScoreTables(doc) {
    const schemes = [];
    // headers like h4 with plan name
    const headers = Array.from(doc.querySelectorAll('h4.header, h4'));
    const tables = Array.from(doc.querySelectorAll('table.table, table'));
    tables.forEach((table) => {
      const head = ((table.tHead && table.tHead.innerText) || (table.rows[0] && table.rows[0].innerText) || '').replace(/\s+/g, '');
      if (!/课程名/.test(head) || !/成绩/.test(head)) return;
      // find preceding h4
      let title = '成绩';
      let el = table.previousElementSibling;
      for (let i = 0; i < 6 && el; i++, el = el.previousElementSibling) {
        if (el.matches && el.matches('h4, .header')) {
          title = (el.textContent || '').replace(/\s+/g, ' ').trim();
          break;
        }
      }
      // also search parent
      const parentH = table.closest('.widget-box, .tab-pane, .page-content')?.querySelector('h4');
      if (parentH && title === '成绩') title = (parentH.textContent || '').replace(/\s+/g, ' ').trim();

      const courses = [];
      const rows = table.querySelectorAll('tbody tr, tr');
      rows.forEach((tr) => {
        const tds = Array.from(tr.querySelectorAll('td'));
        if (tds.length < 5) return;
        const cells = tds.map((td) => (td.textContent || '').replace(/\s+/g, ' ').trim());
        // flexible column detect
        // common: 序号 课程号 课程名 课程属性 学分 成绩 ...
        // or: 序号 课程号 课序号 课程名 课程属性 学分 成绩
        let code = '', name = '', attr = '', credit = 0, score = '';
        if (/^\d+$/.test(cells[0]) && /[A-Za-z0-9]{6,}/.test(cells[1])) {
          code = cells[1];
          // if cells[2] looks like course seq short number and cells[3] is name
          if (/^\d{1,3}$/.test(cells[2]) && cells[3] && !/必修|选修|任选/.test(cells[3])) {
            name = cells[3];
            attr = cells[4] || '';
            credit = parseFloat(cells[5]) || 0;
            score = cells[6] || '';
          } else {
            name = cells[2] || '';
            attr = cells[3] || '';
            credit = parseFloat(cells[4]) || 0;
            score = cells[5] || '';
          }
        } else return;
        if (!name || !score) return;
        if (/序号|课程名/.test(name)) return;
        courses.push({
          code,
          name,
          attr,
          credit,
          score,
          required: isRequiredAttr(attr)
        });
      });
      if (courses.length) {
        schemes.push({
          title: title.slice(0, 80),
          courses,
          summary: summarizeCourses(courses)
        });
      }
    });
    return schemes;
  }

  async function loadScores() {
    const out = { passing: [], schemes: [], error: '' };
    try {
      const [passHtml, schemeHtml] = await Promise.all([
        fetchText('/student/integratedQuery/scoreQuery/allPassingScores/index'),
        fetchText('/student/integratedQuery/scoreQuery/schemeScores/index')
      ]);
      const passDoc = parseHtml(passHtml);
      const schemeDoc = parseHtml(schemeHtml);
      // passing: merge all tables into one list + also keep term groups
      const passGroups = parseScoreTables(passDoc);
      const allPass = [];
      passGroups.forEach((g) => g.courses.forEach((c) => allPass.push(Object.assign({ term: g.title }, c))));
      out.passing = [{
        title: '全部及格成绩',
        courses: allPass,
        summary: summarizeCourses(allPass),
        groups: passGroups
      }];
      out.schemes = parseScoreTables(schemeDoc);
      if (!out.schemes.length && allPass.length) {
        out.schemes = [{ title: '方案成绩', courses: allPass, summary: summarizeCourses(allPass) }];
      }
    } catch (e) {
      out.error = (e && e.message) || '成绩加载失败';
    }
    return out;
  }

  // ---- data: classroom (best-effort) ----
  async function loadClassroomBuildings() {
    try {
      const html = await fetchText('/student/teachingResources/freeClassroom/index');
      const doc = parseHtml(html);
      const groups = [];
      let current = { campus: '校区', buildings: [] };
      doc.querySelectorAll('h4, button, a').forEach((el) => {
        if (el.tagName === 'H4') {
          if (current.buildings.length) groups.push(current);
          current = { campus: (el.textContent || '').trim(), buildings: [] };
          return;
        }
        if (el.tagName === 'BUTTON' || (el.tagName === 'A' && /教|楼|馆|中心|学院/.test(el.textContent || ''))) {
          const name = (el.textContent || '').replace(/\s+/g, ' ').trim();
          if (!name || name.length > 40) return;
          if (/查询|保存|关闭|Toggle|首页/.test(name)) return;
          current.buildings.push({ name, id: el.id || name });
        }
      });
      if (current.buildings.length) groups.push(current);
      return groups;
    } catch (_) {
      return [];
    }
  }

  // ---- icons (inline svg) ----
  const ICONS = {
    clean: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h10M4 18h13"/><circle cx="18" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/></svg>',
    exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"/><path d="M14 12H7"/><path d="M15 8l4 4-4 4"/></svg>',
    schedule: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    score: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 4h10v16H7z"/><path d="M10 8h4M10 12h4M10 16h2"/></svg>',
    room: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21V7l9-4 9 4v14"/><path d="M9 21v-8h6v8"/><path d="M9 10h.01M15 10h.01"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11.5 12 4l8 7.5"/><path d="M7 10.5V20h10v-9.5"/></svg>',
    eval: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h12M8 12h12M8 18h8"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
    apply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/></svg>'
  };

  function icon(name) {
    return ICONS[name] || ICONS.more;
  }

  // ---- state ----
  const state = {
    open: false,
    mobileTab: 'home',
    profile: null,
    schedule: null,
    scores: null,
    buildings: null,
    loading: { profile: false, schedule: false, scores: false, room: false },
    selected: { passing: new Set(), scheme: new Set() },
    activeSchemeIdx: 0
  };

  // ---- UI build ----
  function ensureStyle() {
    if (document.getElementById('urppp-clean-style')) return;
    const st = document.createElement('style');
    st.id = 'urppp-clean-style';
    st.textContent = `
#urppp-clean-root{position:fixed;inset:0;z-index:12000;display:none;background:var(--bg,#F4F6F9);color:var(--text,#0F172A);font-family:inherit;overflow:hidden}
#urppp-clean-root.open{display:flex;flex-direction:column}
#urppp-clean-root *{box-sizing:border-box}
#urppp-clean-root .uc-ico{width:18px;height:18px;display:inline-flex}
#urppp-clean-root .uc-ico svg{width:18px;height:18px;display:block}
#urppp-clean-root .uc-top{flex:0 0 auto;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid var(--border,#E2E8F0);background:var(--surface,#fff)}
#urppp-clean-root .uc-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px}
#urppp-clean-root .uc-top-actions{display:flex;gap:8px;align-items:center}
#urppp-clean-root .uc-btn{height:32px;padding:0 12px;border-radius:10px;border:1px solid var(--border);background:var(--input-bg,#F8FAFC);color:var(--text);font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
#urppp-clean-root .uc-btn.primary{background:var(--primary,#1E3A5F);border-color:var(--primary);color:#fff}
#urppp-clean-root .uc-btn:hover{filter:brightness(0.98)}
#urppp-clean-root .uc-body{flex:1 1 auto;min-height:0;overflow:auto;padding:16px}
#urppp-clean-root .uc-desktop{display:grid;grid-template-columns:4fr 3fr;grid-template-rows:auto 1fr;gap:16px;min-height:100%}
#urppp-clean-root .uc-card{background:var(--surface,#fff);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow,0 2px 12px rgba(0,0,0,.05));overflow:hidden}
#urppp-clean-root .uc-card-hd{padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:13px}
#urppp-clean-root .uc-card-bd{padding:14px}
#urppp-clean-root .uc-profile{display:flex;gap:14px;align-items:center}
#urppp-clean-root .uc-avatar{width:64px;height:64px;border-radius:16px;background:var(--input-bg);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:var(--primary);flex:0 0 64px}
#urppp-clean-root .uc-avatar img{width:100%;height:100%;object-fit:cover}
#urppp-clean-root .uc-name{font-size:18px;font-weight:700;margin:0 0 4px}
#urppp-clean-root .uc-sub{font-size:12px;color:var(--text-secondary,#64748B);line-height:1.5}
#urppp-clean-root .uc-gpa{margin-top:6px;display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:color-mix(in srgb,var(--primary) 12%,var(--input-bg));color:var(--text);font-weight:700;font-size:13px}
#urppp-clean-root .uc-left{display:flex;flex-direction:column;gap:16px;min-height:0}
#urppp-clean-root .uc-sched{flex:1 1 auto;min-height:320px;display:flex;flex-direction:column}
#urppp-clean-root .uc-sched .uc-card-bd{flex:1;overflow:auto}
#urppp-clean-root .uc-week{display:grid;grid-template-columns:36px repeat(7,1fr);gap:6px;min-width:640px}
#urppp-clean-root .uc-week .hd{font-size:11px;text-align:center;color:var(--text-secondary);padding:4px 0}
#urppp-clean-root .uc-week .sec{font-size:10px;color:var(--text-muted);display:flex;align-items:center;justify-content:center}
#urppp-clean-root .uc-cell{min-height:52px;border-radius:10px;background:var(--input-bg);border:1px solid transparent;padding:4px;overflow:hidden}
#urppp-clean-root .uc-lesson{background:color-mix(in srgb,var(--primary) 14%,var(--surface));border:1px solid color-mix(in srgb,var(--primary) 22%,var(--border));border-radius:8px;padding:4px 5px;margin-bottom:3px;cursor:pointer}
#urppp-clean-root .uc-lesson b{display:block;font-size:11px;line-height:1.25;color:var(--text);font-weight:700}
#urppp-clean-root .uc-lesson i{display:block;font-style:normal;font-size:10px;color:var(--text-secondary);margin-top:2px}
#urppp-clean-root .uc-score-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#urppp-clean-root .uc-score-pane{border:1px solid var(--border);border-radius:14px;padding:12px;cursor:pointer;background:var(--input-bg);transition:transform .15s,box-shadow .15s}
#urppp-clean-root .uc-score-pane:hover{transform:translateY(-1px);box-shadow:0 6px 16px var(--ring,rgba(0,0,0,.08))}
#urppp-clean-root .uc-score-pane h5{margin:0 0 10px;font-size:13px}
#urppp-clean-root .uc-metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#urppp-clean-root .uc-metric{background:var(--surface);border-radius:10px;padding:8px;border:1px solid var(--border)}
#urppp-clean-root .uc-metric em{display:block;font-style:normal;font-size:10px;color:var(--text-muted);margin-bottom:2px}
#urppp-clean-root .uc-metric b{font-size:16px;font-weight:700;color:var(--text)}
#urppp-clean-root .uc-services{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#urppp-clean-root .uc-svc{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:14px;border-radius:14px;border:1px solid var(--border);background:var(--input-bg);cursor:pointer;text-align:left;color:var(--text)}
#urppp-clean-root .uc-svc:hover{border-color:var(--primary)}
#urppp-clean-root .uc-svc strong{font-size:13px}
#urppp-clean-root .uc-svc span{font-size:11px;color:var(--text-secondary)}
#urppp-clean-root .uc-mobile{display:none}
#urppp-clean-root .uc-tabbar{display:none}
#urppp-clean-root .uc-empty,#urppp-clean-root .uc-loading{padding:20px;text-align:center;color:var(--text-secondary);font-size:13px}
#urppp-clean-root .uc-mask{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:12010;display:none}
#urppp-clean-root .uc-mask.open{display:block}
#urppp-clean-root .uc-modal{position:fixed;z-index:12020;left:50%;top:50%;transform:translate(-50%,-50%);width:min(920px,94vw);max-height:86vh;background:var(--surface);border:1px solid var(--border);border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.2);display:none;flex-direction:column;overflow:hidden}
#urppp-clean-root .uc-modal.open{display:flex}
#urppp-clean-root .uc-modal-hd{padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;font-weight:700}
#urppp-clean-root .uc-modal-bd{padding:12px 14px;overflow:auto;flex:1}
#urppp-clean-root .uc-modal-ft{padding:10px 14px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;background:var(--input-bg)}
#urppp-clean-root table.uc-table{width:100%;border-collapse:collapse;font-size:12px}
#urppp-clean-root table.uc-table th,#urppp-clean-root table.uc-table td{padding:8px 6px;border-bottom:1px solid var(--border);text-align:left}
#urppp-clean-root table.uc-table th{color:var(--text-secondary);font-weight:600;position:sticky;top:0;background:var(--surface)}
#urppp-clean-root .uc-chip{display:inline-flex;gap:8px;flex-wrap:wrap}
#urppp-clean-root .uc-chip b{font-size:13px}
#urppp-clean-root .uc-note{font-size:11px;color:var(--text-muted);margin-top:8px}
#urppp-clean-root .uc-build-list{display:flex;flex-wrap:wrap;gap:8px}
#urppp-clean-root .uc-build-list button{border:1px solid var(--border);background:var(--input-bg);border-radius:10px;padding:8px 10px;cursor:pointer;color:var(--text);font-size:12px}
#urppp-clean-root .uc-build-list button:hover{border-color:var(--primary)}
#urppp-clean-root .uc-room-hint{font-size:12px;color:var(--text-secondary);line-height:1.6}
@media (max-width:900px){
  #urppp-clean-root .uc-desktop{display:none}
  #urppp-clean-root .uc-mobile{display:block;padding-bottom:70px}
  #urppp-clean-root .uc-tabbar{display:flex;position:fixed;left:0;right:0;bottom:0;height:56px;background:var(--surface);border-top:1px solid var(--border);z-index:12005;padding-bottom:env(safe-area-inset-bottom)}
  #urppp-clean-root .uc-tabbar button{flex:1;border:0;background:transparent;color:var(--text-secondary);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10px;cursor:pointer}
  #urppp-clean-root .uc-tabbar button.ac{color:var(--primary);font-weight:700}
  #urppp-clean-root .uc-score-grid{grid-template-columns:1fr}
  #urppp-clean-root .uc-services{grid-template-columns:1fr}
  #urppp-clean-root .uc-modal{width:100vw;height:100vh;max-height:100vh;left:0;top:0;transform:none;border-radius:0}
  #urppp-clean-root .uc-week{min-width:0;grid-template-columns:28px repeat(7,minmax(42px,1fr))}
}
html.urppp-clean-lock,html.urppp-clean-lock body{overflow:hidden !important}
#urppp-nav-clean{margin-left:8px;height:28px;padding:0 10px;border-radius:8px;border:1px solid var(--border);background:var(--input-bg);color:var(--text);font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
#urppp-nav-clean:hover{border-color:var(--primary);color:var(--primary)}
#urppp-nav-clean svg{width:14px;height:14px}
`;
    (document.head || document.documentElement).appendChild(st);
  }

  function root() {
    return document.getElementById('urppp-clean-root');
  }

  function ensureRoot() {
    ensureStyle();
    let el = root();
    if (el) return el;
    el = document.createElement('div');
    el.id = 'urppp-clean-root';
    el.innerHTML = `
      <div class="uc-top">
        <div class="uc-brand"><span class="uc-ico">${icon('clean')}</span><span>清爽模式</span></div>
        <div class="uc-top-actions">
          <button type="button" class="uc-btn" id="uc-refresh"><span class="uc-ico">${icon('refresh')}</span>刷新</button>
          <button type="button" class="uc-btn primary" id="uc-exit"><span class="uc-ico">${icon('exit')}</span>退出</button>
        </div>
      </div>
      <div class="uc-body" id="uc-body"></div>
      <div class="uc-tabbar" id="uc-tabbar">
        <button type="button" data-tab="home" class="ac"><span class="uc-ico">${icon('home')}</span>首页</button>
        <button type="button" data-tab="scores"><span class="uc-ico">${icon('score')}</span>成绩</button>
        <button type="button" data-tab="room"><span class="uc-ico">${icon('room')}</span>教室</button>
        <button type="button" data-tab="more"><span class="uc-ico">${icon('more')}</span>其他</button>
      </div>
      <div class="uc-mask" id="uc-mask"></div>
      <div class="uc-modal" id="uc-modal">
        <div class="uc-modal-hd"><span id="uc-modal-title">详情</span><button type="button" class="uc-btn" id="uc-modal-close"><span class="uc-ico">${icon('close')}</span></button></div>
        <div class="uc-modal-bd" id="uc-modal-body"></div>
        <div class="uc-modal-ft" id="uc-modal-ft"></div>
      </div>
    `;
    document.documentElement.appendChild(el);
    el.querySelector('#uc-exit').onclick = closeCleanMode;
    el.querySelector('#uc-refresh').onclick = () => openCleanMode(true);
    el.querySelector('#uc-mask').onclick = closeModal;
    el.querySelector('#uc-modal-close').onclick = closeModal;
    el.querySelectorAll('#uc-tabbar button').forEach((btn) => {
      btn.onclick = () => {
        state.mobileTab = btn.dataset.tab;
        el.querySelectorAll('#uc-tabbar button').forEach((b) => b.classList.toggle('ac', b === btn));
        render();
      };
    });
    return el;
  }

  function metricHtml(s) {
    s = s || summarizeCourses([]);
    const items = [
      ['总学分', s.totalCredit],
      ['平均绩点', s.avgGpa],
      ['平均成绩', s.avgScore],
      ['必修学分', s.requiredCredit],
      ['必修绩点', s.requiredGpa],
      ['必修平均', s.requiredAvg]
    ];
    return `<div class="uc-metrics">${items.map(([k, v]) => `<div class="uc-metric"><em>${k}</em><b>${v}</b></div>`).join('')}</div>`;
  }

  function renderScheduleBoard(courses) {
    const by = {};
    (courses || []).forEach((c) => {
      const key = c.day + '_' + c.section;
      if (!by[key]) by[key] = [];
      by[key].push(c);
    });
    const maxSec = 12;
    let html = '<div class="uc-week"><div class="hd"></div>';
    for (let d = 0; d < 7; d++) html += `<div class="hd">${DAY_NAMES[d]}</div>`;
    for (let s = 1; s <= maxSec; s++) {
      html += `<div class="sec">${s}</div>`;
      for (let d = 0; d < 7; d++) {
        const list = by[d + '_' + s] || [];
        html += '<div class="uc-cell">';
        list.forEach((c) => {
          html += `<div class="uc-lesson" title="${escapeHtml(c.name)}"><b>${escapeHtml(c.name)}</b><i>${escapeHtml(c.place || c.week || '')}</i></div>`;
        });
        html += '</div>';
      }
    }
    html += '</div>';
    return html;
  }

  function todayCourses(courses) {
    const day = new Date().getDay(); // 0 sun
    return (courses || []).filter((c) => c.day === day).sort((a, b) => a.section - b.section);
  }

  function renderTodayList(courses) {
    const list = todayCourses(courses);
    if (!list.length) return '<div class="uc-empty">今日暂无课程</div>';
    return list.map((c) => `
      <div class="uc-lesson" style="margin-bottom:8px;padding:10px">
        <b style="font-size:14px">第${c.section}节 · ${escapeHtml(c.name)}</b>
        <i>${escapeHtml([c.place, c.teacher, c.week].filter(Boolean).join(' · '))}</i>
      </div>
    `).join('');
  }

  function servicesHtml() {
    const items = [
      { key: 'room', title: '空闲教室', desc: '选楼查看节次占用', icon: 'room', action: 'room' },
      { key: 'eval', title: '教学评估', desc: '进入评教', icon: 'eval', href: '/student/teachingEvaluation/newEvaluation/index' },
      { key: 'plan', title: '培养方案', desc: '方案与修读情况', icon: 'plan', href: '/student/comprehensiveQuery/search/trainProgram/index' },
      { key: 'apply1', title: '补办学生证', desc: '可申请业务', icon: 'apply', href: '/student/application/index' },
      { key: 'apply2', title: '免修申请', desc: '可申请业务', icon: 'apply', href: '/student/application/index' },
      { key: 'apply3', title: '替代课申请', desc: '可申请业务', icon: 'apply', href: '/student/application/index' },
      { key: 'apply4', title: '补办火车票优惠卡', desc: '可申请业务', icon: 'apply', href: '/student/application/index' }
    ];
    return `<div class="uc-services">${items.map((it) => `
      <button type="button" class="uc-svc" data-action="${it.action || ''}" data-href="${it.href || ''}">
        <span class="uc-ico">${icon(it.icon)}</span>
        <strong>${it.title}</strong>
        <span>${it.desc}</span>
      </button>
    `).join('')}</div>`;
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderDesktop() {
    const p = state.profile || {};
    const courses = (state.schedule && state.schedule.courses) || [];
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { summary: summarizeCourses([]), courses: [] };
    const schemes = (state.scores && state.scores.schemes) || [];
    const scheme = schemes[state.activeSchemeIdx] || schemes[0] || { summary: summarizeCourses([]), title: '方案成绩', courses: [] };
    const avatar = p.avatar
      ? `<img src="${escapeHtml(p.avatar)}" alt="">`
      : `<span>${escapeHtml((p.name || '同')[0])}</span>`;

    return `
      <div class="uc-desktop">
        <div class="uc-left">
          <div class="uc-card">
            <div class="uc-card-bd">
              <div class="uc-profile">
                <div class="uc-avatar">${avatar}</div>
                <div>
                  <div class="uc-name">${escapeHtml(p.name || '同学')}</div>
                  <div class="uc-sub">主修方案：${escapeHtml(p.majorPlan || '—')}</div>
                  <div class="uc-gpa">主修必修绩点 ${escapeHtml(p.majorGpa || '—')}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="uc-card uc-sched">
            <div class="uc-card-hd"><span><span class="uc-ico">${icon('schedule')}</span> 本周课表</span><span class="uc-sub">${courses.length ? courses.length + ' 个课次' : ''}</span></div>
            <div class="uc-card-bd">${state.loading.schedule ? '<div class="uc-loading">课表加载中…</div>' : renderScheduleBoard(courses)}</div>
          </div>
        </div>
        <div class="uc-left">
          <div class="uc-card">
            <div class="uc-card-hd"><span><span class="uc-ico">${icon('score')}</span> 成绩总览</span><span class="uc-sub">点击查看明细/计算</span></div>
            <div class="uc-card-bd">
              ${state.loading.scores ? '<div class="uc-loading">成绩加载中…</div>' : `
              <div class="uc-score-grid">
                <div class="uc-score-pane" data-score="passing">
                  <h5>全部及格成绩</h5>
                  ${metricHtml(pass.summary)}
                </div>
                <div class="uc-score-pane" data-score="scheme">
                  <h5>${escapeHtml((scheme.title || '方案成绩').split(/通过|获得|不通过/)[0].trim() || '方案成绩')}</h5>
                  ${metricHtml(scheme.summary)}
                </div>
              </div>
              <div class="uc-note">计算规则：百分制绩点=分数/10−5（上限4.0，及格最低1.0，不及格0）；优秀4.0/良好3.0/中等2.0/及格1.0；加权平均分与平均学分绩点按学分加权。弹窗内可勾选课程本地估算。</div>
              `}
            </div>
          </div>
          <div class="uc-card" style="flex:1">
            <div class="uc-card-hd"><span><span class="uc-ico">${icon('more')}</span> 服务</span></div>
            <div class="uc-card-bd">${servicesHtml()}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderMobile() {
    const p = state.profile || {};
    const courses = (state.schedule && state.schedule.courses) || [];
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { summary: summarizeCourses([]) };
    const schemes = (state.scores && state.scores.schemes) || [];
    const scheme = schemes[state.activeSchemeIdx] || schemes[0] || { summary: summarizeCourses([]), title: '方案成绩' };
    const avatar = p.avatar ? `<img src="${escapeHtml(p.avatar)}" alt="">` : `<span>${escapeHtml((p.name || '同')[0])}</span>`;
    if (state.mobileTab === 'scores') {
      return `<div class="uc-mobile">
        <div class="uc-card" style="margin-bottom:12px"><div class="uc-card-bd">
          <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${metricHtml(pass.summary)}</div>
          <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${metricHtml(scheme.summary)}</div>
          <div class="uc-note">点击卡片查看明细并勾选计算</div>
        </div></div>
      </div>`;
    }
    if (state.mobileTab === 'room') {
      return `<div class="uc-mobile"><div class="uc-card"><div class="uc-card-hd">教室查询</div><div class="uc-card-bd" id="uc-mobile-room">${roomPanelHtml()}</div></div></div>`;
    }
    if (state.mobileTab === 'more') {
      return `<div class="uc-mobile"><div class="uc-card"><div class="uc-card-bd">${servicesHtml()}</div></div></div>`;
    }
    // home
    return `<div class="uc-mobile">
      <div class="uc-card" style="margin-bottom:12px"><div class="uc-card-bd">
        <div class="uc-profile">
          <div class="uc-avatar">${avatar}</div>
          <div>
            <div class="uc-name">${escapeHtml(p.name || '同学')}</div>
            <div class="uc-sub">${escapeHtml(p.majorPlan || '')}</div>
            <div class="uc-gpa">主修必修绩点 ${escapeHtml(p.majorGpa || '—')}</div>
          </div>
        </div>
      </div></div>
      <div class="uc-card"><div class="uc-card-hd">今日课表</div><div class="uc-card-bd">
        ${state.loading.schedule ? '<div class="uc-loading">加载中…</div>' : renderTodayList(courses)}
        <div style="margin-top:12px">${state.loading.schedule ? '' : renderScheduleBoard(courses)}</div>
      </div></div>
    </div>`;
  }

  function roomPanelHtml() {
    const groups = state.buildings || [];
    if (state.loading.room) return '<div class="uc-loading">楼栋加载中…</div>';
    if (!groups.length) {
      return `<div class="uc-room-hint">
        未能解析教学楼列表。你仍可前往完整页面查询：
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="uc-btn primary" data-href="/student/teachingResources/freeClassroom/index">空闲教室</button>
          <button type="button" class="uc-btn" data-href="/student/teachingResources/classroomUseStatus/index">教室使用状况</button>
          <button type="button" class="uc-btn" data-href="/student/teachingResources/freeClassroom/today">今日空闲</button>
        </div>
      </div>`;
    }
    return groups.map((g) => `
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin-bottom:8px">${escapeHtml(g.campus)}</div>
        <div class="uc-build-list">
          ${g.buildings.map((b) => `<button type="button" data-building="${escapeHtml(b.name)}">${escapeHtml(b.name)}</button>`).join('')}
        </div>
      </div>
    `).join('') + `<div class="uc-note">点击楼栋将打开官方教室页（带清爽入口保留）。完整节次网格将在接口对齐后增强为同窗网格。</div>
    <div style="margin-top:8px"><button type="button" class="uc-btn" data-href="/student/teachingResources/classroomUseStatus/index">打开教室使用状况</button></div>`;
  }

  function render() {
    const el = ensureRoot();
    const body = el.querySelector('#uc-body');
    const isMobile = window.matchMedia && window.matchMedia('(max-width:900px)').matches;
    body.innerHTML = isMobile ? renderMobile() : renderDesktop();
    bindDynamic(body);
  }

  function bindDynamic(scope) {
    scope.querySelectorAll('[data-score]').forEach((pane) => {
      pane.addEventListener('click', () => openScoreModal(pane.getAttribute('data-score')));
    });
    scope.querySelectorAll('[data-href]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('data-href');
        if (!href) return;
        e.preventDefault();
        closeCleanMode();
        location.href = href;
      });
    });
    scope.querySelectorAll('[data-action="room"]').forEach((btn) => {
      btn.addEventListener('click', () => openRoomModal());
    });
    scope.querySelectorAll('[data-building]').forEach((btn) => {
      btn.addEventListener('click', () => {
        // jump to official classroom use status with hint
        closeCleanMode();
        location.href = '/student/teachingResources/classroomUseStatus/index';
      });
    });
  }

  function openModal(title, bodyHtml, ftHtml) {
    const el = ensureRoot();
    el.querySelector('#uc-mask').classList.add('open');
    const modal = el.querySelector('#uc-modal');
    modal.classList.add('open');
    el.querySelector('#uc-modal-title').textContent = title;
    el.querySelector('#uc-modal-body').innerHTML = bodyHtml;
    el.querySelector('#uc-modal-ft').innerHTML = ftHtml || '';
  }

  function closeModal() {
    const el = root();
    if (!el) return;
    el.querySelector('#uc-mask').classList.remove('open');
    el.querySelector('#uc-modal').classList.remove('open');
  }

  function openScoreModal(kind) {
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { courses: [], summary: summarizeCourses([]) };
    const schemes = (state.scores && state.scores.schemes) || [];
    const scheme = schemes[state.activeSchemeIdx] || schemes[0] || { courses: [], summary: summarizeCourses([]), title: '方案成绩' };
    const pack = kind === 'scheme' ? scheme : pass;
    const key = kind === 'scheme' ? 'scheme' : 'passing';
    if (!state.selected[key]) state.selected[key] = new Set();

    const schemeSwitcher = kind === 'scheme' && schemes.length > 1
      ? `<div style="margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap">${schemes.map((s, i) =>
        `<button type="button" class="uc-btn ${i === state.activeSchemeIdx ? 'primary' : ''}" data-scheme-idx="${i}">${escapeHtml((s.title || '方案').slice(0, 24))}</button>`
      ).join('')}</div>`
      : '';

    const rows = (pack.courses || []).map((c, idx) => {
      const id = key + '_' + idx;
      const checked = state.selected[key].has(idx) ? 'checked' : '';
      return `<tr>
        <td><input type="checkbox" data-idx="${idx}" ${checked}></td>
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.attr || '')}</td>
        <td>${c.credit}</td>
        <td>${escapeHtml(c.score)}</td>
        <td>${scoreToGpa(c.score) == null ? '—' : scoreToGpa(c.score)}</td>
      </tr>`;
    }).join('');

    const body = `
      ${schemeSwitcher}
      ${metricHtml(pack.summary)}
      <div class="uc-note">列表绩点按川大规则本地换算；勾选后底部显示已选课程的学分/均分/绩点。</div>
      <div style="margin-top:10px;overflow:auto;max-height:45vh">
        <table class="uc-table">
          <thead><tr><th></th><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="6">暂无课程数据</td></tr>'}</tbody>
        </table>
      </div>
    `;
    openModal(kind === 'scheme' ? '方案成绩' : '全部及格成绩', body, `<div class="uc-chip" id="uc-calc-chip">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear-sel">清空选择</button>`);

    const modalBody = document.querySelector('#uc-modal-body');
    const ft = document.querySelector('#uc-calc-chip');
    const syncCalc = () => {
      const selected = [];
      state.selected[key] = new Set();
      modalBody.querySelectorAll('input[type=checkbox][data-idx]').forEach((ck) => {
        if (ck.checked) {
          const i = parseInt(ck.getAttribute('data-idx'), 10);
          state.selected[key].add(i);
          if (pack.courses[i]) selected.push(pack.courses[i]);
        }
      });
      const sum = summarizeCourses(selected);
      if (ft) {
        ft.innerHTML = selected.length
          ? `已选 <b>${selected.length}</b> 门 · 学分 <b>${sum.totalCredit}</b> · 均分 <b>${sum.avgScore}</b> · 绩点 <b>${sum.avgGpa}</b>`
          : '已选 0 门';
      }
    };
    modalBody.querySelectorAll('input[type=checkbox][data-idx]').forEach((ck) => ck.addEventListener('change', syncCalc));
    modalBody.querySelectorAll('[data-scheme-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeSchemeIdx = parseInt(btn.getAttribute('data-scheme-idx'), 10) || 0;
        openScoreModal('scheme');
      });
    });
    const clearBtn = document.getElementById('uc-clear-sel');
    if (clearBtn) clearBtn.onclick = () => {
      modalBody.querySelectorAll('input[type=checkbox]').forEach((ck) => { ck.checked = false; });
      syncCalc();
    };
    syncCalc();
  }

  async function openRoomModal() {
    openModal('空闲教室', '<div class="uc-loading">加载教学楼…</div>', '');
    if (!state.buildings) {
      state.loading.room = true;
      state.buildings = await loadClassroomBuildings();
      state.loading.room = false;
    }
    openModal('空闲教室', roomPanelHtml(), `<button type="button" class="uc-btn" data-href="/student/teachingResources/freeClassroom/today">今日空闲页</button>`);
    const body = document.querySelector('#uc-modal-body');
    const ft = document.querySelector('#uc-modal-ft');
    bindDynamic(body);
    if (ft) bindDynamic(ft);
  }

  async function loadAll(force) {
    if (force) {
      state.profile = null;
      state.schedule = null;
      state.scores = null;
      state.buildings = null;
    }
    state.loading.profile = true;
    state.loading.schedule = true;
    state.loading.scores = true;
    render();
    try {
      const [profile, schedule, scores] = await Promise.all([
        state.profile && !force ? state.profile : loadProfile(),
        state.schedule && !force ? state.schedule : loadSchedule(),
        state.scores && !force ? state.scores : loadScores()
      ]);
      state.profile = profile;
      state.schedule = schedule;
      state.scores = scores;
    } finally {
      state.loading.profile = false;
      state.loading.schedule = false;
      state.loading.scores = false;
      render();
    }
  }

  function openCleanMode(forceReload) {
    ensureRoot();
    state.open = true;
    document.documentElement.classList.add('urppp-clean-lock');
    document.documentElement.classList.add(CLEAN_FLAG);
    root().classList.add('open');
    loadAll(!!forceReload);
  }

  function closeCleanMode() {
    state.open = false;
    closeModal();
    document.documentElement.classList.remove('urppp-clean-lock');
    document.documentElement.classList.remove(CLEAN_FLAG);
    const el = root();
    if (el) el.classList.remove('open');
  }

  function injectCleanEntry() {
    try {
      if (document.getElementById('urppp-nav-clean')) return;
      const host = document.getElementById('urppp-nav-theme') ||
        document.querySelector('#navbar .navbar-header') ||
        document.querySelector('#navbar');
      if (!host) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'urppp-nav-clean';
      btn.title = '清爽模式';
      btn.innerHTML = `${icon('clean')}<span>清爽</span>`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCleanMode(false);
      });
      host.appendChild(btn);
    } catch (err) {
      console.warn('[URP++] clean entry inject failed', err);
    }
  }

  // public API on window for main script hooks
  window.__urpppCleanMode = {
    open: openCleanMode,
    close: closeCleanMode,
    inject: injectCleanEntry,
    scoreToGpa,
    summarizeCourses
  };

  // auto inject when possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(injectCleanEntry, 300));
  } else {
    setTimeout(injectCleanEntry, 300);
  }
  // retry (navbar rebuilt async)
  ;[800, 1600, 3000].forEach((ms) => setTimeout(injectCleanEntry, ms));
})();
