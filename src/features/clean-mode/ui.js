export function createCleanModeUI({ state, deps }) {
  function markCleanUiBound(node, key) {
    if (!node) return false;
    if (!node.__urpppCleanUiBindings) node.__urpppCleanUiBindings = new Set();
    if (node.__urpppCleanUiBindings.has(key)) return false;
    node.__urpppCleanUiBindings.add(key);
    return true;
  }

  function bindUI(scope) {
    if (!scope) return;
    try { deps.bindScheduleExportHosts(scope); } catch (error) { console.warn('[URP++] schedule export menu', error); }
    scope.querySelectorAll('[data-score]').forEach((node) => {
      if (!markCleanUiBound(node, 'score')) return;
      node.addEventListener('click', () => openScoreModal(node.getAttribute('data-score')));
    });
    // 成绩分析子页切换（选项卡模式）
    scope.querySelectorAll('[data-sa-tab]').forEach((node) => {
      if (!markCleanUiBound(node, 'saTab')) return;
      node.addEventListener('click', () => {
        state.scoreAnalysisTab = node.getAttribute('data-sa-tab') === 'analysis' ? 'analysis' : 'overview';
        deps.render();
      });
    });
    scope.querySelectorAll('[data-href]').forEach((node) => {
      if (!markCleanUiBound(node, 'href')) return;
      node.addEventListener('click', (event) => {
        const href = node.getAttribute('data-href');
        if (!href) return;
        event.preventDefault();
        deps.closeCleanMode();
        location.href = href;
      });
    });
    scope.querySelectorAll('[data-eval-url]').forEach((node) => {
      if (!markCleanUiBound(node, 'eval')) return;
      node.addEventListener('click', (event) => {
        const href = node.getAttribute('data-eval-url');
        if (!href) return;
        event.preventDefault();
        event.stopPropagation();
        deps.closeCleanMode();
        location.href = href;
      });
    });
    scope.querySelectorAll('[data-action="room"]').forEach((node) => {
      if (!markCleanUiBound(node, 'room')) return;
      node.addEventListener('click', () => openRoomModal());
    });
    scope.querySelectorAll('[data-room-reload]').forEach((node) => {
      if (!markCleanUiBound(node, 'roomReload')) return;
      node.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        deps.ensureRoomCatalogLoaded(true);
      });
    });
    scope.querySelectorAll('[data-build-path]').forEach((node) => {
      if (!markCleanUiBound(node, 'building')) return;
      node.addEventListener('click', async () => {
        const path = node.getAttribute('data-build-path');
        const name = (node.textContent || '').trim();
        const campusNumber = node.getAttribute('data-cn') || '';
        const buildingNumber = node.getAttribute('data-bn') || '';
        const host = node.closest('#uc-room-panel') || node.closest('#uc-modal-body') || null;
        state.roomDateOffset = 0;
        await showBuilding({ path, name, campusNumber, buildingNumber, dateOffset: 0 }, name, host);
      });
    });
    scope.querySelectorAll('[data-room-day]').forEach((node) => {
      if (!markCleanUiBound(node, 'roomDay')) return;
      node.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const offset = parseInt(node.getAttribute('data-room-day') || '0', 10) || 0;
        if (!state.currentBuilding) return;
        state.roomDateOffset = offset;
        const building = Object.assign({}, state.currentBuilding, { dateOffset: offset });
        const host = node.closest('#uc-room-panel') || node.closest('#uc-modal-body') || null;
        await showBuilding(building, building.name || '', host);
      });
    });
    const back = scope.querySelector('#uc-room-back');
    if (back) back.onclick = () => {
      state.occupancy = null;
      state.currentBuilding = null;
      const panel = back.closest('#uc-room-panel') || document.querySelector('#uc-room-panel') || document.querySelector('#uc-modal-body');
      if (panel && panel.id === 'uc-modal-body') {
        panel.innerHTML = deps.roomPickerHtml();
        bindUI(panel);
      } else if (panel && panel.id === 'uc-room-panel') {
        panel.innerHTML = deps.roomPickerHtml();
        bindUI(panel);
      } else {
        deps.render();
      }
    };
    // 教室占用详情
    scope.querySelectorAll('.uc-slot.busy[data-occ]').forEach((element) => {
      if (!markCleanUiBound(element, 'occupancy')) return;
      element.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
          const detail = JSON.parse(element.getAttribute('data-occ') || '{}');
          openModal('占用详情', `
            <div class="uc-occ-detail">
              <div class="uc-name">${deps.escapeHtml(detail.room || '')}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${deps.escapeHtml(String(detail.section || detail.start || ''))}${(detail.span > 1) ? ('-' + (Number(detail.start || detail.section) + Number(detail.span) - 1)) : ''}节</div>
              <div class="uc-sub">占用类型：${deps.escapeHtml(detail.typeLabel || detail.reason || '占用')}</div>
              <div class="uc-sub">具体内容：${deps.escapeHtml(detail.contentName || detail.reason || '—')}</div>
              ${detail.teacher ? `<div class="uc-sub">教师：${deps.escapeHtml(detail.teacher)}</div>` : ''}
              ${detail.weeks ? `<div class="uc-sub">周次：${deps.escapeHtml(detail.weeks)}</div>` : ''}
              ${detail.courseNo ? `<div class="uc-sub">课程号：${deps.escapeHtml(detail.courseNo)}</div>` : ''}
            </div>
          `, '', { stack: true });
        } catch (_) { /* ignore */ }
      });
    });
    // 课表：点击看详情
    scope.querySelectorAll('.uc-lesson[data-course]').forEach((element) => {
      if (!markCleanUiBound(element, 'course')) return;
      element.addEventListener('click', (event) => {
        event.stopPropagation();
        try {
          const data = JSON.parse(element.getAttribute('data-course') || '{}');
          const secText = `第${data.section || '?'}${data.span > 1 ? '-' + (Number(data.section) + Number(data.span) - 1) : ''}节`;
          const others = (data.others || []).map((o) =>
            `<div class="uc-course-sub ${o.thisWeek ? '' : 'is-fade'}">
              <div class="uc-cd-name">${deps.escapeHtml(o.name || '')}</div>
              <div class="uc-cd-meta">${deps.escapeHtml([o.place, o.week, o.teacher].filter(Boolean).join(' · ')) || '—'}</div>
              <div class="uc-cd-chip">${o.thisWeek ? '当前周有课' : '当前周无课'}</div>
            </div>`
          ).join('');
          openModal('课程详情', `
            <div class="uc-course-detail">
              <div class="uc-cd-name">${deps.escapeHtml(data.name || '')}</div>
              <div class="uc-cd-meta">${deps.escapeHtml([data.place, data.teacher, data.week].filter(Boolean).join(' · ')) || '—'}</div>
              <div class="uc-cd-chip">${data.thisWeek ? '当前周有课' : '当前周无课'} · ${deps.escapeHtml(secText)} · ${deps.escapeHtml(deps.DAY_NAMES[data.day] || '')}</div>
            </div>
            ${others ? '<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>' + others : ''}
          `, '');
        } catch (_) { /* ignore */ }
      });
    });
    // 课表周次切换
    scope.querySelectorAll('[data-week-delta]').forEach((button) => {
      if (!markCleanUiBound(button, 'weekDelta')) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const delta = parseInt(button.getAttribute('data-week-delta') || '0', 10) || 0;
        const courses = (state.schedule && state.schedule.courses) || [];
        const maxWeek = deps.inferMaxWeek(courses);
        const current = deps.getViewWeekNumber();
        state.weekLocked = true;
        state.viewWeek = Math.min(maxWeek, Math.max(1, current + delta));
        deps.render();
        const label = document.querySelector('#urppp-clean-root .uc-week-label');
        if (label) {
          label.classList.remove('uc-pop');
          void label.offsetWidth;
          label.classList.add('uc-pop');
        }
      });
    });
    scope.querySelectorAll('[data-week-reset]').forEach((button) => {
      if (!markCleanUiBound(button, 'weekReset')) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        state.weekLocked = false;
        const system = deps.getCurrentWeekNumber() || state._termWeek || 1;
        state.viewWeek = system;
        deps.render();
        const label = document.querySelector('#urppp-clean-root .uc-week-label');
        if (label) {
          label.classList.remove('uc-pop');
          void label.offsetWidth;
          label.classList.add('uc-pop');
        }
      });
    });
  }

  const modalStack = [];

  function openModal(title, body, footer, options) {
    options = options || {};
    const el = deps.ensureRoot();
    const mask = el.querySelector('#uc-mask');
    const modal = el.querySelector('#uc-modal');
    // 栈式弹窗：保留下层（如教室列表），上层详情关闭后回到下层
    if (options.stack && modal.classList.contains('open')) {
      modalStack.push({
        title: el.querySelector('#uc-modal-title').textContent,
        body: el.querySelector('#uc-modal-body').innerHTML,
        ft: el.querySelector('#uc-modal-ft').innerHTML,
      });
    } else if (!options.stack) {
      modalStack.length = 0;
    }
    mask.classList.add('open');
    modal.classList.add('open');
    el.querySelector('#uc-modal-title').textContent = title;
    el.querySelector('#uc-modal-body').innerHTML = body;
    el.querySelector('#uc-modal-ft').innerHTML = footer || '';
    bindUI(el.querySelector('#uc-modal-body'));
    bindUI(el.querySelector('#uc-modal-ft'));
    deps.applyPersonalDisplay(el.querySelector('#uc-modal'));
  }

  function closeModal() {
    const el = deps.rootEl();
    if (!el) return;
    if (modalStack.length) {
      const prev = modalStack.pop();
      el.querySelector('#uc-modal-title').textContent = prev.title;
      el.querySelector('#uc-modal-body').innerHTML = prev.body;
      el.querySelector('#uc-modal-ft').innerHTML = prev.ft || '';
      bindUI(el.querySelector('#uc-modal-body'));
      bindUI(el.querySelector('#uc-modal-ft'));
      return;
    }
    el.querySelector('#uc-mask').classList.remove('open');
    el.querySelector('#uc-modal').classList.remove('open');
  }

  function openScoreModal(kind) {
    const pass = (state.scores && state.scores.passing && state.scores.passing[0]) || { courses: [], summary: deps.summarizeCourses([]) };
    const schemes = (state.scores && state.scores.schemes) || [];
    if (kind === 'scheme' && state.scores && state.scores.majorIdx != null && state._schemeInited !== true) {
      state.activeSchemeIdx = state.scores.majorIdx || 0;
      state._schemeInited = true;
    }
    const scheme = schemes[state.activeSchemeIdx] || schemes[0] || { courses: [], summary: deps.summarizeCourses([]), title: '方案成绩' };
    const pack = kind === 'scheme' ? scheme : pass;
    const key = kind === 'scheme' ? 'scheme' : 'passing';
    if (!state.selected[key]) state.selected[key] = new Set();
    const switcher = kind === 'scheme' && schemes.length > 1
      ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${schemes.map((s, i) =>
        `<button type="button" class="uc-btn ${i === state.activeSchemeIdx ? 'primary' : ''}" data-scheme-idx="${i}"><span data-urppp-private="organization">${deps.escapeHtml((s.title || '方案').slice(0, 28))}</span></button>`).join('')}</div>`
      : '';
    const scoreCellHtml = (c) => {
      const uneval = !!(c && (c.unevaluated || deps.isUnevaluatedScore(c.score)));
      const sc = deps.scoreToNumber(c && c.score);
      let cls = '';
      if (uneval) {
        cls = (sc != null && sc < 60) ? 'uneval-fail' : 'uneval';
      } else if (sc != null) {
        cls = sc >= 60 ? 'pass' : 'fail';
      } else if (/不及格|不合格|不通过/.test(String(c && c.score || ''))) {
        cls = 'fail';
      } else if (c && c.score) {
        cls = 'pass';
      }
      const label = deps.escapeHtml((c && c.score) || '—');
      const jump = uneval ? (c.evalUrl || '/student/teachingEvaluation/newEvaluation/index') : '';
      if (jump) {
        return `<span class="uc-score-cell ${cls}" data-eval-url="${deps.escapeHtml(jump)}" title="未评教，点击前往评教">${label}</span>`;
      }
      return `<span class="uc-score-cell ${cls}">${label}</span>`;
    };
    const rows = (pack.courses || []).map((c, idx) => {
      const on = state.selected[key].has(idx);
      const gpa = (deps.isValidOfficialGpa(c.officialGpa) ? c.officialGpa : deps.scoreToGpa(c.score));
      const uneval = !!(c.unevaluated || deps.isUnevaluatedScore(c.score));
      return `<tr class="${on ? 'is-on' : ''}${uneval ? ' is-uneval' : ''}" data-idx="${idx}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${on ? '✓' : ''}</span><span class="uc-cname">${deps.escapeHtml(c.name)}</span></td>
        <td><span class="uc-attr-pill">${deps.escapeHtml(c.attr || '—')}</span></td>
        <td data-urppp-private="credit">${c.credit}</td>
        <td data-urppp-private="grade">${scoreCellHtml(c)}</td>
        <td data-urppp-private="gpa">${uneval || gpa == null ? '—' : gpa}</td>
      </tr>`;
    }).join('');
    openModal(kind === 'scheme' ? ('方案成绩 · ' + (scheme.title || '')) : '全部及格成绩', `
      ${switcher}${deps.metricHtml(pack.summary, kind === 'scheme' ? 'scheme' : 'passing')}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`, `<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>`);
    const modalTitle = document.querySelector('#uc-modal-title');
    if (modalTitle) {
      if (kind === 'scheme') modalTitle.setAttribute('data-urppp-private', 'organization');
      else modalTitle.removeAttribute('data-urppp-private');
      deps.applyPersonalDisplay(modalTitle.parentElement || modalTitle);
    }
    const body = document.querySelector('#uc-modal-body');
    const calc = document.getElementById('uc-calc');
    const table = document.getElementById('uc-score-table');
    const wrap = document.getElementById('uc-score-wrap');
    const box = document.getElementById('uc-select-box');

    const paint = () => {
      table.querySelectorAll('tbody tr[data-idx]').forEach((tr) => {
        const index = parseInt(tr.getAttribute('data-idx'), 10);
        const on = state.selected[key].has(index);
        tr.classList.toggle('is-on', on);
        const mark = tr.querySelector('.uc-selmark');
        if (mark) mark.textContent = on ? '✓' : '';
      });
      const selected = [];
      state.selected[key].forEach((index) => { if (pack.courses[index]) selected.push(pack.courses[index]); });
      const sum = deps.summarizeCoursesPreferOfficial(selected);
      if (calc) {
        calc.className = 'uc-calc';
        calc.innerHTML = selected.length
          ? `已选 <b>${selected.length}</b> 门 · 学分 <b data-urppp-private="credit">${sum.totalCredit}</b> · 均分 <b data-urppp-private="grade">${sum.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${sum.avgGpa}</b>`
          : '已选 0 门';
      }
    };

    const toggleIdx = (index, force) => {
      if (force === true) state.selected[key].add(index);
      else if (force === false) state.selected[key].delete(index);
      else if (state.selected[key].has(index)) state.selected[key].delete(index);
      else state.selected[key].add(index);
    };

    // 点击行选择
    let suppressClick = false;
    table.querySelectorAll('tbody tr[data-idx]').forEach((tr) => {
      tr.addEventListener('click', (event) => {
        if (suppressClick) { suppressClick = false; return; }
        const index = parseInt(tr.getAttribute('data-idx'), 10);
        toggleIdx(index);
        paint();
      });
    });

    // 拖拽框选：选择框相对 wrap 绝对定位，避免被 modal transform 造成漂移
    let dragging = false;
    let x0 = 0;
    let y0 = 0;
    let baseSet = null;
    const rowsEls = () => Array.from(table.querySelectorAll('tbody tr[data-idx]'));
    const placeBox = (x1, y1) => {
      if (!box || !wrap) return { left: 0, top: 0, right: 0, bottom: 0, w: 0, h: 0 };
      const rect = wrap.getBoundingClientRect();
      const leftValue = Math.min(x0, x1);
      const topValue = Math.min(y0, y1);
      const rightValue = Math.max(x0, x1);
      const bottomValue = Math.max(y0, y1);
      const width = rightValue - leftValue;
      const height = bottomValue - topValue;
      const left = leftValue - rect.left + wrap.scrollLeft;
      const top = topValue - rect.top + wrap.scrollTop;
      box.style.display = (width > 3 || height > 3) ? 'block' : 'none';
      box.style.left = left + 'px';
      box.style.top = top + 'px';
      box.style.width = width + 'px';
      box.style.height = height + 'px';
      return { left: leftValue, top: topValue, right: rightValue, bottom: bottomValue, w: width, h: height };
    };
    const onMoveSel = (event) => {
      if (!dragging) return;
      event.preventDefault();
      const sel = placeBox(event.clientX, event.clientY);
      if (sel.w <= 3 && sel.h <= 3) return;
      state.selected[key] = new Set(baseSet);
      rowsEls().forEach((tr) => {
        const r = tr.getBoundingClientRect();
        const hit = !(r.right < sel.left || r.left > sel.right || r.bottom < sel.top || r.top > sel.bottom);
        if (!hit) return;
        const index = parseInt(tr.getAttribute('data-idx'), 10);
        if (baseSet.has(index)) state.selected[key].delete(index);
        else state.selected[key].add(index);
      });
      paint();
    };
    const onUpSel = (event) => {
      const moved = Math.abs(event.clientX - x0) > 3 || Math.abs(event.clientY - y0) > 3;
      dragging = false;
      if (box) box.style.display = 'none';
      document.removeEventListener('mousemove', onMoveSel, true);
      document.removeEventListener('mouseup', onUpSel, true);
      if (moved) suppressClick = true;
      paint();
    };
    wrap.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return;
      dragging = true;
      x0 = event.clientX;
      y0 = event.clientY;
      baseSet = new Set(state.selected[key]);
      placeBox(x0, y0);
      document.addEventListener('mousemove', onMoveSel, true);
      document.addEventListener('mouseup', onUpSel, true);
    });

    body.querySelectorAll('[data-scheme-idx]').forEach((button) => button.addEventListener('click', () => {
      state.activeSchemeIdx = parseInt(button.getAttribute('data-scheme-idx'), 10) || 0;
      state._schemeUserSelected = true;
      openScoreModal('scheme');
    }));
    const clear = document.getElementById('uc-clear');
    if (clear) clear.onclick = () => { state.selected[key] = new Set(); paint(); };
    paint();
  }

  async function openRoomModal() {
    openModal('空闲教室', '<div class="uc-loading">加载教学楼…</div>', '');
    try {
      await deps.ensureRoomCatalogLoaded(false);
      openModal('空闲教室', deps.roomPickerHtml(), `<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>`);
    } catch (error) {
      openModal('空闲教室', `<div class="uc-empty">${deps.escapeHtml(error && error.message || error)}</div>`, '');
    }
  }

  function getRoomHost(preferred) {
    if (preferred && preferred.isConnected) return preferred;
    const panel = document.querySelector('#uc-room-panel');
    if (panel && panel.offsetParent !== null) return panel;
    if (panel && state.mobileTab === 'room') return panel;
    const modalBody = document.querySelector('#uc-modal-body');
    const modal = document.querySelector('#uc-modal');
    if (modal && modal.classList.contains('open') && modalBody) return modalBody;
    return panel || modalBody || null;
  }

  async function showBuilding(building, name, preferredHost) {
    const body = getRoomHost(preferredHost);
    if (!body) {
      console.warn('[URP++] no room host');
      return;
    }
    body.innerHTML = '<div class="uc-loading">加载占用网格…</div>';
    try {
      let pack = await deps.loadBuildingOccupancy(building);
      body.innerHTML = '<div class="uc-loading">匹配课程名称…</div>';
      let plan = pack.planNumber || '';
      if (!plan) {
        try {
          const raw = await deps.fetchText('/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback');
          const json = JSON.parse(raw);
          plan = (json && (json.zxjxjhh || json.xnxq || (json.dateList && json.dateList[0] && json.dateList[0].zxjxjhh))) || '';
          if (!plan && json && json.xkxx && json.xkxx[0]) {
            const keys = Object.keys(json.xkxx[0] || {});
            const one = keys.length ? json.xkxx[0][keys[0]] : null;
            plan = (one && (one.zxjxjhh || one.executiveEducationPlanNumber)) || '';
          }
        } catch (_) { /* ignore */ }
      }
      if (!plan) plan = '2025-2026-2-1';
      pack.planNumber = plan;
      try {
        pack = await deps.enrichOccupancyWithCurriculum(pack, typeof building === 'object' ? building : {}, plan);
      } catch (error) {
        console.warn('[URP++] enrich occupancy', error);
      }
      state.occupancy = pack;
      state.roomDateOffset = Number(pack.dateOffset != null ? pack.dateOffset : state.roomDateOffset) || 0;
      const baseBuilding = typeof building === 'object' ? building : { path: building, name };
      state.currentBuilding = Object.assign({}, baseBuilding, {
        name: name || baseBuilding.name || '',
        dateOffset: state.roomDateOffset,
      });
      name = name || (building && building.name) || '';
      // 加载过程中 host 可能被 render 重建，重新取一次
      const host = getRoomHost(body) || body;
      host.innerHTML = deps.occupancyHtml(pack, name);
      bindUI(host);
    } catch (error) {
      const host = getRoomHost(body) || body;
      if (host) host.innerHTML = `<div class="uc-empty">${deps.escapeHtml(error && error.message || error)}</div>`;
    }
  }

  return {
    bindUI,
    closeModal,
    getRoomHost,
    openModal,
    openRoomModal,
    openScoreModal,
    showBuilding,
  };
}
