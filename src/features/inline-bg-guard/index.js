/**
 * @file 站点自己写下的内联底色，插件不再覆盖。
 *
 * 教务系统大量用「单元格内联背景色」表达语义：选课页的时间筛选器靠它标出
 * 已占用 / 空闲（空闲那格是浅灰，正好落在清理浅色与 editorial transparent
 * 的射程里），把它抹掉之后整片只剩一种颜色，看上去就像没有数据。
 *
 * 「先定位是哪块区域」这条路已经试过两次，站点的容器 id 与表 id 都不固定，
 * 认错一次就等于什么也没做。所以这里不认区域，只认事实：元素上已经写了
 * 内联底色，就把它提权到 !important。内联 !important 是唯一能压过样式表
 * !important 的通道（已实测），提权之后无论主题、皮肤、暗色规则怎么写，
 * 都盖不掉站点自己写下的值；站点动态重写或清掉时跟着走，不留残留。
 *
 * 例外是周课表（#mycoursetable）：那里的 rgba 底色由 applyCourseTableOpacity
 * 按设计改写成半透明，锁住就把这个特性废了。
 */

const SKIP_ANCESTOR = '#mycoursetable';
// 只有写了底色的元素才需要处理，用属性子串选择器当过滤器
const CANDIDATE_SELECTOR = '[style*="background"]';
// 记下「上一次被我们提权过的值」，用来辨认哪些写入是自己的，避免自激
const LOCKED = new WeakMap();

export function isLockedInlineBg(element) {
  return !!element && LOCKED.has(element);
}

function lockElement(element) {
  if (!element.style) return;
  if (element.closest && element.closest(SKIP_ANCESTOR)) return;
  const value = element.style.getPropertyValue('background-color');
  if (value === (LOCKED.get(element) || '')) return;
  if (!value) {
    // 站点自己清掉的，跟着放开
    element.style.removeProperty('background-color');
    LOCKED.delete(element);
    return;
  }
  element.style.setProperty('background-color', value, 'important');
  LOCKED.set(element, value);
}

export function startInlineBgGuard({
  doc = document,
  win = window,
  MutationObserverRef = MutationObserver,
} = {}) {
  if (win.__urpppInlineBgGuard) return;
  const root = doc.documentElement;
  if (!root) {
    // document-start 时可能还没有 <html>；等 DOM 起来再装
    doc.addEventListener('DOMContentLoaded', () => startInlineBgGuard({ doc, win, MutationObserverRef }), { once: true });
    return;
  }
  win.__urpppInlineBgGuard = true;

  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.matches && node.matches(CANDIDATE_SELECTOR)) lockElement(node);
    node.querySelectorAll(CANDIDATE_SELECTOR).forEach(lockElement);
  }

  scan(root);

  // 观察 documentElement 而不是 body：路由替换 body 后仍然生效
  new MutationObserverRef((records) => {
    for (const record of records) {
      if (record.type === 'attributes') {
        lockElement(record.target);
        continue;
      }
      for (const node of record.addedNodes) scan(node);
    }
    // 站点可能只改 class 让某条 CSS 生效，这里不再复查，由 style 变更触发
  }).observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style'],
  });
}
