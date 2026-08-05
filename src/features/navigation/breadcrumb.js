export function createBreadcrumbController({
  documentRef = document,
  locationRef = location,
  windowRef = window,
}) {
  function cleanMenuLabel(raw) {
    return String(raw || '')
      .replace(/[\u00a0\s]+/g, ' ')
      .replace(/^[>\u25b8\u203a·•\u00bb]+/, '')
      .replace(/^\s*[\u25b8>]\s*/, '')
      .trim();
  }

  function getMenuLiLabel(li) {
    if (!li) return '';
    const anchor = li.querySelector(':scope > a');
    if (!anchor) return '';
    const textEl = anchor.querySelector('.menu-text, .urppp-nav-text');
    if (textEl) return cleanMenuLabel(textEl.textContent);
    const clone = anchor.cloneNode(true);
    clone.querySelectorAll('i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow').forEach((node) => node.remove());
    return cleanMenuLabel(clone.textContent);
  }

  function walkMenuAncestors(li) {
    const stack = [];
    let node = li;
    const root = documentRef.getElementById('menus') || documentRef.getElementById('urppp-menus');
    while (node && node !== root) {
      if (node.tagName === 'LI') {
        const label = getMenuLiLabel(node);
        if (label && !/^(首页|一级菜单|二级菜单|三级菜单)$/.test(label)) {
          stack.unshift(label);
        }
      }
      node = node.parentElement;
    }
    return stack.filter((label, index) => label && label !== stack[index - 1]);
  }

  function findMenuLiByPath() {
    const path = locationRef.pathname.replace(/\/+$/, '') || '/';
    const search = locationRef.search || '';
    const candidates = [];
    const roots = [documentRef.getElementById('menus'), documentRef.getElementById('urppp-menus')].filter(Boolean);
    roots.forEach((root) => {
      root.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href') || '';
        if (!href || href === '#' || href.startsWith('javascript')) return;
        try {
          const url = new URL(href, locationRef.origin);
          const targetPath = url.pathname.replace(/\/+$/, '') || '/';
          if (targetPath === '/' && path !== '/') return;
          let score = 0;
          if (path === targetPath) score = 1000 + targetPath.length;
          else if (path.startsWith(targetPath + '/')) score = 500 + targetPath.length;
          else if (path.includes(targetPath) && targetPath.length > 8) score = 200 + targetPath.length;
          if (score && search && url.search && search.indexOf(url.search.slice(1)) >= 0) score += 50;
          if (score > 0) candidates.push({ score, li: anchor.closest('li') });
        } catch (_) { /* ignore */ }
      });
    });
    candidates.sort((a, b) => b.score - a.score);
    return candidates.length ? candidates[0].li : null;
  }

  function getBreadcrumbTrail() {
    // 1) 当前 URL 匹配菜单（最稳）
    const byPath = findMenuLiByPath();
    if (byPath) {
      const trail = walkMenuAncestors(byPath);
      if (trail.length) return trail;
    }

    // 2) cookie selectionBar + 原始 #menus
    let bar = '';
    try {
      const match = documentRef.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);
      if (match) bar = decodeURIComponent(match[1]);
    } catch (_) { /* ignore */ }
    if (bar && bar !== '0') {
      const node = documentRef.getElementById(bar);
      if (node) {
        const trail = walkMenuAncestors(node);
        if (trail.length) return trail;
      }
    }

    // 3) 原始 #menus / #urppp-menus 上的 .active
    let activeLi = null;
    const menuActives = Array.from(documentRef.querySelectorAll('#menus li.active'));
    if (menuActives.length) {
      activeLi = menuActives[menuActives.length - 1];
      for (let i = menuActives.length - 1; i >= 0; i--) {
        if (!menuActives[i].querySelector('li.active')) { activeLi = menuActives[i]; break; }
      }
    }
    if (!activeLi) {
      const urpActives = Array.from(documentRef.querySelectorAll('#urppp-menus .urppp-nav-item.active'));
      if (urpActives.length) {
        activeLi = urpActives[urpActives.length - 1];
        for (let i = urpActives.length - 1; i >= 0; i--) {
          if (!urpActives[i].querySelector('.urppp-nav-item.active')) { activeLi = urpActives[i]; break; }
        }
      }
    }
    if (activeLi) {
      const trail = walkMenuAncestors(activeLi);
      if (trail.length) return trail;
    }

    // 4) 已有 DOM（ACE 可能已填）
    const box = documentRef.getElementById('breadcrumbs') || documentRef.querySelector('.breadcrumbs');
    const ul = box && (box.querySelector('ul.breadcrumb') || box.querySelector('.breadcrumb'));
    if (ul) {
      const trail = [];
      Array.from(ul.children).forEach((item, index) => {
        if (index === 0) return;
        const label = cleanMenuLabel(item.textContent);
        if (!label || /^(首页|一级菜单|二级菜单|三级菜单)$/.test(label)) return;
        if (trail[trail.length - 1] === label) return;
        trail.push(label);
      });
      if (trail.length) return trail;
    }
    return [];
  }

  function beautifyBreadcrumbs() {
    const box = documentRef.getElementById('breadcrumbs') || documentRef.querySelector('.breadcrumbs');
    if (!box) return;
    box.classList.remove('hide');
    box.style.removeProperty('display');
    box.style.setProperty('display', 'flex', 'important');

    let ul = box.querySelector('ul.breadcrumb') || box.querySelector('.breadcrumb');
    if (!ul) {
      ul = documentRef.createElement('ul');
      ul.className = 'breadcrumb';
      box.appendChild(ul);
    }

    const trail = getBreadcrumbTrail();
    // trail 为空时不覆盖已有真实路径，避免和 ACE 竞态把内容清空
    if (!trail.length) {
      const existing = Array.from(ul.children).map((item) => cleanMenuLabel(item.textContent)).filter(Boolean);
      const hasReal = existing.some((label) => label !== '首页' && !/^(一级菜单|二级菜单|三级菜单)$/.test(label));
      if (hasReal) return;
    }

    ul.innerHTML = '';

    const home = documentRef.createElement('li');
    home.style.cursor = 'pointer';
    home.innerHTML = '<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>';
    home.addEventListener('click', () => { windowRef.location.href = '/'; });
    ul.appendChild(home);

    trail.forEach((label, index) => {
      const li = documentRef.createElement('li');
      if (index === trail.length - 1) li.classList.add('active');
      const span = documentRef.createElement('span');
      span.className = 'urppp-bc-label';
      span.textContent = label;
      li.appendChild(span);
      ul.appendChild(li);
    });
  }

  return { beautifyBreadcrumbs };
}
