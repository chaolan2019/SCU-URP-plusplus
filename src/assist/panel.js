export function createAssistPanel({ login, evaluation, deps }) {
  const uiState = { injected: false };

  function ensureSubPanel() {
    let panel = document.getElementById('urpppp-subpanel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'urpppp-subpanel';
    panel.innerHTML = `
      <div class="urpppp-sub-head">
        <div class="urpppp-sub-title" id="urpppp-sub-title">助手设置</div>
        <button type="button" class="urpppp-sub-close" id="urpppp-sub-close" aria-label="关闭">×</button>
      </div>
      <div class="urpppp-sub-body" id="urpppp-sub-body"></div>
    `;
    document.documentElement.appendChild(panel);
    panel.querySelector('#urpppp-sub-close').onclick = closeSubPanel;
    return panel;
  }

  function placeSubPanelLikeMain() {
    const main = document.getElementById('urppp-settings-panel');
    const sub = document.getElementById('urpppp-subpanel');
    if (!main || !sub) return;
    const r = main.getBoundingClientRect();
    // 与主设置窗同位同尺寸，避免飘到别处
    const top = Math.max(8, r.top);
    const left = Math.max(8, r.left);
    const width = Math.max(320, r.width || 420);
    const maxHeight = Math.max(240, r.height || (window.innerHeight - top - 16));
    sub.style.top = top + 'px';
    sub.style.left = left + 'px';
    sub.style.width = width + 'px';
    sub.style.maxHeight = maxHeight + 'px';
    sub.style.right = 'auto';
    sub.style.bottom = 'auto';
  }

  function openSubPanel(kind) {
    deps.settingsStyles();
    const sub = ensureSubPanel();
    const body = sub.querySelector('#urpppp-sub-body');
    const title = sub.querySelector('#urpppp-sub-title');
    if (!body || !title) return;
    body.innerHTML = '';
    if (kind === 'login') {
      title.textContent = '登录助手';
      const sec = login.buildLoginSection();
      body.appendChild(sec);
      login.bindLoginSection(sec);
    } else {
      title.textContent = '评教助手';
      const sec = evaluation.buildEvalSection();
      body.appendChild(sec);
      evaluation.bindEvalSection(sec);
    }
    placeSubPanelLikeMain();
    sub.classList.add('open');
    // 主设置若在滚动/动画，再贴一次位置
    setTimeout(placeSubPanelLikeMain, 30);
  }

  function closeSubPanel() {
    const sub = document.getElementById('urpppp-subpanel');
    if (!sub) return;
    sub.classList.remove('open');
    const body = sub.querySelector('#urpppp-sub-body');
    if (body) body.innerHTML = '';
  }

  function injectSettingsPanel() {
    const panel = document.getElementById('urppp-settings-panel');
    if (!panel) return false;
    // 优先挂到系统设置槽；兼容旧版整页 body
    const body = panel.querySelector('#urppp-set-assist-slot')
      || panel.querySelector('.urppp-set-pane[data-pane="system"]')
      || panel.querySelector('.urppp-set-body');
    if (!body) return false;
    deps.settingsStyles();
    // 旧版直接塞进主设置的大段配置：清理掉，改入口按钮
    const oldLogin = document.getElementById('urpppp-login-sec');
    const oldEval = document.getElementById('urpppp-eval-sec');
    if (oldLogin && oldLogin.closest('#urppp-settings-panel')) oldLogin.remove();
    if (oldEval && oldEval.closest('#urppp-settings-panel')) oldEval.remove();

    // 若入口曾挂在 body 底部，迁到系统设置槽
    let entry = document.getElementById('urpppp-entry-sec');
    if (entry && body.id === 'urppp-set-assist-slot' && entry.parentElement !== body) {
      entry.remove();
      entry = null;
    }

    if (!document.getElementById('urpppp-entry-sec')) {
      entry = document.createElement('section');
      entry.className = 'urppp-set-sec urpppp-entry-sec';
      entry.id = 'urpppp-entry-sec';
      entry.innerHTML = `
        <h3>辅助插件</h3>
        <div class="urpppp-entry-grid">
          <button type="button" class="urppp-set-btn" id="urpppp-open-login">登录助手</button>
          <button type="button" class="urppp-set-btn" id="urpppp-open-eval">评教助手</button>
        </div>
        <p class="urpppp-tip">辅助插件 v${deps.URPPPP_VERSION}</p>
      `;
      body.appendChild(entry);
      entry.querySelector('#urpppp-open-login').onclick = () => openSubPanel('login');
      entry.querySelector('#urpppp-open-eval').onclick = () => openSubPanel('eval');
    }

    // 主设置关闭时，子面板一并关
    if (!panel.__urppppCloseHooked) {
      panel.__urppppCloseHooked = true;
      const closeBtn = panel.querySelector('#urppp-set-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeSubPanel());
      }
      const mask = document.getElementById('urppp-settings-mask');
      if (mask && !mask.__urppppCloseHooked) {
        mask.__urppppCloseHooked = true;
        mask.addEventListener('click', () => closeSubPanel());
      }
    }
    uiState.injected = true;
    return true;
  }

  function watchSettingsPanel() {
    if (window.__urppppSettingsWatchBound) return;
    window.__urppppSettingsWatchBound = true;
    const tryInject = () => { try { injectSettingsPanel(); } catch (e) { console.warn(e); } };
    let injectTimer = 0;
    const scheduleInject = (delay) => {
      clearTimeout(injectTimer);
      injectTimer = setTimeout(tryInject, delay);
    };
    const settingsSelector = '#urppp-settings-panel, #urppp-set-assist-slot, .urppp-set-body';
    const containsSettingsNode = (node) => {
      if (!node || ![1, 11].includes(node.nodeType)) return false;
      if (node.matches && node.matches(settingsSelector)) return true;
      return Boolean(node.querySelector && node.querySelector(settingsSelector));
    };
    tryInject();
    const obs = new MutationObserver((mutations) => {
      const relevant = mutations.some((mutation) => Array.from(mutation.addedNodes || []).some(containsSettingsNode));
      if (relevant) scheduleInject(30);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('#urppp-nav-settings') || t.closest('#uc-settings') || t.closest('.urppp-nav-settings')) {
        setTimeout(tryInject, 50);
        setTimeout(tryInject, 200);
      }
    }, true);
  }

  return {
    closeSubPanel,
    injectSettingsPanel,
    openSubPanel,
    watchSettingsPanel,
  };
}
