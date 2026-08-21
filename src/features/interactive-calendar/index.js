/**
 * @file 互动校历：读取校历事件 → 时间线 → 多形态展示（清爽模式简略块 + 详细窗口 + 顶栏入口）
 * 数据基于川大 2026-2027 学年官方校历（jwc.scu.edu.cn），农历由 zhdate 离线核验固化。
 */
const CAL_TERMS = {
  autumn: {
    name: '秋季学期', weeks: 26, start: '2026-08-31', end: '2027-02-20',
    events: [
      { t: 'reg', name: '本科生新生报到', start: '2026-08-24', end: '2026-08-25' },
      { t: 'reg', name: '在校生报到', start: '2026-08-27', end: '2026-08-28' },
      { t: 'reg', name: '研究生新生报到', start: '2026-08-27', end: '2026-08-28' },
      { t: 'reg', name: '在校本科补缓考', start: '2026-08-28', end: '2026-08-30' },
      { t: 'term', name: '本科生开学典礼', start: '2026-09-01' },
      { t: 'term', name: '研究生开学典礼', start: '2026-09-04' },
      { t: 'term', name: '在校生正式行课', start: '2026-08-31', end: '2026-09-06' },
      { t: 'holiday', name: '中秋节', start: '2026-09-25' },
      { t: 'holiday', name: '国庆节假期', start: '2026-10-01', end: '2026-10-07' },
      { t: 'sport', name: '校秋季田径运动会', start: '2026-10-23', end: '2026-10-24' },
      { t: 'exam', name: '本科生期末集中考试周', start: '2027-01-04', end: '2027-01-15' },
      { t: 'holiday', name: '寒假', start: '2027-01-18', end: '2027-02-20' },
      { t: 'holiday', name: '春节', start: '2027-02-06' },
    ],
  },
  spring: {
    name: '春季学期', weeks: 18, start: '2027-03-01', end: '2027-07-03',
    events: [
      { t: 'reg', name: '在校生报到', start: '2027-02-25', end: '2027-02-26' },
      { t: 'term', name: '正式行课', start: '2027-03-01', end: '2027-03-07' },
      { t: 'holiday', name: '清明节', start: '2027-04-05' },
      { t: 'holiday', name: '劳动节假期', start: '2027-05-01', end: '2027-05-05' },
      { t: 'holiday', name: '端午节', start: '2027-06-09' },
      { t: 'exam', name: '期末集中考试', start: '2027-06-21', end: '2027-06-27' },
      { t: 'term', name: '毕业典礼', start: '2027-06-25' },
      { t: 'holiday', name: '暑假开始', start: '2027-07-04' },
    ],
  },
};

const CAL_LUNAR = {
  '2026-08-24': '农历七月十二', '2026-08-25': '农历七月十三', '2026-08-27': '农历七月十五',
  '2026-08-28': '农历七月十六', '2026-08-30': '农历七月十八', '2026-08-31': '农历七月十九',
  '2026-09-01': '农历七月二十', '2026-09-04': '农历七月廿三', '2026-09-25': '农历八月十五',
  '2026-10-01': '农历八月廿一', '2026-10-07': '农历八月廿七', '2026-10-23': '农历九月十四',
  '2026-10-24': '农历九月十五', '2027-01-04': '农历冬月廿七', '2027-01-15': '农历腊月初八',
  '2027-01-18': '农历腊月十一', '2027-02-06': '农历正月初一', '2027-02-20': '农历正月十五',
  '2027-02-25': '农历正月二十', '2027-02-26': '农历正月廿一', '2027-03-01': '农历正月廿四',
  '2027-04-05': '农历二月廿九', '2027-05-01': '农历三月廿五', '2027-05-05': '农历三月廿九',
  '2027-06-09': '农历五月初五', '2027-06-21': '农历五月十七', '2027-06-25': '农历五月廿一',
  '2027-06-27': '农历五月廿三', '2027-07-03': '农历五月廿九', '2027-07-04': '农历六月初一',
};

const CAL_TYPE_META = {
  term: { color: '#44616f', label: '教学/开学' },
  reg: { color: '#8a74bd', label: '报到' },
  exam: { color: '#c08a3f', label: '考试周' },
  holiday: { color: '#d0716a', label: '假期' },
  sport: { color: '#778e63', label: '运动会' },
};

function calToday() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function calDayDiff(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}
function calWeekNo(termId, date) {
  const p = calDayDiff(CAL_TERMS[termId].start, date);
  return p < 0 ? 0 : Math.floor(p / 7) + 1;
}
function calLunar(date) { return CAL_LUNAR[date] || ''; }
function calYY(s) { return String(s || '').slice(5); }

/** 当前应展示的学期：8 月中旬到次年 2 月为秋季，之后到 7 月为春季 */
function calActiveTerm(today) {
  const t = today || calToday();
  const [y, m] = t.split('-').map(Number);
  const isAutumn = (m === 8 && t >= '2026-08-15') || (m >= 9) || (m <= 2);
  return isAutumn ? 'autumn' : 'spring';
}

/** 下一个事件（今天之后或正在进行）及其倒计时、学期进度 */
function calStatus(termId, today) {
  const tid = termId && CAL_TERMS[termId] ? termId : 'autumn';
  const T = CAL_TERMS[tid];
  const now = today || calToday();
  const next = T.events
    .map((e) => ({ e, d: calDayDiff(now, e.start) }))
    .filter((o) => o.d >= -0) // 今天起（含今天已开始的）
    .sort((a, b) => a.d - b.d)[0];
  const daysLeft = next ? calDayDiff(now, next.e.start) : null;
  const weekNo = calWeekNo(tid, now);
  const progress = Math.max(0, Math.min(100, (weekNo / T.weeks) * 100));
  const started = now >= T.start;
  return { term: T, termId: tid, next, daysLeft, weekNo, progress, started, today: now };
}

/** 入口①：清爽模式个人资料卡右侧的简略信息块 */
function calendarSummaryHtml(termId, today) {
  const st = calStatus(termId, today);
  const dot = st.next ? CAL_TYPE_META[st.next.e.t].color : '#c9cdd4';
  const tl = st.term;
  return `<button type="button" class="uc-cal-summary" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-s-left">
      <span class="cal-s-count">${st.daysLeft == null ? '—' : st.daysLeft}</span>
      <span class="cal-s-unit">天后</span>
    </span>
    <span class="cal-s-right">
      <span class="cal-s-wk">${st.started ? `第 ${st.weekNo} 周` : '尚未开学'} · ${st.term.name}</span>
      <span class="cal-s-ev"><i style="background:${dot}"></i>${st.next ? st.next.e.name : '学期已结束'}</span>
      <span class="cal-s-date">${st.next ? st.next.e.start + (st.next.e.end && st.next.e.end !== st.next.e.start ? '~' + st.next.e.end.slice(5) : '') : ''}</span>
      <span class="cal-s-prog"><span>本学期进度</span><span>${Math.min(st.weekNo, tl.weeks)}/${tl.weeks} 周</span></span>
      <span class="cal-s-bar"><i style="width:${st.progress}%"></i></span>
    </span>
  </button>`;
}

/** 入口①移动端紧凑版：单行有层次（倒计时数字 + 事件名/学期 + 进度条/周次），不换行 */
function calendarSummaryCompactHtml(termId, today) {
  const st = calStatus(termId, today);
  const dot = st.next ? CAL_TYPE_META[st.next.e.t].color : '#c9cdd4';
  return `<button type="button" class="uc-cal-summary uc-cal-summary-compact" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-c-dot" style="background:${dot}"></span>
    <span class="cal-c-count"><b>${st.daysLeft == null ? '—' : st.daysLeft}</b><em>天后</em></span>
    <span class="cal-c-info">
      <span class="cal-c-name">${st.next ? st.next.e.name : '学期已结束'}</span>
      <span class="cal-c-sub">${st.started ? `第 ${st.weekNo} 周` : '尚未开学'} · ${st.term.name}</span>
    </span>
    <span class="cal-c-prog"><span class="cal-c-bar"><i style="width:${st.progress}%"></i></span><span class="cal-c-week">本学期进度 ${Math.min(st.weekNo, st.term.weeks)}/${st.term.weeks} 周</span></span>
  </button>`;
}

/** 详细窗口内容：横置倒计时小组件（上）+ 完整时间线（下） */
function calendarModalHtml(termId, today) {
  const st = calStatus(termId, today);
  const dot = st.next ? CAL_TYPE_META[st.next.e.t].color : '#c9cdd4';
  const T = st.term;
  const termPills = Object.keys(CAL_TERMS).map((id) =>
    `<button type="button" class="cal-term${id === st.termId ? ' ac' : ''}" data-cal-term="${id}">${CAL_TERMS[id].name}</button>`).join('');
  // 上：横置小组件
  const widget = `<div class="cal-widget">
    <div class="cal-w-left">
      <div class="cal-w-label">下一个事件</div>
      <div class="cal-w-ev"><i style="background:${dot}"></i><b>${st.next ? st.next.e.name : '学期已结束'}</b></div>
      <div class="cal-w-sub">${st.next ? st.next.e.start + (st.next.e.end && st.next.e.end !== st.next.e.start ? ' ~ ' + st.next.e.end : '') : ''}${st.next && calLunar(st.next.e.start) ? ' · ' + calLunar(st.next.e.start) : ''}</div>
    </div>
    <div class="cal-w-mid">
      <span class="cal-w-num">${st.daysLeft == null ? '—' : st.daysLeft}</span><span class="cal-w-unit">天</span>
    </div>
    <div class="cal-w-right">
      <div class="cal-w-wk">${st.started ? `第 ${st.weekNo} 周` : '尚未开学'}</div>
      <div class="cal-w-prog">
        <div class="cal-w-prog-lbl"><span>本学期进度</span><span>${Math.min(st.weekNo, T.weeks)} / ${T.weeks} 周</span></div>
        <div class="cal-w-prog-bar"><i style="width:${st.progress}%"></i></div>
      </div>
    </div>
  </div>`;
  // 下：完整时间线（月度分段 + 事件）
  const sorted = T.events.slice().sort((a, b) => (a.start < b.start ? -1 : 1));
  const groups = {};
  sorted.forEach((e) => { (groups[e.start.slice(0, 7)] = groups[e.start.slice(0, 7)] || []).push(e); });
  const todayFlag = (d) => (d === st.today ? ' cal-today' : '');
  const months = Object.keys(groups).map((mo) => {
    const [, mm] = mo.split('-');
    return `<div class="cal-mon">
      <div class="cal-mon-label">${Number(mm)} 月</div>
      <div class="cal-mon-items">${groups[mo].map((e) => {
        const c = CAL_TYPE_META[e.t].color;
        const end = e.end && e.end !== e.start ? '~' + calYY(e.end) : '';
        const wk = calWeekNo(st.termId, e.start) > 0 ? `第 ${calWeekNo(st.termId, e.start)} 周` : '开学前';
        return `<div class="cal-ev${todayFlag(e.start)}">
          <span class="cal-ev-dot" style="background:${c}"></span>
          <span class="cal-ev-date">${calYY(e.start)}${end || ''}<em>${calLunar(e.start)||'&nbsp;'}</em></span>
          <span class="cal-ev-name">${e.name}</span>
          <span class="cal-ev-tag" style="color:${c};background:${c}1a">${CAL_TYPE_META[e.t].label}</span>
          <span class="cal-ev-wk">${wk}</span>
        </div>`;
      }).join('')}</div>
    </div>`;
  }).join('');
  return `<div class="cal-modal-wrap">
    <div class="cal-modal-top">
      <span class="cal-modal-title">校历时间线</span>
      <span class="cal-right"><span class="cal-term-pills">${termPills}</span><button type="button" class="cal-close" aria-label="关闭">✕</button></span>
    </div>
    ${widget}
    <div class="cal-timeline">${months}</div>
  </div>`;
}

/** 详细窗口浮层（自包含，独立于清爽 root） */
function openCalendarModal(termId, today) {
  const doc = (typeof document !== 'undefined') ? document : null;
  if (!doc) return;
  closeCalendarModal();
  const id = (termId && CAL_TERMS[termId]) ? termId : calActiveTerm(today);
  const el = doc.createElement('div');
  el.id = 'urppp-cal-modal';
  el.innerHTML = `<div class="cal-overlay"></div>
    <div class="cal-dialog"><div class="cal-body">${calendarModalHtml(id, today)}</div></div>`;
  doc.documentElement.appendChild(el);
  el.querySelector('.cal-overlay').addEventListener('click', () => closeCalendarModal());
  // 关闭 + 学期切换：事件委托到浮层容器，re-render 后新按钮仍有效
  el.addEventListener('click', (ev) => {
    const t = ev.target;
    if (t && t.closest && t.closest('.cal-close')) { closeCalendarModal(); return; }
    const tb = t && t.closest ? t.closest('[data-cal-term]') : null;
    if (tb) {
      const body = el.querySelector('.cal-body');
      if (body) body.innerHTML = calendarModalHtml(tb.dataset.calTerm, today);
      // 重渲染已按新学期标注 ac；这里再按 dataset 同步选中态，确保高亮正确
      el.querySelectorAll('[data-cal-term]').forEach((x) => x.classList.toggle('ac', x.dataset.calTerm === tb.dataset.calTerm));
    }
  });
}

function closeCalendarModal() {
  const doc = (typeof document !== 'undefined') ? document : null;
  if (!doc) return;
  const el = doc.getElementById('urppp-cal-modal');
  if (el) el.remove();
}

/** 全局点击委托：入口打开时调用（挂载在校历 root / 文档） */
function bindCalendarOpen(scopeEl, termId) {
  const node = scopeEl || (typeof document !== 'undefined' ? document : null);
  if (!node) return;
  node.addEventListener('click', (ev) => {
    const t = ev.target;
    const hit = t && t.closest ? t.closest('[data-urppp-cal-open]') : null;
    if (hit) {
      ev.preventDefault();
      ev.stopPropagation();
      openCalendarModal();
    }
  });
}

let calStyleInjected = false;
function ensureCalendarStyle() {
  const doc = (typeof document !== 'undefined') ? document : null;
  if (!doc || calStyleInjected) return calStyleInjected;
  try {
    const st = doc.createElement('style');
    if (st && st.id !== undefined) {
  st.id = 'urppp-cal-style';
  st.textContent = `
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
    #urppp-cal-modal .cal-dialog{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
      width:min(880px,calc(100vw - 40px));max-height:min(82vh,860px);overflow:auto;
      background:var(--surface,#fff);color:var(--text,#16181d);border:1px solid var(--border,#e5e5ea);border-radius:18px;
      box-shadow:0 24px 60px rgba(0,0,0,.28);padding:20px 24px 24px}
    #urppp-cal-modal .cal-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--border,#e5e5ea);background:transparent;color:var(--text,#16181d);cursor:pointer;font-size:14px;line-height:1;display:grid;place-items:center;flex:none}
    #urppp-cal-modal .cal-close:hover{background:color-mix(in srgb,var(--primary,#2563eb) 10%,transparent)}
    #urppp-cal-modal .cal-modal-wrap{display:flex;flex-direction:column;gap:16px}
    #urppp-cal-modal .cal-modal-top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
    #urppp-cal-modal .cal-modal-title{font-size:17px;font-weight:750}
    #urppp-cal-modal .cal-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    #urppp-cal-modal .cal-term-pills{display:flex;gap:6px}
    #urppp-cal-modal .cal-term{font-size:12px;padding:5px 13px;border-radius:999px;border:1px solid var(--border,#e5e5ea);background:transparent;color:var(--text-secondary,#5b5f69);cursor:pointer;font-weight:600;flex:none}
    #urppp-cal-modal .cal-term.ac{background:var(--primary,#2563eb);color:#fff;border-color:transparent}
    /* 横置小组件 */
    #urppp-cal-modal .cal-widget{display:flex;align-items:center;gap:22px;background:color-mix(in srgb,var(--primary,#2563eb) 5%,#fff);
      border:1px solid var(--border,#e5e5ea);border-radius:16px;padding:18px 22px;flex-wrap:wrap}
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
    /* 时间线：按月分组 */
    #urppp-cal-modal .cal-timeline{display:flex;flex-direction:column;gap:6px;margin-top:2px}
    #urppp-cal-modal .cal-mon{border-top:1px solid var(--border,#e5e5ea)}
    #urppp-cal-modal .cal-mon:first-child{border-top:0}
    #urppp-cal-modal .cal-mon-label{font-size:11px;font-weight:700;color:var(--text-secondary,#5b5f69);padding:12px 0 6px;letter-spacing:.05em}
    #urppp-cal-modal .cal-mon-items{display:flex;flex-direction:column}
    #urppp-cal-modal .cal-ev{display:flex;align-items:center;gap:12px;padding:9px 10px;border-radius:10px;transition:background .15s}
    #urppp-cal-modal .cal-ev:hover{background:color-mix(in srgb,var(--primary,#2563eb) 5%,transparent)}
    #urppp-cal-modal .cal-ev.cal-today{outline:2px solid color-mix(in srgb,var(--primary,#2563eb) 40%,transparent)}
    #urppp-cal-modal .cal-ev-dot{width:8px;height:8px;border-radius:50%;flex:none}
    #urppp-cal-modal .cal-ev-date{min-width:82px;font-size:13px;font-weight:650;font-variant-numeric:tabular-nums}
    #urppp-cal-modal .cal-ev-date em{display:block;font-style:normal;font-size:10px;color:var(--text-secondary,#5b5f69);font-weight:400}
    #urppp-cal-modal .cal-ev-name{flex:1;font-size:13.5px;font-weight:600}
    #urppp-cal-modal .cal-ev-tag{font-size:10.5px;font-weight:600;padding:1px 8px;border-radius:999px;flex:none}
    #urppp-cal-modal .cal-ev-wk{font-size:11px;color:var(--text-secondary,#5b5f69);flex:none;min-width:56px;text-align:right}
    /* 皮肤适配：随各主题保持一致性（圆角/边框/材质由 Skin token 控制） */
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
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-term,
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-close{border-radius:0!important;box-shadow:none!important;border:0!important;text-decoration-line:underline!important;text-decoration-color:transparent!important}
    html[data-urppp-skin="neu"] #urppp-clean-root .uc-cal-summary,
    html[data-urppp-skin="neu"] #urppp-cal-modal .cal-dialog{box-shadow:4px 4px 10px rgba(0,0,0,.08),-4px -4px 12px #fff!important}
    html[data-urppp-skin="neu"] #urppp-cal-modal .cal-term,
    html[data-urppp-skin="neu"] #urppp-cal-modal .cal-close{box-shadow:2px 2px 6px rgba(0,0,0,.08),-2px -2px 6px #fff!important}
    @media (max-width:560px){
      #urppp-cal-modal .cal-widget{gap:12px}
      #urppp-cal-modal .cal-dialog{padding:16px}
    }
  `;
      st.id = 'urppp-cal-style';
      const head = doc.head || doc.documentElement;
      if (head) head.appendChild(st);
      calStyleInjected = true;
    }
  } catch (_) { /* ignore */ }
  return calStyleInjected;
}

/** 模块初始化：注入样式 + 入口②（顶栏清爽按钮右侧校历按钮） */
function initCalendar({ doc, isHomePage = () => true } = {}) {
  const d = doc || (typeof document !== 'undefined' ? document : null);
  if (!d) return;
  ensureCalendarStyle();
  if (typeof isHomePage === 'function' && !isHomePage()) removeCalendarButton();
  else mountCalendarButton();
}

function mountCalendarButton() {
  const d = (typeof document !== 'undefined') ? document : null;
  if (!d) return;
  const host = d.getElementById('urppp-nav-theme')
    || (() => { const nh = d.querySelector('#navbar .navbar-header'); return nh; })()
    || d.getElementById('navbar');
  const ref = d.getElementById('urppp-nav-clean');
  let btn = d.getElementById('urppp-nav-cal');
  if (!host && !ref) return;
  const parent = (ref && ref.parentElement) || host;
  if (btn && btn.parentElement === parent) return;
  if (btn) btn.remove();
  btn = d.createElement('button');
  btn.type = 'button';
  btn.id = 'urppp-nav-cal';
  btn.title = '校历时间线';
  btn.setAttribute('aria-label', '校历时间线');
  btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg><span>校历</span>`;
  Object.entries({
    display: 'inline-flex', 'align-items': 'center', height: '28px', 'min-height': '28px', padding: '0 12px',
    'font-size': '12px', gap: '6px', width: 'auto', float: 'none', margin: '0 0 0 8px', 'vertical-align': 'middle',
  }).forEach(([k, v]) => btn.style.setProperty(k, v, 'important'));
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    openCalendarModal();
  });
  if (ref && ref.parentElement) ref.after(btn);
  else if (parent) parent.appendChild(btn);
}

function removeCalendarButton() {
  const d = (typeof document !== 'undefined') ? document : null;
  if (!d) return;
  const btn = d.getElementById('urppp-nav-cal');
  if (btn) btn.remove();
}

export {
  CAL_TERMS, CAL_LUNAR, calActiveTerm, calStatus, calendarSummaryHtml, calendarSummaryCompactHtml, calendarModalHtml,
  openCalendarModal, closeCalendarModal, bindCalendarOpen, ensureCalendarStyle, initCalendar,
  mountCalendarButton, removeCalendarButton,
};
