/**
 * @file 培养方案查增强（plan-enhance）
 * @author ma
 * @date 2026-09-01
 * @version 1.0.0
 *
 * 针对 /student/integratedQuery/planCompletion/getPyfaIndex/ 页面：
 *  1) 点击课程节点复制课程号
 *  2) header 搜索框：按课程号/课程名检索，命中自动展开祖先链并高亮
 *  3) header 常驻（sticky，不随滚动容器滚出视口）
 *
 * 依赖 zTree 骨架（#treeDemo），与 beautifyPlanTree 共建，两者互不干扰：
 * 本模块只读课程号/课程名文本 + 操作 zTree 的展开/高亮，不改节点 HTML。
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
  tree.querySelectorAll('.urppp-search-hit').forEach((n) => n.classList.remove('urppp-search-hit'));
  tree.querySelectorAll('.urppp-code-highlight').forEach((n) => n.classList.remove('urppp-code-highlight', 'urppp-code-hit'));
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
 * 主入口。treeHost = #tree_div 或 #treeDemo；headerHost = header 元素
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
      const info = readCourseInfo(li);
      if (!info || !info.code) return;
      // 只在课程叶子节点上拦截（防止与课组标题展开冲突）
      const sw = li.querySelector(':scope > span.button.switch');
      const isLeaf = sw && /_docu\b/.test(sw.className);
      if (!isLeaf) return;
      e.preventDefault();
      e.stopPropagation();
      copyText(info.code).then((ok) => {
        toast(ok ? `已复制课程号 ${info.code}` : `复制失败：${info.code}`, ok ? 'ok' : 'warn');
      });
    }, true);
  }

  // 2) header 搜索框
  if (header && !header.dataset.urpppSearchBound) {
    header.dataset.urpppSearchBound = '1';
    const wrap = document.createElement('div');
    wrap.className = 'urppp-plan-search';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '搜课程号或课程名…';
    input.setAttribute('aria-label', '搜索课程');
    const count = document.createElement('span');
    count.className = 'urppp-plan-search-count';
    wrap.appendChild(input);
    wrap.appendChild(count);
    // 插到操作按钮组之前，避免被挤到最右、与按钮贴太近
    const oper = header.querySelector('.right_top_oper');
    if (oper) {
      header.insertBefore(wrap, oper);
    } else {
      header.appendChild(wrap);
    }

    let prevKey = '';
    const runSearch = () => {
      const q = input.value.trim();
      if (q === prevKey) return;
      prevKey = q;
      clearAllHighlights(tree);
      if (!q) { count.textContent = ''; return; }
      const nodes = Array.from(tree.querySelectorAll('li'));
      let hit = 0;
      for (const li of nodes) {
        const info = readCourseInfo(li);
        if (!info) continue;
        if (nodeMatches(info, q)) {
          hit++;
          li.classList.add('urppp-search-hit');
          const codeEl = li.querySelector(':scope > a .urppp-code');
          if (codeEl) codeEl.classList.add('urppp-code-hit');
          // 展开祖先链让命中节点可见
          expandAncestors(li, tree);
        }
      }
      count.textContent = hit ? `${hit} 门` : '未找到';
    };

    let debounce = 0;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(runSearch, 120);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); runSearch(); }
      if (e.key === 'Escape') { input.value = ''; runSearch(); }
    });
  }

  // 3) header 常驻：把滚动容器设为 sticky 上下文
  if (header && scrollCtx && !header.dataset.urpppStickyBound) {
    header.dataset.urpppStickyBound = '1';
    // 某些 zTree 重建会替换 header，用 MutationObserver 兜底重挂
    const makeSticky = () => {
      header.classList.add('urppp-plan-sticky');
      if (scrollCtx) {
        // 保持滚动容器自身定位上下文
        const st = getComputedStyle(scrollCtx);
        // 已是 auto/scroll 才接管；若原本 static，设相对不破坏布局
        if (st.position === 'static' || st.position === '') {
          scrollCtx.style.position = 'relative';
        }
      }
    };
    makeSticky();
  }

  return {
    dispose() {
      clearAllHighlights(tree);
    },
  };
}
