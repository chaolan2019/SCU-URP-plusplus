import { openCalendarModal, mountCalendarButton, bindCalendarOpen, ensureCalendarStyle, removeCalendarButton } from '../interactive-calendar/index.js';

export function createCleanModeController({ state, deps }) {
  function rootEl() { return document.getElementById('urppp-clean-root'); }

  function ensureRoot() {
    deps.ensureStyle();
    let el = rootEl();
    if (el) return el;
    el = document.createElement('div');
    el.id = 'urppp-clean-root';
    el.innerHTML = `
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
          <button type="button" class="uc-btn" id="uc-refresh">${deps.ico('refresh')}<span>刷新</span></button>
          <button type="button" class="uc-btn primary" id="uc-exit">${deps.ico('exit')}<span>退出</span></button>
        </div>
      </div>
      <div class="uc-shell"><div class="uc-shell-inner" id="uc-body"></div></div>
      <div class="uc-tabbar" id="uc-tabbar">
        <button type="button" data-tab="home" class="ac">${deps.ico('home')}<span>首页</span></button>
        <button type="button" data-tab="scores">${deps.ico('score')}<span>成绩</span></button>
        <button type="button" data-tab="room">${deps.ico('room')}<span>教室</span></button>
        <button type="button" data-tab="more">${deps.ico('more')}<span>其他</span></button>
      </div>
      <div class="uc-mask" id="uc-mask"></div>
      <div class="uc-modal" id="uc-modal">
        <div class="uc-modal-hd"><span id="uc-modal-title">详情</span><button type="button" class="uc-btn" id="uc-modal-close">${deps.ico('close')}</button></div>
        <div class="uc-modal-bd" id="uc-modal-body"></div>
        <div class="uc-modal-ft" id="uc-modal-ft"></div>
      </div>`;
    document.documentElement.appendChild(el);
    el.querySelector('#uc-exit').onclick = closeCleanMode;
    el.querySelector('#uc-refresh').onclick = () => openCleanMode(true);
    el.querySelector('#uc-mask').onclick = deps.closeModal;
    el.querySelector('#uc-modal-close').onclick = deps.closeModal;
    const syncCleanThemeDots = () => {
      deps.syncThemeDotGroup(el.querySelector('#uc-top-theme'));
    };
    el.querySelectorAll('#uc-top-theme .urppp-nav-dot[data-theme]').forEach((dot) => {
      dot.addEventListener('click', () => {
        deps.handleThemeDotClick(dot.dataset.theme);
        syncCleanThemeDots();
        try { deps.syncNavbarThemeUI(); } catch (_) { /* ignore */ }
        try { deps.syncSettingsPanelUI(); } catch (_) { /* ignore */ }
      });
    });
    const setBtn = el.querySelector('#uc-settings');
    if (setBtn) setBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      try { deps.openSettingsPanel(); } catch (_) { /* ignore */ }
    });

    // 侧边栏入口：复用站点移动端汉堡菜单（#sidebar），不新建抽屉
    const menuToggle = el.querySelector('#uc-menu-toggle');
    const restoreCleanSidebarInline = (sidebar) => {
      sidebar.classList.remove('urppp-clean-sidebar');
      const saved = sidebar.__urpppCleanInline;
      if (saved) {
        const s = sidebar.style;
        const restore = (prop, key) => {
          const it = saved[key];
          if (it && it.v) s.setProperty(prop, it.v, it.p || '');
          else s.removeProperty(prop);
        };
        restore('top', 'top'); restore('height', 'height'); restore('z-index', 'z');
        restore('position', 'pos'); restore('transform', 'transform'); restore('visibility', 'vis');
        restore('pointer-events', 'pe'); restore('transition', 'transition');
        delete sidebar.__urpppCleanInline;
      }
      // 移回原 DOM 位置（清爽模式期间 sidebar 被临时挂到 root 内）
      const origin = sidebar.__urpppCleanOrigin;
      if (origin && origin.parent && sidebar.parentElement !== origin.parent) {
        if (origin.next && origin.next.parentElement === origin.parent) origin.parent.insertBefore(sidebar, origin.next);
        else origin.parent.appendChild(sidebar);
      }
      delete sidebar.__urpppCleanOrigin;
    };
    const syncCleanSidebarZ = () => {
      const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      if (state.open) {
        sidebar.classList.add('urppp-clean-sidebar');
        if (!sidebar.__urpppCleanInline) {
          const s = sidebar.style;
          const grab = (p) => ({ v: s.getPropertyValue(p), p: s.getPropertyPriority(p) });
          sidebar.__urpppCleanInline = {
            top: grab('top'), height: grab('height'), z: grab('z-index'), pos: grab('position'),
            transform: grab('transform'), vis: grab('visibility'), pe: grab('pointer-events'), transition: grab('transition'),
          };
          sidebar.__urpppCleanOrigin = { parent: sidebar.parentElement, next: sidebar.nextSibling };
        }
        // 移入清爽模式 root（.uc-top 之后），使 sidebar 落在 root 的层叠上下文内、顶栏之下
        if (sidebar.parentElement !== el) {
          const shell = el.querySelector('.uc-shell');
          el.insertBefore(sidebar, shell || null);
        }
        // 侧边栏顶边贴住清爽顶栏底边；使用 root 内相对坐标，兼容 root 进入动画。
        const rootRect = el.getBoundingClientRect();
        const topEl = el.querySelector('.uc-top');
        const topRect = topEl ? topEl.getBoundingClientRect() : null;
        const topOffset = Math.max(44, Math.round(topRect ? topRect.bottom - rootRect.top : 60));
        const availableHeight = Math.max(0, Math.round(rootRect.height - topOffset));
        // 站点内联 z-index/top/height 均为 !important，需 JS 内联 important 后设覆盖
        sidebar.style.setProperty('top', topOffset + 'px', 'important');
        sidebar.style.setProperty('height', availableHeight + 'px', 'important');
        sidebar.style.setProperty('z-index', '12030', 'important');
        sidebar.style.setProperty('position', 'fixed', 'important');
      } else {
        restoreCleanSidebarInline(sidebar);
      }
    };
    const closeCleanSidebar = () => {
      const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      try { deps.stopDrawerAnimation(sidebar); } catch (_) { /* ignore */ }
      sidebar.classList.remove('display', 'urppp-drawer-closing');
      restoreCleanSidebarInline(sidebar);
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', '打开菜单');
      }
      const siteToggler = document.getElementById('urppp-mobile-menu-button');
      if (siteToggler) {
        siteToggler.setAttribute('aria-expanded', 'false');
        siteToggler.setAttribute('aria-label', '打开菜单');
      }
    };
    if (menuToggle) menuToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      // 绑定在 sidebar 上的菜单点击：站内导航退出清爽模式并跳转；站外/新窗口链接保持清爽模式
      // 捕获阶段拦截：quick 区链接 preventDefault+stopImmediatePropagation，阻止站点 onclick 与冒泡
      if (!sidebar.__urpppCleanMenuBound) {
        sidebar.__urpppCleanMenuBound = true;
        sidebar.addEventListener('click', (ev) => {
          if (!state.open) return;
          const link = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
          if (!link) return;
          // 搜索面板内的链接（typeahead 结果项）不受拦截，点击正常跳转
          if (link.closest('#urppp-mobile-search-panel')) return;
          const href = String(link.getAttribute('href') || '').trim();
          // 快捷区按链接语义分流：站内链接退出清爽模式并正常导航；弹窗/新窗口链接保持现状。
          if (link.closest('#urppp-mobile-quick, #urppp-mobile-user')) {
            if (!href || href === '#' || href.startsWith('javascript')) return;
            if (link.target === '_blank' || /^https?:\/\//i.test(href)) return;
            closeCleanMode();
            return;
          }
          if (!href || href === '#' || href.startsWith('javascript')) return;
          // 外部网站或新窗口链接：不在清爽模式内拦截，保持清爽模式
          if (link.target === '_blank' || /^https?:\/\//i.test(href)) return;
          closeCleanMode();
        }, true);
      }
      // 与移动端顶栏共用同一套 setDrawerOpen / animateDrawer 状态机
      const open = !sidebar.classList.contains('display');
      syncCleanSidebarZ();
      deps.setDrawerOpen(sidebar, menuToggle, open);
      const siteToggler = document.getElementById('urppp-mobile-menu-button');
      if (siteToggler) {
        siteToggler.setAttribute('aria-expanded', open ? 'true' : 'false');
        siteToggler.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      }
    });
    el.__closeCleanDrawer = closeCleanSidebar;
    el.__syncCleanSidebarZ = syncCleanSidebarZ;
    el.__syncCleanThemeDots = syncCleanThemeDots;
    const ResizeObserverRef = globalThis.ResizeObserver;
    if (typeof ResizeObserverRef === 'function') {
      const cleanSidebarResizeObserver = new ResizeObserverRef(() => {
        if (state.open) syncCleanSidebarZ();
      });
      cleanSidebarResizeObserver.observe(el);
      const topEl = el.querySelector('.uc-top');
      if (topEl) cleanSidebarResizeObserver.observe(topEl);
      el.__cleanSidebarResizeObserver = cleanSidebarResizeObserver;
    }
    try {
      const media = window.matchMedia && window.matchMedia('(max-width: 900px)');
      if (media) {
        const onLayoutChange = () => {
          if (!state.open) return;
          syncCleanSidebarZ();
          deps.render();
        };
        if (typeof media.addEventListener === 'function') media.addEventListener('change', onLayoutChange);
        else if (typeof media.addListener === 'function') media.addListener(onLayoutChange);
        el.__scoreLayoutMedia = media;
        el.__scoreLayoutChange = onLayoutChange;
      }
    } catch (_) { /* ignore */ }
    try { deps.applySkinAttr(); } catch (_) { /* ignore */ }
    syncCleanThemeDots();
    el.querySelectorAll('#uc-tabbar button').forEach((btn) => {
      btn.onclick = () => {
        state.mobileTab = btn.dataset.tab;
        el.querySelectorAll('#uc-tabbar button').forEach((b) => b.classList.toggle('ac', b === btn));
        deps.render();
        // 小屏「教室」页需要主动拉 catalog；桌面是弹窗路径才加载
        if (state.mobileTab === 'room') deps.ensureRoomCatalogLoaded();
      };
    });
    ensureCalendarStyle();
    bindCalendarOpen(el);
    return el;
  }

  function openCleanMode(force) {
    ensureRoot();
    // 已在清爽模式内（例如点「刷新」）重进时不重播进入动画，只有首次打开才播放
    const alreadyOpen = state.open;
    state.open = true;
    state.uiReady = false;
    state.weekLocked = false;
    const curWeek = deps.getCurrentWeekNumber() || deps.readRememberedTermWeek();
    // 每次进入都按教学周重置；读不到时先用缓存，别默认 1
    state.viewWeek = curWeek >= 1 ? curWeek : (state.viewWeek >= 1 ? state.viewWeek : 0);
    document.documentElement.classList.add('urppp-clean-lock', deps.CLEAN_FLAG);
    const el = rootEl();
    el.classList.remove('closing');
    if (!alreadyOpen) {
      el.classList.remove('uc-settled', 'open');
      void el.offsetWidth; // 重触发根层进入动画
      el.classList.add('open');
    }
    // 清爽模式接管前停止站点抽屉可能仍在运行的帧循环，下一次开合仍走同一个 animateDrawer。
    try { deps.stopDrawerAnimation(document.getElementById('sidebar')); } catch (_) { /* ignore */ }
    try { if (el.__syncCleanThemeDots) el.__syncCleanThemeDots(); } catch (_) { /* ignore */ }
    try { if (el.__syncCleanSidebarZ) el.__syncCleanSidebarZ(); } catch (_) { /* ignore */ }
    // 桌面清爽模式也注入移动端侧边栏区块（用户卡/快捷区）
    try { deps.injectCleanSidebarSections(document.getElementById('sidebar')); } catch (_) { /* ignore */ }
    deps.loadAll(!!force);
    // 预加载教室查询（进入清爽模式即后台请求，用户点教室时已缓存，避免“加载蛮久”）
    try { deps.ensureRoomCatalogLoaded(); } catch (_) { /* ignore */ }
  }

  function closeCleanMode() {
    state.open = false;
    state.uiReady = false;
    deps.closeModal();
    document.documentElement.classList.remove('urppp-clean-lock', deps.CLEAN_FLAG);
    const el = rootEl();
    if (el) {
      // 退出动画：先收回矩形（closing），播完再移除 open
      el.classList.remove('open', 'uc-settled', 'uc-drawer-open');
      el.classList.add('closing');
      clearTimeout(el.__ucSettleTimer);
      try { if (el.__closeCleanDrawer) el.__closeCleanDrawer(); } catch (_) { /* ignore */ }
      setTimeout(() => { el.classList.remove('closing'); }, 360);
    }
    // 退出清爽模式后清理桌面注入的移动端区块（用户卡/快捷区/搜索面板），恢复桌面侧边栏
    try { deps.refreshMobileNavbar(); } catch (_) { /* ignore */ }
  }

  function injectCleanEntry() {
    try {
      deps.ensureStyle();
      let btn = document.getElementById('urppp-nav-clean');
      // 仅首页展示清爽入口；业务页移除残留按钮（移动端扩展逻辑见 list/mobile-nav-clean-entry.md）
      if (!deps.isHomePage()) {
        if (btn) btn.remove();
        removeCalendarButton();
        return;
      }
      const host = document.getElementById('urppp-nav-theme')
        || document.querySelector('#navbar .navbar-header')
        || document.querySelector('#navbar');
      if (!host) return;
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'urppp-nav-clean';
        btn.title = '清爽模式';
        btn.innerHTML = `${deps.ico('clean')}<span>清爽</span>`;
        btn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          openCleanMode(false);
        });
        host.appendChild(btn);
      }
      // 尺寸与布局由组件控制；形状、边框、材质由 Skin token 控制
      Object.entries({
        display: 'inline-flex', 'align-items': 'center', height: '28px', 'min-height': '28px',
        padding: '0 12px', 'font-size': '12px', gap: '6px',
        width: 'auto', float: 'none',
      }).forEach(([key, value]) => btn.style.setProperty(key, value, 'important'));
      ensureCalendarStyle();
      try { mountCalendarButton(); } catch (_) { /* ignore */ }
    } catch (error) {
      console.warn('[URP++] clean entry', error);
    }
  }

  const cleanModeApi = {
    open: openCleanMode,
    close: closeCleanMode,
    inject: injectCleanEntry,
    refresh: deps.refreshCleanPersonalDisplay,
    // 设置变更后即时重绘（如成绩分析展示方式切换）
    refreshRender: () => { try { deps.render(); } catch (_) { /* ignore */ } },
    scoreToGpa: deps.scoreToGpa,
    summarizeCourses: deps.summarizeCourses,
  };

  return {
    cleanModeApi,
    closeCleanMode,
    ensureRoot,
    injectCleanEntry,
    openCleanMode,
    rootEl,
  };
}
