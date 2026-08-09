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
    const syncCleanSidebarZ = () => {
      const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      if (state.open) {
        sidebar.classList.add('urppp-clean-sidebar');
        if (!sidebar.__urpppCleanZ) {
          const s = sidebar.style;
          sidebar.__urpppCleanZ = s.getPropertyValue('z-index');
          sidebar.__urpppCleanZP = s.getPropertyPriority('z-index');
          sidebar.__urpppCleanPos = s.getPropertyValue('position');
          sidebar.__urpppCleanPosP = s.getPropertyPriority('position');
        }
        // 站点内联 z-index:1030 !important 需被覆盖：JS 内联 important 后设者胜
        sidebar.style.setProperty('z-index', '12030', 'important');
        sidebar.style.setProperty('position', 'fixed', 'important');
      } else {
        sidebar.classList.remove('urppp-clean-sidebar');
        if (sidebar.__urpppCleanZ !== undefined) {
          if (sidebar.__urpppCleanZ) sidebar.style.setProperty('z-index', sidebar.__urpppCleanZ, sidebar.__urpppCleanZP || '');
          else sidebar.style.removeProperty('z-index');
          if (sidebar.__urpppCleanPos) sidebar.style.setProperty('position', sidebar.__urpppCleanPos, sidebar.__urpppCleanPosP || '');
          else sidebar.style.removeProperty('position');
          delete sidebar.__urpppCleanZ;
          delete sidebar.__urpppCleanZP;
          delete sidebar.__urpppCleanPos;
          delete sidebar.__urpppCleanPosP;
        }
      }
    };
    const closeCleanSidebar = () => {
      const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      if (sidebar.classList.contains('display')) {
        const toggler = document.getElementById('urppp-mobile-menu-button');
        if (toggler) {
          toggler.setAttribute('aria-expanded', 'false');
          toggler.setAttribute('aria-label', '打开菜单');
        }
        sidebar.classList.remove('display');
      }
      sidebar.classList.remove('urppp-clean-sidebar');
    };
    if (menuToggle) menuToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      // 绑定在 sidebar 上的菜单点击：关闭清爽模式（sidebar 随 PJAX 重建，监听不泄漏）
      if (!sidebar.__urpppCleanMenuBound) {
        sidebar.__urpppCleanMenuBound = true;
        sidebar.addEventListener('click', (ev) => {
          if (!state.open) return;
          const link = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
          if (!link) return;
          const href = String(link.getAttribute('href') || '').trim();
          if (!href || href === '#' || href.startsWith('javascript')) return;
          closeCleanMode();
        });
      }
      const toggler = document.getElementById('urppp-mobile-menu-button');
      // 移动端模式：复用现成汉堡按钮逻辑（含动画）；桌面：直接切 .display
      if (toggler && toggler.__urpppToggleHandler) {
        toggler.__urpppToggleHandler(event);
      } else {
        const open = !sidebar.classList.contains('display');
        sidebar.classList.toggle('display', open);
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      syncCleanSidebarZ();
    });
    el.__closeCleanDrawer = closeCleanSidebar;
    el.__syncCleanSidebarZ = syncCleanSidebarZ;
    el.__syncCleanThemeDots = syncCleanThemeDots;
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
    return el;
  }

  function openCleanMode(force) {
    ensureRoot();
    state.open = true;
    state.uiReady = false;
    state.weekLocked = false;
    const curWeek = deps.getCurrentWeekNumber() || deps.readRememberedTermWeek();
    // 每次进入都按教学周重置；读不到时先用缓存，别默认 1
    state.viewWeek = curWeek >= 1 ? curWeek : (state.viewWeek >= 1 ? state.viewWeek : 0);
    document.documentElement.classList.add('urppp-clean-lock', deps.CLEAN_FLAG);
    const el = rootEl();
    el.classList.remove('uc-settled', 'open');
    void el.offsetWidth; // 重触发根层进入动画
    el.classList.add('open');
    try { if (el.__syncCleanThemeDots) el.__syncCleanThemeDots(); } catch (_) { /* ignore */ }
    try { if (el.__syncCleanSidebarZ) el.__syncCleanSidebarZ(); } catch (_) { /* ignore */ }
    deps.loadAll(!!force);
  }

  function closeCleanMode() {
    state.open = false;
    state.uiReady = false;
    deps.closeModal();
    document.documentElement.classList.remove('urppp-clean-lock', deps.CLEAN_FLAG);
    const el = rootEl();
    if (el) {
      el.classList.remove('open', 'uc-settled', 'uc-drawer-open');
      clearTimeout(el.__ucSettleTimer);
      try { if (el.__closeCleanDrawer) el.__closeCleanDrawer(); } catch (_) { /* ignore */ }
    }
  }

  function injectCleanEntry() {
    try {
      deps.ensureStyle();
      let btn = document.getElementById('urppp-nav-clean');
      // 仅首页展示清爽入口；业务页移除残留按钮（移动端扩展逻辑见 list/mobile-nav-clean-entry.md）
      if (!deps.isHomePage()) {
        if (btn) btn.remove();
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
