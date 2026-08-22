import { calendarSummaryHtml, calendarSummaryCompactHtml } from '../interactive-calendar/index.js';

export function createCleanModeRenderer({ state, deps }) {
  let cleanRenderFrame = 0;

  // 清爽模式图表配色：跟随全局主题 token
  const SA_PALETTE = {
    gpaLine: 'var(--primary)',
    scoreLine: 'var(--text-secondary)',
    credit: 'var(--primary)',
    primary: 'var(--primary)',
  };

  function metricHtml(summary, scope) {
    const s = summary || deps.summarizeCourses([]);
    const items = [
      ['TotalCredit', '总学分', s.totalCredit],
      ['AvgScore', '平均成绩', s.avgScore],
      ['AvgGpa', '平均绩点', s.avgGpa],
      ['RequiredCredit', '必修学分', s.requiredCredit],
      ['RequiredAvg', '必修平均', s.requiredAvg],
      ['RequiredGpa', '必修绩点', s.requiredGpa],
    ];
    return `<div class="uc-metrics">${items.map(([suffix, label, value]) => {
      const field = deps.classifyPrivacyLabel(label) || 'grade';
      const editKey = scope && deps.DIRECT_EDIT_LABELS[scope + suffix] ? ` data-urppp-edit-key="${scope + suffix}"` : '';
      return `<div class="uc-metric"><em>${label}</em><b data-urppp-private="${field}"${editKey}>${value}</b></div>`;
    }).join('')}</div>`;
  }

  // 清爽模式成绩分析：仅学期趋势 + 成绩分段两张图
  function analysisHtml() {
    const scorePack = state.scores;
    if (!scorePack || scorePack.error) {
      return `<div class="uc-sa-empty">${deps.escapeHtml((scorePack && scorePack.error) || '暂无成绩数据')}</div>`;
    }
    let analysis = null;
    try { analysis = deps.analyzeScores({ scorePack, profile: state.profile }); } catch (_) { /* ignore */ }
    if (!analysis || analysis.empty) {
      return '<div class="uc-sa-empty">暂无可用成绩数据，请先查询成绩后再试。</div>';
    }
    const chartLayout = typeof deps.scoreChartLayout === 'function' ? deps.scoreChartLayout() : null;
    return `<div class="uc-sa-charts">
      <div class="uc-sa-chart-card"><h5>学期趋势</h5><div class="uc-sa-chart-scroll">${deps.trendChartSvg({ trend: analysis.trend, palette: deps.scoreChartPalette || SA_PALETTE, layout: chartLayout })}</div></div>
      <div class="uc-sa-chart-card"><h5>成绩分段分布</h5><div class="uc-sa-chart-scroll">${deps.bandsChartSvg({ bands: analysis.bands, palette: deps.scoreChartPalette || SA_PALETTE, layout: chartLayout })}</div></div>
    </div>
    <div class="uc-sa-more-row"><a class="uc-sa-more" data-href="/student/integratedQuery/scoreQuery/allPassingScores/index?urppp=sa">点击此处跳转到详细分析界面 →</a></div>`;
  }

  // 成绩总览卡：标题位 tab（参考设置界面）。tab 模式标题栏为「成绩总览 | 成绩分析」，
  // direct 模式标题为「成绩总览」且分析与总览同屏。返回整卡内容（标题 + 正文）。
  function scoreSectionHtml(scoreBody) {
    const direct = !!deps.isCleanAnalysisDirect();
    const activeAnalysis = state.scoreAnalysisTab === 'analysis';
    if (direct) {
      return `<div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
  <div class="uc-bd">
    <div class="uc-sa-pane">${scoreBody}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis">${analysisHtml()}</div>
  </div>`;
    }
    return `<div class="uc-hd uc-hd-tabs" role="tablist">
    <button type="button" class="uc-sa-tab${activeAnalysis ? '' : ' ac'}" data-sa-tab="overview">成绩总览</button>
    <button type="button" class="uc-sa-tab${activeAnalysis ? ' ac' : ''}" data-sa-tab="analysis">成绩分析</button>
  </div>
  <div class="uc-bd">
    <div class="uc-sa-pane"${activeAnalysis ? ' hidden' : ''}>${scoreBody}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis"${activeAnalysis ? '' : ' hidden'}>${analysisHtml()}</div>
  </div>`;
  }

  function getScheduleRowHeight() {
    try {
      if (window.matchMedia && window.matchMedia('(max-width:900px)').matches) return 40;
    } catch (_) { /* ignore */ }
    return 56;
  }

  function renderScheduleBoard(courses) {
    const weekNo = deps.getViewWeekNumber();
    const ROW = getScheduleRowHeight();
    const CELL = Math.max(ROW - 4, 28);
    const list = (courses || []).map((c) => Object.assign({}, c, {
      thisWeek: deps.weekBitActive(c.classWeek, weekNo) || (!c.classWeek && String(c.week || '').indexOf(String(weekNo)) >= 0),
      span: Math.max(1, c.span || 1),
      color: c.color || deps.courseColor(c.name),
    }));
    // group by day+startSection
    const byStart = {};
    list.forEach((c) => {
      const key = c.day + '_' + c.section;
      (byStart[key] || (byStart[key] = [])).push(c);
    });
    let html = `<div class="uc-week" data-urppp-private="schedule" data-week="${weekNo}" data-row="${ROW}">`;
    html += '<div class="uc-week-head"><div class="h"></div>';
    for (let d = 0; d < 7; d++) html += `<div class="h">${deps.DAY_NAMES[d]}</div>`;
    html += '</div><div class="uc-week-body">';
    html += '<div class="uc-sec-col">';
    for (let section = 1; section <= 12; section++) html += `<div class="s" style="height:${ROW}px">${section}</div>`;
    html += '</div>';
    for (let d = 0; d < 7; d++) {
      html += `<div class="uc-day-col" data-day="${d}" style="height:${ROW * 12}px">`;
      for (let section = 1; section <= 12; section++) {
        html += `<div class="uc-grid-cell" data-sec="${section}" style="top:${(section - 1) * ROW}px;height:${CELL}px"></div>`;
      }
      html += `<div class="uc-part-line" style="top:${4 * ROW - 2}px"></div>`;
      html += `<div class="uc-part-line" style="top:${9 * ROW - 2}px"></div>`;
      for (let section = 1; section <= 12; section++) {
        const starters = (byStart[d + '_' + section] || []).slice().sort((a, b) => {
          if (a.thisWeek !== b.thisWeek) return (b.thisWeek ? 1 : 0) - (a.thisWeek ? 1 : 0);
          return (b.span || 1) - (a.span || 1);
        });
        if (!starters.length) continue;
        const weekOnes = starters.filter((c) => c.thisWeek);
        const primary = weekOnes[0] || starters[0];
        const rest = starters.filter((c) => c !== primary);
        const span = primary.span;
        const top = (section - 1) * ROW + 1;
        const height = span * ROW - 6;
        const z = primary.thisWeek ? 8 : 2;
        const style = primary.thisWeek
          ? `--uc-course-color:${primary.color};top:${top}px;height:${height}px;z-index:${z};background:${primary.color}26;border-color:${primary.color}80`
          : `--uc-course-color:${primary.color};top:${top}px;height:${height}px;z-index:${z};background:color-mix(in srgb,${primary.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`;
        const badge = rest.length ? `<span class="uc-badge">+${rest.length}</span>` : '';
        const payload = deps.escapeHtml(JSON.stringify({
          name: primary.name, teacher: primary.teacher, place: primary.place, week: primary.week,
          day: primary.day, section: primary.section, span: primary.span, thisWeek: primary.thisWeek,
          others: rest.map((r) => ({ name: r.name, teacher: r.teacher, place: r.place, week: r.week, thisWeek: r.thisWeek, section: r.section, span: r.span })),
        }));
        html += `<div class="uc-lesson${primary.thisWeek ? '' : ' is-fade'}" style="${style}" data-course='${payload}'>
          <b>${deps.escapeHtml(primary.name)}</b>
          <i>${deps.escapeHtml([primary.place, primary.week].filter(Boolean).join(' · '))}</i>
          ${badge}
        </div>`;
      }
      html += '</div>';
    }
    html += '</div></div>';
    return html;
  }

  /** 假期状态覆盖遮罩（仅第 0 周显示，切到其他周自动消失）：寒暑假→SVG+文案，春节→彩蛋 */
  function vacationMark() {
    try {
      // 课表加载中时先不盖遮罩，等加载完成再显示
      if (state.loading && state.loading.schedule) return '';
      const vac = deps.calVacation ? deps.calVacation() : 'term';
      if (vac === 'term') return '';
      if (deps.getViewWeekNumber() !== 0) return '';
      const META = {
        summer: {
          title: '放暑假啦~', sub: '课表先歇一歇，好好享受生活',
          svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
        },
        winter: {
          title: '放寒假啦~', sub: '课表先歇一歇，好好享受生活',
          svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>',
        },
        springfestival: {
          title: '春节快乐！', sub: '新的一学期 · 今天也要加油',
          svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-4.4 0-8-3.6-8-8 0-4.4 3.6-8 8-8s8 3.6 8 8c0 4.4-3.6 8-8 8z"/><path d="M12 3v2M3.5 7.5l1.5 1.5M20.5 7.5L19 9M4 21l2-2M20 21l-2-2"/><path d="M9 12h6M12 9v6"/></svg>',
        },
      }[vac];
      if (!META) return '';
      return `<div class="uc-schedule-mask uc-mask-${vac}"><span class="uc-mask-ico">${META.svg}</span><span class="uc-mask-txt"><b>${META.title}</b><i>${META.sub}</i></span></div>`;
    } catch (_) { return ''; }
  }

  function servicesHtml() {
    const items = [
      { t: '空闲教室', i: 'room', a: 'room' },
      { t: '教学评估', i: 'eval', h: '/student/teachingEvaluation/newEvaluation/index' },
      { t: '培养方案', i: 'plan', h: '/student/integratedQuery/planCompletion/index' },
      { t: '补办学生证', i: 'apply', h: '/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082' },
      { t: '免修申请', i: 'apply', h: '/student/personalManagement/individualApplication/exemptionApplication/index' },
      { t: '替代课申请', i: 'apply', h: '/student/personalManagement/personalApplication/curriculumReplacement/index' },
      { t: '火车票优惠卡', i: 'apply', h: '/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083' },
    ];
    return `<div class="uc-services">${items.map((item) => `
      <button type="button" class="uc-svc" data-action="${item.a || ''}" data-href="${item.h || ''}">
        ${deps.ico(item.i)}<strong>${item.t}</strong>
      </button>`).join('')}</div>`;
  }

  function renderDesktop() {
    const p = deps.personalizedProfile(state.profile || {});
    const courses = (state.schedule && state.schedule.courses) || [];
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { summary: deps.summarizeCourses([]) };
    const schemes = (state.scores && state.scores.schemes) || [];
    if (state.scores && state.scores.majorIdx != null && state._schemeInited !== true) {
      state.activeSchemeIdx = state.scores.majorIdx || 0;
      state._schemeInited = true;
    }
    const scheme = schemes[state.activeSchemeIdx] || schemes[0] || { summary: deps.summarizeCourses([]), title: '方案成绩' };
    const avatar = p.avatar ? `<img src="${deps.escapeHtml(p.avatar)}" alt="">` : `<span>${deps.escapeHtml((p.name || '同')[0])}</span>`;
    const scoreBody = state.loading.scores
      ? '<div class="uc-loading">成绩加载中</div>'
      : (state.scores && state.scores.error
        ? `<div class="uc-empty">${deps.escapeHtml(state.scores.error)}</div>`
        : `<div class="uc-score-grid">
            <div class="uc-score-pane" data-score="passing"><h5>全部及格成绩</h5>${metricHtml(pass.summary, 'passing')}</div>
            <div class="uc-score-pane" data-score="scheme"><h5>${deps.escapeHtml((scheme.title || '方案成绩').split(/通过|获得|不通过/)[0].trim() || '方案成绩')}</h5>${metricHtml(scheme.summary, 'scheme')}</div>
          </div>`);
    const scoreSection = scoreSectionHtml(scoreBody);

    return `<div class="uc-desktop">
      <div class="uc-col">
        <div class="uc-card uc-profile-card"><div class="uc-bd"><div class="uc-profile">
          <div class="uc-avatar" data-urppp-private="avatar">${avatar}</div>
          <div>
            <div class="uc-name" data-urppp-private="name">${deps.escapeHtml(p.name || '同学')}</div>
            <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${deps.escapeHtml(p.majorPlan || '—')}</span></div>
            <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${deps.escapeHtml(String(p.majorGpa || '—'))}</span></div>
          </div>
        </div>${(() => { try { return calendarSummaryHtml(); } catch (_) { return ''; } })()}</div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${deps.getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${courses.length ? (courses.length + ' 课次') : ((state.schedule && state.schedule.error) || '')}</span>
            </div>
          </div>
          <div class="uc-bd"><div class="uc-schedule-wrap">${state.loading.schedule ? '<div class="uc-loading">课表加载中</div>' : (courses.length ? renderScheduleBoard(courses) : `<div class="uc-empty">${deps.escapeHtml((state.schedule && state.schedule.error) || '暂无课表数据')}</div>`)}${vacationMark()}</div></div>
        </div>
      </div>
      <div class="uc-col">
        <div class="uc-card">
          ${scoreSection}
        </div>
        <div class="uc-card services">
          <div class="uc-hd">服务</div>
          <div class="uc-bd">${servicesHtml()}</div>
        </div>
      </div>
    </div>`;
  }

  function renderMobile() {
    const p = deps.personalizedProfile(state.profile || {});
    const courses = (state.schedule && state.schedule.courses) || [];
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { summary: deps.summarizeCourses([]) };
    const scheme = ((state.scores && state.scores.schemes) || [])[state.activeSchemeIdx] || { summary: deps.summarizeCourses([]) };
    const avatar = p.avatar ? `<img src="${deps.escapeHtml(p.avatar)}" alt="">` : `<span>${deps.escapeHtml((p.name || '同')[0])}</span>`;
    if (state.mobileTab === 'scores') {
      const scoreBody = `<div class="uc-score-grid uc-score-grid-mobile">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${metricHtml(pass.summary, 'passing')}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${metricHtml(scheme.summary, 'scheme')}</div>
      </div>`;
      return `<div class="uc-mobile"><div class="uc-card">${scoreSectionHtml(scoreBody)}</div></div>`;
    }
    if (state.mobileTab === 'room') {
      return `<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${roomPickerHtml()}</div></div></div>`;
    }
    if (state.mobileTab === 'more') {
      return `<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${servicesHtml()}</div></div></div>`;
    }
    return `<div class="uc-mobile">
      <div class="uc-card uc-profile-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${avatar}</div>
        <div><div class="uc-name" data-urppp-private="name">${deps.escapeHtml(p.name || '同学')}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${deps.escapeHtml(p.majorPlan || '—')}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${deps.escapeHtml(String(p.majorGpa || '—'))}</span></div></div>
      </div>${(() => { try { return calendarSummaryCompactHtml(); } catch (_) { return ''; } })()}</div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${deps.getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd"><div class="uc-schedule-wrap">${state.loading.schedule ? '<div class="uc-loading">课表加载中</div>' : (courses.length ? renderScheduleBoard(courses) : `<div class="uc-empty">${deps.escapeHtml((state.schedule && state.schedule.error) || '暂无课表数据')}</div>`)}${vacationMark()}</div></div></div>
    </div>`;
  }

  function roomPickerHtml() {
    if (state.loading.room) return '<div class="uc-loading">教学楼加载中</div>';
    const groups = state.catalog || [];
    if (!groups.length) {
      return `<div class="uc-empty">${deps.escapeHtml(state.roomError || '未读到教学楼列表')}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`;
    }
    const ordered = groups.slice().sort((a, b) => (/江安/.test(a.campus) ? -1 : 0) - (/江安/.test(b.campus) ? -1 : 0));
    return ordered.map((group) => `
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${deps.escapeHtml(group.campus)}</div>
        <div class="uc-build-grid">
          ${group.buildings.map((b) => `<button type="button" data-build-path="${deps.escapeHtml(b.path)}" data-cn="${deps.escapeHtml(b.campusNumber || '')}" data-bn="${deps.escapeHtml(b.buildingNumber || '')}">${deps.escapeHtml(b.name)}</button>`).join('')}
        </div>
      </div>`).join('');
  }

  function occupancyHtml(pack, buildingName) {
    if (!pack || !pack.rooms || !pack.rooms.length) return '<div class="uc-empty">该楼暂无教室占用数据</div>';
    let head = '<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';
    for (let i = 1; i <= 12; i++) head += `<th class="sec">${i}</th>`;
    head += '</tr>';
    const body = pack.rooms.map((room) => {
      let row = `<tr><th class="sticky">${deps.escapeHtml(room.name)}</th><th class="sticky2">${deps.escapeHtml(room.seats)}</th>`;
      for (let i = 1; i <= 12; i++) {
        const slot = (room.slots || []).find((s) => s.section === i) || { busy: false };
        if (slot.busy) {
          const reason = slot.reason || slot.typeLabel || '占用';
          const typeLabel = slot.typeLabel || deps.occupancyTypeLabel({ occupancymoduleId: slot.module });
          const ch = slot.displayChar || deps.firstContentChar(reason) || deps.firstContentChar(typeLabel) || '占';
          const detailObj = Object.assign({}, slot.detail || { room: room.name, section: i, reason }, {
            reason,
            typeLabel,
            contentName: slot.contentName || (slot.detail && slot.detail.contentName) || '',
          });
          const detail = deps.escapeHtml(JSON.stringify(detailObj));
          row += `<td><button type="button" class="uc-slot busy ${deps.occupancyKindClass(typeLabel)}" data-occ='${detail}' title="${deps.escapeHtml(room.name)} 第${i}节 · ${deps.escapeHtml(reason)}">${deps.escapeHtml(ch)}</button></td>`;
        } else {
          row += `<td><div class="uc-slot free" title="${deps.escapeHtml(room.name)} 第${i}节 · 空闲"></div></td>`;
        }
      }
      return row + '</tr>';
    }).join('');
    const off = Number(pack.dateOffset != null ? pack.dateOffset : state.roomDateOffset) || 0;
    const dayBtn = (value, label) =>
      `<button type="button" class="uc-btn${off === value ? ' primary' : ''}" data-room-day="${value}">${label}</button>`;
    return `
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${deps.escapeHtml(buildingName || '')}</div>
          <div class="uc-sub">${deps.escapeHtml(pack.dateLabel || '')}${pack.jxzc ? (' · 教学第' + pack.jxzc + '周') : ''}</div>
          <div class="uc-room-days">
            ${dayBtn(0, '今天')}
            ${dayBtn(1, '明天')}
            ${dayBtn(2, '后天')}
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
      <div class="uc-occ"><table class="uc-occ-table">${head}${body}</table></div>`;
  }

  function render() {
    const el = deps.ensureRoot();
    const body = el.querySelector('#uc-body');
    // 渲染前同步系统教学周，防止小屏首屏误落第1周
    deps.getViewWeekNumber();
    const matchMedia = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia : null;
    const mobile = matchMedia && matchMedia('(max-width:900px)').matches;
    // 仅首次进入播放卡片入场；后续数据刷新不再重播，避免闪烁
    const firstPaint = !state.uiReady;
    body.innerHTML = mobile ? renderMobile() : renderDesktop();
    if (!firstPaint) {
      el.classList.add('uc-settled');
    } else {
      state.uiReady = true;
      el.classList.remove('uc-settled');
      clearTimeout(el.__ucSettleTimer);
      el.__ucSettleTimer = setTimeout(() => {
        if (state.open) el.classList.add('uc-settled');
      }, 480);
    }
    deps.bindUI(body);
    deps.applyPersonalDisplay(body);
  }

  function scheduleRender() {
    if (!state.open || cleanRenderFrame) return;
    const run = () => {
      cleanRenderFrame = 0;
      if (state.open) render();
    };
    const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null;
    cleanRenderFrame = raf ? raf(run) : setTimeout(run, 0);
  }

  return {
    analysisHtml,
    metricHtml,
    occupancyHtml,
    render,
    renderScheduleBoard,
    roomPickerHtml,
    scheduleRender,
    scoreSectionHtml,
  };
}
