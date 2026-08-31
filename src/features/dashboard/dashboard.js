export function createDashboardController({ deps }) {
  function bindScheduleHoverNearCursor() {
    if (window.__urpppScheduleHoverNear) return;
    window.__urpppScheduleHoverNear = true;

    const OFFSET_X = 12;
    const OFFSET_Y = 16;
    let lastX = 0;
    let lastY = 0;
    let visible = false;
    let raf = 0;

    const hoverEl = () => document.getElementById('schedule-hover');

    const isShown = (el) => {
      if (!el) return false;
      if (el.style && el.style.display === 'none') return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    };

    const place = () => {
      const el = hoverEl();
      if (!el || !isShown(el)) {
        visible = false;
        return;
      }
      visible = true;
      const viewportWidth = window.innerWidth || 1200;
      const viewportHeight = window.innerHeight || 800;
      let left = lastX + OFFSET_X;
      let top = lastY + OFFSET_Y;
      const estimatedWidth = Math.min(320, el.offsetWidth || 280);
      const estimatedHeight = Math.min(220, el.offsetHeight || 160);
      if (left + estimatedWidth > viewportWidth - 8) left = viewportWidth - estimatedWidth - 8;
      if (top + estimatedHeight > viewportHeight - 8) top = viewportHeight - estimatedHeight - 8;
      if (left < 8) left = 8;
      if (top < 8) top = 8;

      el.style.setProperty('position', 'fixed', 'important');
      el.style.setProperty('left', Math.round(left) + 'px', 'important');
      el.style.setProperty('top', Math.round(top) + 'px', 'important');
      el.style.setProperty('right', 'auto', 'important');
      el.style.setProperty('bottom', 'auto', 'important');
      el.style.setProperty('margin', '0', 'important');
      el.style.setProperty('z-index', '3000', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
    };

    const schedulePlace = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        place();
      });
    };

    document.addEventListener('mousemove', (event) => {
      lastX = event.clientX;
      lastY = event.clientY;
      if (!visible) {
        const el = hoverEl();
        if (el && el.style && el.style.display && el.style.display !== 'none') visible = true;
      }
      if (visible) schedulePlace();
    }, true);

    document.addEventListener('mouseover', (event) => {
      const target = event.target && event.target.closest
        ? event.target.closest('.fc-event, .fc-time-grid-event')
        : null;
      if (!target) return;
      lastX = event.clientX;
      lastY = event.clientY;
      setTimeout(() => {
        visible = true;
        place();
      }, 0);
      setTimeout(place, 40);
    }, true);

    document.addEventListener('mouseout', (event) => {
      const target = event.target && event.target.closest
        ? event.target.closest('.fc-event, .fc-time-grid-event')
        : null;
      if (!target) return;
      setTimeout(() => {
        const el = hoverEl();
        if (!isShown(el)) visible = false;
      }, 50);
    }, true);
  }

  function refreshHomeFullCalendar(options) {
    try {
      const force = !!(options && options.force);
      const $ = (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery)
        ? unsafeWindow.jQuery
        : (window.jQuery || null);
      if (!$ || !$.fn || !$.fn.fullCalendar) return false;

      const host = document.getElementById('main-calendar')
        || document.querySelector('#urppp-left .fc, #urppp-dashboard .fc');
      if (!host) return false;

      if (!force && host.dataset.urpppFcSized === '1') return true;

      const $el = $(host);
      // 必须确认 fullCalendar 实例存在：仅 hasClass('fc') 不够（重挂载后 data 丢失但 class 残留，调用会报未初始化）
      if (!$el.data('fullCalendar')) return false;

      const scrollers = Array.from(host.querySelectorAll('.fc-scroller'));
      const saved = scrollers.map((s) => ({ el: s, top: s.scrollTop, left: s.scrollLeft }));

      // remount 后只需 render 一次；后续若必须补测只用 updateSize
      if (force || host.dataset.urpppFcRendered !== '1') {
        try { $el.fullCalendar('render'); } catch (_) { /* ignore */ }
        host.dataset.urpppFcRendered = '1';
      } else {
        try { $el.fullCalendar('updateSize'); } catch (_) { /* ignore */ }
      }

      requestAnimationFrame(() => {
        saved.forEach((s) => {
          try {
            s.el.scrollTop = s.top;
            s.el.scrollLeft = s.left;
          } catch (_) { /* ignore */ }
        });
      });

      const height = host.getBoundingClientRect().height || 0;
      // 高度达标后永久停止自动刷新
      if (height >= 300) host.dataset.urpppFcSized = '1';
      return true;
    } catch (error) {
      console.warn('[URP++] fullCalendar refresh failed', error);
      return false;
    }
  }

  function scheduleHomeFullCalendarRefresh() {
    // 每个页面生命周期最多调度一轮，且次数极少
    if (window.__urpppFcRefreshBound) return;
    window.__urpppFcRefreshBound = true;
    setTimeout(() => refreshHomeFullCalendar({ force: true }), 0);
    setTimeout(() => refreshHomeFullCalendar({ force: false }), 300);
  }

  function wrapWidget(widget, container, title) {
    const header = widget.querySelector('.widget-header');
    const toolbar = header ? header.querySelector('.widget-toolbar') : null;

    const card = document.createElement('div');
    card.className = 'urppp-card';
    card.innerHTML = `
      <div class="urppp-card-header">
        <h4>${title}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `;

    if (toolbar) {
      toolbar.style.display = 'inline-block';
      card.querySelector('.urppp-card-tools').appendChild(toolbar);
    }
    card.querySelector('.urppp-card-body').appendChild(widget);
    container.appendChild(card);
  }

  function rebuildDashboard() {
    try { bindScheduleHoverNearCursor(); } catch (_) { /* ignore */ }
    if (document.getElementById('urppp-dashboard')) return;

    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    const widgets = Array.from(pageContent.querySelectorAll('.widget-box'));
    if (widgets.length < 6) return;

    const studyWidget = widgets[4];
    const infoboxes = studyWidget ? Array.from(studyWidget.querySelectorAll('.infobox')) : [];

    const dashboard = document.createElement('div');
    dashboard.id = 'urppp-dashboard';
    dashboard.innerHTML = `
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `;

    pageContent.appendChild(dashboard);

    // 提取 modal 到 body，避免隐藏原始 row 后弹窗失效
    const warningModal = pageContent.querySelector('#warningInfo');
    if (warningModal) document.body.appendChild(warningModal);

    // 隐藏原始 widget 所在的容器列
    widgets.forEach((w) => {
      const col = w.closest('.widget-container-col, [class*="col-"]');
      if (col) col.style.display = 'none';
    });
    // 兜底：隐藏 page-content 下直接的一级 row
    pageContent.querySelectorAll(':scope > .row').forEach((row) => {
      row.style.display = 'none';
    });

    // 生成学业概览卡片（骨架屏 → 真实数据）
    const statsGrid = dashboard.querySelector('#urppp-stats');
    const skeletonCount = Math.max(infoboxes.length, 5);
    for (let i = 0; i < skeletonCount; i++) {
      const sk = document.createElement('div');
      sk.className = 'urppp-stat-card urppp-stat-skeleton';
      sk.innerHTML = '<div class="value">-</div><div class="label">加载中</div>';
      statsGrid.appendChild(sk);
    }

    function updateStats() {
      const boxes = studyWidget ? Array.from(studyWidget.querySelectorAll('.infobox')) : [];
      if (boxes.length === 0) return;
      statsGrid.innerHTML = '';
      boxes.forEach((box) => {
        const lines = box.innerText.trim().split(/\n+/).map((l) => l.trim()).filter((l) => l);
        const value = lines[0] || '';
        const label = lines.slice(1).join(' ').replace(/更多\.\.\./g, '').trim();
        const isTextValue = /[\u4e00-\u9fa5]/.test(value) || value.length > 5;
        const valueClass = isTextValue ? 'value urppp-stat-value-text' : 'value';
        const link = box.closest('a');
        const card = document.createElement(link ? 'a' : 'div');
        if (link) {
          card.href = link.href || 'javascript:void(0)';
          card.onclick = link.onclick;
          card.style.textDecoration = 'none';
        }
        card.className = 'urppp-stat-card';
        const privacyMarkup = deps.statCardPrivacyMarkup(value, label);
        card.innerHTML = `<div class="${valueClass}">${privacyMarkup.valueHtml}</div><div class="label">${privacyMarkup.labelHtml}</div>`;
        statsGrid.appendChild(card);
      });
    }

    updateStats();

    // 监听学业信息数据异步加载
    if (studyWidget) {
      const statsObserver = new MutationObserver(() => updateStats());
      statsObserver.observe(studyWidget, { childList: true, subtree: true });
      setTimeout(() => statsObserver.disconnect(), 5000);
    }

    // 包装并移动 widget
    const left = dashboard.querySelector('#urppp-left');
    const right = dashboard.querySelector('#urppp-right');

    wrapWidget(widgets[5], left, '我的日程安排');
    wrapWidget(widgets[0], right, '通知公告');
    wrapWidget(widgets[1], right, '我的待办任务');
    wrapWidget(widgets[2], right, '可申请业务');
    wrapWidget(widgets[3], right, '常用下载');

    if (studyWidget) studyWidget.style.display = 'none';

    // FullCalendar 迁入 urppp-card 后补测尺寸（内部会限频，避免滚动弹回）
    scheduleHomeFullCalendarRefresh();

    console.log('[URP++] 首页仪表板已重构');
  }

  return {
    rebuildDashboard,
    refreshHomeFullCalendar,
    scheduleHomeFullCalendarRefresh,
    wrapWidget,
  };
}
