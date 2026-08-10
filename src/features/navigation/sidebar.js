export function createSidebarController({
  documentRef = document,
  windowRef = window,
  MutationObserverRef = MutationObserver,
  nodeTypeRef = Node,
}) {
  function syncMobileContentOffset() {
    try {
      const sidebar = documentRef.getElementById('sidebar');
      const mains = documentRef.querySelectorAll('.main-content');
      if (!mains.length) return;
      const narrow = windowRef.matchMedia && windowRef.matchMedia('(max-width: 991px)').matches;
      let marginLeft = '260px';
      if (narrow) {
        marginLeft = '0px';
      } else if (sidebar) {
        marginLeft = sidebar.classList.contains('menu-min') ? '50px' : '260px';
      }
      mains.forEach((el) => el.style.setProperty('margin-left', marginLeft, 'important'));
    } catch (_) { /* ignore */ }
  }

  function syncSidebarUnderNavbar() {
    try {
      const sidebar = documentRef.getElementById('sidebar');
      const navbar = documentRef.querySelector('#navbar, .navbar.navbar-default, .navbar-fixed-top');
      if (!sidebar || !navbar) return;
      const rect = navbar.getBoundingClientRect();
      const navbarHeight = Math.max(45, Math.round(rect.height || navbar.offsetHeight || 45));
      documentRef.documentElement.style.setProperty('--urppp-navbar-height', navbarHeight + 'px');
      sidebar.style.setProperty('top', navbarHeight + 'px', 'important');
      sidebar.style.setProperty('height', 'calc(100vh - ' + navbarHeight + 'px)', 'important');
      sidebar.style.setProperty('margin-top', '0', 'important');
      navbar.style.setProperty('z-index', '1100', 'important');
      sidebar.style.setProperty('z-index', '1030', 'important');
      syncMobileContentOffset();
    } catch (_) { /* ignore */ }
  }

  function rebuildSidebarCompletely() {
    const sidebar = documentRef.getElementById('sidebar');
    const origMenus = documentRef.getElementById('menus');
    if (!sidebar || !origMenus) return;

    if (windowRef.__urpppSidebarMenuObserver) {
      try { windowRef.__urpppSidebarMenuObserver.disconnect(); } catch (_) { /* ignore */ }
      windowRef.__urpppSidebarMenuObserver = null;
    }

    // 先清理旧的（可能从 PJAX 残留）
    const oldMenus = documentRef.getElementById('urppp-menus');
    const oldHeader = sidebar.querySelector('.urppp-sidebar-header');
    if (oldMenus) oldMenus.remove();
    if (oldHeader) oldHeader.remove();

    // 读取顶栏高度并同步：侧栏顶边紧贴顶栏底边
    syncSidebarUnderNavbar();

    // 记录原 active 状态
    const activeIds = new Set();
    origMenus.querySelectorAll('li.active').forEach((li) => { if (li.id) activeIds.add(li.id); });

    function parseMenu(ul) {
      return Array.from(ul.children).filter((li) => li.tagName === 'LI').map((li) => {
        const anchor = li.querySelector(':scope > a');
        const textEl = anchor?.querySelector('.menu-text');
        const text = textEl
          ? textEl.textContent.trim()
          : (anchor
            ? Array.from(anchor.childNodes).filter((node) => node.nodeType === nodeTypeRef.TEXT_NODE).map((node) => node.textContent).join('').trim()
            : '');
        const iconEl = anchor?.querySelector('.menu-icon');
        const iconClass = iconEl ? Array.from(iconEl.classList).filter((c) => c !== 'menu-icon').join(' ') : '';
        const submenu = li.querySelector(':scope > .submenu');
        let children = submenu ? parseMenu(submenu) : [];
        // 过滤空壳子节点（无文字且无有效 href）
        children = children.filter((child) => child.text && (child.text.trim() || (child.href && child.href !== '#')));
        const href = anchor?.getAttribute('href') || '#';
        const target = anchor?.getAttribute('target') || '';
        const onclick = li.getAttribute('onclick') || anchor?.getAttribute('onclick') || '';
        const id = li.id;
        // 有真实 href 的节点：忽略子菜单，直接当叶子
        if (href !== '#' && !href.startsWith('javascript')) {
          return { id, text, iconClass, children: [], href, target, onclick };
        }

        // 单叶子子菜单提升：父节点直接变成跳转节点，不再展开
        if (children.length === 1 && children[0].children.length === 0) {
          return {
            id: id || children[0].id,
            text,
            iconClass: iconClass || children[0].iconClass,
            children: [],
            href: children[0].href || href,
            target: children[0].target || target,
            onclick: children[0].onclick || onclick,
          };
        }
        return { id, text, iconClass, children, href, target, onclick };
      });
    }

    const menuData = parseMenu(origMenus);
    origMenus.style.display = 'none';

    // Header + toggle
    const header = documentRef.createElement('div');
    header.className = 'urppp-sidebar-header';
    header.style.cssText = 'position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)';
    const toggle = documentRef.createElement('button');
    toggle.type = 'button';
    toggle.className = 'urppp-sidebar-toggle';
    toggle.innerHTML = '<i class="fa fa-angle-left" aria-hidden="true"></i>';
    toggle.title = '收起侧边栏';
    if (typeof toggle.setAttribute === 'function') toggle.setAttribute('aria-label', '收起侧边栏');
    const isNarrow = () => !!(windowRef.matchMedia && windowRef.matchMedia('(max-width: 991px)').matches);
    const doToggle = (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (isNarrow()) {
        sidebar.classList.remove('display');
        syncMobileContentOffset();
        return;
      }
      const origToggle = documentRef.getElementById('sidebar-collapse');
      if (origToggle) origToggle.click();
    };
    toggle.addEventListener('click', doToggle);
    header.appendChild(toggle);

    // 监听折叠状态，切换箭头；移动端始终表示关闭抽屉
    const syncToggle = () => {
      const narrow = isNarrow();
      const isMin = documentRef.body.classList.contains('menu-min') || sidebar.classList.contains('menu-min');
      const label = narrow ? '关闭菜单' : (isMin ? '展开侧边栏' : '收起侧边栏');
      toggle.innerHTML = narrow
        ? '<i class="fa fa-times" aria-hidden="true"></i>'
        : (isMin ? '<i class="fa fa-angle-right" aria-hidden="true"></i>' : '<i class="fa fa-angle-left" aria-hidden="true"></i>');
      toggle.title = label;
      if (typeof toggle.setAttribute === 'function') toggle.setAttribute('aria-label', label);
      if (!narrow && isMin) {
        header.style.justifyContent = 'center';
        header.style.padding = '12px 0';
      } else {
        header.style.justifyContent = 'flex-end';
        header.style.padding = '';
      }
    };
    const observer = new MutationObserverRef(syncToggle);
    observer.observe(documentRef.body, { attributes: true, attributeFilter: ['class'] });
    observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    windowRef.__urpppSidebarMenuObserver = observer;
    syncToggle();

    const newMenus = documentRef.createElement('ul');
    newMenus.id = 'urppp-menus';
    newMenus.style.cssText = 'margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)';

    function setActiveBranch(li) {
      documentRef.querySelectorAll('#urppp-menus .urppp-nav-item').forEach((el) => el.classList.remove('active'));
      let node = li;
      while (node && node.id !== 'urppp-menus') {
        if (node.classList.contains('urppp-nav-item')) node.classList.add('active');
        node = node.parentElement;
      }
    }

    function buildItem(item, container) {
      const li = documentRef.createElement('li');
      li.className = 'urppp-nav-item';
      if (item.id) li.id = item.id;

      const hasSub = item.children.length > 0;
      const href = item.href || '#';
      const hasRealHref = href !== '#' && !href.startsWith('javascript');
      const link = documentRef.createElement('a');
      link.className = 'urppp-nav-link';
      link.href = hasRealHref ? href : 'javascript:void(0)';
      if (item.target) link.setAttribute('target', item.target);

      if (item.iconClass) {
        const icon = documentRef.createElement('i');
        item.iconClass.split(' ').forEach((c) => { if (c) icon.classList.add(c); });
        link.appendChild(icon);
      }

      const text = documentRef.createElement('span');
      text.className = 'urppp-nav-text';
      text.textContent = item.text;
      text.title = item.text;
      link.appendChild(text);

      if (hasSub) {
        const arrow = documentRef.createElement('i');
        arrow.className = 'urppp-nav-arrow fa fa-angle-down';
        arrow.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          li.classList.toggle('open');
        });
        link.appendChild(arrow);
      }

      li.appendChild(link);

      link.addEventListener('click', (event) => {
        setActiveBranch(li);
        if (!hasRealHref && hasSub) {
          event.preventDefault();
          li.classList.toggle('open');
        } else if (hasRealHref) {
          return;
        }
      });

      if (hasSub) {
        const sub = documentRef.createElement('ul');
        sub.className = 'urppp-nav-submenu';
        item.children.forEach((child) => buildItem(child, sub));
        li.appendChild(sub);
      }

      if (item.id && activeIds.has(item.id)) {
        li.classList.add('active');
      }

      container.appendChild(li);
    }

    menuData.forEach((item) => buildItem(item, newMenus));
    // 强制清除所有 open 状态，避免默认展开
    newMenus.querySelectorAll('.urppp-nav-item.open').forEach((li) => li.classList.remove('open'));

    sidebar.insertBefore(header, sidebar.firstChild);
    sidebar.appendChild(newMenus);
  }

  return { rebuildSidebarCompletely, syncMobileContentOffset, syncSidebarUnderNavbar };
}
