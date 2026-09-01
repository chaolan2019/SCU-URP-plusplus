/**
 * @file 培养方案查增强（plan-enhance）
 * @author ma
 * @date 2026-09-01
 * @version 1.1.0
 *
 * 针对 /student/integratedQuery/planCompletion/getPyfaIndex/ 页面：
 *  1) 点击课程节点复制课程号
 *  2) header 下方搜索区：输入课程号/课程名 + 「查找」按钮 → 展开祖先链、滚动到第一个命中课程并高亮
 *  3) header 常驻（sticky，不随滚动容器滚出视口）
 *
 * 依赖 zTree 骨架（#treeDemo），与 beautifyPlanTree 共建，两者互不干扰：
 * 本模块只读课程号/课程名文本 + 操作 zTree 的展开/高亮/滚动，不改节点 HTML。
 */

/** 从课程节点里嗅探课程号（兼容已格式化 .urppp-code span 与裸 [code] 文本） */
function extractCourseCodeFromNode(a) {
  if (!a) return '';
  // 优先：已格式化的 urppp-code span
  const codeEl = a.querySelector('.urppp-code');
  if (codeEl) {
    const t = (codeEl.textContent || '').trim();
    if (/^\d{6,}$/.test(t)) return t;
  }
  const text = a.textContent || '';
  const m = text.match(/\[(\d{6,})\]/);
  return m ? m[1] : '';
}

/** 从课程节点文本里嗅探课程名（优先已格式化 .urppp-title span） */
function extractCourseName(nodeText, a) {
  if (!nodeText) return '';
  if (a) {
    const t = a.querySelector('.urppp-title');
    if (t) return (t.textContent || '').replace(/\s+/g, ' ').trim();
  }
  // 形态 A：[code]课程名[学分,学期](类型,成绩)
  const m = nodeText.match(/^\[[^\]]+\]\s*([^【\[]*?)(?=\s*(?:\[|\(|$))/);
  if (m && m[1]) return m[1].replace(/\s+/g, ' ').trim();
  // 形态 B：已格式化后 title 在 urppp-title
  const t = nodeText.match(/<span class="urppp-title">([^<]*)<\/span>/);
  if (t && t[1]) return t[1].trim();
  return '';
}

/** 复制文本到剪贴板（含降级：execCommand 与 GM 无法访问时不抛错） */
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (_) {
    return false;
  }
}

/** 收集某个课程节点 li 的课程信息（code + name） */
function readCourseInfo(li) {
  const a = li.querySelector(':scope > a');
  if (!a) return null;
  const nodeName = a.querySelector('span.node_name') || a;
  const text = nodeName.textContent || '';
  const code = extractCourseCodeFromNode(a);
  const name = extractCourseName(text, a);
  return { code, name, text };
}

/** 判断节点是否为课程叶子（带课程号，非课组/子组标题） */
function isCourseLeaf(li) {
  const a = li && li.querySelector(':scope > a');
  if (!a) return false;
  const sw = li.querySelector(':scope > span.button.switch');
  if (sw && /_docu\b/.test(sw.className)) return true;
  return !!extractCourseCodeFromNode(a);
}

/** 展开某课程节点的所有祖先链（逐级 point 尚未展开的 switch） */
async function expandAncestors(li, tree) {
  if (tree) {
    // 标记用户已主动展开：让 beautify 的自动折叠不再触发（见 expandKzByRule 语义）
    tree.dataset.urpppUserExpanded = '1';
  }
  const chain = [];
  let cur = li ? li.parentElement : null;
  while (cur && cur !== document.body) {
    if (cur.classList && (cur.classList.contains('level0') || cur.classList.contains('level1'))) {
      const sw = cur.querySelector(':scope > span.button.switch');
      // 折叠（_close）需要点击展开；_open 已展开跳过。仅在 switch 不在 _docu（叶子）时操作。
      if (sw && /_close\b/.test(sw.className) && !/_docu\b/.test(sw.className)) {
        chain.push(sw);
      }
    }
    cur = cur.parentElement;
  }
  // 自顶向下展开：先展开最外层课组，再往里
  for (const sw of chain) {
    if (tree && tree.dataset.urpppBusy === '1') {
      // 若树正被美化任务锁定，先放开再点，避免点击被吞
      try { tree.dataset.urpppBusy = '0'; } catch (_) {}
    }
    try { sw.click(); } catch (_) {}
    await new Promise((r) => setTimeout(r, 15));
  }
}

/** 清除所有节点高亮 */
function clearAllHighlights(tree) {
  tree.querySelectorAll('.urppp-search-hit, .urppp-code-highlight, .urppp-code-hit').forEach((n) => {
    n.classList.remove('urppp-search-hit', 'urppp-code-highlight', 'urppp-code-hit');
  });
}

/** 匹配节点：返回是否命中 */
function nodeMatches(info, query) {
  if (!info) return false;
  const q = query.trim().toLowerCase();
  if (!q) return false;
  if (info.code && info.code.toLowerCase().includes(q)) return true;
  if (info.name && info.name.toLowerCase().includes(q)) return true;
  // 兜底：文本全长匹配
  return info.text && info.text.toLowerCase().includes(q);
}

/**
 * 主入口。tree = #treeDemo；header = #two h4.header；scrollCtx = 滚动容器
 */
export function createPlanTreeEnhance({ tree, header, scrollCtx, deps }) {
  if (!tree) return { dispose() {} };
  const toast = deps.toast || (() => {});

  // 1) 课程节点点击复制（委托到 tree，避免重建后丢失）
  if (!tree.dataset.urpppCopyDelegated) {
    tree.dataset.urpppCopyDelegated = '1';
    tree.addEventListener('click', (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      const li = a.closest('li');
      if (!li) return;
      if (!isCourseLeaf(li)) return;
      const info = readCourseInfo(li);
      if (!info || !info.code) return;
      e.preventDefault();
      e.stopPropagation();
      copyText(info.code).then((ok) => {
        toast(ok ? `已复制课程号 ${info.code}` : `复制失败：${info.code}`, ok ? 'ok' : 'warn');
      });
    }, true);
  }

  // 2) header 下方搜索区：输入框 + 查找按钮，触发展开+滚动+高亮
  if (header && !header.dataset.urpppSearchBound) {
    header.dataset.urpppSearchBound = '1';
    const bar = document.createElement('div');
    bar.className = 'urppp-plan-searchbar';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入课程号或课程名';
    input.setAttribute('aria-label', '查找课程');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'urppp-plan-search-btn';
    btn.textContent = '查找';
    const count = document.createElement('span');
    count.className = 'urppp-plan-search-count';
    bar.appendChild(input);
    bar.appendChild(btn);
    bar.appendChild(count);
    // 插到标题/图例与课组操作按钮组之间；同处 header 内 flex-wrap，能同行就同行，挤不下自动换行
    const oper = header.querySelector('.right_top_oper');
    if (oper) {
      header.insertBefore(bar, oper);
    } else {
      header.appendChild(bar);
    }

    const runSearch = async () => {
      const q = input.value.trim();
      clearAllHighlights(tree);
      if (!q) { count.textContent = ''; return; }
      // 收集所有命中课程节点
      const hits = [];
      for (const li of tree.querySelectorAll('li')) {
        if (!isCourseLeaf(li)) continue;
        const info = readCourseInfo(li);
        if (nodeMatches(info, q)) hits.push({ li, info });
      }
      if (!hits.length) {
        count.textContent = '未找到';
        toast(`未找到课程「${q}」`, 'error');
        return;
      }
      count.textContent = `找到 ${hits.length} 门`;
      // 全部展开（命中的祖先链都要可见）
      await Promise.all(hits.map(({ li }) => expandAncestors(li, tree)));
      // 高亮所有命中
      hits.forEach(({ li }) => {
        li.classList.add('urppp-search-hit');
        const codeEl = li.querySelector(':scope > a .urppp-code');
        if (codeEl) codeEl.classList.add('urppp-code-hit');
      });
      // 展开后滚动到第一个命中节点
      const first = hits[0].li;
      await new Promise((r) => setTimeout(r, 60));
      scrollToNode(first, scrollCtx);
      toast('');
    };

    btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); runSearch(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); runSearch(); }
      if (e.key === 'Escape') { input.value = ''; clearAllHighlights(tree); count.textContent = ''; }
    });
  }

  // 3) header 常驻（sticky）
  if (header && scrollCtx && !header.dataset.urpppStickyBound) {
    header.dataset.urpppStickyBound = '1';
    const makeSticky = () => {
      header.classList.add('urppp-plan-sticky');
      const st = getComputedStyle(scrollCtx);
      if (st.position === 'static' || st.position === '') {
        scrollCtx.style.position = 'relative';
      }
    };
    makeSticky();
    // header 可能被父级 JS 重建替换，用 MutationObserver 兜底重挂 sticky
    if (!header.dataset.urpppStickyObsBound) {
      header.dataset.urpppStickyObsBound = '1';
      if (window.__urpppPlanStickyObs) { try { window.__urpppPlanStickyObs.disconnect(); } catch (_) {} }
      const target = scrollCtx || document.getElementById('tree_div') || document.getElementById('treeDemo');
      window.__urpppPlanStickyObs = new MutationObserver(() => {
        const h = document.querySelector('#two h4.header, #two .header');
        if (h && !h.classList.contains('urppp-plan-sticky')) h.classList.add('urppp-plan-sticky');
      });
      if (target) window.__urpppPlanStickyObs.observe(target, { childList: true, subtree: true });
    }
  }

  return {
    dispose() {
      clearAllHighlights(tree);
    },
  };
}

/** 滚动容器内把命中节点滚到可见位置（居中） */
function scrollToNode(li, scrollCtx) {
  if (!li) return;
  try {
    if (typeof li.scrollIntoView === 'function') {
      li.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      return;
    }
  } catch (_) { /* fall through */ }
  // 手动：定位滚动容器并计算偏移
  if (scrollCtx) {
    const liRect = li.getBoundingClientRect();
    const cRect = scrollCtx.getBoundingClientRect();
    scrollCtx.scrollTop += (liRect.top - cRect.top) - (cRect.height / 2) + (liRect.height / 2);
  }
}
