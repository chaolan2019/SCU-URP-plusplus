export function createNavbarController({
  theme,
  settings,
  documentRef = document,
  windowRef = window,
}) {
  function syncThemeDotGroup(wrap) {
    if (!wrap) return;
    const skinId = theme.getSkin();
    const brutal = theme.skinSupportsFixedPalettes(skinId);
    const currentTheme = theme.getCurrent();
    const brutalActive = brutal ? theme.getBrutalActivePalette() : null;
    const brutalSelected = brutal ? theme.getBrutalSelectedPalette() : null;
    wrap.querySelectorAll('.urppp-nav-dot[data-theme]').forEach((dot) => {
      const dotTheme = dot.dataset.theme;
      const isDark = dotTheme === 'dark';
      const isDynamic = dotTheme === 'scu-red';
      const disabled = (isDark && !theme.skinSupportsDark(skinId)) || (isDynamic && !theme.skinSupportsDynamic(skinId) && !brutal);
      let active = dotTheme === currentTheme;
      if (brutal) {
        active = (dotTheme === 'default' && brutalActive.id === theme.BRUTAL_DEFAULT_PALETTE)
          || (isDynamic && brutalActive.id !== theme.BRUTAL_DEFAULT_PALETTE);
      }
      dot.disabled = disabled;
      dot.classList.toggle('urppp-theme-disabled', disabled);
      dot.classList.toggle('ac', active && !disabled);
      dot.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      if (dotTheme === 'default') {
        dot.style.background = brutal ? theme.getBrutalPaletteById(theme.BRUTAL_DEFAULT_PALETTE).accent : '#F1F3F5';
        dot.title = brutal ? '默认高能粉' : '简约白';
      } else if (isDark) {
        dot.style.background = disabled ? '#A7A7A7' : '#0B0F14';
        dot.title = disabled ? '当前界面风格不支持暗色模式' : '深邃暗';
      } else if (isDynamic) {
        if (disabled) {
          dot.style.background = '#A7A7A7';
          dot.title = '当前界面风格不支持动态配色';
        } else if (brutal) {
          dot.style.background = brutalSelected.accent;
          dot.title = '高对比配色：' + brutalSelected.name;
        } else {
          const seed = theme.getAccent() || theme.DEFAULT_SEED;
          try {
            const preview = theme.buildSchemePreview(seed, theme.getScheme());
            dot.style.background = 'linear-gradient(135deg, ' + preview.primary + ' 0 55%, ' + preview.surface + ' 55% 100%)';
          } catch (_) {
            dot.style.background = seed;
          }
          dot.title = '动态配色';
        }
      }
    });
  }

  function handleThemeDotClick(dotTheme) {
    const skinId = theme.getSkin();
    if (theme.skinSupportsFixedPalettes(skinId)) {
      if (dotTheme === 'dark') return;
      if (theme.getCurrent() !== 'default') theme.applyTheme('default', { manual: true });
      if (dotTheme === 'default') theme.setBrutalPalette(theme.BRUTAL_DEFAULT_PALETTE);
      if (dotTheme === 'scu-red') theme.setBrutalPalette(theme.getBrutalSelectedPalette().id);
      return;
    }
    if (!theme.isThemeModeAvailable(dotTheme, skinId)) return;
    theme.applyTheme(dotTheme, { manual: true });
  }

  function syncNavbarThemeUI() {
    syncThemeDotGroup(documentRef.getElementById('urppp-nav-theme'));
  }

  function injectNavbarThemeSwitch() {
    try {
      const navbar = documentRef.getElementById('navbar') || documentRef.querySelector('.navbar');
      if (!navbar) return;
      if (documentRef.getElementById('urppp-nav-theme')) {
        syncNavbarThemeUI();
        return;
      }
      const brand =
        navbar.querySelector('.navbar-header .navbar-brand') ||
        navbar.querySelector('.navbar-brand') ||
        navbar.querySelector('.navbar-header');
      if (!brand) return;

      const wrap = documentRef.createElement('div');
      wrap.id = 'urppp-nav-theme';
      wrap.innerHTML = [
        '<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>',
        '<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>',
        '<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>',
        '<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">',
        '  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
        '    <circle cx="12" cy="12" r="3"></circle>',
        '    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
        '  </svg>',
        '</button>',
      ].join('');

      if (brand.parentElement) {
        brand.parentElement.style.setProperty('display', 'flex', 'important');
        brand.parentElement.style.setProperty('align-items', 'center', 'important');
        if (brand.nextSibling) brand.parentElement.insertBefore(wrap, brand.nextSibling);
        else brand.parentElement.appendChild(wrap);
      } else {
        brand.appendChild(wrap);
      }
      wrap.style.setProperty('display', 'inline-flex', 'important');
      wrap.style.setProperty('align-items', 'center', 'important');
      wrap.style.setProperty('height', '36px', 'important');

      wrap.querySelectorAll('.urppp-nav-dot[data-theme]').forEach((dot) => {
        dot.addEventListener('click', () => {
          handleThemeDotClick(dot.dataset.theme);
          syncNavbarThemeUI();
          try { settings.syncSettingsPanelUI(); } catch (_) { /* ignore */ }
        });
      });
      wrap.querySelector('#urppp-nav-settings').addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        settings.openSettingsPanel();
      });

      settings.ensureSettingsPanel();
      syncNavbarThemeUI();
      try { if (windowRef.__urpppCleanMode) windowRef.__urpppCleanMode.inject(); } catch (_) { /* ignore */ }
    } catch (error) {
      console.warn('[URP++] navbar theme switch inject failed', error);
    }
  }

  function rebuildNavbar() {
    const navbar = documentRef.getElementById('navbar');
    const aceNav = navbar?.querySelector('.ace-nav');
    // 主题切换不依赖 ace-nav，尽早注入
    try { injectNavbarThemeSwitch(); } catch (_) { /* ignore */ }
    if (!aceNav) return;

    function force(element, styles) {
      Object.entries(styles).forEach(([key, value]) => element.style.setProperty(key, value, 'important'));
    }

    // 1. 统一所有 li 和 a 的容器样式；移除 ace-nav 中的空白文本节点消除 inline 间距
    Array.from(aceNav.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
        node.remove();
      }
    });
    aceNav.querySelectorAll(':scope > li').forEach((li) => {
      force(li, {
        display: 'inline-flex',
        'align-items': 'center',
        'vertical-align': 'middle',
        margin: '0',
        padding: '0',
        'text-align': 'left',
      });
    });

    aceNav.querySelectorAll(':scope > li > a').forEach((anchor) => {
      force(anchor, {
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        height: '36px',
        padding: '0 4px',
        'flex-wrap': 'nowrap',
        'vertical-align': 'middle',
        'text-decoration': 'none',
      });
      anchor.style.lineHeight = '1';
    });

    // 2. 图标统一
    aceNav.querySelectorAll(':scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa').forEach((icon) => {
      force(icon, { top: 'auto', 'vertical-align': 'middle', 'line-height': '1', 'margin-top': '0' });
    });

    // 客服图标所在的 a 标签保持最小宽度
    const serviceLink = aceNav.querySelector(':scope > li > a[href*="customerServiceCenter"]');
    if (serviceLink) {
      force(serviceLink, { width: '28px', 'justify-content': 'center' });
      serviceLink.style.padding = '0 4px';
    }

    // 3. 搜索区域（事件只绑定一次）
    const clickDiv = documentRef.getElementById('clickdiv');
    const formSearch = documentRef.getElementById('form-search');
    const searchInput = documentRef.getElementById('search-input');
    const intelDiv = documentRef.getElementById('intellegenceUDiv');
    if (intelDiv) {
      intelDiv.style.setProperty('position', 'relative', 'important');
      intelDiv.style.setProperty('z-index', '30', 'important');
      intelDiv.style.setProperty('display', 'inline-flex', 'important');
      intelDiv.style.setProperty('align-items', 'center', 'important');
      intelDiv.style.setProperty('justify-content', 'center', 'important');
      intelDiv.style.setProperty('width', '32px', 'important');
      intelDiv.style.setProperty('height', '36px', 'important');
      intelDiv.style.setProperty('vertical-align', 'middle', 'important');
      intelDiv.style.setProperty('margin', '0', 'important');
      intelDiv.style.setProperty('padding', '0', 'important');
    }

    if (clickDiv && formSearch) {
      clickDiv.removeAttribute('onclick');
      force(clickDiv, {
        'background-color': 'transparent',
        position: 'relative',
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        width: '32px',
        height: '32px',
        'border-radius': '8px',
        'line-height': '1',
        'z-index': '30',
      });

      const clicki = documentRef.getElementById('clicki');
      if (clicki) force(clicki, { color: 'var(--text-secondary)', 'margin-top': '0' });

      if (!clickDiv.__urpppNavbarClickBound) {
        clickDiv.__urpppNavbarClickBound = true;
        clickDiv.addEventListener('mouseenter', () => clickDiv.style.setProperty('background-color', 'var(--input-bg)', 'important'));
        clickDiv.addEventListener('mouseleave', () => clickDiv.style.setProperty('background-color', 'transparent', 'important'));

        clickDiv.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const isOpen = formSearch.dataset.open === '1';
          if (isOpen) {
            formSearch.style.width = '0px';
            formSearch.style.opacity = '0';
            formSearch.dataset.open = '0';
          } else {
            formSearch.style.width = '180px';
            formSearch.style.opacity = '1';
            formSearch.dataset.open = '1';
            if (searchInput) setTimeout(() => searchInput.focus(), 50);
          }
        });
      }

      if (!windowRef.__urpppNavbarOutsideClickBound) {
        windowRef.__urpppNavbarOutsideClickBound = true;
        documentRef.addEventListener('click', (event) => {
          const activeClickDiv = documentRef.getElementById('clickdiv');
          const activeFormSearch = documentRef.getElementById('form-search');
          if (!activeClickDiv || !activeFormSearch || activeFormSearch.dataset.open !== '1') return;
          if (!activeClickDiv.contains(event.target) && !activeFormSearch.contains(event.target)) {
            activeFormSearch.style.width = '0px';
            activeFormSearch.style.opacity = '0';
            activeFormSearch.dataset.open = '0';
          }
        });
      }

      // 定位：紧贴搜索按钮左侧，按钮本身 32px，搜索框 160px
      force(formSearch, {
        position: 'absolute',
        right: '34px',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 'auto',
        margin: '0',
        'z-index': '10',
        background: 'transparent',
        border: 'none',
        'box-shadow': 'none',
        overflow: 'hidden',
        padding: '0',
        transition: 'width .2s ease, opacity .2s ease',
      });
      // 注意：不要在 force 里覆盖 width/opacity，否则会打断正在进行的 transition
      const targetWidth = formSearch.dataset.open === '1' ? '160px' : '0px';
      if (formSearch.style.width !== targetWidth) {
        formSearch.style.width = targetWidth;
        formSearch.style.opacity = formSearch.dataset.open === '1' ? '1' : '0';
      }

      if (searchInput) {
        force(searchInput, {
          'background-color': 'var(--input-bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          'border-radius': '8px',
          height: '32px',
          padding: '0 12px',
          'line-height': '32px',
          width: '100%',
        });
      }

      const innerIcon = formSearch.querySelector('.input-icon > .ace-icon.fa-search');
      if (innerIcon) innerIcon.style.display = 'none';
    }

    // 4. 用户项强制对齐
    const userLink = aceNav.querySelector(':scope > li.light-blue > a');
    if (userLink) {
      force(userLink, { display: 'inline-flex', 'align-items': 'center', gap: '6px' });
      const info = userLink.querySelector('.user-info');
      if (info) {
        force(info, {
          display: 'inline-flex',
          'align-items': 'center',
          gap: '4px',
          'max-width': 'none',
          'white-space': 'nowrap',
          'vertical-align': 'middle',
          'line-height': '1',
          'margin-top': '-12px',
        });
        // 移除文本节点中的多余空白
        Array.from(info.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\s+/g, '').trim();
        });
        Array.from(info.children).forEach((child) => {
          force(child, { display: 'inline', 'white-space': 'nowrap', 'vertical-align': 'middle', 'line-height': '1', margin: '0', padding: '0' });
          if (child.tagName === 'SMALL') child.style.setProperty('font-size', 'inherit', 'important');
        });
      }
      const photo = userLink.querySelector('.nav-user-photo');
      if (photo) {
        photo.alt = (photo.alt || '').replace(/\s+/g, '').trim();
        force(photo, { 'vertical-align': 'middle', display: 'inline-block', width: '30px', height: '30px' });
      }
    }
  }

  return {
    handleThemeDotClick,
    injectNavbarThemeSwitch,
    rebuildNavbar,
    syncNavbarThemeUI,
    syncThemeDotGroup,
  };
}
