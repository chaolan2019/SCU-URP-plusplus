/**
 * @file 互动校历：读取校历事件 → 时间线 → 多形态展示（清爽模式简略块 + 详细窗口 + 顶栏入口）
 * 数据基于川大 2026-2027 学年官方校历（jwc.scu.edu.cn），农历由 zhdate 离线核验固化。
 */
// 校历数据（远程 JSON 加载；初始为空，加载成功后填充；加载失败不显示）
let CAL_TERMS = {};
let CAL_LUNAR = {};

// 校历数据源（多源回退；可通过外部覆盖 __urpppCalendarSources 指向本地源测试）
const CALENDAR_SOURCES = [
  'https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/calendar/calendar.json',
  'https://gitee.com/chaolan2026/SCU-URP-plusplus/raw/main/calendar/calendar.json',
  'https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/calendar/calendar.json',
];

// 远程拉取（GM 优先 + fetch 兜底；带超时与 no-store）
function calFetchJson(url, timeoutMs = 6000) {
  return new Promise((resolve) => {
    try {
      if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest({
          method: 'GET', url, timeout: timeoutMs, cache: 'no-store',
          onload: (r) => { try { resolve(JSON.parse((r && r.responseText) || 'null')); } catch (_) { resolve(null); } },
          onerror: () => resolve(null), ontimeout: () => resolve(null),
        });
        return;
      }
      fetch(url, { cache: 'no-store' }).then((r) => (r && r.ok ? r.json() : null)).then(resolve).catch(() => resolve(null));
    } catch (_) { resolve(null); }
  });
}

// 校历加载策略：缓存先行 + 后台自动刷新
// - 进页面先同步用 GM 缓存（有则立即显示，秒开），同时后台拉远程
// - 后台拉到新数据 → 覆盖缓存 + 刷新 UI（用户无需操作即自动更新）
// - 远程失败 → 保留缓存显示；无缓存 → 空态显示加载失败
// - 会话内每 CALENDAR_REFRESH_MS 自动再刷一次（长时间停留页面也能收到更新）
const CALENDAR_REFRESH_MS = 60 * 1000; // 60 秒：每次渲染校历都会检查，超 60s 自动后台刷新
function calCacheRead() {
  try {
    const raw = GM_getValue('urppp_calendar_cache', '');
    if (!raw) return null;
    const j = JSON.parse(raw);
    if (!j || !j.terms) return null;
    return j;
  } catch (_) { return null; }
}
function calCacheWrite(terms, lunar) {
  try { GM_setValue('urppp_calendar_cache', JSON.stringify({ terms, lunar, ts: Date.now() })); } catch (_) {}
}

let __calLoaded = false;      // 数据是否已填充（缓存或远程）
let __calLastRefresh = 0;     // 上次后台刷新时间（节流）
let __calLoading = null;
async function ensureCalendarData(onLoad, force) {
  if (force) { __calLoaded = false; __calLastRefresh = 0; }
  // 数据已填充：立即回调，并确保后台刷新（节流内跳过）
  if (__calLoaded) {
    try { if (onLoad) onLoad(); } catch (_) {}
    // 每次渲染都检查后台刷新（60s 节流内跳过），保证远程更新能及时拉回
    refreshCalendarData(onLoad);
    return;
  }
  // 首次：缓存先行（同步填充，秒开）
  const cached = calCacheRead();
  if (cached && cached.terms) {
    CAL_TERMS = cached.terms;
    CAL_LUNAR = cached.lunar || {};
    __calLoaded = true;
    try { if (onLoad) onLoad(); } catch (_) {}
  }
  // 后台刷新（拉远程更新）
  refreshCalendarData(onLoad);
}

// 后台刷新：拉远程，成功则更新数据+缓存+回调；失败静默（保留现有数据）
function refreshCalendarData(onLoad) {
  if (__calLoading) { __calLoading.then(() => { try { if (onLoad) onLoad(); } catch (_) {} }); return; }
  const now = Date.now();
  if (now - __calLastRefresh < CALENDAR_REFRESH_MS) return;
  __calLastRefresh = now;
  const sources = (typeof unsafeWindow !== 'undefined' && unsafeWindow.__urpppCalendarSources && unsafeWindow.__urpppCalendarSources.length)
    ? unsafeWindow.__urpppCalendarSources
    : CALENDAR_SOURCES;
  __calLoading = (async () => {
    let data = null;
    for (const url of sources) { data = await calFetchJson(url); if (data && data.terms) break; }
    if (data && data.terms) {
      const changed = !CAL_TERMS || JSON.stringify(CAL_TERMS) !== JSON.stringify(data.terms);
      CAL_TERMS = data.terms;
      CAL_LUNAR = data.lunar || {};
      calCacheWrite(CAL_TERMS, CAL_LUNAR);
      __calLoaded = true;
      if (changed) { try { if (onLoad) onLoad(); } catch (_) {} }
    }
    __calLoading = null;
  })();
  return __calLoading;
}

// 强制重载接口（本地源测试用）：切源后调用 __urpppCalendarReload()
if (typeof unsafeWindow !== 'undefined') {
  unsafeWindow.__urpppCalendarReload = async (onLoad) => {
    __calLoaded = false;
    __calLastRefresh = 0;
    await ensureCalendarData(onLoad, true);
  };
}
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
  const T = CAL_TERMS[termId];
  if (!T || !T.start) return 0;
  const p = calDayDiff(T.start, date);
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
  const tid = termId && CAL_TERMS[termId] ? termId : (CAL_TERMS.autumn ? 'autumn' : '');
  const T = tid ? CAL_TERMS[tid] : null;
  const now = today || calToday();
  if (!T || !T.events || !T.start || !T.weeks) {
    return { term: null, termId: tid, next: null, daysLeft: null, weekNo: 0, progress: 0, started: false, today: now, empty: true };
  }
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
  if (st.empty) {
    return '<button type="button" class="uc-cal-summary uc-cal-empty" data-urppp-cal-open aria-label="校历数据加载失败"><span class="cal-s-right"><span class="cal-s-wk">校历数据加载失败</span></span></button>';
  }
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
  if (st.empty) {
    return '<div class="uc-cal-empty-modal"><p>校历数据加载失败</p><p class="uc-cal-empty-sub">请检查网络后刷新重试</p></div>';
  }
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
  // 触发进入动画（淡入+缩放+内容逐条），用 setTimeout 确保在后台/headless 也能加 open 类
  setTimeout(() => el.classList.add('open'), 20);
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
  if (!el) return;
  // 退出动画：反向淡出缩放（与进入对称），播完再移除
  el.classList.remove('open');
  el.classList.add('closing');
  setTimeout(() => { el.remove(); }, 200);
}

/** 全局点击委托：入口打开时调用（挂载在校历 root / 文档）；带守卫防重复叠加 */
function bindCalendarOpen(scopeEl, termId) {
  const node = scopeEl || (typeof document !== 'undefined' ? document : null);
  if (!node) return;
  if (node.__urpppCalOpenBound) return;
  node.__urpppCalOpenBound = true;
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
function initCalendar({ doc, isHomePage = () => true, onLoad } = {}) {
  const d = doc || (typeof document !== 'undefined' ? document : null);
  if (!d) return;
  ensureCalendarStyle();
  if (typeof isHomePage === 'function' && !isHomePage()) removeCalendarButton();
  else mountCalendarButton();
  // 异步加载校历数据，完成后触发 onLoad（调用方刷新 UI）
  try { ensureCalendarData(onLoad); } catch (_) {}
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
  CAL_TERMS, CAL_LUNAR, CALENDAR_SOURCES, ensureCalendarData, calActiveTerm, calStatus, calendarSummaryHtml, calendarSummaryCompactHtml, calendarModalHtml,
  openCalendarModal, closeCalendarModal, bindCalendarOpen, ensureCalendarStyle, initCalendar,
  mountCalendarButton, removeCalendarButton,
};
